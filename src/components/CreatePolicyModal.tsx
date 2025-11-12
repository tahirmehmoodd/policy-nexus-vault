import { useState } from 'react';
import { usePolicies } from '@/hooks/usePolicies';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { X, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CreatePolicyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePolicyModal({ open, onOpenChange }: CreatePolicyModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    type: '',
    tags: [] as string[],
    newTag: '',
    owner: '',
    department: '',
  });
  const [file, setFile] = useState<File | null>(null);
  
  const { createPolicy } = usePolicies();
  const { uploadFile, uploading } = useFileUpload();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate required fields
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }
    
    if (!formData.type) {
      setError('Policy type is required');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Submitting policy creation form with data:', formData);
      
      // Policies are always created in draft status
      const policy = await createPolicy({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        content: formData.content.trim(),
        type: formData.type,
        tags: formData.tags,
        owner: formData.owner.trim() || undefined,
        department: formData.department.trim() || undefined,
      });

      console.log('Policy created successfully:', policy);

      // Upload file if provided
      if (file && policy) {
        try {
          console.log('Uploading file:', file.name);
          const fileUrl = await uploadFile(file, policy.id);
          console.log('File uploaded successfully:', fileUrl);
        } catch (fileError) {
          console.error('File upload failed:', fileError);
          toast({
            title: "Warning",
            description: "Policy created but file upload failed",
            variant: "destructive",
          });
        }
      }

      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      console.error('Error in form submission:', error);
      
      let errorMessage = 'Failed to create policy';
      if (error.message?.includes('authentication') || error.message?.includes('authenticated')) {
        errorMessage = 'You must be logged in to create policies. Please refresh and try again.';
      } else if (error.message?.includes('permission') || error.message?.includes('row-level security')) {
        errorMessage = 'You do not have permission to create policies. Please contact your administrator.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      type: '',
      tags: [],
      newTag: '',
      owner: '',
      department: '',
    });
    setFile(null);
    setError(null);
  };

  const addTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.newTag.trim()],
        newTag: '',
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
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
          <DialogTitle>Create New Policy</DialogTitle>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Enter policy title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Enter policy description (optional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select policy type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Access Control">Access Control</SelectItem>
                <SelectItem value="Data Classification">Data Classification</SelectItem>
                <SelectItem value="Network Security">Network Security</SelectItem>
                <SelectItem value="Incident Management">Incident Management</SelectItem>
                <SelectItem value="Asset Management">Asset Management</SelectItem>
                <SelectItem value="Business Continuity">Business Continuity</SelectItem>
                <SelectItem value="Acceptable Use">Acceptable Use</SelectItem>
                <SelectItem value="Information Security">Information Security</SelectItem>
                <SelectItem value="Physical Security">Physical Security</SelectItem>
                <SelectItem value="Risk Management">Risk Management</SelectItem>
              </SelectContent>
            </Select>
          </div>


          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="owner">Policy Owner</Label>
              <Input
                id="owner"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                placeholder="e.g., John Doe"
              />
              <p className="text-xs text-muted-foreground">Person responsible for this policy</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g., IT Security"
              />
              <p className="text-xs text-muted-foreground">Department managing this policy</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              required
              placeholder="Enter policy content. Use headings (# Heading or 1. Heading) to create sections that will be auto-detected."
            />
            <p className="text-xs text-muted-foreground">
              Tip: Use headings to structure your content into sections. Sections will be automatically detected and tagged with compliance frameworks.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={formData.newTag}
                onChange={(e) => setFormData({ ...formData, newTag: e.target.value })}
                placeholder="Add tag"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Upload File (Optional)</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.doc,.docx,.txt,.xml"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || uploading}>
              {loading || uploading ? 'Creating...' : 'Create Policy'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
