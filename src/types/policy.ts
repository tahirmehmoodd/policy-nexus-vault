
export interface Version {
  version_id: string;
  version_label: string;
  description: string;
  created_at: string;
  edited_by: string;
  changes?: string[];
}

export interface Policy {
  policy_id: string;
  title: string;
  description: string;
  type: string;
  status: 'active' | 'draft' | 'archived' | 'under_review';
  created_at: string;
  updated_at: string;
  author: string;
  content: string;
  currentVersion: string;
  tags: string[];
  versions: Version[];
  framework_category: 'physical' | 'technical' | 'organizational';
  security_domain: string;
  owner?: string;
  owner_id?: string;
  reviewer_id?: string;
  department?: string;
}

// Security framework categories based on ISO/IEC 27002
export const FRAMEWORK_CATEGORIES = {
  physical: {
    name: 'Physical Controls',
    description: 'Physical and environmental security controls',
    domains: ['Physical Security', 'Environmental Security', 'Secure Areas']
  },
  technical: {
    name: 'Technical Controls',
    description: 'Technical safeguards and system controls',
    domains: ['Access Control', 'Cryptography', 'System Security', 'Network Security', 'Application Security']
  },
  organizational: {
    name: 'Organizational Controls',
    description: 'Administrative and procedural controls',
    domains: ['Information Security Policies', 'Human Resource Security', 'Asset Management', 'Incident Management', 'Business Continuity']
  }
};

// Enhanced tag system
export const SECURITY_TAGS = [
  'Access Control',
  'Antivirus',
  'Supply Chain',
  'Data Classification',
  'Incident Response',
  'Risk Management',
  'Compliance',
  'Training',
  'Audit',
  'Backup',
  'Encryption',
  'Authentication',
  'Authorization',
  'Monitoring',
  'Vulnerability Management',
  'Third Party',
  'GDPR',
  'ISO 27001',
  'NIST',
  'SOC 2'
];

// Adding a function to convert XML to policy format
export const convertXmlToPolicy = (xmlString: string): Partial<Policy> => {
  try {
    // This is a simplified XML parser for demonstration
    // In a real app, use a proper XML parser library
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    
    // Extract basic policy information from XML
    const title = xmlDoc.getElementsByTagName("title")[0]?.textContent || "Untitled Policy";
    const description = xmlDoc.getElementsByTagName("description")[0]?.textContent || "";
    const type = xmlDoc.getElementsByTagName("type")[0]?.textContent || "Access Control";
    const content = xmlDoc.getElementsByTagName("content")[0]?.textContent || "";
    const tagsElements = xmlDoc.getElementsByTagName("tag");
    
    // Extract tags from XML
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
      tags,
      status: 'draft' as const,
      framework_category: 'technical' as const,
      security_domain: 'System Security'
    };
  } catch (error) {
    console.error("Error parsing XML:", error);
    return { 
      title: "Error in XML Parsing",
      description: "The uploaded XML file could not be parsed correctly.",
      framework_category: 'technical' as const,
      security_domain: 'System Security'
    };
  }
};

// Fuzzy search helper
export const fuzzySearch = (query: string, text: string): boolean => {
  if (!query) return true;
  
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  
  // Simple fuzzy matching - check if all characters in query appear in order
  let queryIndex = 0;
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++;
    }
  }
  
  return queryIndex === queryLower.length;
};
