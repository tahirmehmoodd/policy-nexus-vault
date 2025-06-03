
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
  author: string;
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
      console.log('Starting policy creation with data:', policyData);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      console.log('User authenticated:', user.id);

      const categoryMapping: Record<string, 'Technical Control' | 'Physical Control' | 'Organizational Control' | 'Administrative Control'> = {
        'Access Control': 'Technical Control',
        'Data Classification': 'Technical Control',
        'Network Security': 'Technical Control',
        'Incident Management': 'Organizational Control',
        'Asset Management': 'Physical Control',
        'Business Continuity': 'Organizational Control',
        'Acceptable Use': 'Organizational Control',
        'Information Security': 'Organizational Control',
      };

      const category = categoryMapping[policyData.type] || 'Technical Control';
      
      const insertData = {
        title: policyData.title,
        description: policyData.description || null,
        content: policyData.content,
        type: policyData.type,
        category: category,
        tags: policyData.tags || [],
        status: policyData.status || 'draft',
        created_by: user.id,
        updated_by: user.id,
        author: user.email || 'Unknown',
      };

      console.log('Insert data prepared:', insertData);

      const { data, error } = await supabase
        .from('policies')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      console.log('Policy created successfully:', data);

      // Create policy text entry
      try {
        await supabase
          .from('policy_texts')
          .insert({
            policy_id: data.id,
            content: policyData.content,
          });
      } catch (textError) {
        console.error('Error creating policy text:', textError);
      }

      // Create initial version
      try {
        await supabase
          .from('versions')
          .insert({
            policy_id: data.id,
            version_label: 'v1.0',
            description: 'Initial version',
            edited_by: user.email || 'Unknown',
          });
      } catch (versionError) {
        console.error('Error creating initial version:', versionError);
      }

      // Handle tags
      if (policyData.tags && policyData.tags.length > 0) {
        try {
          await handlePolicyTags(data.id, policyData.tags);
        } catch (tagError) {
          console.error('Error handling tags:', tagError);
        }
      }

      await fetchPolicies();
      
      toast({
        title: "Success",
        description: "Policy created successfully",
      });

      return data;
    } catch (error: any) {
      console.error('Error creating policy:', error);
      
      let errorMessage = 'Failed to create policy';
      
      if (error.message?.includes('authentication') || error.message?.includes('authenticated')) {
        errorMessage = 'You must be logged in to create policies';
      } else if (error.code === 'PGRST116') {
        errorMessage = 'Permission denied. Please check your authentication status.';
      } else if (error.message?.includes('row-level security')) {
        errorMessage = 'You do not have permission to create policies';
      } else if (error.details) {
        errorMessage = `Database error: ${error.details}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  };

  const updatePolicy = async (
    policyId: string,
    updates: Partial<DatabasePolicy>,
    changeDescription?: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      console.log('Updating policy:', policyId, 'with data:', updates);

      const { data: currentPolicy, error: fetchError } = await supabase
        .from('policies')
        .select('*')
        .eq('id', policyId)
        .single();

      if (fetchError) throw fetchError;

      let updateData = { ...updates };
      if (updates.type) {
        const categoryMapping: Record<string, 'Technical Control' | 'Physical Control' | 'Organizational Control' | 'Administrative Control'> = {
          'Access Control': 'Technical Control',
          'Data Classification': 'Technical Control',
          'Network Security': 'Technical Control',
          'Incident Management': 'Organizational Control',
          'Asset Management': 'Physical Control',
          'Business Continuity': 'Organizational Control',
          'Acceptable Use': 'Organizational Control',
          'Information Security': 'Organizational Control',
        };
        updateData.category = categoryMapping[updates.type] || 'Technical Control';
      }

      const currentVersionNum = Number(currentPolicy.version);
      const newVersionNum = currentVersionNum + 0.1;
      const newVersion = Number(newVersionNum.toFixed(1));

      const { data, error } = await supabase
        .from('policies')
        .update({
          ...updateData,
          updated_by: user.id,
          version: newVersion,
        })
        .eq('id', policyId)
        .select()
        .single();

      if (error) throw error;

      console.log('Policy updated successfully:', data);

      // Update policy text if content changed
      if (updates.content) {
        await supabase
          .from('policy_texts')
          .upsert({
            policy_id: policyId,
            content: updates.content,
          });
      }

      // Create new version entry
      await supabase
        .from('versions')
        .insert({
          policy_id: policyId,
          version_label: `v${newVersion.toFixed(1)}`,
          description: changeDescription || 'Policy updated',
          edited_by: user.email || 'Unknown',
        });

      // Handle tags if provided
      if (updates.tags) {
        try {
          await handlePolicyTags(policyId, updates.tags);
        } catch (tagError) {
          console.error('Error updating tags:', tagError);
        }
      }

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
      
      toast({
        title: "Success",
        description: "Policy deleted successfully",
      });
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

      await supabase
        .from('policy_tags')
        .delete()
        .eq('policy_id', policyId);

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

  const downloadPolicyAsJson = (policy: DatabasePolicy) => {
    const policyData = {
      id: policy.id,
      title: policy.title,
      description: policy.description,
      content: policy.content,
      type: policy.type,
      category: policy.category,
      status: policy.status,
      tags: policy.tags,
      version: policy.version,
      author: policy.author,
      created_at: policy.created_at,
      updated_at: policy.updated_at,
    };

    const dataStr = JSON.stringify(policyData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${policy.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_v${policy.version}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const convertXmlToPolicy = (xmlContent: string) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
      
      const title = xmlDoc.getElementsByTagName("title")[0]?.textContent || "Untitled Policy";
      const description = xmlDoc.getElementsByTagName("description")[0]?.textContent || "";
      const type = xmlDoc.getElementsByTagName("type")[0]?.textContent || "Information Security";
      const content = xmlDoc.getElementsByTagName("content")[0]?.textContent || xmlContent;
      const tagsElements = xmlDoc.getElementsByTagName("tag");
      
      const tags: string[] = [];
      for (let i = 0; i < tagsElements.length; i++) {
        const tag = tagsElements[i].textContent;
        if (tag) tags.push(tag);
      }
      
      return {
        title,
        description,
        type,
        content,
        tags,
      };
    } catch (error) {
      console.error("Error parsing XML:", error);
      toast({
        title: "XML Parse Error",
        description: "Could not parse the XML file. Using raw content instead.",
        variant: "destructive",
      });
      
      return {
        title: "Imported XML Policy",
        description: "Policy imported from XML file",
        type: "Information Security",
        content: xmlContent,
        tags: ["XML Import"],
      };
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
    downloadPolicyAsJson,
    convertXmlToPolicy,
    refreshPolicies: fetchPolicies,
  };
}
