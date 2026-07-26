#!/usr/bin/env node
/**
 * Ensure Cloudflare Dynamic Redirect rules: www → apex (301) for COM + FR.
 *
 * Why: www CNAMEs to Pages and would otherwise serve duplicate HTML.
 * Google then splits signals; fixing this recovers Search impressions.
 *
 * Requires CLOUDFLARE_API_TOKEN with Zone → Redirect Rules edit.
 *
 * Usage: node scripts/ensure-www-redirects.mjs
 */
const COM_ZONE = '095edd5d222ecb55d190286d5b43d0a2';
const FR_ZONE = '3a36dab1e40edf4b915070ba8b5f0efd';

const SITES = [
  {
    label: 'com',
    zone: COM_ZONE,
    host: 'www.monsieurclick.com',
    apex: 'monsieurclick.com',
  },
  {
    label: 'fr',
    zone: FR_ZONE,
    host: 'www.monsieurclick.fr',
    apex: 'monsieurclick.fr',
  },
];

const token = process.env.CLOUDFLARE_API_TOKEN;
if (!token) {
  console.error('Missing CLOUDFLARE_API_TOKEN');
  process.exit(1);
}

async function cf(path, { method = 'GET', body } = {}) {
  const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(`${method} ${path}: ${JSON.stringify(data.errors)}`);
  }
  return data.result;
}

function desiredRule(host, apex) {
  return {
    action: 'redirect',
    expression: `(http.host eq "${host}")`,
    description: 'www → non-www 301 (canonical host)',
    enabled: true,
    action_parameters: {
      from_value: {
        status_code: 301,
        preserve_query_string: true,
        target_url: {
          expression: `concat("https://${apex}", http.request.uri.path)`,
        },
      },
    },
  };
}

function ruleMatches(rule, host, apex) {
  const tv = rule?.action_parameters?.from_value?.target_url?.expression || '';
  return (
    rule?.action === 'redirect' &&
    rule?.expression === `(http.host eq "${host}")` &&
    rule?.action_parameters?.from_value?.status_code === 301 &&
    rule?.action_parameters?.from_value?.preserve_query_string === true &&
    tv.includes(`https://${apex}`)
  );
}

async function ensureSite({ label, zone, host, apex }) {
  const rulesets = await cf(`/zones/${zone}/rulesets`);
  const rs = rulesets.find((r) => r.phase === 'http_request_dynamic_redirect');
  if (!rs) throw new Error(`[${label}] no http_request_dynamic_redirect ruleset`);

  const detail = await cf(`/zones/${zone}/rulesets/${rs.id}`);
  const rules = detail.rules || [];
  const existing = rules.find((r) => (r.expression || '').includes(host));

  if (existing && ruleMatches(existing, host, apex)) {
    console.log(`[${label}] OK — www → https://${apex}/ (rule ${existing.id})`);
    return;
  }

  const payload = desiredRule(host, apex);
  if (existing) {
    await cf(`/zones/${zone}/rulesets/${rs.id}/rules/${existing.id}`, {
      method: 'PATCH',
      body: payload,
    });
    console.log(`[${label}] updated rule ${existing.id}`);
  } else {
    const updated = await cf(`/zones/${zone}/rulesets/${rs.id}/rules`, {
      method: 'POST',
      body: payload,
    });
    const created = (updated.rules || []).find((r) => (r.expression || '').includes(host));
    console.log(`[${label}] created rule ${created?.id || '(see dashboard)'}`);
  }
}

for (const site of SITES) {
  await ensureSite(site);
}
