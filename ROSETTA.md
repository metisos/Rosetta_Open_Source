# Rosetta

> Agent-first codebase context protocol - enables AI agents to build and share institutional knowledge about codebases.

## Overview

Rosetta is both a protocol (ROSETTA.md format) and a CLI tool that helps AI coding agents understand codebases efficiently. Agents create ROSETTA.md with project context, add notes as they learn, and future sessions automatically load this knowledge. The CLI provides human helpers for scaffolding and validation.

## Tech Stack

- TypeScript 5.x
- Node.js 18+
- commander (CLI framework)
- chalk v4 (terminal colors - v4 for CommonJS compatibility)
- glob (file pattern matching)
- yaml (config parsing)
- tsup (bundler)
- vitest (testing)

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLI Entry Point                       │
│                  src/cli/index.ts                        │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
┌───────────┐  ┌───────────┐  ┌───────────┐
│ Commands  │  │  Utils    │  │ Templates │
│ init      │  │ parser    │  │ (embedded)│
│ validate  │  │ git       │  │           │
│ status    │  │ templates │  │           │
│ add-module│  │           │  │           │
│ note      │  │           │  │           │
│ bootstrap │  │           │  │           │
└───────────┘  └───────────┘  └───────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────┐
│              Programmatic API (src/index.ts)             │
│  parseRosettaFile, validateSections, parseModuleIndex    │
└─────────────────────────────────────────────────────────┘
```

## Directory Structure

```
src/
├── index.ts              # Programmatic API exports
└── cli/
    ├── index.ts          # CLI entry point (commander setup)
    ├── commands/
    │   ├── index.ts      # Command barrel export
    │   ├── init.ts       # rosetta init
    │   ├── validate.ts   # rosetta validate
    │   ├── status.ts     # rosetta status
    │   ├── add-module.ts # rosetta add-module
    │   ├── note.ts       # rosetta note
    │   └── bootstrap.ts  # rosetta bootstrap
    └── utils/
        ├── index.ts      # Utils barrel export
        ├── parser.ts     # Markdown parsing, section validation
        ├── git.ts        # Git helpers (modified dates, repo root)
        └── templates.ts  # Embedded templates for distribution
```

## Conventions

- Functions: camelCase
- Interfaces: PascalCase
- Files: kebab-case
- Exports: Named exports (no default exports)
- Templates: Embedded in code (not external files) for npm distribution
- Colors: chalk v4 (CommonJS) not v5 (ESM-only)

## Entry Points

| File | Purpose |
|------|---------|
| `src/cli/index.ts` | CLI entry point, command registration |
| `src/index.ts` | Programmatic API for agent integration |
| `dist/cli/index.js` | Built CLI executable |
| `dist/index.js` | Built API library |

## Key Patterns

### Template Embedding
Templates are embedded as string literals in `src/cli/utils/templates.ts` rather than loaded from files. This ensures templates ship with the npm package:

```typescript
const ROSETTA_TEMPLATE = `# Rosetta
> {{PROJECT_DESCRIPTION}}
...`;

export function loadTemplate(name: string): string {
  return EMBEDDED_TEMPLATES[name];
}
```

### Section Parsing
The parser extracts markdown sections by heading level:

```typescript
const parsed = parseRosettaFile(content);
// { sections: [...], metadata: {...}, rawContent: string }

const validation = validateSections(parsed, REQUIRED_SECTIONS);
// { valid: boolean, missing: string[], found: string[] }
```

## Module Index

| Module | Path | Description | Load When |
|--------|------|-------------|-----------|
| cli | `.rosetta/modules/cli.md` | CLI commands | Working on commands |
| parser | `.rosetta/modules/parser.md` | Markdown parsing | Parser changes |

## Gotchas

- chalk v5 is ESM-only and breaks CommonJS builds - must use chalk v4
- Templates must be embedded in code, not external files, for npm distribution
- tsup builds both CLI (with shebang) and library (without) separately
- The shebang is added via tsup banner config, not in source

## Agent Notes

<!--
  AGENTS: Append learnings below this line.
  Format: ### YYYY-MM-DD | agent-name
  Humans curate this section periodically.
-->

### 2024-12-14 | claude
- Initial Rosetta context created for the Rosetta project itself
- This project uses its own protocol for self-documentation

---

<!-- rosetta:version:1.0 -->
<!-- rosetta:last-updated:2024-12-14 -->
<!-- rosetta:paths:src/**/*.ts -->
