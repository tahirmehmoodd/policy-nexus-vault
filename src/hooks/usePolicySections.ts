import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { splitPolicyIntoSections, PolicySection, autoTagSection } from '@/utils/sectionSplitter';

export interface DatabasePolicySection {
  section_id: string;
  policy_id: string;
  section_number: number;
  section_title: string;
  section_content: string;
  compliance_tags: any;
  created_at: string;
  updated_at: string;
}

export function usePolicySections() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  /**
   * Create sections for a policy
   */
  const createPolicySections = async (policyId: string, content: string) => {
    try {
      setLoading(true);
      
      // Split content into sections
      const sections = splitPolicyIntoSections(content);
      
      if (sections.length === 0) {
        console.log('No sections to create');
        return;
      }
      
      console.log(`Creating ${sections.length} sections for policy ${policyId}`);
      
      // Fetch compliance frameworks for auto-tagging
      const { data: frameworks } = await supabase
        .from('compliance_frameworks')
        .select('*');
      
      // Create sections with auto-tagging
      const sectionsToInsert = await Promise.all(
        sections.map(async (section) => {
          const tags = frameworks 
            ? await autoTagSection(section.section_content, frameworks)
            : [];
          
          return {
            policy_id: policyId,
            section_number: section.section_number,
            section_title: section.section_title,
            section_content: section.section_content,
            compliance_tags: tags
          };
        })
      );
      
      const { data, error } = await supabase
        .from('policy_sections')
        .insert(sectionsToInsert)
        .select();
      
      if (error) throw error;
      
      console.log(`Created ${data?.length} sections successfully`);
      return data;
    } catch (error) {
      console.error('Error creating policy sections:', error);
      toast({
        title: "Error",
        description: "Failed to create policy sections",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get sections for a policy
   */
  const getPolicySections = async (policyId: string): Promise<DatabasePolicySection[]> => {
    try {
      const { data, error } = await supabase
        .from('policy_sections')
        .select('*')
        .eq('policy_id', policyId)
        .order('section_number', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching policy sections:', error);
      toast({
        title: "Error",
        description: "Failed to fetch policy sections",
        variant: "destructive",
      });
      return [];
    }
  };

  /**
   * Update a section
   */
  const updatePolicySection = async (sectionId: string, updates: Partial<DatabasePolicySection>) => {
    try {
      const { data, error } = await supabase
        .from('policy_sections')
        .update(updates)
        .eq('section_id', sectionId)
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Section updated successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error updating section:', error);
      toast({
        title: "Error",
        description: "Failed to update section",
        variant: "destructive",
      });
      throw error;
    }
  };

  /**
   * Delete sections for a policy
   */
  const deletePolicySections = async (policyId: string) => {
    try {
      const { error } = await supabase
        .from('policy_sections')
        .delete()
        .eq('policy_id', policyId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting policy sections:', error);
      throw error;
    }
  };

  return {
    loading,
    createPolicySections,
    getPolicySections,
    updatePolicySection,
    deletePolicySections
  };
}
