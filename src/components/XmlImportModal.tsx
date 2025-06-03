
import { useState } from 'react';
import { usePolicies } from '@/hooks/usePolicies';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertCircle, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface XmlImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function XmlImportModal({ open, onOpenChange }: XmlImportModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [xmlContent, setXmlContent] = useState('');
  const [parsedPolicy, setParsedPolicy] = useState<any>(null);
  
  const { createPolicy, convertXmlToPolicy } = usePolicies();
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.xml')) {
      setError('Please select an XML file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setXmlContent(content);
      
      try {
        const parsed = convertXmlToPolicy(content);
        setParsedPolicy(parsed);
        setError(null);
      } catch (error) {
        setError('Failed to parse XML file');
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!parsedPolicy) return;
    
    try {
      setLoading(true);
      await createPolicy({
        title: parsedPolicy.title,
        description: parsedPolicy.description,
        content: parsedPolicy.content,
        type: parsedPolicy.type,
        tags: parsedPolicy.tags,
        status: 'draft',
      });

      toast({
        title: "Success",
        description: "XML policy imported successfully",
      });

      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error importing policy:', error);
      setError('Failed to import policy');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setXmlContent('');
    setParsedPolicy(null);
    setError(null);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Policy from XML</DialogTitle>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="xml-file">Select XML File</Label>
            <Input
              id="xml-file"
              type="file"
              accept=".xml"
              onChange={handleFileUpload}
            />
          </div>

          {xmlContent && (
            <div className="space-y-2">
              <Label>XML Content Preview</Label>
              <Textarea
                value={xmlContent}
                onChange={(e) => setXmlContent(e.target.value)}
                rows={6}
                className="font-mono text-sm"
              />
            </div>
          )}

          {parsedPolicy && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <h3 className="font-semibold">Parsed Policy Preview</h3>
              <div className="grid gap-2 text-sm">
                <div><strong>Title:</strong> {parsedPolicy.title}</div>
                <div><strong>Type:</strong> {parsedPolicy.type}</div>
                <div><strong>Description:</strong> {parsedPolicy.description}</div>
                <div><strong>Tags:</strong> {parsedPolicy.tags?.join(', ') || 'None'}</div>
                <div><strong>Content Length:</strong> {parsedPolicy.content?.length || 0} characters</div>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleImport} 
              disabled={!parsedPolicy || loading}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {loading ? 'Importing...' : 'Import Policy'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
