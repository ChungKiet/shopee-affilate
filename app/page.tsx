"use client";

import { useState, useCallback } from "react";

type AffiliateItem = {
  affiliate_id: string;
  affiliate_link: string;
};

type ApiResponse = {
  success: boolean;
  url?: string;
  affiliateLinks?: AffiliateItem[];
  error?: string;
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [affiliateId, setAffiliateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [affiliateLinks, setAffiliateLinks] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = useCallback(async (text: string, index: number) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      setCopiedIndex(null);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setAffiliateLinks([]);
    if (!url.trim() || !affiliateId.trim()) {
      setError("Vui lòng nhập URL và Affiliate ID.");
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({
        url: url.trim(),
        affiliate_id: affiliateId.trim(),
      });
      const res = await fetch(`/api/convert?${params}`);
      const data: ApiResponse = await res.json();
      if (!res.ok) {
        setError(data.error || "Có lỗi xảy ra.");
        return;
      }
      if (data.success && data.affiliateLinks?.length) {
        setAffiliateLinks(
          data.affiliateLinks.map((item) => item.affiliate_link)
        );
      } else {
        setAffiliateLinks([]);
        setError(data.error || "Không có affiliate link trong kết quả.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi kết nối.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>Affiliate Link Generator</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="url">URL</label>
          <input
            id="url"
            type="url"
            placeholder="https://vn.shp.ee/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="affiliate_id">Affiliate ID</label>
          <input
            id="affiliate_id"
            type="text"
            placeholder="17360460223"
            value={affiliateId}
            onChange={(e) => setAffiliateId(e.target.value)}
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Đang xử lý..." : "Tạo link"}
        </button>
      </form>

      {loading && <p className="loading">Đang gọi API...</p>}
      {error && <div className="error">{error}</div>}
      {affiliateLinks.length > 0 && (
        <div className="result">
          <h2>Affiliate link</h2>
          {affiliateLinks.map((link, i) => (
            <div key={i} className="result-row">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="result-link"
              >
                {link}
              </a>
              <button
                type="button"
                className="copy-btn"
                onClick={() => copyToClipboard(link, i)}
                aria-label="Copy link"
                title="Copy link"
              >
                {copiedIndex === i ? "Đã copy" : "Copy"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
