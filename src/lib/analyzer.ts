import * as cheerio from "cheerio";
import type { AnalysisResult, ColorScheme, CodeSnippet, InteractionHighlight } from "@/types/analysis";

const commonFrameworks: { name: string; detection: string[] }[] = [
  { name: "React", detection: ["react", "react-dom", "_reactRoot"] },
  { name: "Next.js", detection: ["__NEXT_DATA__", "next-root", "nextjs"] },
  { name: "Vue.js", detection: ["vue", "vue-app", "__VUE__"] },
  { name: "Nuxt", detection: ["__NUXT__", "nuxt"] },
  { name: "Angular", detection: ["ng-version", "ng-app", "angular"] },
  { name: "Svelte", detection: ["svelte", "__svelte"] },
  { name: "SvelteKit", detection: ["sveltekit", "__sveltekit"] },
  { name: "Gatsby", detection: ["gatsby", "___gatsby"] },
  { name: "Astro", detection: ["astro", "astro-build"] },
  { name: "Remix", detection: ["remix"] },
  { name: "Alpine.js", detection: ["alpine", "x-data"] },
  { name: "HTMX", detection: ["htmx"] },
  { name: "jQuery", detection: ["jquery", "jQuery"] },
];

const commonLibraries: { name: string; detection: string[] }[] = [
  { name: "Three.js", detection: ["three", "three.js", "THREE"] },
  { name: "GSAP", detection: ["gsap", "TweenMax", "TimelineMax"] },
  { name: "Framer Motion", detection: ["framer-motion", "motion"] },
  { name: "Chart.js", detection: ["chart.js", "Chart"] },
  { name: "D3.js", detection: ["d3.js", "d3"] },
  { name: "Tailwind CSS", detection: ["tailwindcss", "tailwind"] },
  { name: "Bootstrap", detection: ["bootstrap", "bootstrap."] },
  { name: "Font Awesome", detection: ["font-awesome", "fontawesome"] },
  { name: "Lodash", detection: ["lodash", "lodash."] },
  { name: "Swiper", detection: ["swiper"] },
  { name: "AOS", detection: ["aos", "aos."] },
  { name: "Lenis", detection: ["lenis"] },
  { name: "Locomotive Scroll", detection: ["locomotive-scroll", "locomotive"] },
  { name: "PixiJS", detection: ["pixi", "pixi.js"] },
  { name: "React Spring", detection: ["react-spring", "useSpring"] },
  { name: "Prism.js", detection: ["prism"] },
  { name: "Highlight.js", detection: ["highlight.js", "hljs"] },
];

const analyticsDetectors: { name: string; patterns: string[] }[] = [
  { name: "Google Analytics", patterns: ["gtag", "ga(", "googletagmanager", "ga.js"] },
  { name: "PostHog", patterns: ["posthog", "ph-"] },
  { name: "Mixpanel", patterns: ["mixpanel"] },
  { name: "Amplitude", patterns: ["amplitude"] },
  { name: "Segment", patterns: ["segment", "analytics.js"] },
  { name: "Plausible", patterns: ["plausible"] },
  { name: "Fathom", patterns: ["fathom"] },
  { name: "Hotjar", patterns: ["hotjar"] },
  { name: "FullStory", patterns: ["fullstory", "FS."] },
  { name: "Vercel Analytics", patterns: ["vercel-analytics", "@vercel"] },
  { name: "Clarity", patterns: ["clarity"] },
  { name: "Meta Pixel", patterns: ["fbq", "connect.facebook"] },
];

function detectFrameworks(html: string, scripts: string[]): string[] {
  return commonFrameworks
    .filter((fw) => fw.detection.some((d) => html.includes(d) || scripts.some((s) => s.includes(d))))
    .map((fw) => fw.name);
}

function detectLibraries(html: string, scripts: string[]): string[] {
  return commonLibraries
    .filter((lib) => lib.detection.some((d) => html.includes(d) || scripts.some((s) => s.includes(d))))
    .map((lib) => lib.name);
}

function detectAnalytics(html: string): string[] {
  return analyticsDetectors
    .filter((a) => a.patterns.some((p) => html.includes(p)))
    .map((a) => a.name);
}

function extractColors($: cheerio.CheerioAPI): ColorScheme {
  const styleText = $("style").map((_, el) => $(el).text()).get().join("\n");
  const inlineStyles = $("[style]").map((_, el) => $(el).attr("style") || "").get().join("\n");
  const combined = styleText + "\n" + inlineStyles;

  const colorRegex = /(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\))/g;
  const matches = combined.match(colorRegex) || [];

  const counts = new Map<string, number>();
  for (const c of matches) {
    const normalized = c.toLowerCase();
    counts.set(normalized, (counts.get(normalized) || 0) + 1);
  }

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const palette = sorted.slice(0, 8).map(([c]) => c);

  // Extract common named colors from CSS
  const bgColors = extractPropertyColors(combined, "background", "background-color");
  const textColors = extractPropertyColors(combined, "color");
  const accentColors = extractPropertyColors(combined, "accent-color", "border-color", "outline-color");

  return {
    primary: accentColors[0] || bgColors[0] || "#000000",
    secondary: accentColors[1] || bgColors[1] || "#666666",
    accent: accentColors[0] || palette[0] || "#000000",
    background: bgColors[0] || "#ffffff",
    text: textColors[0] || "#000000",
    palette: palette,
  };
}

function extractPropertyColors(css: string, ...props: string[]): string[] {
  const results = new Map<string, number>();
  for (const prop of props) {
    const regex = new RegExp(`${prop}\\s*:\\s*([^;!]+)`, "gi");
    let match: RegExpExecArray | null;
    while ((match = regex.exec(css)) !== null) {
      const val = match[1].trim().toLowerCase();
      if (val.startsWith("#") || val.startsWith("rgb") || val.startsWith("hsl")) {
        results.set(val, (results.get(val) || 0) + 1);
      }
    }
  }
  return [...results.entries()].sort((a, b) => b[1] - a[1]).map(([c]) => c);
}

function extractTypography($: cheerio.CheerioAPI): { fonts: string[]; headings: string[]; bodySize: string } {
  const fontImports = $("link[href*='fonts.googleapis.com']").attr("href") || "";
  const fontFaces = $("style")
    .map((_, el) => $(el).text())
    .get()
    .join("\n");

  const fonts = new Set<string>();
  const fontRegex = /font-family:\s*['"]?([^;'"}]+)['"]?/gi;
  let match: RegExpExecArray | null;

  // From inline styles
  $("[style*='font-family']").each((_, el) => {
    const style = $(el).attr("style") || "";
    while ((match = fontRegex.exec(style)) !== null) {
      fonts.add(match[1].trim().split(",")[0].replace(/['"]/g, ""));
    }
  });

  // From @font-face
  const ffRegex = /font-family:\s*['"]?([^;'"}]+)['"]?/gi;
  while ((match = ffRegex.exec(fontFaces)) !== null) {
    fonts.add(match[1].trim().replace(/['"]/g, ""));
  }

  // From Google Fonts URL
  if (fontImports) {
    const gfMatch = fontImports.match(/family=([^&]+)/);
    if (gfMatch) {
      gfMatch[1].split("|").forEach((f) => fonts.add(decodeURIComponent(f).split(":")[0]));
    }
  }

  const headings = $("h1, h2, h3, h4, h5, h6")
    .map((_, el) => {
      const tag = $(el).prop("tagName")?.toLowerCase() || "";
      const text = $(el).text().trim().substring(0, 60);
      return `${tag}: "${text}"`;
    })
    .get()
    .slice(0, 10);

  const bodyEl = $("body").css("font-size") || "16px";

  return {
    fonts: [...fonts].slice(0, 6),
    headings,
    bodySize: bodyEl,
  };
}

function extractAnimations($: cheerio.CheerioAPI, html: string) {
  const styleText = $("style").map((_, el) => $(el).text()).get().join("\n");
  const cssAnimations: { selector: string; properties: string[] }[] = [];
  const cssTransitions: { selector: string; properties: string[] }[] = [];
  const hoverEffects: string[] = [];
  const scrollEffects: string[] = [];
  const jsAnimations: string[] = [];
  const performanceWarnings: string[] = [];

  let match: RegExpExecArray | null;

  // Extract @keyframes
  const keyframeRegex = /@keyframes\s+([^{\s]+)\s*{([^}]+)}/g;
  while ((match = keyframeRegex.exec(styleText)) !== null) {
    cssAnimations.push({ selector: `@keyframes ${match[1]}`, properties: [match[2].trim()] });
  }

  // Find animated selectors
  const animationRegex = /([^{]+\{)([^}]*animation[^}]*\})/gi;
  while ((match = animationRegex.exec(styleText)) !== null) {
    const selector = match[1].trim();
    cssAnimations.push({ selector, properties: [match[2].trim()] });
  }

  // Find transitions
  const transitionRegex = /([^{]+\{)([^}]*transition[^}]*\})/gi;
  while ((match = transitionRegex.exec(styleText)) !== null) {
    const selector = match[1].trim();
    cssTransitions.push({ selector, properties: [match[2].trim()] });
  }

  // Hover effects
  const hoverRegex = /([^{]*:hover[^{]*\{[^}]*\})/gi;
  while ((match = hoverRegex.exec(styleText)) !== null) {
    hoverEffects.push(match[1].trim());
  }

  // Detect scroll-based libraries
  if (html.includes("IntersectionObserver")) scrollEffects.push("IntersectionObserver-based reveals");
  if (html.includes("scroll") && (html.includes("parallax") || html.includes("Parallax")))
    scrollEffects.push("Parallax scrolling");
  if (html.includes("aos")) scrollEffects.push("AOS (Animate on Scroll)");
  if (html.includes("lenis")) scrollEffects.push("Lenis smooth scroll");
  if (html.includes("locomotive")) scrollEffects.push("Locomotive Scroll");

  // JS animation detection
  if (html.includes("requestAnimationFrame")) jsAnimations.push("requestAnimationFrame loop");
  if (html.includes("GSAP") || html.includes("gsap")) jsAnimations.push("GSAP timeline animations");
  if (html.includes("motion.div") || html.includes("motion."))
    jsAnimations.push("Framer Motion animations");
  if (html.includes("anime(") || html.includes("anime."))
    jsAnimations.push("anime.js animations");

  // Performance warnings
  if (html.includes("will-change")) performanceWarnings.push("Uses will-change (good)");
  if (html.includes("transform")) performanceWarnings.push("GPU-accelerated transforms detected");
  if ($("canvas").length > 3)
    performanceWarnings.push(`Found ${$("canvas").length} canvas elements — monitor performance`);
  if (cssAnimations.length > 20)
    performanceWarnings.push(`${cssAnimations.length} animations is high — consider optimizing`);

  return { cssAnimations, cssTransitions, jsAnimations, hoverEffects, scrollEffects, performanceWarnings };
}

function analyzeUX($: cheerio.CheerioAPI, html: string) {
  const nav = $("nav, header nav, [role='navigation']");
  const navItems = nav.find("a").length;
  const hasMobileMenu =
    html.includes("hamburger") || html.includes("menu-toggle") || html.includes("mobile-menu");

  // Forms
  const forms = $("form");
  const hasValidation = html.includes("required") || html.includes("pattern=") || html.includes("valid");
  const formAccessible = forms
    .toArray()
    .every((f) => $(f).find("label, [aria-label], [aria-labelledby]").length > 0);

  // A11y check
  const a11yIssues: string[] = [];
  const a11yPassed: string[] = [];

  if ($("img:not([alt])").length > 0) a11yIssues.push(`${$("img:not([alt])").length} images missing alt text`);
  else a11yPassed.push("All images have alt text");

  if ($("[tabindex]").length > 0) a11yIssues.push("Uses tabindex — may break natural tab order");
  else a11yPassed.push("Natural tab order preserved");

  if ($("[aria-label], [aria-describedby], [aria-labelledby]").length > 0)
    a11yPassed.push(`Found ${$("[aria-label], [aria-describedby], [aria-labelledby]").length} ARIA attributes`);
  else a11yIssues.push("No ARIA attributes found");

  // Cheerio cannot evaluate :focus — avoid pseudo-selectors that throw "Unknown pseudo-class :focus"
  if ($("button, a[href]").length > 0)
    a11yPassed.push("Interactive elements present (buttons/links)");

  const hasSkipNav = html.includes("skip") || html.includes("Skip");
  if (hasSkipNav) a11yPassed.push("Skip navigation link present");

  // SEO
  const title = $("title").text() || null;
  const metaDesc = $('meta[name="description"]').attr("content") || null;
  const ogTags =
    $('meta[property^="og:"]').length > 0 || $('meta[name^="twitter:"]').length > 0;
  const seoIssues: string[] = [];
  if (!title) seoIssues.push("Missing <title> tag");
  if (!metaDesc) seoIssues.push("Missing meta description");
  if (!ogTags) seoIssues.push("Missing Open Graph / Twitter Card tags");

  // Performance indicators
  const externalScripts = $("script[src]").length;
  const externalStyles = $('link[rel="stylesheet"]').length;
  const domSize = $("*").length;
  const perfIssues: string[] = [];
  if (domSize > 2000) perfIssues.push(`Large DOM (${domSize} elements) — consider virtualization`);
  if (externalScripts > 20) perfIssues.push(`${externalScripts} external scripts — impacts load time`);
  if ($("img").length > 50) perfIssues.push(`${$("img").length} images — consider lazy loading`);

  // A11y score
  const a11yScore =
    a11yIssues.length <= 1
      ? "excellent"
      : a11yIssues.length <= 3
        ? "good"
        : a11yIssues.length <= 5
          ? "fair"
          : "poor";

  return {
    navigation: {
      type: nav.length > 0 ? "Semantic <nav>" : "Generic",
      items: navItems || $("header a").length,
      hasMobileMenu,
      issues: nav.length === 0 ? ["No semantic <nav> element found"] : [],
    },
    forms: {
      count: forms.length,
      hasValidation,
      accessible: formAccessible,
    },
    accessibility: {
      score: a11yScore as "poor" | "fair" | "good" | "excellent",
      issues: a11yIssues,
      passed: a11yPassed,
    },
    seo: { title, description: metaDesc, ogTags, issues: seoIssues },
    performance: {
      domSize,
      resourceCount: externalScripts + externalStyles,
      externalRequests: externalScripts,
      issues: perfIssues,
    },
  };
}

function extractCSSProperties($: cheerio.CheerioAPI): Record<string, string[]> {
  const styleText = $("style").map((_, el) => $(el).text()).get().join("\n");
  const results: Record<string, string[]> = {};

  const categories: Record<string, RegExp> = {
    "Flexbox/Grid": /display:\s*(flex|grid|inline-flex|inline-grid)/gi,
    "CSS Transform": /transform:\s*[^;]+/gi,
    "CSS Animation": /animation:\s*[^;]+/gi,
    "CSS Transition": /transition:\s*[^;]+/gi,
    "Clip Path": /clip-path:\s*[^;]+/gi,
    "Backdrop Filter": /backdrop-filter:\s*[^;]+/gi,
    "CSS Filter": /filter:\s*[^;]+/gi,
    "Gradient": /background:\s*[^;]*(linear-gradient|radial-gradient|conic-gradient)[^;]*/gi,
    "Box Shadow": /box-shadow:\s*[^;]+/gi,
    "Custom Property": /--[^:]+:\s*[^;]+/gi,
  };

  for (const [cat, regex] of Object.entries(categories)) {
    const matches: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = regex.exec(styleText)) !== null) {
      matches.push(m[0].trim());
    }
    if (matches.length > 0) results[cat] = matches.slice(0, 5);
  }

  return results;
}

function generateCodeSnippets(
  $: cheerio.CheerioAPI,
  design: any,
  animations: any,
  html: string
): CodeSnippet[] {
  const snippets: CodeSnippet[] = [];

  // Extract hover effects
  const hoverRules = $("style")
    .map((_, el) => $(el).text())
    .get()
    .join("\n");
  const hoverMatches = hoverRules.match(/([^{]*:hover[^{]*\{[^}]*\})/g);
  if (hoverMatches && hoverMatches.length > 0) {
    snippets.push({
      title: "Hover Effects (Extracted)",
      language: "css",
      code: hoverMatches.slice(0, 3).join("\n\n"),
      description: "CSS hover state transitions extracted from the site's stylesheets.",
      source: "Inline stylesheets",
      category: "css",
    });
  }

  // Extract keyframes
  const keyframes = hoverRules.match(/@keyframes\s+[^{\s]+\s*\{[^}]+\}/g);
  if (keyframes && keyframes.length > 0) {
    snippets.push({
      title: "Keyframe Animations",
      language: "css",
      code: keyframes.slice(0, 3).join("\n\n"),
      description: "CSS @keyframe animations powering motion on this site.",
      source: "Stylesheets",
      category: "css",
    });
  }

  // Flexbox/Grid patterns
  const flexGrid = hoverRules.match(/display:\s*(flex|grid)[^;]*;/g);
  if (flexGrid && flexGrid.length > 0) {
    snippets.push({
      title: "Layout Pattern",
      language: "css",
      code: `.container {\n  ${flexGrid.slice(0, 3).join(";\n  ")};\n}`,
      description: "Layout system using Flexbox or Grid extracted from the site.",
      source: "CSS analysis",
      category: "css",
    });
  }

  // JS intersection observer pattern
  if (html.includes("IntersectionObserver")) {
    snippets.push({
      title: "Scroll Reveal (Intersection Observer)",
      language: "javascript",
      code: `const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));`,
      description: "Scroll-triggered reveal using IntersectionObserver — detected on this site.",
      source: "Reverse engineered from site behavior",
      category: "javascript",
    });
  }

  // 3D tilt card (if transforms detected)
  if (html.includes("perspective") || html.includes("rotateX") || html.includes("rotateY")) {
    snippets.push({
      title: "3D Perspective Card (Inspired)",
      language: "javascript",
      code: `// 3D tilt effect
const card = document.querySelector('.card');
card.addEventListener('mousemove', (e) => {
  const rect = card.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  card.style.transform = \`
    rotateX(\${y * -20}deg)
    rotateY(\${x * 20}deg)
  \`;
});
card.addEventListener('mouseleave', () => {
  card.style.transform = 'rotateX(0) rotateY(0)';
});`,
      description: "Inspired by the spatial depth effects found on this site. Adds a 3D tilt that follows the cursor.",
      source: "Reverse engineered from site behavior",
      category: "interaction",
    });
  }

  // Magnetic button (if detected)
  if (html.includes("magnet") || html.includes("magnetic") || html.includes("transform")) {
    snippets.push({
      title: "Magnetic Button Effect (Inspired)",
      language: "javascript",
      code: `// Magnetic pull effect
const btn = document.querySelector('.btn');
const container = btn.parentElement;
container.addEventListener('mousemove', (e) => {
  const rect = btn.getBoundingClientRect();
  const dx = e.clientX - (rect.left + rect.width / 2);
  const dy = e.clientY - (rect.top + rect.height / 2);
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 200) {
    btn.style.transform = \`translate(\${dx * 0.3}px, \${dy * 0.3}px)\`;
  } else {
    btn.style.transform = 'translate(0, 0)';
  }
});
container.addEventListener('mouseleave', () => {
  btn.style.transform = 'translate(0, 0)';
});`,
      description: "Magnetic attraction effect where UI elements pull toward the cursor — inspired by physics-based interactions on this site.",
      source: "Reverse engineered from site behavior",
      category: "interaction",
    });
  }

  return snippets;
}

function generateInteractionHighlights(
  $: cheerio.CheerioAPI,
  animations: any,
  html: string,
  design: any
): InteractionHighlight[] {
  const highlights: InteractionHighlight[] = [];

  if (animations.hoverEffects.length > 0) {
    const sampleHover = animations.hoverEffects[0]
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 200);
    highlights.push({
      name: "Custom Hover Interactions",
      description:
        "The site defines explicit hover states with transitions, suggesting deliberate micro-interactions on interactive elements.",
      codeSnippet: sampleHover,
      language: "css",
      isInnovative: animations.hoverEffects.length > 5,
    });
  }

  // Check for responsive design
  const mediaQueries =
    $("style")
      .map((_, el) => $(el).text())
      .get()
      .join("\n")
      .match(/@media[^{]+\{[^}]+/g) || [];
  if (mediaQueries.length > 0) {
    const firstMQ = mediaQueries[0] || "";
    highlights.push({
      name: "Responsive Adaptations",
      description: `Detected ${mediaQueries.length} media queries — the site adapts across viewport sizes.`,
      codeSnippet: firstMQ.substring(0, 150),
      language: "css",
      isInnovative: false,
    });
  }

  // Pseudo-element usage
  const pseudoElements =
    $("style")
      .map((_, el) => $(el).text())
      .get()
      .join("\n")
      .match(/::?(before|after|first-letter|first-line)/g) || [];
  if (pseudoElements.length > 0) {
    highlights.push({
      name: "Pseudo-Element Decorations",
      description: `Uses ${pseudoElements.length} pseudo-elements (::before/::after) for visual embellishments.`,
      codeSnippet: `/* ${pseudoElements.length} pseudo-elements found */\n.element::before {\n  content: '';\n  /* decorative styling */\n}`,
      language: "css",
      isInnovative: false,
    });
  }

  // Smooth scroll
  if (html.includes("scroll-behavior: smooth") || html.includes("scrollBehavior")) {
    highlights.push({
      name: "Smooth Scrolling",
      description: "Site uses smooth scrolling for a polished navigation experience.",
      codeSnippet: `html {\n  scroll-behavior: smooth;\n}`,
      language: "css",
      isInnovative: false,
    });
  }

  return highlights;
}

function generateOverview(
  $: cheerio.CheerioAPI,
  design: any,
  animations: any,
  ux: any,
  tech: string[],
  interactionHighlights: InteractionHighlight[]
) {
  const innovations: string[] = [];
  const uniqueFeatures: string[] = [];
  const problems: string[] = [];
  let score = 50;

  // Innovations
  if (animations.cssAnimations.length > 0) {
    innovations.push(`Custom ${animations.cssAnimations.length}+ CSS animations for visual flair`);
    score += 8;
  }
  if (animations.jsAnimations.length > 0) {
    innovations.push(`JavaScript-driven animation via ${animations.jsAnimations.join(", ")}`);
    score += 5;
  }
  if (interactionHighlights.some((h) => h.isInnovative)) {
    innovations.push("Unique hover/magnetic interaction patterns");
    score += 10;
  }
  if (design.colors.palette.length > 3) {
    innovations.push("Intentional color palette with contrast considerations");
    score += 5;
  }
  if (tech.includes("React") || tech.includes("Vue.js") || tech.includes("Svelte")) {
    innovations.push(`Built with ${tech[0]} — modern component architecture`);
    score += 8;
  }
  if (design.responsive) {
    innovations.push("Fully responsive across device sizes");
    score += 5;
  }
  if (ux.accessibility.score === "excellent" || ux.accessibility.score === "good") {
    innovations.push("Strong accessibility practices");
    score += 5;
  }
  if (ux.seo.ogTags) {
    innovations.push("Open Graph / social sharing tags present");
    score += 3;
  }

  // Unique features
  if (animations.scrollEffects.length > 0) {
    uniqueFeatures.push(`Scroll-driven narrative: ${animations.scrollEffects.join(", ")}`);
  }
  if (animations.performanceWarnings.filter((w: string) => w.includes("GPU")).length > 0) {
    uniqueFeatures.push("GPU-accelerated rendering for smooth motion");
  }
  if (design.typography.fonts.length > 0) {
    uniqueFeatures.push(`Custom type system: ${design.typography.fonts.join(", ")}`);
  }

  // Problems
  if (ux.seo.issues.length > 0) {
    problems.push(...ux.seo.issues.map((i: string) => `SEO: ${i}`));
    score -= 8;
  }
  if (ux.accessibility.issues.length > 0) {
    problems.push(...ux.accessibility.issues.slice(0, 3).map((i: string) => `A11y: ${i}`));
    score -= 6;
  }
  if (ux.performance.issues.length > 0) {
    problems.push(...ux.performance.issues.slice(0, 3));
    score -= 5;
  }
  if (design.designIssues.length > 0) {
    problems.push(...design.designIssues);
    score -= 5;
  }

  const titleText = $("title").text() || "Untitled";
  const descText = $('meta[name="description"]').attr("content") || "No description available";

  // Generate vibe
  const vibe =
    animations.cssAnimations.length > 3
      ? "Playful & Dynamic"
      : animations.cssTransitions.length > 5
        ? "Polished & Refined"
        : tech.length > 3
          ? "Tech-Forward"
          : "Minimal & Functional";

  return {
    summary: `${titleText}${descText ? ` — ${descText}` : ""}`,
    innovations,
    uniqueFeatures,
    problems,
    vibe,
    score: Math.max(0, Math.min(100, score)),
  };
}

export async function analyzeSite(url: string): Promise<AnalysisResult> {
  const parsed = new URL(url);
  const hostname = parsed.hostname;

  // Fetch the HTML
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Extract scripts
  const scripts = $("script[src]")
    .map((_, el) => $(el).attr("src") || "")
    .get()
    .concat(
      $("script:not([src])")
        .map((_, el) => $(el).html() || "")
        .get()
    );

  // Run all analyses
  const techList = detectFrameworks(html, scripts);
  const libs = detectLibraries(html, scripts);
  const analytics = detectAnalytics(html);
  const design = analyzeDesign($, html, libs);
  const animations = extractAnimations($, html);
  const ux = analyzeUX($, html);
  const extractedCSS = extractCSSProperties($);

  // Detect meta framework
  const metaFramework =
    html.includes("__NEXT_DATA__")
      ? "Next.js"
      : html.includes("__NUXT__")
        ? "Nuxt"
        : html.includes("sveltekit")
          ? "SvelteKit"
          : html.includes("gatsby")
            ? "Gatsby"
            : html.includes("astro")
              ? "Astro"
              : null;

  // Detect CSS preprocessor
  const cssPreprocessor =
    html.includes(".scss") || html.includes("sass")
      ? "Sass/SCSS"
      : html.includes(".less")
        ? "Less"
        : null;

  // Generate interaction highlights and code snippets
  const interactionHighlights = generateInteractionHighlights($, animations, html, design);
  const codeSnippets = generateCodeSnippets($, design, animations, html);

  // Overview
  const overview = generateOverview($, design, animations, ux, techList, interactionHighlights);

  return {
    url,
    hostname,
    title: $("title").text() || hostname,
    description: $('meta[name="description"]').attr("content") || null,
    overview,
    design,
    tech: {
      frameworks: techList,
      libraries: libs,
      metaFramework,
      cssPreprocessor,
      bundler: null,
      hosting: null,
      analytics,
      cdn: [],
      confidence: techList.length > 2 ? "high" : techList.length > 0 ? "medium" : "low",
    },
    interactions: animations,
    ux,
    interactionHighlights,
    codeSnippets,
    extractedCSS,
  };
}

function analyzeDesign($: cheerio.CheerioAPI, html: string, libs: string[]): any {
  const colors = extractColors($);
  const typography = extractTypography($);

  // Layout detection
  const styleText = $("style").map((_, el) => $(el).text()).get().join("\n");
  const layout =
    styleText.includes("display: grid") || styleText.includes("display:grid")
      ? "CSS Grid"
      : styleText.includes("display: flex") || styleText.includes("display:flex")
        ? "CSS Flexbox"
        : "Traditional (float/inline-block)";

  // Patterns
  const patterns: string[] = [];
  if (html.includes("bento") || html.includes("Bento")) patterns.push("Bento grid layout");
  if (html.includes("card") || $(".card").length > 0) patterns.push("Card-based layout");
  if (html.includes("sticky") || $("[class*='sticky']").length > 0) patterns.push("Sticky positioning");
  if (html.includes("parallax")) patterns.push("Parallax scrolling");
  if (html.includes("gradient") || html.includes("Gradient")) patterns.push("Gradient backgrounds");
  if (html.includes("glass") || html.includes("Glass") || html.includes("backdrop-filter"))
    patterns.push("Glassmorphism / backdrop blur");
  if (html.includes("clip-path")) patterns.push("Clip-path masking");
  if (html.includes("hero") || $("header").length > 0) patterns.push("Hero section");

  // Responsive
  const responsive = styleText.includes("@media") || html.includes("viewport");
  const cssFramework = libs.includes("Tailwind CSS")
    ? "Tailwind CSS"
    : libs.includes("Bootstrap")
      ? "Bootstrap"
      : null;

  // Design issues
  const designIssues = responsive ? [] : ["No responsive media queries detected"];

  return {
    layout,
    patterns,
    colors,
    typography,
    responsive,
    cssFramework,
    designHighlights: patterns,
    designIssues,
  };
}
