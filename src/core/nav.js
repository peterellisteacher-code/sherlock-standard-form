/**
 * Hash-based router. No framework. Each scene module exports a `render(root, params)`
 * function and (optionally) a `cleanup()` function. We mount/unmount on hash change.
 *
 * Routes:
 *   #/title              -> Title screen + act picker
 *   #/act/1              -> Act I: The Curious Case of the Missing Premise
 *   #/act/2              -> Act II: Convince Mycroft
 *   #/act/3              -> Act III: The Free Will Inquiry
 *   #/act/4              -> Act IV: The Final Deduction
 *   #/finale             -> Final reveal (after all four acts complete)
 */

import { Casebook } from './state.js?v=9';

const _routes = new Map();
let _currentScene = null;

export function registerScene(path, sceneModule) {
  _routes.set(path, sceneModule);
}

export function navigate(hash) {
  if (!hash.startsWith('#/')) hash = '#/' + hash.replace(/^[#/]+/, '');
  if (location.hash === hash) {
    _route();   // force re-render even on identical hash
  } else {
    location.hash = hash;
  }
}

function findRoute(hashPath) {
  // hashPath is e.g. "/act/2"
  for (const [routePath, mod] of _routes.entries()) {
    if (routePath === hashPath) return { mod, params: {} };
    // Simple segment matching for /act/:n
    const routeParts = routePath.split('/');
    const hashParts = hashPath.split('/');
    if (routeParts.length !== hashParts.length) continue;
    const params = {};
    let match = true;
    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        params[routeParts[i].slice(1)] = decodeURIComponent(hashParts[i]);
      } else if (routeParts[i] !== hashParts[i]) {
        match = false;
        break;
      }
    }
    if (match) return { mod, params };
  }
  return null;
}

async function _route() {
  const root = document.getElementById('app');
  if (!root) return;

  let hashPath = (location.hash || '#/title').replace(/^#/, '') || '/title';
  let resolved = findRoute(hashPath);

  if (!resolved) {
    hashPath = '/title';
    resolved = findRoute(hashPath);
  }

  // Cleanup previous scene
  if (_currentScene && typeof _currentScene.cleanup === 'function') {
    try { _currentScene.cleanup(); } catch (e) { console.warn('Scene cleanup error:', e); }
  }

  // Clear root, scroll to top, render
  root.innerHTML = '';
  window.scrollTo(0, 0);
  document.activeElement?.blur();

  const { mod, params } = resolved;
  _currentScene = mod;

  // Tracking for resume
  if (hashPath.startsWith('/act/')) {
    Casebook.visit(parseInt(params.n || '1', 10));
  }

  try {
    await mod.render(root, params);
    // Move focus to the first heading or <h1> for a11y
    const heading = root.querySelector('h1, [role="heading"]');
    heading?.setAttribute('tabindex', '-1');
    heading?.focus({ preventScroll: true });
  } catch (e) {
    console.error('Scene render error:', e);
    root.innerHTML = `<div class="stage stage-narrow">
      <h1>The case file is jammed.</h1>
      <p>Something went wrong loading this scene. Try <a href="#/title">returning to the index</a>.</p>
      <pre style="white-space: pre-wrap; color: var(--warning); font-family: var(--font-evidence); margin-top: 16px;">${escape(String(e.stack || e))}</pre>
    </div>`;
  }
}

function escape(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

window.addEventListener('hashchange', _route);

export function start() {
  if (!location.hash) location.hash = '#/title';
  _route();
}

/** Live region announcer (a11y). */
export function announce(message, polite = true) {
  const id = polite ? 'hud-polite' : 'hud-assertive';
  const el = document.getElementById(id);
  if (!el) return;
  // Clear then set so AT picks up the change even on identical text.
  el.textContent = '';
  setTimeout(() => { el.textContent = message; }, 60);
}
