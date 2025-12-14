# Rosetta

> Agent codebase understanding protocol - Help AI coding agents understand your codebase efficiently

[![npm version](https://badge.fury.io/js/rosetta-context.svg)](https://badge.fury.io/js/rosetta-context)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Rosetta is an open-source protocol and CLI tool that enables AI coding agents (Claude Code, Codex, Cursor, Aider, etc.) to quickly understand a codebase without blowing out their context window.

**The name references the Rosetta Stone**—the artifact that enabled translation of previously unreadable Egyptian hieroglyphics. Similarly, Rosetta serves as a translation layer between human-written code and agent understanding.

## The Problem

AI coding agents face a fundamental conflict:

1. **Deep understanding requires context** — Agents need to know architecture, conventions, patterns, and gotchas to be effective
2. **Context is expensive and limited** — Loading entire codebases is slow, costly, and counterproductive
3. **Sessions are stateless** — Every new agent session starts from zero, re-learning what previous sessions discovered

## The Solution

Rosetta provides:

- **`ROSETTA.md`** — A standardized, token-efficient context file at your project root
- **`.rosetta/modules/`** — Deep-dive documentation for specific modules (auth, api, database, etc.)
- **`.rosetta/notes.md`** — Append-only file for agents to record learnings
- **CLI tooling** — Initialize, validate, and maintain Rosetta files

## Quick Start

```bash
# Install globally
npm install -g rosetta-context

# Initialize Rosetta in your project
rosetta init

# Or initialize and get the bootstrap prompt for AI population
rosetta init --bootstrap

# Check documentation status
rosetta status

# Validate structure
rosetta validate
```

## File Structure

```
your-project/
├── ROSETTA.md                 # Root context file (agents read this first)
└── .rosetta/
    ├── modules/
    │   ├── auth.md            # Authentication module deep-dive
    │   ├── api.md             # API patterns and conventions
    │   └── database.md        # Database schema and queries
    ├── notes.md               # Agent-contributed learnings
    └── config.yml             # CLI configuration
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `rosetta init` | Initialize Rosetta in a project |
| `rosetta init --bootstrap` | Initialize and output bootstrap prompt for AI |
| `rosetta validate` | Check Rosetta files for structural issues |
| `rosetta status` | Show staleness and coverage info |
| `rosetta add-module <name>` | Scaffold a new module file |
| `rosetta note <message>` | Manually add a note |
| `rosetta bootstrap` | Output the bootstrap protocol |

## ROSETTA.md Structure

```markdown
# Rosetta

> One-sentence project description

## Overview
2-4 sentences about what this project does.

## Tech Stack
- Language: TypeScript
- Framework: Next.js 14
- Database: PostgreSQL + Prisma

## Architecture
[ASCII diagram of components]

## Directory Structure
src/
├── app/      # Next.js pages
├── services/ # Business logic
└── lib/      # Utilities

## Conventions
- Naming: camelCase for functions
- Exports: Named exports only
- Error handling: Try/catch with logger

## Entry Points
| File | Purpose |
|------|---------|
| src/app/layout.tsx | Root layout |

## Key Patterns
[Code examples of recurring patterns]

## Module Index
| Module | Path | Description | Load When |
|--------|------|-------------|-----------|
| auth | .rosetta/modules/auth.md | Authentication | Auth work |

## Gotchas
- Thing that will bite you if not warned

## Agent Notes
<!-- Agents append learnings here -->
```

## Agent Integration

### Claude Code (CLAUDE.md)

```markdown
## Project Context

This project uses Rosetta for agent context management.

1. Start by reading ROSETTA.md
2. Check Module Index for relevant deep-dives
3. Before finishing, add learnings to .rosetta/notes.md
```

### Cursor (.cursorrules)

```markdown
When working in this codebase:
- Always read ROSETTA.md first for project context
- Load .rosetta/modules/*.md files relevant to your task
- Append discoveries to .rosetta/notes.md before ending
```

### Metis Code

Rosetta is built into Metis Code. It automatically:
- Reads ROSETTA.md on session start
- Loads relevant module files based on task
- Appends learnings to notes.md

## Bootstrap Protocol

For new projects, use the bootstrap protocol to have an AI agent populate Rosetta:

```bash
# Get the bootstrap prompt
rosetta bootstrap | pbcopy  # Copy to clipboard (macOS)

# Paste into your AI coding agent
```

The bootstrap protocol guides agents through:
1. Analyzing project structure
2. Identifying patterns and conventions
3. Creating ROSETTA.md with appropriate sections
4. Scaffolding key module files

## Token Efficiency

Rosetta is designed for minimal context consumption:

| File | Target Size | Max Size |
|------|-------------|----------|
| ROSETTA.md | 800-1200 tokens | 2000 tokens |
| Module file | 400-600 tokens | 1000 tokens |

Typical selective load: ~1500 tokens (root + 1 module)

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

Christian Johnson ([@metisos](https://github.com/metisos))

---

*Like the Rosetta Stone unlocked ancient languages, Rosetta unlocks your codebase for AI agents.*
