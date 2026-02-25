/**
 * rosetta sync command
 * Analyzes git diffs and updates ROSETTA.md using an AI provider
 *
 * Interactive (TTY):  prompts for missing config, shows preview, asks for confirmation
 * Non-interactive:    requires flags/env for config, --yes to auto-apply
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { syncRosetta, getChangedFilesSummary } from '../ai/diff-sync';
import {
  resolveConfigNonInteractive,
  resolveConfigInteractive,
  type AIConfigFlags,
  type AIConfig,
} from '../ai/config';

export interface SyncOptions extends AIConfigFlags {
  since?: string;
  yes?: boolean;
  dryRun?: boolean;
}

export async function syncCommand(options: SyncOptions): Promise<void> {
  const cwd = process.cwd();
  const rosettaPath = path.join(cwd, 'ROSETTA.md');

  if (!fs.existsSync(rosettaPath)) {
    console.log(chalk.red('Error:') + ' ROSETTA.md not found.');
    console.log(chalk.gray('Run ') + chalk.white('rosetta init') + chalk.gray(' first.'));
    process.exitCode = 1;
    return;
  }

  const isInteractive = process.stdin.isTTY && !options.yes;

  // Resolve AI config
  let config: AIConfig;
  try {
    if (isInteractive) {
      config = await resolveConfigInteractive(cwd, options);
    } else {
      const resolved = resolveConfigNonInteractive(cwd, options);
      if (!resolved.provider || !resolved.model || !resolved.apiKey) {
        const missing: string[] = [];
        if (!resolved.provider) missing.push('--provider');
        if (!resolved.apiKey) missing.push('--key or env var');
        console.log(chalk.red('Error:') + ` Missing config: ${missing.join(', ')}`);
        console.log(chalk.gray('Set via flags, env vars (ANTHROPIC_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY), or .rosetta/config.yml'));
        process.exitCode = 1;
        return;
      }
      config = {
        provider: resolved.provider,
        model: resolved.model,
        apiKey: resolved.apiKey,
      };
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(chalk.red('Config error:') + ' ' + msg);
    process.exitCode = 1;
    return;
  }

  // Show changed files summary first
  if (isInteractive) {
    const summary = getChangedFilesSummary(cwd, options.since);
    if (summary) {
      console.log();
      console.log(chalk.cyan('  Changed files:'));
      for (const line of summary.split('\n').slice(0, 15)) {
        console.log(chalk.gray('    ' + line));
      }
      console.log();
    }
  }

  // Run sync
  const spinner = ora({
    text: 'Analyzing changes...',
    color: 'cyan',
  });

  if (!options.dryRun) {
    spinner.start();
  }

  try {
    const result = await syncRosetta({
      cwd,
      provider: config.provider,
      apiKey: config.apiKey,
      model: config.model,
      since: options.since,
      onStatus: (msg) => {
        if (options.dryRun) {
          console.log(chalk.gray('  ' + msg));
        } else {
          spinner.text = msg;
        }
      },
    });

    if (!options.dryRun) {
      spinner.stop();
    }

    if (!result.updated) {
      console.log(chalk.green('  ✓') + ' ' + result.summary);
      return;
    }

    // Show what changed
    console.log(chalk.cyan('  Changes detected:') + ' ' + result.summary);
    console.log();

    // Show preview
    const currentContent = fs.readFileSync(rosettaPath, 'utf-8');
    const currentLines = currentContent.split('\n');
    const newLines = result.content.split('\n');

    // Simple diff display
    const previewLimit = 20;
    let displayedChanges = 0;
    for (let i = 0; i < Math.max(currentLines.length, newLines.length) && displayedChanges < previewLimit; i++) {
      const oldLine = currentLines[i] || '';
      const newLine = newLines[i] || '';
      if (oldLine !== newLine) {
        if (oldLine) console.log(chalk.red('  - ' + oldLine));
        if (newLine) console.log(chalk.green('  + ' + newLine));
        displayedChanges++;
      }
    }

    const totalChanges = currentLines.filter((line, i) => line !== (newLines[i] || '')).length +
      Math.max(0, newLines.length - currentLines.length);
    if (totalChanges > previewLimit) {
      console.log(chalk.gray(`  ... and ${totalChanges - previewLimit} more changes`));
    }
    console.log();

    // Dry run — just show, don't apply
    if (options.dryRun) {
      console.log(chalk.yellow('  Dry run — no files modified.'));
      return;
    }

    // Interactive confirmation
    if (isInteractive) {
      const inquirer = await import('inquirer');
      const { confirm } = await inquirer.default.prompt([{
        type: 'confirm',
        name: 'confirm',
        message: 'Apply these updates to ROSETTA.md?',
        default: true,
      }]);

      if (!confirm) {
        console.log(chalk.yellow('  Skipped — ROSETTA.md unchanged.'));
        return;
      }
    }

    // Apply updates
    fs.writeFileSync(rosettaPath, result.content, 'utf-8');
    console.log(chalk.green('  ✓') + ' ROSETTA.md updated');

  } catch (err) {
    if (!options.dryRun) {
      spinner.fail('Sync failed');
    }
    const msg = err instanceof Error ? err.message : String(err);
    console.log(chalk.red('  Error: ') + msg);
    process.exitCode = 1;
  }
}
