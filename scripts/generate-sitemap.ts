import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_URL } from "../src/lib/seo";

const __dirname = dirname(fileURLToPath(import.meta.url));
const today = new Date().toISOString().slice(0, 10);

const propertySlugs = [
  "sage-and-salt",
  "sky-and-sea",
  "10-seaview-close",
];

const entries = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/properties", priority: "0.9", changefreq: "weekly" },
  ...propertySlugs.map((slug) => ({ path: `/properties/${slug}`, priority: "0.9", changefreq: "weekly" })),
  { path: "/guide", priority: "0.7", changefreq: "monthly" },
  { path: "/booking-policy", priority: "0.5", changefreq: "yearly" },
  { path: "/contact", priority: "0.5", changefreq: "yearly" },
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((e) => `  <url>
    <loc>${SITE_URL}${e.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;

const out = resolve(__dirname, "../public/sitemap.xml");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, xml, "utf8");
console.log(`Wrote ${out} with ${entries.length} URLs`);
