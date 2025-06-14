
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
                       'organizational', // fallback for Organizational Control
    security_domain: policy.type,
  }));

  const downloadPolicyAsPdf = useCallback(async (policy: PolicyData | DatabasePolicy) => {
    try {
      setIsLoading(true);
      
      console.log('Starting PDF generation for policy:', policy.title);
      console.log('Policy data:', policy);
      
      // Ensure we have the required data
      const title = policy.title || 'Untitled Policy';
      const description = policy.description || 'No description available';
      const content = policy.content || 'No content available';
      const version = 'currentVersion' in policy ? policy.currentVersion : policy.version?.toString() || '1.0';
      const status = policy.status || 'draft';
      const author = policy.author || 'Unknown';
      const type = policy.type || 'General';
      const tags = policy.tags || [];
      const createdDate = new Date(policy.created_at).toLocaleDateString();
      const updatedDate = new Date(policy.updated_at).toLocaleDateString();
      
      // Determine category
      let category = 'organizational';
      if ('framework_category' in policy) {
        category = policy.framework_category;
      } else if (policy.category) {
        category = policy.category === 'Technical Control' ? 'technical' : 
                  policy.category === 'Physical Control' ? 'physical' : 
                  policy.category === 'Organizational Control' ? 'organizational' : 'organizational';
      }
      
      console.log('Processed data for PDF:', {
        title, description, content: content.substring(0, 100) + '...', 
        version, status, author, type, category, tags
      });
      
      // Create HTML content for PDF
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
              color: #333; 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 20px; 
            }
            .header { 
              text-align: center; 
              margin-bottom: 40px; 
              border-bottom: 3px solid #333; 
              padding-bottom: 20px; 
            }
            .header h1 { 
              color: #333; 
              margin: 0; 
              font-size: 24px; 
            }
            .header .subtitle { 
              color: #666; 
              margin: 10px 0; 
              font-size: 14px; 
            }
            .info-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0; 
            }
            .info-table td { 
              padding: 8px 12px; 
              border: 1px solid #ddd; 
            }
            .info-table .label { 
              background-color: #f5f5f5; 
              font-weight: bold; 
              width: 25%; 
            }
            .section { 
              margin: 30px 0; 
            }
            .section h2 { 
              color: #444; 
              border-bottom: 2px solid #ddd; 
              padding-bottom: 10px; 
              font-size: 18px; 
            }
            .content-box { 
              background: #f9f9f9; 
              padding: 20px; 
              border-left: 4px solid #2196f3; 
              margin: 15px 0; 
              white-space: pre-wrap; 
              word-wrap: break-word; 
            }
            .tags { 
              margin: 10px 0; 
            }
            .tag { 
              background: #e3f2fd; 
              padding: 4px 8px; 
              border-radius: 4px; 
              margin-right: 5px; 
              font-size: 12px; 
              display: inline-block; 
            }
            .footer { 
              margin-top: 40px; 
              padding-top: 20px; 
              border-top: 1px solid #ddd; 
              font-size: 12px; 
              color: #666; 
              text-align: center; 
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${title}</h1>
            <div class="subtitle">Security Policy Document - Version ${version}</div>
            <div class="subtitle">Status: ${status.toUpperCase()}</div>
          </div>
          
          <div class="section">
            <h2>Policy Information</h2>
            <table class="info-table">
              <tr>
                <td class="label">Policy ID</td>
                <td>${'policy_id' in policy ? policy.policy_id : policy.id}</td>
              </tr>
              <tr>
                <td class="label">Title</td>
                <td>${title}</td>
              </tr>
              <tr>
                <td class="label">Type</td>
                <td>${type}</td>
              </tr>
              <tr>
                <td class="label">Category</td>
                <td>${category}</td>
              </tr>
              <tr>
                <td class="label">Status</td>
                <td>${status}</td>
              </tr>
              <tr>
                <td class="label">Version</td>
                <td>${version}</td>
              </tr>
              <tr>
                <td class="label">Author</td>
                <td>${author}</td>
              </tr>
              <tr>
                <td class="label">Created</td>
                <td>${createdDate}</td>
              </tr>
              <tr>
                <td class="label">Last Updated</td>
                <td>${updatedDate}</td>
              </tr>
            </table>
          </div>
          
          ${description && description !== 'No description available' ? `
          <div class="section">
            <h2>Description</h2>
            <div class="content-box">${description}</div>
          </div>
          ` : ''}
          
          <div class="section">
            <h2>Policy Content</h2>
            <div class="content-box">${content}</div>
          </div>
          
          ${tags && tags.length > 0 ? `
          <div class="section">
            <h2>Tags</h2>
            <div class="tags">
              ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
          </div>
          ` : ''}
          
          <div class="footer">
            <div>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
            <div>Information Security Policy Repository</div>
          </div>
        </body>
        </html>
      `;

      console.log('HTML content created, length:', htmlContent.length);

      const filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_v${version}.pdf`;
      
      const options = {
        margin: [15, 15, 15, 15],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 1.5,
          useCORS: true,
          letterRendering: true,
          allowTaint: false
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          putOnlyUsedFonts: true,
          floatPrecision: 16
        }
      };

      console.log('Starting PDF generation with options:', options);

      await html2pdf().set(options).from(htmlContent).save();
      
      console.log('PDF generation completed successfully');
      
      toast({
        title: "Success",
        description: `Policy "${title}" downloaded as PDF successfully`,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
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
