import type { ChallengeInput, SelectedAgenda, DrawnCard, CardCategory, PersonaResponse, PersonaId } from '@/types/session'

const PERSONA_NAMES: Record<PersonaId, string> = {
  critic: 'The Critic',
  optimist: 'The Optimist',
  academic: 'The Academic',
  practitioner: 'The Practitioner',
  philosopher: 'The Philosopher',
  lead: 'The Lead',
}

const PERSONA_COLORS: Record<PersonaId, string> = {
  critic: '#E8A98C',
  optimist: '#BAE0C6',
  academic: '#3B8EA5',
  practitioner: '#D6DE23',
  philosopher: '#B8C4C8',
  lead: '#D6DE23',
}

const CATEGORY_COLORS: Record<CardCategory, string> = {
  barrier: '#E8A98C',
  enabler: '#BAE0C6',
  theory: '#3B8EA5',
  tool: '#D6DE23',
  provocation: '#B8C4C8',
  agenda: '#B8C4C8',
}

import { renderInline } from './renderMarkdown'

// Fix #1 + #6 — proper single <ul> grouping, inline markdown rendered
function synthesisMdToHTML(text: string): string {
  const lines = text.split('\n')
  const out: string[] = []
  let inList = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) {
      // If blank line sits between two bullet lines, stay in list
      const next = lines.slice(i + 1).find((l) => l.trim())
      if (inList && next && (next.trim().startsWith('- ') || /^\d+\.\s/.test(next.trim()))) {
        continue
      }
      if (inList) { out.push('</ul>'); inList = false }
      continue
    }
    if (line.startsWith('## ') || line.startsWith('### ')) {
      if (inList) { out.push('</ul>'); inList = false }
      const level = line.startsWith('### ') ? 4 : 3
      const content = renderInline(line.replace(/^#{2,3}\s*/, ''))
      out.push(`<h${level} class="synth-heading">${content}</h${level}>`)
    } else if (line.startsWith('- ') || /^\d+\.\s/.test(line)) {
      if (!inList) { out.push('<ul class="synth-list">'); inList = true }
      const content = renderInline(line.replace(/^[-*\d.]+\s*/, ''))
      out.push(`<li>${content}</li>`)
    } else {
      if (inList) { out.push('</ul>'); inList = false }
      out.push(`<p class="synth-para">${renderInline(line)}</p>`)
    }
  }
  if (inList) out.push('</ul>')
  return out.join('\n')
}

// Fix #5 — use provocation-specific fields when description is absent
function cardContent(card: DrawnCard): string {
  if (card.description) return card.description
  // Provocation cards carry their content in quote / coreQuestion
  const c = card as Record<string, unknown>
  const quote = c['quote'] as string | undefined
  const coreQ = c['coreQuestion'] as string | undefined
  if (quote && coreQ) return `"${quote}" — ${coreQ}`
  if (quote) return `"${quote}"`
  if (coreQ) return coreQ
  return ''
}

function cardHTML(card: DrawnCard): string {
  const color = CATEGORY_COLORS[card.category] ?? '#888'
  const content = cardContent(card)
  const descHTML = content
    ? `<p class="card-desc">${content}</p>`
    : `<p class="card-desc card-desc-empty">—</p>`
  return `
    <div class="card">
      <div class="card-accent" style="background:${color}"></div>
      <div class="card-body">
        <span class="card-category" style="color:${color}">${card.category.toUpperCase()}</span>
        <h3 class="card-title">${card.title}</h3>
        ${descHTML}
      </div>
    </div>`
}

// Fix #3 — only first persona open by default
function personaHTML(response: PersonaResponse, index: number): string {
  const name = PERSONA_NAMES[response.personaId]
  const color = PERSONA_COLORS[response.personaId]
  const paragraphs = response.content
    .split('\n\n')
    .filter(Boolean)
    .map((p) => `<p>${renderInline(p.trim())}</p>`)
    .join('\n')
  return `
    <details class="persona"${index === 0 ? ' open' : ''}>
      <summary class="persona-summary">
        <span class="persona-dot" style="background:${color}"></span>
        <span class="persona-name" style="color:${color}">${name}</span>
        <span class="persona-toggle">▸</span>
      </summary>
      <div class="persona-content">${paragraphs}</div>
    </details>`
}

export function generateSessionHTML(
  challenge: ChallengeInput,
  agenda: SelectedAgenda | null,
  drawnCards: Partial<Record<CardCategory, DrawnCard>>,
  responses: PersonaResponse[],
  synthesis: string,
  sessionDate: string
): string {
  const cards = Object.values(drawnCards).filter(Boolean) as DrawnCard[]
  const personaSections = responses
    .filter((r) => r.content && r.personaId !== 'lead')
    .map((r, i) => personaHTML(r, i))
    .join('\n')

  const tocAgenda = agenda ? `<a href="#agenda" class="toc-link">Agenda</a>` : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cards Against Bureaucracy — Session ${sessionDate}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --galaxy: #10213C;
      --new-leaf: #D6DE23;
      --white: #FFFFFF;
      --ocean: #3B8EA5;
      --blossom: #F0AB86;
      --radius: 10px;
    }
    body {
      background: var(--galaxy);
      color: var(--white);
      font-family: 'Poppins', sans-serif;
      font-size: 16px;
      line-height: 1.65;
      padding: 0;
    }
    a { color: var(--new-leaf); }

    /* ── Progress bar (fix #8) ── */
    #progress-bar {
      position: fixed; top: 0; left: 0; height: 3px;
      background: var(--new-leaf); width: 0%;
      transition: width 0.1s linear; z-index: 100;
    }

    /* ── Layout ── */
    .page { max-width: 860px; margin: 0 auto; padding: 48px 24px 80px; }
    .section { margin-bottom: 56px; }
    .divider { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 48px 0; }

    /* ── Header ── */
    .brand { font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--new-leaf); margin-bottom: 12px; }
    .page-title { font-size: 2.2rem; font-weight: 600; line-height: 1.15; margin-bottom: 8px; }
    .session-date { font-size: 0.85rem; color: rgba(255,255,255,0.45); }

    /* ── Sticky nav (fix #4) ── */
    .toc-wrap {
      position: sticky; top: 0; z-index: 50;
      background: rgba(16,33,60,0.92); backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255,255,255,0.08);
      margin: 24px -24px 40px; padding: 0 24px;
    }
    .toc {
      display: flex; gap: 4px; flex-wrap: wrap;
      padding: 12px 0;
    }
    .toc-link {
      font-size: 0.82rem; color: rgba(255,255,255,0.65);
      text-decoration: none; padding: 4px 12px;
      border-radius: 100px;
      transition: color 0.15s, background 0.15s;
    }
    .toc-link:hover { color: var(--white); background: rgba(255,255,255,0.07); }
    .toc-link.active { color: var(--galaxy); background: var(--new-leaf); }

    /* ── Challenge box ── */
    .challenge-box { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius); padding: 24px 28px; margin-top: 28px; display: grid; gap: 16px; }
    .challenge-field label { font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.45); display: block; margin-bottom: 4px; }
    .challenge-field p { font-size: 0.95rem; color: rgba(255,255,255,0.88); line-height: 1.6; }

    /* ── Section headings ── */
    .section-label { font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 8px; }
    .section-title { font-size: 1.4rem; font-weight: 500; color: var(--white); margin-bottom: 24px; }

    /* ── Cards (fix #7) ── */
    .cards-grid { display: flex; flex-wrap: wrap; gap: 16px; }
    .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: var(--radius); overflow: hidden; width: 220px; flex-shrink: 0; }
    .card-accent { height: 5px; width: 100%; }
    .card-body { padding: 16px; }
    .card-category { font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; display: block; margin-bottom: 6px; }
    .card-title { font-size: 0.98rem; font-weight: 500; margin-bottom: 8px; line-height: 1.3; }
    .card-desc { font-size: 0.88rem; color: rgba(255,255,255,0.6); line-height: 1.6; }
    .card-desc-empty { font-style: italic; color: rgba(255,255,255,0.25); }

    /* ── Personas (fix #3, #7) ── */
    .persona { border: 1px solid rgba(255,255,255,0.07); border-radius: var(--radius); overflow: hidden; margin-bottom: 12px; }
    .persona-summary { display: flex; align-items: center; gap: 10px; padding: 16px 20px; cursor: pointer; list-style: none; user-select: none; background: rgba(255,255,255,0.02); }
    .persona-summary::-webkit-details-marker { display: none; }
    .persona-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
    .persona-name { font-size: 0.82rem; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; }
    .persona-toggle { margin-left: auto; color: rgba(255,255,255,0.35); font-size: 0.8rem; transition: transform 0.2s; display: inline-block; }
    details[open] .persona-toggle { transform: rotate(90deg); }
    .persona-content { padding: 20px 24px 24px; border-top: 1px solid rgba(255,255,255,0.06); }
    .persona-content p { font-size: 0.92rem; color: rgba(255,255,255,0.82); line-height: 1.8; margin-bottom: 14px; }
    .persona-content p:last-child { margin-bottom: 0; }

    /* ── Synthesis (fix #1) ── */
    .synthesis-box { background: rgba(214,222,35,0.04); border: 1px solid rgba(214,222,35,0.2); border-radius: var(--radius); padding: 28px 32px; }
    .synth-heading { font-size: 0.92rem; font-weight: 600; color: var(--new-leaf); letter-spacing: 0.04em; margin: 24px 0 10px; }
    .synth-heading:first-child { margin-top: 0; }
    .synth-para { font-size: 0.92rem; color: rgba(255,255,255,0.88); line-height: 1.8; margin-bottom: 10px; }
    .synth-list { padding-left: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
    .synth-list li { font-size: 0.92rem; color: rgba(255,255,255,0.88); padding-left: 22px; position: relative; line-height: 1.7; }
    .synth-list li::before { content: '—'; position: absolute; left: 0; color: rgba(255,255,255,0.3); }
    .synth-list li strong { color: var(--white); }

    /* ── Footer ── */
    .footer { font-size: 0.78rem; color: rgba(255,255,255,0.25); text-align: center; margin-top: 64px; }

    @media (max-width: 600px) {
      .cards-grid { flex-direction: column; }
      .card { width: 100%; }
      .page { padding: 32px 16px 64px; }
      .toc-wrap { margin: 24px -16px 32px; padding: 0 16px; }
    }

    @media print {
      #progress-bar { display: none; }
      .toc-wrap { position: static; background: none; border: none; backdrop-filter: none; }
      body { background: white; color: #10213C; font-size: 13px; }
      .card, .challenge-box, .persona, .synthesis-box { border-color: #ccc; }
      .challenge-field p, .synth-para, .synth-list li, .persona-content p { color: #222; }
      .section-label, .session-date { color: #666; }
      details { display: block; }
      details summary { display: none; }
      .persona-content { padding: 0; border: none; }
      .synth-heading { color: #10213C; }
    }
  </style>
</head>
<body>
  <div id="progress-bar"></div>
  <div class="page">

    <header class="section">
      <p class="brand">ShiftFlow · Cards Against Bureaucracy</p>
      <h1 class="page-title">Session Summary</h1>
      <p class="session-date">${sessionDate}</p>
    </header>

    <div class="toc-wrap">
      <nav class="toc" id="toc">
        <a href="#challenge" class="toc-link">Challenge</a>
        ${tocAgenda}
        <a href="#spread" class="toc-link">The Spread</a>
        <a href="#deliberation" class="toc-link">Deliberation</a>
        <a href="#synthesis" class="toc-link">Synthesis</a>
      </nav>
    </div>

    <hr class="divider">

    <section class="section" id="challenge">
      <p class="section-label">Phase 1</p>
      <h2 class="section-title">The Challenge</h2>
      <div class="challenge-box">
        <div class="challenge-field">
          <label>Challenge</label>
          <p>${challenge.name}</p>
        </div>
        <div class="challenge-field">
          <label>Context</label>
          <p>${challenge.context}</p>
        </div>
        <div class="challenge-field">
          <label>Stakeholders</label>
          <p>${challenge.stakeholders}</p>
        </div>
        ${challenge.stakes ? `
        <div class="challenge-field">
          <label>Stakes</label>
          <p>${challenge.stakes}</p>
        </div>` : ''}
        <div class="challenge-field">
          <label>Transformation</label>
          <p>From <em>${challenge.transformFrom}</em> → to <em>${challenge.transformTo}</em> → so that <em>${challenge.transformSoThat}</em></p>
        </div>
      </div>
    </section>

    <hr class="divider">

    ${agenda ? `
    <section class="section" id="agenda">
      <p class="section-label">Step 2</p>
      <h2 class="section-title">Change Agenda</h2>
      <div class="challenge-box">
        <div class="challenge-field">
          <label>Agenda</label>
          <p>${agenda.title}</p>
        </div>
        <div class="challenge-field">
          <label>Type</label>
          <p>${agenda.transformationType}</p>
        </div>
        <div class="challenge-field">
          <label>Statement</label>
          <p>${agenda.statement}</p>
        </div>
        <div class="challenge-field">
          <label>Design Provocation</label>
          <p><em>${agenda.designProvocation}</em></p>
        </div>
      </div>
    </section>

    <hr class="divider">
    ` : ''}

    <section class="section" id="spread">
      <p class="section-label">Phase 2</p>
      <h2 class="section-title">The Spread</h2>
      <div class="cards-grid">
        ${cards.map(cardHTML).join('\n')}
      </div>
    </section>

    <hr class="divider">

    <section class="section" id="deliberation">
      <p class="section-label">Phases 3 &amp; 4</p>
      <h2 class="section-title">The Deliberation</h2>
      ${personaSections}
    </section>

    <hr class="divider">

    <section class="section" id="synthesis">
      <p class="section-label">Phase 5</p>
      <h2 class="section-title">The Lead's Synthesis</h2>
      <div class="synthesis-box">
        ${synthesisMdToHTML(synthesis)}
      </div>
    </section>

    <footer class="footer">
      Generated by Cards Against Bureaucracy · ShiftFlow &copy; ${new Date().getFullYear()}
    </footer>

  </div>

  <script>
    // Reading progress bar (fix #8)
    const bar = document.getElementById('progress-bar');
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight;
      bar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
    }, { passive: true });

    // Sticky TOC scroll-spy (fix #4)
    const sections = document.querySelectorAll('section[id]');
    const tocLinks = document.querySelectorAll('.toc-link');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          tocLinks.forEach(l => l.classList.remove('active'));
          const active = document.querySelector('.toc-link[href="#' + entry.target.id + '"]');
          if (active) active.classList.add('active');
        }
      });
    }, { rootMargin: '-20% 0px -75% 0px' });
    sections.forEach(s => observer.observe(s));
  </script>
</body>
</html>`
}

export function downloadSessionHTML(
  challenge: ChallengeInput,
  agenda: SelectedAgenda | null,
  drawnCards: Partial<Record<CardCategory, DrawnCard>>,
  responses: PersonaResponse[],
  synthesis: string
): void {
  const date = new Date().toLocaleDateString('en-AU', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
  const html = generateSessionHTML(challenge, agenda, drawnCards, responses, synthesis, date)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `session-${new Date().toISOString().slice(0, 10)}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
