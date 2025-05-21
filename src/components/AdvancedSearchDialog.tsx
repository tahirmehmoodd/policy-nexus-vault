
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal, X, Tag } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface AdvancedSearchProps {
  onSearch: (criteria: SearchCriteria) => void;
}

export interface SearchCriteria {
  query: string;
  category: string;
  tags: string[];
  dateFrom?: string;
  dateTo?: string;
  onlyActive: boolean;
  searchInContent: boolean;
}

export function AdvancedSearchDialog({ onSearch }: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [criteria, setCriteria] = useState<SearchCriteria>({
    query: "",
    category: "all",
    tags: [],
    onlyActive: false,
    searchInContent: true
  });
  
  const [newTag, setNewTag] = useState("");
  
  const categories = [
    { id: "all", name: "All Policies" },
    { id: "access", name: "Access Control" },
    { id: "data", name: "Data Classification" },
    { id: "network", name: "Network Security" },
    { id: "user", name: "User Account" },
    { id: "incident", name: "Incident Handling" },
  ];
  
  const handleAddTag = () => {
    if (newTag && !criteria.tags.includes(newTag)) {
      setCriteria({ ...criteria, tags: [...criteria.tags, newTag] });
      setNewTag("");
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setCriteria({ ...criteria, tags: criteria.tags.filter(t => t !== tag) });
  };
  
  const handleSearch = () => {
    onSearch(criteria);
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Advanced Search
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Advanced Search</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="search-query" className="text-right">
              Keywords
            </Label>
            <Input
              id="search-query"
              placeholder="Search terms..."
              className="col-span-3"
              value={criteria.query}
              onChange={(e) => setCriteria({ ...criteria, query: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="search-category" className="text-right">
              Category
            </Label>
            <Select 
              value={criteria.category} 
              onValueChange={(value) => setCriteria({ ...criteria, category: value })}
            >
              <SelectTrigger id="search-category" className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Time Range
            </Label>
            <div className="col-span-3 flex space-x-2">
              <Input
                type="date"
                placeholder="From"
                className="flex-1"
                value={criteria.dateFrom || ""}
                onChange={(e) => setCriteria({ ...criteria, dateFrom: e.target.value })}
              />
              <Input
                type="date"
                placeholder="To"
                className="flex-1"
                value={criteria.dateTo || ""}
                onChange={(e) => setCriteria({ ...criteria, dateTo: e.target.value })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="search-tags" className="text-right">
              Tags
            </Label>
            <div className="col-span-3">
              <div className="flex flex-wrap gap-2 mb-2">
                {criteria.tags.map((tag) => (
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
                  id="search-tags"
                  placeholder="Add tags..."
                  className="flex-1"
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
                  Add
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Tag className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48">
                    <div className="text-sm font-medium mb-2">Popular Tags</div>
                    <div className="flex flex-wrap gap-1">
                      {["security", "compliance", "network", "data", "user", "access"].map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer hover:bg-muted"
                          onClick={() => {
                            if (!criteria.tags.includes(tag)) {
                              setCriteria({ ...criteria, tags: [...criteria.tags, tag] });
                            }
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-1"></div>
            <div className="col-span-3 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="search-active" 
                  checked={criteria.onlyActive}
                  onCheckedChange={(checked) => 
                    setCriteria({ ...criteria, onlyActive: checked === true })
                  }
                />
                <label
                  htmlFor="search-active"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Show only active policies
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="search-content" 
                  checked={criteria.searchInContent}
                  onCheckedChange={(checked) => 
                    setCriteria({ ...criteria, searchInContent: checked === true })
                  }
                />
                <label
                  htmlFor="search-content"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Search within policy content
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSearch}>
            Search
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
