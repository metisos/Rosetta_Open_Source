/**
 * Codebase analyzer for AI-assisted Rosetta initialization
 * Gathers project context and sends it to the selected AI provider
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { AIProvider, GenerateOptions } from './providers';
import { loadTemplate, TEMPLATES } from '../utils/templates';

interface AnalyzeOptions {
  cwd: string;
  provider: AIProvider;
  apiKey: string;
  model: string;
  onStatus?: (msg: string) => void;
}

interface FileEntry {
  relativePath: string;
  content: string;
}

/**
 * Gather the directory tree (respecting .gitignore)
 */
function getDirectoryTree(cwd: string): string {
  try {
    // Use git ls-files if in a repo, otherwise fall back to basic listing
    const files = execSync('git ls-files --cached --others --exclude-standard', {
      cwd,
      encoding: 'utf-8',
      timeout: 10000,
    })
      .trim()
      .split('\n')
      .filter(Boolean);

    // Build a tree-like structure from the flat file list
    const tree = buildTreeString(files);
    return tree;
  } catch {
    // Fallback: basic recursive listing (top 3 levels)
    return getBasicTree(cwd, '', 0, 3);
  }
}

function buildTreeString(files: string[]): string {
  // Group files by top-level directory, max 3 levels deep
  const dirs = new Map<string, string[]>();

  for (const file of files) {
    const parts = file.split('/');
    const topDir = parts.length > 1 ? parts[0] : '.';
    if (!dirs.has(topDir)) {
      dirs.set(topDir, []);
    }
    dirs.get(topDir)!.push(file);
  }

  const lines: string[] = [];
  for (const [dir, dirFiles] of dirs) {
    if (dir === '.') {
      for (const f of dirFiles) {
        lines.push(f);
      }
    } else {
      lines.push(`${dir}/`);
      // Show up to 20 files per directory
      const shown = dirFiles.slice(0, 20);
      for (const f of shown) {
        lines.push(`  ${f}`);
      }
      if (dirFiles.length > 20) {
        lines.push(`  ... and ${dirFiles.length - 20} more files`);
      }
    }
  }

  return lines.join('\n');
}

function getBasicTree(dir: string, prefix: string, depth: number, maxDepth: number): string {
  if (depth >= maxDepth) return '';

  const entries = fs.readdirSync(dir, { withFileTypes: true })
    .filter((e) => !e.name.startsWith('.') && e.name !== 'node_modules' && e.name !== 'dist')
    .sort((a, b) => {
      // Directories first
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

  const lines: string[] = [];
  for (const entry of entries) {
    const isDir = entry.isDirectory();
    lines.push(`${prefix}${entry.name}${isDir ? '/' : ''}`);
    if (isDir) {
      const sub = getBasicTree(path.join(dir, entry.name), prefix + '  ', depth + 1, maxDepth);
      if (sub) lines.push(sub);
    }
  }
  return lines.join('\n');
}

/**
 * Read key files from the project for context
 */
function gatherKeyFiles(cwd: string): FileEntry[] {
  const entries: FileEntry[] = [];
  const maxFileSize = 8000; // chars per file
  const maxTotalSize = 60000; // total chars budget
  let totalSize = 0;

  // Priority files to read
  const priorityFiles = [
    'package.json',
    'README.md',
    'CONTRIBUTING.md',
    'Cargo.toml',
    'pyproject.toml',
    'setup.py',
    'go.mod',
    'Gemfile',
    'requirements.txt',
    'pom.xml',
    'build.gradle',
    'tsconfig.json',
    'next.config.js',
    'next.config.ts',
    'vite.config.ts',
    'webpack.config.js',
  ];

  // Read priority files first
  for (const file of priorityFiles) {
    if (totalSize >= maxTotalSize) break;
    const fullPath = path.join(cwd, file);
    if (fs.existsSync(fullPath)) {
      try {
        let content = fs.readFileSync(fullPath, 'utf-8');
        if (content.length > maxFileSize) {
          content = content.slice(0, maxFileSize) + '\n... (truncated)';
        }
        entries.push({ relativePath: file, content });
        totalSize += content.length;
      } catch {
        // skip unreadable files
      }
    }
  }

  // Then try to find and read entry point files / src index files
  const sourcePatterns = [
    'src/index.ts', 'src/index.js', 'src/main.ts', 'src/main.js',
    'src/app.ts', 'src/app.js', 'src/App.tsx', 'src/App.jsx',
    'src/lib/index.ts', 'src/lib/index.js',
    'app/layout.tsx', 'app/page.tsx',
    'pages/index.tsx', 'pages/index.jsx',
    'main.go', 'cmd/main.go',
    'src/main.rs', 'src/lib.rs',
    'main.py', 'app.py', 'manage.py',
  ];

  for (const file of sourcePatterns) {
    if (totalSize >= maxTotalSize) break;
    const fullPath = path.join(cwd, file);
    if (fs.existsSync(fullPath)) {
      try {
        let content = fs.readFileSync(fullPath, 'utf-8');
        if (content.length > maxFileSize) {
          content = content.slice(0, maxFileSize) + '\n... (truncated)';
        }
        // Skip if already added
        if (!entries.find((e) => e.relativePath === file)) {
          entries.push({ relativePath: file, content });
          totalSize += content.length;
        }
      } catch {
        // skip
      }
    }
  }

  // Scan src/ directory for additional important files
  const srcDir = path.join(cwd, 'src');
  if (fs.existsSync(srcDir) && totalSize < maxTotalSize) {
    const srcFiles = collectSourceFiles(srcDir, cwd, 3);
    for (const file of srcFiles) {
      if (totalSize >= maxTotalSize) break;
      if (entries.find((e) => e.relativePath === file)) continue;

      const fullPath = path.join(cwd, file);
      try {
        let content = fs.readFileSync(fullPath, 'utf-8');
        if (content.length > maxFileSize) {
          content = content.slice(0, maxFileSize) + '\n... (truncated)';
        }
        entries.push({ relativePath: file, content });
        totalSize += content.length;
      } catch {
        // skip
      }
    }
  }

  return entries;
}

/**
 * Recursively collect source files, preferring index/barrel files
 */
function collectSourceFiles(dir: string, rootDir: string, maxDepth: number, depth = 0): string[] {
  if (depth >= maxDepth) return [];

  const files: string[] = [];
  const codeExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.rs', '.java', '.rb']);

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
      .filter((e) => !e.name.startsWith('.') && e.name !== 'node_modules' && !e.name.endsWith('.test.ts') && !e.name.endsWith('.spec.ts'));

    // Index files first (most informative)
    const indexFiles = entries.filter((e) => !e.isDirectory() && e.name.startsWith('index'));
    for (const f of indexFiles) {
      files.push(path.relative(rootDir, path.join(dir, f.name)));
    }

    // Other code files
    const otherFiles = entries.filter(
      (e) => !e.isDirectory() && !e.name.startsWith('index') && codeExtensions.has(path.extname(e.name))
    );
    for (const f of otherFiles.slice(0, 5)) {
      files.push(path.relative(rootDir, path.join(dir, f.name)));
    }

    // Recurse into subdirectories
    const subDirs = entries.filter((e) => e.isDirectory());
    for (const d of subDirs) {
      files.push(...collectSourceFiles(path.join(dir, d.name), rootDir, maxDepth, depth + 1));
    }
  } catch {
    // skip unreadable dirs
  }

  return files;
}

/**
 * Build the system prompt from the bootstrap template
 */
function buildSystemPrompt(): string {
  const bootstrapTemplate = loadTemplate(TEMPLATES.BOOTSTRAP);
  return `You are an expert software engineer analyzing a codebase to create documentation.

${bootstrapTemplate}

IMPORTANT INSTRUCTIONS:
- Output ONLY the content of ROSETTA.md - no preamble, no explanation, no code fences around the whole file.
- Start your response with "# Rosetta" on the first line.
- Follow the exact section structure from the template.
- Be concise and accurate. Document what IS, not what should be.
- Target 800-1200 tokens for the ROSETTA.md content.
- Include the rosetta metadata comments at the bottom.
- Set the last-updated date to today's date.`;
}

/**
 * Build the user prompt with codebase context
 */
function buildUserPrompt(cwd: string, tree: string, files: FileEntry[]): string {
  const projectName = path.basename(cwd);
  let prompt = `# Codebase Analysis Request

Project directory: ${projectName}

## Directory Structure
\`\`\`
${tree}
\`\`\`

## Key Files
`;

  for (const file of files) {
    prompt += `\n### ${file.relativePath}\n\`\`\`\n${file.content}\n\`\`\`\n`;
  }

  prompt += `
## Instructions

Analyze this codebase and generate a complete ROSETTA.md file. Include all required sections:
1. Overview (2-4 sentences)
2. Tech Stack
3. Architecture (with ASCII diagram)
4. Directory Structure
5. Conventions
6. Entry Points
7. Key Patterns
8. Module Index
9. Gotchas
10. Agent Notes

Start the file with:
# Rosetta
> [one-sentence description]

End with rosetta metadata comments.
Output ONLY the ROSETTA.md content, starting with "# Rosetta".`;

  return prompt;
}

/**
 * Run the full AI-assisted analysis
 */
export async function analyzeCodebase(opts: AnalyzeOptions): Promise<string> {
  const { cwd, provider, apiKey, model, onStatus } = opts;

  onStatus?.('Scanning project structure...');
  const tree = getDirectoryTree(cwd);

  onStatus?.('Reading key files...');
  const files = gatherKeyFiles(cwd);

  onStatus?.(`Sending to ${provider.displayName} (${model})...`);
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(cwd, tree, files);

  const generateOpts: GenerateOptions = {
    apiKey,
    model,
    systemPrompt,
    userPrompt,
  };

  onStatus?.('Generating ROSETTA.md...');
  const result = await provider.generateRosetta(generateOpts);

  // Clean up the result - strip any surrounding code fences
  let cleaned = result.trim();
  if (cleaned.startsWith('```markdown')) {
    cleaned = cleaned.slice('```markdown'.length);
  } else if (cleaned.startsWith('```md')) {
    cleaned = cleaned.slice('```md'.length);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  // Ensure it starts with # Rosetta
  if (!cleaned.startsWith('# Rosetta')) {
    const idx = cleaned.indexOf('# Rosetta');
    if (idx > -1) {
      cleaned = cleaned.slice(idx);
    }
  }

  return cleaned;
}
