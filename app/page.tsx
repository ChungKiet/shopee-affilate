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

function LinkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function PasteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [affiliateLink, setAffiliateLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string) => {
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
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, []);

  const pasteFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard?.readText();
      if (text) setUrl(text);
    } catch {}
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setAffiliateLink(null);
    if (!url.trim()) {
      setError("Vui lòng dán link Shopee vào ô trên.");
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({ url: url.trim() });
      const res = await fetch(`/api/convert?${params}`);
      const data: ApiResponse = await res.json();
      if (!res.ok) {
        setError(data.error || "Có lỗi xảy ra.");
        return;
      }
      if (data.success && data.affiliateLinks?.length) {
        setAffiliateLink(data.affiliateLinks[0].affiliate_link);
      } else {
        setError(data.error || "Không có affiliate link trong kết quả.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi kết nối.");
    } finally {
      setLoading(false);
    }
  }

  const facebookPostUrl = process.env.NEXT_PUBLIC_FACEBOOK_POST_URL || "#";

  return (
    <div className="wrap">
      <header className="header">
        <h1 className="title">
          <span className="title-icon" aria-hidden>
            <LinkIcon />
          </span>
          Tạo Link Shopee
        </h1>
        <p className="domain">na.shpee.cc</p>
      </header>

      <main className="card">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="url">Link sản phẩm Shopee</label>
            <div className="input-wrap">
              <input
                id="url"
                type="url"
                placeholder="Dán link Shopee vào đây..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
                className="input"
              />
              <button
                type="button"
                className="paste-btn"
                onClick={pasteFromClipboard}
                aria-label="Dán từ clipboard"
                title="Dán link"
              >
                <PasteIcon />
              </button>
            </div>
          </div>

          {affiliateLink && (
            <div className="result-box">
              <p className="result-label">Link affiliate</p>
              <div className="result-bubble">
                <span className="result-url">{affiliateLink}</span>
                <button
                  type="button"
                  className="copy-link-btn"
                  onClick={() => copyToClipboard(affiliateLink)}
                  aria-label="Copy link"
                >
                  {copied ? "Đã copy" : "Copy Link"}
                </button>
              </div>
            </div>
          )}

          {loading && <p className="loading">Đang tạo link...</p>}
          {error && <div className="error">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Đang xử lý..." : "Tạo link"}
          </button>
        </form>

        <section className="guide">
          <h2 className="guide-title">
            <InfoIcon />
            Hướng dẫn
          </h2>
          <ol className="guide-steps">
            <li>Sau khi tạo link, nhấn Copy Link.</li>
            <li>Dán link dưới bình luận bài đăng này.</li>
            <li>Click vào link để mở Shopee sẽ nhận được mã.</li>
          </ol>
          <a
            href={facebookPostUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="facebook-btn"
          >
            <FacebookIcon />
            Đến bài đăng Facebook
            <ArrowIcon />
          </a>
        </section>

        <section className="discount">
          <h2 className="discount-title">Chi tiết Mã giảm giá</h2>
          <div className="discount-card">
            <div className="discount-brand">
              <FacebookIcon />
              <span>Facebook</span>
            </div>
            <div className="discount-body">
              <p className="discount-desc">giảm 25% Giảm tối đa 200k₫</p>
              <p className="discount-min">Đơn tối thiểu 50k₫</p>
              <span className="discount-tag">Độc Quyền Facebook</span>
              <p className="discount-meta">Đã dùng 51% - hết hạn trong: Còn 1 ngày</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
