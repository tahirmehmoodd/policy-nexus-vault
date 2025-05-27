
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { PolicyList } from "@/components/PolicyList";
import { PolicyDetail } from "@/components/PolicyDetail";
import { AdvancedFilters, FilterState } from "@/components/AdvancedFilters";
import { Policy } from "@/types/policy";
import { UploadPolicyButton } from "@/components/UploadPolicyButton";
import { mockPolicies } from "@/data/mockPolicies";
import { useToast } from "@/components/ui/use-toast";
import { fuzzySearch } from "@/types/policy";

const Index = () => {
  const [policies, setPolicies] = useState<Policy[]>(mockPolicies);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [advancedFilters, setAdvancedFilters] = useState<FilterState>({
    searchQuery: '',
    selectedTags: [],
    tagMatchMode: 'any',
    statusFilter: 'all',
    typeFilter: 'all',
    frameworkFilter: 'all',
    enableFuzzySearch: true
  });
  const { toast } = useToast();

  // Get all available tags from policies
  const availableTags = Array.from(
    new Set(policies.flatMap(policy => policy.tags))
  ).sort();

  // Combined filtering function
  const getFilteredPolicies = () => {
    let filtered = [...policies];

    // Apply sidebar category filter
    if (filterCategory !== "all") {
      if (filterCategory.startsWith('physical') || filterCategory.startsWith('technical') || filterCategory.startsWith('organizational')) {
        const [category, domain] = filterCategory.split('-');
        if (domain) {
          filtered = filtered.filter(
            (policy) =>
              policy.framework_category === category &&
              (policy.security_domain.toLowerCase().replace(/\s+/g, '-') === domain || 
               policy.type.toLowerCase().replace(/\s+/g, '-') === domain)
          );
        } else {
          filtered = filtered.filter((policy) => policy.framework_category === filterCategory);
        }
      }
    }

    // Apply advanced filters
    const { 
      searchQuery, 
      selectedTags, 
      tagMatchMode, 
      statusFilter, 
      typeFilter, 
      frameworkFilter,
      enableFuzzySearch 
    } = advancedFilters;

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter((policy) => {
        const searchInFields = `${policy.title} ${policy.description} ${policy.content} ${policy.tags.join(' ')}`.toLowerCase();
        
        if (enableFuzzySearch) {
          return fuzzySearch(searchQuery.toLowerCase(), searchInFields);
        } else {
          return searchInFields.includes(searchQuery.toLowerCase());
        }
      });
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((policy) => {
        if (tagMatchMode === 'any') {
          return selectedTags.some(tag => policy.tags.includes(tag));
        } else {
          return selectedTags.every(tag => policy.tags.includes(tag));
        }
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((policy) => policy.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((policy) => policy.type === typeFilter);
    }

    // Framework filter
    if (frameworkFilter !== 'all') {
      filtered = filtered.filter((policy) => policy.framework_category === frameworkFilter);
    }

    return filtered;
  };

  const filteredPolicies = getFilteredPolicies();

  // Handler to add a new policy
  const handlePolicyCreated = (newPolicy: Policy) => {
    setPolicies([...policies, newPolicy]);
    toast({
      title: "Policy Created",
      description: `${newPolicy.title} has been created successfully.`,
    });
  };

  const handlePolicyClick = (policy: Policy) => {
    setSelectedPolicy(policy);
  };

  const handleBackToList = () => {
    setSelectedPolicy(null);
  };

  const handleEditPolicy = () => {
    toast({
      title: "Edit Policy",
      description: "Edit functionality will be implemented soon.",
    });
  };

  const handleVersionDownload = (versionId: string) => {
    toast({
      title: "Download Started",
      description: `Downloading version ${versionId}...`,
    });
  };

  const handleCompareVersions = () => {
    toast({
      title: "Version Comparison",
      description: "Version comparison will be implemented soon.",
    });
  };

  useEffect(() => {
    // You can add any side effects here
  }, [filterCategory, advancedFilters]);

  // If a policy is selected, show the detail view
  if (selectedPolicy) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar 
          onCategoryChange={setFilterCategory} 
          onNewPolicyClick={() => setIsUploadDialogOpen(true)}
          activeCategory={filterCategory}
          policies={policies}
        />
        
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <PolicyDetail
              policy={selectedPolicy}
              onBack={handleBackToList}
              onEdit={handleEditPolicy}
              onVersionDownload={handleVersionDownload}
              onCompareVersions={handleCompareVersions}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        onCategoryChange={setFilterCategory} 
        onNewPolicyClick={() => setIsUploadDialogOpen(true)}
        activeCategory={filterCategory}
        policies={policies}
      />
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Security Policy Repository</h1>
              <p className="text-muted-foreground mt-1">
                {filterCategory === "all" ? "All Policies" : filterCategory} 
                {filteredPolicies.length !== policies.length && 
                  ` (${filteredPolicies.length} of ${policies.length})`
                }
              </p>
            </div>
            <UploadPolicyButton onPolicyCreated={handlePolicyCreated} />
          </div>

          <AdvancedFilters
            onFiltersChange={setAdvancedFilters}
            availableTags={availableTags}
          />

          <PolicyList
            policies={filteredPolicies}
            onPolicyClick={handlePolicyClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
