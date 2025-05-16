
export interface Version {
  version_id: string;
  version_label: string;
  description: string;
  created_at: string;
  edited_by: string;
}

export interface Policy {
  policy_id: string;
  title: string;
  description: string;
  type: string;
  status: 'active' | 'draft' | 'archived';
  created_at: string;
  updated_at: string;
  author: string;
  content: string;
  currentVersion: string;
  tags: string[];
  versions: Version[];
}

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
      status: 'draft' as const
    };
  } catch (error) {
    console.error("Error parsing XML:", error);
    return { 
      title: "Error in XML Parsing",
      description: "The uploaded XML file could not be parsed correctly."
    };
  }
};
