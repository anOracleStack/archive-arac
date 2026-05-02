# Ship Archive Arac

## Vercel (recommended)

1. Push this repo to GitHub/GitLab/Bitbucket.
2. In [Vercel](https://vercel.com), **Add New Project** → import the repo. Root directory is the repo root (no monorepo subpath unless you moved the app).
3. Framework preset: **Next.js**. Build: `npm run build`, Output: default (`.next`).
4. **Environment variables:** none required for the static marketing surface. The Silk Analyzer only needs outbound `fetch` from the serverless route (allowed by default on Vercel).
5. Deploy. Set your **production domain** under Project → Settings → Domains.
6. From your main AI company site, add a nav tab that links to `https://<your-domain>/` or deep-link to `https://<your-domain>/#analyzer` for power users.

## Parent-site tab copy (suggestion)

- **Tab label:** `Archive Arac` (or `Vanguard Weave` if you prefer the series name).
- **Destination:** production URL above; optional hash `#index`, `#analyzer`, or `#spinneret` for section jumps.

## After launch

- Replace Open Graph `metadata` in `src/app/layout.tsx` with absolute `metadataBase` + `openGraph.url` when the final domain is fixed ([Next.js metadata docs](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)).
- Add `favicon` / `apple-touch-icon` in `app/` if you want stronger brand separation from the parent site.
