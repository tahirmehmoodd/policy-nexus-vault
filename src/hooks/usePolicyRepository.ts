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
      
      console.log('=== PDF DEBUG START ===');
      console.log('Policy object received:', policy);
      console.log('Policy keys:', Object.keys(policy));
      console.log('Policy title:', policy.title);
      console.log('Policy content length:', policy.content?.length || 0);
      console.log('Policy content preview:', policy.content?.substring(0, 100));
      
      // Extract data with better fallbacks
      const title = policy.title || 'Untitled Policy';
      const description = policy.description || '';
      const content = policy.content || 'No content available';
      const version = 'currentVersion' in policy ? policy.currentVersion : policy.version?.toString() || '1.0';
      const status = policy.status || 'draft';
      const author = policy.author || 'Unknown';
      const type = policy.type || 'General';
      const tags = policy.tags || [];
      const policyId = 'policy_id' in policy ? policy.policy_id : policy.id;
      
      console.log('Extracted data:', {
        title,
        description: description.substring(0, 50),
        content: content.substring(0, 50),
        version,
        status,
        author,
        type,
        policyId,
        tagsCount: tags.length
      });

      // Create a simple, working HTML structure
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              margin: 20px; 
              color: #333; 
            }
            .header { 
              text-align: center; 
              border-bottom: 2px solid #333; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
            }
            .content { 
              margin: 20px 0; 
              white-space: pre-wrap; 
            }
            .info-row { 
              margin: 10px 0; 
            }
            .label { 
              font-weight: bold; 
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${title}</h1>
            <p>Version ${version} - ${status.toUpperCase()}</p>
          </div>
          
          <div class="info-row">
            <span class="label">Policy ID:</span> ${policyId}
          </div>
          <div class="info-row">
            <span class="label">Author:</span> ${author}
          </div>
          <div class="info-row">
            <span class="label">Type:</span> ${type}
          </div>
          
          ${description ? `
          <div class="info-row">
            <span class="label">Description:</span>
            <div>${description}</div>
          </div>
          ` : ''}
          
          <div class="info-row">
            <span class="label">Content:</span>
            <div class="content">${content}</div>
          </div>
          
          ${tags.length > 0 ? `
          <div class="info-row">
            <span class="label">Tags:</span> ${tags.join(', ')}
          </div>
          ` : ''}
        </body>
        </html>
      `;

      console.log('HTML content created, length:', htmlContent.length);
      console.log('HTML preview:', htmlContent.substring(0, 500));

      const filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_v${version}.pdf`;
      
      console.log('Starting PDF generation with filename:', filename);
      
      const options = {
        margin: 10,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 1,
          logging: true,
          useCORS: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait'
        }
      };

      await html2pdf().set(options).from(htmlContent).save();
      
      console.log('PDF generation completed successfully');
      console.log('=== PDF DEBUG END ===');
      
      toast({
        title: "Success",
        description: `Policy "${title}" downloaded as PDF successfully`,
      });
    } catch (error) {
      console.error('=== PDF ERROR ===');
      console.error('Error details:', error);
      console.error('Error stack:', error.stack);
      console.error('=== PDF ERROR END ===');
      
      toast({
        title: "Error",
        description: "Failed to generate PDF. Check console for details.",
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
