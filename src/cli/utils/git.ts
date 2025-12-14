/**
 * Git integration utilities
 */

import { execSync } from 'child_process';
import path from 'path';

/**
 * Check if a directory is a git repository
 */
export function isGitRepo(dir: string): boolean {
  try {
    execSync('git rev-parse --is-inside-work-tree', {
      cwd: dir,
      stdio: 'pipe',
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the last modified date of a file from git
 */
export function getLastModified(filePath: string): Date | null {
  try {
    const dir = path.dirname(filePath);
    const result = execSync(`git log -1 --format=%cI -- "${path.basename(filePath)}"`, {
      cwd: dir,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();

    if (result) {
      return new Date(result);
    }
  } catch {
    // Fall through to file system
  }

  return null;
}

/**
 * Get files modified since a specific date
 */
export function getFilesModifiedSince(dir: string, since: Date, patterns?: string[]): string[] {
  try {
    const sinceStr = since.toISOString();
    let cmd = `git log --since="${sinceStr}" --name-only --pretty=format:""`;

    if (patterns && patterns.length > 0) {
      cmd += ` -- ${patterns.map(p => `"${p}"`).join(' ')}`;
    }

    const result = execSync(cmd, {
      cwd: dir,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    return [...new Set(result.split('\n').filter(f => f.trim()))];
  } catch {
    return [];
  }
}

/**
 * Get the root of the git repository
 */
export function getGitRoot(dir: string): string | null {
  try {
    const result = execSync('git rev-parse --show-toplevel', {
      cwd: dir,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();

    return result;
  } catch {
    return null;
  }
}
