import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Shield, Building, Users, Database, Network, Key, AlertTriangle, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface SidebarProps {
  onCategoryChange: (category: string) => void;
  onNewPolicyClick: () => void;
  activeCategory: string;
  policies: any[];
  allPolicies: any[]; // Add this prop to get total counts
}

export function Sidebar({ onCategoryChange, onNewPolicyClick, activeCategory, policies, allPolicies }: SidebarProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Use allPolicies for counts to show total numbers, not filtered
  const totalPolicies = allPolicies.length;
  const activePolicies = allPolicies.filter(p => p.status === 'active').length;
  const draftPolicies = allPolicies.filter(p => p.status === 'draft').length;

  const categories = [
    {
      id: 'all',
      name: 'All Policies',
      icon: FileText,
      count: totalPolicies,
      description: 'View all security policies'
    },
    {
      id: 'technical',
      name: 'Technical Controls',
      icon: Shield,
      count: allPolicies.filter(p => {
        const originalPolicy = allPolicies.find(orig => orig.policy_id === p.policy_id || orig.id === p.policy_id);
        return originalPolicy && originalPolicy.category === 'Technical Control';
      }).length,
      description: 'Technology-based security controls'
    },
    {
      id: 'physical',
      name: 'Physical Controls', 
      icon: Building,
      count: allPolicies.filter(p => {
        const originalPolicy = allPolicies.find(orig => orig.policy_id === p.policy_id || orig.id === p.policy_id);
        return originalPolicy && originalPolicy.category === 'Physical Control';
      }).length,
      description: 'Physical security measures'
    },
    {
      id: 'organizational',
      name: 'Organizational Controls',
      icon: Users,
      count: allPolicies.filter(p => {
        const originalPolicy = allPolicies.find(orig => orig.policy_id === p.policy_id || orig.id === p.policy_id);
        return originalPolicy && (originalPolicy.category === 'Organizational Control' || originalPolicy.category === 'Administrative Control');
      }).length,
      description: 'Administrative and procedural controls'
    }
  ];

  const policyTypes = [
    {
      id: 'Access Control',
      name: 'Access Control',
      icon: Key,
      count: allPolicies.filter(p => {
        const originalPolicy = allPolicies.find(orig => orig.policy_id === p.policy_id || orig.id === p.policy_id);
        return originalPolicy && originalPolicy.type === 'Access Control';
      }).length
    },
    {
      id: 'Data Classification',
      name: 'Data Classification',
      icon: Database,
      count: allPolicies.filter(p => {
        const originalPolicy = allPolicies.find(orig => orig.policy_id === p.policy_id || orig.id === p.policy_id);
        return originalPolicy && originalPolicy.type === 'Data Classification';
      }).length
    },
    {
      id: 'Network Security',
      name: 'Network Security',
      icon: Network,
      count: allPolicies.filter(p => {
        const originalPolicy = allPolicies.find(orig => orig.policy_id === p.policy_id || orig.id === p.policy_id);
        return originalPolicy && originalPolicy.type === 'Network Security';
      }).length
    },
    {
      id: 'Physical Security',
      name: 'Physical Security', 
      icon: Shield,
      count: allPolicies.filter(p => {
        const originalPolicy = allPolicies.find(orig => orig.policy_id === p.policy_id || orig.id === p.policy_id);
        return originalPolicy && originalPolicy.type === 'Physical Security';
      }).length
    },
    {
      id: 'Cryptography',
      name: 'Cryptography',
      icon: Shield,
      count: allPolicies.filter(p => {
        const originalPolicy = allPolicies.find(orig => orig.policy_id === p.policy_id || orig.id === p.policy_id);
        return originalPolicy && originalPolicy.type === 'Cryptography';
      }).length
    },
    {
      id: 'Incident Management',
      name: 'Incident Management',
      icon: AlertTriangle,
      count: allPolicies.filter(p => {
        const originalPolicy = allPolicies.find(orig => orig.policy_id === p.policy_id || orig.id === p.policy_id);
        return originalPolicy && originalPolicy.type === 'Incident Management';
      }).length
    }
  ];

  return (
    <div className="w-80 bg-background border-r h-full overflow-y-auto">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Policy Navigator</h2>
          <Button onClick={onNewPolicyClick} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-center">
            <div className="font-semibold text-lg">{totalPolicies}</div>
            <div className="text-muted-foreground">Total</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg text-green-600">{activePolicies}</div>
            <div className="text-muted-foreground">Active</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg text-yellow-600">{draftPolicies}</div>
            <div className="text-muted-foreground">Drafts</div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
            Security Framework Categories
          </h3>
          <div className="space-y-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              const isHovered = hoveredCategory === category.id;
              
              return (
                <motion.div key={category.id} whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start h-auto p-3 ${
                      isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                    onClick={() => onCategoryChange(category.id)}
                    onMouseEnter={() => setHoveredCategory(category.id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        <div className="text-left">
                          <div className="font-medium">{category.name}</div>
                          {(isHovered || isActive) && (
                            <div className="text-xs opacity-75 mt-1">
                              {category.description}
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge variant={isActive ? "secondary" : "outline"} className="ml-auto">
                        {category.count}
                      </Badge>
                    </div>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
            Policy Types
          </h3>
          <div className="space-y-2">
            {policyTypes.map((type) => {
              const Icon = type.icon;
              const isActive = activeCategory === type.id;
              
              return (
                <motion.div key={type.id} whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start h-auto p-3 ${
                      isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                    onClick={() => onCategoryChange(type.id)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        <span className="font-medium">{type.name}</span>
                      </div>
                      <Badge variant={isActive ? "secondary" : "outline"}>
                        {type.count}
                      </Badge>
                    </div>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
