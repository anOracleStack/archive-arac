"use client";

import { useEffect } from "react";
import { syncVaultBidirectional, applyServerSnapshotToLocal } from "@/lib/vaultSync";

/** Background sync on app load — keeps local vault aligned with server Blob. */
export function VaultAutoSync() {
  useEffect(() => {
    void (async () => {
      const result = await syncVaultBidirectional();
      if (result.snapshot) applyServerSnapshotToLocal(result.snapshot);
    })();
  }, []);

  return null;
}
