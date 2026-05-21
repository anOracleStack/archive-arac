import type { AvailabilityStatus, SocialHandleCheck } from "@/types/identity";
import {
  socialPlatforms,
  type SocialPlatformRule,
} from "@/data/socialPlatformRules";

function sanitizeForPlatform(handle: string, rule: SocialPlatformRule): string {
  let h = handle.toLowerCase();
  if (!rule.allowsPeriods) h = h.replace(/\./g, "");
  if (!rule.allowsDashes) h = h.replace(/-/g, "");
  if (!rule.allowsUnderscores) h = h.replace(/_/g, "");
  return h.replace(/[^a-z0-9._]/g, "").slice(0, rule.handleMax);
}

function validateHandle(handle: string, rule: SocialPlatformRule): string | null {
  const h = sanitizeForPlatform(handle, rule);
  if (h.length < rule.handleMin) return `Min ${rule.handleMin} characters`;
  if (rule.id === "github" && (h.startsWith("-") || h.endsWith("-"))) {
    return "Cannot start or end with hyphen";
  }
  if (rule.id === "instagram" && h.includes("..")) return "No consecutive periods";
  return null;
}

async function checkGitHub(handle: string): Promise<AvailabilityStatus> {
  try {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(handle)}`, {
      headers: { Accept: "application/vnd.github+json" },
      signal: AbortSignal.timeout(6000),
    });
    if (res.status === 404) return "available";
    if (res.ok) return "taken";
    return "unknown";
  } catch {
    return "unknown";
  }
}

async function checkPlatform(
  platform: SocialPlatformRule,
  rawHandle: string
): Promise<SocialHandleCheck> {
  const validationError = validateHandle(rawHandle, platform);
  const handle = sanitizeForPlatform(rawHandle, platform);
  const claimUrl = platform.claimUrlTemplate?.replace("{handle}", handle);

  if (validationError) {
    return {
      platformId: platform.id,
      platformName: platform.name,
      handle,
      status: "invalid",
      note: validationError,
      claimUrl,
    };
  }

  if (platform.id === "github") {
    const status = await checkGitHub(handle);
    return {
      platformId: platform.id,
      platformName: platform.name,
      handle,
      status,
      note: status === "unknown" ? "Could not verify — check manually" : undefined,
      claimUrl,
    };
  }

  return {
    platformId: platform.id,
    platformName: platform.name,
    handle,
    status: "unknown",
    note: "Verify in app — automated check coming soon",
    claimUrl,
  };
}

export async function checkSocialHandles(
  slug: string,
  platformIds: string[]
): Promise<SocialHandleCheck[]> {
  const platforms = socialPlatforms.filter((p) => platformIds.includes(p.id));
  return Promise.all(platforms.map((p) => checkPlatform(p, slug)));
}
