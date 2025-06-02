
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
import { X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface CreatePolicyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePolicyModal({ open, onOpenChange }: CreatePolicyModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    type: '',
    status: 'draft' as 'draft' | 'active' | 'archived',
    tags: [] as string[],
    newTag: '',
  });
  const [file, setFile] = useState<File | null>(null);
  
  const { createPolicy } = usePolicies();
  const { uploadFile, uploading } = useFileUpload();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const policy = await createPolicy({
        title: formData.title,
        description: formData.description,
        content: formData.content,
        type: formData.type,
        tags: formData.tags,
        status: formData.status,
      });

      // Upload file if provided
      if (file && policy) {
        const fileUrl = await uploadFile(file, policy.id);
        // Update policy with file URL
        // This would require another update call
      }

      toast({
        title: "Policy Created",
        description: "Your policy has been successfully created.",
      });

      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error creating policy:', error);
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
      status: 'draft',
      tags: [],
      newTag: '',
    });
    setFile(null);
  };

  const addTag = () => {
    if (formData.newTag && !formData.tags.includes(formData.newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.newTag],
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Policy</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
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
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              required
            />
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
