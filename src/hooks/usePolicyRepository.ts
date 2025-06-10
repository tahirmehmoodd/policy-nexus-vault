
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

## 1. Purpose and Scope
This policy establishes comprehensive guidelines for controlling access to organizational information systems, applications, and data to ensure confidentiality, integrity, and availability. This policy applies to all employees, contractors, vendors, and third parties who require access to organizational systems.

## 2. Policy Statement
Access to organizational information systems shall be granted based on the principle of least privilege and need-to-know basis. All access requests must be properly authorized, documented, and regularly reviewed.

## 3. Access Control Framework

### 3.1 Identity Management
- **Unique User Identification**: Each individual must have a unique user identifier
- **User Registration**: Formal process for registering new users with appropriate authorization
- **User De-registration**: Immediate removal of access upon termination or role change
- **Account Lifecycle Management**: Regular review and maintenance of user accounts

### 3.2 Authentication Requirements
- **Multi-Factor Authentication (MFA)**: Required for all privileged accounts and remote access
- **Password Standards**: Minimum 14 characters with complexity requirements
- **Password Rotation**: Every 90 days for privileged accounts, 180 days for standard accounts
- **Account Lockout**: Automatic lockout after 5 failed login attempts
- **Session Management**: Automatic timeout after 30 minutes of inactivity

### 3.3 Authorization Controls
- **Role-Based Access Control (RBAC)**: Access permissions based on job functions
- **Segregation of Duties**: Critical functions divided among multiple individuals
- **Privileged Access Management**: Enhanced controls for administrative accounts
- **Data Access Controls**: Classification-based access restrictions

## 4. Access Request and Approval Process

### 4.1 Standard Access Requests
1. Employee/contractor submits access request through approved channels
2. Direct supervisor approves business justification
3. Data/system owner approves technical access requirements
4. IT Security reviews and validates request
5. IT Administration provisions access
6. Access confirmation sent to requestor and supervisor

### 4.2 Emergency Access Procedures
- Emergency access accounts available for critical situations
- Emergency access requires dual authorization
- All emergency access activities logged and reviewed within 24 hours
- Temporary emergency access automatically expires within 72 hours

## 5. Access Review and Monitoring

### 5.1 Regular Access Reviews
- **Quarterly Reviews**: All user access rights reviewed by data owners
- **Annual Certifications**: Comprehensive review of all access privileges
- **Role-Based Reviews**: Access validated against current job responsibilities
- **Terminated User Reviews**: Verification of complete access removal

### 5.2 Continuous Monitoring
- **Real-time Monitoring**: Automated monitoring of user activities and access patterns
- **Anomaly Detection**: Identification of unusual access patterns or behaviors
- **Failed Access Attempts**: Monitoring and alerting on authentication failures
- **Privileged Activity Monitoring**: Enhanced monitoring of administrative activities

## 6. Remote Access Security

### 6.1 VPN Requirements
- All remote connections must use approved VPN solutions
- Multi-factor authentication required for VPN access
- VPN client security compliance verification
- Regular VPN access reviews and audits

### 6.2 Mobile Device Access
- Mobile Device Management (MDM) enrollment required
- Device encryption and screen lock enforcement
- Remote wipe capabilities for lost or stolen devices
- Approved application whitelist for business use

## 7. Third-Party Access Management

### 7.1 Vendor Access Controls
- Formal agreements defining access requirements and limitations
- Time-limited access with automatic expiration
- Monitoring and logging of all vendor activities
- Regular review of vendor access privileges

### 7.2 Guest Access Procedures
- Temporary guest accounts with limited access
- Sponsor accountability for guest activities
- Automatic account expiration
- Network segregation for guest access

## 8. Incident Response and Violations

### 8.1 Access Violations
- Immediate investigation of suspected access violations
- Temporary suspension of access pending investigation
- Disciplinary actions for policy violations
- Legal action for criminal activities

### 8.2 Incident Reporting
- Mandatory reporting of access control incidents
- Documentation of incident response activities
- Post-incident review and policy updates
- Communication to affected stakeholders

## 9. Compliance and Audit Requirements

### 9.1 Regulatory Compliance
- SOX compliance for financial systems access
- HIPAA compliance for healthcare information access
- PCI-DSS compliance for payment card data access
- GDPR compliance for personal data access

### 9.2 Audit Trail Requirements
- Comprehensive logging of all access activities
- Log retention for minimum 7 years
- Regular audit trail reviews
- Tamper-evident log storage

## 10. Training and Awareness

### 10.1 Security Awareness Training
- Annual security awareness training for all personnel
- Role-specific training for privileged users
- Regular security updates and communications
- Testing and validation of training effectiveness

### 10.2 Access Control Training
- Detailed training on access request procedures
- Training on proper use of access privileges
- Incident reporting procedures training
- Regular refresher training sessions

## 11. Policy Implementation and Maintenance

### 11.1 Implementation Timeline
- Phase 1: Policy approval and communication (Month 1)
- Phase 2: Technical controls implementation (Months 2-3)
- Phase 3: Process implementation and training (Months 4-5)
- Phase 4: Full implementation and monitoring (Month 6)

### 11.2 Policy Maintenance
- Annual policy review and updates
- Regular assessment of control effectiveness
- Technology updates and improvements
- Stakeholder feedback incorporation

## 12. Roles and Responsibilities

### 12.1 Executive Management
- Overall accountability for access control program
- Resource allocation and support
- Policy approval and enforcement

### 12.2 IT Security Team
- Access control policy development and maintenance
- Security monitoring and incident response
- Compliance monitoring and reporting

### 12.3 Data Owners
- Classification and access requirements definition
- Access request approval within domain
- Regular access reviews and certifications

### 12.4 System Administrators
- Technical implementation of access controls
- Account provisioning and de-provisioning
- System monitoring and maintenance

### 12.5 All Personnel
- Compliance with access control policies
- Proper use of access privileges
- Incident reporting and cooperation

## 13. Technology Standards

### 13.1 Authentication Technologies
- SAML 2.0 for federated authentication
- OAuth 2.0/OpenID Connect for application access
- RADIUS for network device authentication
- Kerberos for domain authentication

### 13.2 Access Control Technologies
- Active Directory for user management
- LDAP directories for centralized authentication
- Privileged Access Management (PAM) solutions
- Identity Governance and Administration (IGA) tools

## 14. Metrics and Reporting

### 14.1 Key Performance Indicators
- Access request processing time
- Access review completion rates
- Authentication failure rates
- Privileged account usage statistics

### 14.2 Regular Reporting
- Monthly access control metrics
- Quarterly compliance reports
- Annual security assessment results
- Incident response statistics

This policy is effective immediately and supersedes all previous access control policies. Questions regarding this policy should be directed to the Information Security Office.

**Document Control:**
- Version: 2.1
- Effective Date: January 1, 2024
- Next Review Date: January 1, 2025
- Owner: Chief Information Security Officer
- Approved By: Chief Executive Officer`,
    tags: ["access-control", "authentication", "authorization", "NIST", "security", "compliance", "RBAC", "MFA"],
    author: "Policy Repository Templates"
  },
  {
    title: "Data Classification Policy", 
    description: "Enterprise data classification policy defining sensitivity levels and handling requirements for organizational information assets.",
    type: "Data Classification",
    category: "Organizational Control" as const,
    status: "active" as const,
    content: `# Data Classification Policy

## 1. Executive Summary
This policy establishes a comprehensive framework for classifying organizational data based on sensitivity levels and defining appropriate security controls, handling procedures, and protection requirements for each classification level.

## 2. Purpose and Objectives
- Establish consistent data classification standards across the organization
- Define appropriate protection measures for different data types
- Ensure compliance with legal, regulatory, and contractual obligations
- Enable risk-based security controls implementation
- Facilitate secure data sharing and collaboration

## 3. Scope
This policy applies to all forms of data and information assets owned, processed, stored, or transmitted by the organization, including:
- Electronic data in all formats
- Physical documents and records
- Verbal communications containing sensitive information
- Third-party data under organizational custody

## 4. Data Classification Levels

### 4.1 PUBLIC Data
**Definition**: Information intended for public disclosure or already in the public domain.

**Characteristics**:
- No competitive or operational damage if disclosed
- Already publicly available or intended for public release
- Marketing materials, published research, public announcements

**Examples**:
- Company website content
- Published financial reports
- Marketing brochures and advertisements
- Public product information
- Press releases

**Protection Requirements**:
- Standard backup procedures
- No encryption required for storage or transmission
- Standard access controls
- Regular content review for accuracy

### 4.2 INTERNAL Data
**Definition**: Information intended for use within the organization that could cause minor damage if disclosed externally.

**Characteristics**:
- Operational information for internal business use
- Could cause embarrassment or minor competitive disadvantage if disclosed
- Generally not subject to legal or regulatory protection requirements

**Examples**:
- Internal policies and procedures
- Organizational charts and directories
- Internal newsletters and communications
- Training materials
- General business correspondence

**Protection Requirements**:
- Standard access controls for authenticated users
- Regular backup and recovery procedures
- Secure disposal when no longer needed
- Basic network security controls
- Staff training on proper handling

### 4.3 CONFIDENTIAL Data
**Definition**: Sensitive information that could cause significant damage to the organization if disclosed to unauthorized parties.

**Characteristics**:
- Significant competitive advantage or operational value
- Subject to legal or contractual protection requirements
- Could result in financial loss or reputational damage if compromised
- Requires special handling and protection measures

**Examples**:
- Customer databases and contact information
- Financial records and reports
- Strategic business plans
- Vendor contracts and agreements
- Personnel records (non-sensitive portions)
- Technical specifications and designs
- Marketing strategies and campaigns

**Protection Requirements**:
- Role-based access controls with need-to-know restrictions
- Encryption required for storage and transmission
- Secure backup with encrypted storage
- Network security controls and monitoring
- Secure disposal and destruction procedures
- Data loss prevention (DLP) monitoring
- Regular access reviews and audits
- Incident response procedures for data breaches

### 4.4 RESTRICTED Data
**Definition**: Highly sensitive information requiring maximum protection due to legal, regulatory, or business-critical requirements.

**Characteristics**:
- Could cause severe damage if disclosed, modified, or destroyed
- Subject to strict legal or regulatory requirements
- Requires highest level of security controls
- Limited access on strict need-to-know basis

**Examples**:
- Social Security numbers and tax identification numbers
- Credit card and payment information
- Medical records and health information
- Trade secrets and proprietary algorithms
- Legal privileged communications
- Security procedures and controls
- Executive compensation details
- Merger and acquisition information

**Protection Requirements**:
- Multi-factor authentication for access
- Strong encryption for storage and transmission (AES-256)
- Highly restricted access with detailed logging
- Segregated network environments
- Enhanced monitoring and alerting
- Secure destruction with certificate of destruction
- Regular penetration testing and vulnerability assessments
- Executive approval for access provisioning
- Annual access certifications

## 5. Data Classification Procedures

### 5.1 Classification Assignment
**Data Owners Responsibilities**:
- Classify data at creation or acquisition
- Apply appropriate classification labels
- Define access requirements and restrictions
- Review and update classifications regularly
- Communicate classification requirements to users

**Classification Criteria**:
- Legal and regulatory requirements
- Contractual obligations
- Business impact if compromised
- Competitive sensitivity
- Privacy considerations

### 5.2 Classification Labeling
**Electronic Data**:
- Metadata tags in document properties
- File naming conventions with classification codes
- Email subject line classification markers
- Database field classifications
- Application-level classification controls

**Physical Documents**:
- Classification stamps or labels on each page
- Cover sheets indicating classification level
- Secure storage container labels
- Transport container markings

### 5.3 Classification Review and Updates
- Annual review of all data classifications
- Event-driven reviews for significant changes
- Systematic review of aging data
- Declassification procedures for expired sensitive data
- Documentation of classification changes

## 6. Handling Requirements by Classification

### 6.1 Storage Requirements
**PUBLIC/INTERNAL**:
- Standard file systems and databases
- Regular backup procedures
- Basic access controls

**CONFIDENTIAL**:
- Encrypted file systems or databases
- Secure backup with encryption
- Role-based access controls
- Protected storage environments

**RESTRICTED**:
- High-security encrypted storage
- Hardware security modules (HSM) for encryption keys
- Segregated storage environments
- Redundant secure backup systems

### 6.2 Transmission Requirements
**PUBLIC/INTERNAL**:
- Standard email and file transfer
- Basic network security protocols

**CONFIDENTIAL**:
- Encrypted email or secure file transfer
- TLS 1.3 for web-based transmission
- Secure courier for physical documents
- Recipient verification procedures

**RESTRICTED**:
- End-to-end encryption mandatory
- Secure dedicated transmission channels
- Multi-factor authentication for access
- Delivery confirmation and audit trails

### 6.3 Access Control Requirements
**PUBLIC**:
- No specific access restrictions
- Basic authentication for internal systems

**INTERNAL**:
- Authenticated user access
- Basic role-based permissions
- Standard user account management

**CONFIDENTIAL**:
- Need-to-know access controls
- Regular access reviews (quarterly)
- Detailed access logging
- Supervisor approval for access requests

**RESTRICTED**:
- Strict need-to-know access
- Executive approval for access
- Continuous access monitoring
- Monthly access certifications
- Multi-factor authentication mandatory

## 7. Data Lifecycle Management

### 7.1 Data Creation and Acquisition
- Classification assignment at creation
- Appropriate security controls implementation
- Documentation of data sources and lineage
- Compliance verification for acquired data

### 7.2 Data Processing and Use
- Authorized use only according to classification
- Monitoring of data access and usage
- Incident response for unauthorized use
- Regular compliance audits

### 7.3 Data Retention and Archival
- Retention schedules based on classification
- Secure archival procedures
- Regular review of archived data
- Migration of aging data to appropriate storage

### 7.4 Data Disposal and Destruction
**PUBLIC/INTERNAL**:
- Standard deletion procedures
- Media sanitization for storage devices

**CONFIDENTIAL**:
- Secure deletion with verification
- Physical destruction of storage media
- Certificate of destruction for physical documents

**RESTRICTED**:
- Multi-pass secure deletion
- Physical destruction by certified vendors
- Witnessed destruction procedures
- Detailed destruction documentation

## 8. Third-Party Data Handling

### 8.1 Data Sharing Agreements
- Classification levels in all data sharing agreements
- Specific handling requirements documentation
- Regular compliance monitoring
- Incident notification procedures

### 8.2 Cloud Service Providers
- Classification-appropriate cloud services
- Contractual security requirements
- Regular security assessments
- Data residency and sovereignty compliance

### 8.3 Vendor Management
- Classification awareness in vendor contracts
- Security requirements based on data classification
- Regular vendor security assessments
- Incident response coordination

## 9. Training and Awareness

### 9.1 General Training Requirements
- Annual data classification training for all staff
- Role-specific training for data handlers
- Regular awareness updates and communications
- Testing and validation of training effectiveness

### 9.2 Specialized Training
- Data owner responsibilities training
- System administrator security training
- Incident response team training
- Third-party contractor training

## 10. Compliance and Monitoring

### 10.1 Regulatory Compliance
- GDPR compliance for personal data
- HIPAA compliance for health information
- SOX compliance for financial data
- Industry-specific regulatory requirements

### 10.2 Monitoring and Auditing
- Regular classification compliance audits
- Data loss prevention monitoring
- Access pattern analysis
- Incident investigation and response

## 11. Incident Response

### 11.1 Data Classification Violations
- Immediate incident reporting procedures
- Rapid response team activation
- Impact assessment and containment
- Corrective action implementation

### 11.2 Data Breach Response
- Classification-based response procedures
- Stakeholder notification requirements
- Regulatory reporting obligations
- Post-incident review and improvement

## 12. Policy Enforcement

### 12.1 Compliance Monitoring
- Regular policy compliance assessments
- Automated compliance monitoring tools
- Risk-based audit procedures
- Performance metrics and reporting

### 12.2 Violation Consequences
- Progressive disciplinary actions
- Retraining requirements
- Access privilege reviews
- Termination for serious violations

## 13. Roles and Responsibilities

### 13.1 Data Governance Committee
- Policy oversight and approval
- Classification standard development
- Dispute resolution
- Strategic direction

### 13.2 Data Protection Officer
- Policy implementation coordination
- Compliance monitoring and reporting
- Training program management
- Incident response coordination

### 13.3 Data Owners
- Data classification assignment
- Access requirement definition
- Regular classification reviews
- Compliance monitoring within domain

### 13.4 Data Custodians
- Technical control implementation
- Security measure maintenance
- Backup and recovery operations
- Incident response support

### 13.5 Data Users
- Policy compliance
- Proper data handling
- Incident reporting
- Training participation

## 14. Technology and Tools

### 14.1 Classification Tools
- Automated data discovery and classification
- Content inspection and analysis
- Machine learning classification assistance
- Classification workflow automation

### 14.2 Protection Technologies
- Data encryption and key management
- Data loss prevention (DLP) systems
- Rights management solutions
- Secure communication platforms

## 15. Metrics and Reporting

### 15.1 Key Performance Indicators
- Classification coverage percentage
- Classification accuracy rates
- Incident response times
- Training completion rates

### 15.2 Regular Reporting
- Monthly compliance metrics
- Quarterly classification reviews
- Annual policy effectiveness assessment
- Incident trend analysis

This policy establishes the foundation for a robust data protection program and must be implemented in conjunction with related security policies and procedures.

**Document Control:**
- Version: 3.0
- Effective Date: January 1, 2024
- Next Review Date: January 1, 2025
- Owner: Data Protection Officer
- Approved By: Chief Information Officer`,
    tags: ["data-classification", "information-security", "data-protection", "compliance", "privacy", "GDPR", "confidentiality"],
    author: "Policy Repository Templates"
  },
  {
    title: "Network Security Policy",
    description: "Comprehensive network security policy covering firewalls, intrusion detection, and network monitoring for enterprise environments.",
    type: "Network Security",
    category: "Technical Control" as const,
    status: "active" as const,
    content: `# Network Security Policy

## 1. Executive Summary
This policy establishes comprehensive security requirements for network infrastructure to protect organizational data and systems from unauthorized access, cyber threats, and network-based attacks. It defines standards for network architecture, security controls, monitoring, and incident response.

## 2. Purpose and Scope
This policy applies to all network devices, connections, communications, and infrastructure within the organizational network environment, including:
- Corporate local area networks (LANs)
- Wide area networks (WANs)
- Wireless networks
- Remote access connections
- Cloud network connections
- Third-party network integrations

## 3. Network Security Architecture

### 3.1 Network Segmentation Strategy
**Core Principles**:
- Defense in depth implementation
- Network zones based on trust levels and data classification
- Micro-segmentation for critical assets
- Zero-trust network access model

**Network Zones**:
- **Internet Zone**: Public-facing services and resources
- **DMZ (Demilitarized Zone)**: Semi-trusted zone for external-facing services
- **Internal Network**: Corporate user and application environments
- **Management Network**: Network device administration and monitoring
- **Secure Zone**: High-security environment for restricted data and systems

### 3.2 Network Architecture Standards
**Design Requirements**:
- Redundant network paths for critical connections
- Load balancing for high-availability services
- Network access control (NAC) implementation
- Software-defined networking (SDN) where appropriate
- Regular architecture reviews and updates

**Documentation Standards**:
- Current network topology diagrams
- IP address allocation and management plans
- VLAN assignments and configurations
- Routing and switching configurations
- Change management documentation

## 4. Firewall Security Controls

### 4.1 Firewall Architecture
**Implementation Requirements**:
- Next-generation firewalls (NGFW) with deep packet inspection
- Stateful firewall inspection for all network traffic
- Application-layer filtering and control
- Intrusion prevention system (IPS) integration
- SSL/TLS inspection capabilities

**Firewall Placement**:
- Perimeter firewalls for external network protection
- Internal firewalls for network segmentation
- Host-based firewalls for endpoint protection
- Database firewalls for critical data protection

### 4.2 Firewall Rule Management
**Rule Development Standards**:
- Default deny policy with explicit allow rules
- Least privilege access implementation
- Business justification for all rules
- Regular rule review and cleanup
- Automated rule analysis and optimization

**Rule Documentation Requirements**:
- Business justification for each rule
- Rule owner and contact information
- Implementation and review dates
- Change approval documentation
- Risk assessment and mitigation measures

### 4.3 Firewall Monitoring and Maintenance
**Continuous Monitoring**:
- Real-time traffic analysis and alerting
- Bandwidth utilization monitoring
- Connection state monitoring
- Performance metrics collection
- Security event correlation

**Regular Maintenance**:
- Weekly rule utilization analysis
- Monthly rule review and cleanup
- Quarterly firewall configuration audits
- Annual firewall replacement planning
- Emergency change procedures

## 5. Intrusion Detection and Prevention

### 5.1 Network Intrusion Detection System (NIDS)
**Implementation Requirements**:
- Network-based intrusion detection across all network segments
- Signature-based detection for known threats
- Anomaly-based detection for unknown threats
- Protocol analysis and validation
- Real-time alerting and response capabilities

**Detection Capabilities**:
- Malware and virus detection
- Botnet command and control detection
- Data exfiltration detection
- Lateral movement detection
- Advanced persistent threat (APT) detection

### 5.2 Intrusion Prevention System (IPS)
**Prevention Capabilities**:
- Automatic blocking of detected threats
- Rate limiting for suspicious activities
- Quarantine capabilities for infected systems
- Dynamic rule updates and threat intelligence integration
- Coordinated response with other security tools

**Tuning and Optimization**:
- Regular signature updates and testing
- False positive reduction procedures
- Performance optimization and tuning
- Custom signature development
- Threat intelligence integration

### 5.3 Security Information and Event Management (SIEM)
**SIEM Integration**:
- Centralized log collection and analysis
- Real-time event correlation
- Automated incident detection and alerting
- Forensic analysis capabilities
- Compliance reporting and dashboards

**Log Management**:
- Comprehensive network device logging
- Standardized log formats and parsing
- Secure log storage and retention
- Log integrity protection
- Regular log analysis and review

## 6. Network Access Control

### 6.1 Network Access Control (NAC) Implementation
**Access Control Requirements**:
- Device authentication before network access
- Endpoint compliance verification
- Dynamic VLAN assignment based on device type and user
- Guest network isolation and controls
- Automated remediation for non-compliant devices

**Authentication Methods**:
- 802.1X authentication for wired and wireless access
- Certificate-based authentication for devices
- Multi-factor authentication for administrative access
- RADIUS authentication with Active Directory integration
- MAC address filtering for specific device types

### 6.2 Wireless Network Security
**Wireless Security Standards**:
- WPA3 encryption for all wireless networks
- Enterprise-grade authentication (WPA3-Enterprise)
- Guest network isolation and time restrictions
- Wireless intrusion detection and prevention
- Regular wireless security assessments

**Wireless Network Management**:
- Centralized wireless controller management
- Regular password rotation procedures
- Rogue access point detection and mitigation
- Wireless coverage optimization
- Capacity planning and monitoring

### 6.3 Remote Access Security
**VPN Requirements**:
- SSL/IPSec VPN for all remote connections
- Multi-factor authentication for VPN access
- Split tunneling restrictions for security
- Endpoint compliance verification before access
- Session monitoring and logging

**Remote Access Controls**:
- Time-based access restrictions
- Geographic access limitations
- Device registration and approval processes
- Regular access reviews and certifications
- Automatic session termination procedures

## 7. Network Monitoring and Analysis

### 7.1 Network Performance Monitoring
**Monitoring Capabilities**:
- Real-time bandwidth utilization monitoring
- Application performance monitoring
- Network latency and packet loss tracking
- Quality of Service (QoS) monitoring
- Capacity planning and trend analysis

**Performance Baselines**:
- Normal traffic pattern establishment
- Peak usage identification and planning
- Service level agreement (SLA) monitoring
- Performance degradation alerting
- Capacity threshold monitoring

### 7.2 Security Monitoring
**Security Event Monitoring**:
- Continuous network traffic analysis
- Anomaly detection and behavioral analysis
- Threat intelligence integration
- Indicator of compromise (IoC) monitoring
- Advanced threat detection capabilities

**Monitoring Tools and Techniques**:
- Network packet capture and analysis
- Flow-based traffic analysis (NetFlow/sFlow)
- Deep packet inspection (DPI)
- DNS monitoring and analysis
- Threat hunting activities

### 7.3 Network Forensics
**Forensic Capabilities**:
- Network traffic capture and retention
- Historical traffic analysis capabilities
- Incident reconstruction procedures
- Evidence collection and preservation
- Legal hold and discovery procedures

**Forensic Procedures**:
- Incident response integration
- Chain of custody procedures
- Data preservation and analysis
- Expert witness support
- Law enforcement cooperation

## 8. Network Device Security

### 8.1 Network Device Hardening
**Security Configuration Standards**:
- Default password changes and strong authentication
- Unnecessary service and protocol disabling
- Secure management protocols (SSH, HTTPS)
- Regular firmware and security updates
- Configuration backup and change management

**Access Control for Network Devices**:
- Role-based administrative access
- Privileged access management (PAM)
- Multi-factor authentication for administrators
- Administrative access logging and monitoring
- Emergency access procedures

### 8.2 Network Device Management
**Configuration Management**:
- Standardized device configurations
- Automated configuration deployment
- Configuration change approval processes
- Configuration backup and versioning
- Disaster recovery procedures

**Asset Management**:
- Complete network device inventory
- Asset lifecycle management
- End-of-life planning and replacement
- Security patch management
- Vendor relationship management

## 9. Cloud Network Security

### 9.1 Cloud Connectivity Security
**Secure Cloud Connections**:
- Dedicated private connections (AWS Direct Connect, Azure ExpressRoute)
- VPN connections for hybrid environments
- Software-defined WAN (SD-WAN) implementation
- Cloud access security broker (CASB) deployment
- Cloud network segmentation and controls

**Cloud Security Architecture**:
- Virtual private cloud (VPC) implementation
- Cloud-native security controls
- Cloud workload protection platforms
- Container network security
- Serverless security considerations

### 9.2 Multi-Cloud Network Security
**Multi-Cloud Connectivity**:
- Secure inter-cloud connections
- Consistent security policies across clouds
- Cloud security posture management
- Cross-cloud monitoring and visibility
- Disaster recovery and business continuity

## 10. Incident Response and Recovery

### 10.1 Network Security Incident Response
**Incident Classification**:
- Network intrusion attempts
- Malware infections and propagation
- Denial of service (DoS) attacks
- Data exfiltration attempts
- Insider threat activities

**Response Procedures**:
- Immediate threat containment
- Network isolation and quarantine
- Forensic evidence collection
- Impact assessment and communication
- Recovery and lessons learned

### 10.2 Business Continuity and Disaster Recovery
**Network Redundancy**:
- Multiple internet service providers
- Redundant network paths and devices
- Geographic distribution of critical infrastructure
- Failover and load balancing capabilities
- Regular disaster recovery testing

**Recovery Procedures**:
- Network infrastructure restoration priorities
- Communication systems recovery
- Data center failover procedures
- Vendor and service provider coordination
- Recovery time and point objectives

## 11. Compliance and Audit Requirements

### 11.1 Regulatory Compliance
**Compliance Frameworks**:
- PCI DSS for payment card networks
- HIPAA for healthcare networks
- SOX for financial system networks
- GDPR for data protection networks
- Industry-specific requirements

**Compliance Monitoring**:
- Regular compliance assessments
- Automated compliance checking
- Gap analysis and remediation
- Compliance reporting and documentation
- Third-party compliance audits

### 11.2 Audit Trail Requirements
**Network Audit Logging**:
- Comprehensive network activity logging
- Administrative action logging
- Security event documentation
- Log retention and archival
- Log integrity and protection

**Audit Procedures**:
- Regular internal network audits
- External penetration testing
- Vulnerability assessments
- Configuration compliance audits
- Risk assessment and mitigation

## 12. Training and Awareness

### 12.1 Network Security Training
**Training Requirements**:
- Annual network security training for IT staff
- Specialized training for network administrators
- Security awareness training for all users
- Incident response training and exercises
- Vendor-specific training and certifications

**Training Topics**:
- Network security best practices
- Threat identification and response
- Configuration management procedures
- Incident response procedures
- Compliance requirements and obligations

## 13. Third-Party Network Connections

### 13.1 Partner Network Connections
**Connection Requirements**:
- Formal agreements defining security requirements
- Network segmentation and access controls
- Monitoring and logging of partner activities
- Regular security assessments of partners
- Incident notification and response procedures

**Security Controls**:
- Dedicated network connections for partners
- Limited access based on business needs
- Multi-factor authentication requirements
- Regular access reviews and certifications
- Termination procedures for partnerships

## 14. Policy Enforcement and Compliance

### 14.1 Policy Compliance Monitoring
**Compliance Measures**:
- Regular policy compliance assessments
- Automated compliance monitoring tools
- Risk-based audit procedures
- Performance metrics and key indicators
- Continuous improvement processes

### 14.2 Violation Consequences
**Enforcement Actions**:
- Progressive disciplinary measures
- Immediate access suspension for security violations
- Mandatory retraining requirements
- Performance improvement plans
- Termination for serious violations

## 15. Metrics and Key Performance Indicators

### 15.1 Security Metrics
**Network Security KPIs**:
- Network intrusion attempt frequency
- Security incident response times
- Patch deployment timelines
- Vulnerability remediation rates
- Compliance assessment scores

### 15.2 Performance Metrics
**Network Performance KPIs**:
- Network availability and uptime
- Bandwidth utilization rates
- Response time measurements
- Incident resolution times
- User satisfaction scores

This policy provides comprehensive guidance for implementing and maintaining robust network security controls to protect organizational assets and ensure business continuity.

**Document Control:**
- Version: 2.0
- Effective Date: January 1, 2024
- Next Review Date: January 1, 2025
- Owner: Network Security Manager
- Approved By: Chief Information Security Officer`,
    tags: ["network-security", "firewall", "intrusion-detection", "monitoring", "VPN", "wireless-security", "NIDS", "IPS"],
    author: "Policy Repository Templates"
  },
  {
    title: "Physical Security Policy",
    description: "Physical security controls for facilities, equipment, and personnel access to protect organizational assets.",
    type: "Physical Security",
    category: "Physical Control" as const,
    status: "active" as const,
    content: `# Physical Security Policy

## 1. Executive Summary
This policy establishes comprehensive physical security requirements to protect organizational facilities, equipment, personnel, and information assets from unauthorized physical access, theft, vandalism, and environmental threats.

## 2. Purpose and Scope
This policy applies to all organizational facilities, including:
- Corporate headquarters and branch offices
- Data centers and server rooms
- Warehouse and storage facilities
- Remote work locations
- Temporary facilities and off-site locations
- Third-party facilities housing organizational assets

## 3. Physical Security Framework

### 3.1 Security Zones and Classifications
**Zone 1 - Public Areas**:
- Reception areas and lobbies
- Conference rooms for external meetings
- Public restrooms and common areas
- Minimal security controls required
- Visitor access with escort or supervision

**Zone 2 - General Work Areas**:
- Open office spaces and cubicles
- General meeting rooms
- Break rooms and kitchen areas
- Standard employee access with badge authentication
- Clean desk policy enforcement

**Zone 3 - Restricted Areas**:
- Executive offices and board rooms
- Human resources areas
- Financial processing areas
- Enhanced access controls and monitoring
- Need-to-know access restrictions

**Zone 4 - High Security Areas**:
- Data centers and server rooms
- Network operations centers
- Security control rooms
- Multi-factor authentication required
- Continuous monitoring and recording

**Zone 5 - Maximum Security Areas**:
- Vault and safe areas
- Evidence storage rooms
- Classified document storage
- Biometric authentication required
- Armed security presence when applicable

## 4. Facility Perimeter Security

### 4.1 Building Perimeter Controls
**Physical Barriers**:
- Secure building construction with reinforced entry points
- Perimeter fencing where appropriate
- Controlled vehicle access points
- Landscape design to eliminate hiding places
- Adequate lighting for all exterior areas

**Access Control Systems**:
- Electronic card reader systems at all entry points
- Biometric authentication for high-security areas
- Visitor management systems with photo identification
- Anti-tailgating measures and turnstiles
- Emergency egress procedures and controls

**Surveillance Systems**:
- CCTV coverage of all exterior areas and entry points
- Motion detection systems for after-hours monitoring
- License plate recognition for vehicle areas
- Real-time monitoring capabilities
- Video retention for minimum 90 days

### 4.2 Parking and Vehicle Security
**Parking Area Controls**:
- Segregated parking for employees and visitors
- Reserved parking for executives and security personnel
- Vehicle registration and permit systems
- Regular security patrols of parking areas
- Adequate lighting and emergency communication

**Vehicle Inspection Procedures**:
- Random vehicle inspections at entry/exit points
- Prohibited item screening procedures
- Delivery vehicle security protocols
- Emergency vehicle access procedures
- Incident response for suspicious vehicles

## 5. Interior Access Controls

### 5.1 Badge Access Systems
**Access Card Requirements**:
- Unique identification for each individual
- Photo identification on all access cards
- Role-based access permissions
- Time-based access restrictions
- Automatic expiration and renewal procedures

**Access Control Management**:
- Centralized access control system administration
- Real-time access monitoring and alerting
- Failed access attempt notifications
- Regular access rights reviews and updates
- Emergency access override procedures

### 5.2 Visitor Management
**Visitor Registration Process**:
- Pre-registration for all visitors when possible
- Government-issued photo identification required
- Background screening for extended access
- Visitor badge issuance and tracking
- Escort requirements and responsibilities

**Visitor Access Controls**:
- Limited access based on business need
- Continuous escort in secure areas
- Time-limited access with automatic expiration
- Visitor activity logging and monitoring
- Departure verification and badge return

### 5.3 Contractor and Vendor Access
**Contractor Security Requirements**:
- Security background checks for all contractors
- Signed confidentiality and security agreements
- Specialized training on security procedures
- Supervised access to sensitive areas
- Equipment and tool inspection procedures

**Long-term Contractor Management**:
- Regular security re-verification
- Performance monitoring and evaluation
- Access privilege reviews and updates
- Incident reporting and investigation
- Contract termination security procedures

## 6. Equipment and Asset Protection

### 6.1 Computer and IT Equipment Security
**Workstation Security**:
- Cable locks for desktop computers and monitors
- Secure mounting for equipment in public areas
- Automatic screen locks and timeouts
- USB port controls and restrictions
- Equipment inventory and tracking systems

**Mobile Device Security**:
- Device registration and management
- Encryption requirements for all mobile devices
- Remote wipe capabilities for lost/stolen devices
- Security awareness training for mobile device users
- Incident reporting procedures for device loss

### 6.2 Server Room and Data Center Security
**Environmental Controls**:
- Temperature and humidity monitoring and control
- Fire suppression systems (clean agent preferred)
- Uninterruptible power supply (UPS) systems
- Emergency power generation capabilities
- Water leak detection and prevention

**Physical Security Controls**:
- Biometric access controls (fingerprint, palm, iris)
- Man-trap entry systems with weight sensors
- 24/7 monitoring and surveillance
- Restricted access with detailed logging
- Equipment cabling and connection security

**Data Center Operations**:
- Authorized personnel lists with photo identification
- Escort requirements for all non-data center staff
- Equipment change management procedures
- Emergency response and evacuation procedures
- Backup and disaster recovery site security

### 6.3 Network Infrastructure Protection
**Network Equipment Security**:
- Locked telecommunications closets and rooms
- Secured cable routing and protection
- Equipment labeling and identification
- Regular inspection and maintenance
- Physical tamper detection systems

**Cabling and Connection Security**:
- Secured cable pathways and conduits
- Cable management and organization
- Protection against electromagnetic interference
- Regular cable testing and verification
- Secure disposal of replaced cabling

## 7. Document and Media Security

### 7.1 Physical Document Protection
**Document Classification and Handling**:
- Classification labeling and marking systems
- Secure storage requirements by classification level
- Access controls for document storage areas
- Check-in/check-out procedures for sensitive documents
- Clean desk policy enforcement

**Document Destruction**:
- Secure shredding for confidential documents
- Certificate of destruction for highly sensitive materials
- Cross-cut or micro-cut shredding requirements
- Supervised destruction for critical documents
- Regular destruction schedule and procedures

### 7.2 Electronic Media Security
**Media Storage and Handling**:
- Secure storage for backup tapes and drives
- Environmental controls for media preservation
- Access controls and logging for media storage
- Media inventory and tracking systems
- Encryption requirements for portable media

**Media Disposal and Destruction**:
- Secure wiping procedures for reusable media
- Physical destruction for highly sensitive media
- Certificate of destruction documentation
- Vendor-managed destruction services
- Chain of custody procedures

## 8. Personnel Security

### 8.1 Employee Background Verification
**Pre-Employment Screening**:
- Criminal background checks for all positions
- Enhanced screening for sensitive positions
- Reference verification and employment history
- Education and certification verification
- Ongoing monitoring for positions requiring security clearance

**Periodic Re-Verification**:
- Regular background check updates
- Financial background checks for financial positions
- Security clearance renewals and updates
- Performance monitoring and evaluation
- Incident reporting and investigation

### 8.2 Security Awareness and Training
**General Security Training**:
- Orientation training for all new employees
- Annual security awareness training updates
- Physical security procedure training
- Emergency response and evacuation training
- Incident reporting and response training

**Role-Specific Training**:
- Security guard training and certification
- Facilities management security training
- IT staff physical security training
- Executive protection and awareness
- Visitor escort training and procedures

## 9. Emergency Procedures and Business Continuity

### 9.1 Emergency Response Planning
**Emergency Types and Procedures**:
- Fire emergency response and evacuation
- Medical emergency response procedures
- Natural disaster response and recovery
- Security incident response and lockdown
- Bomb threat and suspicious package procedures

**Emergency Communication**:
- Emergency notification systems and procedures
- Coordination with local emergency services
- Employee accountability and tracking
- Emergency contact information maintenance
- Business continuity communication plans

### 9.2 Business Continuity and Disaster Recovery
**Alternate Facility Planning**:
- Identification and preparation of alternate sites
- Security requirements for temporary facilities
- Equipment and resource relocation procedures
- Staff relocation and security procedures
- Service restoration and recovery priorities

**Recovery Operations**:
- Damage assessment and facility inspection
- Security control restoration priorities
- IT infrastructure recovery procedures
- Normal operations resumption planning
- Lessons learned and plan updates

## 10. Monitoring and Surveillance

### 10.1 CCTV and Video Surveillance
**Camera Placement and Coverage**:
- Strategic placement for maximum coverage
- Entry/exit point monitoring
- High-risk area surveillance
- Parking and exterior area coverage
- Privacy considerations and restrictions

**Video Management and Retention**:
- Digital video recording and storage systems
- Video quality and resolution standards
- Retention periods based on area sensitivity
- Access controls for video viewing and retrieval
- Backup and archival procedures

### 10.2 Intrusion Detection Systems
**Intrusion Detection Coverage**:
- Motion detectors in sensitive areas
- Door and window contact sensors
- Glass break detectors for exterior windows
- Perimeter intrusion detection systems
- Integration with access control systems

**Alarm Monitoring and Response**:
- 24/7 monitoring by security operations center
- Automated notification procedures
- Response protocols for different alarm types
- False alarm reduction procedures
- Regular testing and maintenance

## 11. Security Guard and Personnel Services

### 11.1 Security Guard Requirements
**Guard Qualifications and Training**:
- Licensed and bonded security personnel
- Background investigation and verification
- Specialized training for facility-specific requirements
- Regular performance evaluation and monitoring
- Emergency response training and certification

**Guard Duties and Responsibilities**:
- Access control and visitor management
- Regular facility patrols and inspections
- Incident response and documentation
- Emergency procedure implementation
- Coordination with law enforcement

### 11.2 Security Operations Center
**SOC Capabilities and Staffing**:
- 24/7 monitoring and response capabilities
- Trained security operators and supervisors
- Multiple communication systems and backup power
- Integration with building systems and alarms
- Coordination with external emergency services

**Monitoring and Response Procedures**:
- Real-time monitoring of all security systems
- Incident detection and classification procedures
- Response coordination and deployment
- Documentation and reporting requirements
- Performance metrics and evaluation

## 12. Third-Party Security Services

### 12.1 Security Service Provider Management
**Vendor Selection and Management**:
- Security service provider qualification requirements
- Contract security requirements and specifications
- Performance monitoring and evaluation
- Regular service reviews and assessments
- Contract termination and transition procedures

**Service Level Agreements**:
- Response time requirements for different incident types
- Availability and reliability requirements
- Performance metrics and key indicators
- Reporting and communication requirements
- Penalty and incentive structures

## 13. Compliance and Audit Requirements

### 13.1 Regulatory Compliance
**Applicable Regulations and Standards**:
- OSHA workplace safety requirements
- ADA accessibility compliance
- Local fire and building code compliance
- Industry-specific security requirements
- International security standards (ISO 27001)

**Compliance Monitoring and Reporting**:
- Regular compliance assessments and audits
- Gap analysis and remediation planning
- Compliance documentation and record keeping
- Regulatory reporting and communication
- Third-party compliance verification

### 13.2 Security Audit and Assessment
**Internal Audit Procedures**:
- Regular security control assessments
- Physical security penetration testing
- Vulnerability assessments and remediation
- Policy compliance audits and reviews
- Risk assessment and mitigation planning

**External Audit Support**:
- Third-party security assessments
- Regulatory audit support and coordination
- Audit finding remediation and follow-up
- Continuous monitoring and improvement
- Best practice implementation

## 14. Policy Enforcement and Compliance

### 14.1 Policy Compliance Monitoring
**Compliance Measures and Metrics**:
- Security incident rates and trends
- Access control compliance rates
- Training completion rates
- Audit finding remediation rates
- Policy violation rates and consequences

### 14.2 Violation Consequences
**Progressive Discipline Process**:
- Verbal warning for minor violations
- Written warning for repeated violations
- Suspension for serious security violations
- Termination for critical security breaches
- Legal action for criminal activities

This comprehensive physical security policy provides the framework for protecting organizational assets and ensuring the safety and security of personnel and facilities.

**Document Control:**
- Version: 2.0
- Effective Date: January 1, 2024
- Next Review Date: January 1, 2025
- Owner: Physical Security Manager
- Approved By: Chief Security Officer`,
    tags: ["physical-security", "facility-security", "access-control", "surveillance", "emergency-procedures", "CCTV", "perimeter-security"],
    author: "Policy Repository Templates"
  },
  {
    title: "Cryptography Policy",
    description: "Organizational cryptography policy defining encryption standards, key management, and cryptographic controls for data protection.",
    type: "Cryptography",
    category: "Technical Control" as const,
    status: "active" as const,
    content: `# Cryptography Policy

## 1. Executive Summary
This policy establishes comprehensive cryptographic standards and controls to protect organizational data through encryption, digital signatures, secure key management, and approved cryptographic implementations across all systems and applications.

## 2. Purpose and Scope
This policy applies to all cryptographic implementations, encryption technologies, key management systems, and digital signature solutions within the organization, including:
- Data-at-rest encryption systems
- Data-in-transit encryption protocols
- Key management infrastructure
- Digital signature and certificate systems
- Cryptographic software and hardware
- Cloud-based cryptographic services

## 3. Cryptographic Framework and Governance

### 3.1 Cryptographic Standards and Compliance
**Approved Standards**:
- Federal Information Processing Standards (FIPS) 140-2 Level 3 or higher
- National Institute of Standards and Technology (NIST) cryptographic standards
- International Organization for Standardization (ISO/IEC) 19790 and 24759
- Common Criteria (CC) cryptographic module validation
- Industry-specific cryptographic requirements

**Regulatory Compliance**:
- Payment Card Industry Data Security Standard (PCI DSS)
- Health Insurance Portability and Accountability Act (HIPAA)
- General Data Protection Regulation (GDPR)
- Sarbanes-Oxley Act (SOX) compliance
- Export Administration Regulations (EAR) compliance

### 3.2 Cryptographic Governance Structure
**Cryptography Review Board**:
- Chief Information Security Officer (CISO) as chairperson
- Cryptographic subject matter experts
- Legal and compliance representatives
- IT architecture and engineering representatives
- Risk management representatives

**Responsibilities**:
- Cryptographic algorithm approval and deprecation
- Key management policy development
- Cryptographic implementation standards
- Vendor cryptographic solution evaluation
- Incident response for cryptographic failures

## 4. Approved Cryptographic Algorithms

### 4.1 Symmetric Encryption Algorithms
**Approved for New Implementations**:
- **AES-256 (Advanced Encryption Standard)**: Primary standard for symmetric encryption
- **ChaCha20-Poly1305**: Approved for high-performance applications
- **AES-128**: Approved for performance-critical applications with lower security requirements

**Acceptable for Legacy Systems**:
- **AES-192**: Approved for existing implementations, upgrade to AES-256 required
- **3DES (Triple Data Encryption Standard)**: Legacy only, phase-out by December 2024

**Prohibited Algorithms**:
- DES (Data Encryption Standard)
- RC4 (Rivest Cipher 4)
- MD5 for cryptographic purposes
- SHA-1 for new digital signatures

### 4.2 Asymmetric Encryption Algorithms
**Approved for New Implementations**:
- **RSA-3072 or higher**: Minimum requirement for new RSA implementations
- **Elliptic Curve Cryptography (ECC)**: P-256, P-384, P-521 curves
- **EdDSA (Ed25519, Ed448)**: Preferred for digital signatures
- **ECDSA (Elliptic Curve Digital Signature Algorithm)**: Approved with NIST curves

**Legacy Algorithm Management**:
- **RSA-2048**: Acceptable until December 2025, upgrade required
- **RSA-1024**: Prohibited for new implementations, immediate upgrade required

### 4.3 Hash Functions and Message Authentication
**Approved Hash Functions**:
- **SHA-256**: Standard for general-purpose hashing
- **SHA-384**: Approved for high-security applications
- **SHA-512**: Approved for maximum security requirements
- **SHA-3**: Approved for specialized applications

**Message Authentication Codes (MAC)**:
- **HMAC-SHA256**: Standard for message authentication
- **HMAC-SHA384/512**: For high-security applications
- **CMAC (Cipher-based MAC)**: Approved with AES
- **Poly1305**: Approved with ChaCha20

### 4.4 Key Derivation and Exchange
**Key Derivation Functions**:
- **PBKDF2 (Password-Based Key Derivation Function 2)**: Minimum 100,000 iterations
- **scrypt**: Approved for password-based key derivation
- **Argon2**: Preferred for new password hashing implementations
- **HKDF (HMAC-based Key Derivation Function)**: Approved for key expansion

**Key Exchange Protocols**:
- **Diffie-Hellman (DH)**: Minimum 3072-bit modulus
- **Elliptic Curve Diffie-Hellman (ECDH)**: With approved NIST curves
- **RSA Key Transport**: RSA-3072 minimum with OAEP padding

## 5. Data-at-Rest Encryption

### 5.1 Database Encryption
**Database Encryption Requirements**:
- Transparent Data Encryption (TDE) for all production databases
- Column-level encryption for highly sensitive data fields
- Encryption key rotation every 12 months maximum
- Separate encryption keys for different data classifications
- Hardware Security Module (HSM) integration for key protection

**Implementation Standards**:
- AES-256 encryption for all database files
- Encrypted backup and archive storage
- Encrypted transaction log files
- Secure key storage separate from encrypted data
- Performance monitoring and optimization

### 5.2 File System and Storage Encryption
**Full Disk Encryption**:
- Mandatory for all laptops, workstations, and mobile devices
- AES-256 encryption with TPM (Trusted Platform Module) integration
- Centralized key escrow and recovery capabilities
- Pre-boot authentication requirements
- Regular encryption status monitoring and reporting

**Network Attached Storage (NAS) and Storage Area Network (SAN)**:
- Self-encrypting drives (SED) with FIPS 140-2 Level 2 validation
- AES-256 encryption for all storage volumes
- Encrypted replication and backup processes
- Secure key management integration
- Regular cryptographic module testing

### 5.3 Cloud Storage Encryption
**Cloud Encryption Requirements**:
- Customer-managed encryption keys (CMEK) preferred
- AES-256 encryption for all cloud-stored data
- Encryption key residency requirements based on data classification
- Secure key escrow and recovery procedures
- Regular cloud provider security assessments

**Multi-Cloud Encryption Strategy**:
- Consistent encryption standards across all cloud providers
- Vendor-agnostic key management solutions
- Cross-cloud data protection and portability
- Cloud security posture management integration
- Hybrid cloud encryption architecture

## 6. Data-in-Transit Encryption

### 6.1 Network Communication Encryption
**Web Communication Standards**:
- **TLS 1.3**: Required for all new web applications and APIs
- **TLS 1.2**: Acceptable for legacy applications, upgrade required by 2025
- HTTP Strict Transport Security (HSTS) mandatory
- Certificate pinning for critical applications
- Perfect Forward Secrecy (PFS) required

**Email Encryption**:
- S/MIME or PGP encryption for sensitive email communications
- TLS encryption for all email server communications
- Data Loss Prevention (DLP) integration for automatic encryption
- Secure email gateways with encryption capabilities
- End-to-end encryption for highly confidential communications

### 6.2 VPN and Remote Access Encryption
**VPN Encryption Standards**:
- IPsec with AES-256 encryption and SHA-256 authentication
- SSL/TLS VPN with TLS 1.3 for web-based access
- Perfect Forward Secrecy (PFS) for all VPN connections
- Certificate-based authentication preferred
- Regular VPN configuration audits and updates

**Remote Desktop and Application Access**:
- RDP over TLS 1.3 with NLA (Network Level Authentication)
- Citrix or VMware encrypted virtual desktop infrastructure
- SSH with RSA-3072 or EdDSA keys for administrative access
- Multi-factor authentication integration
- Session recording and monitoring capabilities

### 6.3 Database and Application Communication
**Database Connection Encryption**:
- TLS 1.3 for all database client connections
- Certificate validation and authentication
- Encrypted stored procedures and function calls
- Secure database replication and synchronization
- API encryption for database access services

**Inter-Application Communication**:
- Mutual TLS (mTLS) authentication for service-to-service communication
- API gateway encryption and authentication
- Microservices mesh security with automatic encryption
- Message queue encryption for asynchronous communications
- gRPC with TLS encryption for high-performance communications

## 7. Key Management Infrastructure

### 7.1 Cryptographic Key Lifecycle Management
**Key Generation**:
- Hardware Security Modules (HSM) for key generation
- True random number generation (TRNG) requirements
- Key generation ceremonies with dual control
- Key generation audit trails and documentation
- Secure key generation in air-gapped environments

**Key Distribution and Provisioning**:
- Secure key distribution protocols and channels
- Certificate-based key distribution
- Hardware token and smart card key storage
- Automated key provisioning systems
- Key escrow and recovery procedures

**Key Storage and Protection**:
- FIPS 140-2 Level 3 HSMs for root keys
- Separate key storage from encrypted data
- Key encryption keys (KEK) hierarchy
- Geographic distribution of key management systems
- Tamper-evident and tamper-resistant key storage

**Key Rotation and Updates**:
- Automated key rotation schedules based on key type and usage
- Emergency key rotation procedures
- Cryptoperiod management and enforcement
- Key version management and backwards compatibility
- Performance impact assessment for key rotations

**Key Destruction and Retirement**:
- Secure key deletion and zeroization procedures
- Certificate of destruction for decommissioned keys
- Key archival for compliance and legal requirements
- Hardware destruction for end-of-life key storage devices
- Chain of custody for key destruction processes

### 7.2 Hardware Security Module (HSM) Management
**HSM Implementation Requirements**:
- FIPS 140-2 Level 3 or Common Criteria EAL4+ certification
- High availability and disaster recovery capabilities
- Role-based access control and authentication
- Comprehensive audit logging and monitoring
- Regular firmware updates and security patches

**HSM Operations and Maintenance**:
- Dual control and split knowledge procedures
- Regular HSM health monitoring and alerting
- Performance monitoring and capacity planning
- Backup and recovery procedures
- Vendor support and maintenance agreements

### 7.3 Certificate Authority and Public Key Infrastructure
**Internal Certificate Authority (CA)**:
- Root CA offline storage and protection
- Intermediate CA for operational certificate issuance
- Certificate lifecycle management automation
- Certificate revocation list (CRL) and OCSP services
- Regular CA audits and compliance assessments

**Certificate Management**:
- Automated certificate enrollment and renewal
- Certificate inventory and expiration monitoring
- Certificate validation and trust path verification
- Emergency certificate revocation procedures
- Cross-certification with external CAs when required

## 8. Digital Signatures and Non-Repudiation

### 8.1 Digital Signature Standards
**Signature Algorithm Requirements**:
- RSA-PSS with SHA-256 minimum for document signing
- ECDSA with P-256 curve minimum for code signing
- EdDSA (Ed25519) preferred for new implementations
- Time-stamping services for long-term signature validity
- Qualified digital signatures for legal compliance

**Code Signing and Software Integrity**:
- Mandatory code signing for all software releases
- Extended Validation (EV) code signing certificates
- Secure code signing infrastructure with HSM protection
- Software bill of materials (SBOM) signing
- Container image and artifact signing

### 8.2 Document and Transaction Signing
**Electronic Document Signing**:
- PDF digital signatures with long-term validation
- XML digital signatures for structured documents
- Blockchain-based document integrity verification
- Legal compliance with electronic signature regulations
- Document workflow integration with signing processes

**Transaction and Data Integrity**:
- Digital signatures for financial transactions
- API request and response signing
- Database transaction integrity verification
- Audit trail signing and tamper detection
- Regulatory compliance for signed transactions

## 9. Quantum-Safe Cryptography

### 9.1 Post-Quantum Cryptography (PQC) Preparation
**Current Assessment and Planning**:
- Cryptographic inventory and quantum vulnerability assessment
- Migration timeline development for quantum-safe algorithms
- Hybrid classical-quantum resistant implementations
- Standards monitoring and early adoption planning
- Vendor roadmap evaluation for quantum-safe solutions

**NIST Post-Quantum Standards**:
- CRYSTALS-Kyber for key encapsulation mechanisms
- CRYSTALS-Dilithium for digital signatures
- FALCON for compact digital signatures
- SPHINCS+ for stateless hash-based signatures

### 9.2 Quantum Key Distribution (QKD)
**QKD Implementation Considerations**:
- Point-to-point quantum key distribution for high-security communications
- Integration with existing key management infrastructure
- Cost-benefit analysis for QKD deployment
- Physical security requirements for QKD networks
- Regulatory and compliance considerations

## 10. Cloud Cryptography

### 10.1 Cloud Encryption Architecture
**Cloud Service Provider (CSP) Requirements**:
- FIPS 140-2 validated cryptographic modules
- Customer-controlled encryption key management
- Transparent encryption key governance and auditing
- Data residency and sovereignty compliance
- Regular cryptographic security assessments

**Multi-Cloud Cryptographic Strategy**:
- Vendor-agnostic encryption solutions
- Consistent cryptographic policies across clouds
- Cross-cloud key management and data portability
- Cloud workload protection platform integration
- Hybrid cloud cryptographic architecture

### 10.2 Bring Your Own Key (BYOK) and Hold Your Own Key (HYOK)
**Customer Key Management Models**:
- BYOK implementation for sensitive workloads
- HYOK for highly regulated data and applications
- Key escrow and availability requirements
- Performance and latency considerations
- Disaster recovery and business continuity planning

## 11. Mobile and IoT Device Cryptography

### 11.1 Mobile Device Encryption
**Mobile Device Requirements**:
- Full device encryption with hardware-backed keystore
- Application sandboxing with per-app encryption keys
- Secure communication protocols for mobile applications
- Mobile device management (MDM) encryption enforcement
- Remote wipe and cryptographic key destruction

**Mobile Application Cryptography**:
- End-to-end encryption for sensitive mobile communications
- Secure local storage with application-specific keys
- Certificate pinning for mobile application communications
- Runtime application self-protection (RASP) integration
- Mobile threat defense integration

### 11.2 Internet of Things (IoT) Cryptography
**IoT Device Security Requirements**:
- Lightweight cryptographic algorithms for resource-constrained devices
- Secure device provisioning and key installation
- Over-the-air (OTA) update encryption and authentication
- Device identity and attestation mechanisms
- Secure communication protocols (DTLS, MQTT-TLS)

**IoT Cryptographic Lifecycle Management**:
- Device enrollment and initial key provisioning
- Automated key rotation for long-lived devices
- Certificate management for IoT device fleets
- Secure decommissioning and key destruction
- IoT device monitoring and incident response

## 12. Cryptographic Implementation Security

### 12.1 Secure Coding Practices
**Cryptographic Implementation Standards**:
- Use of approved cryptographic libraries and APIs
- Secure random number generation for all cryptographic operations
- Protection against timing attacks and side-channel analysis
- Proper key handling and memory management
- Regular security code reviews and static analysis

**Common Implementation Vulnerabilities**:
- Hardcoded cryptographic keys and passwords
- Weak random number generation
- Improper certificate validation
- Cryptographic oracle attacks
- Key management vulnerabilities

### 12.2 Cryptographic Testing and Validation
**Testing Requirements**:
- Cryptographic module testing and validation
- Penetration testing of cryptographic implementations
- Side-channel attack resistance testing
- Performance and scalability testing
- Interoperability testing with multiple platforms

**Continuous Monitoring**:
- Cryptographic health monitoring and alerting
- Key usage analytics and anomaly detection
- Certificate expiration monitoring and alerting
- Cryptographic performance monitoring
- Compliance monitoring and reporting

## 13. Incident Response and Cryptographic Failures

### 13.1 Cryptographic Incident Response
**Incident Types and Procedures**:
- Key compromise and emergency rotation
- Certificate authority compromise response
- Cryptographic algorithm vulnerabilities
- Hardware security module failures
- Quantum computer threat emergence

**Response Team and Procedures**:
- Cryptographic incident response team formation
- Emergency communication and escalation procedures
- Impact assessment and containment strategies
- Recovery and remediation procedures
- Post-incident analysis and improvement

### 13.2 Business Continuity and Disaster Recovery
**Cryptographic Infrastructure Resilience**:
- Geographic distribution of key management infrastructure
- Redundant HSM deployments and failover procedures
- Disaster recovery testing for cryptographic systems
- Backup and recovery procedures for cryptographic keys
- Service restoration priority and procedures

## 14. Training and Awareness

### 14.1 Cryptographic Security Training
**General Awareness Training**:
- Basic cryptography concepts for all staff
- Data protection and encryption awareness
- Password and key security best practices
- Incident reporting procedures
- Regulatory compliance requirements

**Technical Training Programs**:
- Cryptographic implementation training for developers
- Key management training for system administrators
- Security architecture training for engineers
- Incident response training for security teams
- Vendor-specific training for cryptographic products

### 14.2 Certification and Professional Development
**Professional Certifications**:
- Certified Information Systems Security Professional (CISSP)
- Certified Cryptographic Security Specialist (CCSS)
- Vendor-specific cryptographic certifications
- Academic cryptography and security coursework
- Continuous professional development requirements

## 15. Compliance and Audit

### 15.1 Regulatory Compliance Monitoring
**Compliance Requirements**:
- Regular compliance assessments and gap analysis
- Automated compliance monitoring and reporting
- Third-party compliance audits and certifications
- Regulatory reporting and documentation
- Compliance training and awareness programs

### 15.2 Metrics and Key Performance Indicators
**Cryptographic Security Metrics**:
- Encryption coverage percentage across data types
- Key rotation compliance rates
- Certificate expiration and renewal rates
- Cryptographic incident response times
- Algorithm deprecation and upgrade progress

**Performance and Operational Metrics**:
- Cryptographic operation performance benchmarks
- HSM utilization and capacity metrics
- Key management system availability
- Cryptographic license and support costs
- User satisfaction with cryptographic tools

This comprehensive cryptography policy provides the foundation for a robust cryptographic security program that protects organizational data and ensures compliance with regulatory requirements.

**Document Control:**
- Version: 3.0
- Effective Date: January 1, 2024
- Next Review Date: January 1, 2025
- Owner: Cryptographic Security Manager
- Approved By: Chief Information Security Officer`,
    tags: ["cryptography", "encryption", "key-management", "digital-signatures", "quantum-safe", "HSM", "TLS", "AES", "PKI"],
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
