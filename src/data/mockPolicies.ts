
import { Policy } from "@/types/policy";

export const mockPolicies: Policy[] = [
  {
    policy_id: "POL-001",
    title: "Password Policy",
    description: "Comprehensive password requirements and management guidelines for all organizational systems and user accounts.",
    type: "Access Control",
    status: "active",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-03-20T14:30:00Z",
    author: "John Smith",
    content: `# Password Policy

## Purpose
This policy establishes minimum password requirements to protect organizational information assets.

## Scope
This policy applies to all employees, contractors, and third parties accessing organizational systems.

## Password Requirements
- Minimum 12 characters in length
- Must contain uppercase and lowercase letters
- Must include at least one number and special character
- Cannot reuse the last 12 passwords
- Must be changed every 90 days

## Multi-Factor Authentication
All privileged accounts must use multi-factor authentication.

## Password Storage
Passwords must be stored using approved encryption methods.`,
    currentVersion: "2.1",
    tags: ["Access Control", "Authentication", "Compliance", "ISO 27001"],
    framework_category: "technical",
    security_domain: "Access Control",
    versions: [
      {
        version_id: "v1",
        version_label: "v1.0",
        description: "Initial password policy",
        created_at: "2024-01-15T10:00:00Z",
        edited_by: "John Smith"
      },
      {
        version_id: "v2",
        version_label: "v2.0",
        description: "Added MFA requirements",
        created_at: "2024-02-10T09:15:00Z",
        edited_by: "Sarah Johnson"
      },
      {
        version_id: "v3",
        version_label: "v2.1",
        description: "Updated password length requirement",
        created_at: "2024-03-20T14:30:00Z",
        edited_by: "Mike Davis"
      }
    ]
  },
  {
    policy_id: "POL-002",
    title: "Data Classification Policy",
    description: "Framework for classifying and handling organizational data based on sensitivity and regulatory requirements.",
    type: "Data Classification",
    status: "active",
    created_at: "2024-01-20T11:30:00Z",
    updated_at: "2024-02-28T16:45:00Z",
    author: "Sarah Johnson",
    content: `# Data Classification Policy

## Purpose
To ensure proper handling and protection of organizational data based on its classification level.

## Data Classification Levels

### Public
Information that can be freely shared without risk to the organization.

### Internal
Information intended for use within the organization but not for external distribution.

### Confidential
Sensitive information that could harm the organization if disclosed inappropriately.

### Restricted
Highly sensitive information requiring the highest level of protection.

## Handling Requirements
Each classification level has specific requirements for:
- Storage and encryption
- Access controls
- Transmission methods
- Retention periods
- Disposal procedures`,
    currentVersion: "1.2",
    tags: ["Data Classification", "Privacy", "GDPR", "Compliance"],
    framework_category: "organizational",
    security_domain: "Asset Management",
    versions: [
      {
        version_id: "v1",
        version_label: "v1.0",
        description: "Initial data classification framework",
        created_at: "2024-01-20T11:30:00Z",
        edited_by: "Sarah Johnson"
      },
      {
        version_id: "v2",
        version_label: "v1.2",
        description: "Added GDPR compliance requirements",
        created_at: "2024-02-28T16:45:00Z",
        edited_by: "Legal Team"
      }
    ]
  },
  {
    policy_id: "POL-003",
    title: "Network Security Policy",
    description: "Comprehensive guidelines for securing network infrastructure, monitoring traffic, and preventing unauthorized access.",
    type: "Network Security",
    status: "active",
    created_at: "2024-01-10T08:00:00Z",
    updated_at: "2024-03-15T12:20:00Z",
    author: "Mike Davis",
    content: `# Network Security Policy

## Purpose
To establish security controls for network infrastructure and communications.

## Network Segmentation
- Critical systems must be isolated in secure network segments
- DMZ implementation for external-facing services
- Internal network segregation based on data classification

## Firewall Configuration
- Default deny policy for all connections
- Regular review and approval of firewall rules
- Logging of all blocked and allowed connections

## Wireless Security
- WPA3 encryption for all wireless networks
- Regular rotation of wireless access keys
- Separate guest networks with limited access

## Network Monitoring
- 24/7 monitoring of network traffic
- Intrusion detection and prevention systems
- Regular vulnerability assessments`,
    currentVersion: "3.0",
    tags: ["Network Security", "Monitoring", "Firewalls", "NIST"],
    framework_category: "technical",
    security_domain: "Network Security",
    versions: [
      {
        version_id: "v1",
        version_label: "v1.0",
        description: "Initial network security framework",
        created_at: "2024-01-10T08:00:00Z",
        edited_by: "Mike Davis"
      },
      {
        version_id: "v2",
        version_label: "v2.0",
        description: "Added wireless security requirements",
        created_at: "2024-02-05T14:15:00Z",
        edited_by: "Network Team"
      },
      {
        version_id: "v3",
        version_label: "v3.0",
        description: "Enhanced monitoring requirements",
        created_at: "2024-03-15T12:20:00Z",
        edited_by: "Security Operations"
      }
    ]
  },
  {
    policy_id: "POL-004",
    title: "Incident Response Policy",
    description: "Procedures for detecting, responding to, and recovering from security incidents and data breaches.",
    type: "Incident Response",
    status: "active",
    created_at: "2024-02-01T09:00:00Z",
    updated_at: "2024-03-10T11:45:00Z",
    author: "Emma Wilson",
    content: `# Incident Response Policy

## Purpose
To establish procedures for effective response to security incidents.

## Incident Classification
### Severity Levels
- **Critical**: Major breach affecting customer data or core systems
- **High**: Significant impact on business operations
- **Medium**: Limited impact with potential for escalation
- **Low**: Minor incidents with minimal business impact

## Response Team
- Incident Commander
- Security Analyst
- IT Operations
- Legal Counsel
- Communications Lead

## Response Procedures
1. Detection and Analysis
2. Containment and Eradication
3. Recovery and Post-Incident Activities
4. Lessons Learned and Documentation

## Communication Requirements
- Internal notification within 1 hour
- Customer notification within 24 hours (if applicable)
- Regulatory notification as required by law`,
    currentVersion: "2.0",
    tags: ["Incident Response", "Security Operations", "Compliance", "GDPR"],
    framework_category: "organizational",
    security_domain: "Incident Management",
    versions: [
      {
        version_id: "v1",
        version_label: "v1.0",
        description: "Initial incident response procedures",
        created_at: "2024-02-01T09:00:00Z",
        edited_by: "Emma Wilson"
      },
      {
        version_id: "v2",
        version_label: "v2.0",
        description: "Updated notification timelines",
        created_at: "2024-03-10T11:45:00Z",
        edited_by: "Compliance Team"
      }
    ]
  },
  {
    policy_id: "POL-005",
    title: "Physical Security Policy",
    description: "Controls and procedures for protecting physical assets, facilities, and equipment from unauthorized access.",
    type: "Physical Security",
    status: "active",
    created_at: "2024-01-25T13:15:00Z",
    updated_at: "2024-02-20T10:30:00Z",
    author: "David Brown",
    content: `# Physical Security Policy

## Purpose
To protect organizational facilities, equipment, and personnel from physical threats.

## Access Control
- Badge-based access control systems
- Visitor management and escort procedures
- Regular access reviews and updates
- Tailgating prevention measures

## Facility Security
- Perimeter security with surveillance cameras
- Alarm systems for after-hours monitoring
- Secure areas for sensitive equipment
- Environmental controls and monitoring

## Equipment Protection
- Cable locks for portable devices
- Clean desk policy implementation
- Secure disposal of equipment and media
- Asset tracking and inventory management

## Personnel Security
- Background checks for sensitive positions
- Security awareness training
- Incident reporting procedures
- Emergency response procedures`,
    currentVersion: "1.1",
    tags: ["Physical Security", "Access Control", "Asset Management"],
    framework_category: "physical",
    security_domain: "Physical Security",
    versions: [
      {
        version_id: "v1",
        version_label: "v1.0",
        description: "Initial physical security policy",
        created_at: "2024-01-25T13:15:00Z",
        edited_by: "David Brown"
      },
      {
        version_id: "v2",
        version_label: "v1.1",
        description: "Added equipment protection guidelines",
        created_at: "2024-02-20T10:30:00Z",
        edited_by: "Facilities Team"
      }
    ]
  },
  {
    policy_id: "POL-006",
    title: "Backup and Recovery Policy",
    description: "Procedures for regular data backup, disaster recovery planning, and business continuity management.",
    type: "Backup and Recovery",
    status: "active",
    created_at: "2024-02-10T15:00:00Z",
    updated_at: "2024-03-25T09:15:00Z",
    author: "Lisa Anderson",
    content: `# Backup and Recovery Policy

## Purpose
To ensure business continuity through comprehensive backup and recovery procedures.

## Backup Requirements
- Daily incremental backups of all critical data
- Weekly full system backups
- Monthly backup verification and testing
- Offsite backup storage for disaster recovery

## Recovery Objectives
- **Recovery Time Objective (RTO)**: 4 hours for critical systems
- **Recovery Point Objective (RPO)**: 1 hour maximum data loss
- **Business Impact Analysis**: Updated annually

## Backup Types
### Critical Systems (Tier 1)
- Real-time replication to secondary site
- 15-minute backup intervals
- 99.9% availability requirement

### Important Systems (Tier 2)
- Hourly backups during business hours
- Daily full backups
- 4-hour recovery target

### Standard Systems (Tier 3)
- Daily backups
- 24-hour recovery target

## Testing Requirements
- Monthly restore testing
- Annual disaster recovery exercises
- Documentation of all test results`,
    currentVersion: "1.3",
    tags: ["Backup", "Disaster Recovery", "Business Continuity", "Risk Management"],
    framework_category: "organizational",
    security_domain: "Business Continuity",
    versions: [
      {
        version_id: "v1",
        version_label: "v1.0",
        description: "Initial backup and recovery procedures",
        created_at: "2024-02-10T15:00:00Z",
        edited_by: "Lisa Anderson"
      },
      {
        version_id: "v2",
        version_label: "v1.3",
        description: "Updated RTO and RPO requirements",
        created_at: "2024-03-25T09:15:00Z",
        edited_by: "IT Operations"
      }
    ]
  },
  {
    policy_id: "POL-007",
    title: "Antivirus and Malware Protection Policy",
    description: "Requirements for deploying, maintaining, and monitoring antivirus solutions across all organizational systems.",
    type: "Antivirus Protection",
    status: "active",
    created_at: "2024-01-30T12:00:00Z",
    updated_at: "2024-03-05T14:20:00Z",
    author: "Security Team",
    content: `# Antivirus and Malware Protection Policy

## Purpose
To protect organizational systems from malware, viruses, and other malicious software.

## Coverage Requirements
- All workstations and laptops
- All servers (file, email, web)
- Mobile devices accessing corporate data
- Network-attached storage systems

## Solution Requirements
- Real-time protection enabled
- Automatic definition updates
- Scheduled full system scans
- Centralized management and reporting

## Response Procedures
### Malware Detection
1. Immediate quarantine of infected systems
2. Analysis of infection source and scope
3. Remediation and system cleaning
4. Post-incident review and improvements

### Update Management
- Daily signature updates
- Immediate updates for critical threats
- Testing of updates in isolated environment
- Rollback procedures for problematic updates

## Monitoring and Reporting
- Daily review of detection logs
- Weekly summary reports to management
- Quarterly trend analysis
- Annual policy review and updates`,
    currentVersion: "2.2",
    tags: ["Antivirus", "Malware Protection", "Endpoint Security", "Monitoring"],
    framework_category: "technical",
    security_domain: "System Security",
    versions: [
      {
        version_id: "v1",
        version_label: "v1.0",
        description: "Initial antivirus policy",
        created_at: "2024-01-30T12:00:00Z",
        edited_by: "Security Team"
      },
      {
        version_id: "v2",
        version_label: "v2.2",
        description: "Enhanced mobile device requirements",
        created_at: "2024-03-05T14:20:00Z",
        edited_by: "Mobile Security Team"
      }
    ]
  }
];
