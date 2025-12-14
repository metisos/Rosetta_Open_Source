/**
 * rosetta add-module command
 * Scaffold a new module file
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { loadTemplate, renderTemplate, TEMPLATES } from '../utils/templates';

export interface AddModuleOptions {
  description?: string;
}

export async function addModuleCommand(name: string, options: AddModuleOptions): Promise<void> {
  const cwd = process.cwd();
  const rosettaDir = path.join(cwd, '.rosetta');
  const modulesDir = path.join(rosettaDir, 'modules');
  const modulePath = path.join(modulesDir, `${name}.md`);

  // Check if Rosetta is initialized
  if (!fs.existsSync(path.join(cwd, 'ROSETTA.md'))) {
    console.log(chalk.yellow('Rosetta not initialized in this project.'));
    console.log();
    console.log("Run " + chalk.white("'rosetta init'") + " first.");
    return;
  }

  // Check if module already exists
  if (fs.existsSync(modulePath)) {
    console.log(chalk.yellow(`Module '${name}' already exists at ${modulePath}`));
    return;
  }

  // Ensure modules directory exists
  if (!fs.existsSync(modulesDir)) {
    fs.mkdirSync(modulesDir, { recursive: true });
  }

  // Get current date
  const today = new Date().toISOString().split('T')[0];

  // Load and render template
  try {
    const moduleTemplate = loadTemplate(TEMPLATES.MODULE);
    const moduleContent = renderTemplate(moduleTemplate, {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      DATE: today,
    });
    fs.writeFileSync(modulePath, moduleContent, 'utf-8');
  } catch (error) {
    console.log(chalk.red('✗') + ` Failed to create module file: ${error}`);
    return;
  }

  console.log(chalk.green('✓') + ` Created .rosetta/modules/${name}.md`);
  console.log();

  // Remind to add to Module Index
  console.log(chalk.cyan('Next steps:'));
  console.log();
  console.log('  1. Edit ' + chalk.white(`.rosetta/modules/${name}.md`) + ' to document the module');
  console.log('  2. Add an entry to the Module Index in ROSETTA.md:');
  console.log();
  console.log(chalk.gray('     | Module | Path | Description | Load When |'));
  console.log(chalk.gray('     |--------|------|-------------|-----------|'));
  console.log(
    chalk.white(
      `     | ${name} | \`.rosetta/modules/${name}.md\` | ${options.description || '[description]'} | [when to load] |`
    )
  );
}
