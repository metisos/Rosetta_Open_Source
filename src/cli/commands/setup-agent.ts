/**
 * rosetta setup-agent command
 * Configure agent instruction files to use Rosetta
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { loadTemplate, TEMPLATES, CLAUDE_HOOKS_FILES } from '../utils/templates';

export interface SetupAgentOptions {
  agent?: 'claude' | 'cursor' | 'aider' | 'all';
  force?: boolean;
  skipRosettaCheck?: boolean;  // For lite mode - allow setup without ROSETTA.md
  hooks?: boolean;  // Install Claude Code hooks
}

interface AgentConfig {
  name: string;
  files: string[];
  template: string;
  appendMode: boolean;
  sectionMarker?: string;
}

const AGENT_CONFIGS: AgentConfig[] = [
  {
    name: 'Claude Code',
    files: ['.claude/CLAUDE.md', 'CLAUDE.md'],
    template: TEMPLATES.AGENT_CONFIG_CLAUDE,
    appendMode: true,
    sectionMarker: '## Rosetta Protocol',
  },
  {
    name: 'Cursor',
    files: ['.cursorrules'],
    template: TEMPLATES.AGENT_CONFIG_CURSOR,
    appendMode: true,
    sectionMarker: '## Rosetta Protocol',
  },
  {
    name: 'Aider',
    files: ['.aider.conf.yml'],
    template: TEMPLATES.AGENT_CONFIG_AIDER,
    appendMode: false, // YAML needs special handling
  },
];

function findExistingFile(files: string[], cwd: string): string | null {
  for (const file of files) {
    const filePath = path.join(cwd, file);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }
  return null;
}

interface HooksResult {
  created: number;
  skipped: number;
  updated: number;
}

function setupClaudeHooks(cwd: string, force: boolean): HooksResult {
  const result: HooksResult = { created: 0, skipped: 0, updated: 0 };

  const hooksDir = path.join(cwd, '.claude', 'hooks');
  const settingsPath = path.join(cwd, '.claude', 'settings.json');

  // Create hooks directory
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }

  // Install hook scripts
  for (const hookFile of CLAUDE_HOOKS_FILES) {
    const hookPath = path.join(hooksDir, hookFile.name);

    if (fs.existsSync(hookPath) && !force) {
      console.log(chalk.yellow('  ⊘') + ` Hook ${hookFile.name} already exists (use --force to replace)`);
      result.skipped++;
      continue;
    }

    const content = loadTemplate(hookFile.template);
    fs.writeFileSync(hookPath, content, { mode: 0o755 });
    console.log(chalk.green('  ✓') + ` Created hook: ${hookFile.name}`);
    result.created++;
  }

  // Handle settings.json - merge hooks config
  const hooksConfig = JSON.parse(loadTemplate(TEMPLATES.CLAUDE_HOOKS_SETTINGS));

  if (fs.existsSync(settingsPath)) {
    // Merge with existing settings
    try {
      const existingContent = fs.readFileSync(settingsPath, 'utf-8');
      const existingSettings = JSON.parse(existingContent);

      // Check if hooks already exist
      if (existingSettings.hooks && !force) {
        console.log(chalk.yellow('  ⊘') + ' settings.json already has hooks (use --force to replace)');
        result.skipped++;
      } else {
        // Merge hooks into existing settings
        existingSettings.hooks = hooksConfig.hooks;
        fs.writeFileSync(settingsPath, JSON.stringify(existingSettings, null, 2) + '\n', 'utf-8');
        console.log(chalk.green('  ✓') + ' Updated .claude/settings.json with Rosetta hooks');
        result.updated++;
      }
    } catch {
      // Invalid JSON, backup and create new
      const backupPath = settingsPath + '.backup';
      fs.copyFileSync(settingsPath, backupPath);
      fs.writeFileSync(settingsPath, JSON.stringify(hooksConfig, null, 2) + '\n', 'utf-8');
      console.log(chalk.yellow('  ⚠') + ` Backed up invalid settings.json, created new with hooks`);
      result.created++;
    }
  } else {
    // Create new settings.json
    fs.writeFileSync(settingsPath, JSON.stringify(hooksConfig, null, 2) + '\n', 'utf-8');
    console.log(chalk.green('  ✓') + ' Created .claude/settings.json with Rosetta hooks');
    result.created++;
  }

  return result;
}

function hasRosettaSection(content: string, marker: string): boolean {
  return content.includes(marker);
}

export async function setupAgentCommand(options: SetupAgentOptions): Promise<void> {
  const cwd = process.cwd();
  const rosettaPath = path.join(cwd, 'ROSETTA.md');

  // Check if Rosetta is initialized (skip in lite mode)
  if (!options.skipRosettaCheck && !fs.existsSync(rosettaPath)) {
    console.log(chalk.yellow('ROSETTA.md not found.'));
    console.log();
    console.log("Run " + chalk.white("'rosetta init'") + " first to initialize Rosetta.");
    return;
  }

  console.log(chalk.cyan('Rosetta Agent Setup'));
  console.log(chalk.gray('═'.repeat(40)));
  console.log();

  const targetAgents = options.agent === 'all' || !options.agent
    ? AGENT_CONFIGS
    : AGENT_CONFIGS.filter(a => a.name.toLowerCase().includes(options.agent!));

  let updated = 0;
  let skipped = 0;
  let created = 0;

  for (const agent of targetAgents) {
    const existingFile = findExistingFile(agent.files, cwd);
    const templateContent = loadTemplate(agent.template);

    if (existingFile) {
      // File exists - check if we need to update
      const content = fs.readFileSync(existingFile, 'utf-8');

      if (agent.sectionMarker && hasRosettaSection(content, agent.sectionMarker)) {
        if (!options.force) {
          console.log(chalk.yellow('⊘') + ` ${agent.name}: Rosetta section already exists (use --force to replace)`);
          skipped++;
          continue;
        }
        // Remove existing section and re-add
        const lines = content.split('\n');
        const sectionStart = lines.findIndex(l => l.includes(agent.sectionMarker!));
        if (sectionStart !== -1) {
          // Find next ## heading or end of file
          let sectionEnd = lines.length;
          for (let i = sectionStart + 1; i < lines.length; i++) {
            if (lines[i].match(/^## /) && !lines[i].includes('Rosetta')) {
              sectionEnd = i;
              break;
            }
          }
          lines.splice(sectionStart, sectionEnd - sectionStart);
          const newContent = lines.join('\n').trimEnd() + '\n\n' + templateContent;
          fs.writeFileSync(existingFile, newContent, 'utf-8');
          console.log(chalk.green('✓') + ` ${agent.name}: Updated ${path.relative(cwd, existingFile)}`);
          updated++;
        }
      } else if (agent.appendMode) {
        // Append to existing file
        const newContent = content.trimEnd() + '\n\n' + templateContent;
        fs.writeFileSync(existingFile, newContent, 'utf-8');
        console.log(chalk.green('✓') + ` ${agent.name}: Added Rosetta section to ${path.relative(cwd, existingFile)}`);
        updated++;
      } else {
        // For YAML files, we need special handling
        if (content.includes('ROSETTA.md')) {
          console.log(chalk.yellow('⊘') + ` ${agent.name}: Already configured for Rosetta`);
          skipped++;
        } else {
          const newContent = content.trimEnd() + '\n\n' + templateContent;
          fs.writeFileSync(existingFile, newContent, 'utf-8');
          console.log(chalk.green('✓') + ` ${agent.name}: Updated ${path.relative(cwd, existingFile)}`);
          updated++;
        }
      }
    } else {
      // Create new file
      const targetFile = path.join(cwd, agent.files[0]);
      const targetDir = path.dirname(targetFile);

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      fs.writeFileSync(targetFile, templateContent, 'utf-8');
      console.log(chalk.green('✓') + ` ${agent.name}: Created ${agent.files[0]}`);
      created++;
    }
  }

  // Install Claude Code hooks if requested or if setting up Claude
  const shouldInstallHooks = options.hooks !== false &&
    (options.agent === 'claude' || options.agent === 'all' || !options.agent);

  let hooksResult: HooksResult | null = null;
  if (shouldInstallHooks) {
    console.log();
    console.log(chalk.cyan('Installing Claude Code Hooks...'));
    hooksResult = setupClaudeHooks(cwd, options.force || false);
    created += hooksResult.created;
    updated += hooksResult.updated;
    skipped += hooksResult.skipped;
  }

  console.log();
  console.log(chalk.gray('─'.repeat(40)));
  console.log(
    `Summary: ${created > 0 ? chalk.green(`${created} created`) : '0 created'}, ` +
    `${updated > 0 ? chalk.cyan(`${updated} updated`) : '0 updated'}, ` +
    `${skipped > 0 ? chalk.yellow(`${skipped} skipped`) : '0 skipped'}`
  );

  if (created > 0 || updated > 0) {
    console.log();
    console.log(chalk.green('Agent configs are now Rosetta-aware!'));
    console.log(chalk.gray('Future agent sessions will automatically use Rosetta context.'));

    if (hooksResult && (hooksResult.created > 0 || hooksResult.updated > 0)) {
      console.log();
      console.log(chalk.cyan('Claude Code hooks installed:'));
      console.log(chalk.gray('  • SessionStart: Reminds to load ROSETTA.md'));
      console.log(chalk.gray('  • UserPromptSubmit: Adds Rosetta context for exploration'));
      console.log(chalk.gray('  • PostToolUse: Warns about documentation staleness'));
      console.log(chalk.gray('  • Stop: Reminds to update .rosetta/notes.md'));
    }
  }
}
