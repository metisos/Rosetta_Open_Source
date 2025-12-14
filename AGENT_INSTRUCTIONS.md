# Rosetta Agent Instructions

This document provides detailed instructions for AI coding agents on how to use the Rosetta protocol. If you are an AI agent reading this, these instructions are for you.

## Overview

Rosetta is a protocol that allows you to:
1. **Quickly understand** codebases without extensive exploration
2. **Persist learnings** for future sessions (yours or other agents')
3. **Build institutional knowledge** that accumulates over time

## Core Protocol

### On Session Start

When you begin working on a codebase:

1. **Check for ROSETTA.md** in the project root
   ```
   Does ROSETTA.md exist?
   ├── YES → Read it immediately. This is your context.
   └── NO  → See "Creating Rosetta" below
   ```

2. **If ROSETTA.md exists**, load it and:
   - Review the Overview and Tech Stack
   - Note the Conventions (follow them in your code)
   - Check Gotchas before making changes
   - Review recent Agent Notes for session-specific context

3. **Load relevant modules** from `.rosetta/modules/`:
   - Check the Module Index table in ROSETTA.md
   - Load modules matching your current task
   - Example: Working on auth? Load `auth.md`

### During Work

As you work on the codebase:

1. **Follow documented conventions**
   - Use naming patterns from Conventions section
   - Follow architectural patterns from Architecture section
   - Respect entry points documented in Entry Points

2. **Record discoveries** when you learn something non-obvious:
   ```markdown
   ### YYYY-MM-DD | your-agent-name
   - Brief, actionable discovery
   ```

   Good notes:
   - "Config must load before database initialization"
   - "Tests require DATABASE_URL even for unit tests"
   - "The /api/v2 endpoints require auth, /api/v1 don't"

   Bad notes:
   - "This is a React project" (obvious)
   - "I modified the login page" (too specific to session)

3. **Update ROSETTA.md** if you notice:
   - Tech stack has changed
   - New architectural patterns emerged
   - Conventions have evolved
   - New gotchas discovered

### Before Session End

Before completing your session:

1. **Append valuable learnings** to `.rosetta/notes.md`:
   ```markdown
   ### 2024-01-15 | agent-name
   - Discovery 1
   - Discovery 2
   ```

2. **Do not duplicate** information already in ROSETTA.md or existing notes

3. **Keep notes actionable** - future agents should benefit from them

## Creating Rosetta

When ROSETTA.md doesn't exist and you need to create it:

### Step 1: Explore the Codebase

Gather information by reading:
- `package.json` / `requirements.txt` / build files (tech stack)
- `README.md` (project purpose)
- Directory structure (architecture)
- Key source files (patterns and conventions)

### Step 2: Create ROSETTA.md

Use this template:

```markdown
# Rosetta

> [One-sentence project description]

## Overview

[2-4 sentences about what this project does, who it's for, and how it works]

## Tech Stack

- [Language]: [Version]
- [Framework]: [Version]
- [Database]: [Type]
- [Key dependencies]

## Architecture

```
[ASCII diagram showing how components connect]
```

## Directory Structure

```
[Key directories with brief purposes]
src/
├── folder/    # Purpose
└── folder/    # Purpose
```

## Conventions

- [Naming convention]
- [Code organization rule]
- [Import/export pattern]

## Entry Points

| File | Purpose |
|------|---------|
| `path/to/file` | What it does |

## Key Patterns

[Code examples of patterns used throughout the codebase]

## Module Index

| Module | Path | Description | Load When |
|--------|------|-------------|-----------|
| name | `.rosetta/modules/name.md` | Brief desc | When to load |

## Gotchas

- [Non-obvious thing that will cause issues]
- [Another gotcha]

## Agent Notes

<!--
  AGENTS: Append learnings below this line.
  Format: ### YYYY-MM-DD | agent-name
-->

### [DATE] | [your-agent-name]
- Initial Rosetta context created

---

<!-- rosetta:version:1.0 -->
<!-- rosetta:last-updated:[DATE] -->
```

### Step 3: Create Supporting Files

Create `.rosetta/` directory:
```
.rosetta/
├── modules/      # Deep-dive documentation
├── notes.md      # Agent learnings
└── config.yml    # Configuration
```

**notes.md template:**
```markdown
# Agent Notes

Learnings from AI coding agents working in this codebase.

## Review Status

- Last human review: [DATE]
- Entries since last review: 0

---

<!-- AGENTS: Append new entries below -->
```

**config.yml template:**
```yaml
version: 1

staleness:
  warning: 30
  critical: 90

track: []

ignore:
  - "*.test.ts"
  - "*.spec.ts"

modules: {}
```

## Creating Module Files

When you deeply analyze a subsystem, create a module file:

### When to Create Modules

- Complex areas that need detailed documentation
- Subsystems with many interconnected files
- Areas with non-obvious data flows
- Frequently modified code that benefits from context

### Module Template

```markdown
# Module: [Name]

> [One-sentence purpose]

<!-- rosetta:last-verified:[DATE] -->

## Responsibility

[What this module does and doesn't do]

## Key Files

| File | Purpose |
|------|---------|
| `path` | Purpose |

## Data Flow

```
[ASCII diagram of data flow]
```

## Interfaces

```typescript
[Key interfaces/types]
```

## Gotchas

- [Module-specific warning]
```

### After Creating

Add the module to the Module Index in ROSETTA.md:
```markdown
| module-name | `.rosetta/modules/module-name.md` | Brief description | When to load |
```

## Token Efficiency Guidelines

### Keep It Concise

- ROSETTA.md: 800-1200 tokens (max 2000)
- Module files: 400-600 tokens (max 1000)
- Notes: Actionable one-liners

### Prioritize Signal

Include:
- Patterns that save time to discover
- Non-obvious architectural decisions
- Things that cause bugs if not known

Exclude:
- Standard framework behavior
- Obvious file purposes
- Duplicate information

### Use Tables

Tables are token-efficient for structured data:
```markdown
| File | Purpose |
|------|---------|
| `a.ts` | Does X |
| `b.ts` | Does Y |
```

## Integration Points

### For Agent Developers

If you're building an agent that uses Rosetta:

```typescript
import { parseRosettaFile, parseModuleIndex } from 'rosetta-context';
import fs from 'fs';

// Load on session start
function loadRosettaContext(projectRoot: string): string {
  const rosettaPath = `${projectRoot}/ROSETTA.md`;

  if (!fs.existsSync(rosettaPath)) {
    return ''; // No Rosetta context
  }

  let context = fs.readFileSync(rosettaPath, 'utf-8');

  // Optionally load relevant modules
  const modules = parseModuleIndex(context);
  for (const mod of modules) {
    if (taskMatchesModule(currentTask, mod.loadWhen)) {
      const modulePath = `${projectRoot}/${mod.path}`;
      if (fs.existsSync(modulePath)) {
        context += '\n\n---\n\n' + fs.readFileSync(modulePath, 'utf-8');
      }
    }
  }

  return context;
}
```

### System Prompt Integration

Add to your agent's system prompt:

```
ROSETTA PROTOCOL:
This project may use Rosetta for codebase context.

On session start:
- Check for ROSETTA.md and read it if present
- Load relevant .rosetta/modules/ files for your task

During work:
- Follow conventions documented in ROSETTA.md
- Check Gotchas before modifying unfamiliar code

Before session end:
- Add valuable discoveries to .rosetta/notes.md
- Format: ### YYYY-MM-DD | agent-name
```

## Common Patterns

### Reading Existing Rosetta

```
1. Read ROSETTA.md
2. Parse Overview → Understand project purpose
3. Parse Tech Stack → Know what you're working with
4. Parse Conventions → Follow the rules
5. Parse Gotchas → Avoid known issues
6. Check Module Index → Load relevant deep-dives
```

### Creating New Rosetta

```
1. Explore: package.json, README, src/
2. Identify: tech stack, architecture, patterns
3. Create: ROSETTA.md with all sections
4. Create: .rosetta/notes.md
5. Create: .rosetta/config.yml
6. Optional: Module files for complex areas
```

### Adding Notes

```
1. Discover something non-obvious
2. Verify it's not already documented
3. Open .rosetta/notes.md
4. Append: ### DATE | agent-name
5. Add: - Concise, actionable note
```

## Summary

1. **Always check for ROSETTA.md first** - It's your context
2. **Follow documented conventions** - Consistency matters
3. **Record valuable discoveries** - Help future sessions
4. **Create Rosetta when missing** - If you explored, document it
5. **Keep it token-efficient** - Every token counts

---

*These instructions are part of the Rosetta open-source protocol.*
*Repository: https://github.com/metisos/Rosetta_Open_Source*
