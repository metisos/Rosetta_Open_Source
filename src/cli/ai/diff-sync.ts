/**
 * Diff-based ROSETTA.md synchronization engine
 * Analyzes git diffs and updates ROSETTA.md sections accordingly
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { AIProvider, GenerateOptions } from './providers';

export interface DiffSyncOptions {
  cwd: string;
  provider: AIProvider;
  apiKey: string;
  model: string;
  since?: string;
  onStatus?: (msg: string) => void;
}

export interface SyncResult {
  updated: boolean;
  content: string;
  diff: string;
  summary: string;
}

const NO_CHANGES = 'NO_CHANGES_NEEDED';

/**
 * Get git diff since a reference point
 */
export function getGitDiff(cwd: string, since?: string): string {
  try {
    if (since) {
      // Diff since a specific ref (commit, tag, date)
      return execSync(`git diff ${since} -- . ':!.rosetta' ':!ROSETTA.md'`, {
        cwd,
        encoding: 'utf-8',
        timeout: 15000,
      }).trim();
    }

    // Default: staged + unstaged changes, or last commit if working tree is clean
    let diff = execSync("git diff HEAD -- . ':!.rosetta' ':!ROSETTA.md'", {
      cwd,
      encoding: 'utf-8',
      timeout: 15000,
    }).trim();

    if (!diff) {
      // No uncommitted changes — use last commit's diff
      diff = execSync("git diff HEAD~1 HEAD -- . ':!.rosetta' ':!ROSETTA.md'", {
        cwd,
        encoding: 'utf-8',
        timeout: 15000,
      }).trim();
    }

    return diff;
  } catch {
    return '';
  }
}

/**
 * Get a summary of changed files (for display)
 */
export function getChangedFilesSummary(cwd: string, since?: string): string {
  try {
    const ref = since || 'HEAD~1';
    return execSync(`git diff --stat ${ref} -- . ':!.rosetta' ':!ROSETTA.md'`, {
      cwd,
      encoding: 'utf-8',
      timeout: 10000,
    }).trim();
  } catch {
    return '';
  }
}

/**
 * Get the last sync timestamp from .rosetta/config.yml or ROSETTA.md metadata
 */
export function getLastSyncRef(cwd: string): string | null {
  // Check for last-updated metadata in ROSETTA.md
  const rosettaPath = path.join(cwd, 'ROSETTA.md');
  if (fs.existsSync(rosettaPath)) {
    const content = fs.readFileSync(rosettaPath, 'utf-8');
    const match = content.match(/rosetta:last-updated:(\d{4}-\d{2}-\d{2})/);
    if (match) {
      return match[1];
    }
  }
  return null;
}

/**
 * Build the system prompt for diff-based updates
 */
function buildSyncSystemPrompt(): string {
  return `You are an expert at maintaining codebase documentation. You will receive:
1. The current ROSETTA.md file
2. A git diff showing recent code changes

Your job is to update ROSETTA.md to accurately reflect the changes. Follow these rules:

- ONLY update sections that are directly affected by the diff
- Preserve all existing content that is still accurate
- Do NOT modify the Agent Notes section (that is managed separately)
- Update the <!-- rosetta:last-updated:DATE --> metadata to today's date
- Keep the same format, structure, and level of detail
- Be concise — document what IS, not what should be
- If the diff only affects tests, configs, or non-architectural files, most sections won't need changes

If no meaningful documentation updates are needed, respond with exactly: ${NO_CHANGES}

Otherwise, respond with the complete updated ROSETTA.md content.
Start with "# Rosetta" on the first line. No preamble, no explanation, no code fences around the file.`;
}

/**
 * Build the user prompt with current ROSETTA.md and diff
 */
function buildSyncUserPrompt(currentRosetta: string, diff: string, changedFiles: string): string {
  // Truncate diff if too large
  const maxDiffSize = 40000;
  let truncatedDiff = diff;
  if (diff.length > maxDiffSize) {
    truncatedDiff = diff.slice(0, maxDiffSize) + '\n\n... (diff truncated, ' + diff.length + ' total chars)';
  }

  return `## Current ROSETTA.md

${currentRosetta}

## Changed Files Summary

${changedFiles}

## Git Diff

\`\`\`diff
${truncatedDiff}
\`\`\`

## Instructions

Analyze the diff above and determine if ROSETTA.md needs updating.
Consider: architecture changes, new entry points, new dependencies, convention changes, new gotchas, directory structure changes.
If updates are needed, output the complete updated ROSETTA.md.
If no updates are needed, respond with exactly: ${NO_CHANGES}`;
}

/**
 * Build a brief summary of what changed (for display)
 */
function buildSummaryPrompt(currentRosetta: string, updatedRosetta: string): string {
  // Simple line-by-line comparison for summary
  const currentLines = currentRosetta.split('\n');
  const updatedLines = updatedRosetta.split('\n');

  const changes: string[] = [];
  const currentSections = extractSectionNames(currentRosetta);
  const updatedSections = extractSectionNames(updatedRosetta);

  // Check for new/removed sections
  for (const s of updatedSections) {
    if (!currentSections.includes(s)) changes.push(`Added section: ${s}`);
  }
  for (const s of currentSections) {
    if (!updatedSections.includes(s)) changes.push(`Removed section: ${s}`);
  }

  // Check for content changes in existing sections
  if (currentLines.length !== updatedLines.length) {
    const delta = updatedLines.length - currentLines.length;
    changes.push(`Content ${delta > 0 ? 'expanded' : 'condensed'} by ${Math.abs(delta)} lines`);
  }

  return changes.length > 0 ? changes.join(', ') : 'Minor updates to existing sections';
}

function extractSectionNames(content: string): string[] {
  return content.split('\n')
    .filter(line => line.startsWith('## '))
    .map(line => line.replace('## ', '').trim());
}

/**
 * Run diff-based sync analysis
 */
export async function syncRosetta(opts: DiffSyncOptions): Promise<SyncResult> {
  const { cwd, provider, apiKey, model, since, onStatus } = opts;
  const rosettaPath = path.join(cwd, 'ROSETTA.md');

  if (!fs.existsSync(rosettaPath)) {
    throw new Error('ROSETTA.md not found. Run "rosetta init" first.');
  }

  onStatus?.('Reading current ROSETTA.md...');
  const currentRosetta = fs.readFileSync(rosettaPath, 'utf-8');

  onStatus?.('Analyzing git diff...');
  const diff = getGitDiff(cwd, since);

  if (!diff) {
    return {
      updated: false,
      content: currentRosetta,
      diff: '',
      summary: 'No changes detected since last sync',
    };
  }

  const changedFiles = getChangedFilesSummary(cwd, since);

  onStatus?.(`Sending to ${provider.displayName} (${model})...`);
  const systemPrompt = buildSyncSystemPrompt();
  const userPrompt = buildSyncUserPrompt(currentRosetta, diff, changedFiles);

  const generateOpts: GenerateOptions = {
    apiKey,
    model,
    systemPrompt,
    userPrompt,
  };

  onStatus?.('Analyzing changes...');
  const result = await provider.generateRosetta(generateOpts);
  const trimmed = result.trim();

  // Check if no changes needed
  if (trimmed === NO_CHANGES || trimmed.includes(NO_CHANGES)) {
    return {
      updated: false,
      content: currentRosetta,
      diff,
      summary: 'No documentation updates needed for these changes',
    };
  }

  // Clean up the result
  let updatedContent = trimmed;
  if (updatedContent.startsWith('```markdown')) {
    updatedContent = updatedContent.slice('```markdown'.length);
  } else if (updatedContent.startsWith('```md')) {
    updatedContent = updatedContent.slice('```md'.length);
  } else if (updatedContent.startsWith('```')) {
    updatedContent = updatedContent.slice(3);
  }
  if (updatedContent.endsWith('```')) {
    updatedContent = updatedContent.slice(0, -3);
  }
  updatedContent = updatedContent.trim();

  // Ensure it starts with # Rosetta
  if (!updatedContent.startsWith('# Rosetta')) {
    const idx = updatedContent.indexOf('# Rosetta');
    if (idx > -1) {
      updatedContent = updatedContent.slice(idx);
    }
  }

  const summary = buildSummaryPrompt(currentRosetta, updatedContent);

  return {
    updated: true,
    content: updatedContent,
    diff,
    summary,
  };
}
