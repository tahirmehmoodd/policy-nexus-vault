
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, UploadIcon, FileTextIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Policy, convertXmlToPolicy } from "@/types/policy";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface UploadPolicyButtonProps {
  onPolicyCreated: (policy: Policy) => void;
  embedMode?: boolean;
}

export function UploadPolicyButton({ onPolicyCreated, embedMode = false }: UploadPolicyButtonProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [xmlProcessing, setXmlProcessing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      if (selectedFile.name.endsWith('.xml')) {
        setXmlProcessing(true);
        try {
          const text = await selectedFile.text();
          const policyData = convertXmlToPolicy(text);
          
          // Update form with XML data
          if (policyData.title) setTitle(policyData.title);
          if (policyData.description) setDescription(policyData.description);
          if (policyData.type) setType(policyData.type);
          if (policyData.content) setContent(policyData.content);
          if (policyData.tags) setTags(policyData.tags);
          
          toast({
            title: "XML file processed",
            description: "The XML file was successfully converted",
          });
        } catch (error) {
          toast({
            title: "Error processing XML",
            description: "Could not process the XML file",
            variant: "destructive",
          });
        } finally {
          setXmlProcessing(false);
        }
      }
    }
  };
  
  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !type) {
      toast({
        title: "Missing required fields",
        description: "Please provide a title and policy type",
        variant: "destructive",
      });
      return;
    }
    
    // Create a new policy object
    const newPolicy: Policy = {
      policy_id: `policy-${Date.now()}`,
      title,
      description,
      type,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: "Current User", // In a real app, this would come from authentication
      content,
      currentVersion: "1.0",
      tags,
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
    
    // Pass the new policy to parent component
    onPolicyCreated(newPolicy);
    
    // Reset the form and close the dialog
    setTitle("");
    setDescription("");
    setType("");
    setContent("");
    setTags([]);
    setFile(null);
    setOpen(false);
  };

  // Render the form content
  const renderFormContent = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">
            Title *
          </Label>
          <Input 
            id="title" 
            className="col-span-3" 
            required 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter policy title"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="type" className="text-right">
            Type *
          </Label>
          <Select value={type} onValueChange={setType} required>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select policy type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="access">Access Control</SelectItem>
              <SelectItem value="data">Data Classification</SelectItem>
              <SelectItem value="network">Network Security</SelectItem>
              <SelectItem value="user">User Account</SelectItem>
              <SelectItem value="incident">Incident Handling</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Textarea 
            id="description" 
            className="col-span-3" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the policy"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="content" className="text-right">
            Content
          </Label>
          <Textarea 
            id="content" 
            className="col-span-3" 
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Full policy content"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="tags" className="text-right">
            Tags
          </Label>
          <div className="col-span-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="flex items-center gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="h-4 w-4 rounded-full bg-muted/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <div className="flex w-full mt-2 gap-2">
              <Input
                id="tags"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className="flex-grow"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleAddTag}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="file" className="text-right">
            Upload File
          </Label>
          <div className="col-span-3">
            <Input
              id="file"
              type="file"
              accept=".xml,.json,.txt,.pdf"
              onChange={handleFileChange}
              disabled={xmlProcessing}
            />
            {xmlProcessing && <p className="text-sm text-muted-foreground mt-1">Processing XML...</p>}
          </div>
        </div>
        {file && (
          <div className="grid grid-cols-4 gap-4">
            <div className="col-start-2 col-span-3">
              <div className="flex items-center gap-2 text-sm text-primary">
                <FileTextIcon className="h-4 w-4" />
                {file.name} ({Math.round(file.size / 1024)} KB)
              </div>
            </div>
          </div>
        )}
      </div>
      <DialogFooter>
        {!embedMode && (
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        )}
        <Button type="submit">
          Create Policy
        </Button>
      </DialogFooter>
    </form>
  );

  // When used in embedded mode (inside another dialog)
  if (embedMode) {
    return renderFormContent();
  }

  // Normal button with dialog mode
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1">
          <PlusIcon className="h-4 w-4" />
          Upload Policy
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Upload New Policy</DialogTitle>
          <DialogDescription>
            Add a new security policy to the repository. You can upload an XML file or create one manually.
          </DialogDescription>
        </DialogHeader>
        {renderFormContent()}
      </DialogContent>
    </Dialog>
  );
}
