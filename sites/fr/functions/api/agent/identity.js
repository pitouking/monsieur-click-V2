function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'cache-control': 'no-store',
    },
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
    },
  });
}

export async function onRequestGet({ request }) {
  const origin = new URL(request.url).origin;
  return json({
    resource: origin,
    name: 'Monsieur Click',
    identity_types_supported: ['anonymous', 'verified_email'],
    registration: `${origin}/api/agent/register`,
    documentation: `${origin}/auth.md`,
    note: 'Public discovery and the score API do not require bearer tokens. Soft registration issues a tracking api_key only.',
  });
}

export async function onRequestPost({ request }) {
  let body = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const type = typeof body.type === 'string' ? body.type : 'anonymous';
  const origin = new URL(request.url).origin;
  const assertion = crypto.randomUUID();

  return json({
    type,
    identity_assertion: assertion,
    claim_token: type === 'anonymous' ? `claim_${crypto.randomUUID()}` : null,
    expires_in: 3600,
    token_endpoint: `${origin}/api/oauth/token`,
    note: 'Soft identity for public Monsieur Click agent discovery. No OAuth IdP is required for read-only resources.',
  });
}
