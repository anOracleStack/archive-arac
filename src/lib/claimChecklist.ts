import type { IdentityCandidate } from "@/types/identity";
import { getPlatformRule } from "@/data/socialPlatformRules";

export function buildClaimChecklist(candidate: IdentityCandidate): string[] {
  const steps: string[] = [
    `Reserve primary domain: pick an available TLD from your scan (slug: ${candidate.slug}).`,
    `Point DNS to Archive Arac hosting once domains are registered.`,
  ];

  for (const s of candidate.social) {
    const rule = getPlatformRule(s.platformId);
    if (s.status === "available" || s.status === "unknown") {
      steps.push(
        `${s.platformName}: verify @${s.handle} in-app${s.claimUrl ? ` (${s.claimUrl})` : ""}. ${rule?.notes ?? "Follow platform signup rules."}`
      );
    } else if (s.status === "taken") {
      steps.push(
        `${s.platformName}: @${s.handle} appears taken — try a variant or contact platform support.`
      );
    } else {
      steps.push(`${s.platformName}: adjust handle to meet ${rule?.notes ?? "platform rules"}.`);
    }
  }

  steps.push("Enable 2FA on every claimed account and store credentials in a password manager.");
  steps.push("Add brand link in bio across networks for consistency.");

  return steps;
}
