const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://bombay-bureau.vercel.app";

type NewsletterPost = {
  title?: string;
  slug?: { current?: string };
  excerpt?: string;
};

type NewsletterIssue = {
  title?: string;
  subject?: string;
  previewText?: string;
  intro?: string;
  body?: string;
  featuredPosts?: NewsletterPost[];
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function paragraphHtml(value?: string) {
  if (!value) return "";
  return value
    .split(/\n\s*\n/)
    .map((paragraph) => `<p style="margin:0 0 18px;color:#444;line-height:1.7;">${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`)
    .join("");
}

export function renderNewsletterHtml(issue: NewsletterIssue) {
  const stories = (issue.featuredPosts || [])
    .filter((post) => post.title && post.slug?.current)
    .slice(0, 6)
    .map((post) => {
      const href = `${siteUrl}/article/${post.slug!.current}`;
      return `
        <article style="border-top:1px solid #e5e5e5;padding:22px 0;">
          <h2 style="margin:0 0 8px;font:700 22px/1.25 Georgia,serif;">
            <a href="${href}" style="color:#111;text-decoration:none;">${escapeHtml(post.title!)}</a>
          </h2>
          ${post.excerpt ? `<p style="margin:0;color:#666;line-height:1.6;">${escapeHtml(post.excerpt)}</p>` : ""}
          <p style="margin:12px 0 0;font:600 11px/1.4 Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;">
            <a href="${href}" style="color:#555;text-decoration:none;">Read story →</a>
          </p>
        </article>`;
    })
    .join("");

  return `<!doctype html>
<html>
  <body style="margin:0;background:#f5f5f5;color:#111;font-family:Arial,sans-serif;">
    <div style="max-width:680px;margin:0 auto;padding:28px 18px;">
      <div style="background:#111;color:#fff;padding:28px 26px;">
        <p style="margin:0 0 8px;font:700 11px/1.4 Arial,sans-serif;letter-spacing:.2em;">BOMBAY BUREAU</p>
        <h1 style="margin:0;font:700 34px/1.1 Georgia,serif;">The Bombay Brief</h1>
        ${issue.previewText ? `<p style="margin:12px 0 0;color:#bbb;line-height:1.5;">${escapeHtml(issue.previewText)}</p>` : ""}
      </div>

      <div style="background:#fff;padding:30px 26px;">
        ${paragraphHtml(issue.intro)}
        ${stories}
        ${paragraphHtml(issue.body)}
      </div>

      <div style="padding:20px 8px;color:#777;font:12px/1.6 Arial,sans-serif;">
        <p style="margin:0 0 8px;">BOMBAY BUREAU · Global affairs, Indian perspective</p>
        <p style="margin:0;">You are receiving this because you subscribed to The Bombay Brief.</p>
        <p style="margin:10px 0 0;">{{{RESEND_UNSUBSCRIBE_URL}}}</p>
      </div>
    </div>
  </body>
</html>`;
}
