/**
 * rosetta bootstrap command
 * Output the Bootstrap Protocol for an agent to populate Rosetta
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { loadTemplate, TEMPLATES } from '../utils/templates';

export interface BootstrapOptions {
  output?: string;
}

export async function bootstrapCommand(options: BootstrapOptions): Promise<void> {
  const cwd = process.cwd();
  const rosettaPath = path.join(cwd, 'ROSETTA.md');

  // Check if ROSETTA.md exists
  if (!fs.existsSync(rosettaPath)) {
    console.log(chalk.yellow('Warning: ROSETTA.md not found.'));
    console.log();
    console.log(
      chalk.gray("Consider running ") +
        chalk.white("'rosetta init'") +
        chalk.gray(" first to create the file structure,")
    );
    console.log(chalk.gray("then use this bootstrap prompt to have an agent populate the content."));
    console.log();
  }

  try {
    const bootstrapPrompt = loadTemplate(TEMPLATES.BOOTSTRAP);

    if (options.output) {
      // Write to file
      fs.writeFileSync(options.output, bootstrapPrompt, 'utf-8');
      console.log(chalk.green('✓') + ` Bootstrap prompt written to ${options.output}`);
    } else {
      // Output to stdout
      console.log(chalk.cyan('Rosetta Bootstrap Protocol'));
      console.log(chalk.gray('─'.repeat(60)));
      console.log(chalk.gray('Copy and paste the following into your AI coding agent:'));
      console.log(chalk.gray('─'.repeat(60)));
      console.log();
      console.log(bootstrapPrompt);
      console.log();
      console.log(chalk.gray('─'.repeat(60)));
      console.log(chalk.gray('Tip: Use') + chalk.white(' rosetta bootstrap | pbcopy ') + chalk.gray('to copy to clipboard (macOS)'));
      console.log(chalk.gray('     or') + chalk.white(' rosetta bootstrap | xclip -selection clipboard ') + chalk.gray('(Linux)'));
    }
  } catch (error) {
    console.log(chalk.red('✗') + ` Failed to load bootstrap prompt: ${error}`);
    process.exitCode = 1;
  }
}
