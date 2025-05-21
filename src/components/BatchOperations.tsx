
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Policy } from "@/types/policy";
import { 
  ChevronDown, 
  Tag, 
  Download, 
  Folder, 
  ArrowDown, 
  ArrowUp,
  Check,
  X,
  Plus
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BatchOperationsProps {
  policies: Policy[];
  selectedIds: string[];
  onSelectAll: () => void;
  onClearSelection: () => void;
  onToggleSelection: (id: string) => void;
  onDownloadSelected: (format: string) => void;
  onCategorizeSelected: (category: string) => void;
  onTagSelected: (tags: string[]) => void;
}

export function BatchOperations({
  policies,
  selectedIds,
  onSelectAll,
  onClearSelection,
  onToggleSelection,
  onDownloadSelected,
  onCategorizeSelected,
  onTagSelected
}: BatchOperationsProps) {
  const [isAddTagOpen, setIsAddTagOpen] = useState(false);
  const [isCategorizeOpen, setIsCategorizeOpen] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [tagsToAdd, setTagsToAdd] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  
  const categories = [
    { id: "access", name: "Access Control" },
    { id: "data", name: "Data Classification" },
    { id: "network", name: "Network Security" },
    { id: "user", name: "User Account" },
    { id: "incident", name: "Incident Handling" },
  ];
  
  // Check if all policies are selected
  const areAllSelected = selectedIds.length === policies.length;
  
  // Get all unique tags from all policies
  const getAllTags = () => {
    const tags = new Set<string>();
    policies.forEach(policy => {
      policy.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  };
  
  // Handler for adding a tag
  const handleAddTag = () => {
    if (newTag && !tagsToAdd.includes(newTag)) {
      setTagsToAdd([...tagsToAdd, newTag]);
      setNewTag("");
    }
  };
  
  // Handler for removing a tag
  const handleRemoveTag = (tag: string) => {
    setTagsToAdd(tagsToAdd.filter(t => t !== tag));
  };
  
  // Handler for confirming tag addition
  const handleConfirmTags = () => {
    onTagSelected(tagsToAdd);
    setTagsToAdd([]);
    setIsAddTagOpen(false);
  };
  
  // Handler for confirming category change
  const handleConfirmCategory = () => {
    if (selectedCategory) {
      onCategorizeSelected(selectedCategory);
      setSelectedCategory("");
      setIsCategorizeOpen(false);
    }
  };
  
  // Sort selected to the top
  const sortedPolicies = [...policies].sort((a, b) => {
    const aSelected = selectedIds.includes(a.policy_id);
    const bSelected = selectedIds.includes(b.policy_id);
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return 0;
  });
  
  return (
    <>
      <div className="bg-white p-4 border rounded-md shadow-sm mb-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox 
              id="select-all" 
              checked={areAllSelected}
              onCheckedChange={() => {
                if (areAllSelected) {
                  onClearSelection();
                } else {
                  onSelectAll();
                }
              }}
            />
            <label 
              htmlFor="select-all"
              className="text-sm font-medium cursor-pointer"
            >
              Select All
            </label>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {selectedIds.length} {selectedIds.length === 1 ? 'policy' : 'policies'} selected
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild disabled={selectedIds.length === 0}>
                <Button variant="outline" size="sm" className="gap-2" disabled={selectedIds.length === 0}>
                  Actions
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Batch Operations</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setIsAddTagOpen(true)}>
                    <Tag className="mr-2 h-4 w-4" />
                    Add Tags
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsCategorizeOpen(true)}>
                    <Folder className="mr-2 h-4 w-4" />
                    Change Category
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Download As</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => onDownloadSelected("json")}>
                    <Download className="mr-2 h-4 w-4" />
                    JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDownloadSelected("text")}>
                    <Download className="mr-2 h-4 w-4" />
                    Plain Text
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDownloadSelected("pdf")}>
                    <Download className="mr-2 h-4 w-4" />
                    PDF
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClearSelection}
              disabled={selectedIds.length === 0}
            >
              Clear Selection
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-muted/30 p-1 sm:p-2 border rounded-md mb-4">
        <ScrollArea className="h-[200px]">
          <div className="space-y-1">
            {sortedPolicies.map((policy) => {
              const isSelected = selectedIds.includes(policy.policy_id);
              
              return (
                <div
                  key={policy.policy_id}
                  className={`flex items-center p-2 ${
                    isSelected ? "bg-primary/10" : "hover:bg-muted"
                  } rounded-md transition-colors`}
                >
                  <Checkbox
                    id={`policy-${policy.policy_id}`}
                    checked={isSelected}
                    onCheckedChange={() => onToggleSelection(policy.policy_id)}
                    className="mr-3"
                  />
                  <label
                    htmlFor={`policy-${policy.policy_id}`}
                    className="flex-1 flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="font-medium">{policy.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {policy.type} • Updated on {new Date(policy.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                    {isSelected && (
                      <Badge variant="outline" className="ml-2">
                        <Check className="h-3 w-3 mr-1" /> Selected
                      </Badge>
                    )}
                  </label>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
      
      {/* Add Tags Dialog */}
      <Dialog open={isAddTagOpen} onOpenChange={setIsAddTagOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Tags to Selected Policies</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {tagsToAdd.map((tag) => (
                <Badge key={tag} variant="outline" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Enter a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" size="sm" onClick={handleAddTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-2">
              <h4 className="text-sm font-medium mb-2">Popular Tags</h4>
              <ScrollArea className="h-[100px]">
                <div className="flex flex-wrap gap-2">
                  {getAllTags().map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className={`cursor-pointer ${
                        tagsToAdd.includes(tag) ? "bg-primary/10" : ""
                      }`}
                      onClick={() => {
                        if (tagsToAdd.includes(tag)) {
                          handleRemoveTag(tag);
                        } else {
                          setTagsToAdd([...tagsToAdd, tag]);
                        }
                      }}
                    >
                      {tag}
                      {tagsToAdd.includes(tag) && <Check className="h-3 w-3 ml-1" />}
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTagOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmTags} disabled={tagsToAdd.length === 0}>
              Add Tags to {selectedIds.length} {selectedIds.length === 1 ? 'Policy' : 'Policies'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Change Category Dialog */}
      <Dialog open={isCategorizeOpen} onOpenChange={setIsCategorizeOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Change Category for Selected Policies</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Select New Category
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategorizeOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmCategory} 
              disabled={!selectedCategory}
            >
              Update {selectedIds.length} {selectedIds.length === 1 ? 'Policy' : 'Policies'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
