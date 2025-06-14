import { useState, useCallback } from 'react';
import { usePolicies, type DatabasePolicy } from './usePolicies';
import { useToast } from '@/components/ui/use-toast';
import html2pdf from 'html2pdf.js';

export interface PolicyTemplate {
  id: string;
  title: string;
  description: string;
  content: string;
  type: string;
  category: 'Technical Control' | 'Physical Control' | 'Organizational Control' | 'Administrative Control';
}

export interface SearchFilters {
  tags: string[];
  type: string;
  status: string;
}

export interface PolicyData {
  policy_id: string;
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
  author: string;
  content: string;
  currentVersion: string;
  tags: string[];
  versions: any[];
  framework_category: string;
  security_domain: string;
}

export function usePolicyRepository() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { 
    policies,
    loading,
    createPolicy,
    updatePolicy,
    deletePolicy,
    searchPolicies: searchPoliciesDb,
    getPolicyVersions,
    getAllTags,
    downloadPolicyAsJson,
    refreshPolicies
  } = usePolicies();

  const createPolicyFromTemplate = async (template: PolicyTemplate) => {
    try {
      await createPolicy({
        title: template.title,
        description: template.description,
        content: template.content,
        type: template.type,
        status: 'draft',
      });

      toast({
        title: "Success",
        description: "Policy created from template successfully",
      });
    } catch (error) {
      console.error('Error creating policy from template:', error);
      toast({
        title: "Error",
        description: "Failed to create policy from template",
        variant: "destructive",
      });
    }
  };

  const updatePolicyWithTemplate = async (policyId: string, template: PolicyTemplate) => {
    try {
      await updatePolicy(policyId, {
        title: template.title,
        description: template.description,
        content: template.content,
        type: template.type,
      });

      toast({
        title: "Success",
        description: "Policy updated with template successfully",
      });
    } catch (error) {
      console.error('Error updating policy with template:', error);
      toast({
        title: "Error",
        description: "Failed to update policy with template",
        variant: "destructive",
      });
    }
  };

  const searchPolicies = async (
    searchQuery: string = '',
    filterTags: string[] = [],
    filterType: string = '',
    filterStatus: string = ''
  ) => {
    try {
      const results = await searchPoliciesDb(
        searchQuery,
        filterTags,
        filterType,
        filterStatus
      );
      return results;
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search policies. Please try again.",
        variant: "destructive",
      });
      return [];
    }
  };

  const transformedPolicies = policies.map(policy => ({
    policy_id: policy.id,
    id: policy.id,
    title: policy.title,
    description: policy.description || "",
    type: policy.type,
    status: policy.status,
    created_at: policy.created_at,
    updated_at: policy.updated_at,
    author: policy.author,
    content: policy.content || "Content not available yet.",
    currentVersion: policy.version.toString(),
    tags: policy.tags || [],
    versions: [],
    framework_category: policy.category === 'Technical Control' ? 'technical' : 
                       policy.category === 'Physical Control' ? 'physical' : 
                       policy.category === 'Organizational Control' ? 'organizational' :
                       'organizational',
    security_domain: policy.type,
  }));

  const downloadPolicyAsPdf = useCallback(async (policy: PolicyData | DatabasePolicy) => {
    try {
      setIsLoading(true);
      
      console.log('=== PDF GENERATION START ===');
      console.log('Policy object:', policy);
      
      // Extract data safely
      const title = policy.title || 'Untitled Policy';
      const description = policy.description || 'No description available';
      const content = ('content' in policy ? policy.content : '') || 'No content available';
      const version = 'currentVersion' in policy ? policy.currentVersion : policy.version?.toString() || '1.0';
      const status = policy.status || 'draft';
      const author = policy.author || 'Unknown Author';
      const type = policy.type || 'General';
      
      console.log('Extracted data:', { title, content: content.substring(0, 100) + '...' });
      
      // Create very simple HTML without complex styling
      const htmlContent = `
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial; margin: 20px; }
              h1 { color: #000; }
              .info { margin: 10px 0; }
              .content { margin-top: 20px; padding: 10px; border: 1px solid #ccc; }
            </style>
          </head>
          <body>
            <h1>${title}</h1>
            <div class="info">Version: ${version}</div>
            <div class="info">Status: ${status}</div>
            <div class="info">Author: ${author}</div>
            <div class="info">Type: ${type}</div>
            <div class="info">Description: ${description}</div>
            <div class="content">
              <h2>Content</h2>
              <p>${content.replace(/\n/g, '<br>')}</p>
            </div>
          </body>
        </html>
      `;
      
      console.log('HTML generated, length:', htmlContent.length);
      
      // Use simpler options
      const element = document.createElement('div');
      element.innerHTML = htmlContent;
      
      const opt = {
        margin: 1,
        filename: `${title.replace(/[^a-z0-9]/gi, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      
      console.log('Starting PDF generation with options:', opt);
      
      // Generate PDF
      await html2pdf().set(opt).from(element).save();
      
      console.log('PDF generation completed successfully');
      
      toast({
        title: "Success",
        description: `Policy "${title}" downloaded as PDF`,
      });
      
    } catch (error) {
      console.error('PDF Generation Error:', error);
      console.error('Error details:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name
      });
      
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    // Data
    policies: transformedPolicies,
    loading: loading || isLoading,
    
    // Policy Management
    createPolicy,
    updatePolicy,
    deletePolicy,
    
    // Template Operations
    createPolicyFromTemplate,
    updatePolicyWithTemplate,
    
    // Search and Filtering
    searchPolicies,
    
    // Download Operations
    downloadPolicyAsJson,
    downloadPolicyAsPdf,
    
    // Utility
    refreshPolicies,
    getPolicyVersions,
    getAllTags,
  };
}
