
import { useState, useEffect } from 'react';
import { usePolicies } from './usePolicies';
import { useToast } from '@/components/ui/use-toast';

export interface PolicyTemplate {
  id: string;
  title: string;
  description: string;
  content: string;
  type: string;
  tags: string[];
  source: string;
  category: string;
}

export function usePolicyTemplates() {
  const [templates, setTemplates] = useState<PolicyTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const { createPolicy } = usePolicies();
  const { toast } = useToast();

  const securityPolicyTemplates: PolicyTemplate[] = [
    {
      id: 'access-control-001',
      title: 'Access Control Policy',
      description: 'Comprehensive access control policy based on industry best practices',
      type: 'Access Control',
      category: 'Technical Control',
      source: 'Industry Standard',
      tags: ['Access Control', 'Authentication', 'Authorization', 'Security'],
      content: `# Access Control Policy

## 1. Purpose
This policy establishes the requirements for controlling access to organizational information systems and data to protect against unauthorized access, modification, or destruction.

## 2. Scope
This policy applies to all employees, contractors, vendors, and third parties who require access to organizational information systems and data.

## 3. Policy Statement
The organization shall implement access controls to protect the confidentiality, integrity, and availability of information systems and data.

## 4. Access Control Principles

### 4.1 Least Privilege
Users shall be granted the minimum level of access necessary to perform their job functions.

### 4.2 Need-to-Know
Access to information shall be granted only when there is a legitimate business need.

### 4.3 Separation of Duties
Critical functions shall be divided among multiple individuals to prevent fraud and errors.

## 5. User Access Management

### 5.1 User Registration
- All user accounts must be formally requested and approved
- Users must complete security awareness training before access is granted
- User access must be reviewed and approved by the appropriate manager

### 5.2 Password Requirements
- Minimum 12 characters in length
- Must contain uppercase and lowercase letters, numbers, and special characters
- Passwords must be changed every 90 days
- Previous 12 passwords cannot be reused
- Multi-factor authentication required for all privileged accounts

### 5.3 Account Management
- User accounts shall be reviewed quarterly
- Inactive accounts shall be disabled after 30 days
- Terminated employee accounts shall be disabled immediately
- Shared accounts are prohibited

## 6. System Access Control

### 6.1 Network Access
- All network access must be authenticated and authorized
- Remote access requires VPN connection with multi-factor authentication
- Guest network access is isolated from internal networks

### 6.2 Application Access
- Role-based access control shall be implemented
- Application access requires unique user credentials
- Session timeouts shall be configured for all applications

## 7. Physical Access Control
- Data centers and server rooms require card access and logging
- Visitor access must be supervised at all times
- Sensitive areas require dual-person authorization

## 8. Monitoring and Auditing
- All access attempts shall be logged and monitored
- Failed login attempts shall trigger security alerts
- Access logs shall be retained for a minimum of one year

## 9. Compliance and Enforcement
Violations of this policy may result in disciplinary action, up to and including termination of employment or contract.

## 10. Policy Review
This policy shall be reviewed annually and updated as necessary to address emerging threats and business requirements.

**Effective Date:** [Date]
**Review Date:** [Date + 1 Year]
**Approved By:** [Security Officer]`
    },
    {
      id: 'data-classification-001',
      title: 'Data Classification and Handling Policy',
      description: 'Policy for classifying and handling sensitive organizational data',
      type: 'Data Classification',
      category: 'Technical Control',
      source: 'Industry Standard',
      tags: ['Data Classification', 'Data Protection', 'Confidentiality', 'Compliance'],
      content: `# Data Classification and Handling Policy

## 1. Purpose
This policy establishes a framework for classifying organizational data based on its sensitivity and value, and defines appropriate handling, storage, and protection requirements.

## 2. Scope
This policy applies to all organizational data in any format (electronic, physical, or verbal) and all personnel who create, access, process, store, or transmit such data.

## 3. Data Classification Levels

### 3.1 Public Data
**Definition:** Information that can be freely shared with the public without risk to the organization.
**Examples:** Marketing materials, published research, public website content
**Handling Requirements:**
- No special protection required
- Can be transmitted via any method
- Can be stored on any approved system

### 3.2 Internal Data
**Definition:** Information intended for use within the organization but not for public distribution.
**Examples:** Internal policies, procedures, organizational charts
**Handling Requirements:**
- Access limited to employees and authorized contractors
- Encryption required for email transmission outside organization
- Must be stored on approved organizational systems

### 3.3 Confidential Data
**Definition:** Sensitive information that could cause harm to the organization if disclosed.
**Examples:** Employee records, customer data, financial information, proprietary research
**Handling Requirements:**
- Access on need-to-know basis only
- Encryption required for storage and transmission
- Multi-factor authentication required for access
- Annual access review required

### 3.4 Restricted Data
**Definition:** Highly sensitive information requiring the highest level of protection.
**Examples:** Trade secrets, classified government information, payment card data
**Handling Requirements:**
- Access limited to specifically authorized individuals
- Strong encryption required (AES-256 or equivalent)
- Dedicated secure storage systems required
- Quarterly access review required
- Special approval required for any sharing

## 4. Data Handling Requirements

### 4.1 Data Creation and Collection
- All data must be classified at the point of creation or collection
- Data classification labels must be applied to documents and systems
- Only necessary data should be collected (data minimization principle)

### 4.2 Data Storage
- Data must be stored in approved systems appropriate for its classification level
- Encryption requirements must be met based on classification level
- Regular backups must be performed for all business-critical data
- Data retention schedules must be followed

### 4.3 Data Transmission
- Email encryption required for Confidential and Restricted data
- Secure file transfer protocols required for sensitive data
- Personal email accounts cannot be used for organizational data
- Removable media must be encrypted for Confidential and Restricted data

### 4.4 Data Access and Sharing
- Access controls must be implemented based on classification level
- Third-party sharing requires appropriate agreements (NDAs, contracts)
- Data sharing must be logged and monitored
- Regular access reviews must be conducted

## 5. Data Labeling and Marking
- Electronic documents must include classification in headers/footers
- Physical documents must be marked with classification level
- Email containing sensitive data must include classification in subject line
- Systems processing sensitive data must display appropriate warnings

## 6. Data Disposal and Destruction
- Data must be disposed of according to retention schedules
- Secure deletion methods required for electronic data
- Physical documents must be shredded or incinerated
- Hard drives must be wiped or physically destroyed
- Certificates of destruction required for Restricted data

## 7. Incident Response
- Data breaches must be reported immediately
- Classification level determines incident response procedures
- Regulatory notification requirements based on data type
- Post-incident review and lessons learned required

## 8. Training and Awareness
- All personnel must receive data classification training
- Annual refresher training required
- Role-specific training for data handlers
- Regular awareness communications

## 9. Compliance and Monitoring
- Regular audits of data classification practices
- Monitoring of data access and sharing
- Compliance with applicable regulations (GDPR, HIPAA, PCI-DSS)
- Violations result in disciplinary action

## 10. Responsibilities

### 10.1 Data Owners
- Determine appropriate classification level
- Approve access requests
- Conduct regular access reviews
- Ensure compliance with handling requirements

### 10.2 Data Custodians
- Implement technical controls
- Monitor data access and usage
- Perform regular backups
- Report security incidents

### 10.3 Data Users
- Follow handling requirements
- Report suspected incidents
- Attend required training
- Protect data in their custody

**Effective Date:** [Date]
**Review Date:** [Date + 1 Year]
**Approved By:** [Chief Information Security Officer]`
    },
    {
      id: 'acceptable-use-001',
      title: 'Acceptable Use Policy',
      description: 'Policy governing the acceptable use of organizational IT resources',
      type: 'Acceptable Use',
      category: 'Organizational Control',
      source: 'Industry Standard',
      tags: ['Acceptable Use', 'IT Resources', 'Security', 'Compliance'],
      content: `# Acceptable Use Policy

## 1. Purpose
This policy defines the acceptable use of organizational information technology resources and establishes guidelines for appropriate behavior when using these resources.

## 2. Scope
This policy applies to all employees, contractors, vendors, and any other users granted access to organizational IT resources, including but not limited to computers, networks, email systems, internet access, and mobile devices.

## 3. Acceptable Use Guidelines

### 3.1 Business Use
IT resources are provided primarily for legitimate business purposes. Limited personal use is permitted provided it:
- Does not interfere with work responsibilities
- Does not consume significant resources
- Complies with all applicable policies
- Does not create legal liability for the organization

### 3.2 Professional Conduct
Users must maintain professional standards when using IT resources and:
- Respect the rights and property of others
- Use appropriate language in all communications
- Respect intellectual property rights
- Comply with software licensing agreements

### 3.3 Security Responsibilities
Users are responsible for:
- Protecting their login credentials
- Reporting security incidents immediately
- Installing only approved software
- Following data handling procedures
- Keeping systems updated with security patches

## 4. Prohibited Activities

### 4.1 Illegal Activities
- Violating applicable laws and regulations
- Software piracy or copyright infringement
- Accessing systems without authorization
- Harassment, discrimination, or hate speech
- Fraud, identity theft, or financial crimes

### 4.2 Malicious Activities
- Installing or distributing malware
- Attempting to disrupt or damage systems
- Unauthorized access to data or systems
- Creating or distributing inappropriate content
- Circumventing security controls

### 4.3 Inappropriate Content
- Accessing, storing, or distributing pornographic material
- Gambling or gaming (except approved business applications)
- Hate speech or discriminatory content
- Threatening or violent content
- Content that creates a hostile work environment

### 4.4 Resource Abuse
- Excessive personal use that impacts business operations
- Cryptocurrency mining or similar resource-intensive activities
- Commercial activities unrelated to business
- Bandwidth-intensive activities during business hours
- Storing large amounts of personal data

## 5. Email and Communication Guidelines

### 5.1 Email Use
- Use professional language and tone
- Include appropriate subject lines
- Avoid sending large attachments unnecessarily
- Do not forward chain letters or spam
- Use company email for business purposes primarily

### 5.2 Social Media and External Communications
- Do not speak on behalf of the organization without authorization
- Identify personal opinions as such
- Respect confidential and proprietary information
- Follow applicable social media policies
- Consider the impact on the organization's reputation

## 6. Internet and Web Browsing

### 6.1 Acceptable Web Use
- Business-related research and activities
- Limited personal use during breaks
- Educational and professional development
- News and information relevant to work

### 6.2 Restricted Web Use
- Sites containing inappropriate content
- Streaming media during business hours (unless business-related)
- Social media during business hours (limited use permitted)
- Online shopping during business hours
- Gaming or entertainment sites during business hours

## 7. Mobile Device and Remote Access

### 7.1 Company-Provided Devices
- Use appropriate security settings
- Install only approved applications
- Report lost or stolen devices immediately
- Allow remote wipe capability
- Follow bring-your-own-device (BYOD) policies

### 7.2 Remote Access
- Use only approved VPN connections
- Ensure secure physical environment
- Log off when not in use
- Do not allow others to use company resources
- Follow home office security guidelines

## 8. Software and Technology Use

### 8.1 Software Installation
- Install only approved and licensed software
- Request approval for new software through IT department
- Do not use unauthorized cloud services
- Keep software updated with security patches
- Report software issues to IT support

### 8.2 Data Management
- Follow data classification and handling policies
- Use approved cloud storage services only
- Do not store business data on personal devices
- Regularly backup important data
- Securely dispose of data when no longer needed

## 9. Monitoring and Privacy

### 9.1 Monitoring Activities
The organization reserves the right to:
- Monitor network traffic and system usage
- Review email and internet usage logs
- Audit system access and file usage
- Investigate suspected policy violations
- Implement technical controls to enforce policies

### 9.2 Privacy Expectations
- Users have limited expectation of privacy
- All activities may be logged and monitored
- Personal communications may be reviewed during investigations
- Data on company systems belongs to the organization
- Users will be notified of monitoring activities where legally required

## 10. Incident Reporting
Users must immediately report:
- Suspected security breaches
- Malware infections
- Unauthorized access attempts
- Lost or stolen devices
- Suspected policy violations

## 11. Consequences of Violations
Violations of this policy may result in:
- Verbal or written warnings
- Suspension of IT privileges
- Disciplinary action up to termination
- Legal action where applicable
- Financial responsibility for damages

## 12. Training and Awareness
- All users must acknowledge this policy before receiving access
- Annual refresher training required
- New employee orientation includes policy review
- Regular security awareness communications
- Updates communicated when policy changes

**Effective Date:** [Date]
**Review Date:** [Date + 1 Year]
**Approved By:** [Chief Information Officer]`
    }
  ];

  useEffect(() => {
    setTemplates(securityPolicyTemplates);
  }, []);

  const importTemplate = async (template: PolicyTemplate) => {
    try {
      setLoading(true);
      await createPolicy({
        title: template.title,
        description: template.description,
        content: template.content,
        type: template.type,
        tags: [...template.tags, 'Template', template.source],
        status: 'draft',
      });

      toast({
        title: "Success",
        description: `${template.title} template imported successfully`,
      });
    } catch (error) {
      console.error('Error importing template:', error);
      toast({
        title: "Error",
        description: "Failed to import template",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    templates,
    loading,
    importTemplate,
  };
}
