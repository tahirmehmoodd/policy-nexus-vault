
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, X, Tag } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SearchFiltersProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  availableTags: string[];
  loading?: boolean;
}

export interface SearchFilters {
  tags: string[];
  type: string;
  status: string;
  category: string;
}

const POLICY_TYPES = [
  'Access Control',
  'Data Classification', 
  'Network Security',
  'Incident Management',
  'Asset Management',
  'Business Continuity',
  'Acceptable Use',
  'Information Security',
  'Physical Security',
  'Risk Management'
];

const POLICY_STATUS = [
  'draft',
  'active', 
  'archived',
  'under_review'
];

const POLICY_CATEGORIES = [
  'Technical Control',
  'Physical Control',
  'Organizational Control',
  'Administrative Control'
];

export function EnhancedSearchFilters({ onSearch, availableTags, loading }: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    tags: [],
    type: '',
    status: '',
    category: ''
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = () => {
    onSearch(searchQuery, filters);
  };

  const addTag = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      const newFilters = { ...filters, tags: [...filters.tags, tag] };
      setFilters(newFilters);
    }
  };

  const removeTag = (tag: string) => {
    const newFilters = { ...filters, tags: filters.tags.filter(t => t !== tag) };
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      tags: [],
      type: '',
      status: '',
      category: ''
    });
    setSearchQuery('');
  };

  const hasActiveFilters = searchQuery || filters.tags.length > 0 || filters.type || filters.status || filters.category;

  // Auto-search when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchQuery, filters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters, onSearch]);

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter Policies
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Search */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search policies by title, description, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {/* Quick Tag Selection */}
        {availableTags.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Quick Tag Filter:</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.slice(0, 8).map(tag => (
                <Badge
                  key={tag}
                  variant={filters.tags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => filters.tags.includes(tag) ? removeTag(tag) : addTag(tag)}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Selected Tags */}
        {filters.tags.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Selected Tags:</label>
            <div className="flex flex-wrap gap-2">
              {filters.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Advanced Filters */}
        <Collapsible open={showAdvanced}>
          <CollapsibleContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Policy Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Policy Type</label>
                <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All types</SelectItem>
                    {POLICY_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    {POLICY_STATUS.map(status => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Control Category</label>
                <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    {POLICY_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tag Input for Custom Tags */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Add Custom Tag Filter</label>
              <Select value="" onValueChange={addTag}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a tag to filter by..." />
                </SelectTrigger>
                <SelectContent>
                  {availableTags
                    .filter(tag => !filters.tags.includes(tag))
                    .map(tag => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Search Summary */}
        {hasActiveFilters && (
          <div className="text-sm text-muted-foreground">
            Searching with {[
              searchQuery && `query: "${searchQuery}"`,
              filters.tags.length > 0 && `${filters.tags.length} tag(s)`,
              filters.type && `type: ${filters.type}`,
              filters.status && `status: ${filters.status}`,
              filters.category && `category: ${filters.category}`
            ].filter(Boolean).join(', ')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
