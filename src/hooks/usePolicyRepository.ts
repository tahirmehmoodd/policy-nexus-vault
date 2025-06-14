import { useState, useCallback } from 'react';
import { usePolicies, type DatabasePolicy } from './usePolicies';
import { useToast } from '@/components/ui/use-toast';

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
      
      console.log('=== PDF GENERATION START (New Method) ===');
      console.log('Policy object:', policy);
      
      // Extract data safely
      const title = policy.title || 'Untitled Policy';
      const description = policy.description || 'No description available';
      const content = ('content' in policy ? policy.content : '') || 'No content available';
      const version = 'currentVersion' in policy ? policy.currentVersion : policy.version?.toString() || '1.0';
      const status = policy.status || 'draft';
      const author = policy.author || 'Unknown Author';
      const type = policy.type || 'General';
      
      // Create a new window with the policy content
      const printWindow = window.open('', '_blank');
      
      if (!printWindow) {
        throw new Error('Pop-up blocked. Please allow pop-ups for this site to download PDFs.');
      }
      
      // Create clean HTML for printing
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>${title}</title>
            <style>
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 20px;
                color: #333;
              }
              .header {
                border-bottom: 2px solid #333;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .title {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
              }
              .metadata {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                margin-bottom: 20px;
              }
              .metadata-item {
                padding: 5px 0;
              }
              .label {
                font-weight: bold;
                display: inline-block;
                width: 100px;
              }
              .content-section {
                margin-top: 30px;
              }
              .content-title {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 15px;
                border-bottom: 1px solid #ccc;
                padding-bottom: 5px;
              }
              .content-text {
                white-space: pre-wrap;
                background: #f9f9f9;
                padding: 15px;
                border-left: 4px solid #007acc;
                margin: 10px 0;
              }
              .no-print {
                margin: 20px 0;
                padding: 10px;
                background: #e7f3ff;
                border: 1px solid #007acc;
                border-radius: 5px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="title">${title}</div>
              <div class="metadata">
                <div class="metadata-item">
                  <span class="label">Version:</span> ${version}
                </div>
                <div class="metadata-item">
                  <span class="label">Status:</span> ${status}
                </div>
                <div class="metadata-item">
                  <span class="label">Author:</span> ${author}
                </div>
                <div class="metadata-item">
                  <span class="label">Type:</span> ${type}
                </div>
              </div>
              <div class="metadata-item">
                <span class="label">Description:</span> ${description}
              </div>
            </div>
            
            <div class="content-section">
              <div class="content-title">Policy Content</div>
              <div class="content-text">${content}</div>
            </div>
            
            <div class="no-print">
              <p><strong>Instructions:</strong></p>
              <p>1. Use Ctrl+P (or Cmd+P on Mac) to open the print dialog</p>
              <p>2. Select "Save as PDF" as the destination</p>
              <p>3. Choose your preferred settings and save</p>
              <button onclick="window.print()" style="padding: 10px 20px; background: #007acc; color: white; border: none; border-radius: 5px; cursor: pointer;">Print/Save as PDF</button>
              <button onclick="window.close()" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">Close</button>
            </div>
          </body>
        </html>
      `;
      
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Auto-trigger print dialog after a short delay
      setTimeout(() => {
        printWindow.print();
      }, 500);
      
      console.log('PDF generation window opened successfully');
      
      toast({
        title: "PDF Ready",
        description: `Policy "${title}" opened in new window. Use Ctrl+P to save as PDF.`,
      });
      
    } catch (error) {
      console.error('PDF Generation Error:', error);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate PDF. Please try again.",
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
