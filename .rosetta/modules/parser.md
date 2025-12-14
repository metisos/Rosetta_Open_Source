# Module: Parser

> Markdown parsing utilities for Rosetta files.

<!-- rosetta:last-verified:2024-12-14 -->

## Responsibility

Parses ROSETTA.md and module files:
- Extract sections by heading level
- Extract metadata from HTML comments
- Validate required sections are present
- Parse Module Index table
- Parse Agent Notes entries

## Key Files

| File | Purpose |
|------|---------|
| `src/cli/utils/parser.ts` | All parsing logic |

## Data Flow

```
Markdown content (string)
      │
      ▼
parseRosettaFile()
      │
      ├─► Extract sections (by ## headings)
      ├─► Extract metadata (<!-- rosetta:key:value -->)
      │
      ▼
ParsedRosetta { sections, metadata, rawContent }
      │
      ▼
validateSections() ──► { valid, missing, found }
parseModuleIndex() ──► Array<{ module, path, description, loadWhen }>
parseAgentNotes()  ──► Array<{ date, agent, notes }>
```

## Interfaces

```typescript
interface RosettaSection {
  name: string;
  level: number;
  content: string;
  startLine: number;
  endLine: number;
}

interface ParsedRosetta {
  sections: RosettaSection[];
  metadata: RosettaMetadata;
  rawContent: string;
}
```

## Gotchas

- Section matching is case-insensitive (uses .includes())
- Metadata comments must be on their own line
- Module Index parsing expects exact table format
