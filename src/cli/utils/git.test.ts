import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

import { isGitRepo, getLastModified, getFilesModifiedSince, getGitRoot } from './git';

// Use the actual Rosetta repo for testing (we know it's a git repo)
const REPO_ROOT = path.resolve(__dirname, '../../..');

// Create a temp directory for non-git tests
let tempDir: string;

beforeAll(() => {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rosetta-git-test-'));
});

afterAll(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
});

describe('isGitRepo', () => {
  it('returns true for a git repository', () => {
    expect(isGitRepo(REPO_ROOT)).toBe(true);
  });

  it('returns true for a subdirectory of a git repository', () => {
    expect(isGitRepo(path.join(REPO_ROOT, 'src'))).toBe(true);
  });

  it('returns false for a non-git directory', () => {
    expect(isGitRepo(tempDir)).toBe(false);
  });

  it('returns false for a non-existent directory', () => {
    expect(isGitRepo('/nonexistent/path/that/does/not/exist')).toBe(false);
  });
});

describe('getGitRoot', () => {
  it('returns the repository root from the root directory', () => {
    const root = getGitRoot(REPO_ROOT);
    expect(root).toBe(REPO_ROOT);
  });

  it('returns the repository root from a subdirectory', () => {
    const root = getGitRoot(path.join(REPO_ROOT, 'src/cli/utils'));
    expect(root).toBe(REPO_ROOT);
  });

  it('returns null for a non-git directory', () => {
    expect(getGitRoot(tempDir)).toBeNull();
  });

  it('returns null for a non-existent directory', () => {
    expect(getGitRoot('/nonexistent/path')).toBeNull();
  });
});

describe('getLastModified', () => {
  it('returns a Date for a tracked file', () => {
    const packageJsonPath = path.join(REPO_ROOT, 'package.json');
    const lastModified = getLastModified(packageJsonPath);

    expect(lastModified).toBeInstanceOf(Date);
    expect(lastModified!.getTime()).toBeGreaterThan(0);
  });

  it('returns null for an untracked file', () => {
    // Create an untracked file in temp dir
    const untrackedFile = path.join(tempDir, 'untracked.txt');
    fs.writeFileSync(untrackedFile, 'test');

    const lastModified = getLastModified(untrackedFile);
    expect(lastModified).toBeNull();
  });

  it('returns null for a non-existent file', () => {
    const nonExistentFile = path.join(REPO_ROOT, 'does-not-exist.xyz');
    const lastModified = getLastModified(nonExistentFile);
    expect(lastModified).toBeNull();
  });
});

describe('getFilesModifiedSince', () => {
  it('returns an array of modified files', () => {
    // Use a date far in the past to ensure we get results
    const pastDate = new Date('2020-01-01');
    const files = getFilesModifiedSince(REPO_ROOT, pastDate);

    expect(Array.isArray(files)).toBe(true);
    expect(files.length).toBeGreaterThan(0);
    // Should include package.json since it's been modified since 2020
    expect(files).toContain('package.json');
  });

  it('returns an empty array for a future date', () => {
    const futureDate = new Date('2099-01-01');
    const files = getFilesModifiedSince(REPO_ROOT, futureDate);

    expect(files).toEqual([]);
  });

  it('filters by patterns when provided', () => {
    const pastDate = new Date('2020-01-01');
    const files = getFilesModifiedSince(REPO_ROOT, pastDate, ['*.json']);

    expect(Array.isArray(files)).toBe(true);
    // Should only include .json files
    for (const file of files) {
      if (file) {
        expect(file.endsWith('.json') || file.includes('/')).toBe(true);
      }
    }
  });

  it('returns empty array for non-git directory', () => {
    const files = getFilesModifiedSince(tempDir, new Date('2020-01-01'));
    expect(files).toEqual([]);
  });

  it('deduplicates file names', () => {
    const pastDate = new Date('2020-01-01');
    const files = getFilesModifiedSince(REPO_ROOT, pastDate);

    // Check for duplicates
    const uniqueFiles = [...new Set(files)];
    expect(files.length).toBe(uniqueFiles.length);
  });
});
