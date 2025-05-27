import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { SearchIcon, FilterIcon, XIcon, TagIcon } from "lucide-react";
import { SECURITY_TAGS, fuzzySearch } from "@/types/policy";

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  availableTags: string[];
}

export interface FilterState {
  searchQuery: string;
  selectedTags: string[];
  tagMatchMode: 'any' | 'all';
  statusFilter: string;
  typeFilter: string;
  frameworkFilter: string;
  enableFuzzySearch: boolean;
}

export function AdvancedFilters({ onFiltersChange, availableTags }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedTags: [],
    tagMatchMode: 'any',
    statusFilter: 'all',
    typeFilter: 'all',
    frameworkFilter: 'all',
    enableFuzzySearch: true
  });

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, searchQuery: value }));
  };

  const handleTagToggle = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter(t => t !== tag)
        : [...prev.selectedTags, tag]
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      searchQuery: '',
      selectedTags: [],
      tagMatchMode: 'any',
      statusFilter: 'all',
      typeFilter: 'all',
      frameworkFilter: 'all',
      enableFuzzySearch: true
    });
  };

  const removeTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.filter(t => t !== tag)
    }));
  };

  const hasActiveFilters = filters.searchQuery || 
                          filters.selectedTags.length > 0 || 
                          filters.statusFilter !== 'all' || 
                          filters.typeFilter !== 'all' || 
                          filters.frameworkFilter !== 'all';

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SearchIcon className="h-5 w-5" />
            <CardTitle className="text-lg">Advanced Filters</CardTitle>
            {hasActiveFilters && (
              <Badge variant="secondary">{filters.selectedTags.length + (filters.searchQuery ? 1 : 0)} active</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                <XIcon className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <FilterIcon className="h-4 w-4 mr-1" />
              {isExpanded ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </div>
        <CardDescription>
          Search and filter policies by various criteria
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Policies</Label>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search in title, description, or content..."
              value={filters.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="fuzzy-search"
              checked={filters.enableFuzzySearch}
              onCheckedChange={(checked) =>
                setFilters(prev => ({ ...prev, enableFuzzySearch: checked }))
              }
            />
            <Label htmlFor="fuzzy-search" className="text-sm">
              Enable fuzzy search
            </Label>
          </div>
        </div>

        {/* Selected Tags Display */}
        {filters.selectedTags.length > 0 && (
          <div className="space-y-2">
            <Label>Selected Tags</Label>
            <div className="flex flex-wrap gap-1">
              {filters.selectedTags.map(tag => (
                <Badge key={tag} variant="default" className="flex items-center gap-1">
                  <TagIcon className="h-3 w-3" />
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1 hover:bg-transparent"
                    onClick={() => removeTag(tag)}
                  >
                    <XIcon className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <Label className="text-sm">Tag Match Mode:</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="match-any"
                  name="tagMatchMode"
                  checked={filters.tagMatchMode === 'any'}
                  onChange={() => setFilters(prev => ({ ...prev, tagMatchMode: 'any' }))}
                />
                <Label htmlFor="match-any" className="text-sm">Match Any</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="match-all"
                  name="tagMatchMode"
                  checked={filters.tagMatchMode === 'all'}
                  onChange={() => setFilters(prev => ({ ...prev, tagMatchMode: 'all' }))}
                />
                <Label htmlFor="match-all" className="text-sm">Match All</Label>
              </div>
            </div>
          </div>
        )}

        {isExpanded && (
          <>
            <Separator />
            
            {/* Tag Selection */}
            <div className="space-y-2">
              <Label>Filter by Tags</Label>
              <ScrollArea className="h-32 border rounded-md p-2">
                <div className="grid grid-cols-2 gap-2">
                  {SECURITY_TAGS.map(tag => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={tag}
                        checked={filters.selectedTags.includes(tag)}
                        onCheckedChange={() => handleTagToggle(tag)}
                      />
                      <Label htmlFor={tag} className="text-sm font-normal">
                        {tag}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <Separator />

            {/* Other Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={filters.statusFilter} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, statusFilter: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <Select 
                  value={filters.typeFilter} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, typeFilter: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Access Control">Access Control</SelectItem>
                    <SelectItem value="Data Classification">Data Classification</SelectItem>
                    <SelectItem value="Network Security">Network Security</SelectItem>
                    <SelectItem value="Incident Response">Incident Response</SelectItem>
                    <SelectItem value="Physical Security">Physical Security</SelectItem>
                    <SelectItem value="Risk Management">Risk Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Framework Category</Label>
                <Select 
                  value={filters.frameworkFilter} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, frameworkFilter: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="physical">Physical Controls</SelectItem>
                    <SelectItem value="technical">Technical Controls</SelectItem>
                    <SelectItem value="organizational">Organizational Controls</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
