
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
    title: "Network Security Policy",
    description: "Comprehensive network security policy covering firewalls, intrusion detection, and network monitoring for enterprise environments.",
    type: "Network Security",
    category: "Technical Control" as const,
    status: "active" as const,
    content: `# Network Security Policy

## 1. Purpose
This policy establishes security requirements for network infrastructure to protect organizational data and systems from unauthorized access and cyber threats.

## 2. Scope
This policy applies to all network devices, connections, and communications within the organizational network infrastructure.

## 3. Network Architecture
### 3.1 Network Segmentation
- Implementation of network zones based on security requirements
- DMZ for public-facing services
- Internal networks for business operations
- Restricted networks for sensitive systems

### 3.2 Firewall Requirements
- Stateful firewall inspection for all network traffic
- Default deny policy with explicit allow rules
- Regular review and update of firewall rules
- Logging of all blocked and allowed connections

## 4. Access Controls
### 4.1 Network Access
- Authentication required for all network access
- Network Access Control (NAC) implementation
- Device compliance verification before network access
- Guest network isolation from business networks

### 4.2 Remote Access
- VPN required for all remote connections
- Multi-factor authentication for VPN access
- Endpoint security compliance verification
- Session monitoring and logging

## 5. Monitoring and Detection
### 5.1 Intrusion Detection
- Network-based intrusion detection system (NIDS)
- Real-time monitoring of network traffic
- Automated alerts for suspicious activities
- Regular tuning of detection rules

### 5.2 Network Monitoring
- Continuous monitoring of network performance
- Bandwidth utilization tracking
- Anomaly detection and alerting
- Regular network security assessments

## 6. Wireless Security
- WPA3 encryption for all wireless networks
- Regular password rotation for wireless access
- Guest network isolation
- Wireless intrusion detection and prevention

## 7. Incident Response
- Network incident response procedures
- Isolation capabilities for compromised systems
- Network forensics capabilities
- Coordination with cybersecurity incident response team

## 8. Compliance and Auditing
- Regular network security audits
- Vulnerability assessments and penetration testing
- Compliance with industry standards and regulations
- Documentation of network security controls`,
    tags: ["network-security", "firewall", "intrusion-detection", "monitoring", "VPN"],
    author: "Policy Repository Templates"
  },
  {
    title: "Physical Security Policy",
    description: "Physical security controls for facilities, equipment, and personnel access to protect organizational assets.",
    type: "Physical Security",
    category: "Physical Control" as const,
    status: "active" as const,
    content: `# Physical Security Policy

## 1. Purpose
This policy establishes physical security requirements to protect organizational facilities, equipment, and personnel from unauthorized access and physical threats.

## 2. Scope
This policy applies to all organizational facilities, equipment, and personnel access controls.

## 3. Facility Security
### 3.1 Perimeter Security
- Secured building perimeters with appropriate barriers
- Controlled access points with security personnel or systems
- Surveillance systems covering all entry/exit points
- Visitor management and escort procedures

### 3.2 Access Controls
- Badge-based access control systems
- Multi-factor authentication for sensitive areas
- Tailgating prevention measures
- Regular access review and updates

## 4. Equipment Security
### 4.1 Server Rooms and Data Centers
- Restricted access with biometric or multi-factor authentication
- Environmental controls (temperature, humidity, fire suppression)
- Uninterruptible power supply (UPS) systems
- 24/7 monitoring and surveillance

### 4.2 Workstation Security
- Cable locks for desktop computers and monitors
- Clean desk policy enforcement
- Secure storage for sensitive documents
- Equipment inventory and tracking

## 5. Personnel Security
### 5.1 Background Checks
- Comprehensive background verification for all personnel
- Regular re-verification for sensitive positions
- Third-party contractor screening requirements
- Ongoing monitoring for security clearance personnel

### 5.2 Security Awareness
- Physical security training for all personnel
- Tailgating awareness and prevention training
- Reporting procedures for security incidents
- Regular security reminders and updates

## 6. Visitor Management
- Pre-registration and approval process
- Escort requirements for all visitors
- Visitor badge identification system
- Logging of all visitor activities

## 7. Emergency Procedures
- Evacuation plans and procedures
- Emergency contact information
- Coordination with local emergency services
- Business continuity planning

## 8. Monitoring and Compliance
- Regular physical security assessments
- Surveillance system monitoring and maintenance
- Compliance with regulatory requirements
- Incident reporting and investigation procedures`,
    tags: ["physical-security", "facility-security", "access-control", "surveillance", "emergency-procedures"],
    author: "Policy Repository Templates"
  },
  {
    title: "Cryptography Policy",
    description: "Organizational cryptography policy defining encryption standards, key management, and cryptographic controls for data protection.",
    type: "Cryptography",
    category: "Technical Control" as const,
    status: "active" as const,
    content: `# Cryptography Policy

## 1. Purpose
This policy establishes cryptographic standards and controls to protect organizational data through encryption, digital signatures, and secure key management.

## 2. Scope
This policy applies to all cryptographic implementations, encryption technologies, and key management systems within the organization.

## 3. Encryption Standards
### 3.1 Approved Algorithms
- AES-256 for symmetric encryption
- RSA-2048 or higher for asymmetric encryption
- SHA-256 or higher for hashing
- Elliptic Curve Cryptography (ECC) for mobile applications

### 3.2 Data-at-Rest Encryption
- Full disk encryption for all workstations and laptops
- Database encryption for sensitive data
- File-level encryption for confidential documents
- Cloud storage encryption requirements

### 3.3 Data-in-Transit Encryption
- TLS 1.3 for web communications
- VPN encryption for remote access
- Email encryption for sensitive communications
- API encryption for data exchanges

## 4. Key Management
### 4.1 Key Generation
- Use of approved random number generators
- Minimum key length requirements
- Key generation in secure environments
- Documentation of key generation procedures

### 4.2 Key Storage and Protection
- Hardware Security Modules (HSM) for critical keys
- Secure key escrow and backup procedures
- Access controls for key management systems
- Regular key rotation schedules

### 4.3 Key Distribution
- Secure channels for key distribution
- Authentication of key recipients
- Non-repudiation mechanisms
- Key distribution logging and auditing

## 5. Digital Signatures
- PKI infrastructure for digital certificates
- Code signing for software distribution
- Document signing for legal compliance
- Certificate lifecycle management

## 6. Mobile Device Encryption
- Device encryption for all mobile devices
- Container encryption for business applications
- Remote wipe capabilities
- Mobile device management (MDM) integration

## 7. Cloud Cryptography
- Customer-managed encryption keys (CMEK)
- Encryption key residency requirements
- Cloud provider encryption assessments
- Multi-cloud encryption standards

## 8. Quantum-Safe Cryptography
- Assessment of quantum computing threats
- Migration planning for post-quantum cryptography
- Hybrid cryptographic implementations
- Regular updates to quantum-safe standards

## 9. Compliance and Monitoring
- Regular cryptographic assessments
- Compliance with FIPS 140-2 standards
- Vulnerability management for cryptographic systems
- Incident response for cryptographic failures`,
    tags: ["cryptography", "encryption", "key-management", "digital-signatures", "quantum-safe"],
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
    filterStatus: string = ''
  ) => {
    try {
      const statusFilter = filterStatus as 'draft' | 'active' | 'archived' | 'under_review' | '';
      
      const results = await searchPoliciesBase(searchQuery, filterTags, filterType, statusFilter);
      
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
