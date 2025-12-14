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
