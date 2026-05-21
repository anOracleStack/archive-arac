import type { SocialConnection } from "@/types/connections";
import { fetchTikTokProfile, fetchXProfile } from "@/lib/social/platformApi";

export async function runSocialMonitor(
  conn: SocialConnection,
  accessToken: string | undefined,
  lockSlug?: string
): Promise<string[]> {
  const notes: string[] = [`Monitor run ${new Date().toISOString()}`];

  if (!accessToken) {
    notes.push("OAuth token missing — reconnect in Studio → Social.");
    return notes;
  }

  if (conn.platformId === "x") {
    const profile = await fetchXProfile(accessToken);
    if (profile.handle) {
      notes.push(`X profile: @${profile.handle}${profile.displayName ? ` (${profile.displayName})` : ""}`);
      if (lockSlug) {
        const slugNorm = lockSlug.toLowerCase().replace(/[^a-z0-9]/g, "");
        const handleNorm = profile.handle.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (slugNorm && handleNorm && slugNorm !== handleNorm) {
          notes.push(
            `Handle differs from lock slug "${lockSlug}" — consider aligning before registration.`
          );
        } else if (slugNorm && handleNorm && slugNorm === handleNorm) {
          notes.push("Handle matches Identity Lock slug.");
        }
      }
    } else {
      notes.push("X API did not return profile — token may need refresh or scopes.");
    }
  }

  if (conn.platformId === "tiktok") {
    const profile = await fetchTikTokProfile(accessToken);
    if (profile.handle) {
      notes.push(
        `TikTok: @${profile.handle}${profile.displayName ? ` (${profile.displayName})` : ""}`
      );
      if (lockSlug) {
        const slugNorm = lockSlug.toLowerCase().replace(/[^a-z0-9]/g, "");
        const handleNorm = profile.handle.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (slugNorm && handleNorm && slugNorm !== handleNorm) {
          notes.push(`TikTok handle differs from lock slug "${lockSlug}".`);
        } else if (slugNorm && handleNorm && slugNorm === handleNorm) {
          notes.push("TikTok handle matches Identity Lock slug.");
        }
      }
    } else {
      notes.push("TikTok API did not return profile — check app scopes & token.");
    }
  }

  return notes;
}
