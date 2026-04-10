const express = require('express');
const { recallMemory } = require('../services/hindsight');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/:issue_category', asyncHandler(async (req, res) => {
  const { issue_category } = req.params;
  const { env_sso, env_browser } = req.query;

  const filters = {
    type: 'solution_index',
    issue_category
  };

  if (env_sso) filters.env_sso_provider = env_sso;
  if (env_browser) filters.env_browser_family = env_browser;

  const solutionIndex = await recallMemory(
    'successful solutions for ' + issue_category,
    filters
  );

  const solutions = solutionIndex
    .filter(s => s.solution && s.resolution_rate)
    .sort((a, b) => b.resolution_rate - a.resolution_rate)
    .slice(0, 3)
    .map(s => ({
      name: s.solution.replace(/_/g, ' '),
      resolution_rate: s.resolution_rate,
      case_count: s.attempted_count || 0,
      env_match_score: (env_sso === s.env_sso_provider ? 0.5 : 0) + (env_browser === s.env_browser_family ? 0.5 : 0),
      steps: 'This solution has resolved ' + (s.resolved_count || 'multiple') + ' similar cases.'
    }));

  res.json({ solutions });
}));


module.exports = router;
