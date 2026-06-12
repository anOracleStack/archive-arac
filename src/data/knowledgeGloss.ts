/** Copy for knowledge-gateway panels (what / why / next). */

export type DepthBlock = {
  what: string;
  why: string;
  action: string;
};

export type GatewayArticle = {
  headline: string;
  /** Optional "say it like…" hint */
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
      what: "Our shorthand for two halves of modern interfaces: \"Synapse\" is the logic & data paths (the brain). \"Silk\" is what you feel on screen — motion, layout, & touch.",
      why: "Teams often optimize only one side. Naming both reminds us that fast code without tactile polish, or pretty UI without solid structure, only tells half the story.",
      action: "When you browse this archive, look for which strand leans synapse-heavy vs silk-heavy — then decide what your own product needs next.",
    },
    moderate: {
      what: "Synapse = runtime, APIs, state, & build tooling. Silk = rendering layer, animation, spatial layout, & micro-interactions.",
      why: "Investors & leads recognize \"full-stack\"; we split the vocabulary so designers & engineers can point at the same roadmap without talking past each other.",
      action: "Use the Index filters (Spatial / Gen-AI / Physics) as a proxy for silk type, & open any card's demo modal for concrete implementation cues.",
    },
    advanced: {
      what: "A rhetorical frame: synaptic paths (latency budgets, hydration, streaming, GPU/CPU tradeoffs) vs silk surfaces (WebGL layers, spring physics, gesture choreography, SSR-friendly motion).",
      why: "Differentiation in the market is rarely a single library — it's coherence between intent capture & presentation latency.",
      action: "Run the Silk Analyzer on a reference URL, then cross-check Tech vs Interactions tabs against how you'd decompose your own stack.",
    },
  } satisfies GatewayArticle,

  weaveWorkshop: {
    headline: "Weave (site brief)",
    say: "describe the website you want",
    beginner: {
      what: "Weave is a short chat where you tell us what you want your website to look like — your business name, site type, style, goals, & pages. We save your answers to the Vault.",
      why: "You shouldn't need dev jargon to start a build. Plain questions mean anyone can leave a useful brief.",
      action: "Open Studio → Weave, answer the five questions, & find your saved brief under Vault → Weave briefs.",
    },
    moderate: {
      what: "A guided intake flow (not a full site builder yet). Optional AI follow-up when chat is configured; the brief always saves locally & can sync to the server Vault.",
      why: "Separates \"what I want\" from \"how we ship it\" so intake works before automated builds land.",
      action: "Reuse saved briefs when checkout & hosting bundles go live — or export notes for your own build path.",
    },
    advanced: {
      what: "Sessions persist via `weaveStore` with status `intake_complete`; follow-up posts to `/api/chat` with woven context from the five fields.",
      why: "Keeps the workshop deterministic for the core Q&A while allowing LLM polish on the edges.",
      action: "Extend `INTAKE_STEPS` or pipe completed sessions into Studio briefs / ops queue when build delivery ships.",
    },
  } satisfies GatewayArticle,

  weaveGrowth: {
    headline: "The Growth of the Weave",
    say: "Weave Motion — illustrative, not live data",
    beginner: {
      what: "An animated silk-weave that introduces three interface trends — AI intent, spatial depth, and physics micro-UX. It is illustrative, not a live analytics feed.",
      why: "It gives a shared picture before we dive into jargon like \"WebGL\" or \"intent-driven UI.\"",
      action: "Watch the threads: brown = AI steering interfaces, green = 3D/spatial layers, dashed = small physics-based details that make apps feel alive.",
    },
    moderate: {
      what: "Weave Motion — a narrative animation for AI-guided UX, WebGL-backed spatial UI, & physics micro-UX (springs, inertia, scroll-linked motion). No percentage claims.",
      why: "We're arguing a thesis: flat CRUD UIs are losing mindshare to richer surfaces; the motion makes that legible in one glance without fake metrics.",
      action: "Compare these beats to your product roadmap — which thread would you weave first?",
    },
    advanced: {
      what: "A narrative visualization — not sourced telemetry. Treat it as a mood board for capability maturity, not a dataset to cite externally.",
      why: "Positioning requires a story arc; this section anchors the archive's editorial stance without pretending to be a research firm.",
      action: "If you need defensible stats, wire a separate analytics block from product telemetry or third-party benchmarks — not this marketing loop.",
    },
  } satisfies GatewayArticle,

  indexAraneae: {
    headline: "Index Araneae",
    say: "ah-rah-NEE-eye … Latin for spiders",
    beginner: {
      what: "A curated gallery of interface ideas — each card is a \"strand\" you can open to see a small interactive demo.",
      why: "Instead of endless blog posts, we show patterns you can feel. Latin naming keeps the brand distinct from generic \"design systems\" sites.",
      action: "Pick a card that looks closest to your use case, open it, & steal the interaction principle (not necessarily the code verbatim).",
    },
    moderate: {
      what: "A pattern index grouped by silk category: spatial (WebGL/three.js-ish), Gen-AI (LLM-adjacent flows), physics (springs, magnetism, scroll choreography).",
      why: "Taxonomy matters when you're building a tab from your main AI company site — you want visitors to self-route in under ten seconds.",
      action: "Wire your parent-site tab to deep-link here with `#index` so power users land on the grid immediately.",
    },
    advanced: {
      what: "Static seed data in `src/data/strands.ts` — swap for CMS or API when you scale. Canvas overlay draws proximity edges on hover for spatial metaphor only.",
      why: "The performance cost is bounded (single rAF loop); keep card count modest or virtualize if you grow past ~30 strands.",
      action: "Add OG images per strand route if you later split cards into individual pages for SEO.",
    },
  } satisfies GatewayArticle,

  curatedStrands: {
    headline: "Curated strands of innovation",
    say: "strand — one gallery card; innovation — the idea it showcases",
    beginner: {
      what: "\"Strand\" is our word for a single interface example in this archive (one card = one strand). \"Curated\" means we chose pieces that illustrate a direction — not every site on the web.",
      why: "A full directory would drown the signal. Browsing here is about spotting patterns you can borrow, not benchmarking every competitor.",
      action: "Open any card for a mini-demo; use the silk filters above to focus on Spatial, Gen-AI, or Physics vibes.",
    },
    moderate: {
      what: "Each strand maps to static seed data (`strands.ts`): tags, category, & a linked demo component.",
      why: "Keeps the exhibit fast & portable until you're ready for a CMS.",
      action: "Cross-reference strand tags with the Tech tab in Analyzer results when you're sourcing implementation ideas.",
    },
    advanced: {
      what: "Taxonomy is intentionally shallow — category drives filters; tags are scan helpers, not a formal ontology.",
      why: "Faceted search belongs after you have volume & editorial workflow.",
      action: "When you outgrow ~30 entries, virtualize the grid or pipe strands from an API.",
    },
  } satisfies GatewayArticle,

  silkStrand: {
    headline: "Silk type (filter)",
    say: "just \"silk\" — our word for interface family",
    beginner: {
      what: "The pill buttons (All / Spatial / Gen-AI / Physics) sort the gallery by what kind of \"feel\" each example leans into.",
      why: "If you're new to front-end, picking a filter narrows the noise so you're not comparing a 3D globe to a chat widget.",
      action: "Try \"Physics\" if you care about buttons that nudge, panels that ease, or scroll-linked storytelling.",
    },
    moderate: {
      what: "Heuristic tags on each `StrandItem`: `webgl` | `ai` | `ux` mapped to Spatial / Gen-AI / Physics labels.",
      why: "It's not a rigorous ontology — it's a browsing aid. Real projects often span two silks.",
      action: "When tagging new strands, pick the dominant user-perceived affordance, not the deepest dependency graph.",
    },
    advanced: {
      what: "Filters drive a simple `Array.prototype.filter` on category; hover canvas draws Delaunay-ish arcs in screen space for flair.",
      why: "Keep taxonomies shallow until you have enough items to justify faceted search or search-in-place.",
      action: "If you add RSC & server actions later, prefetch filtered subsets to avoid shipping the full strand array to the client.",
    },
  } satisfies GatewayArticle,

  silkAnalyzer: {
    headline: "Silk Analyzer",
    say: "AN-uh-ly-zer",
    beginner: {
      what: "Paste a website address. We fetch its public HTML when the server allows it, scan it like a quick health check, & summarize design, tech, accessibility hints, & sample code ideas.",
      why: "So you can learn from real sites without installing browser extensions or reading thousand-line repos first.",
      action: "Some sites block or throttle automated requests — we show a clear message when a page can’t be fetched.",
    },
    moderate: {
      what: "Server-side Cheerio parse + heuristics in `src/lib/analyzer.ts`, exposed via `POST /api/analyze`. Not a substitute for Lighthouse budgets or legal audits.",
      why: "Good for pitch prep, competitive snapshots, & onboarding junior devs to \"what's under the hood.\"",
      action: "Normalize URLs on blur (https + www for apex domains); extend heuristics as you discover false positives in your niche.",
    },
    advanced: {
      what: "Static analysis of first HTML response — no JS execution, no auth, no multi-page crawl. Cheerio pseudo-selectors must stay DOM-safe (no :focus-style pseudos).",
      why: "Scope is intentionally narrow for latency & ToS risk; depth beats pretending to be a full crawler.",
      action: "Add caching (KV/Redis) keyed by normalized URL if traffic spikes; rate-limit per IP at the edge.",
    },
  } satisfies GatewayArticle,

  strandModal: {
    headline: "Strand demo",
    beginner: {
      what: "Each card in the Index opens this window: a short interactive sample that illustrates one idea (springs, 3D, scroll-linked motion, etc.). It's a teaching toy, not a production component library.",
      why: "Seeing motion beats reading a bullet list — especially for stakeholders who don't ship CSS daily.",
      action: "Use \"Visit Source Origin\" when you want the real reference implementation, not just our distilled demo.",
    },
    moderate: {
      what: "Demos are local React sketches mapped by `demoType` on each strand; they intentionally avoid network calls & heavy assets.",
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
      what: "After a scan, use the tabs like chapters: Overview is the story, Design is look-and-feel, Tech is what libraries likely power the page, Interactions is motion & inputs, UX & A11y is accessibility hints, Code Snippets is starter ideas — not a full clone.",
      why: "Tabs keep experts fast while beginners aren't forced to read everything at once.",
      action: "Start at Overview, then jump only to the tab that matches your current question (e.g. \"Is it accessible?\" = UX & A11y).",
    },
    moderate: {
      what: "Heuristic buckets derived from static HTML — no execution environment, so SPAs that hydrate late may under-report client-only frameworks.",
      why: "Honest scope avoids over-selling the analyzer as production monitoring.",
      action: "Cross-check Tech tab with DevTools Network + Sources when stakes are high (M&A, compliance).",
    },
    advanced: {
      what: "Extend `analyzer.ts` to emit confidence per tab; consider diffing two captures for regression storytelling in CI.",
      why: "As you productize, customers will ask for provenance & repeatability.",
      action: "Version analyzer rules SemVer-style & log rule-set ID alongside each response.",
    },
  } satisfies GatewayArticle,

  analyzerScore: {
    headline: "Silk score",
    say: "heuristic 0–100",
    beginner: {
      what: "A single number summarizing how many positive signals we found versus issues — like a report card headline, not a legal grade.",
      why: "Humans scan numbers faster than bullet walls; the detail lives in the tabs underneath.",
      action: "If the score feels \"wrong,\" read the Needs Attention list — scores swing hard when key tags or frameworks are missing from the HTML we could see.",
    },
    moderate: {
      what: "Weighted tally across innovations, unique features, & detected problems from the analyzer heuristics.",
      why: "It's intentionally reductive to force prioritization; don't publish this externally as an objective quality metric without tuning weights for your domain.",
      action: "Fork `analyzer.ts` scoring constants to match what your org values (e.g., a11y vs novelty).",
    },
    advanced: {
      what: "Non-deterministic across time if target sites A/B their markup; cache busting depends on their CDN headers.",
      why: "Document provenance when screenshotting results for clients — include URL & timestamp.",
      action: "Pipe the same HTML into Lighthouse or axe-core in CI for authoritative a11y numbers alongside this exploratory score.",
    },
  } satisfies GatewayArticle,

  elasticSilk: {
    headline: "Elastic Silk",
    beginner: {
      what: "Interfaces that subtly move when you get close — panels feel \"tensioned\" like fabric, then relax when you look away.",
      why: "It rewards exploration without demanding clicks; good for marketing & creative tools.",
      action: "Try the Magnetic or Fluid demos in the strand modals to see elastic metaphors in miniature.",
    },
    moderate: {
      what: "Proximity-based transforms, often CSS transforms + pointer tracking or spring solvers; watch for reduced-motion users.",
      why: "Elasticity increases perceived quality but can hurt WCAG if motion can't be disabled.",
      action: "Gate intense motion behind `prefers-reduced-motion: reduce` & provide a static fallback layout.",
    },
    advanced: {
      what: "Typically combines pointermove throttling, LERP/spring constants, & compositor-friendly properties (`transform`, `opacity`).",
      why: "Layout thrashing kills the illusion — measure with Performance panel before shipping elastic chrome broadly.",
      action: "Consider CSS `@starting-style` / view transitions where supported to reduce bespoke JS.",
    },
  } satisfies GatewayArticle,

  orbitalWeb: {
    headline: "Orbital Web",
    beginner: {
      what: "Navigation imagined as rings around a center — like a spider web viewed from above — instead of a flat list of links.",
      why: "It helps users build a mental map of depth: closer to the hub = broader, farther rings = more specific.",
      action: "Sketch your IA as concentric circles before you wireframe; see if primary tasks cluster naturally.",
    },
    moderate: {
      what: "Information architecture pattern: hub-and-spoke with radial emphasis; often paired with zoomable UIs or circular menus.",
      why: "Breaks left-nav monotony on dense dashboards when paired with strong focal content.",
      action: "Validate with tree testing — orbital metaphors fail if labels don't align with user vocabulary.",
    },
    advanced: {
      what: "May imply polar coordinates, canvas/WebGL hit tests, or focus rings that don't follow linear tab order — plan keyboard paths explicitly.",
      why: "Radial layouts are notorious for accessibility debt if focus order is an afterthought.",
      action: "Mirror the visual ring order in `tabindex` or roving tabindex groups; provide list view escape hatch.",
    },
  } satisfies GatewayArticle,

  intentThread: {
    headline: "Intent Thread",
    beginner: {
      what: "You say what you want in plain language; the interface rearranges itself to match that goal instead of making you hunt through menus.",
      why: "That's how many AI assistants feel — & users now expect the same immediacy from traditional apps.",
      action: "List the top five user intents for your product; check whether your nav labels match those words.",
    },
    moderate: {
      what: "NLU / LLM routing + UI state synthesis: prompt = plan = surface components or data fetches.",
      why: "Latency & trust are the bottlenecks — surface provenance & allow edits before destructive actions.",
      action: "Log intent classifications to refine prompts; add human confirmation for irreversible ops.",
    },
    advanced: {
      what: "Often implemented via tool-calling schemas, retrieval over design tokens/components, & streaming partial layouts.",
      why: "Hallucinated UI is worse than static UI — constrain generation to validated component libraries.",
      action: "Version your tool schemas; snapshot model IDs in analytics when comparing rollout cohorts.",
    },
  } satisfies GatewayArticle,

  spinneret: {
    headline: "Spinneret",
    say: "SPIN-uh-ret — where silk comes out on a spider",
    beginner: {
      what: "The part of a spider that produces silk. Here, it's a metaphor for the three repeatable \"weaves\" we think modern product teams should master.",
      why: "Naming a methodology section something memorable beats another \"Our process\" heading — especially when your parent site sends mixed audiences.",
      action: "Pick one weave to prototype this quarter; add a second only once the first is stable in production.",
    },
    moderate: {
      what: "Editorial framework: Elastic Silk (proximity UI), Orbital Web (hub/radial IA), Intent Thread (goal-first surfaces).",
      why: "Each maps to different staffing risks — motion perf, IA testing, or LLM guardrails — so you can forecast dependencies early.",
      action: "Score your current app 1-5 on each weave; the lowest score is your hiring or agency brief.",
    },
    advanced: {
      what: "Not a formal design system — an opinionated lens for critiquing demos in this archive & prioritizing R&D bets.",
      why: "Keeps the micro-site's voice distinct from generic \"design thinking\" decks your main AI brand may already publish.",
      action: "If you externalize this, pair each weave with reference implementations & failure case studies.",
    },
  } satisfies GatewayArticle,

  archiveArac: {
    headline: "Archive Arac",
    say: "AIR-ak … \"Arac\" like arachnid",
    beginner: {
      what: "The name of this micro-site: a small, themed archive of future-facing interface ideas, separate from your main company homepage.",
      why: "Giving it its own identity makes the tab hand-off clear — visitors know they've entered a focused exhibit, not your entire corporate story.",
      action: "From your main AI site, label the tab with this product name & link straight to `/` or `#analyzer` depending on audience.",
    },
    moderate: {
      what: "Brand vessel for \"Vanguard Weave\" content — spider/silk metaphors, warm neutrals, orange accent, canvas ambience.",
      why: "Distinct visual language reduces confusion with generic AI landing pages that all look the same.",
      action: "Keep parent brand in footer or nav return link if users need wayfinding back to the mothership.",
    },
    advanced: {
      what: "Static Next.js app — swap `metadata` in `layout.tsx` for canonical URLs, OG images, & `robots.txt` when you attach a custom domain.",
      why: "SEO for micro-sites works best when the parent domain cross-links with descriptive anchor text once, not fifty keyword-stuffed backlinks.",
      action: "Deploy to Vercel/Netlify with preview branches; add `sitemap.xml` if you later add multi-route content.",
    },
  } satisfies GatewayArticle,

  whatIsUI: {
    headline: "User Interface (UI)",
    say: "you-eye",
    beginner: {
      what: "UI stands for User Interface -- the buttons, menus, text, images, & layout you see & interact with on a screen. It's the visual part of a website or app.",
      why: "Understanding UI helps you talk about what you see vs what happens behind the scenes. Good UI makes complex actions feel simple.",
      action: "When browsing this archive, notice how each example arranges buttons, text, & motion. That arrangement is the UI.",
    },
    moderate: {
      what: "UI encompasses layout grids, typography scales, color systems, component states (hover, focus, active, disabled), & responsive breakpoints that adapt to different screen sizes.",
      why: "Teams separate UI from UX (User Experience) to divide visual design from interaction logic -- but the best products blur that line.",
      action: "Inspect the demo modals & note how each uses different UI patterns: cards, radial menus, scroll-linked reveals, or terminal-like prompts.",
    },
    advanced: {
      what: "UI in modern web apps spans declarative component trees (React/Vue), design tokens, shadow DOM encapsulation, & layout primitives like CSS Grid, Container Queries, & Subgrid.",
      why: "Architecting UI at scale requires a design system -- not just a component library but shared constraints for spacing, motion, & color.",
      action: "Cross-reference the Tech tab in the Silk Analyzer results to see what CSS frameworks & component patterns a site uses under the hood.",
    },
  } satisfies GatewayArticle,

  spatialCategory: {
    headline: "Spatial / WebGL",
    say: "web-G-L — graphic library for the browser",
    beginner: {
      what: "Interfaces that use depth, 3D, & perspective -- like objects that tilt when you move your mouse or layers that feel stacked in physical space. WebGL is the technology that draws 3D graphics in a browser.",
      why: "Flat screens can feel immersive when elements behave like physical objects. Spatial design adds a sense of place.",
      action: "Try the Chroma Web Spatial or Orb Weaver Canvas demos in the Index -- they show 3D tilt & radial menus that feel spatial.",
    },
    moderate: {
      what: "Spatial UI uses CSS 3D transforms, WebGL via libraries like Three.js, or Canvas 2D with perspective calculations to create depth illusions.",
      why: "Spatial interfaces increase engagement but require careful performance tuning -- GPU compositing & frame budgets matter.",
      action: "Filter the Index by Spatial to see all WebGL-backed examples. Each demo emphasizes depth, rotation, or camera-like movement.",
    },
    advanced: {
      what: "WebGL is a rasterization API that runs on the GPU. Spatial UI often combines it with post-processing (bloom, DOF), parallax mapping, & raycasting for mouse interaction with 3D objects.",
      why: "The cost is bundle size & device battery. Progressive enhancement (2D fallback) protects users on low-power hardware.",
      action: "Open DevTools Performance panel while running a Spatial demo -- watch for compositor tile invalidations on scroll.",
    },
  } satisfies GatewayArticle,

  genAICategory: {
    headline: "Gen-AI (Generative AI)",
    say: "jen A-I",
    beginner: {
      what: "Technology that can create text, images, or code from prompts. Here it means interfaces that reshape around what you intend — Weave Motion labels this lane \"AI Intent\" (same idea as Intent-Driven).",
      why: "Gen-AI shifts the UI paradigm from hunting through menus to stating what you want.",
      action: "Filter by Gen-AI in the Index for terminal-first navigation, unfurling content, & prompt-led shells.",
    },
    moderate: {
      what: "Gen-AI in UI often means LLM-powered flows: command palettes, dynamic content generation, intent parsing, & streaming responses that feel conversational.",
      why: "The shift from click-to-navigate to intent-driven surfaces reduces cognitive load but introduces latency & hallucination risks.",
      action: "Open the Echo Intent Web or Cocoon Content Shell demos -- they simulate Gen-AI patterns without calling actual LLMs.",
    },
    advanced: {
      what: "Production Gen-AI UI involves streaming partial rendering, prompt-to-component mapping, & guardrail layers that constrain model outputs to validated design tokens.",
      why: "Hallucinated UI is worse than static UI -- generation must be scoped to allowed components & layouts.",
      action: "Review the Intent Thread glossary entry for deeper architectural patterns around tool-calling schemas & streaming layouts.",
    },
  } satisfies GatewayArticle,

  physicsCategory: {
    headline: "Physics / Micro-UX",
    say: "MY-cro U-X",
    beginner: {
      what: "Buttons that nudge toward your cursor, panels that bounce into place, or scroll animations that feel organic. Micro-UX refers to tiny interactions that make an app feel alive.",
      why: "Small motion details signal quality. Users may not notice them consciously, but they feel the difference between a stiff app & a fluid one.",
      action: "Filter by Physics in the Index & try the Nerve Magnetic Strand or Architect Timeline Loom demos -- they show magnetic pull & scroll-weaving.",
    },
    moderate: {
      what: "Spring physics, easing curves, pointer tracking with distance calculations, & scroll-triggered animations.",
      why: "Physics-based interactions increase perceived performance & delight but must respect reduced-motion preferences for accessibility.",
      action: "Gate heavy physics behind CSS prefers-reduced-motion & provide static fallbacks.",
    },
    advanced: {
      what: "Spring solvers (damping ratio, stiffness), smooth interpolation, & compositor-only properties to avoid layout thrash.",
      why: "Layout thrashing kills the illusion -- measure with Performance panel before shipping physics broadly.",
      action: "Consider view transitions API as an alternative to JS physics loops for declarative scroll animations.",
    },
  } satisfies GatewayArticle,

  intentDrivenTerm: {
    headline: "Intent-Driven",
    beginner: {
      what: "Interfaces that figure out what you want to do -- not by making you click through menus, but by guessing or asking. Like typing in a command bar & the page rearranges to show what you need.",
      why: "As AI grows, users expect apps to anticipate their needs instead of forcing them to navigate.",
      action: "Watch the brown thread in Weave Motion on the home page — it introduces the AI Intent-Driven beat for a reason.",
    },
    moderate: {
      what: "Intent-driven UIs use natural language processing, command palettes (CMD+K patterns), & predictive interfaces that surface actions before the user asks.",
      why: "Reduces navigation depth & speeds up expert users. Requires careful fallback when intent is ambiguous.",
      action: "Explore the Echo Intent Web demo -- it simulates an intent-driven interface where a single prompt generates the page.",
    },
    advanced: {
      what: "Architecturally, intent-driven systems combine NLU routing, state synthesis from user context, & dynamic component assembly.",
      why: "Latency & trust are the bottlenecks. Surface provenance, allow edits before destructive actions, & log classifications for refinement.",
      action: "Review tool-calling schemas & how they constrain generation to allowed component libraries.",
    },
  } satisfies GatewayArticle,

  allStrands: {
    headline: "All Strands",
    beginner: {
      what: "A 'strand' is our word for an individual interface example in this archive. 'All Strands' shows every example without filtering.",
      why: "Browsing everything at once helps you discover patterns you didn't know you were looking for.",
      action: "Scroll through the cards. Open any that catch your eye -- each is a self-contained interactive demo.",
    },
    moderate: {
      what: "Each strand is data in src/data/strands.ts with tags, a category label, & a linked interactive demo component.",
      why: "The strand metaphor (spider silk) keeps the archive's voice distinctive while organizing content that spans very different technologies.",
      action: "The Web view shows all strands as connected nodes in a radial network, reinforcing the 'web' metaphor visually.",
    },
    advanced: {
      what: "Strand data is static seed JSON. When scaling past ~30 entries, virtualize the grid or migrate to a CMS with an API layer.",
      why: "Static data keeps first load fast. CMS migration is straightforward since each entry maps to a CMS model.",
      action: "If you want shareable URLs per strand, add a route like app/strands/[id]/page.tsx with per-strand OG images.",
    },
  } satisfies GatewayArticle,

  gridWebView: {
    headline: "Grid & Web View",
    beginner: {
      what: "Grid shows strand cards in columns so you can read titles & blurbs. Web shows the same strands as nodes on a canvas — good for seeing how everything connects.",
      why: "Grid is for scanning & clicking cards. Web is for the big-picture map.",
      action: "Use the floating View control (bottom-right): Grid vs Web. Press Escape to leave Web view.",
    },
    moderate: {
      what: "Grid arranges cards with CSS Grid for a browsable catalog. Web uses a full-screen Canvas 2D layer with physics simulation & mouse interaction.",
      why: "Two views serve different cognitive modes: analytical browsing vs conceptual overview.",
      action: "In Web view, hover any node to highlight its connections. Click to open the strand modal.",
    },
    advanced: {
      what: "The Web canvas draws nodes in a circular layout with ambient drift, curved connections between all nodes, & mouse repulsion -- all in a single rAF loop.",
      why: "Canvas rendering keeps performance predictable regardless of DOM complexity. The connection lines reinforce the 'web' metaphor.",
      action: "Tune node count, drift amplitude, & connection alpha values to taste in the source.",
    },
  } satisfies GatewayArticle,

  strandTags: {
    headline: "Card Tags",
    say: "shorthand descriptors",
    beginner: {
      what: "Keyword chips on each card — quick shorthand for the vibe. Common examples: Kinetic (motion-led); Magnetic (elements ease toward the cursor); Tension (springy pull); Scroll-weave / Story-silk (the narrative unfolds as you scroll); Observer (reveals when something enters the viewport); Particles / Canvas / 3D (how dense or dimensional the visuals feel).",
      why: "Tags speed up scanning — you spot \"magnetic\" vs \"scroll\" without reading the whole blurb.",
      action: "Click any tag here to open this glossary. Open the card when you want the live demo.",
    },
    moderate: {
      what: "Tags are heuristic labels in src/data/strands.ts. Each maps to one of three silk categories (Spatial, Gen-AI, Physics) or describes a specific interaction quality.",
      why: "Shallow taxonomy keeps maintenance low. When adding new strands, pick tags that describe the user-facing behavior, not the underlying library.",
      action: "Use tags as search hints when you're looking for a specific feeling, like 'tension' or 'reveal.'",
    },
    advanced: {
      what: "Tags are strictly decorative metadata — they don't drive logic beyond Array.prototype.filter. The canvas connection lines don't use tag proximity, only silk category.",
      why: "Tags decouple display from filtering. Category is for sorting; tags are for human scanning.",
      action: "If you add faceted search later, tags become filter dimensions. Until then, keep them sparse.",
    },
  } satisfies GatewayArticle,
} as const;

export type GlossKey = keyof typeof gloss;
