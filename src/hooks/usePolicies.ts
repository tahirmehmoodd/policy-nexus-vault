
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface DatabasePolicy {
  id: string;
  title: string;
  description: string | null;
  content: string;
  tags: string[] | null;
  type: string;
  version: number;
  status: 'draft' | 'active' | 'archived' | 'under_review';
  file_url: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  author?: string;
  category: 'Technical Control' | 'Physical Control' | 'Organizational Control' | 'Administrative Control';
}

export interface DatabasePolicyText {
  text_id: string;
  policy_id: string;
  content: string;
}

export interface DatabaseVersion {
  version_id: string;
  policy_id: string;
  version_label: string;
  description: string | null;
  created_at: string;
  edited_by: string;
}

export interface DatabaseTag {
  tag_id: string;
  tag_name: string;
}

export function usePolicies() {
  const [policies, setPolicies] = useState<DatabasePolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPolicies = async () => {
    try {
      const { data, error } = await supabase
        .from('policies')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setPolicies(data || []);
    } catch (error) {
      console.error('Error fetching policies:', error);
      toast({
        title: "Error",
        description: "Failed to fetch policies",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const createPolicy = async (policyData: {
    title: string;
    description?: string;
    content: string;
    type: string;
    tags?: string[];
    status?: 'draft' | 'active' | 'archived';
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Map type to category for database insertion
      const categoryMapping: Record<string, 'Technical Control' | 'Physical Control' | 'Organizational Control' | 'Administrative Control'> = {
        'Access Control': 'Technical Control',
        'Data Classification': 'Technical Control',
        'Network Security': 'Technical Control',
        'Incident Management': 'Organizational Control',
        'Asset Management': 'Physical Control',
        'Business Continuity': 'Organizational Control',
      };

      const category = categoryMapping[policyData.type] || 'Technical Control';

      const { data, error } = await supabase
        .from('policies')
        .insert({
          title: policyData.title,
          description: policyData.description,
          content: policyData.content,
          type: policyData.type,
          category: category,
          tags: policyData.tags || [],
          status: policyData.status || 'draft',
          created_by: user.id,
          updated_by: user.id,
          author: user.email || 'Unknown',
        })
        .select()
        .single();

      if (error) throw error;

      // Create policy text entry
      await supabase
        .from('policy_texts')
        .insert({
          policy_id: data.id,
          content: policyData.content,
        });

      // Create initial version
      await supabase
        .from('versions')
        .insert({
          policy_id: data.id,
          version_label: 'v1.0',
          description: 'Initial version',
          edited_by: user.email || 'Unknown',
        });

      // Handle tags
      if (policyData.tags && policyData.tags.length > 0) {
        await handlePolicyTags(data.id, policyData.tags);
      }

      await fetchPolicies();
      return data;
    } catch (error) {
      console.error('Error creating policy:', error);
      toast({
        title: "Error",
        description: "Failed to create policy",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updatePolicy = async (
    policyId: string,
    updates: Partial<DatabasePolicy>
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Map type to category if type is being updated
      let updateData = { ...updates };
      if (updates.type) {
        const categoryMapping: Record<string, 'Technical Control' | 'Physical Control' | 'Organizational Control' | 'Administrative Control'> = {
          'Access Control': 'Technical Control',
          'Data Classification': 'Technical Control',
          'Network Security': 'Technical Control',
          'Incident Management': 'Organizational Control',
          'Asset Management': 'Physical Control',
          'Business Continuity': 'Organizational Control',
        };
        updateData.category = categoryMapping[updates.type] || 'Technical Control';
      }

      const { data, error } = await supabase
        .from('policies')
        .update({
          ...updateData,
          updated_by: user.id,
          version: (updates.version || 1) + 0.1,
        })
        .eq('id', policyId)
        .select()
        .single();

      if (error) throw error;

      // Update policy text if content changed
      if (updates.content) {
        await supabase
          .from('policy_texts')
          .upsert({
            policy_id: policyId,
            content: updates.content,
          });
      }

      // Create new version
      await supabase
        .from('versions')
        .insert({
          policy_id: policyId,
          version_label: `v${data.version}`,
          description: 'Updated policy',
          edited_by: user.email || 'Unknown',
        });

      await fetchPolicies();
      return data;
    } catch (error) {
      console.error('Error updating policy:', error);
      toast({
        title: "Error",
        description: "Failed to update policy",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deletePolicy = async (policyId: string) => {
    try {
      const { error } = await supabase
        .from('policies')
        .delete()
        .eq('id', policyId);

      if (error) throw error;

      await fetchPolicies();
    } catch (error) {
      console.error('Error deleting policy:', error);
      toast({
        title: "Error",
        description: "Failed to delete policy",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handlePolicyTags = async (policyId: string, tagNames: string[]) => {
    try {
      // First, get or create tags
      const tagIds: string[] = [];
      
      for (const tagName of tagNames) {
        const { data: existingTag } = await supabase
          .from('tags')
          .select('tag_id')
          .eq('tag_name', tagName)
          .single();

        if (existingTag) {
          tagIds.push(existingTag.tag_id);
        } else {
          const { data: newTag, error } = await supabase
            .from('tags')
            .insert({ tag_name: tagName })
            .select('tag_id')
            .single();

          if (error) throw error;
          tagIds.push(newTag.tag_id);
        }
      }

      // Remove existing policy-tag relationships
      await supabase
        .from('policy_tags')
        .delete()
        .eq('policy_id', policyId);

      // Create new relationships
      const policyTagInserts = tagIds.map(tagId => ({
        policy_id: policyId,
        tag_id: tagId,
      }));

      if (policyTagInserts.length > 0) {
        await supabase
          .from('policy_tags')
          .insert(policyTagInserts);
      }
    } catch (error) {
      console.error('Error handling policy tags:', error);
      throw error;
    }
  };

  const searchPolicies = async (
    searchQuery: string = '',
    filterTags: string[] = [],
    filterType: string = '',
    filterStatus: string = ''
  ) => {
    try {
      const { data, error } = await supabase.rpc('search_policies_enhanced', {
        search_query: searchQuery,
        filter_tags: filterTags,
        filter_type: filterType,
        filter_status: filterStatus,
      });

      if (error) throw error;

      // Log the search
      await supabase.rpc('log_search', {
        search_query_param: searchQuery,
        search_filters_param: {
          tags: filterTags,
          type: filterType,
          status: filterStatus,
        },
        results_count_param: data?.length || 0,
      });

      return data || [];
    } catch (error) {
      console.error('Error searching policies:', error);
      toast({
        title: "Error",
        description: "Failed to search policies",
        variant: "destructive",
      });
      return [];
    }
  };

  const getPolicyVersions = async (policyId: string) => {
    try {
      const { data, error } = await supabase
        .from('versions')
        .select('*')
        .eq('policy_id', policyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching policy versions:', error);
      return [];
    }
  };

  const getAllTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('tag_name')
        .order('tag_name');

      if (error) throw error;
      return data?.map(tag => tag.tag_name) || [];
    } catch (error) {
      console.error('Error fetching tags:', error);
      return [];
    }
  };

  return {
    policies,
    loading,
    createPolicy,
    updatePolicy,
    deletePolicy,
    searchPolicies,
    getPolicyVersions,
    getAllTags,
    refreshPolicies: fetchPolicies,
  };
}
