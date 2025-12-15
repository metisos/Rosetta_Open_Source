/**
 * rosetta init command
 * Initialize Rosetta in a project
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { loadTemplate, renderTemplate, TEMPLATES } from '../utils/templates';
import { setupAgentCommand } from './setup-agent';

export interface InitOptions {
  template?: string;
  force?: boolean;
  bootstrap?: boolean;
  lite?: boolean;
}

export async function initCommand(options: InitOptions): Promise<void> {
  const cwd = process.cwd();

  // Lite mode: only set up agent configs, no ROSETTA.md
  if (options.lite) {
    console.log(chalk.cyan('Rosetta Lite Init'));
    console.log(chalk.gray('Setting up agent configs for a new project...'));
    console.log();

    await setupAgentCommand({ agent: 'all', force: options.force, skipRosettaCheck: true });

    console.log();
    console.log(chalk.cyan('Lite init complete!'));
    console.log();
    console.log(chalk.white('What happens next:'));
    console.log('  • Agents will see instructions to create ROSETTA.md');
    console.log('  • They\'ll wait until your project has enough to document');
    console.log('  • When ready, they\'ll initialize full Rosetta automatically');
    console.log();
    console.log(chalk.gray('Triggers for full init:'));
    console.log('  • First feature/module complete');
    console.log('  • Clear directory structure established');
    console.log('  • Patterns starting to emerge');
    console.log('  • First non-obvious gotcha discovered');
    console.log();
    console.log(chalk.gray('Or run ') + chalk.white('rosetta init') + chalk.gray(' manually when ready.'));
    return;
  }

  const rosettaPath = path.join(cwd, 'ROSETTA.md');
  const rosettaDir = path.join(cwd, '.rosetta');

  // Check if already initialized
  if (fs.existsSync(rosettaPath) && !options.force) {
    console.log(chalk.yellow('ROSETTA.md already exists. Use --force to overwrite.'));
    return;
  }

  // Create .rosetta directory structure
  const modulesDir = path.join(rosettaDir, 'modules');

  if (!fs.existsSync(rosettaDir)) {
    fs.mkdirSync(rosettaDir, { recursive: true });
  }

  if (!fs.existsSync(modulesDir)) {
    fs.mkdirSync(modulesDir, { recursive: true });
  }

  // Get current date
  const today = new Date().toISOString().split('T')[0];

  // Create ROSETTA.md from template
  try {
    const templateName = options.template === 'nextjs' ? 'ROSETTA.md' : TEMPLATES.ROSETTA_MINIMAL;
    const rosettaTemplate = loadTemplate(templateName);
    const rosettaContent = renderTemplate(rosettaTemplate, { DATE: today });
    fs.writeFileSync(rosettaPath, rosettaContent, 'utf-8');
    console.log(chalk.green('✓') + ' Created ROSETTA.md');
  } catch (error) {
    console.log(chalk.red('✗') + ' Failed to create ROSETTA.md');
    console.error(error);
    return;
  }

  // Create .rosetta/notes.md
  try {
    const notesTemplate = loadTemplate(TEMPLATES.NOTES);
    const notesContent = renderTemplate(notesTemplate, { DATE: today });
    fs.writeFileSync(path.join(rosettaDir, 'notes.md'), notesContent, 'utf-8');
    console.log(chalk.green('✓') + ' Created .rosetta/notes.md');
  } catch (error) {
    console.log(chalk.red('✗') + ' Failed to create .rosetta/notes.md');
  }

  // Create .rosetta/config.yml
  try {
    const configTemplate = loadTemplate(TEMPLATES.CONFIG);
    fs.writeFileSync(path.join(rosettaDir, 'config.yml'), configTemplate, 'utf-8');
    console.log(chalk.green('✓') + ' Created .rosetta/config.yml');
  } catch (error) {
    console.log(chalk.red('✗') + ' Failed to create .rosetta/config.yml');
  }

  // Create .rosetta/modules/.gitkeep
  fs.writeFileSync(path.join(modulesDir, '.gitkeep'), '', 'utf-8');
  console.log(chalk.green('✓') + ' Created .rosetta/modules/');

  console.log();
  console.log(chalk.cyan('Rosetta initialized!') + ' Next steps:');
  console.log();
  console.log('  1. Edit ' + chalk.white('ROSETTA.md') + ' to describe your project');
  console.log('  2. Run ' + chalk.white("'rosetta add-module <name>'") + ' to add module docs');
  console.log('  3. Run ' + chalk.white("'rosetta setup-agent'") + ' to configure agent files');
  console.log();

  if (options.bootstrap) {
    console.log(chalk.yellow('─'.repeat(60)));
    console.log();
    console.log(chalk.cyan('Bootstrap Protocol'));
    console.log(chalk.gray('Copy and paste the following into your AI coding agent:'));
    console.log();
    try {
      const bootstrapPrompt = loadTemplate(TEMPLATES.BOOTSTRAP);
      console.log(bootstrapPrompt);
    } catch {
      console.log(chalk.red('Failed to load bootstrap prompt'));
    }
  }

  console.log(chalk.gray('Docs: https://github.com/metisos/rosetta'));
}
