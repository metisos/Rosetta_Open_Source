# Rosetta

**The Open Protocol for AI Agent Codebase Understanding**

Rosetta is an open-source protocol and toolset that enables AI coding agents to build, share, and persist institutional knowledge about codebases. It solves a fundamental problem in AI-assisted development: **context loss between sessions**.

## Why Rosetta Matters

### The Problem

Every time an AI coding agent starts a new session, it faces the same challenge:

```
Session 1: Agent spends 20 minutes exploring codebase, learning patterns
Session 2: All that knowledge is gone. Start over.
Session 3: Same exploration. Same wasted time.
Session 4: Repeat indefinitely.
```

AI agents are stateless. They cannot remember what they learned. Each session, they must:
- Re-discover project architecture
- Re-learn coding conventions
- Re-identify entry points and patterns
- Re-encounter (and re-solve) the same gotchas

This wastes tokens, time, and creates inconsistent results.

### Current Workarounds (All Inadequate)

| Approach | Problem |
|----------|---------|
| Load entire codebase | Context overflow, token waste, signal lost in noise |
| README.md | Written for humans, narrative-heavy, not structured for agents |
| Let agent explore | Slow, expensive, inconsistent results |
| Inline comments | Scattered, no hierarchy, cannot convey architecture |
| CLAUDE.md / .cursorrules | Better, but no standard format, no persistence mechanism |

### The Solution: Rosetta

Rosetta provides:

1. **A Standard Format** - ROSETTA.md with defined sections agents depend on
2. **Modular Deep-Dives** - .rosetta/modules/ for complex subsystems
3. **Persistent Learning** - .rosetta/notes.md where agents record discoveries
4. **Token Efficiency** - Designed for ~1500 tokens total context load
5. **Agent-First Design** - Created BY agents, FOR agents

```
Session 1: Agent explores → Creates ROSETTA.md → Records learnings
Session 2: Agent loads ROSETTA.md → Immediately productive
Session 3: Agent discovers gotcha → Adds to notes.md
Session 4: All agents benefit from accumulated knowledge
```

## How It Works

### For Developers

1. **Initialize Rosetta** in your project:
   ```bash
   npx rosetta-context init
   ```

2. **Let your AI agent populate it** by asking:
   ```
   "Analyze this codebase and populate ROSETTA.md"
   ```

3. **That's it.** Future AI sessions will automatically benefit.

### For AI Agents

Rosetta is designed for you to:

1. **Read** - Load ROSETTA.md at session start for instant context
2. **Write** - Create ROSETTA.md when working on new codebases
3. **Update** - Add discoveries to notes.md as you work
4. **Extend** - Create module files for complex areas you analyze

See [AGENT_INSTRUCTIONS.md](AGENT_INSTRUCTIONS.md) for detailed protocols.

## File Structure

```
your-project/
├── ROSETTA.md                 # Root context (800-1200 tokens)
└── .rosetta/
    ├── modules/
    │   ├── auth.md            # Authentication deep-dive
    │   ├── api.md             # API patterns
    │   └── database.md        # Database conventions
    ├── notes.md               # Agent learnings (append-only)
    └── config.yml             # Configuration
```

## ROSETTA.md Format

```markdown
# Rosetta

> One-sentence project description

<!-- rosetta:sections:
overview
tech stack
architecture
directory structure
conventions
entry points
key patterns
module index
gotchas
agent notes
-->

## Overview
2-4 sentences about what this project does.

## Tech Stack
- Language/Framework versions
- Key dependencies

## Architecture
[ASCII diagram or description]

## Directory Structure
[Key folders and purposes]

## Conventions
- Naming patterns
- Code organization rules

## Entry Points
| File | Purpose |
|------|---------|

## Key Patterns
[Recurring code patterns with examples]

## Module Index
| Module | Path | Description | Load When |
|--------|------|-------------|-----------|

## Gotchas
- Non-obvious things that will cause issues

## Agent Notes
<!-- Agents append learnings here -->
```

### Loading Rules

- Load the root `ROSETTA.md` before any module files.
- Modules are additive context: load only those relevant to the current task without replacing the root content.
- If module guidance conflicts with root guidance, the module governs its scoped area while the root remains authoritative elsewhere.
- Agent Notes are append-only and each entry must include a timestamp plus agent identifier.

## Installation

### As a CLI Tool

```bash
npm install -g rosetta-context
```

### Commands

```bash
rosetta init              # Initialize Rosetta files
rosetta init --bootstrap  # Initialize + get AI population prompt
rosetta status            # Check documentation freshness
rosetta validate          # Validate structure
rosetta add-module <name> # Create module file
rosetta note "message"    # Add a note manually
rosetta bootstrap         # Output bootstrap prompt
```

### Quality Gates

Run the automated checks before releasing or publishing a package:

```bash
npm test        # Vitest suite
npm run lint    # ESLint with TypeScript rules
npm run typecheck # TypeScript compiler sanity check
```

### As a Library

```bash
npm install rosetta-context
```

```typescript
import {
  parseRosettaFile,
  validateSections,
  parseModuleIndex,
  parseAgentNotes,
  REQUIRED_SECTIONS,
  ROSETTA_PROTOCOL
} from 'rosetta-context';

// Parse ROSETTA.md
const parsed = parseRosettaFile(content);

// Validate structure
const { valid, missing } = validateSections(parsed, REQUIRED_SECTIONS);

// Get modules for selective loading
const modules = parseModuleIndex(content);
```

## Integration Examples

### Claude Code (CLAUDE.md)

```markdown
## Rosetta Protocol

This project uses Rosetta for AI context management.

On session start:
1. Read ROSETTA.md for project understanding
2. Check .rosetta/modules/ for relevant deep-dives

During work:
- Reference conventions before writing code
- Check gotchas before modifying unfamiliar areas

Before session end:
- Add discoveries to .rosetta/notes.md
```

### Cursor (.cursorrules)

```markdown
This codebase uses Rosetta for AI context.

Always read ROSETTA.md first for:
- Project architecture and tech stack
- Coding conventions and patterns
- Known gotchas and warnings

Append learnings to .rosetta/notes.md
```

### Aider (.aider.conf.yml)

```yaml
read:
  - ROSETTA.md
  - .rosetta/notes.md
```

### Custom Agent Integration

```typescript
import { parseRosettaFile, parseModuleIndex } from 'rosetta-context';
import fs from 'fs';

// Load root context
const rosetta = fs.readFileSync('ROSETTA.md', 'utf-8');
const parsed = parseRosettaFile(rosetta);

// Get relevant modules for the task
const modules = parseModuleIndex(rosetta);
const relevantModule = modules.find(m =>
  task.toLowerCase().includes(m.loadWhen.toLowerCase())
);

if (relevantModule) {
  const moduleContent = fs.readFileSync(relevantModule.path, 'utf-8');
  // Add to agent context
}
```

## Token Efficiency

Rosetta is designed for minimal context consumption:

| File | Target | Maximum |
|------|--------|---------|
| ROSETTA.md | 800-1200 tokens | 2000 tokens |
| Module file | 400-600 tokens | 1000 tokens |
| notes.md | Rolling | Prune periodically |

**Typical load:** ~1500 tokens (root + 1 relevant module)

Compare to loading an entire codebase: 50,000-500,000+ tokens.

### What to Include

- Patterns that repeat across the codebase
- Non-obvious architectural decisions
- Things that take 10+ minutes to discover
- Conventions that differ from defaults

### What to Exclude

- Standard framework behavior
- Self-explanatory file purposes
- Information already in README
- Aspirational patterns not actually used

## The Name

The Rosetta Stone (196 BCE) enabled scholars to decode Egyptian hieroglyphics by providing the same text in three scripts. It was the key to understanding a previously unreadable system.

Similarly, Rosetta enables AI agents to understand human codebases that would otherwise require extensive exploration. It's the translation layer between human code organization and agent comprehension.

## Philosophy

### Agent-First Design

Rosetta is designed BY agents, FOR agents. The CLI is a convenience for humans, but the primary workflow is:

1. Human says "document this codebase"
2. Agent explores and creates ROSETTA.md
3. Agent maintains it as they work
4. Future agents (and the same agent in future sessions) benefit

### Open Standard

Rosetta is intentionally simple and open:
- Plain markdown files
- No lock-in to any tool or service
- Works with any AI agent that can read files
- Human-readable and editable

### Composable

Rosetta complements existing documentation:
- README.md → Human onboarding
- ROSETTA.md → Agent onboarding
- CLAUDE.md/.cursorrules → Agent behavior instructions
- .rosetta/notes.md → Agent learnings

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Key areas:
- Agent integration examples
- Token efficiency improvements
- Validation and tooling
- Documentation and tutorials

## License

MIT License - see [LICENSE](LICENSE) for details.

## About

Rosetta is developed and maintained by **Metis Analytics**.

- **Author:** Christian Johnson
- **Email:** cjohnson@metisos.com
- **Repository:** https://github.com/metisos/Rosetta_Open_Source

---

*Rosetta: Institutional knowledge that persists across AI sessions.*
