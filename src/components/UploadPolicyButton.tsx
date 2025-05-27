import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, TagIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Policy } from "@/types/policy";

interface UploadPolicyButtonProps {
  onPolicyCreated: (policy: Policy) => void;
}

export function UploadPolicyButton({ onPolicyCreated }: UploadPolicyButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const { toast } = useToast();

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleCreatePolicy = () => {
    if (!title || !description || !type || !content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newPolicy: Policy = {
      policy_id: `POL-${Date.now()}`,
      title,
      description,
      type,
      status: "draft",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: "Current User",
      content,
      currentVersion: "1.0",
      tags: tags.filter(tag => tag.trim() !== ""),
      framework_category: "technical", // Default value
      security_domain: type, // Use type as domain for now
      versions: [
        {
          version_id: `v-${Date.now()}`,
          version_label: "v1.0",
          description: "Initial version",
          created_at: new Date().toISOString(),
          edited_by: "Current User"
        }
      ]
    };

    onPolicyCreated(newPolicy);
    
    // Reset form
    setTitle("");
    setDescription("");
    setType("");
    setContent("");
    setTags([]);
    setNewTag("");
    setIsDialogOpen(false);

    toast({
      title: "Policy Created",
      description: `${title} has been created successfully.`,
    });
  };

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>Upload Policy</Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload New Policy</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new policy.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select onValueChange={setType}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Access Control">Access Control</SelectItem>
                  <SelectItem value="Data Classification">Data Classification</SelectItem>
                  <SelectItem value="Network Security">Network Security</SelectItem>
                  <SelectItem value="Incident Response">Incident Response</SelectItem>
                  <SelectItem value="Physical Security">Physical Security</SelectItem>
                  <SelectItem value="Risk Management">Risk Management</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="content" className="text-right mt-2">
                Content
              </Label>
              <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                Tags
              </Label>
              <div className="col-span-3 flex items-center">
                <Input
                  type="text"
                  placeholder="Add a tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="mr-2"
                />
                <Button type="button" variant="outline" size="icon" onClick={handleAddTag}>
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {tags.length > 0 && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Current Tags
                </Label>
                <div className="col-span-3 flex flex-wrap gap-1">
                  {tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-0.5">
                      <TagIcon className="w-3 h-3" />
                      {tag}
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveTag(tag)}>
                        <PlusIcon className="h-4 w-4 rotate-45" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleCreatePolicy}>Create Policy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
