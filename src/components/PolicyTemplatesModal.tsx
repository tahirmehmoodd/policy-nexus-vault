
import { useState } from 'react';
import { usePolicyTemplates, PolicyTemplate } from '@/hooks/usePolicyTemplates';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, FileText, Tag } from 'lucide-react';

interface PolicyTemplatesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PolicyTemplatesModal({ open, onOpenChange }: PolicyTemplatesModalProps) {
  const { templates, loading, importTemplate } = usePolicyTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState<PolicyTemplate | null>(null);
  const [importingId, setImportingId] = useState<string | null>(null);

  const handleImportTemplate = async (template: PolicyTemplate) => {
    try {
      setImportingId(template.id);
      await importTemplate(template);
      onOpenChange(false);
    } catch (error) {
      console.error('Error importing template:', error);
    } finally {
      setImportingId(null);
    }
  };

  const groupedTemplates = templates.reduce((acc, template) => {
    const category = template.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(template);
    return acc;
  }, {} as Record<string, PolicyTemplate[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Security Policy Templates</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-6 h-[600px]">
          {/* Templates List */}
          <div className="w-1/2">
            <Tabs defaultValue="all" className="h-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="physical">Physical</TabsTrigger>
                <TabsTrigger value="organizational">Organizational</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                <ScrollArea className="h-[520px]">
                  <div className="space-y-4">
                    {templates.map((template) => (
                      <Card 
                        key={template.id} 
                        className={`cursor-pointer transition-colors ${
                          selectedTemplate?.id === template.id ? 'border-primary' : ''
                        }`}
                        onClick={() => setSelectedTemplate(template)}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">{template.title}</CardTitle>
                          <CardDescription className="text-xs">
                            {template.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              <Badge variant="outline" className="text-xs">
                                {template.type}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {template.source}
                              </Badge>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={importingId === template.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImportTemplate(template);
                              }}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              {importingId === template.id ? 'Importing...' : 'Import'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
                <TabsContent key={category} value={category.toLowerCase().replace(' control', '')} className="mt-4">
                  <ScrollArea className="h-[520px]">
                    <div className="space-y-4">
                      {categoryTemplates.map((template) => (
                        <Card 
                          key={template.id} 
                          className={`cursor-pointer transition-colors ${
                            selectedTemplate?.id === template.id ? 'border-primary' : ''
                          }`}
                          onClick={() => setSelectedTemplate(template)}
                        >
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">{template.title}</CardTitle>
                            <CardDescription className="text-xs">
                              {template.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-center justify-between">
                              <div className="flex flex-wrap gap-1">
                                <Badge variant="outline" className="text-xs">
                                  {template.type}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {template.source}
                                </Badge>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={importingId === template.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleImportTemplate(template);
                                }}
                              >
                                <Download className="h-3 w-3 mr-1" />
                                {importingId === template.id ? 'Importing...' : 'Import'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Template Preview */}
          <div className="w-1/2 border-l pl-6">
            {selectedTemplate ? (
              <div className="h-full flex flex-col">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">{selectedTemplate.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{selectedTemplate.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline">
                      <FileText className="h-3 w-3 mr-1" />
                      {selectedTemplate.type}
                    </Badge>
                    <Badge variant="secondary">{selectedTemplate.category}</Badge>
                    <Badge variant="outline">{selectedTemplate.source}</Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {selectedTemplate.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="h-2 w-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex-1">
                  <h4 className="text-sm font-semibold mb-2">Content Preview</h4>
                  <ScrollArea className="h-[400px] border rounded p-4">
                    <pre className="text-xs whitespace-pre-wrap font-mono">
                      {selectedTemplate.content}
                    </pre>
                  </ScrollArea>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    onClick={() => handleImportTemplate(selectedTemplate)}
                    disabled={importingId === selectedTemplate.id}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {importingId === selectedTemplate.id ? 'Importing...' : 'Import Template'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a template to preview its content</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
