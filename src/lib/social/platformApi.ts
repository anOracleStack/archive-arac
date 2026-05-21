export async function fetchXProfile(accessToken: string): Promise<{
  handle?: string;
  displayName?: string;
  profileUrl?: string;
}> {
  const res = await fetch("https://api.twitter.com/2/users/me?user.fields=username,name", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return {};
  const data = (await res.json()) as { data?: { username?: string; name?: string } };
  const u = data.data;
  return {
    handle: u?.username,
    displayName: u?.name,
    profileUrl: u?.username ? `https://x.com/${u.username}` : undefined,
  };
}

export async function fetchTikTokProfile(accessToken: string): Promise<{
  handle?: string;
  displayName?: string;
  profileUrl?: string;
}> {
  const res = await fetch(
    "https://open.tiktokapis.com/v2/user/info/?fields=display_name,username",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) return {};
  const data = (await res.json()) as {
    data?: { user?: { display_name?: string; username?: string } };
  };
  const u = data.data?.user;
  return {
    handle: u?.username,
    displayName: u?.display_name,
    profileUrl: u?.username ? `https://www.tiktok.com/@${u.username}` : undefined,
  };
}
