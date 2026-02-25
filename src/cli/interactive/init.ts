/**
 * Interactive Rosetta init flow
 * Provides dropdown menus for choosing AI-assisted or manual initialization
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { PROVIDERS, getProvider, analyzeCodebase } from '../ai';
import { loadTemplate, renderTemplate, TEMPLATES } from '../utils/templates';
import { setupAgentCommand } from '../commands/setup-agent';

export async function interactiveInit(): Promise<void> {
  const cwd = process.cwd();
  const rosettaPath = path.join(cwd, 'ROSETTA.md');
  const rosettaDir = path.join(cwd, '.rosetta');

  // Check if already initialized
  if (fs.existsSync(rosettaPath)) {
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: 'ROSETTA.md already exists. Overwrite it?',
        default: false,
      },
    ]);
    if (!overwrite) {
      console.log(chalk.yellow('Aborted. Existing ROSETTA.md preserved.'));
      return;
    }
  }

  console.log();

  // Step 1: Choose method
  const { method } = await inquirer.prompt([
    {
      type: 'list',
      name: 'method',
      message: 'How would you like to initialize Rosetta?',
      choices: [
        {
          name: `${chalk.green('AI-Assisted')} ${chalk.gray('- An AI model analyzes your codebase and generates ROSETTA.md')}`,
          value: 'ai',
        },
        {
          name: `${chalk.blue('Manual')} ${chalk.gray('- Creates a template for you to fill in')}`,
          value: 'manual',
        },
      ],
    },
  ]);

  if (method === 'manual') {
    await manualInit(cwd, rosettaPath, rosettaDir);
  } else {
    await aiAssistedInit(cwd, rosettaPath, rosettaDir);
  }
}

/**
 * Manual template-based initialization
 */
async function manualInit(cwd: string, rosettaPath: string, rosettaDir: string): Promise<void> {
  const { template } = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: 'Which template?',
      choices: [
        { name: 'Minimal (recommended)', value: 'minimal' },
        { name: 'Full (with more placeholders)', value: 'full' },
      ],
    },
  ]);

  createDirectoryStructure(rosettaDir);

  const today = new Date().toISOString().split('T')[0];
  const templateName = template === 'full' ? 'ROSETTA.md' : TEMPLATES.ROSETTA_MINIMAL;
  const rosettaTemplate = loadTemplate(templateName);
  const rosettaContent = renderTemplate(rosettaTemplate, { DATE: today });
  fs.writeFileSync(rosettaPath, rosettaContent, 'utf-8');
  console.log(chalk.green('  ✓') + ' Created ROSETTA.md');

  createSupportFiles(rosettaDir, today);
  await promptAgentSetup();
  printNextSteps('manual');
}

/**
 * AI-assisted initialization
 */
async function aiAssistedInit(cwd: string, rosettaPath: string, rosettaDir: string): Promise<void> {
  // Step 2: Choose provider
  const providerChoices = Object.values(PROVIDERS).map((p) => ({
    name: p.displayName,
    value: p.name,
  }));

  const { providerName } = await inquirer.prompt([
    {
      type: 'list',
      name: 'providerName',
      message: 'Which AI provider?',
      choices: providerChoices,
    },
  ]);

  const provider = getProvider(providerName);

  // Step 3: Enter API key
  const { apiKey } = await inquirer.prompt([
    {
      type: 'password',
      name: 'apiKey',
      message: `Enter your ${provider.displayName} API key:`,
      mask: '*',
      validate: (input: string) => {
        if (!input || input.trim().length === 0) {
          return 'API key is required';
        }
        return true;
      },
    },
  ]);

  // Step 4: Choose model
  const modelChoices = provider.models.map((m) => ({
    name: m.label,
    value: m.id,
  }));

  const { model } = await inquirer.prompt([
    {
      type: 'list',
      name: 'model',
      message: 'Which model?',
      choices: modelChoices,
    },
  ]);

  console.log();

  // Step 5: Run analysis
  const spinner = ora({
    text: 'Scanning project structure...',
    color: 'cyan',
  }).start();

  try {
    const rosettaContent = await analyzeCodebase({
      cwd,
      provider,
      apiKey: apiKey.trim(),
      model,
      onStatus: (msg) => {
        spinner.text = msg;
      },
    });

    spinner.succeed('ROSETTA.md generated!');
    console.log();

    // Show preview
    const lines = rosettaContent.split('\n');
    const previewLines = lines.slice(0, 15);
    console.log(chalk.gray('  ─── Preview ───'));
    for (const line of previewLines) {
      console.log(chalk.gray('  │ ') + line);
    }
    if (lines.length > 15) {
      console.log(chalk.gray(`  │ ... (${lines.length - 15} more lines)`));
    }
    console.log(chalk.gray('  ─────────────'));
    console.log();

    // Confirm write
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Write this ROSETTA.md to your project?',
        default: true,
      },
    ]);

    if (!confirm) {
      console.log(chalk.yellow('Aborted. No files written.'));
      return;
    }

    // Write files
    createDirectoryStructure(rosettaDir);
    fs.writeFileSync(rosettaPath, rosettaContent, 'utf-8');
    console.log(chalk.green('  ✓') + ' Created ROSETTA.md');

    const today = new Date().toISOString().split('T')[0];
    createSupportFiles(rosettaDir, today);
    await promptAgentSetup();
    printNextSteps('ai');
  } catch (err) {
    spinner.fail('Failed to generate ROSETTA.md');
    console.log();
    const message = err instanceof Error ? err.message : String(err);
    console.log(chalk.red('  Error: ') + message);
    console.log();
    console.log(chalk.gray('  Tips:'));
    console.log(chalk.gray('  • Check that your API key is valid'));
    console.log(chalk.gray('  • Ensure you have sufficient API credits'));
    console.log(chalk.gray('  • Try a different model or provider'));
    console.log();

    const { fallback } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'fallback',
        message: 'Fall back to manual template?',
        default: true,
      },
    ]);

    if (fallback) {
      await manualInit(cwd, rosettaPath, rosettaDir);
    }
  }
}

/**
 * Create the .rosetta directory structure
 */
function createDirectoryStructure(rosettaDir: string): void {
  const modulesDir = path.join(rosettaDir, 'modules');
  if (!fs.existsSync(rosettaDir)) {
    fs.mkdirSync(rosettaDir, { recursive: true });
  }
  if (!fs.existsSync(modulesDir)) {
    fs.mkdirSync(modulesDir, { recursive: true });
  }
}

/**
 * Create notes.md, config.yml, and modules/.gitkeep
 */
function createSupportFiles(rosettaDir: string, today: string): void {
  const modulesDir = path.join(rosettaDir, 'modules');

  try {
    const notesTemplate = loadTemplate(TEMPLATES.NOTES);
    const notesContent = renderTemplate(notesTemplate, { DATE: today });
    fs.writeFileSync(path.join(rosettaDir, 'notes.md'), notesContent, 'utf-8');
    console.log(chalk.green('  ✓') + ' Created .rosetta/notes.md');
  } catch {
    console.log(chalk.red('  ✗') + ' Failed to create .rosetta/notes.md');
  }

  try {
    const configTemplate = loadTemplate(TEMPLATES.CONFIG);
    fs.writeFileSync(path.join(rosettaDir, 'config.yml'), configTemplate, 'utf-8');
    console.log(chalk.green('  ✓') + ' Created .rosetta/config.yml');
  } catch {
    console.log(chalk.red('  ✗') + ' Failed to create .rosetta/config.yml');
  }

  fs.writeFileSync(path.join(modulesDir, '.gitkeep'), '', 'utf-8');
  console.log(chalk.green('  ✓') + ' Created .rosetta/modules/');
}

/**
 * Ask if user wants to set up agent instruction files
 */
async function promptAgentSetup(): Promise<void> {
  console.log();
  const { setupAgents } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'setupAgents',
      message: 'Configure AI agent instruction files? (CLAUDE.md, .cursorrules, etc.)',
      default: true,
    },
  ]);

  if (setupAgents) {
    const { agents } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'agents',
        message: 'Which agents?',
        choices: [
          { name: 'Claude Code', value: 'claude', checked: true },
          { name: 'Cursor', value: 'cursor', checked: true },
          { name: 'Aider', value: 'aider', checked: true },
        ],
      },
    ]);

    if (agents.length > 0) {
      console.log();
      for (const agent of agents) {
        await setupAgentCommand({ agent, force: false, skipRosettaCheck: true });
      }
    }
  }
}

/**
 * Print next steps guidance
 */
function printNextSteps(method: 'ai' | 'manual'): void {
  console.log();
  console.log(chalk.cyan('  Rosetta initialized!'));
  console.log();

  if (method === 'manual') {
    console.log(chalk.white('  Next steps:'));
    console.log('    1. Edit ' + chalk.white('ROSETTA.md') + ' to describe your project');
    console.log('    2. Run ' + chalk.white('rosetta add-module <name>') + ' to add module docs');
    console.log('    3. Run ' + chalk.white('rosetta validate') + ' to check your work');
  } else {
    console.log(chalk.white('  Next steps:'));
    console.log('    1. Review ' + chalk.white('ROSETTA.md') + ' and adjust as needed');
    console.log('    2. Run ' + chalk.white('rosetta validate') + ' to check structure');
    console.log('    3. Run ' + chalk.white('rosetta add-module <name>') + ' for detailed module docs');
  }

  console.log();
  console.log(chalk.gray('  Docs: https://github.com/metisos/Rosetta_Open_Source'));
}
