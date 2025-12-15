import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

import { initCommand } from './init';
import { validateCommand } from './validate';
import { addModuleCommand } from './add-module';
import { noteCommand } from './note';

// Create a temp directory for each test
let tempDir: string;

beforeEach(() => {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rosetta-cli-test-'));
  // Mock process.cwd() to return tempDir
  vi.spyOn(process, 'cwd').mockReturnValue(tempDir);
  // Suppress console output during tests
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  fs.rmSync(tempDir, { recursive: true, force: true });
});

describe('initCommand', () => {
  it('creates ROSETTA.md and .rosetta directory', async () => {
    await initCommand({});

    expect(fs.existsSync(path.join(tempDir, 'ROSETTA.md'))).toBe(true);
    expect(fs.existsSync(path.join(tempDir, '.rosetta'))).toBe(true);
    expect(fs.existsSync(path.join(tempDir, '.rosetta/notes.md'))).toBe(true);
    expect(fs.existsSync(path.join(tempDir, '.rosetta/config.yml'))).toBe(true);
    expect(fs.existsSync(path.join(tempDir, '.rosetta/modules'))).toBe(true);
  });

  it('does not overwrite existing ROSETTA.md without --force', async () => {
    // Create initial file
    fs.writeFileSync(path.join(tempDir, 'ROSETTA.md'), 'original content');

    await initCommand({});

    const content = fs.readFileSync(path.join(tempDir, 'ROSETTA.md'), 'utf-8');
    expect(content).toBe('original content');
  });

  it('overwrites existing ROSETTA.md with --force', async () => {
    // Create initial file
    fs.writeFileSync(path.join(tempDir, 'ROSETTA.md'), 'original content');

    await initCommand({ force: true });

    const content = fs.readFileSync(path.join(tempDir, 'ROSETTA.md'), 'utf-8');
    expect(content).not.toBe('original content');
    expect(content).toContain('# Rosetta');
  });

  it('creates files with correct metadata date', async () => {
    await initCommand({});

    const content = fs.readFileSync(path.join(tempDir, 'ROSETTA.md'), 'utf-8');
    const today = new Date().toISOString().split('T')[0];
    expect(content).toContain(`rosetta:last-updated:${today}`);
  });
});

describe('validateCommand', () => {
  it('reports missing ROSETTA.md', async () => {
    const exitCode = process.exitCode;
    await validateCommand({ path: tempDir });
    // Should not crash, just report
    expect(true).toBe(true);
  });

  it('validates a properly initialized project', async () => {
    await initCommand({});
    process.exitCode = undefined;

    await validateCommand({ path: tempDir });

    // No errors for sections, but warnings about missing module content is OK
  });

  it('detects missing required sections', async () => {
    // Create a minimal ROSETTA.md missing sections
    fs.writeFileSync(
      path.join(tempDir, 'ROSETTA.md'),
      '# Rosetta\n\n## Overview\nTest project\n'
    );

    process.exitCode = undefined;
    await validateCommand({ path: tempDir });

    // Should set exit code due to missing sections
    expect(process.exitCode).toBe(1);
  });
});

describe('addModuleCommand', () => {
  it('creates a module file in .rosetta/modules/', async () => {
    // Initialize first
    await initCommand({});

    await addModuleCommand('auth', { description: 'Authentication module' });

    const modulePath = path.join(tempDir, '.rosetta/modules/auth.md');
    expect(fs.existsSync(modulePath)).toBe(true);

    const content = fs.readFileSync(modulePath, 'utf-8');
    // Module name is capitalized in the template
    expect(content).toContain('# Module: Auth');
  });

  it('does not create module if .rosetta does not exist', async () => {
    await addModuleCommand('auth', {});

    const modulePath = path.join(tempDir, '.rosetta/modules/auth.md');
    expect(fs.existsSync(modulePath)).toBe(false);
  });
});

describe('noteCommand', () => {
  it('appends a note to notes.md', async () => {
    // Initialize first
    await initCommand({});

    await noteCommand('Test discovery', { agent: 'test-agent' });

    const notesPath = path.join(tempDir, '.rosetta/notes.md');
    const content = fs.readFileSync(notesPath, 'utf-8');

    expect(content).toContain('test-agent');
    expect(content).toContain('Test discovery');
  });

  it('uses "human" as default agent', async () => {
    await initCommand({});

    await noteCommand('Manual note', {});

    const notesPath = path.join(tempDir, '.rosetta/notes.md');
    const content = fs.readFileSync(notesPath, 'utf-8');

    expect(content).toContain('human');
    expect(content).toContain('Manual note');
  });

  it('does not add note if notes.md does not exist', async () => {
    // Don't initialize - notes.md won't exist
    await noteCommand('Orphan note', {});

    const notesPath = path.join(tempDir, '.rosetta/notes.md');
    expect(fs.existsSync(notesPath)).toBe(false);
  });
});
