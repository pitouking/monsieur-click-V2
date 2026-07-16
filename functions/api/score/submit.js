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

async function notifyEmail(env, lead) {
  if (!env.RESEND_API_KEY) return;
  const priorities = lead.priorities.length
    ? lead.priorities.map((p) => `${p.text} (${p.impact})`).join('<br>')
    : 'Aucune';
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: 'Click First Score <onboarding@resend.dev>',
        to: ['contact@monsieurclick.com'],
        subject: `Nouveau Score Click First™ : ${lead.business_name || lead.email} (${lead.global_score}/100)`,
        html: `<h2>Nouveau Score Click First™</h2>
          <p><b>Entreprise :</b> ${lead.business_name || '—'}<br>
          <b>Email :</b> ${lead.email}<br>
          <b>Téléphone :</b> ${lead.phone || '—'}<br>
          <b>Site web :</b> ${lead.website_url || '—'}<br>
          <b>Locale :</b> ${lead.locale}</p>
          <p><b>Score global :</b> ${lead.global_score}/100</p>
          <p><b>Priorités :</b><br>${priorities}</p>`
      })
    });
  } catch {
    // Envoi best-effort : ne bloque jamais la soumission du score.
  }
}

async function notifyGHL(env, lead) {
  if (!env.GHL_WEBHOOK_URL) return;
  try {
    await fetch(env.GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(lead)
    });
  } catch {
    // Envoi best-effort : ne bloque jamais la soumission du score.
  }
}

export async function onRequestPost({ request, env, waitUntil }) {
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

  const lead = {
    business_name: (body.business_name || '').toString().slice(0, 200) || null,
    email,
    phone: (body.phone || '').toString().slice(0, 50) || null,
    website_url: (body.website_url || '').toString().slice(0, 300) || null,
    locale,
    global_score: result.globalScore,
    badges: result.badges,
    priorities: result.priorities
  };
  waitUntil(notifyEmail(env, lead));
  waitUntil(notifyGHL(env, lead));

  return json({
    id,
    business_name: lead.business_name,
    module_scores: result.moduleScores,
    global_score: result.globalScore,
    badges: result.badges,
    priorities: result.priorities,
    strengths: result.strengths
  });
}
