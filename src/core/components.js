/**
 * Tiny tag-template HTML helpers + shared UI components.
 * No framework — just functions returning strings (for innerHTML) or DOM nodes.
 */

export function html(strings, ...values) {
  // Tagged template. Returns a "raw HTML" marker object so nested html`...`
  // interpolations pass through unescaped. Stringifies for innerHTML assignment.
  let out = strings[0];
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (v == null || v === false) {
      // skip
    } else if (Array.isArray(v)) {
      for (const el of v) {
        if (el == null || el === false) continue;
        if (typeof el === 'object' && el && 'raw' in el) out += el.raw;
        else out += escape(String(el));
      }
    } else if (typeof v === 'object' && v && 'raw' in v) {
      out += v.raw;
    } else {
      out += escape(String(v));
    }
    out += strings[i + 1];
  }
  return { raw: out, toString() { return out; } };
}

export function raw(s) { return { raw: String(s) }; }

export function escape(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Speech-bubble component (Watson, Mycroft, Sapolsky, Holmes, Lestrade).
 * Variants: 'watson' (default), 'holmes', 'mycroft', 'sapolsky', 'lestrade'.
 */
export function speech({ who, role = 'watson', initial = null, says }) {
  const init = initial || who.charAt(0).toUpperCase();
  return html`
    <div class="speech ${raw(role)}" role="region" aria-label="${who} speaks">
      <div class="avatar" aria-hidden="true">${init}</div>
      <div>
        <div class="who">${who}</div>
        <div class="what">${raw(says)}</div>
      </div>
    </div>
  `;
}

/**
 * Topbar — sticky banner at the top of every act with title + back button + casebook button.
 */
export function topbar({ act, name, progress = '' }) {
  return html`
    <div class="topbar">
      <div class="row" style="gap: var(--s-2);">
        <a href="#/title" class="btn btn-ghost" style="padding: 8px 16px; min-height: 0;">← Index</a>
        <span class="topbar-title">${name}</span>
      </div>
      <div class="row" style="gap: var(--s-2);">
        ${progress ? html`<span class="topbar-meta">${progress}</span>` : ''}
        <span class="topbar-meta">Act ${rom(act)}</span>
      </div>
    </div>
  `;
}

/**
 * Reference shelf — always-visible "tools you have" sidebar for student support.
 * Keeps the standard-form glossary at hand so they don't get stuck.
 */
export function shelf({ title, items }) {
  return html`
    <aside class="shelf" aria-label="${title}">
      <h4>${title}</h4>
      <ul>
        ${items.map(i => html`<li>${raw(i)}</li>`)}
      </ul>
    </aside>
  `;
}

/**
 * Toast / live announcement (visible 3s, also sent to a screen-reader live region).
 */
export function toast(message, kind = 'default') {
  const el = document.createElement('div');
  el.className = `toast ${kind}`;
  el.textContent = message;
  document.body.appendChild(el);
  // Update screen-reader region
  const live = document.getElementById(kind === 'warning' ? 'hud-assertive' : 'hud-polite');
  if (live) {
    live.textContent = '';
    setTimeout(() => { live.textContent = message; }, 60);
  }
  setTimeout(() => {
    el.style.transition = 'opacity 0.3s ease';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 300);
  }, 3200);
}

/**
 * Modal overlay (closeable by Esc + close button + backdrop click).
 * Returns a function to close the modal.
 */
export function modal({ heading, body, primary, onPrimary, secondary, onSecondary, dismissible = true }) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');
  backdrop.setAttribute('aria-label', heading || 'Dialog');

  backdrop.innerHTML = html`
    <div class="modal stack">
      <h2>${heading || ''}</h2>
      <div>${raw(body)}</div>
      <div class="row row-end" style="margin-top: var(--s-3);">
        ${secondary ? html`<button class="btn btn-secondary" data-act="secondary">${secondary}</button>` : ''}
        ${primary ? html`<button class="btn" data-act="primary" autofocus>${primary}</button>` : ''}
      </div>
    </div>
  `;

  const close = () => {
    document.removeEventListener('keydown', onKey);
    backdrop.remove();
  };

  const onKey = (e) => {
    if (e.key === 'Escape' && dismissible) close();
  };

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop && dismissible) close();
  });
  backdrop.querySelector('[data-act="primary"]')?.addEventListener('click', () => {
    onPrimary?.();
    close();
  });
  backdrop.querySelector('[data-act="secondary"]')?.addEventListener('click', () => {
    onSecondary?.();
    close();
  });

  document.addEventListener('keydown', onKey);
  document.body.appendChild(backdrop);
  // Move focus into the modal
  const auto = backdrop.querySelector('[autofocus]');
  auto?.focus();
  return close;
}

function rom(n) { return ['', 'I', 'II', 'III', 'IV'][n] || String(n); }

/** Small helper: returns a node from an HTML string. */
export function nodeFromHTML(s) {
  const tmpl = document.createElement('template');
  tmpl.innerHTML = s.trim();
  return tmpl.content.firstChild;
}

/** Trap focus within a container (used for modals + result panels). */
export function trapFocus(container) {
  const focusable = container.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (!focusable.length) return () => {};
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  const handler = (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };
  container.addEventListener('keydown', handler);
  return () => container.removeEventListener('keydown', handler);
}
