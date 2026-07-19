/**
 * Markdown for Agents fallback (zone Free cannot enable CF content_converter).
 * When Accept prefers text/markdown, convert HTML responses to markdown.
 */
function prefersMarkdown(accept) {
  if (!accept) return false;
  const parts = accept.split(',').map((p) => {
    const [type, ...params] = p.trim().split(';');
    let q = 1;
    for (const param of params) {
      const m = param.trim().match(/^q=([0-9.]+)$/i);
      if (m) q = Number(m[1]);
    }
    return { type: type.trim().toLowerCase(), q };
  });
  parts.sort((a, b) => b.q - a.q);
  for (const p of parts) {
    if (p.type === 'text/markdown' || p.type === 'text/x-markdown') return true;
    if (p.type === 'text/html' || p.type === 'application/xhtml+xml') return false;
    if (p.type === '*/*') return false;
  }
  return false;
}

function htmlToMarkdown(html) {
  let s = html;
  // drop scripts/styles/nav/footer noise
  s = s.replace(/<script[\s\S]*?<\/script>/gi, '');
  s = s.replace(/<style[\s\S]*?<\/style>/gi, '');
  s = s.replace(/<!--([\s\S]*?)-->/g, '');

  const title = (s.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1] || '';
  const desc =
    (s.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || [])[1] ||
    (s.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i) || [])[1] ||
    '';
  const jsonLd = [...s.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(
    (m) => m[1].trim(),
  );

  // Keep main content when possible
  const main = s.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  if (main) s = main[1];

  s = s.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n');
  s = s.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n');
  s = s.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n');
  s = s.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n#### $1\n');
  s = s.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n');
  s = s.replace(/<br\s*\/?>/gi, '\n');
  s = s.replace(/<\/p>/gi, '\n\n');
  s = s.replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');
  s = s.replace(/<strong\b[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**');
  s = s.replace(/<b\b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**');
  s = s.replace(/<em\b[^>]*>([\s\S]*?)<\/em>/gi, '*$1*');
  s = s.replace(/<[^>]+>/g, '');
  s = s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  s = s.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

  const front = ['---'];
  if (title) front.push(`title: ${JSON.stringify(title.trim())}`);
  if (desc) front.push(`description: ${JSON.stringify(desc.trim())}`);
  front.push('---', '');
  let out = `${front.join('\n')}${s}\n`;
  if (jsonLd.length) {
    out += `\n\`\`\`json\n${jsonLd.join('\n')}\n\`\`\`\n`;
  }
  return out;
}

export async function onRequest(context) {
  const { request, next } = context;
  const accept = request.headers.get('accept') || '';
  if (!prefersMarkdown(accept)) {
    return next();
  }

  // Don't convert API / well-known machine payloads
  const path = new URL(request.url).pathname;
  if (
    path.startsWith('/api/') ||
    path.startsWith('/mcp') ||
    path.startsWith('/.well-known/') ||
    path.endsWith('.json') ||
    path.endsWith('.txt') ||
    path.endsWith('.md') ||
    path.endsWith('.xml') ||
    path.endsWith('.js') ||
    path.endsWith('.css') ||
    path.endsWith('.webp')
  ) {
    return next();
  }

  const res = await next();
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('text/html')) return res;

  const html = await res.text();
  const md = htmlToMarkdown(html);
  const tokens = Math.max(1, Math.ceil(md.length / 4));
  const headers = new Headers(res.headers);
  headers.set('content-type', 'text/markdown; charset=utf-8');
  headers.set('vary', 'accept');
  headers.set('x-markdown-tokens', String(tokens));
  headers.delete('content-length');
  return new Response(md, { status: res.status, headers });
}
