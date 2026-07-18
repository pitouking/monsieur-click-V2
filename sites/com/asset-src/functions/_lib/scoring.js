// Click First™ Score — scoring engine (server, single source of truth).
// The score is never trusted from the client: always recomputed here from
// the raw answers, to prevent tampering and keep history comparable if
// weights change later.
import { MODULES, QUESTIONS } from '../../score-questions.js';

const IMPACT_LABEL = (weight) => (weight >= 7 ? 'Very high' : weight >= 4 ? 'High' : 'Medium');

export function computeScore(answers) {
  const moduleScores = {};
  for (const m of MODULES) {
    const qs = QUESTIONS.filter((q) => q.module === m.key);
    const totalWeight = qs.reduce((s, q) => s + q.weight, 0);
    const earned = qs.reduce((s, q) => s + q.weight * (answers[q.id] ?? 0), 0);
    moduleScores[m.key] = totalWeight ? Math.round((earned / totalWeight) * 100) : 0;
  }

  const globalScore = Math.round(
    MODULES.reduce((s, m) => s + moduleScores[m.key], 0) / MODULES.length
  );

  const badges = {
    clickFirst: globalScore,
    aiReadiness: moduleScores.ia,
    localAuthority: Math.round((moduleScores.seo + moduleScores.gbp) / 2),
    trust: moduleScores.confiance,
    gbp: moduleScores.gbp
  };

  const priorities = QUESTIONS
    .map((q) => ({ q, value: answers[q.id] ?? 0, gap: q.weight * (1 - (answers[q.id] ?? 0)) }))
    .filter((r) => r.gap > 0)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 3)
    .map((r) => ({ id: r.q.id, text: r.q.text, module: r.q.module, impact: IMPACT_LABEL(r.q.weight) }));

  const strengths = QUESTIONS
    .filter((q) => (answers[q.id] ?? 0) === 1 && moduleScores[q.module] >= 80)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 6)
    .map((q) => ({ id: q.id, text: q.text, module: q.module }));

  return { moduleScores, globalScore, badges, priorities, strengths };
}
