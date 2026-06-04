type FeatureExplainerProps = {
  whatThisIs: string;
  youCan: string | string[];
  title?: string;
  youCanTitle?: string;
  className?: string;
};

export function FeatureExplainer({
  whatThisIs,
  youCan,
  title = "What this is",
  youCanTitle = "You can",
  className = "",
}: FeatureExplainerProps) {
  const bullets = Array.isArray(youCan) ? youCan : [youCan];

  return (
    <aside
      className={`mx-auto max-w-2xl w-full text-left rounded-2xl border border-[#C4A882]/35 bg-[#F9F7F3]/90 px-5 py-4 sm:px-6 sm:py-5 ${className}`}
      aria-label="Feature overview"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9C7C5B] mb-2">
        {title}
      </p>
      <p className="text-sm text-[#5A5653] leading-relaxed mb-4">{whatThisIs}</p>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9C7C5B] mb-2">
        {youCanTitle}
      </p>
      <ul className="space-y-1.5 text-sm text-[#2C2A29]">
        {bullets.map((item) => (
          <li key={item} className="flex gap-2 leading-relaxed">
            <span className="text-[#8BA896] shrink-0" aria-hidden>
              ·
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
