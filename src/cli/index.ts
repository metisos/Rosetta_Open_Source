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
import pkg from '../../package.json';

const VERSION = pkg.version;

const program = new Command();

// ASCII art banner
const banner = `
${chalk.cyan('┌─────────────────────────────────────────────────────────┐')}
${chalk.cyan('│')}  ${chalk.white('ROSETTA')} ${chalk.gray('- Agent Codebase Understanding Protocol')}      ${chalk.cyan('│')}
${chalk.cyan('│')}  ${chalk.gray(`v${VERSION}`)}                                                 ${chalk.cyan('│')}
${chalk.cyan('└─────────────────────────────────────────────────────────┘')}
`;

program
  .name('rosetta')
  .description('Agent codebase understanding protocol - Help AI coding agents understand your codebase')
  .version(VERSION)
  .addHelpText('before', banner);

// rosetta init
program
  .command('init')
  .description('Initialize Rosetta in a project')
  .option('-t, --template <template>', 'Use a specific template (minimal, nextjs, python, generic)', 'minimal')
  .option('-f, --force', 'Overwrite existing Rosetta files')
  .option('-b, --bootstrap', 'Output agent instructions to analyze and populate Rosetta')
  .option('-l, --lite', 'Lite mode: only create agent configs, no ROSETTA.md (for new projects)')
  .action(async (options) => {
    await initCommand(options);
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
  .action(async (options) => {
    await setupAgentCommand(options);
  });

// Parse and execute
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  console.log(banner);
  console.log(chalk.cyan('Quick Start:'));
  console.log();
  console.log('  ' + chalk.white('rosetta init') + chalk.gray('         Initialize Rosetta in your project'));
  console.log('  ' + chalk.white('rosetta init -b') + chalk.gray('      Initialize and get bootstrap prompt'));
  console.log('  ' + chalk.white('rosetta status') + chalk.gray('       Check documentation freshness'));
  console.log('  ' + chalk.white('rosetta validate') + chalk.gray('     Validate Rosetta file structure'));
  console.log();
  console.log(chalk.gray('Run ') + chalk.white('rosetta --help') + chalk.gray(' for all commands'));
  console.log();
  console.log(chalk.gray('Docs: https://github.com/metisos/rosetta'));
}
