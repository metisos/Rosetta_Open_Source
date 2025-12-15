/**
 * Template loading and rendering utilities
 * Templates are embedded directly for reliable distribution
 */

export interface TemplateVars {
  [key: string]: string;
}

/**
 * Embedded templates
 */
const EMBEDDED_TEMPLATES: Record<string, string> = {
  'ROSETTA-minimal.md': `# Rosetta

> [One-sentence description of your project]

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

[2-4 sentences. What this project IS and DOES.]

## Tech Stack

- Language:
- Framework:
- Database:
- Key Dependencies:

## Architecture

\`\`\`
[ASCII diagram of component relationships]
\`\`\`

[Brief explanation of data flow]

## Directory Structure

\`\`\`
src/
├── [directory]/   # [purpose]
└── [directory]/   # [purpose]
\`\`\`

## Conventions

- **Naming:** [conventions]
- **File naming:** [conventions]
- **Exports:** [conventions]
- **Error handling:** [conventions]

## Entry Points

| File | Purpose |
|------|---------|
| \`path/to/file\` | [purpose] |

## Key Patterns

[Document 1-3 recurring code patterns with examples]

## Module Index

| Module | Path | Description | Load When |
|--------|------|-------------|-----------|
| | \`.rosetta/modules/.md\` | | |

### Module Loading Policy

- Always load this root \`ROSETTA.md\` first.
- Modules are additive: include modules relevant to the current task without removing root context.
- If definitions conflict, the module file takes precedence for its scoped area while root conventions remain the baseline elsewhere.
- Humans may curate modules, but agents should never drop modules from context unless the task is unrelated.

## Gotchas

- [Non-obvious things that will cause problems]

## Agent Notes

<!--
  AGENTS: Append learnings below this line.
  Format: ### YYYY-MM-DD | agent-name
  Humans curate this section periodically.
  Rules: Agents may only append new entries and must include a timestamp and identifier.
-->

---

<!-- rosetta:version:1.0 -->
<!-- rosetta:last-updated:{{DATE}} -->
`,

  'module.md': `# Module: {{name}}

> [One-sentence purpose of this module]

<!-- rosetta:last-verified:{{DATE}} -->
<!-- rosetta:paths:src/path/to/module/** -->

## Responsibility

[What this module does. What it explicitly does NOT do. Clear boundaries.]

## Key Files

| File | Purpose |
|------|---------|
| \`path/to/file.ts\` | [What it does] |

## Data Flow

\`\`\`
[Input] → [Process] → [Output]
\`\`\`

[Prose explanation if needed]

## Interfaces

[Public interfaces other modules depend on]

\`\`\`typescript
// Key exports
functionName(param: Type): ReturnType
anotherFunction(param: Type): ReturnType

// Key types
type ImportantType = { ... }
\`\`\`

## Internal Patterns

[Module-specific patterns not in root Rosetta]

## Dependencies

- **Uses:** [Other modules this depends on]
- **Used by:** [Modules that depend on this]

## Gotchas

- [Module-specific warnings]

## Testing

[How to test this module, key test files, special setup needed]
`,

  'notes.md': `# Agent Notes

Learnings from AI coding agents working in this codebase. Humans review periodically and promote valuable insights to ROSETTA.md or module files.

## Review Status

- Last human review: {{DATE}}
- Entries since last review: 0

---

<!-- AGENTS: Append new entries below. Do not edit existing entries. -->
<!-- Format: ### YYYY-MM-DD | agent-name -->
`,

  'config.yml': `# Rosetta Configuration
# https://github.com/metisos/rosetta

version: 1

# Staleness thresholds in days
staleness:
  warning: 30    # Days before showing staleness warning
  critical: 90   # Days before marking as critically stale

# File patterns to track for drift detection (optional)
# When these files change, related module docs may need updating
track: []
  # - src/services/**/*.ts
  # - prisma/schema.prisma
  # - src/lib/**/*.ts

# Patterns to ignore in status checks
ignore:
  - "*.test.ts"
  - "*.spec.ts"
  - "__tests__/**"
  - "__mocks__/**"

# Module-to-path mapping for staleness detection (optional)
# Format: module-name: [glob patterns]
modules: {}
  # auth:
  #   - src/services/auth/**
  #   - src/lib/auth.ts
  # database:
  #   - prisma/**
  #   - src/lib/db.ts
`,

  'bootstrap-prompt.md': `## Task: Initialize Rosetta for This Codebase

This project needs Rosetta context files for AI coding agents. Please:

1. **Analyze the codebase structure** (read-only first)
   - Check for existing docs (README.md, CONTRIBUTING.md, docs/)
   - Identify primary language and framework
   - Map the directory structure
   - Find entry points and key files

2. **Create ROSETTA.md at the project root** with:
   - Overview (2-4 sentences max)
   - Tech Stack (primary technologies only)
   - Architecture (ASCII diagram + brief explanation)
   - Directory Structure (top 2 levels of src/)
   - Conventions (extract from actual code patterns)
   - Entry Points (3-6 most important files)
   - Key Patterns (1-3 code examples)
   - Module Index (3-6 logical modules)
   - Gotchas (non-obvious issues)

3. **Create .rosetta/ directory** with:
   - Module files for key areas (auth, database, api, etc.)
   - notes.md with header
   - config.yml with defaults

4. **CRITICAL: Update agent instruction files** to ensure future sessions use Rosetta:

   Check for and update these files (create if they don't exist):

   **For Claude Code (.claude/CLAUDE.md or CLAUDE.md):**
   \`\`\`markdown
   ## Rosetta Protocol

   This project uses Rosetta for persistent AI context.

   **On session start:**
   1. Read ROSETTA.md immediately for project context
   2. Check Module Index and load relevant .rosetta/modules/ files
   3. Review .rosetta/notes.md for recent discoveries

   **During work:**
   - Follow conventions documented in ROSETTA.md
   - Check Gotchas before modifying unfamiliar areas
   - Reference Key Patterns for consistent code style

   **Before session end:**
   - Append valuable discoveries to .rosetta/notes.md
   - Format: ### YYYY-MM-DD | claude
   - Keep notes actionable and non-obvious
   \`\`\`

   **For Cursor (.cursorrules):**
   \`\`\`markdown
   ## Rosetta Protocol

   This codebase uses Rosetta for AI context management.

   ALWAYS read ROSETTA.md first for:
   - Project architecture and tech stack
   - Coding conventions and patterns
   - Known gotchas and warnings

   Load relevant modules from .rosetta/modules/ based on your task.
   Append learnings to .rosetta/notes.md before ending session.
   \`\`\`

   **For Aider (.aider.conf.yml):**
   \`\`\`yaml
   read:
     - ROSETTA.md
     - .rosetta/notes.md
   \`\`\`

   **For other agents:** Add similar instructions to their config files.

### Why Step 4 is Critical

Without updating agent instruction files, future sessions won't know Rosetta exists.
This step makes Rosetta self-propagating - once initialized, every future agent session
automatically benefits from accumulated context.

### Quality Guidelines

**Focus on:**
- Token efficiency (concise, no fluff)
- Accuracy (document what IS, not what should be)
- Actionable content (patterns, gotchas, entry points)

**Do not:**
- Duplicate existing README content
- Create module files for simple/obvious areas
- Add aspirational content

**Token Targets:**
- ROSETTA.md: 800-1200 tokens
- Module files: 400-600 tokens each

When complete, summarize:
1. What Rosetta files you created
2. Which agent config files you updated/created
3. Any areas that need human review
`,

  'agent-config-claude.md': `## Rosetta Protocol

This project uses Rosetta for persistent AI context.

**On session start:**
1. Read ROSETTA.md immediately for project context
2. Check the \`<!-- rosetta:last-updated:DATE -->\` metadata for staleness (>30 days = review needed)
3. Check Module Index and load relevant .rosetta/modules/ files
4. Review .rosetta/notes.md for recent discoveries

**During work:**
- Follow conventions documented in ROSETTA.md
- Check Gotchas before modifying unfamiliar areas
- Reference Key Patterns for consistent code style
- If you notice ROSETTA.md is outdated or incorrect, UPDATE IT:
  - Fix incorrect information immediately
  - Add new patterns you discover
  - Update the \`<!-- rosetta:last-updated:DATE -->\` comment

**Before session end:**
- Append valuable discoveries to .rosetta/notes.md
- Format: ### YYYY-MM-DD | claude
- Keep notes actionable and non-obvious
- If you made significant changes to the codebase, check if ROSETTA.md needs updating

**Staleness guide:**
- <30 days: Fresh, trust the content
- 30-90 days: Review sections relevant to your work
- >90 days: Verify critical sections before relying on them

**If ROSETTA.md doesn't exist:**
- Run \`rosetta init\` or create it by analyzing the codebase
- See: https://github.com/metisos/Rosetta_Open_Source
`,

  'agent-config-cursor.md': `## Rosetta Protocol

This codebase uses Rosetta for AI context management.

**On session start:**
- ALWAYS read ROSETTA.md first for project context
- Check \`<!-- rosetta:last-updated:DATE -->\` - if >30 days old, verify critical sections
- Load relevant modules from .rosetta/modules/ based on your task

**During work:**
- Follow conventions and patterns in ROSETTA.md
- Check Gotchas before modifying unfamiliar code
- If you notice outdated/incorrect info in ROSETTA.md, UPDATE IT and bump the last-updated date

**Before session end:**
- Append learnings to .rosetta/notes.md (format: ### YYYY-MM-DD | cursor)
- If you changed the codebase significantly, update ROSETTA.md

**Staleness:** <30 days=fresh, 30-90=review, >90=verify before trusting

If ROSETTA.md doesn't exist, create it by analyzing the codebase.
See: https://github.com/metisos/Rosetta_Open_Source
`,

  'agent-config-aider.yml': `# Rosetta Protocol - Auto-load context files
read:
  - ROSETTA.md
  - .rosetta/notes.md
`,
};

/**
 * Load a template
 */
export function loadTemplate(templateName: string): string {
  const template = EMBEDDED_TEMPLATES[templateName];
  if (!template) {
    throw new Error(`Template not found: ${templateName}`);
  }
  return template;
}

/**
 * Render a template with variables
 */
export function renderTemplate(template: string, vars: TemplateVars): string {
  let rendered = template;

  // Replace {{DATE}} with current date
  const today = new Date().toISOString().split('T')[0];
  rendered = rendered.replace(/\{\{DATE\}\}/g, today);

  // Replace other variables
  for (const [key, value] of Object.entries(vars)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    rendered = rendered.replace(regex, value);
  }

  return rendered;
}

/**
 * Load and render a template in one step
 */
export function loadAndRenderTemplate(templateName: string, vars: TemplateVars = {}): string {
  const template = loadTemplate(templateName);
  return renderTemplate(template, vars);
}

/**
 * Available templates
 */
export const TEMPLATES = {
  ROSETTA_MINIMAL: 'ROSETTA-minimal.md',
  MODULE: 'module.md',
  NOTES: 'notes.md',
  CONFIG: 'config.yml',
  BOOTSTRAP: 'bootstrap-prompt.md',
  AGENT_CONFIG_CLAUDE: 'agent-config-claude.md',
  AGENT_CONFIG_CURSOR: 'agent-config-cursor.md',
  AGENT_CONFIG_AIDER: 'agent-config-aider.yml',
} as const;
