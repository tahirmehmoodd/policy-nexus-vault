import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { usePolicySections, DatabasePolicySection } from '@/hooks/usePolicySections';
import { FileText, Shield, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface PolicySectionsViewProps {
  policyId: string;
}

export function PolicySectionsView({ policyId }: PolicySectionsViewProps) {
  const [sections, setSections] = useState<DatabasePolicySection[]>([]);
  const { getPolicySections, loading } = usePolicySections();

  useEffect(() => {
    const loadSections = async () => {
      const data = await getPolicySections(policyId);
      setSections(data);
    };
    
    if (policyId) {
      loadSections();
    }
  }, [policyId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No sections available for this policy.</p>
          <p className="text-sm mt-1">Sections will be created automatically when the policy content is structured with headings.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Policy Sections ({sections.length})</h3>
        <Badge variant="outline">
          <Shield className="h-3 w-3 mr-1" />
          Compliance Tags Available
        </Badge>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {sections.map((section, index) => {
          const complianceTags = Array.isArray(section.compliance_tags) 
            ? section.compliance_tags 
            : [];

          return (
            <motion.div
              key={section.section_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AccordionItem value={`section-${section.section_number}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <Badge variant="secondary" className="shrink-0">
                      {section.section_number}
                    </Badge>
                    <span className="font-medium">{section.section_title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Card className="mt-2">
                    <CardContent className="p-4 space-y-4">
                      <div className="prose prose-sm max-w-none">
                        <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                          {section.section_content}
                        </p>
                      </div>

                      {complianceTags.length > 0 && (
                        <div className="border-t pt-3">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">
                            COMPLIANCE FRAMEWORK TAGS:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {complianceTags.map((tag, tagIndex) => (
                              <Badge 
                                key={tagIndex} 
                                variant="outline" 
                                className="text-xs"
                              >
                                <Shield className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="border-t pt-3 text-xs text-muted-foreground">
                        <p>Section created: {new Date(section.created_at).toLocaleDateString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          );
        })}
      </Accordion>
    </div>
  );
}
