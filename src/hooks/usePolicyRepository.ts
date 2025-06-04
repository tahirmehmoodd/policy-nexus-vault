
import { useState, useEffect } from 'react';
import { usePolicies, DatabasePolicy } from './usePolicies';
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

const REAL_WORLD_TEMPLATES = [
  {
    title: "Access Control Policy",
    description: "Comprehensive access control policy based on NIST cybersecurity framework standards for enterprise organizations.",
    type: "Access Control",
    category: "Technical Control" as const,
    status: "active" as const,
    content: `# Access Control Policy

## 1. Purpose
This policy establishes guidelines for controlling access to organizational information systems and data to ensure confidentiality, integrity, and availability.

## 2. Scope
This policy applies to all employees, contractors, and third parties who require access to organizational information systems.

## 3. Access Control Principles
- **Principle of Least Privilege**: Users shall be granted the minimum level of access necessary to perform their job functions.
- **Need-to-Know Basis**: Access to sensitive information shall be granted only when there is a legitimate business need.
- **Segregation of Duties**: Critical functions shall be divided among multiple individuals to prevent fraud and errors.

## 4. User Account Management
### 4.1 Account Creation
- All user accounts must be approved by the user's manager and IT security team
- Accounts shall be created with default deny permissions
- Unique user identification must be assigned to each individual

### 4.2 Account Modification
- Access modifications require approval from data owner and security team
- All changes must be documented and logged
- Regular access reviews shall be conducted quarterly

### 4.3 Account Termination
- Accounts must be disabled immediately upon termination or role change
- All access credentials must be revoked within 24 hours
- Equipment and access cards must be returned

## 5. Authentication Requirements
- Multi-factor authentication required for all privileged accounts
- Password complexity requirements: minimum 12 characters, mix of uppercase, lowercase, numbers, and special characters
- Password rotation required every 90 days for privileged accounts

## 6. Authorization Controls
- Role-based access control (RBAC) implementation required
- Access permissions based on job functions and responsibilities
- Regular review and certification of user access rights

## 7. Remote Access
- VPN required for all remote connections
- Endpoint security compliance verification
- Session timeout after 30 minutes of inactivity

## 8. Monitoring and Auditing
- All access attempts must be logged and monitored
- Failed login attempts trigger security alerts
- Regular audit of access logs and user activities

## 9. Compliance
This policy ensures compliance with SOX, HIPAA, PCI-DSS, and other applicable regulations.

## 10. Policy Violations
Violations may result in disciplinary action up to and including termination and legal prosecution.`,
    tags: ["access-control", "authentication", "authorization", "NIST", "security", "compliance"],
    author: "Policy Repository Templates"
  },
  {
    title: "Data Classification Policy", 
    description: "Enterprise data classification policy defining sensitivity levels and handling requirements for organizational information assets.",
    type: "Data Classification",
    category: "Organizational Control" as const,
    status: "active" as const,
    content: `# Data Classification Policy

## 1. Purpose
To establish a framework for classifying organizational data based on sensitivity levels and defining appropriate handling, storage, and transmission requirements.

## 2. Data Classification Levels

### 2.1 Public Data
- Information intended for public disclosure
- No confidentiality requirements
- Examples: Marketing materials, public websites, press releases

### 2.2 Internal Data
- Information for internal use within the organization
- Moderate confidentiality requirements
- Examples: Internal policies, procedures, organizational charts

### 2.3 Confidential Data
- Sensitive information requiring protection
- High confidentiality requirements
- Examples: Financial data, strategic plans, customer information

### 2.4 Restricted Data
- Highly sensitive information requiring maximum protection
- Highest confidentiality requirements
- Examples: Trade secrets, personal identifiable information (PII), payment card data

## 3. Data Handling Requirements

### 3.1 Storage Requirements
- Public: No specific requirements
- Internal: Standard security controls
- Confidential: Encryption at rest required
- Restricted: Strong encryption and access controls

### 3.2 Transmission Requirements
- Public: No encryption required
- Internal: Secure channels preferred
- Confidential: Encryption in transit required
- Restricted: Strong encryption and authenticated channels

### 3.3 Access Controls
- Role-based access control implementation
- Regular access reviews and certifications
- Data owner approval required for access

## 4. Data Labeling
All data must be appropriately labeled according to its classification level using standardized marking procedures.

## 5. Data Retention
- Retention schedules based on classification level
- Secure disposal when retention period expires
- Legal hold procedures for litigation support

## 6. Responsibilities
- Data Owners: Classify data and define access requirements
- Data Custodians: Implement technical controls
- Users: Handle data according to classification requirements

## 7. Compliance and Monitoring
Regular audits to ensure compliance with classification requirements and identify potential data security risks.`,
    tags: ["data-classification", "information-security", "data-protection", "compliance", "privacy"],
    author: "Policy Repository Templates"
  },
  {
    title: "Acceptable Use Policy",
    description: "Organizational acceptable use policy defining appropriate use of IT resources and systems by employees and authorized users.",
    type: "Acceptable Use", 
    category: "Organizational Control" as const,
    status: "active" as const,
    content: `# Acceptable Use Policy

## 1. Purpose
This policy defines the acceptable use of organizational IT resources including computers, networks, and information systems.

## 2. Scope
This policy applies to all employees, contractors, consultants, and other users of organizational IT resources.

## 3. Acceptable Use Guidelines

### 3.1 General Principles
- IT resources are provided for business purposes
- Personal use should be minimal and not interfere with work
- Users must respect intellectual property rights
- Maintain confidentiality of organizational information

### 3.2 Prohibited Activities
- Unauthorized access to systems or data
- Installing unauthorized software or hardware
- Sharing login credentials with others
- Using IT resources for illegal activities
- Downloading or distributing copyrighted material
- Accessing inappropriate content during work hours
- Attempting to circumvent security controls

### 3.3 Email and Communication
- Professional communication standards required
- No harassment, discrimination, or offensive content
- Personal email use should be minimal
- Confidential information protection in communications

### 3.4 Internet Usage
- Business-related browsing encouraged
- Limited personal use during breaks
- No accessing inappropriate or offensive websites
- No downloading unauthorized software

### 3.5 Social Media
- Professional representation of organization
- No sharing of confidential information
- Clear disclaimer when expressing personal opinions
- Respect for colleagues and organizational reputation

## 4. Password and Security
- Strong password requirements
- No sharing of authentication credentials
- Report security incidents immediately
- Lock workstations when unattended

## 5. Mobile Devices and Remote Access
- Approved devices only for business use
- Security software installation required
- Encryption for stored business data
- Remote wipe capability for lost devices

## 6. Software and Licensing
- Only authorized software installation
- Compliance with software licensing agreements
- No use of pirated or unlicensed software
- IT approval required for new software

## 7. Data Backup and Storage
- Regular backup of important business data
- Use approved cloud storage services only
- No storing business data on personal devices
- Compliance with data retention policies

## 8. Monitoring and Privacy
- IT resources may be monitored for security and compliance
- No expectation of privacy for business communications
- Monitoring will be conducted lawfully and ethically

## 9. Violations and Consequences
- Violations may result in disciplinary action
- Immediate suspension of access for serious violations
- Legal action for criminal activities
- Cooperation with law enforcement when required

## 10. Reporting
Users must report suspected policy violations, security incidents, or inappropriate use to the IT security team immediately.`,
    tags: ["acceptable-use", "IT-policy", "employee-guidelines", "security-awareness", "compliance"],
    author: "Policy Repository Templates"
  }
];

export function usePolicyRepository() {
  const { 
    policies, 
    loading, 
    createPolicy, 
    updatePolicy, 
    deletePolicy, 
    searchPolicies: searchPoliciesBase,
    getPolicyVersions,
    getAllTags,
    downloadPolicyAsJson,
    convertXmlToPolicy,
    refreshPolicies 
  } = usePolicies();

  const [templatesLoaded, setTemplatesLoaded] = useState(false);
  const { toast } = useToast();

  // Load real-world templates once
  useEffect(() => {
    const loadTemplates = async () => {
      if (templatesLoaded || policies.length === 0) return;
      
      try {
        const hasTemplates = policies.some(p => p.author === 'Policy Repository Templates');
        if (!hasTemplates) {
          console.log('Loading real-world policy templates...');
          
          for (const template of REAL_WORLD_TEMPLATES) {
            await createPolicy(template);
          }
          
          setTemplatesLoaded(true);
          toast({
            title: "Templates Loaded",
            description: "Real-world policy templates have been added to your repository.",
          });
        }
      } catch (error) {
        console.error('Error loading templates:', error);
      }
    };

    if (policies.length > 0 && !templatesLoaded) {
      loadTemplates();
    }
  }, [policies, templatesLoaded, createPolicy, toast]);

  // Enhanced search with category filtering
  const searchPolicies = async (
    searchQuery: string = '',
    filterTags: string[] = [],
    filterType: string = '',
    filterStatus: string = '',
    filterCategory: string = ''
  ) => {
    try {
      // Type assertion to ensure correct types
      const statusFilter = filterStatus as 'draft' | 'active' | 'archived' | 'under_review' | '';
      const categoryFilter = filterCategory as 'Technical Control' | 'Physical Control' | 'Organizational Control' | 'Administrative Control' | '';
      
      const results = await searchPoliciesBase(searchQuery, filterTags, filterType, statusFilter);
      
      // Additional client-side filtering for category if needed
      if (categoryFilter) {
        return results.filter(policy => policy.category === categoryFilter);
      }
      
      return results;
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  };

  // Download policy as PDF (simplified version)
  const downloadPolicyAsPdf = (policy: DatabasePolicy) => {
    // Create a simple HTML version for PDF generation
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${policy.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .meta { color: #666; margin-bottom: 5px; }
          .content { line-height: 1.6; white-space: pre-wrap; }
          .tags { margin-top: 20px; }
          .tag { background: #f0f0f0; padding: 4px 8px; border-radius: 4px; margin: 2px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${policy.title}</div>
          <div class="meta">Version: ${policy.version}</div>
          <div class="meta">Status: ${policy.status}</div>
          <div class="meta">Category: ${policy.category}</div>
          <div class="meta">Author: ${policy.author}</div>
          <div class="meta">Last Updated: ${new Date(policy.updated_at).toLocaleDateString()}</div>
        </div>
        <div class="content">${policy.content}</div>
        <div class="tags">
          <strong>Tags:</strong>
          ${(policy.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${policy.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_v${policy.version}.html`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Policy downloaded as HTML file (can be converted to PDF using browser print).",
    });
  };

  return {
    policies,
    loading,
    createPolicy,
    updatePolicy,
    deletePolicy,
    searchPolicies,
    getPolicyVersions,
    getAllTags,
    downloadPolicyAsJson,
    downloadPolicyAsPdf,
    convertXmlToPolicy,
    refreshPolicies,
  };
}
