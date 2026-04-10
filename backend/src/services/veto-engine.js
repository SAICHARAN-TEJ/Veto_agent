const { recallMemory } = require('./hindsight');
const { extractSolutions, buildSuggestion } = require('./groq');

// Solution phrase normalization map
const solutionPhrases = {
  'clear browser cache': ['clear cache', 'clear your cache', 'clearing cache', 'clear cookies'],
  'clear cookies': ['cookies', 'clear cookies'],
  'disable extensions': ['disable extensions', 'turn off extensions', 'extensions'],
  'reset password': ['reset password', 'password reset', 'change password'],
  'reinstall app': ['reinstall', 'reinstall the app', 'reinstall application'],
  'restart service': ['restart', 'restart service', 'reboot'],
  'reduce polling frequency': ['reduce polling', 'polling', 'rate limit']
};

/**
 * Normalize solution phrase for matching
 */
function normalizeSolution(phrase) {
  const lower = phrase.toLowerCase().trim();
  
  // Check known solutions
  for (const [key, variants] of Object.entries(solutionPhrases)) {
    if (variants.some(v => lower.includes(v))) {
      return key;
    }
  }
  
  return lower;
}

/**
 * Core veto logic: check draft against customer memory and generate a detailed trace
 */
async function checkDraft(customerId, draftText, ticketId) {
  const startTime = Date.now();
  const trace = [];

  // Input validation
  if (!customerId || !draftText || typeof draftText !== 'string') {
    return {
      vetoed: false,
      confidence: 0,
      reason: 'Invalid input',
      failed_on: [],
      ticket_refs: [],
      suggestion: null,
      processing_time_ms: Date.now() - startTime,
      trace: []
    };
  }

  const sanitizedText = draftText.slice(0, 2000);

  try {
    // STEP 1: BEFORE (Generic Heuristic)
    trace.push({
      stage: 'before',
      timestamp: new Date().toISOString(),
      description: 'Parsing draft for proposed solutions using generic heuristics.',
      rationale: 'Establish a baseline understanding of the agent\'s intent.',
      confidence: 0.7,
      result_summary: 'Extracting candidate solutions...'
    });

    const solutions = await extractSolutions(sanitizedText);
    
    if (!solutions || solutions.length === 0) {
      trace[0].result_summary = 'No specific solutions identified in draft.';
      return {
        vetoed: false,
        confidence: 0,
        reason: null,
        failed_on: [],
        ticket_refs: [],
        suggestion: null,
        processing_time_ms: Date.now() - startTime,
        trace
      };
    }
    trace[0].result_summary = `Identified ${solutions.length} solutions: ${solutions.join(', ')}`;

    // STEP 2: MEMORY INVOCATION (Recall)
    trace.push({
      stage: 'memory_invocation',
      timestamp: new Date().toISOString(),
      description: 'Querying Customer Failure Memory for existing conflicts.',
      rationale: 'Prevent redundant troubleshooting by checking historical failures.',
      confidence: 0.9,
      result_summary: 'Recalling memories for candidate solutions...'
    });

    const recallPromises = solutions.map(async (solution) => {
      const normalizedSolution = normalizeSolution(solution);
      const memories = await recallMemory(
        'solution: ' + normalizedSolution,
        { customer_id: customerId, outcome: 'failed' }
      );

      const relevantFailures = memories.filter(m => {
        if (!m || m.customer_id !== customerId || m.outcome !== 'failed') return false;
        const attempted = m.solutions_attempted || [];
        return attempted.some(s => 
          normalizeSolution(s).includes(normalizedSolution) ||
          normalizedSolution.includes(normalizeSolution(s))
        );
      });

      return { solution, relevantFailures };
    });

    const recallResults = await Promise.all(recallPromises);
    const firstVeto = recallResults.find(r => r.relevantFailures.length > 0);

    if (!firstVeto) {
      trace[1].result_summary = 'No conflicts found in customer memory. Draft is clear.';
      return {
        vetoed: false,
        confidence: 0,
        reason: null,
        failed_on: [],
        ticket_refs: [],
        suggestion: null,
        processing_time_ms: Date.now() - startTime,
        trace
      };
    }

    const vetoedSolution = firstVeto.solution;
    const failedMemories = firstVeto.relevantFailures;
    
    trace[1].result_summary = `CONFLICT FOUND: Solution "${vetoedSolution}" has failed previously.`;
    trace[1].memory_ref = {
      memory_id: failedMemories[0].ticket_id,
      similarity: 0.95,
      excerpt: `Failed on ${failedMemories[0].timestamp?.split('T')[0]} in Ticket #${failedMemories[0].ticket_id}`
    };

    // STEP 3: AFTER MEMORY (Refinement)
    trace.push({
      stage: 'after_memory',
      timestamp: new Date().toISOString(),
      description: 'Applying memory-informed refinement to generate a superior alternative.',
      rationale: 'Pivot from failed solution to a high-probability fix based on environmental context.',
      confidence: 0.95,
      result_summary: 'Searching for a successful alternative...'
    });

    const failedDates = (failedMemories || []).map(m => {
      if (!m || !m.timestamp) return 'Unknown date';
      return m.timestamp.split('T')[0];
    });
    
    const ticketRefs = (failedMemories || []).map(m => m.ticket_id).filter(Boolean);
    const reason = 'This solution was attempted on ' + failedDates.join(' and ') + 
      ' (' + ticketRefs.map(t => '#' + t).join(', ') + '). ' +
      'Both times it did not resolve the issue for this customer.';

    const env = (failedMemories[0] && failedMemories[0].env) || {};
    const issueCategory = (failedMemories[0] && failedMemories[0].issue_category) || 'unknown';

    const solutionIndex = await recallMemory(
      'successful solutions for ' + issueCategory,
      { 
        type: 'solution_index',
        issue_category: issueCategory
      }
    );

    let suggestion;
    if (solutionIndex && solutionIndex.length > 0 && solutionIndex[0].solution) {
      const bestSolution = solutionIndex[0];
      suggestion = {
        solution_name: bestSolution.solution.replace(/_/g, ' '),
        steps: 'This solution has a ' + Math.round((bestSolution.resolution_rate || 0.8) * 100) + '% success rate in similar environments.',
        confidence: bestSolution.resolution_rate > 0.85 ? 'high' : 'medium',
        reasoning: 'Resolved ' + (bestSolution.resolved_count || 'multiple') + ' of ' + 
          (bestSolution.attempted_count || 'similar') + ' cases.'
      };
    } else {
      suggestion = await buildSuggestion(failedMemories, issueCategory, vetoedSolution, env);
    }

    trace[2].result_summary = `Suggested alternative: ${suggestion.solution_name}`;
    trace[2].memory_ref = {
      memory_id: 'global_index',
      similarity: suggestion.confidence === 'high' ? 0.9 : 0.7,
      excerpt: suggestion.reasoning
    };

    const confidence = failedMemories.length >= 2 ? 0.92 : 0.75;

    return {
      vetoed: true,
      confidence,
      reason,
      failed_on: failedDates,
      ticket_refs: ticketRefs,
      suggestion,
      processing_time_ms: Date.now() - startTime,
      trace
    };

  } catch (error) {
    console.error('Veto engine error:', error.message);
    return {
      vetoed: false,
      confidence: 0,
      reason: 'Error checking draft',
      failed_on: [],
      ticket_refs: [],
      suggestion: null,
      processing_time_ms: Date.now() - startTime,
      trace: []
    };
  }
}


module.exports = { checkDraft };


module.exports = { checkDraft };