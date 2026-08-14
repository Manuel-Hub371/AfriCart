"use client";

import { ReusablePoliciesManager } from "@/components/vendor/reusable-policies-manager";

interface StorePoliciesFormProps {
  onSave?: (data: any) => Promise<void>;
  initialData?: any;
}

export function StorePoliciesForm({ onSave, initialData }: StorePoliciesFormProps) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
      <ReusablePoliciesManager />
    </div>
  );
}
