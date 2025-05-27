import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Policy } from "@/types/policy";
import { UploadPolicyButton } from "@/components/UploadPolicyButton";
import { mockPolicies } from "@/data/mockPolicies";
import { useToast } from "@/components/ui/use-toast";
import { SettingsIcon } from "lucide-react";

const Index = () => {
  const [policies, setPolicies] = useState<Policy[]>(mockPolicies);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const { toast } = useToast();

  // Filter policies based on category
  const filteredPolicies = () => {
    if (filterCategory === "all") {
      return policies;
    }

    if (filterCategory.startsWith('physical') || filterCategory.startsWith('technical') || filterCategory.startsWith('organizational')) {
      const [category, domain] = filterCategory.split('-');
      if (domain) {
        return policies.filter(
          (policy) =>
            policy.framework_category === category &&
            (policy.security_domain.toLowerCase().replace(/\s+/g, '-') === domain || policy.type.toLowerCase().replace(/\s+/g, '-') === domain)
        );
      }
      return policies.filter((policy) => policy.framework_category === filterCategory);
    }

    return policies;
  };

  // Handler to add a new policy
  const handlePolicyCreated = (newPolicy: Policy) => {
    setPolicies([...policies, newPolicy]);
    toast({
      title: "Policy Created",
      description: `${newPolicy.title} has been created successfully.`,
    });
  };

  useEffect(() => {
    // You can add any side effects here, like fetching policies from an API
  }, [filterCategory]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        onCategoryChange={setFilterCategory} 
        onNewPolicyClick={() => setIsUploadDialogOpen(true)}
        activeCategory={filterCategory}
        policies={policies}
      />
      
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-semibold mb-4">
          {filterCategory === "all" ? "All Policies" : filterCategory}
        </h1>
        {filteredPolicies().map((policy) => (
          <div key={policy.policy_id} className="border rounded-md p-4 mb-4">
            <h2 className="text-lg font-semibold">{policy.title}</h2>
            <p className="text-sm text-muted-foreground">{policy.description}</p>
          </div>
        ))}
      </div>

      <UploadPolicyButton 
        isOpen={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onPolicyCreated={handlePolicyCreated}
      />
    </div>
  );
};

export default Index;
