/**
 * Rosetta - Agent Codebase Understanding Protocol
 *
 * Programmatic API for integrating Rosetta into coding agents
 */

export {
  parseRosettaFile,
  validateSections,
  parseModuleIndex,
  parseAgentNotes,
  REQUIRED_SECTIONS,
  REQUIRED_MODULE_SECTIONS,
  type RosettaSection,
  type RosettaMetadata,
  type ParsedRosetta,
} from './cli/utils/parser';

export {
  loadTemplate,
  renderTemplate,
  loadAndRenderTemplate,
  TEMPLATES,
} from './cli/utils/templates';

export {
  isGitRepo,
  getLastModified,
  getFilesModifiedSince,
  getGitRoot,
} from './cli/utils/git';

/**
 * Agent Loading Protocol
 *
 * When integrating Rosetta into a coding agent, follow this protocol:
 *
 * 1. On session start:
 *    - Read ROSETTA.md first (always)
 *    - Review the Module Index table
 *    - Load relevant module files from .rosetta/modules/
 *    - Check .rosetta/notes.md for recent learnings
 *
 * 2. During work:
 *    - Refer to Conventions and Key Patterns when writing code
 *    - Check Gotchas before modifying unfamiliar areas
 *
 * 3. Before session end:
 *    - If you discovered something valuable, append to .rosetta/notes.md
 *    - Format: ### YYYY-MM-DD | [agent-name]
 *    - Keep entries concise and actionable
 */
export const ROSETTA_PROTOCOL = {
  ROOT_FILE: 'ROSETTA.md',
  MODULES_DIR: '.rosetta/modules',
  NOTES_FILE: '.rosetta/notes.md',
  CONFIG_FILE: '.rosetta/config.yml',
};
