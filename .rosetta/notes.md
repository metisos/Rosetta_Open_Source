# Agent Notes

Learnings from AI coding agents working in this codebase.

## Review Status

- Last human review: 2024-12-14
- Entries since last review: 4

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

### 2025-12-15 | claude
- Fixed version mismatch: CLI now reads version from package.json instead of hardcoding
- Added comprehensive test coverage: git.test.ts (16 tests), commands.test.ts (12 tests) - now 42 total
- Added `rosetta setup-agent` command to configure CLAUDE.md, .cursorrules, .aider.conf.yml automatically
- Added `rosetta init --lite` for new projects - creates only agent configs, no ROSETTA.md
- Made Rosetta self-propagating: bootstrap prompt now includes Step 4 to update agent instruction files
- Agent configs now include staleness checking (<30 days fresh, 30-90 review, >90 verify)
- Agents are instructed to UPDATE outdated sections, not just read - keeps docs alive
- Agent configs include decision tree for when to create ROSETTA.md in new projects
- Key insight: same agent can init Rosetta, no separate LLM needed - agents self-manage the lifecycle
