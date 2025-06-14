
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
      
      console.log('Starting PDF download for policy:', policy);
      
      // Extract policy data safely
      const title = policy.title || 'Untitled Policy';
      const description = policy.description || 'No description available';
      const content = policy.content || 'No content available';
      const version = 'currentVersion' in policy ? policy.currentVersion : policy.version?.toString() || '1.0';
      const status = policy.status || 'draft';
      const author = policy.author || 'Unknown Author';
      const type = policy.type || 'General';
      
      console.log('Extracted data:', { title, description, content: content.substring(0, 100) + '...', version, status, author, type });
      
      // Create a simple, clean HTML document
      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20mm;
            background: white;
        }
        h1 {
            color: #2563eb;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .meta {
            background: #f9fafb;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .meta-item {
            margin: 5px 0;
        }
        .content {
            white-space: pre-wrap;
            background: #ffffff;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            margin: 20px 0;
        }
        @media print {
            body { margin: 0; padding: 20mm; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <h1>${title}</h1>
    
    <div class="meta">
        <div class="meta-item"><strong>Version:</strong> ${version}</div>
        <div class="meta-item"><strong>Status:</strong> ${status}</div>
        <div class="meta-item"><strong>Type:</strong> ${type}</div>
        <div class="meta-item"><strong>Author:</strong> ${author}</div>
        <div class="meta-item"><strong>Generated:</strong> ${new Date().toLocaleString()}</div>
    </div>
    
    <h2>Description</h2>
    <p>${description}</p>
    
    <h2>Policy Content</h2>
    <div class="content">${content}</div>
    
    <p class="no-print" style="margin-top: 40px; text-align: center; color: #6b7280; font-size: 14px;">
        Use your browser's Print function (Ctrl+P or Cmd+P) and select "Save as PDF" to download this policy.
    </p>
</body>
</html>`;

      console.log('Opening new window for PDF...');
      
      // Open in new window
      const newWindow = window.open('', '_blank');
      
      if (!newWindow) {
        throw new Error('Unable to open new window. Please allow pop-ups for this site.');
      }

      // Write the HTML content
      newWindow.document.write(htmlContent);
      newWindow.document.close();
      
      // Focus the window
      newWindow.focus();
      
      console.log('PDF window opened successfully');
      
      toast({
        title: "PDF Ready",
        description: "A new window has opened with your policy. Use Ctrl+P (or Cmd+P on Mac) and select 'Save as PDF' to download.",
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
