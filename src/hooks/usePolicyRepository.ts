
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface PolicyData {
  id: string;
  title: string;
  description: string | null;
  content: string;
  tags: string[] | null;
  type: string;
  version: number;
  status: 'draft' | 'active' | 'archived' | 'under_review';
  file_url: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  author: string;
  category: 'Technical Control' | 'Physical Control' | 'Organizational Control' | 'Administrative Control';
}

export interface VersionData {
  version_id: string;
  policy_id: string;
  version_label: string;
  description: string | null;
  created_at: string;
  edited_by: string;
}

export function usePolicyRepository() {
  const [policies, setPolicies] = useState<PolicyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<PolicyData[]>([]);
  const { toast } = useToast();

  // Real-world policy templates based on industry standards
  const policyTemplates = [
    {
      title: "Access Control Policy - SANS Template",
      description: "Comprehensive access control policy based on SANS Institute guidelines",
      type: "Access Control",
      category: "Technical Control" as const,
      tags: ["access-control", "authentication", "authorization", "SANS", "template"],
      content: `
# Access Control Policy

## 1. Purpose
This policy establishes requirements for controlling access to information systems and data to protect against unauthorized access, modification, or destruction.

## 2. Scope
This policy applies to all employees, contractors, and third parties who access company information systems.

## 3. Policy Statements

### 3.1 User Access Management
- All system access must be authorized by data owners
- User accounts must be provisioned based on business need and least privilege principle
- Access reviews must be conducted quarterly

### 3.2 Password Requirements
- Minimum 12 characters with complexity requirements
- Multi-factor authentication required for privileged accounts
- Password rotation every 90 days for administrative accounts

### 3.3 Account Management
- User accounts must be deactivated within 24 hours of termination
- Shared accounts are prohibited except for approved service accounts
- Regular access recertification is required

## 4. Enforcement
Violations may result in disciplinary action up to and including termination.

## 5. Review
This policy will be reviewed annually and updated as necessary.
      `
    },
    {
      title: "Data Classification Policy - ISO 27001 Aligned",
      description: "Data classification framework aligned with ISO 27001 standards",
      type: "Data Classification",
      category: "Organizational Control" as const,
      tags: ["data-classification", "ISO-27001", "confidentiality", "template"],
      content: `
# Data Classification Policy

## 1. Purpose
To establish a framework for classifying data based on sensitivity and criticality to ensure appropriate protection measures are applied.

## 2. Data Classification Levels

### 2.1 Public
- Information that can be freely shared
- No special handling required
- Examples: Published marketing materials, public website content

### 2.2 Internal
- Information for internal use only
- Standard business protections apply
- Examples: Internal policies, general business communications

### 2.3 Confidential
- Sensitive information requiring protection
- Access on need-to-know basis
- Examples: Employee records, customer data, financial information

### 2.4 Restricted
- Highly sensitive information
- Strict access controls required
- Examples: Trade secrets, merger plans, security incidents

## 3. Handling Requirements
Each classification level has specific requirements for:
- Access controls
- Storage requirements
- Transmission protocols
- Retention periods
- Disposal methods

## 4. Responsibilities
- Data owners must classify all data assets
- Users must handle data according to classification
- IT must implement technical controls
      `
    },
    {
      title: "Acceptable Use Policy - NIST Framework",
      description: "Technology acceptable use policy based on NIST cybersecurity framework",
      type: "Acceptable Use",
      category: "Organizational Control" as const,
      tags: ["acceptable-use", "NIST", "cybersecurity", "employee-conduct", "template"],
      content: `
# Acceptable Use Policy

## 1. Purpose
This policy defines acceptable use of information technology resources to protect the organization and users from potential security threats and legal liabilities.

## 2. Acceptable Uses
Technology resources may be used for:
- Authorized business activities
- Approved personal use during breaks (limited)
- Professional development activities
- Communication with colleagues and customers

## 3. Prohibited Activities
The following activities are strictly prohibited:
- Accessing, storing, or transmitting illegal content
- Unauthorized access to systems or data
- Installing unauthorized software or hardware
- Bypassing security controls
- Personal commercial activities
- Excessive personal use that impacts productivity

## 4. Email and Communication
- Email monitoring may occur for security purposes
- Professional communication standards apply
- External communications must follow data handling policies
- Confidential information must not be transmitted to personal accounts

## 5. Internet Usage
- Web browsing should be primarily business-related
- Social media use is permitted during breaks
- Streaming media may be restricted to preserve bandwidth
- Malicious websites and downloads are prohibited

## 6. Mobile Devices and Remote Access
- Only approved devices may access company resources
- Remote access must use approved VPN solutions
- Lost or stolen devices must be reported immediately
- Personal devices must meet security requirements

## 7. Enforcement
Violations may result in:
- Warning and additional training
- Temporary suspension of access
- Disciplinary action
- Termination of employment
- Legal action if warranted
      `
    },
    {
      title: "Network Security Policy - CIS Controls",
      description: "Network security policy implementing CIS Critical Security Controls",
      type: "Network Security",
      category: "Technical Control" as const,
      tags: ["network-security", "CIS-controls", "firewall", "monitoring", "template"],
      content: `
# Network Security Policy

## 1. Purpose
To establish security requirements for network infrastructure to protect against unauthorized access, data breaches, and network-based attacks.

## 2. Network Architecture

### 2.1 Network Segmentation
- Critical systems must be isolated in separate network segments
- DMZ required for public-facing services
- Internal networks segregated by function and sensitivity
- Wireless networks isolated from wired infrastructure

### 2.2 Firewall Management
- All network traffic must pass through approved firewalls
- Default deny rule with explicit allow rules only
- Firewall rules reviewed and updated quarterly
- Logging enabled for all firewall activities

## 3. Access Controls

### 3.1 Network Access
- Authentication required for all network access
- Network Access Control (NAC) solutions deployed
- Guest networks isolated from production systems
- VPN required for remote access

### 3.2 Wireless Security
- WPA3 encryption minimum for all wireless networks
- Regular wireless security assessments
- Rogue access point detection and mitigation
- Guest networks with time-limited access

## 4. Monitoring and Logging

### 4.1 Network Monitoring
- 24/7 network monitoring for security incidents
- Intrusion detection systems (IDS) deployed
- Network traffic analysis for anomalies
- Security information and event management (SIEM)

### 4.2 Incident Response
- Automated alerting for security events
- Incident response procedures documented
- Network isolation capabilities for containment
- Forensic data collection procedures

## 5. Maintenance and Updates
- Regular security patching of network devices
- Vulnerability assessments conducted quarterly
- Configuration management for all network devices
- Change management procedures for network modifications
      `
    }
  ];

  const fetchPolicies = async () => {
    try {
      const { data, error } = await supabase
        .from('policies')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setPolicies(data || []);
    } catch (error) {
      console.error('Error fetching policies:', error);
      toast({
        title: "Error",
        description: "Failed to fetch policies",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const initializeTemplates = async () => {
    try {
      // Check if templates already exist
      const { data: existingTemplates } = await supabase
        .from('policies')
        .select('title')
        .in('title', policyTemplates.map(t => t.title));

      const existingTitles = existingTemplates?.map(t => t.title) || [];
      const templatesToCreate = policyTemplates.filter(t => !existingTitles.includes(t.title));

      if (templatesToCreate.length > 0) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Create template policies
        for (const template of templatesToCreate) {
          await supabase.from('policies').insert({
            title: template.title,
            description: template.description,
            content: template.content,
            type: template.type,
            category: template.category,
            tags: template.tags,
            status: 'active',
            created_by: user.id,
            updated_by: user.id,
            author: 'Policy Repository Templates',
          });
        }

        toast({
          title: "Templates Loaded",
          description: `${templatesToCreate.length} policy templates have been added to your repository`,
        });
      }
    } catch (error) {
      console.error('Error initializing templates:', error);
    }
  };

  useEffect(() => {
    fetchPolicies();
    initializeTemplates();
  }, []);

  const createPolicy = async (policyData: {
    title: string;
    description?: string;
    content: string;
    type: string;
    tags?: string[];
    status?: 'draft' | 'active' | 'archived';
  }) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const categoryMapping: Record<string, 'Technical Control' | 'Physical Control' | 'Organizational Control' | 'Administrative Control'> = {
        'Access Control': 'Technical Control',
        'Data Classification': 'Organizational Control',
        'Network Security': 'Technical Control',
        'Incident Management': 'Organizational Control',
        'Asset Management': 'Physical Control',
        'Business Continuity': 'Organizational Control',
        'Acceptable Use': 'Organizational Control',
        'Information Security': 'Organizational Control',
        'Physical Security': 'Physical Control',
        'Risk Management': 'Organizational Control',
      };

      const category = categoryMapping[policyData.type] || 'Technical Control';
      
      const { data, error } = await supabase
        .from('policies')
        .insert({
          title: policyData.title,
          description: policyData.description || null,
          content: policyData.content,
          type: policyData.type,
          category: category,
          tags: policyData.tags || [],
          status: policyData.status || 'draft',
          created_by: user.id,
          updated_by: user.id,
          author: user.email || 'Unknown',
        })
        .select()
        .single();

      if (error) throw error;

      // Create initial version
      await supabase.from('versions').insert({
        policy_id: data.id,
        version_label: 'v1.0',
        description: 'Initial version',
        edited_by: user.email || 'Unknown',
      });

      await fetchPolicies();
      
      toast({
        title: "Success",
        description: "Policy created successfully",
      });

      return data;
    } catch (error: any) {
      console.error('Error creating policy:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create policy",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updatePolicy = async (
    policyId: string,
    updates: Partial<PolicyData>,
    changeDescription?: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: currentPolicy, error: fetchError } = await supabase
        .from('policies')
        .select('*')
        .eq('id', policyId)
        .single();

      if (fetchError) throw fetchError;

      const currentVersionNum = Number(currentPolicy.version);
      const newVersionNum = Number((currentVersionNum + 0.1).toFixed(1));

      const { data, error } = await supabase
        .from('policies')
        .update({
          ...updates,
          updated_by: user.id,
          version: newVersionNum,
        })
        .eq('id', policyId)
        .select()
        .single();

      if (error) throw error;

      // Create new version entry
      await supabase.from('versions').insert({
        policy_id: policyId,
        version_label: `v${newVersionNum.toFixed(1)}`,
        description: changeDescription || 'Policy updated',
        edited_by: user.email || 'Unknown',
      });

      await fetchPolicies();
      
      toast({
        title: "Success",
        description: "Policy updated successfully",
      });

      return data;
    } catch (error: any) {
      console.error('Error updating policy:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update policy",
        variant: "destructive",
      });
      throw error;
    }
  };

  const searchPolicies = async (
    searchQuery: string = '',
    filterTags: string[] = [],
    filterType: string = '',
    filterStatus: string = '',
    filterCategory: string = ''
  ) => {
    try {
      let query = supabase
        .from('policies')
        .select('*')
        .order('updated_at', { ascending: false });

      // Apply filters
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      if (filterTags.length > 0) {
        query = query.overlaps('tags', filterTags);
      }

      if (filterType) {
        query = query.eq('type', filterType);
      }

      if (filterStatus) {
        query = query.eq('status', filterStatus);
      }

      if (filterCategory) {
        query = query.eq('category', filterCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching policies:', error);
      toast({
        title: "Error",
        description: "Failed to search policies",
        variant: "destructive",
      });
      return [];
    }
  };

  const getPolicyVersions = async (policyId: string) => {
    try {
      const { data, error } = await supabase
        .from('versions')
        .select('*')
        .eq('policy_id', policyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching policy versions:', error);
      return [];
    }
  };

  const convertXmlToPolicy = (xmlContent: string) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
      
      const title = xmlDoc.getElementsByTagName("title")[0]?.textContent || "Imported XML Policy";
      const description = xmlDoc.getElementsByTagName("description")[0]?.textContent || "";
      const type = xmlDoc.getElementsByTagName("type")[0]?.textContent || "Information Security";
      const content = xmlDoc.getElementsByTagName("content")[0]?.textContent || xmlContent;
      const tagsElements = xmlDoc.getElementsByTagName("tag");
      
      const tags: string[] = [];
      for (let i = 0; i < tagsElements.length; i++) {
        const tag = tagsElements[i].textContent;
        if (tag) tags.push(tag);
      }
      
      return {
        title,
        description,
        type,
        content,
        tags: tags.length > 0 ? tags : ["XML Import"],
      };
    } catch (error) {
      console.error("Error parsing XML:", error);
      toast({
        title: "XML Parse Error",
        description: "Could not parse the XML file. Using raw content instead.",
        variant: "destructive",
      });
      
      return {
        title: "Imported XML Policy",
        description: "Policy imported from XML file",
        type: "Information Security",
        content: xmlContent,
        tags: ["XML Import"],
      };
    }
  };

  const downloadPolicyAsJson = (policy: PolicyData) => {
    const policyData = {
      id: policy.id,
      title: policy.title,
      description: policy.description,
      content: policy.content,
      type: policy.type,
      category: policy.category,
      status: policy.status,
      tags: policy.tags,
      version: policy.version,
      author: policy.author,
      created_at: policy.created_at,
      updated_at: policy.updated_at,
    };

    const dataStr = JSON.stringify(policyData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${policy.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_v${policy.version}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const downloadPolicyAsPdf = (policy: PolicyData) => {
    const pdfContent = `
SECURITY POLICY DOCUMENT

Title: ${policy.title}
Version: ${policy.version}
Status: ${policy.status.toUpperCase()}
Type: ${policy.type}
Category: ${policy.category}

Author: ${policy.author}
Created: ${new Date(policy.created_at).toLocaleDateString()}
Updated: ${new Date(policy.updated_at).toLocaleDateString()}

Description:
${policy.description || 'No description provided'}

Content:
${policy.content}

Tags: ${policy.tags?.join(', ') || 'No tags'}

Generated on: ${new Date().toLocaleString()}
    `;

    const dataBlob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${policy.title.replace(/\s+/g, '_')}_v${policy.version}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    policies,
    loading,
    createPolicy,
    updatePolicy,
    searchPolicies,
    getPolicyVersions,
    convertXmlToPolicy,
    downloadPolicyAsJson,
    downloadPolicyAsPdf,
    refreshPolicies: fetchPolicies,
  };
}
