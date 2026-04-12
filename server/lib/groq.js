/**
 * Groq LLM — Solution extraction from agent drafts
 *
 * Uses the Groq cloud API with the gsk_ API key.
 * Falls back to regex-based keyword extraction if Groq is unavailable.
 */

const Groq = require('groq-sdk');

let groq = null;

function getGroq() {
  if (!groq && process.env.GROQ_API_KEY) {
    try {
      groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      console.log('[Groq] ✓ Client initialized with API key:', process.env.GROQ_API_KEY.slice(0, 8) + '...');
    } catch (err) {
      console.error('[Groq] Failed to initialize:', err.message);
    }
  }
  return groq;
}

/**
 * Extract proposed solutions from an agent draft using Groq LLM.
 * Falls back to keyword matching if Groq is not configured or errors.
 */
async function extractSolutions(draft) {
  const client = getGroq();

  if (!client) {
    console.log('[Groq] No API key — using local extraction fallback');
    return extractSolutionsLocal(draft);
  }

  try {
    const chat = await client.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'system',
          content: 'You are a support ticket analyzer. Extract the specific technical solution(s) proposed in the agent draft. Return ONLY a JSON array of short solution strings (e.g. ["clear browser cache", "reinstall app"]). No explanation.',
        },
        {
          role: 'user',
          content: `Agent draft: "${draft}"`,
        },
      ],
      temperature: 0,
      max_tokens: 200,
    });

    const raw = chat.choices[0]?.message?.content?.trim() || '[]';
    console.log('[Groq] ✓ Extracted solutions from draft via LLM:', raw);

    // Parse bracketed JSON safely
    const match = raw.match(/\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]);
    return extractSolutionsLocal(draft);
  } catch (err) {
    console.error('[Groq] Extraction error:', err.message);
    return extractSolutionsLocal(draft);
  }
}

/**
 * Local keyword-based fallback for solution extraction.
 */
function extractSolutionsLocal(draft) {
  const lower = draft.toLowerCase();
  const patterns = [
    { pattern: /clear.{0,10}cache/i, solution: 'clear browser cache' },
    { pattern: /clear.{0,10}cookies/i, solution: 'clear cookies' },
    { pattern: /reinstall/i, solution: 'reinstall application' },
    { pattern: /reset.{0,10}password/i, solution: 'reset password' },
    { pattern: /disable.{0,10}extension/i, solution: 'disable browser extensions' },
    { pattern: /incognito|private.{0,10}window/i, solution: 'try incognito mode' },
    { pattern: /restart.{0,10}browser/i, solution: 'restart browser' },
    { pattern: /sso.{0,10}token|token.{0,10}refresh/i, solution: 'SSO token refresh' },
    { pattern: /logout.{0,10}login|re-?login|sign.{0,5}out/i, solution: 'logout and login again' },
    { pattern: /update.{0,10}browser/i, solution: 'update browser' },
  ];

  const found = patterns.filter(({ pattern }) => pattern.test(lower)).map(({ solution }) => solution);
  return found.length > 0 ? found : ['general troubleshooting'];
}

module.exports = { extractSolutions };
