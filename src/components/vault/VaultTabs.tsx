"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

const TABS = [
  { id: "reports", label: "Silk reports" },
  { id: "identity", label: "Identity locks" },
  { id: "briefs", label: "Studio briefs" },
] as const;

export type VaultTabId = (typeof TABS)[number]["id"];

export function VaultTabs({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = (searchParams.get("tab") as VaultTabId) || "reports";

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-10 border-b border-[#E8E5DF] pb-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => router.push(`/vault?tab=${t.id}`)}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors ${
              tab === t.id
                ? "bg-[#2C2A29] text-white"
                : "text-[#5A5653] hover:bg-[#F5F3EE]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {children}
    </>
  );
}

export function useVaultTab(): VaultTabId {
  const searchParams = useSearchParams();
  return (searchParams.get("tab") as VaultTabId) || "reports";
}
