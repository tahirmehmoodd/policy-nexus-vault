
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Search, Filter } from "lucide-react";
import { SECURITY_TAGS, FRAMEWORK_CATEGORIES } from "@/types/policy";

interface AdvancedFiltersProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  selectedFrameworkCategory: string;
  onFrameworkCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  tagMatchMode: 'all' | 'any';
  onTagMatchModeChange: (mode: 'all' | 'any') => void;
  enableFuzzySearch: boolean;
  onFuzzySearchChange: (enabled: boolean) => void;
}

export function AdvancedFilters({
  selectedTags,
  onTagsChange,
  selectedFrameworkCategory,
  onFrameworkCategoryChange,
  searchQuery,
  onSearchChange,
  tagMatchMode,
  onTagMatchModeChange,
  enableFuzzySearch,
  onFuzzySearchChange
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const clearAllFilters = () => {
    onTagsChange([]);
    onFrameworkCategoryChange('all');
    onSearchChange('');
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Filters
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <Label>Search in Policies</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search titles, descriptions, content..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fuzzy"
                checked={enableFuzzySearch}
                onCheckedChange={onFuzzySearchChange}
              />
              <Label htmlFor="fuzzy" className="text-sm">Enable fuzzy search</Label>
            </div>
          </div>

          {/* Framework Category */}
          <div className="space-y-2">
            <Label>Security Framework Category</Label>
            <Select value={selectedFrameworkCategory} onValueChange={onFrameworkCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(FRAMEWORK_CATEGORIES).map(([key, category]) => (
                  <SelectItem key={key} value={key}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Security Tags</Label>
              <div className="flex items-center gap-2">
                <Label className="text-sm">Match:</Label>
                <Select value={tagMatchMode} onValueChange={onTagMatchModeChange}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedTags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      onClick={() => handleTagToggle(tag)}
                      className="ml-1 hover:bg-muted rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            
            <ScrollArea className="h-32 border rounded-md p-2">
              <div className="grid grid-cols-2 gap-2">
                {SECURITY_TAGS.map(tag => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={tag}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => handleTagToggle(tag)}
                    />
                    <Label htmlFor={tag} className="text-sm cursor-pointer">
                      {tag}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={clearAllFilters}>
              Clear All Filters
            </Button>
            <div className="text-sm text-muted-foreground">
              {selectedTags.length} tags selected, Framework: {selectedFrameworkCategory}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
