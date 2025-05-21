
import { Policy } from "@/types/policy";

// Generate random date within the last year
const randomDate = (start: Date = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), end: Date = new Date()) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

// Generate mock policy data
export const mockPolicies: Policy[] = [
  {
    policy_id: "pol-001",
    title: "Corporate Data Access Control Policy",
    description: "This policy defines the standards for accessing corporate data, including authentication methods, authorization levels, and access review procedures.",
    type: "Access Control",
    status: "active",
    created_at: randomDate(),
    updated_at: randomDate(),
    author: "John Smith",
    content: `# Corporate Data Access Control Policy

## 1. Purpose
The purpose of this policy is to establish rules for accessing corporate information assets and systems to prevent unauthorized access, maintain data integrity, and ensure confidentiality.

## 2. Scope
This policy applies to all employees, contractors, vendors, and other third parties who have access to company data and information systems.

## 3. Policy Guidelines
### 3.1 Access Control Principles
* All access to corporate data must follow the principle of least privilege
* Access rights must be reviewed quarterly
* All access must be authenticated and authorized
* Default access to systems should be "deny all"

### 3.2 Authentication Requirements
* Passwords must be minimum 12 characters
* Multi-factor authentication is required for all privileged accounts
* Password expiration occurs every 90 days

### 3.3 Authorization Procedures
Detailed authorization procedures including management approval workflows and documentation requirements.

## 4. Compliance
Failure to comply with this policy may result in disciplinary action, up to and including termination of employment or contract.`,
    currentVersion: "1.2",
    tags: ["access", "authorization", "authentication"],
    versions: [
      {
        version_id: "v-001-2",
        version_label: "v1.2",
        description: "Updated MFA requirements and password complexity",
        created_at: randomDate(),
        edited_by: "John Smith"
      },
      {
        version_id: "v-001-1",
        version_label: "v1.1",
        description: "Added quarterly review requirement",
        created_at: randomDate(new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)),
        edited_by: "John Smith"
      },
      {
        version_id: "v-001-0",
        version_label: "v1.0",
        description: "Initial policy creation",
        created_at: randomDate(new Date(Date.now() - 300 * 24 * 60 * 60 * 1000)),
        edited_by: "Sarah Johnson"
      }
    ]
  },
  {
    policy_id: "pol-002",
    title: "Data Classification and Handling Policy",
    description: "Defines classification levels for organizational data and the requirements for handling data at each level.",
    type: "Data Classification",
    status: "active",
    created_at: randomDate(),
    updated_at: randomDate(),
    author: "Sarah Johnson",
    content: `# Data Classification and Handling Policy

## 1. Purpose
This policy establishes a framework for classifying corporate data based on its sensitivity and criticality, and defines handling requirements for each classification level.

## 2. Data Classification Levels
### 2.1 Public
Information that can be freely shared with the public with no adverse impact.

### 2.2 Internal
Information intended for use within the organization but not particularly sensitive.

### 2.3 Confidential
Sensitive information that could cause damage if disclosed.

### 2.4 Restricted
Highly sensitive information that would cause significant damage if disclosed.

## 3. Handling Requirements
Detailed requirements for each classification level covering storage, transmission, labeling, and disposal.

## 4. Responsibilities
Outlines responsibilities for data owners, custodians, and users.`,
    currentVersion: "2.0",
    tags: ["data", "classification", "confidential"],
    versions: [
      {
        version_id: "v-002-1",
        version_label: "v2.0",
        description: "Complete policy revision with new classification levels",
        created_at: randomDate(),
        edited_by: "Sarah Johnson"
      },
      {
        version_id: "v-002-0",
        version_label: "v1.0",
        description: "Initial policy creation",
        created_at: randomDate(new Date(Date.now() - 240 * 24 * 60 * 60 * 1000)),
        edited_by: "Sarah Johnson"
      }
    ]
  },
  {
    policy_id: "pol-003",
    title: "Security Incident Response Policy",
    description: "Outlines procedures for detecting, reporting, and responding to information security incidents.",
    type: "Incident Handling",
    status: "active",
    created_at: randomDate(),
    updated_at: randomDate(),
    author: "Michael Chen",
    content: `# Security Incident Response Policy

## 1. Purpose
This policy establishes a structured approach to managing security incidents to minimize damage and reduce recovery time and costs.

## 2. Incident Categories
* Data Breach
* Malware Infection
* Denial of Service
* Unauthorized Access
* Physical Security Breach

## 3. Incident Response Process
### 3.1 Preparation
Training, tools, and documentation required before incidents occur.

### 3.2 Detection and Analysis
Procedures for detecting and initially analyzing potential incidents.

### 3.3 Containment
Steps to limit damage from the incident.

### 3.4 Eradication
Removing the cause of the incident.

### 3.5 Recovery
Restoring systems to normal operation.

### 3.6 Post-Incident Activity
Lessons learned and improvements to prevent similar incidents.`,
    currentVersion: "1.3",
    tags: ["incident", "response", "breach"],
    versions: [
      {
        version_id: "v-003-3",
        version_label: "v1.3",
        description: "Updated contact information for incident response team",
        created_at: randomDate(),
        edited_by: "Michael Chen"
      },
      {
        version_id: "v-003-2",
        version_label: "v1.2",
        description: "Added ransomware-specific response procedures",
        created_at: randomDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)),
        edited_by: "Michael Chen"
      },
      {
        version_id: "v-003-1",
        version_label: "v1.1",
        description: "Revised notification requirements",
        created_at: randomDate(new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)),
        edited_by: "Michael Chen"
      },
      {
        version_id: "v-003-0",
        version_label: "v1.0",
        description: "Initial policy creation",
        created_at: randomDate(new Date(Date.now() - 270 * 24 * 60 * 60 * 1000)),
        edited_by: "Sarah Johnson"
      }
    ]
  },
  {
    policy_id: "pol-004",
    title: "Network Security Policy",
    description: "Establishes requirements for securing the organization's network infrastructure, including firewalls, VPNs, and wireless networks.",
    type: "Network Security",
    status: "active",
    created_at: randomDate(),
    updated_at: randomDate(),
    author: "Alex Rodriguez",
    content: `# Network Security Policy

## 1. Purpose
This policy defines the requirements for securing the organization's network infrastructure to protect data confidentiality, integrity, and availability.

## 2. Network Segmentation
Requirements for separating networks by function, sensitivity, and risk.

## 3. Firewall Configuration
Standards for firewall implementation, rule management, and monitoring.

## 4. Remote Access
Requirements for VPN and other remote access solutions.

## 5. Wireless Network Security
Standards for securing wireless access points and connections.

## 6. Network Monitoring
Requirements for monitoring network traffic, detecting anomalies, and responding to alerts.`,
    currentVersion: "2.1",
    tags: ["network", "firewall", "security"],
    versions: [
      {
        version_id: "v-004-2",
        version_label: "v2.1",
        description: "Updated wireless security requirements",
        created_at: randomDate(),
        edited_by: "Alex Rodriguez"
      },
      {
        version_id: "v-004-1",
        version_label: "v2.0",
        description: "Major revision with updated firewall requirements",
        created_at: randomDate(new Date(Date.now() - 120 * 24 * 60 * 60 * 1000)),
        edited_by: "Alex Rodriguez"
      },
      {
        version_id: "v-004-0",
        version_label: "v1.0",
        description: "Initial policy creation",
        created_at: randomDate(new Date(Date.now() - 330 * 24 * 60 * 60 * 1000)),
        edited_by: "Mark Williams"
      }
    ]
  },
  {
    policy_id: "pol-005",
    title: "Acceptable Use Policy",
    description: "Defines the acceptable use of computer equipment, networks, and data for employees and contractors.",
    type: "Acceptable Use",
    status: "active",
    created_at: randomDate(),
    updated_at: randomDate(),
    author: "Emily Davis",
    content: `# Acceptable Use Policy

## 1. Purpose
This policy outlines the acceptable use of company information technology resources to protect employees and the company.

## 2. Scope
Applies to all employees, contractors, consultants, and temporary workers with access to company systems.

## 3. General Use Guidelines
* Company resources are primarily for business purposes
* Limited personal use is permitted if it doesn't interfere with work
* All activity may be monitored
* No expectation of privacy when using company resources

## 4. Prohibited Activities
Detailed list of prohibited activities including unauthorized access, sharing credentials, installing unapproved software, etc.

## 5. Email and Communications
Acceptable use standards for email, instant messaging, and other communication tools.

## 6. Internet Usage
Guidelines for acceptable internet usage.`,
    currentVersion: "3.2",
    tags: ["acceptable use", "employee", "internet"],
    versions: [
      {
        version_id: "v-005-3",
        version_label: "v3.2",
        description: "Added social media usage guidelines",
        created_at: randomDate(),
        edited_by: "Emily Davis"
      },
      {
        version_id: "v-005-2",
        version_label: "v3.1",
        description: "Updated prohibited applications list",
        created_at: randomDate(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)),
        edited_by: "Emily Davis"
      },
      {
        version_id: "v-005-1",
        version_label: "v3.0",
        description: "Major revision including remote work policies",
        created_at: randomDate(new Date(Date.now() - 150 * 24 * 60 * 60 * 1000)),
        edited_by: "Emily Davis"
      },
      {
        version_id: "v-005-0",
        version_label: "v2.0",
        description: "Previous major revision",
        created_at: randomDate(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)),
        edited_by: "Mark Williams"
      }
    ]
  },
  {
    policy_id: "pol-006",
    title: "Mobile Device Security Policy",
    description: "Establishes requirements for using mobile devices to access company resources, including personal and company-owned devices.",
    type: "Endpoint Security",
    status: "active",
    created_at: randomDate(),
    updated_at: randomDate(),
    author: "Jessica Kim",
    content: `# Mobile Device Security Policy

## 1. Purpose
This policy defines security requirements for mobile devices that access organizational data and systems.

## 2. Scope
Applies to all company-owned and personal mobile devices used to access company resources.

## 3. General Requirements
* All devices must be registered with IT
* Devices must have current operating systems and security patches
* Company data must be encrypted
* Automatic screen locks must be enabled

## 4. Company-Owned Devices
Additional requirements specific to company-owned devices.

## 5. Personal Devices (BYOD)
Requirements for personally owned devices used for work purposes.

## 6. Applications and Data
Requirements for applications installed on devices that access company data.`,
    currentVersion: "1.4",
    tags: ["mobile", "device", "BYOD"],
    versions: [
      {
        version_id: "v-006-4",
        version_label: "v1.4",
        description: "Updated encryption requirements",
        created_at: randomDate(),
        edited_by: "Jessica Kim"
      },
      {
        version_id: "v-006-3",
        version_label: "v1.3",
        description: "Added biometric authentication requirements",
        created_at: randomDate(new Date(Date.now() - 75 * 24 * 60 * 60 * 1000)),
        edited_by: "Jessica Kim"
      },
      {
        version_id: "v-006-2",
        version_label: "v1.2",
        description: "Updated MDM solution requirements",
        created_at: randomDate(new Date(Date.now() - 160 * 24 * 60 * 60 * 1000)),
        edited_by: "Jessica Kim"
      },
      {
        version_id: "v-006-1",
        version_label: "v1.1",
        description: "Clarified BYOD requirements",
        created_at: randomDate(new Date(Date.now() - 250 * 24 * 60 * 60 * 1000)),
        edited_by: "Alex Rodriguez"
      },
      {
        version_id: "v-006-0",
        version_label: "v1.0",
        description: "Initial policy creation",
        created_at: randomDate(new Date(Date.now() - 350 * 24 * 60 * 60 * 1000)),
        edited_by: "Mark Williams"
      }
    ]
  },
  {
    policy_id: "pol-007",
    title: "User Account Management Policy",
    description: "Guidelines for creating, modifying, and terminating user accounts across organization systems.",
    type: "User Account",
    status: "active",
    created_at: randomDate(),
    updated_at: randomDate(),
    author: "David Chang",
    content: `# User Account Management Policy

## 1. Purpose
This policy establishes the requirements for managing user accounts to ensure proper access control and accountability.

## 2. Scope
This policy applies to all user accounts created on any organizational system, application, or service.

## 3. Account Creation
* Formal request process
* Approval requirements
* Documentation standards
* Default privilege settings

## 4. Account Modifications
* Process for changing access rights
* Role changes and promotions
* Department transfers

## 5. Account Termination
* Process for disabling accounts when employees leave
* Timeframes for account deactivation
* Data preservation requirements

## 6. Account Reviews
* Quarterly reviews of active accounts
* Privilege right-sizing
* Dormant account identification`,
    currentVersion: "1.1",
    tags: ["user", "account", "access management"],
    versions: [
      {
        version_id: "v-007-1",
        version_label: "v1.1",
        description: "Added section on contractor accounts",
        created_at: randomDate(),
        edited_by: "David Chang"
      },
      {
        version_id: "v-007-0",
        version_label: "v1.0",
        description: "Initial policy creation",
        created_at: randomDate(new Date(Date.now() - 280 * 24 * 60 * 60 * 1000)),
        edited_by: "David Chang"
      }
    ]
  }
];
