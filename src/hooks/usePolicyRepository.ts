
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
      
      // Handle both PolicyData and DatabasePolicy types
      const policyData = {
        title: policy.title,
        version: 'currentVersion' in policy ? policy.currentVersion : policy.version?.toString() || '1.0',
        status: policy.status,
        author: policy.author,
        type: policy.type,
        category: 'framework_category' in policy ? policy.framework_category : 
                 policy.category === 'Technical Control' ? 'technical' : 
                 policy.category === 'Physical Control' ? 'physical' : 
                 policy.category === 'Organizational Control' ? 'organizational' : 'organizational',
        created_at: policy.created_at,
        updated_at: policy.updated_at,
        description: policy.description || '',
        content: policy.content || 'Content not available.',
        tags: policy.tags || []
      };
      
      // Create HTML content for PDF
      const htmlContent = `
        <div style="padding: 40px; font-family: Arial, sans-serif; line-height: 1.6;">
          <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 20px;">
            <h1 style="color: #333; margin: 0;">${policyData.title}</h1>
            <p style="color: #666; margin: 10px 0;">Version ${policyData.version} | ${policyData.status.toUpperCase()}</p>
            <p style="color: #666; margin: 0;">Author: ${policyData.author}</p>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #444; border-bottom: 1px solid #ccc; padding-bottom: 10px;">Policy Information</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold; width: 30%;">Type</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${policyData.type}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Category</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${policyData.category}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Status</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${policyData.status}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Created</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${new Date(policyData.created_at).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Last Updated</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${new Date(policyData.updated_at).toLocaleDateString()}</td>
              </tr>
              ${policyData.tags && policyData.tags.length > 0 ? `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Tags</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${policyData.tags.join(', ')}</td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          ${policyData.description ? `
          <div style="margin-bottom: 30px;">
            <h2 style="color: #444; border-bottom: 1px solid #ccc; padding-bottom: 10px;">Description</h2>
            <p style="margin-top: 15px; text-align: justify;">${policyData.description}</p>
          </div>
          ` : ''}
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #444; border-bottom: 1px solid #ccc; padding-bottom: 10px;">Policy Content</h2>
            <div style="margin-top: 15px; text-align: justify; white-space: pre-wrap;">${policyData.content}</div>
          </div>
          
          <div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ccc; padding-top: 20px;">
            Generated on ${new Date().toLocaleDateString()} | Information Security Policy Repository
          </div>
        </div>
      `;

      const options = {
        margin: 1,
        filename: `${policyData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_v${policyData.version}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      await html2pdf().set(options).from(htmlContent).save();
      
      toast({
        title: "Success",
        description: "Policy downloaded as PDF successfully",
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
