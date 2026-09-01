"use client";

import { useState } from "react";

// Rendered inside a sandboxed iframe with no `allow-scripts`/`allow-same-origin`
// tokens — the sender's HTML can't run script or reach this page's cookies/
// session, which matters since this is untrusted external content.
export function EmailHtmlView({ html }: { html: string }) {
  const [height, setHeight] = useState(200);

  return (
    <iframe
      title="Mejlinnehåll"
      sandbox=""
      srcDoc={html}
      style={{ height }}
      className="w-full rounded-lg border border-bone/10 bg-bone"
      onLoad={(event) => {
        try {
          const doc = event.currentTarget.contentDocument;
          if (doc) setHeight(Math.min(doc.documentElement.scrollHeight + 24, 1200));
        } catch {
          // Sandboxed cross-origin-like access can throw in some browsers —
          // fall back to the default height.
        }
      }}
    />
  );
}
