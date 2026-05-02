/** Copy for “break it down” panels — three depths, three lenses each. */

export type DepthBlock = {
  what: string;
  why: string;
  action: string;
};

export type GatewayArticle = {
  headline: string;
  /** Optional “say it like…” hint */
  say?: string;
  beginner: DepthBlock;
  moderate: DepthBlock;
  advanced: DepthBlock;
};

export const gloss = {
  synapseSilk: {
    headline: "Synapse & Silk",
    say: "SIN-aps … silk",
    beginner: {
      what: "Our shorthand for two halves of modern interfaces: “Synapse” is the logic and data paths (the brain), “Silk” is what you feel on screen—motion, layout, and touch.",
      why: "Teams often optimize only one side. Naming both reminds us that fast code without tactile polish, or pretty UI without solid structure, only tells half the story.",
      action: "When you browse this archive, look for which strand leans synapse-heavy vs silk-heavy—then decide what your own product needs next.",
    },
    moderate: {
      what: "Synapse ≈ runtime, APIs, state, and build tooling. Silk ≈ rendering layer, animation, spatial layout, and micro-interactions.",
      why: "Investors and leads recognize “full-stack”; we split the vocabulary so designers and engineers can point at the same roadmap without talking past each other.",
      action: "Use the Index filters (Spatial / Gen-AI / Physics) as a proxy for silk type, and open any card’s demo modal for concrete implementation cues.",
    },
    advanced: {
      what: "A rhetorical frame: synaptic paths (latency budgets, hydration, streaming, GPU/CPU tradeoffs) vs silk surfaces (WebGL layers, spring physics, gesture choreography, SSR-friendly motion).",
      why: "Differentiation in the market is rarely a single library—it’s coherence between intent capture and presentation latency.",
      action: "Run the Silk Analyzer on a reference URL, then cross-check Tech vs Interactions tabs against how you’d decompose your own stack.",
    },
  } satisfies GatewayArticle,

  weaveGrowth: {
    headline: "The Growth of the Weave",
    say: "concept chart — not live market data",
    beginner: {
      what: "A simple line chart that illustrates how three trends are climbing over time. The numbers are illustrative, not a financial or industry report.",
      why: "It gives a shared picture before we dive into jargon like “WebGL” or “intent-driven UI.”",
      action: "Hover the chart legend in your mind: orange = AI steering interfaces, green = 3D/spatial layers, dashed = small physics-based details that make apps feel alive.",
    },
    moderate: {
      what: "Synthetic trend curves for AI-guided UX, WebGL-backed spatial UI, and physics micro-UX (springs, inertia, scroll-linked motion).",
      why: "We’re arguing a thesis: flat CRUD UIs are losing mindshare to richer surfaces; the chart makes that legible in one glance.",
      action: "Compare these curves to your product roadmap—where would you plot your own release cadence?",
    },
    advanced: {
      what: "A narrative visualization—not sourced telemetry. Treat it as a mood board for capability maturity, not a dataset to cite externally.",
      why: "Positioning requires a story arc; this section anchors the archive’s editorial stance without pretending to be a research firm.",
      action: "If you need defensible stats, replace this block with your own Chart.js feed from product analytics or third-party benchmarks.",
    },
  } satisfies GatewayArticle,

  indexAraneae: {
    headline: "Index Araneae",
    say: "ah-rah-NEE-eye … Latin for spiders",
    beginner: {
      what: "A curated gallery of interface ideas—each card is a “strand” you can open to see a small interactive demo.",
      why: "Instead of endless blog posts, we show patterns you can feel. Latin naming keeps the brand distinct from generic “design systems” sites.",
      action: "Pick a card that looks closest to your use case, open it, and steal the interaction principle (not necessarily the code verbatim).",
    },
    moderate: {
      what: "A pattern index grouped by silk category: spatial (WebGL/three.js-ish), Gen-AI (LLM-adjacent flows), physics (springs, magnetism, scroll choreography).",
      why: "Taxonomy matters when you’re building a tab from your main AI company site—you want visitors to self-route in under ten seconds.",
      action: "Wire your parent-site tab to deep-link here with `#index` so power users land on the grid immediately.",
    },
    advanced: {
      what: "Static seed data in `src/data/strands.ts`—swap for CMS or API when you scale. Canvas overlay draws proximity edges on hover for spatial metaphor only.",
      why: "The performance cost is bounded (single rAF loop); keep card count modest or virtualize if you grow past ~30 strands.",
      action: "Add OG images per strand route if you later split cards into individual pages for SEO.",
    },
  } satisfies GatewayArticle,

  silkStrand: {
    headline: "Silk type (filter)",
    say: "just “silk” — our word for interface family",
    beginner: {
      what: "The pill buttons (All / Spatial / Gen-AI / Physics) sort the gallery by what kind of “feel” each example leans into.",
      why: "If you’re new to front-end, picking a filter narrows the noise so you’re not comparing a 3D globe to a chat widget.",
      action: "Try “Physics” if you care about buttons that nudge, panels that ease, or scroll-linked storytelling.",
    },
    moderate: {
      what: "Heuristic tags on each `StrandItem`: `webgl` | `ai` | `ux` mapped to Spatial / Gen-AI / Physics labels.",
      why: "It’s not a rigorous ontology—it's a browsing aid. Real projects often span two silks.",
      action: "When tagging new strands, pick the dominant user-perceived affordance, not the deepest dependency graph.",
    },
    advanced: {
      what: "Filters drive a simple `Array.prototype.filter` on category; hover canvas draws Delaunay-ish arcs in screen space for flair.",
      why: "Keep taxonomies shallow until you have enough items to justify faceted search or search-in-place.",
      action: "If you add RSC + server actions later, prefetch filtered subsets to avoid shipping the full strand array to the client.",
    },
  } satisfies GatewayArticle,

  silkAnalyzer: {
    headline: "Silk Analyzer",
    say: "AN-uh-ly-zer",
    beginner: {
      what: "Paste a website address. We fetch its public HTML (when allowed), scan it like a quick health check, and summarize design, tech, accessibility hints, and sample code ideas.",
      why: "So you can learn from real sites without installing browser extensions or reading thousand-line repos first.",
      action: "Only analyze sites you’re allowed to; some hosts block bots—that’s normal, not a bug in your input.",
    },
    moderate: {
      what: "Server-side Cheerio parse + heuristics in `src/lib/analyzer.ts`, exposed via `POST /api/analyze`. Not a substitute for Lighthouse budgets or legal audits.",
      why: "Good for pitch prep, competitive snapshots, and onboarding junior devs to “what’s under the hood.”",
      action: "Normalize URLs on blur (https + www for apex domains); extend heuristics as you discover false positives in your niche.",
    },
    advanced: {
      what: "Static analysis of first HTML response—no JS execution, no auth, no multi-page crawl. Cheerio pseudo-selectors must stay DOM-safe (no :focus-style pseudos).",
      why: "Scope is intentionally narrow for latency and ToS risk; depth beats pretending to be a full crawler.",
      action: "Add caching (KV/Redis) keyed by normalized URL if traffic spikes; rate-limit per IP at the edge.",
    },
  } satisfies GatewayArticle,

  strandModal: {
    headline: "Strand demo",
    beginner: {
      what: "Each card in the Index opens this window: a short interactive sample that illustrates one idea (springs, 3D, scroll-linked motion, etc.). It’s a teaching toy, not a production component library.",
      why: "Seeing motion beats reading a bullet list—especially for stakeholders who don’t ship CSS daily.",
      action: "Use “Visit Source Origin” when you want the real reference implementation, not just our distilled demo.",
    },
    moderate: {
      what: "Demos are local React sketches mapped by `demoType` on each strand; they intentionally avoid network calls and heavy assets.",
      why: "Keeps modal open latency predictable on conference Wi-Fi.",
      action: "If you fork strands into CMS entries, attach Loom or CodeSandbox links from the same modal shell.",
    },
    advanced: {
      what: "Consider lazy-loading demo bundles per `demoType` with `next/dynamic` if the modal catalog grows past a handful of heavy canvases.",
      why: "First Interaction to Next Paint suffers if every demo ships in the main chunk.",
      action: "Split demos into route-level playgrounds when SEO or shareable URLs matter.",
    },
  } satisfies GatewayArticle,

  readingYourAnalysis: {
    headline: "Reading your analysis",
    beginner: {
      what: "After a scan, use the tabs like chapters: Overview is the story, Design is look-and-feel, Tech is what libraries likely power the page, Interactions is motion and inputs, UX & A11y is accessibility hints, Code Snippets is starter ideas—not a full clone.",
      why: "Tabs keep experts fast while beginners aren’t forced to read everything at once.",
      action: "Start at Overview, then jump only to the tab that matches your current question (e.g. “Is it accessible?” → UX & A11y).",
    },
    moderate: {
      what: "Heuristic buckets derived from static HTML—no execution environment, so SPAs that hydrate late may under-report client-only frameworks.",
      why: "Honest scope avoids over-selling the analyzer as production monitoring.",
      action: "Cross-check Tech tab with DevTools Network + Sources when stakes are high (M&A, compliance).",
    },
    advanced: {
      what: "Extend `analyzer.ts` to emit confidence per tab; consider diffing two captures for regression storytelling in CI.",
      why: "As you productize, customers will ask for provenance and repeatability.",
      action: "Version analyzer rules SemVer-style and log rule-set ID alongside each response.",
    },
  } satisfies GatewayArticle,

  analyzerScore: {
    headline: "Silk score",
    say: "heuristic 0–100",
    beginner: {
      what: "A single number summarizing how many positive signals we found versus issues—like a report card headline, not a legal grade.",
      why: "Humans scan numbers faster than bullet walls; the detail lives in the tabs underneath.",
      action: "If the score feels “wrong,” read the Needs Attention list—scores swing hard when key tags or frameworks are missing from the HTML we could see.",
    },
    moderate: {
      what: "Weighted tally across innovations, unique features, and detected problems from the analyzer heuristics.",
      why: "It’s intentionally reductive to force prioritization; don’t publish this externally as an objective quality metric without tuning weights for your domain.",
      action: "Fork `analyzer.ts` scoring constants to match what your org values (e.g., a11y vs novelty).",
    },
    advanced: {
      what: "Non-deterministic across time if target sites A/B their markup; cache busting depends on their CDN headers.",
      why: "Document provenance when screenshotting results for clients—include URL + timestamp.",
      action: "Pipe the same HTML into Lighthouse or axe-core in CI for authoritative a11y numbers alongside this exploratory score.",
    },
  } satisfies GatewayArticle,

  elasticSilk: {
    headline: "Elastic Silk",
    beginner: {
      what: "Interfaces that subtly move when you get close—panels feel “tensioned” like fabric, then relax when you look away.",
      why: "It rewards exploration without demanding clicks; good for marketing and creative tools.",
      action: "Try the Magnetic or Fluid demos in the strand modals to see elastic metaphors in miniature.",
    },
    moderate: {
      what: "Proximity-based transforms, often CSS transforms + pointer tracking or spring solvers; watch for reduced-motion users.",
      why: "Elasticity increases perceived quality but can hurt WCAG if motion can’t be disabled.",
      action: "Gate intense motion behind `prefers-reduced-motion: reduce` and provide a static fallback layout.",
    },
    advanced: {
      what: "Typically combines pointermove throttling, LERP/spring constants, and compositor-friendly properties (`transform`, `opacity`).",
      why: "Layout thrashing kills the illusion—measure with Performance panel before shipping elastic chrome broadly.",
      action: "Consider CSS `@starting-style` / view transitions where supported to reduce bespoke JS.",
    },
  } satisfies GatewayArticle,

  orbitalWeb: {
    headline: "Orbital Web",
    beginner: {
      what: "Navigation imagined as rings around a center—like a spider web viewed from above—instead of a flat list of links.",
      why: "It helps users build a mental map of depth: closer to the hub = broader, farther rings = more specific.",
      action: "Sketch your IA as concentric circles before you wireframe; see if primary tasks cluster naturally.",
    },
    moderate: {
      what: "Information architecture pattern: hub-and-spoke with radial emphasis; often paired with zoomable UIs or circular menus.",
      why: "Breaks left-nav monotony on dense dashboards when paired with strong focal content.",
      action: "Validate with tree testing—orbital metaphors fail if labels don’t align with user vocabulary.",
    },
    advanced: {
      what: "May imply polar coordinates, canvas/WebGL hit tests, or focus rings that don’t follow linear tab order—plan keyboard paths explicitly.",
      why: "Radial layouts are notorious for accessibility debt if focus order is an afterthought.",
      action: "Mirror the visual ring order in `tabindex` or roving tabindex groups; provide list view escape hatch.",
    },
  } satisfies GatewayArticle,

  intentThread: {
    headline: "Intent Thread",
    beginner: {
      what: "You say what you want in plain language; the interface rearranges itself to match that goal instead of making you hunt through menus.",
      why: "That’s how many AI assistants feel—and users now expect the same immediacy from traditional apps.",
      action: "List the top five user intents for your product; check whether your nav labels match those words.",
    },
    moderate: {
      what: "NLU / LLM routing + UI state synthesis: prompt → plan → surface components or data fetches.",
      why: "Latency and trust are the bottlenecks—surface provenance and allow edits before destructive actions.",
      action: "Log intent classifications to refine prompts; add human confirmation for irreversible ops.",
    },
    advanced: {
      what: "Often implemented via tool-calling schemas, retrieval over design tokens/components, and streaming partial layouts.",
      why: "Hallucinated UI is worse than static UI—constrain generation to validated component libraries.",
      action: "Version your tool schemas; snapshot model IDs in analytics when comparing rollout cohorts.",
    },
  } satisfies GatewayArticle,

  spinneret: {
    headline: "Spinneret",
    say: "SPIN-uh-ret — where silk comes out on a spider",
    beginner: {
      what: "The part of a spider that produces silk. Here, it’s a metaphor for the three repeatable “weaves” we think modern product teams should master.",
      why: "Naming a methodology section something memorable beats another “Our process” heading—especially when your parent site sends mixed audiences.",
      action: "Pick one weave to prototype this quarter; add a second only once the first is stable in production.",
    },
    moderate: {
      what: "Editorial framework: Elastic Silk (proximity UI), Orbital Web (hub/radial IA), Intent Thread (goal-first surfaces).",
      why: "Each maps to different staffing risks—motion perf, IA testing, or LLM guardrails—so you can forecast dependencies early.",
      action: "Score your current app 1–5 on each weave; the lowest score is your hiring or agency brief.",
    },
    advanced: {
      what: "Not a formal design system—an opinionated lens for critiquing demos in this archive and prioritizing R&D bets.",
      why: "Keeps the micro-site’s voice distinct from generic “design thinking” decks your main AI brand may already publish.",
      action: "If you externalize this, pair each weave with reference implementations and failure case studies.",
    },
  } satisfies GatewayArticle,

  archiveArac: {
    headline: "Archive Arac",
    say: "AIR-ak … “Arac” like arachnid",
    beginner: {
      what: "The name of this micro-site: a small, themed archive of future-facing interface ideas, separate from your main company homepage.",
      why: "Giving it its own identity makes the tab hand-off clear—visitors know they’ve entered a focused exhibit, not your entire corporate story.",
      action: "From your main AI site, label the tab with this product name and link straight to `/` or `#analyzer` depending on audience.",
    },
    moderate: {
      what: "Brand vessel for “Vanguard Weave” content—spider/silk metaphors, warm neutrals, orange accent, canvas ambience.",
      why: "Distinct visual language reduces confusion with generic AI landing pages that all look the same.",
      action: "Keep parent brand in footer or nav return link if users need wayfinding back to the mothership.",
    },
    advanced: {
      what: "Static Next.js app—swap `metadata` in `layout.tsx` for canonical URLs, OG images, and `robots.txt` when you attach a custom domain.",
      why: "SEO for micro-sites works best when the parent domain cross-links with descriptive anchor text once, not fifty keyword-stuffed backlinks.",
      action: "Deploy to Vercel/Netlify with preview branches; add `sitemap.xml` if you later add multi-route content.",
    },
  } satisfies GatewayArticle,
} as const;

export type GlossKey = keyof typeof gloss;
