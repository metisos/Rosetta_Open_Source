# Rosetta

**Agent Codebase Understanding Protocol**

Rosetta is an open-source protocol and CLI tool that enables AI coding agents to quickly understand a codebase without exhausting their context window. It provides a standardized, token-efficient format for capturing essential codebase knowledge.

The name references the Rosetta Stone—the artifact that enabled translation of previously unreadable Egyptian hieroglyphics. Similarly, Rosetta serves as a translation layer between human-written code and agent understanding.

## The Problem

AI coding agents face a fundamental conflict:

1. **Deep understanding requires context** — Agents need to know architecture, conventions, patterns, and gotchas to be effective
2. **Context is expensive and limited** — Loading entire codebases is slow, costly, and counterproductive (signal lost in noise)
3. **Sessions are stateless** — Every new agent session starts from zero, re-learning what previous sessions discovered

### Current Workarounds (All Inadequate)

| Approach | Problem |
|----------|---------|
| Load everything | Context overflow, token waste, lost signal |
| README.md | Written for humans, narrative-heavy, not structured for agent parsing |
| Let agent explore | Slow, burns tokens on discovery, inconsistent results |
| Inline comments | Scattered, no hierarchy, cannot convey architecture |

## The Solution

Rosetta provides:

- **ROSETTA.md** — A standardized, token-efficient context file at your project root
- **.rosetta/modules/** — Deep-dive documentation for specific modules (auth, api, database, etc.)
- **.rosetta/notes.md** — Append-only file where agents record learnings for future sessions
- **CLI tooling** — Initialize, validate, and maintain Rosetta files

## Installation

```bash
npm install -g rosetta-context
```

## Quick Start

```bash
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
| `rosetta status` | Show staleness and coverage information |
| `rosetta add-module <name>` | Scaffold a new module file |
| `rosetta note <message>` | Manually add a note |
| `rosetta bootstrap` | Output the bootstrap protocol |

## ROSETTA.md Structure

The root file follows a standardized structure that agents depend on:

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

### For Claude Code (CLAUDE.md)

```markdown
## Project Context

This project uses Rosetta for agent context management.

1. Start by reading ROSETTA.md
2. Check Module Index for relevant deep-dives
3. Before finishing, add learnings to .rosetta/notes.md
```

### For Cursor (.cursorrules)

```markdown
When working in this codebase:
- Always read ROSETTA.md first for project context
- Load .rosetta/modules/*.md files relevant to your task
- Append discoveries to .rosetta/notes.md before ending
```

### For Aider

Add to your `.aider.conf.yml`:

```yaml
read:
  - ROSETTA.md
  - .rosetta/notes.md
```

## Bootstrap Protocol

For new projects, use the bootstrap protocol to have an AI agent analyze and populate Rosetta:

```bash
# Get the bootstrap prompt
rosetta bootstrap | pbcopy  # Copy to clipboard (macOS)
rosetta bootstrap | xclip -selection clipboard  # Linux

# Paste into your AI coding agent
```

The bootstrap protocol guides agents through:

1. Analyzing project structure and existing documentation
2. Identifying patterns, conventions, and architecture
3. Creating ROSETTA.md with all required sections
4. Scaffolding priority module files (auth, database, api)

## Token Efficiency

Rosetta is designed for minimal context consumption:

| File | Target Size | Maximum Size |
|------|-------------|--------------|
| ROSETTA.md | 800-1200 tokens | 2000 tokens |
| Module file | 400-600 tokens | 1000 tokens |
| notes.md | Grows over time | N/A |

**Typical selective load:** ~1500 tokens (root + 1 module)

### What to Include vs. Exclude

**Include:**
- Patterns that repeat across the codebase
- Non-obvious architectural decisions
- Things that would take 10+ minutes to discover
- Conventions that differ from framework defaults

**Exclude:**
- Standard framework behavior (documented elsewhere)
- Self-explanatory file purposes
- Information already in README (reference it instead)
- Aspirational patterns not actually used

## Configuration

The `.rosetta/config.yml` file controls CLI behavior:

```yaml
version: 1

staleness:
  warning: 30    # Days before showing staleness warning
  critical: 90   # Days before marking as critically stale

track:
  - src/services/**/*.ts
  - prisma/schema.prisma

ignore:
  - "*.test.ts"
  - "*.spec.ts"
  - "__tests__/**"

modules:
  auth:
    - src/services/auth/**
    - src/lib/auth.ts
```

## Programmatic API

Rosetta exports utilities for integration into coding agents:

```typescript
import {
  parseRosettaFile,
  validateSections,
  parseModuleIndex,
  parseAgentNotes,
  REQUIRED_SECTIONS,
  ROSETTA_PROTOCOL,
} from 'rosetta-context';

// Parse a ROSETTA.md file
const parsed = parseRosettaFile(content);

// Validate required sections
const validation = validateSections(parsed, REQUIRED_SECTIONS);

// Extract module index
const modules = parseModuleIndex(content);

// Parse agent notes
const notes = parseAgentNotes(notesContent);
```

## Agent Loading Protocol

When integrating Rosetta into a coding agent, follow this protocol:

### On Session Start

1. Read `ROSETTA.md` first (always)
2. Review the Module Index table
3. Load only relevant module files from `.rosetta/modules/`
4. Check `.rosetta/notes.md` for recent learnings

### During Work

- Refer to Conventions and Key Patterns when writing code
- Check Gotchas before modifying unfamiliar areas

### Before Session End

If you discovered something valuable:

1. Open `.rosetta/notes.md`
2. Append an entry:
   ```
   ### YYYY-MM-DD | [agent-name]
   - [Your learning here]
   ```
3. Keep entries concise and actionable
4. Do not duplicate existing notes or documented gotchas

## Contributing

Contributions are welcome. Please ensure:

- All CLI commands have corresponding tests
- Templates follow the token efficiency guidelines
- Documentation is updated for new features

## License

MIT License - see [LICENSE](LICENSE) for details.

## About

Rosetta is developed and maintained by Metis Analytics.

**Author:** Christian Johnson
**Email:** cjohnson@metisos.com
**Repository:** https://github.com/metisos/rosetta

---

*Like the Rosetta Stone unlocked ancient languages, Rosetta unlocks your codebase for AI agents.*
