/**
 * Markdown structure parsing utilities for Rosetta files
 */

export interface RosettaSection {
  name: string;
  level: number;
  content: string;
  startLine: number;
  endLine: number;
}

export interface RosettaMetadata {
  version?: string;
  lastUpdated?: string;
  lastVerified?: string;
  paths?: string[];
}

export interface ParsedRosetta {
  sections: RosettaSection[];
  metadata: RosettaMetadata;
  rawContent: string;
}

/**
 * Required sections in ROSETTA.md
 */
export const REQUIRED_SECTIONS = [
  'Overview',
  'Tech Stack',
  'Architecture',
  'Directory Structure',
  'Conventions',
  'Entry Points',
  'Module Index',
  'Gotchas',
  'Agent Notes',
];

/**
 * Required sections in module files
 */
export const REQUIRED_MODULE_SECTIONS = [
  'Responsibility',
  'Key Files',
  'Data Flow',
  'Interfaces',
  'Gotchas',
];

/**
 * Parse a Rosetta markdown file into sections
 */
export function parseRosettaFile(content: string): ParsedRosetta {
  const lines = content.split('\n');
  const sections: RosettaSection[] = [];
  const metadata: RosettaMetadata = {};

  let currentSection: RosettaSection | null = null;
  let currentContent: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for metadata comments
    const metadataMatch = line.match(/<!--\s*rosetta:(\w+):(.+?)\s*-->/);
    if (metadataMatch) {
      const [, key, value] = metadataMatch;
      if (key === 'version') metadata.version = value;
      else if (key === 'last-updated') metadata.lastUpdated = value;
      else if (key === 'last-verified') metadata.lastVerified = value;
      else if (key === 'paths') metadata.paths = value.split(',').map(p => p.trim());
      continue;
    }

    // Check for heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      // Save previous section
      if (currentSection) {
        currentSection.content = currentContent.join('\n').trim();
        currentSection.endLine = i - 1;
        sections.push(currentSection);
      }

      const [, hashes, title] = headingMatch;
      currentSection = {
        name: title,
        level: hashes.length,
        content: '',
        startLine: i,
        endLine: i,
      };
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    }
  }

  // Save last section
  if (currentSection) {
    currentSection.content = currentContent.join('\n').trim();
    currentSection.endLine = lines.length - 1;
    sections.push(currentSection);
  }

  return {
    sections,
    metadata,
    rawContent: content,
  };
}

/**
 * Check if all required sections are present
 */
export function validateSections(
  parsed: ParsedRosetta,
  requiredSections: string[]
): { valid: boolean; missing: string[]; found: string[] } {
  const sectionNames = parsed.sections.map(s => s.name);
  const missing: string[] = [];
  const found: string[] = [];

  for (const required of requiredSections) {
    if (sectionNames.some(name => name.toLowerCase().includes(required.toLowerCase()))) {
      found.push(required);
    } else {
      missing.push(required);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
    found,
  };
}

/**
 * Parse the Module Index table from ROSETTA.md
 */
export function parseModuleIndex(content: string): Array<{
  module: string;
  path: string;
  description: string;
  loadWhen: string;
}> {
  const modules: Array<{
    module: string;
    path: string;
    description: string;
    loadWhen: string;
  }> = [];

  const lines = content.split('\n');
  let inModuleIndex = false;
  let headerPassed = false;

  for (const line of lines) {
    if (line.includes('## Module Index')) {
      inModuleIndex = true;
      continue;
    }

    if (inModuleIndex && line.startsWith('##')) {
      break; // Next section
    }

    if (inModuleIndex) {
      // Skip header row and separator
      if (line.includes('| Module |') || line.includes('|---')) {
        headerPassed = true;
        continue;
      }

      if (headerPassed && line.startsWith('|')) {
        const cells = line.split('|').map(c => c.trim()).filter(c => c);
        if (cells.length >= 4) {
          modules.push({
            module: cells[0],
            path: cells[1].replace(/`/g, ''),
            description: cells[2],
            loadWhen: cells[3],
          });
        }
      }
    }
  }

  return modules;
}

/**
 * Extract agent notes from a Rosetta file
 */
export function parseAgentNotes(content: string): Array<{
  date: string;
  agent: string;
  notes: string[];
}> {
  const notes: Array<{
    date: string;
    agent: string;
    notes: string[];
  }> = [];

  const lines = content.split('\n');
  let currentNote: { date: string; agent: string; notes: string[] } | null = null;

  for (const line of lines) {
    // Match note header: ### 2025-06-14 | agent-name
    const headerMatch = line.match(/^###\s+(\d{4}-\d{2}-\d{2})\s*\|\s*(.+)$/);
    if (headerMatch) {
      if (currentNote) {
        notes.push(currentNote);
      }
      currentNote = {
        date: headerMatch[1],
        agent: headerMatch[2].trim(),
        notes: [],
      };
      continue;
    }

    // Match note bullet: - Some note text
    if (currentNote && line.match(/^-\s+(.+)/)) {
      const noteMatch = line.match(/^-\s+(.+)/);
      if (noteMatch) {
        currentNote.notes.push(noteMatch[1]);
      }
    }
  }

  if (currentNote) {
    notes.push(currentNote);
  }

  return notes;
}
