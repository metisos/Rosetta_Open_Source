import { describe, expect, it } from 'vitest';

import {
  REQUIRED_MODULE_SECTIONS,
  REQUIRED_SECTIONS,
  parseAgentNotes,
  parseModuleIndex,
  parseRosettaFile,
  validateSections,
} from './parser';

describe('parseRosettaFile', () => {
  const sample = `# Rosetta\n\n<!-- rosetta:version:1.1 -->\n<!-- rosetta:last-updated:2025-01-01 -->\n<!-- rosetta:paths:src/**/*.ts, docs/**/*.md -->\n\n## Overview\nProject overview text.\n\n## Tech Stack\n- TS\n\n### Nested\nNested content\n\n## Agent Notes\n- none`;

  const parsed = parseRosettaFile(sample);

  it('extracts metadata fields from rosetta comments', () => {
    expect(parsed.metadata).toEqual({
      version: '1.1',
      lastUpdated: '2025-01-01',
      paths: ['src/**/*.ts', 'docs/**/*.md'],
    });
  });

  it('captures section names, levels, and trimmed content', () => {
    expect(parsed.sections.map(section => section.name)).toEqual([
      'Rosetta',
      'Overview',
      'Tech Stack',
      'Nested',
      'Agent Notes',
    ]);
    const nestedSection = parsed.sections.find(section => section.name === 'Nested');
    expect(nestedSection?.level).toBe(3);
    expect(nestedSection?.content).toBe('Nested content');
  });
});

describe('validateSections', () => {
  it('identifies missing and found sections case-insensitively', () => {
    const parsed = parseRosettaFile(`# Rosetta\n\n## Overview\ntext\n\n## Agent Notes\n- none`);
    const result = validateSections(parsed, REQUIRED_SECTIONS);

    expect(result.valid).toBe(false);
    expect(result.missing).toEqual([
      'Tech Stack',
      'Architecture',
      'Directory Structure',
      'Conventions',
      'Entry Points',
      'Module Index',
      'Gotchas',
    ]);
    expect(result.found).toEqual(['Overview', 'Agent Notes']);
  });
});

describe('parseModuleIndex', () => {
  it('parses module rows and strips code formatting', () => {
    const content = `# Rosetta\n\n## Module Index\n| Module | Path | Description | Load When |\n|--------|------|-------------|-----------|\n| cli | \`.rosetta/modules/cli.md\` | CLI docs | CLI work |\n| parser | \`.rosetta/modules/parser.md\` | Parser internals | Parser changes |\n\n## Next Section`;

    expect(parseModuleIndex(content)).toEqual([
      {
        module: 'cli',
        path: '.rosetta/modules/cli.md',
        description: 'CLI docs',
        loadWhen: 'CLI work',
      },
      {
        module: 'parser',
        path: '.rosetta/modules/parser.md',
        description: 'Parser internals',
        loadWhen: 'Parser changes',
      },
    ]);
  });
});

describe('parseAgentNotes', () => {
  it('collects dated note entries with bullet points', () => {
    const content = `# Rosetta\n\n## Agent Notes\n### 2025-01-01 | agent-one\n- Note A\n- Note B\n\n### 2025-01-02 | agent-two\n- Second entry`;;

    expect(parseAgentNotes(content)).toEqual([
      {
        date: '2025-01-01',
        agent: 'agent-one',
        notes: ['Note A', 'Note B'],
      },
      {
        date: '2025-01-02',
        agent: 'agent-two',
        notes: ['Second entry'],
      },
    ]);
  });
});

describe('REQUIRED_MODULE_SECTIONS', () => {
  it('lists the mandatory module headings', () => {
    expect(REQUIRED_MODULE_SECTIONS).toEqual([
      'Responsibility',
      'Key Files',
      'Data Flow',
      'Interfaces',
      'Gotchas',
    ]);
  });
});
