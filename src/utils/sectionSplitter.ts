/**
 * Utility for splitting policy content into sections
 * Week 3 Feature: Section-level storage and compliance tagging
 */

export interface PolicySection {
  section_number: number;
  section_title: string;
  section_content: string;
}

/**
 * Splits policy content into sections based on headings
 * Supports both Markdown-style (#, ##, ###) and numbered headings (1., 1.1, etc.)
 */
export function splitPolicyIntoSections(content: string): PolicySection[] {
  if (!content || content.trim() === '') {
    return [];
  }

  const sections: PolicySection[] = [];
  const lines = content.split('\n');
  
  let currentSection: PolicySection | null = null;
  let sectionCounter = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check for Markdown headings (# Heading, ## Heading, ### Heading)
    const markdownHeadingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    
    // Check for numbered headings (1. Heading, 1.1 Heading, etc.)
    const numberedHeadingMatch = line.match(/^(\d+(?:\.\d+)*)\.\s+(.+)$/);
    
    if (markdownHeadingMatch || numberedHeadingMatch) {
      // Save previous section if exists
      if (currentSection && currentSection.section_content.trim()) {
        sections.push(currentSection);
      }
      
      // Start new section
      sectionCounter++;
      const title = markdownHeadingMatch ? markdownHeadingMatch[2] : numberedHeadingMatch![2];
      
      currentSection = {
        section_number: sectionCounter,
        section_title: title,
        section_content: ''
      };
    } else if (currentSection) {
      // Add content to current section
      currentSection.section_content += line + '\n';
    } else if (line && sectionCounter === 0) {
      // Content before any heading - create introduction section
      sectionCounter++;
      currentSection = {
        section_number: sectionCounter,
        section_title: 'Introduction',
        section_content: line + '\n'
      };
    }
  }
  
  // Add last section
  if (currentSection && currentSection.section_content.trim()) {
    sections.push(currentSection);
  }
  
  // If no sections were found, treat entire content as one section
  if (sections.length === 0 && content.trim()) {
    sections.push({
      section_number: 1,
      section_title: 'Policy Content',
      section_content: content
    });
  }
  
  return sections;
}

/**
 * Auto-tags section with compliance frameworks based on keywords
 */
export async function autoTagSection(sectionContent: string, complianceKeywords: any[]): Promise<string[]> {
  const tags: string[] = [];
  const contentLower = sectionContent.toLowerCase();
  
  for (const framework of complianceKeywords) {
    const { framework_name, control_id, keywords } = framework;
    
    // Check if any keyword matches the content
    if (keywords && keywords.some((keyword: string) => contentLower.includes(keyword.toLowerCase()))) {
      tags.push(`${framework_name}-${control_id}`);
    }
  }
  
  return tags;
}

/**
 * Extracts metadata from policy content
 */
export function extractPolicyMetadata(content: string): {
  owner?: string;
  department?: string;
  reviewer?: string;
} {
  const metadata: any = {};
  const lines = content.split('\n').slice(0, 20); // Check first 20 lines
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    // Extract owner
    if (lowerLine.includes('owner:') || lowerLine.includes('policy owner:')) {
      metadata.owner = line.split(':')[1]?.trim();
    }
    
    // Extract department
    if (lowerLine.includes('department:')) {
      metadata.department = line.split(':')[1]?.trim();
    }
    
    // Extract reviewer
    if (lowerLine.includes('reviewer:') || lowerLine.includes('reviewed by:')) {
      metadata.reviewer = line.split(':')[1]?.trim();
    }
  }
  
  return metadata;
}
