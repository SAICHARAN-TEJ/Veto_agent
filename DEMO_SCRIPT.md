# Veto Demo Script (60 Seconds)

## Goal

Show judges, in one minute, that Veto solves a real support problem and that memory is the central differentiator.

## 60-Second Run of Show

0-8s: Problem setup
- Open the app at `http://localhost:5173`.
- Say: "Support teams often repeat failed fixes because ticket memory is fragmented across people and time."

8-20s: Trigger the memory engine
- Select `Marcus Tan` from customer list.
- In draft box, type a known failed step like:
  - `Please clear your browser cache and try SSO again.`
- Pause while status shows `Querying Failure Memory...`.

20-35s: Show memory as the star
- Point to `MEMORY CONFLICT DETECTED`.
- Show `Before vs After Memory` block.
- Say: "Without memory, agent repeats failure. With memory, Veto intercepts and pivots instantly."

35-48s: Use better alternative
- Click `Use this suggestion` in the veto panel.
- Click `Send Response`.
- Open `Memory Recall Trace` and call out confidence + memory reference match.

48-60s: Close loop + business value
- Close ticket in modal.
- Highlight success toast and session counters:
  - `Conflicts Prevented`
  - `Memory Writes`
- Open ROI dialog and say: "These KPIs update from live demo actions, not static slides."

## What to Emphasize to Judges

- Real business pain: repeated failed troubleshooting drives churn and longer resolution cycles.
- Memory-first architecture: conflict detection happens before customer sees bad advice.
- Measurable impact: dashboard reflects session decisions in real time.

## Backup Lines (if asked)

- "This works even with partial data because memory recall combines customer history and solution index."
- "Each closed ticket writes back to memory, so the system improves continuously."
- "The same architecture can integrate with Zendesk/Salesforce via API hooks."

## Fast Demo Troubleshooting

- If backend is not reachable, confirm `VITE_API_BASE` in `frontend/.env` is `http://localhost:5000`.
- If no memory conflict appears, use customer `Marcus Tan` and SSO cache-clearing text exactly.
- If ports are occupied, restart backend first, then frontend.
