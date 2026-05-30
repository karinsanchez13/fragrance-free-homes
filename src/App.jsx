import { useState } from "react";

const SEARCH_TERMS = [
  "fragrance free", "fragrance-free", "unscented", "no perfume",
  "chemical sensitivity", "MCS", "multiple chemical sensitivity",
  "non-toxic", "VOC free", "VOC-free", "scent free", "scent-free",
];

const STATE_OPTIONS = [
  "All States","Alabama","Alaska","Arizona","Arkansas","California",
  "Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii",
  "Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana",
  "Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
  "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey",
  "New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma",
  "Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington",
  "West Virginia","Wisconsin","Wyoming"
];

const PRICE_OPTIONS = [
  "Any Price","Under $200k","$200k–$400k","$400k–$600k",
  "$600k–$800k","$800k–$1M","Over $1M"
];

const BED_OPTIONS = ["Any Beds","1+","2+","3+","4+","5+"];

export default function FragranceFreeSearch() {
  const [state, setState] = useState("All States");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("Any Price");
  const [beds, setBeds] = useState("Any Beds");
  const [extraTerms, setExtraTerms] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedIdx, setExpandedIdx] = useState(null);

  const buildQuery = () => {
    const loc = city.trim()
      ? `${city.trim()}${state !== "All States" ? ", " + state : ""}`
      : state !== "All States" ? state : "United States";
    const priceStr = price !== "Any Price" ? ` ${price} home` : " home for sale";
    const bedsStr = beds !== "Any Beds" ? ` ${beds} bedrooms` : "";
    const extra = extraTerms.trim() ? ` ${extraTerms.trim()}` : "";
    return `("fragrance free" OR "scent free" OR "chemical sensitivity" OR "non-toxic") real estate${priceStr}${bedsStr} ${loc}${extra} site:zillow.com OR site:realtor.com OR site:redfin.com OR site:trulia.com`;
  };

  const parseResults = (items) => {
    return (items || []).map(item => {
      const priceMatch = item.snippet?.match(/\$[\d,]+[kKmM]?/) || item.title?.match(/\$[\d,]+[kKmM]?/);
      const bedsMatch = item.snippet?.match(/(\d)\s*bed/i) || item.title?.match(/(\d)\s*bed/i);
      const bathsMatch = item.snippet?.match(/(\d\.?\d?)\s*bath/i) || item.title?.match(/(\d\.?\d?)\s*bath/i);
      let source = item.displayLink || "";
      if (source.includes("zillow")) source = "Zillow";
      else if (source.includes("realtor")) source = "Realtor.com";
      else if (source.includes("redfin")) source = "Redfin";
      else if (source.includes("trulia")) source = "Trulia";
      else if (source.includes("homes")) source = "Homes.com";
      return {
        title: item.title || "Listing",
        price: priceMatch ? priceMatch[0] : "Price not listed",
        beds: bedsMatch ? bedsMatch[1] : "?",
        baths: bathsMatch ? bathsMatch[1] : "?",
        location: item.displayLink || "",
        url: item.link || "#",
        snippet: item.snippet || "No description available.",
        source,
      };
    });
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    setExpandedIdx(null);
    try {
      const q = buildQuery();
      const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResults(parseResults(data.results));
    } catch (err) {
      setError(err.message || "Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f0eb",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#2a2118"
    }}>
      {/* Header */}
      <div style={{
        background: "#2a2118", color: "#f5f0eb",
        padding: "2.5rem 2rem 2rem", textAlign: "center",
        borderBottom: "4px solid #8a6f4e"
      }}>
        <div style={{ fontSize: "0.8rem", letterSpacing: "0.3em", color: "#c9a87c", marginBottom: "0.5rem", textTransform: "uppercase" }}>
          Nationwide Listing Search
        </div>
        <h1 style={{ margin: 0, fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: "normal", letterSpacing: "0.02em" }}>
          🌿 Fragrance-Free Home Finder
        </h1>
        <p style={{ margin: "0.75rem 0 0", color: "#b8a090", fontSize: "0.95rem", maxWidth: "520px", marginLeft: "auto", marginRight: "auto" }}>
          Search listings nationwide for homes described as fragrance-free, scent-free, or chemical sensitivity–friendly — no geographic lock-in.
        </p>
      </div>

      <div style={{ maxWidth: "720px", margin: "2rem auto", padding: "0 1rem" }}>
        {/* Search Panel */}
        <div style={{
          background: "#fff", borderRadius: "4px", padding: "2rem",
          border: "1px solid #d9cfc4", boxShadow: "0 2px 12px rgba(42,33,24,0.08)"
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={labelStyle}>City / Area (optional)</label>
              <input value={city} onChange={e => setCity(e.target.value)}
                placeholder="e.g. Boise, San Diego..." style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>State</label>
              <select value={state} onChange={e => setState(e.target.value)} style={inputStyle}>
                {STATE_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Price Range</label>
              <select value={price} onChange={e => setPrice(e.target.value)} style={inputStyle}>
                {PRICE_OPTIONS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Min Bedrooms</label>
              <select value={beds} onChange={e => setBeds(e.target.value)} style={inputStyle}>
                {BED_OPTIONS.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>Additional Keywords (optional)</label>
            <input value={extraTerms} onChange={e => setExtraTerms(e.target.value)}
              placeholder="e.g. rural, well water, no carpet, new construction..."
              style={inputStyle} />
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <div style={{ fontSize: "0.75rem", color: "#8a6f4e", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Searching listings mentioning:
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {SEARCH_TERMS.slice(0, 8).map(t => (
                <span key={t} style={{
                  background: "#f0e8dc", border: "1px solid #c9a87c",
                  borderRadius: "2px", padding: "0.2rem 0.5rem",
                  fontSize: "0.72rem", color: "#5a4030"
                }}>{t}</span>
              ))}
              <span style={{
                background: "#e8f0e8", border: "1px solid #7aa87a",
                borderRadius: "2px", padding: "0.2rem 0.5rem",
                fontSize: "0.72rem", color: "#2a502a"
              }}>+ more</span>
            </div>
          </div>

          <button onClick={handleSearch} disabled={loading} style={{
            width: "100%", background: loading ? "#b8a090" : "#2a2118",
            color: "#f5f0eb", border: "none", borderRadius: "3px",
            padding: "0.9rem", fontSize: "1rem", letterSpacing: "0.08em",
            textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit", transition: "background 0.2s"
          }}>
            {loading ? "🔍 Searching nationwide listings…" : "Search All States"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "#fde8e8", border: "1px solid #e0a0a0",
            borderRadius: "4px", padding: "1rem", marginTop: "1.5rem",
            color: "#8a2020", fontSize: "0.9rem"
          }}>
            {error}
          </div>
        )}

        {/* Results */}
        {results !== null && (
          <div style={{ marginTop: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "normal", color: "#2a2118" }}>
                {results.length === 0 ? "No listings found" : `${results.length} listing${results.length !== 1 ? "s" : ""} found`}
              </h2>
              {results.length > 0 && <span style={{ fontSize: "0.8rem", color: "#8a6f4e" }}>Tap a listing to expand</span>}
            </div>

            {results.length === 0 && (
              <div style={{
                background: "#fff", borderRadius: "4px", padding: "2rem",
                textAlign: "center", border: "1px solid #d9cfc4", color: "#8a6f4e"
              }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏡</div>
                <p style={{ margin: 0 }}>No fragrance-free listings found. Try a broader location or fewer filters — these listings are rare but they exist!</p>
              </div>
            )}

            {results.map((r, i) => (
              <div key={i} onClick={() => setExpandedIdx(expandedIdx === i ? null : i)} style={{
                background: "#fff", border: "1px solid #d9cfc4",
                borderLeft: "4px solid #8a6f4e", borderRadius: "3px",
                padding: "1rem 1.25rem", marginBottom: "0.75rem",
                cursor: "pointer", transition: "box-shadow 0.15s",
                boxShadow: expandedIdx === i ? "0 4px 16px rgba(42,33,24,0.12)" : "none"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: "0.95rem", marginBottom: "0.2rem" }}>{r.title}</div>
                    <div style={{ color: "#5a4030", fontSize: "0.85rem" }}>📍 {r.location}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ color: "#2a6020", fontWeight: "bold", fontSize: "1.05rem" }}>{r.price}</div>
                    <div style={{ color: "#8a6f4e", fontSize: "0.8rem" }}>{r.beds} bd · {r.baths} ba</div>
                  </div>
                </div>

                {expandedIdx === i && (
                  <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid #e8e0d5" }}>
                    <p style={{ margin: "0 0 0.75rem", fontSize: "0.875rem", lineHeight: "1.6", color: "#3a2e24", fontStyle: "italic" }}>
                      "{r.snippet}"
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.75rem", color: "#8a6f4e" }}>via {r.source}</span>
                      {r.url && r.url !== "#" && (
                        <a href={r.url} target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()} style={{
                            background: "#2a2118", color: "#f5f0eb",
                            textDecoration: "none", padding: "0.35rem 0.85rem",
                            borderRadius: "2px", fontSize: "0.8rem", letterSpacing: "0.05em"
                          }}>
                          View Listing →
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", padding: "2rem 0 1rem", color: "#b8a090", fontSize: "0.78rem" }}>
          Results sourced from public real estate listings · Always verify details with the listing agent
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block", fontSize: "0.75rem", textTransform: "uppercase",
  letterSpacing: "0.1em", color: "#8a6f4e", marginBottom: "0.35rem"
};

const inputStyle = {
  width: "100%", padding: "0.55rem 0.75rem", border: "1px solid #d9cfc4",
  borderRadius: "3px", fontSize: "0.9rem", fontFamily: "Georgia, serif",
  background: "#faf7f4", color: "#2a2118", boxSizing: "border-box", outline: "none"
};
