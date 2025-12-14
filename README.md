# Rosetta

**Agent-First Codebase Context Protocol**

Rosetta is an open-source protocol that enables AI coding agents to build and share institutional knowledge about codebases. Unlike documentation written for humans, Rosetta is designed BY agents, FOR agents.

## The Philosophy

**Agents are the primary users of Rosetta, not humans.**

When an AI agent explores your codebase, it discovers patterns, conventions, gotchas, and architecture. Without Rosetta, this knowledge evaporates when the session ends. With Rosetta, agents persist their learnings for future sessions.

```
Session 1: Agent explores codebase → Creates ROSETTA.md
Session 2: Agent loads ROSETTA.md → Already understands the project
Session 3: Agent discovers new gotcha → Adds to notes.md
Session 4: All agents benefit from accumulated knowledge
```

## How It Works

### Agent Creates Context

When you tell an agent "init rosetta" or "document this codebase":

1. Agent explores: reads package.json, scans src/, identifies patterns
2. Agent creates ROSETTA.md with structured context
3. Agent creates .rosetta/notes.md for ongoing learnings
4. Future sessions automatically load this context

### Agent Maintains Context

As agents work in the codebase:

- Discover non-obvious behavior → Add to notes.md
- Analyze complex module → Create module documentation
- Notice convention change → Update ROSETTA.md

### Agent Consumes Context

On session start:

- ROSETTA.md is automatically loaded into agent context
- Relevant modules loaded based on the task
- Recent notes provide session-specific insights

## File Structure

```
your-project/
├── ROSETTA.md                 # Root context (800-1200 tokens)
└── .rosetta/
    ├── modules/
    │   ├── auth.md            # Deep-dive on authentication
    │   ├── api.md             # API patterns documentation
    │   └── database.md        # Database conventions
    ├── notes.md               # Agent learnings (append-only)
    └── config.yml             # Configuration
```

## Integration with Coding Agents

### Metis Code (Built-in)

Rosetta is fully integrated. The agent will:
- Automatically load ROSETTA.md context
- Create Rosetta when asked
- Add notes while working
- Update documentation as codebase evolves

```bash
# In a Metis Code session:
> init rosetta
# Agent explores and creates comprehensive context

> what does this project do?
# Agent uses Rosetta context to explain
```

### Claude Code

Add to your CLAUDE.md:

```markdown
## Rosetta Protocol

This project uses Rosetta for agent context.

On session start:
1. Read ROSETTA.md for project understanding
2. Check .rosetta/modules/ for relevant deep-dives

During work:
- Reference conventions from ROSETTA.md
- Check gotchas before modifying unfamiliar areas

Before session end:
- Add non-obvious discoveries to .rosetta/notes.md
- Update ROSETTA.md if architecture changed
```

### Cursor

Add to .cursorrules:

```markdown
This codebase uses Rosetta for AI context management.

Always read ROSETTA.md first to understand:
- Project architecture and tech stack
- Coding conventions and patterns
- Known gotchas and warnings

Append learnings to .rosetta/notes.md:
### YYYY-MM-DD | cursor
- [Your discovery here]
```

### Aider

Add to .aider.conf.yml:

```yaml
read:
  - ROSETTA.md
  - .rosetta/notes.md
```

## CLI Tool (Human Helper)

The CLI is provided for humans who want to manually scaffold or inspect Rosetta files.

### Installation

```bash
npm install -g rosetta-context
```

### Commands

```bash
# Scaffold empty Rosetta files (agent will populate)
rosetta init

# Initialize and get prompt for AI to populate
rosetta init --bootstrap

# Check documentation staleness
rosetta status

# Validate structure
rosetta validate

# Scaffold a module file
rosetta add-module auth

# Add a note manually
rosetta note "The cache invalidates every 5 minutes"

# Output bootstrap prompt for AI population
rosetta bootstrap
```

### Bootstrap Protocol

For humans who want to kickstart Rosetta with AI help:

```bash
# Get the bootstrap prompt
rosetta bootstrap | pbcopy

# Paste into your AI agent and it will analyze + populate
```

## ROSETTA.md Format

Optimized for token efficiency and agent parsing:

```markdown
# Rosetta

> One-sentence project description

## Overview
2-4 sentences about what this project does.

## Tech Stack
- TypeScript 5.x
- Next.js 14 (App Router)
- PostgreSQL + Prisma

## Architecture
┌─────────┐     ┌──────────┐     ┌────────┐
│ Next.js │────▶│ Services │────▶│ Prisma │
└─────────┘     └──────────┘     └────────┘

## Directory Structure
src/
├── app/        # Next.js pages and layouts
├── services/   # Business logic layer
├── lib/        # Shared utilities
└── types/      # TypeScript definitions

## Conventions
- Functions: camelCase
- Components: PascalCase
- Files: kebab-case
- Exports: Named only (no default exports)

## Entry Points
| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout, providers |
| `src/services/index.ts` | Service barrel export |

## Key Patterns
[Code examples agents should follow]

## Module Index
| Module | Path | Description | Load When |
|--------|------|-------------|-----------|
| auth | `.rosetta/modules/auth.md` | Auth flow | Auth work |
| api | `.rosetta/modules/api.md` | API patterns | API work |

## Gotchas
- Database connections pool exhausts if not released
- Auth middleware must run before route handlers
- Tests require DATABASE_URL even for unit tests

## Agent Notes
<!-- Agents append learnings below -->
### 2024-01-15 | claude
- Config must load before database init
```

## Token Budget

Rosetta is designed for minimal context consumption:

| File | Target | Maximum |
|------|--------|---------|
| ROSETTA.md | 800-1200 tokens | 2000 tokens |
| Module file | 400-600 tokens | 1000 tokens |
| notes.md | Grows over time | Prune periodically |

**Typical load:** ~1500 tokens (root + 1 relevant module)

## Programmatic API

For agent developers integrating Rosetta:

```typescript
import {
  parseRosettaFile,
  validateSections,
  parseModuleIndex,
  parseAgentNotes,
  REQUIRED_SECTIONS
} from 'rosetta-context';

// Parse ROSETTA.md content
const parsed = parseRosettaFile(content);

// Validate structure
const validation = validateSections(parsed, REQUIRED_SECTIONS);

// Get module index for selective loading
const modules = parseModuleIndex(content);

// Parse notes for recent learnings
const notes = parseAgentNotes(notesContent);
```

## Why "Rosetta"?

The Rosetta Stone enabled translation of previously unreadable Egyptian hieroglyphics by providing the same text in three scripts.

Similarly, Rosetta translates human codebases into agent-readable context, enabling AI to understand projects that would otherwise require extensive exploration.

## Contributing

Contributions welcome. Focus areas:
- Agent integration examples
- Token efficiency improvements
- Validation tooling

## License

MIT License - see [LICENSE](LICENSE) for details.

## About

Rosetta is developed by Metis Analytics.

**Author:** Christian Johnson
**Email:** cjohnson@metisos.com
**Repository:** https://github.com/metisos/rosetta

---

*Rosetta: Institutional knowledge for AI agents.*
