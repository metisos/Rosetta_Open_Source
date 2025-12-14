/**
 * rosetta note command
 * Manually add an agent-style note
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export interface NoteOptions {
  agent?: string;
}

export async function noteCommand(message: string, options: NoteOptions): Promise<void> {
  const cwd = process.cwd();
  const rosettaDir = path.join(cwd, '.rosetta');
  const notesPath = path.join(rosettaDir, 'notes.md');

  // Check if Rosetta is initialized
  if (!fs.existsSync(path.join(cwd, 'ROSETTA.md'))) {
    console.log(chalk.yellow('Rosetta not initialized in this project.'));
    console.log();
    console.log("Run " + chalk.white("'rosetta init'") + " first.");
    return;
  }

  // Check if notes.md exists
  if (!fs.existsSync(notesPath)) {
    console.log(chalk.yellow('.rosetta/notes.md not found.'));
    console.log();
    console.log("Run " + chalk.white("'rosetta init'") + " to create it.");
    return;
  }

  // Get current date and agent name
  const today = new Date().toISOString().split('T')[0];
  const agent = options.agent || 'human';

  // Read existing content
  let content = fs.readFileSync(notesPath, 'utf-8');

  // Format the new note
  const newNote = `
### ${today} | ${agent}
- ${message}
`;

  // Append to the file
  content = content.trimEnd() + '\n' + newNote;
  fs.writeFileSync(notesPath, content, 'utf-8');

  console.log(chalk.green('✓') + ' Added note to .rosetta/notes.md');
  console.log();
  console.log(chalk.gray(`  ### ${today} | ${agent}`));
  console.log(chalk.gray(`  - ${message}`));
}
