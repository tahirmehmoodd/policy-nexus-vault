
import { useState } from "react";
import { PolicyCard } from "@/components/PolicyCard";
import { Policy } from "@/types/policy";

interface PolicyListProps {
  policies: Policy[];
  onPolicyClick: (policy: Policy) => void;
}

export function PolicyList({ policies, onPolicyClick }: PolicyListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {policies.map((policy) => (
        <PolicyCard
          key={policy.policy_id}
          policy={policy}
          onClick={() => onPolicyClick(policy)}
        />
      ))}
    </div>
  );
}
