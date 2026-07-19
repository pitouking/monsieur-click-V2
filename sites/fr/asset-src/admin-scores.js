const els = {
  login: document.getElementById('adminLogin'),
  table: document.getElementById('adminTable'),
  password: document.getElementById('adminPassword'),
  submit: document.getElementById('adminSubmit'),
  msg: document.getElementById('adminMsg'),
  rows: document.getElementById('adminRows')
};

async function load(password) {
  els.msg.hidden = true;
  els.submit.disabled = true;
  try {
    const r = await fetch('/api/admin/scores', {
      headers: { authorization: `Bearer ${password}` }
    });
    if (!r.ok) throw new Error('unauthorized');
    const data = await r.json();
    sessionStorage.setItem('cfAdminPassword', password);
    render(data.rows);
    els.login.hidden = true;
    els.table.hidden = false;
  } catch {
    els.msg.hidden = false;
    els.msg.textContent = 'Mot de passe incorrect.';
    els.submit.disabled = false;
  }
}

function render(rows) {
  els.rows.innerHTML = rows
    .map((r) => {
      const top = r.priorities[0] ? `${r.priorities[0].text} (${r.priorities[0].impact})` : '—';
      const date = new Date(r.created_at).toLocaleString('fr-FR');
      return `<tr>
        <td>${date}</td>
        <td>${r.locale.toUpperCase()}</td>
        <td>${r.business_name || '—'}</td>
        <td>${r.email}</td>
        <td>${r.phone || '—'}</td>
        <td>${r.website_url ? `<a href="${r.website_url}" target="_blank" rel="noopener">${r.website_url}</a>` : '—'}</td>
        <td class="score-cell">${r.global_score}/100</td>
        <td>${top}</td>
      </tr>`;
    })
    .join('');
}

els.submit.addEventListener('click', () => {
  const pwd = els.password.value.trim();
  if (pwd) load(pwd);
});
els.password.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') els.submit.click();
});

const saved = sessionStorage.getItem('cfAdminPassword');
if (saved) load(saved);
