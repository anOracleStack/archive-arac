"use client";

import { buildClaimChecklist } from "@/lib/claimChecklist";
import type { IdentityCandidate } from "@/types/identity";

export function ClaimChecklist({ candidate }: { candidate: IdentityCandidate }) {
  const steps = buildClaimChecklist(candidate);

  return (
    <div className="mt-4 p-4 rounded-xl bg-[#F5F3EE] border border-[#E8E5DF]">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B543C] mb-3">
        Claim playbook
      </p>
      <ol className="space-y-2 text-sm text-[#5A5653] list-decimal list-inside">
        {steps.map((step) => (
          <li key={step} className="leading-relaxed">
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
