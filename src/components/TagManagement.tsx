
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { X, Plus, Search, CheckIcon, TrashIcon, EditIcon } from "lucide-react";
import { Policy } from "@/types/policy";

interface TagManagementProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  policies: Policy[];
  onUpdatePolicy: (policy: Policy) => void;
}

export function TagManagement({ isOpen, onOpenChange, policies, onUpdatePolicy }: TagManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [newTag, setNewTag] = useState("");
  const [tagToRename, setTagToRename] = useState<{tag: string, newName: string} | null>(null);
  
  // Get all unique tags
  const getAllTags = () => {
    const tags = new Set<string>();
    policies.forEach(policy => {
      policy.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  };
  
  // Count occurrences of each tag
  const getTagCounts = () => {
    const tagCounts: Record<string, number> = {};
    policies.forEach(policy => {
      policy.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    return tagCounts;
  };
  
  const allTags = getAllTags();
  const tagCounts = getTagCounts();
  
  // Filter tags based on search query
  const filteredTags = allTags.filter(tag => 
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => tagCounts[b] - tagCounts[a]);
  
  // Get policies that use a specific tag
  const getPoliciesWithTag = (tag: string) => {
    return policies.filter(policy => policy.tags.includes(tag));
  };
  
  // Handle tag deletion
  const handleDeleteTag = (tag: string) => {
    const affectedPolicies = getPoliciesWithTag(tag);
    
    // Remove tag from all affected policies
    affectedPolicies.forEach(policy => {
      const updatedPolicy = {
        ...policy,
        tags: policy.tags.filter(t => t !== tag)
      };
      onUpdatePolicy(updatedPolicy);
    });
  };
  
  // Handle tag renaming
  const handleRenameTag = () => {
    if (!tagToRename) return;
    
    const { tag, newName } = tagToRename;
    
    // Skip if new name is empty or already exists
    if (!newName.trim() || (newName !== tag && allTags.includes(newName))) {
      setTagToRename(null);
      return;
    }
    
    // Update tag in all affected policies
    const affectedPolicies = getPoliciesWithTag(tag);
    affectedPolicies.forEach(policy => {
      const updatedTags = policy.tags.map(t => t === tag ? newName : t);
      const updatedPolicy = {
        ...policy,
        tags: updatedTags
      };
      onUpdatePolicy(updatedPolicy);
    });
    
    setTagToRename(null);
  };
  
  // Handle adding a new tag to all policies
  const handleAddGlobalTag = () => {
    if (!newTag.trim() || allTags.includes(newTag)) {
      setNewTag("");
      return;
    }
    
    // Add the tag to a selected policy
    if (policies.length > 0) {
      const updatedPolicy = {
        ...policies[0],
        tags: [...policies[0].tags, newTag]
      };
      onUpdatePolicy(updatedPolicy);
    }
    
    setNewTag("");
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Tag Management</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tags..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="New tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddGlobalTag();
                }
              }}
            />
            <Button size="icon" onClick={handleAddGlobalTag}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {filteredTags.length > 0 ? (
                filteredTags.map(tag => (
                  <div key={tag} className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    {tagToRename && tagToRename.tag === tag ? (
                      <div className="flex-1 flex gap-2">
                        <Input
                          value={tagToRename.newName}
                          onChange={(e) => setTagToRename({ ...tagToRename, newName: e.target.value })}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleRenameTag();
                            } else if (e.key === 'Escape') {
                              setTagToRename(null);
                            }
                          }}
                        />
                        <Button size="icon" variant="ghost" onClick={handleRenameTag}>
                          <CheckIcon className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setTagToRename(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-sm px-2 py-1 font-normal">
                            {tag}
                          </Badge>
                          <span className="text-muted-foreground text-sm">
                            {tagCounts[tag]} {tagCounts[tag] === 1 ? 'policy' : 'policies'}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => setTagToRename({ tag, newName: tag })}
                          >
                            <EditIcon className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => handleDeleteTag(tag)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center p-4 text-muted-foreground">
                  {searchQuery ? "No tags match your search" : "No tags found"}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Label className="text-sm text-muted-foreground block mb-2">Tag Best Practices</Label>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Use consistent naming conventions</li>
            <li>• Avoid duplicates with slightly different spellings</li>
            <li>• Use specific, descriptive tags</li>
            <li>• Group related policies with common tags</li>
          </ul>
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
