// Click First™ Score — embedded section on click-first.html (ESM module)
import { MODULES, QUESTIONS } from '/score-questions.js';

const answers = {};
let step = 0; // 0..MODULES.length-1 = modules, MODULES.length = lead step
const totalSteps = MODULES.length + 1;

const els = {
  wizard: document.getElementById('cfsWizard'),
  progressBar: document.getElementById('cfsProgressBar'),
  stepLabel: document.getElementById('cfsStepLabel'),
  questions: document.getElementById('cfsQuestions'),
  lead: document.getElementById('cfsLead'),
  prev: document.getElementById('cfsPrev'),
  next: document.getElementById('cfsNext'),
  submit: document.getElementById('cfsSubmit'),
  msg: document.getElementById('cfsMsg'),
  form: document.getElementById('cfsForm'),
  result: document.getElementById('cfrContent')
};

if (!els.wizard) {
  // Section not present on this page: nothing to do.
} else {

const OPTIONS = [
  { value: 1, label: 'Yes' },
  { value: 0.5, label: 'Partially' },
  { value: 0, label: 'No' }
];

const BADGES = [
  { key: 'clickFirst', label: 'Click First™ Score' },
  { key: 'aiReadiness', label: 'AI Readiness' },
  { key: 'localAuthority', label: 'Local Authority' },
  { key: 'trust', label: 'Trust Score' },
  { key: 'gbp', label: 'Google Business Profile', note: 'Self-reported estimate' }
];

function questionsForModule(moduleKey) {
  return QUESTIONS.filter((q) => q.module === moduleKey);
}

function renderModuleStep() {
  const mod = MODULES[step];
  els.questions.hidden = false;
  els.lead.hidden = true;
  els.submit.hidden = true;
  els.next.hidden = false;
  els.prev.hidden = step === 0;

  els.stepLabel.textContent = `Step ${step + 1}/${totalSteps} — ${mod.label}`;
  els.questions.innerHTML = questionsForModule(mod.key)
    .map(
      (q) => `
    <fieldset class="cfs-q" data-qid="${q.id}">
      <legend>${q.text}</legend>
      <div class="cfs-opts">
        ${OPTIONS.map(
          (o) => `<label class="cfs-opt"><input type="radio" name="${q.id}" value="${o.value}" ${answers[q.id] === o.value ? 'checked' : ''}><span>${o.label}</span></label>`
        ).join('')}
      </div>
    </fieldset>`
    )
    .join('');
}

function renderLeadStep() {
  els.questions.hidden = true;
  els.lead.hidden = false;
  els.next.hidden = true;
  els.prev.hidden = false;
  els.submit.hidden = false;
  els.stepLabel.textContent = `Step ${totalSteps}/${totalSteps} — Your details`;
}

function renderWizard() {
  els.progressBar.style.width = `${Math.round((step / (totalSteps - 1)) * 100)}%`;
  els.msg.hidden = true;
  if (step < MODULES.length) renderModuleStep();
  else renderLeadStep();
}

function currentModuleAnswered() {
  const mod = MODULES[step];
  return questionsForModule(mod.key).every((q) => q.id in answers);
}

function collectModuleAnswers() {
  if (step >= MODULES.length) return;
  els.questions.querySelectorAll('.cfs-q').forEach((fs) => {
    const qid = fs.dataset.qid;
    const checked = fs.querySelector('input[type=radio]:checked');
    if (checked) answers[qid] = Number(checked.value);
  });
}

els.next.addEventListener('click', () => {
  collectModuleAnswers();
  if (!currentModuleAnswered()) {
    els.msg.hidden = false;
    els.msg.textContent = 'Please answer every question before continuing.';
    return;
  }
  step++;
  renderWizard();
  els.wizard.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

els.prev.addEventListener('click', () => {
  if (step > 0) step--;
  renderWizard();
});

function polar(angleDeg, radius) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: 150 + radius * Math.sin(rad), y: 150 - radius * Math.cos(rad) };
}

function drawRadar(moduleScores) {
  const grid = document.getElementById('cfrRadarGrid');
  const labels = document.getElementById('cfrRadarLabels');
  const data = document.getElementById('cfrRadarData');
  const n = MODULES.length;
  const maxR = 120;

  let gridSvg = '';
  [0.25, 0.5, 0.75, 1].forEach((f) => {
    const pts = MODULES.map((_, i) => polar((360 / n) * i, maxR * f)).map((p) => `${p.x},${p.y}`).join(' ');
    gridSvg += `<polygon points="${pts}" class="cfr-radar-grid-ring"></polygon>`;
  });
  MODULES.forEach((_, i) => {
    const p = polar((360 / n) * i, maxR);
    gridSvg += `<line x1="150" y1="150" x2="${p.x}" y2="${p.y}" class="cfr-radar-axis"></line>`;
  });
  grid.innerHTML = gridSvg;

  labels.innerHTML = MODULES.map((m, i) => {
    const p = polar((360 / n) * i, maxR + 24);
    return `<text x="${p.x}" y="${p.y}" class="cfr-radar-label" text-anchor="middle">${m.label.split(' ')[0]}</text>`;
  }).join('');

  const dataPts = MODULES.map((m, i) => polar((360 / n) * i, (maxR * (moduleScores[m.key] || 0)) / 100))
    .map((p) => `${p.x},${p.y}`)
    .join(' ');
  data.setAttribute('points', dataPts);
}

function globalLabel(score) {
  if (score < 40) return 'Needs to be built';
  if (score < 60) return 'Behind your competitors';
  if (score < 80) return 'On the right track';
  return 'Strong';
}

function renderResult(data) {
  els.wizard.hidden = true;
  els.result.hidden = false;

  const titleEl = document.getElementById('cfrBusinessTitle');
  if (titleEl && data.business_name) {
    titleEl.textContent = `${data.business_name}'s Click First™ Score`;
  }

  document.getElementById('cfrGlobalScore').textContent = `${data.global_score}/100`;
  document.getElementById('cfrGlobalLabel').textContent = globalLabel(data.global_score);

  drawRadar(data.module_scores);

  document.getElementById('cfrBadges').innerHTML = BADGES.map(
    (b) => `<div class="cfr-badge">
      <div class="cfr-badge-num">${data.badges[b.key]}</div>
      <div class="cfr-badge-label">${b.label}</div>
      ${b.note ? `<div class="cfr-badge-note">${b.note}</div>` : ''}
    </div>`
  ).join('');

  document.getElementById('cfrStrengths').innerHTML = data.strengths.length
    ? data.strengths.map((s) => `<li>${s.text}</li>`).join('')
    : '<li class="muted">No clear strength yet: every module still has room to grow.</li>';

  document.getElementById('cfrPriorities').innerHTML = data.priorities.length
    ? data.priorities
        .map(
          (p, i) => `<div class="cfr-priority">
            <div class="cfr-priority-num">${i + 1}</div>
            <div><p>${p.text}</p><span class="cfr-priority-impact">Estimated impact: ${p.impact}</span></div>
          </div>`
        )
        .join('')
    : '<p class="muted">Excellent score, no urgent priority detected.</p>';

  els.result.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

els.form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(els.form);
  const email = (fd.get('email') || '').toString().trim();
  if (!email.includes('@')) {
    els.msg.hidden = false;
    els.msg.textContent = 'Please enter a valid email.';
    return;
  }

  els.submit.disabled = true;
  els.msg.hidden = false;
  els.msg.textContent = 'Calculating your score...';

  const params = new URLSearchParams(location.search);
  try {
    const r = await fetch('/api/score/submit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        answers,
        locale: 'en',
        business_name: fd.get('business_name'),
        email,
        phone: fd.get('phone'),
        website_url: fd.get('website_url'),
        utm_source: params.get('utm_source'),
        utm_medium: params.get('utm_medium'),
        utm_campaign: params.get('utm_campaign')
      })
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Server error.');
    renderResult(data);
  } catch (err) {
    els.submit.disabled = false;
    els.msg.textContent = 'Something went wrong, please retry or email contact@monsieurclick.com.';
  }
});

renderWizard();

}
