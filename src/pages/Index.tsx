
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { PolicyList } from "@/components/PolicyList";
import { PolicyDetail } from "@/components/PolicyDetail";
import { AdvancedFilters, FilterState } from "@/components/AdvancedFilters";
import { Policy } from "@/types/policy";
import { UploadPolicyButton } from "@/components/UploadPolicyButton";
import { useToast } from "@/components/ui/use-toast";
import { fuzzySearch } from "@/types/policy";
import { useAuth } from "@/hooks/useAuth";
import { usePolicies, DatabasePolicy } from "@/hooks/usePolicies";
import { AuthModal } from "@/components/AuthModal";
import { CreatePolicyModal } from "@/components/CreatePolicyModal";
import { EditPolicyModal } from "@/components/EditPolicyModal";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

// Convert DatabasePolicy to Policy type for compatibility
const convertDatabasePolicy = (dbPolicy: DatabasePolicy): Policy => {
  // Map database categories to framework categories
  const categoryMapping: Record<string, 'physical' | 'technical' | 'organizational'> = {
    'Physical Control': 'physical',
    'Technical Control': 'technical', 
    'Organizational Control': 'organizational',
    'Administrative Control': 'organizational'
  };

  return {
    policy_id: dbPolicy.id,
    title: dbPolicy.title,
    description: dbPolicy.description || '',
    type: dbPolicy.type,
    status: dbPolicy.status as 'active' | 'draft' | 'archived',
    created_at: dbPolicy.created_at,
    updated_at: dbPolicy.updated_at,
    author: dbPolicy.author || 'Unknown',
    content: dbPolicy.content,
    currentVersion: dbPolicy.version.toString(),
    tags: dbPolicy.tags || [],
    versions: [{
      version_id: '1',
      version_label: `v${dbPolicy.version}`,
      description: 'Current version',
      created_at: dbPolicy.updated_at,
      edited_by: dbPolicy.author || 'Unknown',
    }],
    framework_category: categoryMapping[dbPolicy.category] || 'technical',
    security_domain: dbPolicy.type,
  };
};

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { policies: dbPolicies, loading, getAllTags, searchPolicies } = usePolicies();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
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
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const { toast } = useToast();

  // Convert database policies to frontend format
  const policies = dbPolicies.map(convertDatabasePolicy);

  useEffect(() => {
    if (user) {
      loadTags();
    }
  }, [user]);

  const loadTags = async () => {
    const tags = await getAllTags();
    setAvailableTags(tags);
  };

  // Combined filtering function
  const getFilteredPolicies = () => {
    let filtered = [...policies];

    console.log('Filtering with category:', filterCategory);
    console.log('Total policies:', policies.length);
    console.log('Sample policy framework categories:', policies.slice(0, 3).map(p => ({ title: p.title, framework_category: p.framework_category, type: p.type })));

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
        console.log('Filtering by framework category:', filterCategory);
        filtered = filtered.filter((policy) => {
          const matches = policy.framework_category === filterCategory;
          console.log('Policy:', policy.title, 'Framework category:', policy.framework_category, 'Matches:', matches);
          return matches;
        });
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

  const handlePolicyCreated = () => {
    toast({
      title: "Policy Created",
      description: "Policy has been created successfully.",
    });
  };

  const handlePolicyClick = (policy: Policy) => {
    setSelectedPolicy(policy);
  };

  const handleBackToList = () => {
    setSelectedPolicy(null);
  };

  const handleEditPolicy = (policy: Policy) => {
    setEditingPolicy(policy);
    setEditModalOpen(true);
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

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Sign Out Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // If not authenticated, show sign in prompt
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4 p-8">
          <h1 className="text-3xl font-bold">Security Policy Repository</h1>
          <p className="text-muted-foreground">
            Please sign in to access the policy repository
          </p>
          <Button onClick={() => setAuthModalOpen(true)}>
            Sign In / Sign Up
          </Button>
        </div>
        <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      </div>
    );
  }

  // If a policy is selected, show the detail view
  if (selectedPolicy) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar 
          onCategoryChange={setFilterCategory} 
          onNewPolicyClick={() => setCreateModalOpen(true)}
          activeCategory={filterCategory}
          policies={policies}
        />
        
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <PolicyDetail
              policy={selectedPolicy}
              onBack={handleBackToList}
              onEdit={() => handleEditPolicy(selectedPolicy)}
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
        onNewPolicyClick={() => setCreateModalOpen(true)}
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
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                {user.email}
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
              <Button onClick={() => setCreateModalOpen(true)}>
                Create Policy
              </Button>
            </div>
          </div>

          <AdvancedFilters
            onFiltersChange={setAdvancedFilters}
            availableTags={availableTags}
          />

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg">Loading policies...</div>
            </div>
          ) : (
            <PolicyList
              policies={filteredPolicies}
              onPolicyClick={handlePolicyClick}
              onEditPolicy={handleEditPolicy}
            />
          )}
        </div>
      </div>
      
      <CreatePolicyModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
      <EditPolicyModal 
        open={editModalOpen} 
        onOpenChange={setEditModalOpen}
        policy={editingPolicy}
      />
    </div>
  );
};

export default Index;
