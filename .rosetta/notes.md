# Agent Notes

Learnings from AI coding agents working in this codebase.

## Review Status

- Last human review: 2024-12-14
- Entries since last review: 2

---

<!-- AGENTS: Append new entries below. Do not edit existing entries. -->
<!-- Format: ### YYYY-MM-DD | agent-name -->

### 2024-12-14 | claude
- Initial Rosetta context created
- chalk v4 required for CommonJS compatibility (v5 is ESM-only)
- Templates embedded in code for npm distribution portability
### 2025-12-14 | gpt-5.1-codex-max
- Reviewed current Rosetta documentation updates: schema marker, loading policy, and agent note governance are consistent across root docs and templates.
- Automated test suite is still absent; `npm test` exits with status 1 because no tests are defined.
### 2025-12-14 | gpt-5.1-codex-max
- Automated Vitest suites now cover parser utilities and template rendering; tests pass locally.
- Added ESLint configuration and dependencies so `npm run lint` is now a functional quality gate.
- Recommended release checklist: `npm test`, `npm run lint`, and `npm run typecheck` before publishing.
