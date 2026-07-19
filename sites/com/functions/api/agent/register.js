function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
    },
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
    },
  });
}

export async function onRequestPost({ request }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : '';
  const email = typeof body.email === 'string' ? body.email.trim().slice(0, 200) : '';
  if (!name || !email || !email.includes('@')) {
    return json({ error: 'name and valid email required' }, 400);
  }

  const clientId = crypto.randomUUID();
  const apiKey = `mc_${[...crypto.getRandomValues(new Uint8Array(16))]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')}`;

  return json({
    client_id: clientId,
    api_key: apiKey,
    token_type: 'Bearer',
    scopes: ['score:submit', 'score:read', 'agent:register'],
    note: 'Public score API does not require this key. Use it to identify agent traffic. See /auth.md',
    human_contact: 'contact@monsieurclick.com',
    purpose: typeof body.purpose === 'string' ? body.purpose.slice(0, 500) : null,
  });
}
