const express = require('express');
const router = express.Router();
const { extractSolutions } = require('../lib/groq');
const { queryFailures, getMemoryProfile } = require('../lib/hindsight');

const RECOMMENDED_FIXES = {
  'clear browser cache': 'SSO token refresh via admin panel — navigate to Admin → Users → [Company] → Force SSO token refresh',
  'clear cookies': 'SSO token refresh via admin panel — navigate to Admin → Users → [Company] → Force SSO token refresh',
  'clear browser cache and cookies': 'SSO token refresh via admin panel',
  'disable browser extensions': 'Verify Okta integration settings — check SAML assertion expiry in SSO provider dashboard',
  'reset password': 'Check SSO provider user sync status — password resets bypass SSO in federated environments',
  'try incognito mode': 'Clear Okta session tokens at the identity provider level, not the browser level',
  'logout and login again': 'Force SSO token expiration and re-issue via Admin → Identity → Refresh tokens',
  'general troubleshooting': 'Review the customer\'s complete environment profile and escalate to Tier 2 with full session logs',
};

/**
 * POST /api/analyze
 * Extract solutions from draft, check against memory, return conflict analysis
 */
router.post('/analyze', async (req, res, next) => {
  try {
    const { ticketId, draft, customerId } = req.body;

    if (!draft || !customerId) {
      return res.status(400).json({ error: 'draft and customerId are required' });
    }

    // Step 1: Extract proposed solutions from draft
    const solutions = await extractSolutions(draft);

    if (!solutions || solutions.length === 0) {
      return res.json({ conflict: false, solutions: [], matches: [], message: 'No specific solutions found in draft' });
    }

    // Step 2: Query memory for each solution
    let topConflict = null;
    let topMatches = [];
    let highestCount = 0;

    for (const solution of solutions) {
      const matches = await queryFailures(customerId, solution);
      const totalCount = matches.reduce((sum, m) => sum + (m.count || 1), 0);

      if (totalCount > highestCount) {
        highestCount = totalCount;
        topConflict = solution;
        topMatches = matches;
      }
    }

    if (highestCount === 0) {
      return res.json({ conflict: false, solutions, matches: [], message: 'No memory conflicts found' });
    }

    // Step 3: Build conflict response
    const sortedMatches = topMatches.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const lastMatch = sortedMatches[0];
    const confidence = Math.min(0.99, 0.6 + highestCount * 0.12);

    // Find recommended fix
    const normalizedSolution = topConflict.toLowerCase();
    const recommended = Object.entries(RECOMMENDED_FIXES).find(([k]) =>
      normalizedSolution.includes(k) || k.includes(normalizedSolution.slice(0, 8))
    )?.[1] || RECOMMENDED_FIXES['general troubleshooting'];

    return res.json({
      conflict: true,
      proposed: topConflict,
      failCount: highestCount,
      lastAttempt: lastMatch?.timestamp ? lastMatch.timestamp.slice(0, 10) : 'Unknown',
      lastAgent: lastMatch?.agentId || 'Unknown',
      recommended: recommended.replace('[Company]', customerId),
      confidence,
      matches: sortedMatches.slice(0, 5),
      customerId,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/memory/:customerId
 * Return full memory profile for a customer
 */
router.get('/memory/:customerId', async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const profile = await getMemoryProfile(customerId);
    return res.json(profile);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
