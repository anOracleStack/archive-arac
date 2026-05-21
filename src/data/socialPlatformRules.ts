export interface SocialPlatformRule {
  id: string;
  name: string;
  handleMin: number;
  handleMax: number;
  allowedChars: string;
  allowsPeriods: boolean;
  allowsDashes: boolean;
  allowsUnderscores: boolean;
  caseSensitive: boolean;
  notes: string;
  claimUrlTemplate?: string;
}

export const socialPlatforms: SocialPlatformRule[] = [
  {
    id: "x",
    name: "X (Twitter)",
    handleMin: 4,
    handleMax: 15,
    allowedChars: "letters, numbers, underscore",
    allowsPeriods: false,
    allowsDashes: false,
    allowsUnderscores: true,
    caseSensitive: false,
    notes: "15 characters max; no periods in handle.",
    claimUrlTemplate: "https://x.com/{handle}",
  },
  {
    id: "instagram",
    name: "Instagram",
    handleMin: 1,
    handleMax: 30,
    allowedChars: "letters, numbers, period, underscore",
    allowsPeriods: true,
    allowsDashes: false,
    allowsUnderscores: true,
    caseSensitive: false,
    notes: "Periods allowed; no consecutive periods.",
    claimUrlTemplate: "https://instagram.com/{handle}",
  },
  {
    id: "tiktok",
    name: "TikTok",
    handleMin: 2,
    handleMax: 24,
    allowedChars: "letters, numbers, period, underscore",
    allowsPeriods: true,
    allowsDashes: false,
    allowsUnderscores: true,
    caseSensitive: false,
    notes: "Username rules vary by region; verify in app.",
    claimUrlTemplate: "https://www.tiktok.com/@{handle}",
  },
  {
    id: "youtube",
    name: "YouTube",
    handleMin: 3,
    handleMax: 30,
    allowedChars: "letters, numbers, underscore, hyphen",
    allowsPeriods: false,
    allowsDashes: true,
    allowsUnderscores: true,
    caseSensitive: false,
    notes: "Custom URL handle; channel name may differ.",
    claimUrlTemplate: "https://youtube.com/@{handle}",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    handleMin: 3,
    handleMax: 100,
    allowedChars: "letters, numbers, hyphen",
    allowsPeriods: false,
    allowsDashes: true,
    allowsUnderscores: false,
    caseSensitive: false,
    notes: "Public custom URL for profiles & company pages.",
    claimUrlTemplate: "https://linkedin.com/company/{handle}",
  },
  {
    id: "github",
    name: "GitHub",
    handleMin: 1,
    handleMax: 39,
    allowedChars: "letters, numbers, hyphen",
    allowsPeriods: false,
    allowsDashes: true,
    allowsUnderscores: false,
    caseSensitive: false,
    notes: "Cannot start/end with hyphen; no consecutive hyphens.",
    claimUrlTemplate: "https://github.com/{handle}",
  },
];

export const defaultPlatformIds = socialPlatforms.map((p) => p.id);

export function getPlatformRule(platformId: string): SocialPlatformRule | undefined {
  return socialPlatforms.find((p) => p.id === platformId);
}
