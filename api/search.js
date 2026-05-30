export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Missing query" });

  const sites = [
    "zillow.com", "realtor.com", "redfin.com", "trulia.com",
    "homes.com", "airbnb.com", "loopnet.com",
    "greenhomesforsale.com", "environmentallysaferhomes.com", "sensitiverentals.com"
  ];

  const siteQuery = sites.map(s => `site:${s}`).join(" OR ");
  const fullQuery = `(${q}) (${siteQuery})`;

  try {
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(fullQuery)}`;
    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      }
    });

    const html = await response.text();
    const results = [];
    const linkRegex = /href="(https?:\/\/(?:www\.)?(?:zillow|realtor|redfin|trulia|homes|airbnb|loopnet|greenhomesforsale|environmentallysaferhomes|sensitiverentals)[^"]+)"/g;
    const titleRegex = /<a class="result__a"[^>]*>([^<]+)<\/a>/g;
    const snippetRegex = /<a class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g;

    const links = [...html.matchAll(linkRegex)].map(m => m[1]);
    const titles = [...html.matchAll(titleRegex)].map(m => m[1].trim());
    const snippets = [...html.matchAll(snippetRegex)].map(m => m[1].replace(/<[^>]+>/g, "").trim());

    for (let i = 0; i < Math.min(links.length, 10); i++) {
      try {
        results.push({
          title: titles[i] || "Listing",
          link: links[i],
          snippet: snippets[i] || "",
          displayLink: new URL(links[i]).hostname,
        });
      } catch(e) {}
    }

    res.status(200).json({ results });
  } catch (err) {
    res.status(500).json({ error: "Search failed. Please try again." });
  }
}
