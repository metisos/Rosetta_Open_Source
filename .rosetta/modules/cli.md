# Module: CLI

> Command-line interface for human helpers to scaffold and validate Rosetta files.

<!-- rosetta:last-verified:2024-12-14 -->

## Responsibility

The CLI provides commands for humans to:
- Initialize Rosetta in projects (scaffolding)
- Validate ROSETTA.md structure
- Check documentation staleness
- Add module files and notes
- Output bootstrap prompts for AI population

The CLI is a helper tool - agents can create and manage Rosetta directly.

## Key Files

| File | Purpose |
|------|---------|
| `src/cli/index.ts` | Entry point, commander setup |
| `src/cli/commands/init.ts` | Initialize Rosetta files |
| `src/cli/commands/validate.ts` | Validate structure |
| `src/cli/commands/status.ts` | Check staleness |
| `src/cli/commands/add-module.ts` | Scaffold modules |
| `src/cli/commands/note.ts` | Add notes manually |
| `src/cli/commands/bootstrap.ts` | Output bootstrap prompt |

## Data Flow

```
User runs command
      │
      ▼
commander parses args
      │
      ▼
Command handler called
      │
      ▼
Utils (parser, git, templates)
      │
      ▼
File system operations
      │
      ▼
Colored output via chalk
```

## Interfaces

```typescript
interface InitOptions {
  template?: string;
  force?: boolean;
  bootstrap?: boolean;
}

interface ValidateOptions {
  path?: string;
}
```

## Gotchas

- chalk must be v4 (CommonJS), not v5 (ESM-only)
- Templates are embedded in code, not loaded from files
- Shebang is added by tsup, not in source file
