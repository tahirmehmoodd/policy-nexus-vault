
import { useState } from "react";
import { mockPolicies } from "@/data/mockPolicies";
import { Policy } from "@/types/policy";
import { Sidebar } from "@/components/Sidebar";
import { SearchBar } from "@/components/SearchBar";
import { PolicyList } from "@/components/PolicyList";
import { PolicyDetail } from "@/components/PolicyDetail";
import { UploadPolicyButton } from "@/components/UploadPolicyButton";

const Index = () => {
  const [policies, setPolicies] = useState<Policy[]>(mockPolicies);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

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

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-between px-6 border-b">
          <h1 className="text-2xl font-semibold">Security Policy Repository</h1>
          <UploadPolicyButton />
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
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
