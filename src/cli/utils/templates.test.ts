import { describe, expect, it, vi } from 'vitest';

import { loadAndRenderTemplate, loadTemplate, renderTemplate } from './templates';

describe('loadTemplate', () => {
  it('returns an embedded template', () => {
    const template = loadTemplate('ROSETTA-minimal.md');
    expect(template).toContain('<!-- rosetta:sections:');
    expect(template).toContain('## Agent Notes');
  });

  it('throws when template is missing', () => {
    expect(() => loadTemplate('missing-template.md')).toThrow('Template not found');
  });
});

describe('renderTemplate', () => {
  it('replaces date placeholder and provided variables', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-02-01T00:00:00Z'));

    const template = 'Date: {{DATE}}, Name: {{NAME}}';
    expect(renderTemplate(template, { NAME: 'Rosetta' })).toBe('Date: 2025-02-01, Name: Rosetta');

    vi.useRealTimers();
  });
});

describe('loadAndRenderTemplate', () => {
  it('loads and interpolates template variables', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-03-15T00:00:00Z'));

    const rendered = loadAndRenderTemplate('module.md', { name: 'Parser' });
    expect(rendered).toContain('# Module: Parser');
    expect(rendered).toContain('<!-- rosetta:last-verified:2025-03-15 -->');

    vi.useRealTimers();
  });
});

describe('agent config templates', () => {
  it('loads Claude agent config template', () => {
    const template = loadTemplate('agent-config-claude.md');
    expect(template).toContain('## Rosetta Protocol');
    expect(template).toContain('Read ROSETTA.md immediately');
    expect(template).toContain('.rosetta/notes.md');
  });

  it('loads Cursor agent config template', () => {
    const template = loadTemplate('agent-config-cursor.md');
    expect(template).toContain('## Rosetta Protocol');
    expect(template).toContain('ALWAYS read ROSETTA.md first');
  });

  it('loads Aider agent config template', () => {
    const template = loadTemplate('agent-config-aider.yml');
    expect(template).toContain('ROSETTA.md');
    expect(template).toContain('.rosetta/notes.md');
  });

  it('bootstrap prompt includes agent config instructions', () => {
    const template = loadTemplate('bootstrap-prompt.md');
    expect(template).toContain('CRITICAL: Update agent instruction files');
    expect(template).toContain('CLAUDE.md');
    expect(template).toContain('.cursorrules');
    expect(template).toContain('.aider.conf.yml');
  });
});
