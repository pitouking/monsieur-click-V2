import { computeScore } from '../../_lib/scoring.js';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' }
  });
}

export async function onRequestGet({ request, env }) {
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return json({ error: 'Identifiant manquant.' }, 400);

  const row = await env.DB.prepare('SELECT * FROM submissions WHERE id = ?').bind(id).first();
  if (!row) return json({ error: 'Diagnostic introuvable.' }, 404);

  const answers = JSON.parse(row.answers);
  const { strengths } = computeScore(answers);

  return json({
    id: row.id,
    created_at: row.created_at,
    business_name: row.business_name,
    module_scores: JSON.parse(row.module_scores),
    global_score: row.global_score,
    badges: JSON.parse(row.badges),
    priorities: JSON.parse(row.priorities),
    strengths
  });
}
