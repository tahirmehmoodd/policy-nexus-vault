
import { useState } from "react";
import { mockPolicies } from "@/data/mockPolicies";
import { Policy } from "@/types/policy";
import { Sidebar } from "@/components/Sidebar";
import { SearchBar } from "@/components/SearchBar";
import { PolicyList } from "@/components/PolicyList";
import { PolicyDetail } from "@/components/PolicyDetail";
import { UploadPolicyButton } from "@/components/UploadPolicyButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const [policies, setPolicies] = useState<Policy[]>(mockPolicies);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  
  // Edit Policy State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editType, setEditType] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  // Filter policies based on search query and category
  const filteredPolicies = policies.filter((policy) => {
    const matchesSearch = 
      searchQuery.trim() === "" || 
      policy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = 
      filterCategory === "all" || 
      policy.type.toLowerCase().includes(filterCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filter: string) => {
    setFilterCategory(filter);
  };

  const handlePolicyClick = (policy: Policy) => {
    setSelectedPolicy(policy);
  };

  const handleBackToList = () => {
    setSelectedPolicy(null);
  };
  
  const handleAddPolicy = (newPolicy: Policy) => {
    setPolicies(prevPolicies => [...prevPolicies, newPolicy]);
  };
  
  const handleEditPolicy = (policy: Policy) => {
    setEditingPolicy(policy);
    setEditTitle(policy.title);
    setEditDescription(policy.description);
    setEditType(policy.type);
    setEditContent(policy.content);
    setEditTags([...policy.tags]);
    setIsEditDialogOpen(true);
  };
  
  const handleAddTag = () => {
    if (newTag && !editTags.includes(newTag)) {
      setEditTags([...editTags, newTag]);
      setNewTag("");
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setEditTags(editTags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSavePolicy = () => {
    if (!editingPolicy) return;
    
    // Create a new version
    const newVersion = {
      version_id: `v-${Date.now()}`,
      version_label: `v${Number(editingPolicy.currentVersion) + 0.1}`,
      description: "Updated policy",
      created_at: new Date().toISOString(),
      edited_by: "Current User" // In a real app, this would come from authentication
    };
    
    // Update the policy with new data
    const updatedPolicy: Policy = {
      ...editingPolicy,
      title: editTitle,
      description: editDescription,
      type: editType,
      content: editContent,
      tags: editTags,
      updated_at: new Date().toISOString(),
      currentVersion: (Number(editingPolicy.currentVersion) + 0.1).toFixed(1),
      versions: [newVersion, ...editingPolicy.versions]
    };
    
    // Update policies array
    setPolicies(prevPolicies => 
      prevPolicies.map(p => 
        p.policy_id === updatedPolicy.policy_id ? updatedPolicy : p
      )
    );
    
    // If this policy is currently selected, update it
    if (selectedPolicy?.policy_id === updatedPolicy.policy_id) {
      setSelectedPolicy(updatedPolicy);
    }
    
    toast({
      title: "Policy updated",
      description: `${updatedPolicy.title} has been updated to version ${updatedPolicy.currentVersion}`,
    });
    
    setIsEditDialogOpen(false);
  };
  
  const handleDownloadVersionInDetail = (versionId: string) => {
    if (!selectedPolicy) return;
    
    const version = selectedPolicy.versions.find(v => v.version_id === versionId);
    if (!version) return;
    
    // In a real app, this would fetch the specific version content
    const versionContent = {
      title: selectedPolicy.title,
      description: selectedPolicy.description,
      content: selectedPolicy.content,
      version: version.version_label,
      created_at: version.created_at,
      edited_by: version.edited_by
    };
    
    // Create a blob with the policy content
    const blob = new Blob([JSON.stringify(versionContent, null, 2)], { type: "application/json" });
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedPolicy.title.replace(/\s+/g, "_")}-${version.version_label}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Version downloaded",
      description: `${selectedPolicy.title} (${version.version_label}) has been downloaded`,
    });
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-between px-6 border-b">
          <h1 className="text-2xl font-semibold">Security Policy Repository</h1>
          <UploadPolicyButton onPolicyCreated={handleAddPolicy} />
        </header>
        
        <main className="flex-1 overflow-auto p-6">
          {!selectedPolicy ? (
            <>
              <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="w-full max-w-md">
                  <SearchBar 
                    onSearch={handleSearch} 
                    onFilterChange={handleFilterChange} 
                  />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {filteredPolicies.length} policies found
                  </p>
                </div>
              </div>
              
              {filteredPolicies.length > 0 ? (
                <PolicyList 
                  policies={filteredPolicies} 
                  onPolicyClick={handlePolicyClick}
                  onEditPolicy={handleEditPolicy}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-64">
                  <p className="text-xl text-muted-foreground mb-2">No policies found</p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </>
          ) : (
            <PolicyDetail 
              policy={selectedPolicy} 
              onBack={handleBackToList}
              onEdit={() => handleEditPolicy(selectedPolicy)}
              onVersionDownload={handleDownloadVersionInDetail}
            />
          )}
        </main>
      </div>
      
      {/* Edit Policy Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Policy</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                Title
              </Label>
              <Input 
                id="edit-title" 
                className="col-span-3" 
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">
                Type
              </Label>
              <Select value={editType} onValueChange={setEditType}>
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
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Textarea 
                id="edit-description" 
                className="col-span-3" 
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-content" className="text-right">
                Content
              </Label>
              <Textarea 
                id="edit-content" 
                className="col-span-3"
                rows={5} 
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-tags" className="text-right">
                Tags
              </Label>
              <div className="col-span-3 flex flex-wrap gap-2">
                {editTags.map((tag) => (
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
                    id="edit-tags"
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
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePolicy}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
