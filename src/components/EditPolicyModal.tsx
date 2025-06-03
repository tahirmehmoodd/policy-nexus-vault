
import { useState, useEffect } from 'react';
import { usePolicies } from '@/hooks/usePolicies';
import { Policy } from '@/types/policy';
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

interface EditPolicyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policy: Policy | null;
}

export function EditPolicyModal({ open, onOpenChange, policy }: EditPolicyModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    type: '',
    status: 'draft' as 'draft' | 'active' | 'archived',
    tags: [] as string[],
    newTag: '',
    changeDescription: '',
  });
  
  const { updatePolicy } = usePolicies();
  const { toast } = useToast();

  // Update form data when policy changes
  useEffect(() => {
    if (policy) {
      setFormData({
        title: policy.title,
        description: policy.description,
        content: policy.content,
        type: policy.type,
        status: policy.status,
        tags: [...policy.tags],
        newTag: '',
        changeDescription: '',
      });
    }
  }, [policy]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!policy) return;
    
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

    if (!formData.changeDescription.trim()) {
      setError('Change description is required for version tracking');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Updating policy with data:', formData);
      
      await updatePolicy(policy.policy_id, {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        content: formData.content.trim(),
        type: formData.type,
        tags: formData.tags,
        status: formData.status,
      }, formData.changeDescription.trim());

      toast({
        title: "Policy Updated",
        description: "Policy has been updated successfully with a new version.",
      });

      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      console.error('Error updating policy:', error);
      setError(error.message || 'Failed to update policy');
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
      changeDescription: '',
    });
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

  if (!policy) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Policy - {policy.title}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Current version: {policy.currentVersion} | Last updated: {new Date(policy.updated_at).toLocaleDateString()}
          </p>
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
              placeholder="Enter policy content"
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
            <Label htmlFor="changeDescription">Change Description *</Label>
            <Textarea
              id="changeDescription"
              value={formData.changeDescription}
              onChange={(e) => setFormData({ ...formData, changeDescription: e.target.value })}
              rows={3}
              required
              placeholder="Describe what changes you made in this version..."
            />
            <p className="text-xs text-muted-foreground">
              This will be saved as the version description and helps track policy evolution.
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Policy'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
