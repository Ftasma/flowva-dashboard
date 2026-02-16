import "dotenv/config";
import fs from "fs";

interface Blog {
  id: string;
  created_at?: string;
}

async function fetchBlogs(): Promise<Blog[]> {
    
  const url = `${process.env.VITE_SUPABASE_URL}/functions/v1/get-all-blogs`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: process.env.VITE_SUPABASE_ANON_KEY as string,
    },
    body: JSON.stringify({ limit: 1000 }), // adjust limit if needed
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to fetch blogs: ${errText}`);
  }

  const data = await res.json();

  // Your endpoint likely returns { blogs: [...] }
  return data.blogs || [];
}

async function generateSitemap() {
  console.log("⏳ Generating sitemap...");

  const blogs = await fetchBlogs();

  const today = new Date().toISOString().split("T")[0];

  const staticUrls = `
  <url>
    <loc>https://flowvahub.com/</loc>
    <lastmod>${today}</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://flowvahub.com/about</loc>
    <lastmod>${today}</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://flowvahub.com/blog</loc>
    <lastmod>${today}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://flowvahub.com/contact</loc>
    <lastmod>${today}</lastmod>
    <priority>0.7</priority>
  </url>`;

  const blogUrls = blogs
    .map(
      (b) => `
  <url>
    <loc>https://flowvahub.com/blog/${b.id}</loc>
    <lastmod>${new Date(b.created_at || today).toISOString()}</lastmod>
    <priority>0.8</priority>
  </url>`
    )
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls}
  ${blogUrls}
</urlset>`;

  fs.writeFileSync("./public/sitemap.xml", sitemap.trim());
  console.log(`✅ Sitemap generated successfully with ${blogs.length} blogs`);
}

generateSitemap().catch((err) => {
  console.error("❌ Sitemap generation failed:", err);
  process.exit(1);
});
