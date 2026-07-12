import { QUESTIONS } from '../../../score-questions.js';
import { computeScore } from '../../_lib/scoring.js';

const VALID_VALUES = new Set([0, 0.5, 1]);
const QUESTION_IDS = new Set(QUESTIONS.map((q) => q.id));

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' }
  });
}

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'JSON invalide.' }, 400);
  }

  const answers = body && typeof body.answers === 'object' ? body.answers : null;
  if (!answers) return json({ error: 'Réponses manquantes.' }, 400);

  const cleanAnswers = {};
  for (const [id, value] of Object.entries(answers)) {
    if (QUESTION_IDS.has(id) && VALID_VALUES.has(value)) cleanAnswers[id] = value;
  }
  if (Object.keys(cleanAnswers).length === 0) {
    return json({ error: 'Aucune réponse valide.' }, 400);
  }

  const email = typeof body.email === 'string' ? body.email.trim().slice(0, 200) : null;
  if (!email || !email.includes('@')) return json({ error: 'Email invalide.' }, 400);

  const result = computeScore(cleanAnswers);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const locale = body.locale === 'en' ? 'en' : 'fr';

  await env.DB.prepare(
    `INSERT INTO submissions
      (id, created_at, locale, business_name, email, phone, website_url,
       answers, module_scores, global_score, badges, priorities,
       utm_source, utm_medium, utm_campaign)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
  )
    .bind(
      id,
      createdAt,
      locale,
      (body.business_name || '').toString().slice(0, 200) || null,
      email,
      (body.phone || '').toString().slice(0, 50) || null,
      (body.website_url || '').toString().slice(0, 300) || null,
      JSON.stringify(cleanAnswers),
      JSON.stringify(result.moduleScores),
      result.globalScore,
      JSON.stringify(result.badges),
      JSON.stringify(result.priorities),
      (body.utm_source || '').toString().slice(0, 100) || null,
      (body.utm_medium || '').toString().slice(0, 100) || null,
      (body.utm_campaign || '').toString().slice(0, 100) || null
    )
    .run();

  return json({
    id,
    business_name: (body.business_name || '').toString().slice(0, 200) || null,
    module_scores: result.moduleScores,
    global_score: result.globalScore,
    badges: result.badges,
    priorities: result.priorities,
    strengths: result.strengths
  });
}
