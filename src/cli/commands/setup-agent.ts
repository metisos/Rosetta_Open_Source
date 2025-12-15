/**
 * rosetta setup-agent command
 * Configure agent instruction files to use Rosetta
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { loadTemplate, TEMPLATES } from '../utils/templates';

export interface SetupAgentOptions {
  agent?: 'claude' | 'cursor' | 'aider' | 'all';
  force?: boolean;
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

function hasRosettaSection(content: string, marker: string): boolean {
  return content.includes(marker);
}

export async function setupAgentCommand(options: SetupAgentOptions): Promise<void> {
  const cwd = process.cwd();
  const rosettaPath = path.join(cwd, 'ROSETTA.md');

  // Check if Rosetta is initialized
  if (!fs.existsSync(rosettaPath)) {
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
  }
}
