import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const supabaseOrigin = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
const supabaseWsOrigin = supabaseOrigin.replace(/^https/, "wss");

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: ${supabaseOrigin};
  font-src 'self' data:;
  connect-src 'self' ${supabaseOrigin} ${supabaseWsOrigin} https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Gamla WordPress-bloggen: index och kategoriarkiv finns inte kvar i
      // samma form, skicka vidare till nya artikellistan.
      { source: "/journal", destination: "/artiklar", permanent: true },
      { source: "/category/:slug", destination: "/artiklar", permanent: true },
      // Gamla inläggen låg på rotnivå (t.ex. /vad-kostar-en-logotyp/) och är
      // ersatta av nyskrivet innehåll under /artiklar/[slug] med andra slugs.
      // Enskilda gamla slugs har inget SEO-värde värt att mappa 1:1, men vi
      // fångar upp kända gamla inläggs-URL:er så de inte 404:ar rakt av.
      { source: "/10-tecken-pa-att-din-hemsida-kostar-dig-kunder", destination: "/artiklar", permanent: true },
      { source: "/elementor-vs-bricks-builder-2026", destination: "/artiklar", permanent: true },
      { source: "/hur-skriver-man-en-kravspecifikation", destination: "/artiklar", permanent: true },
      { source: "/hur-mycket-kostar-en-hemsida-2026", destination: "/artiklar", permanent: true },
      { source: "/minska-overgivna-varukorgar-i-din-e-handel", destination: "/artiklar", permanent: true },
      { source: "/rebranding-nar-ar-det-dags-att-fornya-varumarket", destination: "/artiklar", permanent: true },
      { source: "/lokal-seo-sa-blir-du-nummer-ett-i-din-stad", destination: "/artiklar", permanent: true },
      { source: "/varfor-valja-wordpress", destination: "/artiklar", permanent: true },
      { source: "/vad-ar-cro-konverteringsoptimering", destination: "/artiklar", permanent: true },
      { source: "/woocommerce-eller-shopify", destination: "/artiklar", permanent: true },
      { source: "/vad-kostar-en-logotyp", destination: "/artiklar", permanent: true },
      { source: "/vad-ar-en-grafisk-profil", destination: "/artiklar", permanent: true },
      { source: "/hur-lang-tid-tar-seo", destination: "/artiklar", permanent: true },
      { source: "/wordpress-eller-webflow-vad-ska-man-valja-2026", destination: "/artiklar", permanent: true },
    ];
  },
  images: {
    qualities: [75, 90, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hytpupilrqzkoxcmjnyu.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: cspHeader.replace(/\s{2,}/g, " ").trim() },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
