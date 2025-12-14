/**
 * rosetta status command
 * Show staleness and coverage info
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import yaml from 'yaml';
import { parseRosettaFile, parseAgentNotes } from '../utils/parser';

interface RosettaConfig {
  version?: number;
  staleness?: {
    warning?: number;
    critical?: number;
  };
  track?: string[];
  ignore?: string[];
  modules?: Record<string, string[]>;
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

function getStatusIndicator(daysSince: number, warning: number, critical: number): string {
  if (daysSince >= critical) return chalk.red('✗ Critical');
  if (daysSince >= warning) return chalk.yellow('⚠ Review needed');
  return chalk.green('✓ Fresh');
}

export async function statusCommand(): Promise<void> {
  const cwd = process.cwd();
  const rosettaPath = path.join(cwd, 'ROSETTA.md');
  const rosettaDir = path.join(cwd, '.rosetta');
  const configPath = path.join(rosettaDir, 'config.yml');
  const notesPath = path.join(rosettaDir, 'notes.md');
  const modulesDir = path.join(rosettaDir, 'modules');

  // Check if Rosetta is initialized
  if (!fs.existsSync(rosettaPath)) {
    console.log(chalk.yellow('Rosetta not initialized in this project.'));
    console.log();
    console.log("Run " + chalk.white("'rosetta init'") + " to get started.");
    return;
  }

  // Load config
  let config: RosettaConfig = {
    staleness: { warning: 30, critical: 90 },
  };

  if (fs.existsSync(configPath)) {
    try {
      const configContent = fs.readFileSync(configPath, 'utf-8');
      config = { ...config, ...yaml.parse(configContent) };
    } catch {
      // Use defaults
    }
  }

  const warningDays = config.staleness?.warning || 30;
  const criticalDays = config.staleness?.critical || 90;

  console.log(chalk.cyan('Rosetta Status'));
  console.log(chalk.gray('═'.repeat(40)));
  console.log();

  // Root context
  console.log(chalk.white('Root Context'));
  const rosettaContent = fs.readFileSync(rosettaPath, 'utf-8');
  const rosettaParsed = parseRosettaFile(rosettaContent);

  let rootDays = 0;
  if (rosettaParsed.metadata.lastUpdated) {
    const lastUpdated = new Date(rosettaParsed.metadata.lastUpdated);
    rootDays = Math.floor((Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));
    const status = getStatusIndicator(rootDays, warningDays, criticalDays);
    console.log(
      `  ROSETTA.md`.padEnd(24) +
        chalk.gray(`updated ${formatRelativeTime(lastUpdated)}`.padEnd(24)) +
        status
    );
  } else {
    const stat = fs.statSync(rosettaPath);
    rootDays = Math.floor((Date.now() - stat.mtime.getTime()) / (1000 * 60 * 60 * 24));
    const status = getStatusIndicator(rootDays, warningDays, criticalDays);
    console.log(
      `  ROSETTA.md`.padEnd(24) +
        chalk.gray(`modified ${formatRelativeTime(stat.mtime)}`.padEnd(24)) +
        status
    );
  }

  console.log();

  // Modules
  if (fs.existsSync(modulesDir)) {
    const moduleFiles = fs.readdirSync(modulesDir).filter(f => f.endsWith('.md'));

    console.log(chalk.white(`Modules (${moduleFiles.length} total)`));

    if (moduleFiles.length === 0) {
      console.log(chalk.gray('  No module files found'));
    } else {
      const staleModules: string[] = [];

      for (const moduleFile of moduleFiles) {
        const modulePath = path.join(modulesDir, moduleFile);
        const moduleContent = fs.readFileSync(modulePath, 'utf-8');
        const moduleParsed = parseRosettaFile(moduleContent);

        let moduleDays = 0;
        let timeStr = '';

        if (moduleParsed.metadata.lastVerified) {
          const lastVerified = new Date(moduleParsed.metadata.lastVerified);
          moduleDays = Math.floor((Date.now() - lastVerified.getTime()) / (1000 * 60 * 60 * 24));
          timeStr = `verified ${formatRelativeTime(lastVerified)}`;
        } else {
          const stat = fs.statSync(modulePath);
          moduleDays = Math.floor((Date.now() - stat.mtime.getTime()) / (1000 * 60 * 60 * 24));
          timeStr = `modified ${formatRelativeTime(stat.mtime)}`;
        }

        const status = getStatusIndicator(moduleDays, warningDays, criticalDays);
        console.log(`  ${moduleFile}`.padEnd(24) + chalk.gray(timeStr.padEnd(24)) + status);

        if (moduleDays >= warningDays) {
          staleModules.push(moduleFile);
        }
      }
    }
  } else {
    console.log(chalk.white('Modules'));
    console.log(chalk.gray('  .rosetta/modules/ not found'));
  }

  console.log();

  // Agent Notes
  console.log(chalk.white('Agent Notes'));

  if (fs.existsSync(notesPath)) {
    const notesContent = fs.readFileSync(notesPath, 'utf-8');
    const notes = parseAgentNotes(notesContent);

    const totalEntries = notes.reduce((sum, n) => sum + n.notes.length, 0);

    // Try to find "Last human review" in the file
    const reviewMatch = notesContent.match(/Last human review:\s*(\d{4}-\d{2}-\d{2})/);
    let newEntriesSinceReview = 0;

    if (reviewMatch) {
      const reviewDate = new Date(reviewMatch[1]);
      for (const note of notes) {
        const noteDate = new Date(note.date);
        if (noteDate > reviewDate) {
          newEntriesSinceReview += note.notes.length;
        }
      }
    } else {
      newEntriesSinceReview = totalEntries;
    }

    console.log(`  Total entries:`.padEnd(24) + `${totalEntries}`);
    console.log(`  Since last review:`.padEnd(24) + `${newEntriesSinceReview} new`);
  } else {
    console.log(chalk.gray('  .rosetta/notes.md not found'));
  }

  console.log();

  // Suggestions
  console.log(chalk.white('Suggestions'));

  const suggestions: string[] = [];

  // Check for stale modules
  if (fs.existsSync(modulesDir)) {
    const moduleFiles = fs.readdirSync(modulesDir).filter(f => f.endsWith('.md'));
    for (const moduleFile of moduleFiles) {
      const modulePath = path.join(modulesDir, moduleFile);
      const moduleContent = fs.readFileSync(modulePath, 'utf-8');
      const moduleParsed = parseRosettaFile(moduleContent);

      if (moduleParsed.metadata.lastVerified) {
        const lastVerified = new Date(moduleParsed.metadata.lastVerified);
        const moduleDays = Math.floor((Date.now() - lastVerified.getTime()) / (1000 * 60 * 60 * 24));
        if (moduleDays >= warningDays) {
          suggestions.push(`Review .rosetta/modules/${moduleFile} (stale)`);
        }
      }
    }
  }

  // Check for unreviewed notes
  if (fs.existsSync(notesPath)) {
    const notesContent = fs.readFileSync(notesPath, 'utf-8');
    const notes = parseAgentNotes(notesContent);
    const reviewMatch = notesContent.match(/Last human review:\s*(\d{4}-\d{2}-\d{2})/);

    if (reviewMatch) {
      const reviewDate = new Date(reviewMatch[1]);
      let newCount = 0;
      for (const note of notes) {
        const noteDate = new Date(note.date);
        if (noteDate > reviewDate) {
          newCount += note.notes.length;
        }
      }
      if (newCount > 0) {
        suggestions.push(`Curate .rosetta/notes.md (${newCount} new entries)`);
      }
    }
  }

  if (suggestions.length === 0) {
    console.log(chalk.green('  ✓ Everything looks good!'));
  } else {
    for (const suggestion of suggestions) {
      console.log(chalk.yellow('  →') + ` ${suggestion}`);
    }
  }
}
