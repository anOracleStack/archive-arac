"use client";

import { useState, useCallback, type FC } from "react";

interface Props {
  code: string;
  language: string;
}

export const CodeBlock: FC<Props> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code]);

  return (
    <div className="relative group">
      <div className="flex items-center justify-between px-4 py-2 bg-[#2C2A29] rounded-t-xl border-b border-[#5A5653]/30">
        <span className="text-[10px] font-mono text-[#D1CEC7] uppercase tracking-wider">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-white/10 text-[#D1CEC7] hover:bg-white/20 hover:text-white transition-all"
        >
          {copied ? (
            <>
              <svg className="w-3 h-3 text-[#8BA896]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="bg-[#2C2A29] rounded-b-xl p-4 overflow-x-auto">
        <code className="text-sm font-mono text-[#8BA896] leading-relaxed whitespace-pre">{code}</code>
      </pre>
    </div>
  );
};
