/**
 * Rosetta CLI
 * Agent codebase understanding protocol
 */

import { Command } from 'commander';
import chalk from 'chalk';
import {
  initCommand,
  validateCommand,
  statusCommand,
  addModuleCommand,
  noteCommand,
  bootstrapCommand,
  setupAgentCommand,
} from './commands';
import { interactiveInit } from './interactive';
import pkg from '../../package.json';

const VERSION = pkg.version;

const program = new Command();

// Block-art ASCII banner with gradient
const banner = [
  '',
  chalk.cyanBright('   \u2588\u2580\u2580\u2588 \u2588\u2580\u2580\u2588 \u2588\u2580\u2580 \u2588\u2580\u2580 \u2580\u2580\u2588\u2580\u2580 \u2580\u2580\u2588\u2580\u2580 \u2588\u2580\u2580\u2588'),
  chalk.cyan(      '   \u2588\u2584\u2584\u2580 \u2588  \u2588 \u2580\u2580\u2588 \u2588\u2580\u2580   \u2588     \u2588   \u2588\u2584\u2584\u2588'),
  chalk.gray(      '   \u2588  \u2588 \u2580\u2580\u2580\u2580 \u2580\u2580\u2580 \u2580\u2580\u2580   \u2580     \u2580   \u2588  \u2588'),
  '',
  `   ${chalk.gray('Agent Codebase Understanding Protocol')}  ${chalk.cyanBright('v' + VERSION)}`,
  '',
].join('\n');

program
  .name('rosetta')
  .description('Agent codebase understanding protocol - Help AI coding agents understand your codebase')
  .version(VERSION)
  .addHelpText('before', banner)
  .action(() => {
    // Default action when no subcommand given — show custom welcome
    console.log(banner);
    console.log(chalk.cyan('  Quick Start:'));
    console.log();
    console.log('    ' + chalk.white('rosetta init') + chalk.gray('         Interactive setup (AI-assisted or manual)'));
    console.log('    ' + chalk.white('rosetta init -b') + chalk.gray('      Initialize and get bootstrap prompt'));
    console.log('    ' + chalk.white('rosetta status') + chalk.gray('       Check documentation freshness'));
    console.log('    ' + chalk.white('rosetta validate') + chalk.gray('     Validate Rosetta file structure'));
    console.log();
    console.log(chalk.gray('  Run ') + chalk.white('rosetta --help') + chalk.gray(' for all commands'));
    console.log();
    console.log(chalk.gray('  Docs: https://github.com/metisos/Rosetta_Open_Source'));
    console.log();
  });

// rosetta init - now with interactive mode by default
program
  .command('init')
  .description('Initialize Rosetta in a project (interactive by default)')
  .option('-t, --template <template>', 'Use a specific template (minimal, nextjs, python, generic)', 'minimal')
  .option('-f, --force', 'Overwrite existing Rosetta files')
  .option('-b, --bootstrap', 'Output agent instructions to analyze and populate Rosetta')
  .option('-l, --lite', 'Lite mode: only create agent configs, no ROSETTA.md (for new projects)')
  .option('--no-interactive', 'Skip interactive prompts, use template mode directly')
  .action(async (options) => {
    // Default to interactive mode if stdin is a TTY and no flags that imply non-interactive
    const isInteractive = process.stdin.isTTY
      && options.interactive !== false
      && !options.bootstrap
      && !options.lite;

    if (isInteractive) {
      console.log(banner);
      await interactiveInit();
    } else {
      await initCommand(options);
    }
  });

// rosetta validate
program
  .command('validate')
  .description('Check Rosetta files for structural issues')
  .option('-p, --path <path>', 'Path to validate (defaults to current directory)')
  .action(async (options) => {
    await validateCommand(options);
  });

// rosetta status
program
  .command('status')
  .description('Show staleness and coverage info')
  .action(async () => {
    await statusCommand();
  });

// rosetta add-module
program
  .command('add-module <name>')
  .description('Scaffold a new module file')
  .option('-d, --description <description>', 'Brief description of the module')
  .action(async (name, options) => {
    await addModuleCommand(name, options);
  });

// rosetta note
program
  .command('note <message>')
  .description('Manually add an agent-style note')
  .option('-a, --agent <agent>', 'Agent/source name (defaults to "human")')
  .action(async (message, options) => {
    await noteCommand(message, options);
  });

// rosetta bootstrap
program
  .command('bootstrap')
  .description('Output the Bootstrap Protocol for an agent to populate Rosetta')
  .option('-o, --output <file>', 'Write to file instead of stdout')
  .action(async (options) => {
    await bootstrapCommand(options);
  });

// rosetta setup-agent
program
  .command('setup-agent')
  .description('Configure agent instruction files (CLAUDE.md, .cursorrules, etc.) to use Rosetta')
  .option('-a, --agent <agent>', 'Target agent: claude, cursor, aider, or all (default: all)', 'all')
  .option('-f, --force', 'Overwrite existing Rosetta sections')
  .option('--hooks', 'Install Claude Code hooks (auto-enabled for Claude agent)')
  .option('--no-hooks', 'Skip Claude Code hooks installation')
  .action(async (options) => {
    await setupAgentCommand(options);
  });

// Parse and execute
program.parse();
