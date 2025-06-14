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
      
      // Simple data extraction - handle both formats
      let title, description, content, version, status, author, type;
      
      if ('policy_id' in policy) {
        // UI format (PolicyData)
        title = policy.title || 'Untitled Policy';
        description = policy.description || 'No description available';
        content = policy.content || 'No content available';
        version = policy.currentVersion || '1.0';
        status = policy.status || 'draft';
        author = policy.author || 'Unknown Author';
        type = policy.type || 'General';
      } else {
        // Database format (DatabasePolicy)
        title = policy.title || 'Untitled Policy';
        description = policy.description || 'No description available';
        content = policy.content || 'No content available';
        version = policy.version?.toString() || '1.0';
        status = policy.status || 'draft';
        author = policy.author || 'Unknown Author';
        type = policy.type || 'General';
      }
      
      console.log('PDF Generation - Extracted data:', { title, content: content.substring(0, 100) });
      
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            line-height: 1.6; 
            color: #333;
        }
        h1 { 
            color: #333; 
            border-bottom: 2px solid #ccc; 
            padding-bottom: 10px; 
            margin-bottom: 20px;
        }
        .meta { 
            background: #f5f5f5; 
            padding: 15px; 
            margin: 20px 0; 
            border-radius: 5px;
        }
        .content { 
            margin: 20px 0; 
            padding: 20px; 
            border: 1px solid #ddd; 
            border-radius: 5px;
            white-space: pre-wrap;
        }
        @media print { 
            body { margin: 20px; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <h1>${title}</h1>
    <div class="meta">
        <p><strong>Version:</strong> ${version}</p>
        <p><strong>Status:</strong> ${status}</p>
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Author:</strong> ${author}</p>
    </div>
    <h2>Description</h2>
    <p>${description}</p>
    <h2>Content</h2>
    <div class="content">${content}</div>
    <div class="no-print" style="margin-top: 40px; padding: 20px; background: #e3f2fd; border-radius: 5px;">
        <p><strong>Instructions:</strong> Use Ctrl+P (Cmd+P on Mac) and select "Save as PDF" to download this policy as a PDF file.</p>
    </div>
</body>
</html>`;

      const newWindow = window.open('', '_blank');
      if (!newWindow) {
        throw new Error('Please allow pop-ups to download PDF');
      }

      newWindow.document.write(htmlContent);
      newWindow.document.close();
      newWindow.focus();
      
      toast({
        title: "PDF Ready",
        description: "Use Ctrl+P (Cmd+P on Mac) and select 'Save as PDF'",
      });
      
    } catch (error) {
      console.error('PDF Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
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
