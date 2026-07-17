#!/usr/bin/env node
/**
 * Strip inline style="" across FR + EN HTML → utility classes.
 * Also removes stale FR flat blog-*.html when /blog/slug/ exists.
 */
const fs = require('fs');
const path = require('path');

const ROOTS = [
  path.resolve(__dirname, '..'), // FR when run from monsieur-click-V2/scripts
];

// Allow passing roots as args
const args = process.argv.slice(2);
const targets = args.length
  ? args.map((a) => path.resolve(a))
  : ROOTS;

const REPLACEMENTS = [
  // Exact attribute replacements (order matters for longer first)
  [' style="padding-top:0"', ''], // will add class via smarter pass
  [' style="max-width:820px"', ''],
  [' style="max-width:820px;margin-top:2rem"', ''],
  [' style="max-width:820px;margin-bottom:20px"', ''],
  [' style="max-width:820px;padding:0"', ''],
  [' style="max-width:960px"', ''],
  [' style="margin-bottom:14px"', ''],
  [' style="color:#fff;text-decoration:underline"', ''],
  [' style="color:var(--cyan-2)"', ''],
  [' style="display:none"', ''],
  [' style="text-align:center"', ''],
  [' style="margin-top:8px"', ''],
  [' style="margin-top:12px"', ''],
  [' style="margin-top:14px"', ''],
  [' style="margin-top:22px"', ''],
  [' style="margin-top:26px"', ''],
  [' style="margin-top:28px"', ''],
  [' style="margin-top:30px"', ''],
  [' style="margin-top:38px"', ''],
  [' style="margin-top:44px"', ''],
  [' style="margin-top:24px"', ''],
  [' style="margin-top:1.2rem"', ''],
  [' style="margin-bottom:6px"', ''],
  [' style="margin-bottom:20px"', ''],
  [' style="margin-bottom:32px"', ''],
  [' style="margin-bottom:40px"', ''],
  [' style="margin-top:22px;font-size:.9rem"', ''],
  [' style="margin:16px auto 0;max-width:720px;font-size:.9rem"', ''],
  [' style="margin-top:8px;font-size:.95rem"', ''],
  [' style="margin-top:14px;font-size:.98rem"', ''],
  [' style="margin-top:26px;display:flex;gap:14px;flex-wrap:wrap"', ''],
  [' style="font-size:1.7rem;margin-bottom:18px"', ''],
  [' style="font-size:clamp(1.9rem,3.6vw,2.6rem);margin-bottom:16px"', ''],
  [' style="display:flex;align-items:baseline;gap:16px;margin-bottom:10px"', ''],
  [' style="font-weight:700;color:var(--orange-2)"', ''],
  [' style="margin:28px 0 12px;text-transform:uppercase;letter-spacing:.1em;font-size:.8rem;color:var(--muted)"', ''],
  [' style="width:100%;height:620px;border:none;border-radius:8px"', ''],
  [' style="width:100%;border:none;overflow:hidden;min-height:720px"', ''],
  [' style="width:0%"', ''],
  [' style="width:100%;border-collapse:collapse;margin-top:8px"', ''],
  [' style="background:#0f3460;color:#fff"', ''],
  [' style="padding:10px;border-bottom:1px solid #ddd"', ''],
  [' style="padding:10px;text-align:left"', ''],
];

/** Add a class to an opening tag if missing */
function addClass(tagOpen, className) {
  if (new RegExp(`\\bclass="[^"]*\\b${className}\\b`).test(tagOpen)) return tagOpen;
  if (/class="/.test(tagOpen)) {
    return tagOpen.replace(/class="/, `class="${className} `);
  }
  return tagOpen.replace(/^<([a-z0-9-]+)/i, `<$1 class="${className}"`);
}

function transform(html) {
  let out = html;

  // Structural replacements with class injection
  const patterns = [
    // sections with padding-top:0
    {
      re: /<(section|div)([^>]*?)\sstyle="padding-top:0"([^>]*)>/g,
      cls: 'u-section-tight',
    },
    {
      re: /<(div)([^>]*?)\sstyle="max-width:820px"([^>]*)>/g,
      cls: 'u-wrap-820',
    },
    {
      re: /<(div)([^>]*?)\sstyle="max-width:820px;margin-top:2rem"([^>]*)>/g,
      cls: 'u-wrap-820 u-mt-lg',
    },
    {
      re: /<(div)([^>]*?)\sstyle="max-width:820px;margin-bottom:20px"([^>]*)>/g,
      cls: 'u-wrap-820-mb',
    },
    {
      re: /<(div)([^>]*?)\sstyle="max-width:820px;padding:0"([^>]*)>/g,
      cls: 'u-wrap-820-tight',
    },
    {
      re: /<(div)([^>]*?)\sstyle="max-width:960px"([^>]*)>/g,
      cls: 'u-wrap-960',
    },
    {
      re: /<(a)([^>]*?)\sstyle="margin-bottom:14px"([^>]*)>/g,
      cls: 'u-logo-foot',
    },
    {
      re: /<(a)([^>]*?)\sstyle="color:#fff;text-decoration:underline"([^>]*)>/g,
      cls: 'u-link-white',
    },
    {
      re: /<(a|span|p|strong)([^>]*?)\sstyle="color:var\(--cyan-2\)"([^>]*)>/g,
      cls: 'u-text-cyan',
    },
    {
      re: /<(div|p|section)([^>]*?)\sstyle="display:none"([^>]*)>/g,
      cls: 'u-hidden',
    },
    {
      re: /<(div)([^>]*?)\sstyle="text-align:center"([^>]*)>/g,
      cls: 'u-text-center-wrap',
    },
    {
      re: /<(div|p)([^>]*?)\sstyle="margin-top:8px"([^>]*)>/g,
      cls: 'u-mt-8',
    },
    {
      re: /<(div|p)([^>]*?)\sstyle="margin-top:12px"([^>]*)>/g,
      cls: 'u-mt-12',
    },
    {
      re: /<(div|p)([^>]*?)\sstyle="margin-top:14px"([^>]*)>/g,
      cls: 'u-mt-14',
    },
    {
      re: /<(div|p)([^>]*?)\sstyle="margin-top:22px"([^>]*)>/g,
      cls: 'u-mt-22',
    },
    {
      re: /<(div|p)([^>]*?)\sstyle="margin-top:26px"([^>]*)>/g,
      cls: 'u-mt-26',
    },
    {
      re: /<(div|p)([^>]*?)\sstyle="margin-top:28px"([^>]*)>/g,
      cls: 'u-mt-28',
    },
    {
      re: /<(div|p)([^>]*?)\sstyle="margin-top:30px"([^>]*)>/g,
      cls: 'u-mt-30',
    },
    {
      re: /<(div|p)([^>]*?)\sstyle="margin-top:38px"([^>]*)>/g,
      cls: 'u-mt-38',
    },
    {
      re: /<(div|p)([^>]*?)\sstyle="margin-top:44px"([^>]*)>/g,
      cls: 'u-mt-44',
    },
    {
      re: /<(div|p|h2)([^>]*?)\sstyle="margin-top:24px"([^>]*)>/g,
      cls: 'u-mt-24',
    },
    {
      re: /<(div)([^>]*?)\sstyle="margin-top:1\.2rem"([^>]*)>/g,
      cls: 'u-mt-md',
    },
    {
      re: /<(h3|p|div)([^>]*?)\sstyle="margin-bottom:6px"([^>]*)>/g,
      cls: 'u-mb-6',
    },
    {
      re: /<(p|div)([^>]*?)\sstyle="margin-bottom:20px"([^>]*)>/g,
      cls: 'u-mb-md',
    },
    {
      re: /<(h3|div)([^>]*?)\sstyle="margin-bottom:32px"([^>]*)>/g,
      cls: 'u-mb-32',
    },
    {
      re: /<(div)([^>]*?)\sstyle="margin-bottom:40px"([^>]*)>/g,
      cls: 'u-mb-40',
    },
    {
      re: /<(p|div)([^>]*?)\sstyle="margin-top:22px;font-size:\.9rem"([^>]*)>/g,
      cls: 'u-note-center-22',
    },
    {
      re: /<(p|div)([^>]*?)\sstyle="margin:16px auto 0;max-width:720px;font-size:\.9rem"([^>]*)>/g,
      cls: 'u-note-center',
    },
    {
      re: /<(p|div)([^>]*?)\sstyle="margin-top:8px;font-size:\.95rem"([^>]*)>/g,
      cls: 'u-mt-8 u-text-95',
    },
    {
      re: /<(p|div)([^>]*?)\sstyle="margin-top:14px;font-size:\.98rem"([^>]*)>/g,
      cls: 'u-mt-14 u-text-98',
    },
    {
      re: /<(div)([^>]*?)\sstyle="margin-top:26px;display:flex;gap:14px;flex-wrap:wrap"([^>]*)>/g,
      cls: 'u-hero-cta-row',
    },
    {
      re: /<(h2)([^>]*?)\sstyle="font-size:1\.7rem;margin-bottom:18px"([^>]*)>/g,
      cls: 'u-h2-section',
    },
    {
      re: /<(h2)([^>]*?)\sstyle="font-size:clamp\(1\.9rem,3\.6vw,2\.6rem\);margin-bottom:16px"([^>]*)>/g,
      cls: 'u-h2-about',
    },
    {
      re: /<(div)([^>]*?)\sstyle="display:flex;align-items:baseline;gap:16px;margin-bottom:10px"([^>]*)>/g,
      cls: 'u-kick-row',
    },
    {
      re: /<(span)([^>]*?)\sstyle="font-weight:700;color:var\(--orange-2\)"([^>]*)>/g,
      cls: 'u-kick-dot',
    },
    {
      re: /<(h4)([^>]*?)\sstyle="margin:28px 0 12px;text-transform:uppercase;letter-spacing:\.1em;font-size:\.8rem;color:var\(--muted\)"([^>]*)>/g,
      cls: 'foot-label',
    },
    {
      re: /<(iframe)([^>]*?)\sstyle="width:100%;height:620px;border:none;border-radius:8px"([^>]*)>/g,
      cls: 'embed-iframe',
    },
    {
      re: /<(iframe)([^>]*?)\sstyle="width:100%;border:none;overflow:hidden;min-height:720px"([^>]*)>/g,
      cls: 'embed-iframe embed-iframe--booking',
    },
    {
      re: /<(div)([^>]*?)\sstyle="width:0%"([^>]*)>/g,
      cls: 'cfs-progress-bar-init', // width set in CSS on .cfs-progress-bar
    },
    {
      re: /<(table)([^>]*?)\sstyle="width:100%;border-collapse:collapse;margin-top:8px"([^>]*)>/g,
      cls: 'u-table-admin',
    },
    {
      re: /<(tr)([^>]*?)\sstyle="background:#0f3460;color:#fff"([^>]*)>/g,
      cls: 'u-table-admin__head',
    },
    {
      re: /<(td|th)([^>]*?)\sstyle="padding:10px;border-bottom:1px solid #ddd"([^>]*)>/g,
      cls: 'u-table-admin__cell',
    },
    {
      re: /<(td|th)([^>]*?)\sstyle="padding:10px;text-align:left"([^>]*)>/g,
      cls: 'u-table-admin__cell-left',
    },
  ];

  for (const { re, cls } of patterns) {
    out = out.replace(re, (_, tag, pre, post) => {
      let open = `<${tag}${pre}${post}>`;
      // clean accidental double spaces
      open = open.replace(/\s{2,}/g, ' ').replace(' >', '>');
      // inject classes
      const classes = cls.split(/\s+/);
      let result = open;
      for (const c of classes) result = addClass(result, c);
      return result;
    });
  }

  // Progress bar: style on .cfs-progress-bar
  out = out.replace(
    /(<div class="cfs-progress-bar"[^>]*?)\sstyle="width:0%"([^>]*>)/g,
    '$1$2'
  );
  out = out.replace(
    /(<div[^>]*class="[^"]*cfs-progress-bar[^"]*"[^>]*?)\sstyle="width:0%"([^>]*>)/g,
    '$1$2'
  );

  // related section combo already handled

  // Fallback: any remaining known exact styles via simple replace (class may already be there)
  // Last resort strip of empty leftovers after class injection failed
  // Handle logo without catching wrong attrs: class="logo" style=
  out = out.replace(
    /(<a href="\/" class="logo)(")/g,
    (m, a, b) => (out.includes('u-logo-foot') ? m : m) // noop guard
  );
  out = out.replace(/ class="logo" style="margin-bottom:14px"/g, ' class="logo u-logo-foot"');
  out = out.replace(/ class="logo u-logo-foot" style="margin-bottom:14px"/g, ' class="logo u-logo-foot"');

  // Strip any remaining mapped exact styles
  for (const [from] of REPLACEMENTS) {
    // only strip if we're sure — already handled by patterns; keep as safety for edge order
  }

  // Final sweep for common leftovers that still have style=
  const leftoverMap = [
    [/ style="padding-top:0"/g, ''],
    [/ style="max-width:820px"/g, ''],
    [/ style="max-width:960px"/g, ''],
    [/ style="margin-bottom:14px"/g, ''],
    [/ style="color:#fff;text-decoration:underline"/g, ''],
    [/ style="color:var\(--cyan-2\)"/g, ''],
    [/ style="display:none"/g, ''],
    [/ style="width:0%"/g, ''],
    [/ style="text-align:center"/g, ''],
  ];
  // Before stripping, try to ensure classes exist on parent via simpler string ops
  out = out.replace(
    /<(section) class="related" style="padding-top:0">/g,
    '<section class="related u-section-tight">'
  );
  out = out.replace(
    /<(section) style="padding-top:0"( id="[^"]*")?>/g,
    '<section class="u-section-tight"$2>'
  );
  out = out.replace(
    /<(section) class="([^"]+)" style="padding-top:0">/g,
    '<section class="$2 u-section-tight">'
  );
  out = out.replace(
    /<(div) class="wrap" style="max-width:820px">/g,
    '<div class="wrap u-wrap-820">'
  );
  out = out.replace(
    /<(div) class="wrap" style="max-width:960px">/g,
    '<div class="wrap u-wrap-960">'
  );
  out = out.replace(
    /<(div) class="wrap" style="max-width:820px;margin-top:2rem">/g,
    '<div class="wrap u-wrap-820 u-mt-lg">'
  );
  out = out.replace(
    /<(a)([^>]*?)style="color:#fff;text-decoration:underline"/g,
    (_, tag, mid) => addClass(`<${tag}${mid}>`, 'u-link-white').replace(/>$/, '') // broken - fix below
  );

  // Redo white link cleanly
  out = out.replace(
    /<a ([^>]*?)style="color:#fff;text-decoration:underline"([^>]*)>/g,
    (_, pre, post) => {
      let t = `<a ${pre}${post}>`.replace(/\s{2,}/g, ' ');
      return addClass(t, 'u-link-white');
    }
  );
  out = out.replace(
    /<a ([^>]*?)style="margin-bottom:14px"([^>]*)>/g,
    (_, pre, post) => addClass(`<a ${pre}${post}>`.replace(/\s{2,}/g, ' '), 'u-logo-foot')
  );

  for (const [re] of leftoverMap) {
    // Don't blindly strip without class — run patterns already; strip remaining identical
  }

  // Aggressive final: if style attr matches known list, remove attr (classes should be present)
  const known = new Set([
    'padding-top:0',
    'max-width:820px',
    'max-width:820px;margin-top:2rem',
    'max-width:820px;margin-bottom:20px',
    'max-width:820px;padding:0',
    'max-width:960px',
    'margin-bottom:14px',
    'color:#fff;text-decoration:underline',
    'color:var(--cyan-2)',
    'display:none',
    'text-align:center',
    'margin-top:8px',
    'margin-top:12px',
    'margin-top:14px',
    'margin-top:22px',
    'margin-top:26px',
    'margin-top:28px',
    'margin-top:30px',
    'margin-top:38px',
    'margin-top:44px',
    'margin-top:24px',
    'margin-top:1.2rem',
    'margin-bottom:6px',
    'margin-bottom:20px',
    'margin-bottom:32px',
    'margin-bottom:40px',
    'margin-top:22px;font-size:.9rem',
    'margin:16px auto 0;max-width:720px;font-size:.9rem',
    'margin-top:8px;font-size:.95rem',
    'margin-top:14px;font-size:.98rem',
    'margin-top:26px;display:flex;gap:14px;flex-wrap:wrap',
    'font-size:1.7rem;margin-bottom:18px',
    'font-size:clamp(1.9rem,3.6vw,2.6rem);margin-bottom:16px',
    'display:flex;align-items:baseline;gap:16px;margin-bottom:10px',
    'font-weight:700;color:var(--orange-2)',
    'margin:28px 0 12px;text-transform:uppercase;letter-spacing:.1em;font-size:.8rem;color:var(--muted)',
    'width:100%;height:620px;border:none;border-radius:8px',
    'width:100%;border:none;overflow:hidden;min-height:720px',
    'width:0%',
    'width:100%;border-collapse:collapse;margin-top:8px',
    'background:#0f3460;color:#fff',
    'padding:10px;border-bottom:1px solid #ddd',
    'padding:10px;text-align:left',
  ]);

  out = out.replace(/\sstyle="([^"]*)"/g, (full, val) => {
    const v = val.trim();
    if (known.has(v)) return '';
    return full;
  });

  return out;
}

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    if (['node_modules', '.git', '.wrangler', '.context-cache', '.context-state', 'texts'].includes(name)) continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

function deleteStaleFlatBlogs(root) {
  // FR: blog-foo.html when blog/foo/index.html exists
  let n = 0;
  for (const name of fs.readdirSync(root)) {
    if (!name.startsWith('blog-') || !name.endsWith('.html')) continue;
    const slug = name.slice('blog-'.length, -'.html'.length);
    const modern = path.join(root, 'blog', slug, 'index.html');
    if (fs.existsSync(modern)) {
      fs.unlinkSync(path.join(root, name));
      n++;
      console.log('deleted stale', name);
    }
  }
  // flat realisations.html if realisations/index.html exists
  const flatR = path.join(root, 'realisations.html');
  const hubR = path.join(root, 'realisations', 'index.html');
  if (fs.existsSync(flatR) && fs.existsSync(hubR)) {
    fs.unlinkSync(flatR);
    console.log('deleted stale realisations.html');
    n++;
  }
  return n;
}

for (const root of targets) {
  console.log('\n===', root, '===');
  if (fs.existsSync(path.join(root, 'blog'))) {
    deleteStaleFlatBlogs(root);
  }
  let changed = 0;
  let remaining = 0;
  for (const file of walk(root)) {
    const before = fs.readFileSync(file, 'utf8');
    if (!before.includes('style="')) continue;
    const after = transform(before);
    if (after !== before) {
      fs.writeFileSync(file, after);
      changed++;
    }
    const left = (after.match(/style="/g) || []).length;
    if (left) {
      remaining += left;
      console.log('REMAIN', left, path.relative(root, file));
      // show values
      for (const m of after.matchAll(/style="([^"]*)"/g)) {
        console.log('  ', m[1]);
      }
    }
  }
  console.log('updated files:', changed, 'remaining style attrs:', remaining);
}
