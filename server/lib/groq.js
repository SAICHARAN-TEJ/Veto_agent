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
 * Generate alternative solution options from failed solutions.
 * Falls back to local curated alternatives when Groq is unavailable.
 */
async function generateAlternatives(failedSolutions, ticketContext = '') {
  const normalizedFailed = Array.isArray(failedSolutions)
    ? failedSolutions.map((s) => String(s || '').toLowerCase().trim()).filter(Boolean)
    : [];

  const client = getGroq();
  if (!client) {
    console.log('[Groq] No API key — using local alternatives fallback');
    return generateAlternativesLocal(normalizedFailed, ticketContext);
  }

  try {
    const chat = await client.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'system',
          content: 'You are a senior support engineer. Given failed solutions, propose 3-5 DIFFERENT alternatives not repeating failed ones. Return ONLY a JSON array. Each item must be an object: {"solution":"...","steps":["step1","step2"]}.',
        },
        {
          role: 'user',
          content: `Failed solutions: ${JSON.stringify(normalizedFailed)}\nTicket context: ${ticketContext || 'N/A'}`,
        },
      ],
      temperature: 0.2,
      max_tokens: 350,
    });

    const raw = chat.choices[0]?.message?.content?.trim() || '[]';
    console.log('[Groq] ✓ Generated alternatives via LLM:', raw);

    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) {
      return generateAlternativesLocal(normalizedFailed, ticketContext);
    }

    const parsed = JSON.parse(match[0]);
    const cleaned = Array.isArray(parsed)
      ? parsed
          .map((item) => {
            if (typeof item === 'string') {
              return { solution: item.trim(), steps: [] };
            }
            if (!item || typeof item !== 'object') return null;
            const solution = String(item.solution || '').trim();
            if (!solution) return null;
            const steps = Array.isArray(item.steps)
              ? item.steps.map((step) => String(step || '').trim()).filter(Boolean)
              : [];
            return { solution, steps };
          })
          .filter(Boolean)
      : [];

    if (cleaned.length === 0) {
      return generateAlternativesLocal(normalizedFailed, ticketContext);
    }

    return cleaned.slice(0, 5);
  } catch (err) {
    console.error('[Groq] Alternatives generation error:', err.message);
    return generateAlternativesLocal(normalizedFailed, ticketContext);
  }
}

/**
 * Local keyword-based fallback for solution extraction.
 */
function extractSolutionsLocal(draft) {
  const lower = draft.toLowerCase();
  const patterns = [
    { pattern: /clear(?:ing)?[\s\S]{0,30}cache/i, solution: 'clear browser cache' },
    { pattern: /clear(?:ing)?[\s\S]{0,30}cookies?/i, solution: 'clear cookies' },
    { pattern: /cache[\s\S]{0,20}cookies?|cookies?[\s\S]{0,20}cache/i, solution: 'clear browser cache and cookies' },
    { pattern: /reinstall/i, solution: 'reinstall application' },
    { pattern: /reset.{0,10}password/i, solution: 'reset password' },
    { pattern: /disable.{0,15}extensions?/i, solution: 'disable browser extensions' },
    { pattern: /incognito|private.{0,10}window/i, solution: 'try incognito mode' },
    { pattern: /restart.{0,10}browser/i, solution: 'restart browser' },
    { pattern: /sso.{0,15}token|token.{0,15}refresh/i, solution: 'SSO token refresh' },
    { pattern: /logout.{0,10}login|re-?login|sign.{0,5}out/i, solution: 'logout and login again' },
    { pattern: /update.{0,10}browser/i, solution: 'update browser' },
  ];

  const found = patterns.filter(({ pattern }) => pattern.test(lower)).map(({ solution }) => solution);
  return found.length > 0 ? found : ['general troubleshooting'];
}

function generateAlternativesLocal(failedSolutions, ticketContext = '') {
  const pool = [
    {
      solution: 'force SSO token refresh',
      steps: [
        'Open admin identity console',
        'Expire active SSO sessions for the user',
        'Ask user to sign in again',
      ],
    },
    {
      solution: 'verify identity provider claim mapping',
      steps: [
        'Open SSO provider app settings',
        'Validate attribute/claim mapping',
        'Re-test sign-in with test account',
      ],
    },
    {
      solution: 'update browser to latest stable version',
      steps: [
        'Check current browser version',
        'Apply stable update',
        'Retry authentication flow',
      ],
    },
    {
      solution: 'disable conflicting browser extensions',
      steps: [
        'Temporarily disable auth/privacy extensions',
        'Reload application',
        'Validate login flow',
      ],
    },
    {
      solution: 'collect HAR logs and escalate to tier 2',
      steps: [
        'Capture HAR during reproduction',
        'Attach logs and timestamps',
        'Escalate with environment metadata',
      ],
    },
  ];

  const excluded = new Set(failedSolutions.map((s) => s.toLowerCase()));
  const contextLower = String(ticketContext || '').toLowerCase();

  const rankedPool = pool
    .map((item) => {
      let score = 0;
      const lowerSolution = item.solution.toLowerCase();
      if (contextLower.includes('sso') || contextLower.includes('okta')) {
        if (lowerSolution.includes('sso') || lowerSolution.includes('identity')) score += 2;
      }
      if (contextLower.includes('browser')) {
        if (lowerSolution.includes('browser') || lowerSolution.includes('extension')) score += 2;
      }
      return { ...item, score };
    })
    .filter((item) => {
      const solutionLower = item.solution.toLowerCase();
      return !Array.from(excluded).some((failed) => failed && solutionLower.includes(failed));
    })
    .sort((a, b) => b.score - a.score)
    .map(({ score, ...rest }) => rest);

  return rankedPool.slice(0, 5);
}

module.exports = { extractSolutions, generateAlternatives };
