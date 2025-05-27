
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

    console.log('Filtering with category:', filterCategory);
    console.log('Total policies:', policies.length);

    // Apply sidebar category filter
    if (filterCategory !== "all") {
      if (filterCategory.includes('-')) {
        // Handle domain-specific filtering (e.g., "physical-secure-areas")
        const [category, ...domainParts] = filterCategory.split('-');
        const domain = domainParts.join('-');
        
        console.log('Category:', category, 'Domain:', domain);
        
        filtered = filtered.filter((policy) => {
          const matchesCategory = policy.framework_category === category;
          
          // Check if domain matches security_domain or type (normalize spaces and hyphens)
          const normalizedSecurityDomain = policy.security_domain.toLowerCase().replace(/\s+/g, '-');
          const normalizedType = policy.type.toLowerCase().replace(/\s+/g, '-');
          const normalizedDomain = domain.toLowerCase();
          
          const matchesDomain = normalizedSecurityDomain === normalizedDomain || 
                               normalizedType === normalizedDomain ||
                               normalizedSecurityDomain.includes(normalizedDomain) ||
                               normalizedType.includes(normalizedDomain);
          
          console.log('Policy:', policy.title, 'Category match:', matchesCategory, 'Domain match:', matchesDomain);
          console.log('Security domain:', normalizedSecurityDomain, 'Type:', normalizedType, 'Looking for:', normalizedDomain);
          
          return matchesCategory && matchesDomain;
        });
      } else {
        // Handle framework category filtering (e.g., "physical", "technical", "organizational")
        filtered = filtered.filter((policy) => policy.framework_category === filterCategory);
      }
    }

    console.log('After category filtering:', filtered.length);

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

    console.log('Final filtered count:', filtered.length);
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
    console.log('Filter category changed to:', filterCategory);
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
                {filterCategory === "all" ? "All Policies" : filterCategory.replace('-', ' - ')} 
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
