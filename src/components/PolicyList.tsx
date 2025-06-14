
import { useState } from "react";
import { PolicyCard } from "@/components/PolicyCard";
import { Policy } from "@/types/policy";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";

interface PolicyListProps {
  policies: Policy[];
  onPolicyClick: (policy: Policy) => void;
  onEditPolicy?: (policy: Policy) => void;
  onDownloadPolicy?: (policy: Policy) => void;
  onDeletePolicy?: (policy: Policy) => void;
}

export function PolicyList({ policies, onPolicyClick, onEditPolicy, onDownloadPolicy, onDeletePolicy }: PolicyListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-2">
        <div className="bg-muted inline-flex rounded-md p-0.5">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${viewMode === 'grid' ? 'bg-background shadow-sm' : ''} rounded-sm`}
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="ml-2">Grid</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${viewMode === 'list' ? 'bg-background shadow-sm' : ''} rounded-sm`}
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
            <span className="ml-2">List</span>
          </Button>
        </div>
      </div>
      
      <AnimatePresence>
        <motion.div 
          className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
            : "flex flex-col gap-3"
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {policies.map((policy) => (
            <motion.div
              key={policy.policy_id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={viewMode === 'list' ? "w-full" : ""}
            >
              <PolicyCard
                policy={policy}
                onClick={() => onPolicyClick(policy)}
                onEdit={onEditPolicy ? () => onEditPolicy(policy) : undefined}
                onDownload={onDownloadPolicy ? () => onDownloadPolicy(policy) : undefined}
                onDelete={onDeletePolicy ? () => onDeletePolicy(policy) : undefined}
                viewMode={viewMode}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      
      {policies.length === 0 && (
        <motion.div 
          className="flex flex-col items-center justify-center h-64 border border-dashed rounded-lg p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-xl font-medium text-muted-foreground mb-4">No policies found</p>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Try adjusting your search criteria or upload a new policy to get started with your security policy repository.
          </p>
        </motion.div>
      )}
    </div>
  );
}
