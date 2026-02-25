/**
 * rosetta watch command
 * Monitors file changes and periodically syncs ROSETTA.md
 *
 * Interactive (TTY):  shows live status, prompts for config
 * Non-interactive:    runs as a background-friendly process, logs to stdout
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { syncRosetta } from '../ai/diff-sync';
import {
  resolveConfigNonInteractive,
  resolveConfigInteractive,
  type AIConfigFlags,
  type AIConfig,
} from '../ai/config';

export interface WatchOptions extends AIConfigFlags {
  interval?: string;
  yes?: boolean;
}

// Track state across sync cycles
let lastSyncHash: string | null = null;
let syncCount = 0;
let isRunning = false;

/**
 * Get a hash of the current working tree state (for change detection)
 */
function getTreeHash(cwd: string): string {
  try {
    return execSync("git diff --stat HEAD -- . ':!.rosetta' ':!ROSETTA.md'", {
      cwd,
      encoding: 'utf-8',
      timeout: 10000,
    }).trim();
  } catch {
    return '';
  }
}

/**
 * Format elapsed time nicely
 */
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour12: false });
}

export async function watchCommand(options: WatchOptions): Promise<void> {
  const cwd = process.cwd();
  const rosettaPath = path.join(cwd, 'ROSETTA.md');

  if (!fs.existsSync(rosettaPath)) {
    console.log(chalk.red('Error:') + ' ROSETTA.md not found.');
    console.log(chalk.gray('Run ') + chalk.white('rosetta init') + chalk.gray(' first.'));
    process.exitCode = 1;
    return;
  }

  const intervalMinutes = parseInt(options.interval || '5', 10);
  if (isNaN(intervalMinutes) || intervalMinutes < 1) {
    console.log(chalk.red('Error:') + ' Interval must be at least 1 minute.');
    process.exitCode = 1;
    return;
  }

  const intervalMs = intervalMinutes * 60 * 1000;
  const isInteractive = process.stdin.isTTY && !options.yes;
  const autoApply = !!options.yes;

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
        console.log(chalk.gray('Set via flags, env vars, or .rosetta/config.yml'));
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

  // Initialize
  lastSyncHash = getTreeHash(cwd);

  console.log();
  console.log(chalk.cyan('  Rosetta Watch Mode'));
  console.log(chalk.gray(`  Provider: ${config.provider.displayName} (${config.model})`));
  console.log(chalk.gray(`  Interval: every ${intervalMinutes} minute${intervalMinutes > 1 ? 's' : ''}`));
  console.log(chalk.gray(`  Auto-apply: ${autoApply ? 'yes' : 'no (will prompt)'}`));
  console.log();
  console.log(chalk.gray(`  [${formatTime(new Date())}] Watching for changes... (Ctrl+C to stop)`));
  console.log();

  // Handle graceful shutdown
  const cleanup = () => {
    console.log();
    console.log(chalk.gray(`  [${formatTime(new Date())}] Watch stopped. ${syncCount} sync${syncCount !== 1 ? 's' : ''} performed.`));
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  // Polling loop
  const checkAndSync = async () => {
    if (isRunning) return;

    const currentHash = getTreeHash(cwd);

    // No changes since last check
    if (currentHash === lastSyncHash) {
      if (isInteractive) {
        process.stdout.write(chalk.gray(`\r  [${formatTime(new Date())}] No changes detected, waiting...`));
      }
      return;
    }

    isRunning = true;

    try {
      console.log(chalk.cyan(`  [${formatTime(new Date())}] Changes detected, analyzing...`));

      const result = await syncRosetta({
        cwd,
        provider: config.provider,
        apiKey: config.apiKey,
        model: config.model,
        onStatus: (msg) => {
          if (isInteractive) {
            process.stdout.write(chalk.gray(`\r  [${formatTime(new Date())}] ${msg}                    `));
          }
        },
      });

      if (!result.updated) {
        console.log(chalk.green(`  [${formatTime(new Date())}] ✓ ${result.summary}`));
        lastSyncHash = currentHash;
        isRunning = false;
        return;
      }

      console.log(chalk.cyan(`  [${formatTime(new Date())}] Updates needed: ${result.summary}`));

      if (autoApply) {
        // Auto-apply in non-interactive mode
        fs.writeFileSync(rosettaPath, result.content, 'utf-8');
        console.log(chalk.green(`  [${formatTime(new Date())}] ✓ ROSETTA.md updated automatically`));
        syncCount++;
      } else if (isInteractive) {
        // Prompt in interactive mode
        const inquirer = await import('inquirer');
        const { confirm } = await inquirer.default.prompt([{
          type: 'confirm',
          name: 'confirm',
          message: 'Apply updates to ROSETTA.md?',
          default: true,
        }]);

        if (confirm) {
          fs.writeFileSync(rosettaPath, result.content, 'utf-8');
          console.log(chalk.green(`  [${formatTime(new Date())}] ✓ ROSETTA.md updated`));
          syncCount++;
        } else {
          console.log(chalk.yellow(`  [${formatTime(new Date())}] Skipped this sync`));
        }
      } else {
        // Non-interactive without --yes: just log
        console.log(chalk.yellow(`  [${formatTime(new Date())}] Updates available. Run with --yes to auto-apply.`));
      }

      lastSyncHash = currentHash;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(chalk.red(`  [${formatTime(new Date())}] Sync error: ${msg}`));
    }

    isRunning = false;
  };

  // Run initial check
  await checkAndSync();

  // Set up interval
  setInterval(checkAndSync, intervalMs);

  // Keep process alive
  await new Promise<void>(() => {
    // This promise never resolves — the process runs until SIGINT/SIGTERM
  });
}
