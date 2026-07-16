function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' }
  });
}

export async function onRequestGet({ request, env }) {
  const auth = request.headers.get('authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  if (!env.ADMIN_PASSWORD || token !== env.ADMIN_PASSWORD) {
    return json({ error: 'Non autorisé.' }, 401);
  }

  const { results } = await env.DB.prepare(
    `SELECT id, created_at, locale, business_name, email, phone, website_url,
            module_scores, global_score, badges, priorities
     FROM submissions ORDER BY created_at DESC LIMIT 200`
  ).all();

  const rows = results.map((r) => ({
    ...r,
    module_scores: JSON.parse(r.module_scores),
    badges: JSON.parse(r.badges),
    priorities: JSON.parse(r.priorities)
  }));

  return json({ rows });
}
