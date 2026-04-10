const Groq = require('groq-sdk');
require('dotenv').config();
const config = require('../config');

const groq = new Groq({ apiKey: config.groqApiKey });

const REQUEST_TIMEOUT = 10000; // 10 seconds

async function withTimeout(promise, timeoutMs) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out')), timeoutMs)
  );
  return Promise.race([promise, timeout]);
}

async function extractSolutions(draftText) {
  try {
    const completion = await withTimeout(groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a solution extractor. Given a support agent draft response, return ONLY a JSON array of the specific solutions or fixes being suggested. Example: ["clear browser cache", "restart the service"]. Return only the JSON array, nothing else.'
        },
        {
          role: 'user',
          content: draftText
        }
      ],
      model: 'qwen/qwen3-32b',
      temperature: 0.1,
      max_tokens: 200
    }), REQUEST_TIMEOUT);
    
    const responseText = completion.choices[0]?.message?.content || '[]';
    
    try {
      const solutions = JSON.parse(responseText);
      return Array.isArray(solutions) ? solutions : [];
    } catch (e) {
      const matches = responseText.match(/"([^"]+)"/g);
      if (matches) {
        return matches.map(m => m.replace(/"/g, ''));
      }
      return [];
    }
  } catch (error) {
    console.error('Groq extractSolutions error:', error.message);
    return [];
  }
}

async function buildSuggestion(customerHistory, issueCategory, vetoedSolution, env) {
  try {
    const historyText = customerHistory.map(h => 
      'Ticket ' + h.ticket_id + ': tried "' + (h.solutions_attempted?.join(', ')) + '", outcome: ' + h.outcome
    ).join('\n');

    const prompt = 'Customer: ' + (customerHistory[0]?.company || 'Unknown') + '\nEnvironment: ' + (env.browser || 'Unknown') + ', ' + (env.os || 'Unknown') + ', SSO: ' + (env.sso_provider || 'None') + '\nIssue category: ' + issueCategory + '\nFailed solution: ' + vetoedSolution + '\nHistory:\n' + historyText + '\n\nSuggest ONE specific alternative fix that has not been tried yet.';

    const completion = await withTimeout(groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a senior support engineer. Given a customer ticket history and failed solutions, suggest ONE specific alternative fix. Be concrete and actionable. Format: { "solution_name": "string", "steps": "string", "confidence": "high"|"medium", "reasoning": "string" }'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'qwen/qwen3-32b',
      temperature: 0.3,
      max_tokens: 400
    }), REQUEST_TIMEOUT);

    const responseText = completion.choices[0]?.message?.content || '{}';
    
    try {
      return JSON.parse(responseText);
    } catch (e) {
      return {
        solution_name: 'Contact technical support for escalation',
        steps: 'Escalate this case to the technical team for deeper investigation.',
        confidence: 'medium',
        reasoning: 'Multiple standard solutions have failed. Manual investigation needed.'
      };
    }
  } catch (error) {
    console.error('Groq buildSuggestion error:', error.message);
    return {
      solution_name: 'Escalate to senior support',
      steps: 'Escalate this ticket for specialized assistance.',
      confidence: 'medium',
      reasoning: 'Unable to generate automatic suggestion.'
    };
  }
}

module.exports = { extractSolutions, buildSuggestion };
