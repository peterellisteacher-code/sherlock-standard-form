/**
 * Browser-side wrapper for /api/judge (Netlify Function backed by Anthropic Haiku 4.5).
 * Returns parsed JSON. On failure, surfaces a graceful error.
 */

export async function judge({ stage, payload, history = [] }) {
  const t0 = performance.now();
  try {
    const res = await fetch('/api/judge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage, payload, history })
    });
    const elapsed = Math.round(performance.now() - t0);

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      let errorBody = {};
      try { errorBody = JSON.parse(text); } catch {}
      const msg = errorBody.error || `Server returned ${res.status}`;
      console.warn(`[judge] ${stage} failed in ${elapsed}ms:`, msg);
      return { ok: false, error: msg, status: res.status };
    }

    const data = await res.json();
    console.debug(`[judge] ${stage} ok in ${elapsed}ms`);
    return { ok: true, data };
  } catch (e) {
    console.error('[judge] network error:', e);
    return { ok: false, error: 'The post-office at Baker Street appears to be closed. Check your connection and try again.', status: 0 };
  }
}

/**
 * Optional: streaming variant (not used at launch — Haiku is fast enough that
 * blocking responses feel snappy on a school network. Keep this stub in case
 * we add streaming for the longer Sapolsky exchange.)
 */
export async function judgeStream() {
  throw new Error('Streaming not implemented in v1');
}
