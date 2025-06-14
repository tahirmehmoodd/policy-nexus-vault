
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
      
      console.log('=== DETAILED PDF DEBUG START ===');
      console.log('Raw policy object:', JSON.stringify(policy, null, 2));
      console.log('Policy type:', typeof policy);
      console.log('Policy keys:', Object.keys(policy));
      
      // More defensive content extraction
      let title, description, content, version, status, author, type;
      
      if ('currentVersion' in policy) {
        // PolicyData format
        title = policy.title || 'Untitled Policy';
        description = policy.description || 'No description available';
        content = policy.content || 'No content available';
        version = policy.currentVersion || '1.0';
        status = policy.status || 'draft';
        author = policy.author || 'Unknown Author';
        type = policy.type || 'General';
      } else {
        // DatabasePolicy format
        title = policy.title || 'Untitled Policy';
        description = policy.description || 'No description available';
        content = policy.content || 'No content available';
        version = policy.version?.toString() || '1.0';
        status = policy.status || 'draft';
        author = policy.author || 'Unknown Author';
        type = policy.type || 'General';
      }
      
      console.log('Extracted values:');
      console.log('- title:', title);
      console.log('- description:', description);
      console.log('- content length:', content.length);
      console.log('- version:', version);
      console.log('- status:', status);
      console.log('- author:', author);
      console.log('- type:', type);
      
      // Simple text-based PDF generation using data URI
      const pdfContent = `
POLICY DOCUMENT
===============

Title: ${title}
Version: ${version}
Status: ${status}
Author: ${author}
Type: ${type}

Description:
${description}

Policy Content:
${content}

Generated on: ${new Date().toLocaleString()}
`;

      console.log('Generated PDF content:', pdfContent);
      
      // Create downloadable text file as PDF alternative
      const blob = new Blob([pdfContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_v${version}.txt`;
      
      console.log('Download link created:', link.href);
      console.log('Download filename:', link.download);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      
      console.log('File download triggered successfully');
      
      toast({
        title: "Download Ready",
        description: `Policy "${title}" downloaded as text file. Converting to PDF...`,
      });
      
      // Try alternative PDF generation with jsPDF
      setTimeout(() => {
        try {
          const printWindow = window.open('', '_blank');
          
          if (!printWindow) {
            throw new Error('Pop-up blocked');
          }
          
          const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      margin: 20px; 
      line-height: 1.6; 
    }
    .header { 
      border-bottom: 2px solid #000; 
      padding-bottom: 10px; 
      margin-bottom: 20px; 
    }
    .title { 
      font-size: 24px; 
      font-weight: bold; 
    }
    .meta { 
      margin: 10px 0; 
    }
    .content { 
      margin-top: 20px; 
      white-space: pre-wrap; 
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">${title}</div>
    <div class="meta">Version: ${version} | Status: ${status}</div>
    <div class="meta">Author: ${author} | Type: ${type}</div>
  </div>
  <div class="meta">
    <strong>Description:</strong><br>
    ${description}
  </div>
  <div class="content">
    <strong>Policy Content:</strong><br>
    ${content}
  </div>
  <script>
    window.onload = function() {
      setTimeout(() => window.print(), 500);
    };
  </script>
</body>
</html>`;
          
          printWindow.document.write(htmlContent);
          printWindow.document.close();
          
          console.log('Print window opened successfully');
          
        } catch (printError) {
          console.error('Print window error:', printError);
        }
      }, 1000);
      
    } catch (error) {
      console.error('PDF Generation Error:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      toast({
        title: "Error",
        description: "Failed to generate PDF. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      console.log('=== PDF DEBUG END ===');
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
