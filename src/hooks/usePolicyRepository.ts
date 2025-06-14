
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
      
      console.log('=== PDF GENERATION DEBUG ===');
      console.log('Raw policy object:', policy);
      
      // Extract content with better error handling
      let content = '';
      if ('content' in policy && policy.content) {
        content = policy.content;
      } else if ('content' in policy && !policy.content) {
        content = 'No content available for this policy.';
      } else {
        content = 'Content not found.';
      }
      
      console.log('Extracted content length:', content.length);
      console.log('Content preview:', content.substring(0, 200));
      
      const title = policy.title || 'Untitled Policy';
      const description = policy.description || 'No description available';
      const version = 'currentVersion' in policy ? policy.currentVersion : policy.version?.toString() || '1.0';
      const status = policy.status || 'draft';
      const author = policy.author || 'Unknown Author';
      const type = policy.type || 'General';
      const policyId = 'policy_id' in policy ? policy.policy_id : policy.id;
      
      console.log('PDF Data:', { title, version, status, author, type, policyId });
      
      // Create simplified HTML with inline styles
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; }
    body { 
      font-family: Arial, sans-serif; 
      line-height: 1.5; 
      margin: 20px; 
      color: #000;
      background: white;
    }
    .header { 
      text-align: center; 
      border-bottom: 2px solid #000; 
      padding-bottom: 15px; 
      margin-bottom: 20px; 
    }
    .title { 
      font-size: 24px; 
      font-weight: bold; 
      margin: 0 0 10px 0; 
    }
    .subtitle { 
      font-size: 14px; 
      color: #666; 
      margin: 0; 
    }
    .info { 
      margin: 15px 0; 
      font-size: 12px; 
    }
    .label { 
      font-weight: bold; 
      display: inline-block; 
      width: 100px; 
    }
    .content-section { 
      margin-top: 20px; 
      padding: 15px; 
      border: 1px solid #ddd; 
      background: #f9f9f9; 
    }
    .content-title { 
      font-weight: bold; 
      font-size: 16px; 
      margin-bottom: 10px; 
    }
    .content-text { 
      white-space: pre-wrap; 
      font-size: 12px; 
      line-height: 1.4; 
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="title">${title}</h1>
    <p class="subtitle">Version ${version} - ${status.toUpperCase()}</p>
  </div>
  
  <div class="info">
    <div><span class="label">Policy ID:</span> ${policyId}</div>
    <div><span class="label">Author:</span> ${author}</div>
    <div><span class="label">Type:</span> ${type}</div>
    <div><span class="label">Description:</span> ${description}</div>
  </div>
  
  <div class="content-section">
    <div class="content-title">Policy Content</div>
    <div class="content-text">${content}</div>
  </div>
</body>
</html>`;

      console.log('Generated HTML length:', htmlContent.length);
      
      const filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_v${version}.pdf`;
      
      console.log('Starting PDF generation...');
      
      const options = {
        margin: [10, 10, 10, 10],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 1,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait'
        }
      };

      await html2pdf().set(options).from(htmlContent).save();
      
      console.log('PDF generated successfully');
      
      toast({
        title: "Success",
        description: `Policy "${title}" downloaded as PDF successfully`,
      });
    } catch (error) {
      console.error('PDF Generation Error:', error);
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
