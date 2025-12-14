#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/cli/index.ts
var import_commander = require("commander");
var import_chalk7 = __toESM(require("chalk"));

// src/cli/commands/init.ts
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_chalk = __toESM(require("chalk"));

// src/cli/utils/templates.ts
var EMBEDDED_TEMPLATES = {
  "ROSETTA-minimal.md": `# Rosetta

> [One-sentence description of your project]

## Overview

[2-4 sentences. What this project IS and DOES.]

## Tech Stack

- Language:
- Framework:
- Database:
- Key Dependencies:

## Architecture

\`\`\`
[ASCII diagram of component relationships]
\`\`\`

[Brief explanation of data flow]

## Directory Structure

\`\`\`
src/
\u251C\u2500\u2500 [directory]/   # [purpose]
\u2514\u2500\u2500 [directory]/   # [purpose]
\`\`\`

## Conventions

- **Naming:** [conventions]
- **File naming:** [conventions]
- **Exports:** [conventions]
- **Error handling:** [conventions]

## Entry Points

| File | Purpose |
|------|---------|
| \`path/to/file\` | [purpose] |

## Key Patterns

[Document 1-3 recurring code patterns with examples]

## Module Index

| Module | Path | Description | Load When |
|--------|------|-------------|-----------|
| | \`.rosetta/modules/.md\` | | |

## Gotchas

- [Non-obvious things that will cause problems]

## Agent Notes

<!--
  AGENTS: Append learnings below this line.
  Format: ### YYYY-MM-DD | agent-name
  Humans curate this section periodically.
-->

---

<!-- rosetta:version:1.0 -->
<!-- rosetta:last-updated:{{DATE}} -->
`,
  "module.md": `# Module: {{name}}

> [One-sentence purpose of this module]

<!-- rosetta:last-verified:{{DATE}} -->
<!-- rosetta:paths:src/path/to/module/** -->

## Responsibility

[What this module does. What it explicitly does NOT do. Clear boundaries.]

## Key Files

| File | Purpose |
|------|---------|
| \`path/to/file.ts\` | [What it does] |

## Data Flow

\`\`\`
[Input] \u2192 [Process] \u2192 [Output]
\`\`\`

[Prose explanation if needed]

## Interfaces

[Public interfaces other modules depend on]

\`\`\`typescript
// Key exports
functionName(param: Type): ReturnType
anotherFunction(param: Type): ReturnType

// Key types
type ImportantType = { ... }
\`\`\`

## Internal Patterns

[Module-specific patterns not in root Rosetta]

## Dependencies

- **Uses:** [Other modules this depends on]
- **Used by:** [Modules that depend on this]

## Gotchas

- [Module-specific warnings]

## Testing

[How to test this module, key test files, special setup needed]
`,
  "notes.md": `# Agent Notes

Learnings from AI coding agents working in this codebase. Humans review periodically and promote valuable insights to ROSETTA.md or module files.

## Review Status

- Last human review: {{DATE}}
- Entries since last review: 0

---

<!-- AGENTS: Append new entries below. Do not edit existing entries. -->
<!-- Format: ### YYYY-MM-DD | agent-name -->
`,
  "config.yml": `# Rosetta Configuration
# https://github.com/metisos/rosetta

version: 1

# Staleness thresholds in days
staleness:
  warning: 30    # Days before showing staleness warning
  critical: 90   # Days before marking as critically stale

# File patterns to track for drift detection (optional)
# When these files change, related module docs may need updating
track: []
  # - src/services/**/*.ts
  # - prisma/schema.prisma
  # - src/lib/**/*.ts

# Patterns to ignore in status checks
ignore:
  - "*.test.ts"
  - "*.spec.ts"
  - "__tests__/**"
  - "__mocks__/**"

# Module-to-path mapping for staleness detection (optional)
# Format: module-name: [glob patterns]
modules: {}
  # auth:
  #   - src/services/auth/**
  #   - src/lib/auth.ts
  # database:
  #   - prisma/**
  #   - src/lib/db.ts
`,
  "bootstrap-prompt.md": `## Task: Initialize Rosetta for This Codebase

This project needs Rosetta context files for AI coding agents. Please:

1. **Analyze the codebase structure** (read-only first)
   - Check for existing docs (README.md, CONTRIBUTING.md, docs/)
   - Identify primary language and framework
   - Map the directory structure
   - Find entry points and key files

2. **Create ROSETTA.md at the project root** with:
   - Overview (2-4 sentences max)
   - Tech Stack (primary technologies only)
   - Architecture (ASCII diagram + brief explanation)
   - Directory Structure (top 2 levels of src/)
   - Conventions (extract from actual code patterns)
   - Entry Points (3-6 most important files)
   - Key Patterns (1-3 code examples)
   - Module Index (3-6 logical modules)
   - Gotchas (non-obvious issues)

3. **Create .rosetta/ directory** with:
   - Module files for key areas (auth, database, api, etc.)
   - notes.md with header
   - config.yml with defaults

### Quality Guidelines

**Focus on:**
- Token efficiency (concise, no fluff)
- Accuracy (document what IS, not what should be)
- Actionable content (patterns, gotchas, entry points)

**Do not:**
- Duplicate existing README content
- Create module files for simple/obvious areas
- Add aspirational content

**Token Targets:**
- ROSETTA.md: 800-1200 tokens
- Module files: 400-600 tokens each

When complete, summarize what you created and any areas that need human review.
`
};
function loadTemplate(templateName) {
  const template = EMBEDDED_TEMPLATES[templateName];
  if (!template) {
    throw new Error(`Template not found: ${templateName}`);
  }
  return template;
}
function renderTemplate(template, vars) {
  let rendered = template;
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  rendered = rendered.replace(/\{\{DATE\}\}/g, today);
  for (const [key, value] of Object.entries(vars)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    rendered = rendered.replace(regex, value);
  }
  return rendered;
}
var TEMPLATES = {
  ROSETTA_MINIMAL: "ROSETTA-minimal.md",
  MODULE: "module.md",
  NOTES: "notes.md",
  CONFIG: "config.yml",
  BOOTSTRAP: "bootstrap-prompt.md"
};

// src/cli/commands/init.ts
async function initCommand(options) {
  const cwd = process.cwd();
  const rosettaPath = import_path.default.join(cwd, "ROSETTA.md");
  const rosettaDir = import_path.default.join(cwd, ".rosetta");
  if (import_fs.default.existsSync(rosettaPath) && !options.force) {
    console.log(import_chalk.default.yellow("ROSETTA.md already exists. Use --force to overwrite."));
    return;
  }
  const modulesDir = import_path.default.join(rosettaDir, "modules");
  if (!import_fs.default.existsSync(rosettaDir)) {
    import_fs.default.mkdirSync(rosettaDir, { recursive: true });
  }
  if (!import_fs.default.existsSync(modulesDir)) {
    import_fs.default.mkdirSync(modulesDir, { recursive: true });
  }
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  try {
    const templateName = options.template === "nextjs" ? "ROSETTA.md" : TEMPLATES.ROSETTA_MINIMAL;
    const rosettaTemplate = loadTemplate(templateName);
    const rosettaContent = renderTemplate(rosettaTemplate, { DATE: today });
    import_fs.default.writeFileSync(rosettaPath, rosettaContent, "utf-8");
    console.log(import_chalk.default.green("\u2713") + " Created ROSETTA.md");
  } catch (error) {
    console.log(import_chalk.default.red("\u2717") + " Failed to create ROSETTA.md");
    console.error(error);
    return;
  }
  try {
    const notesTemplate = loadTemplate(TEMPLATES.NOTES);
    const notesContent = renderTemplate(notesTemplate, { DATE: today });
    import_fs.default.writeFileSync(import_path.default.join(rosettaDir, "notes.md"), notesContent, "utf-8");
    console.log(import_chalk.default.green("\u2713") + " Created .rosetta/notes.md");
  } catch (error) {
    console.log(import_chalk.default.red("\u2717") + " Failed to create .rosetta/notes.md");
  }
  try {
    const configTemplate = loadTemplate(TEMPLATES.CONFIG);
    import_fs.default.writeFileSync(import_path.default.join(rosettaDir, "config.yml"), configTemplate, "utf-8");
    console.log(import_chalk.default.green("\u2713") + " Created .rosetta/config.yml");
  } catch (error) {
    console.log(import_chalk.default.red("\u2717") + " Failed to create .rosetta/config.yml");
  }
  import_fs.default.writeFileSync(import_path.default.join(modulesDir, ".gitkeep"), "", "utf-8");
  console.log(import_chalk.default.green("\u2713") + " Created .rosetta/modules/");
  console.log();
  console.log(import_chalk.default.cyan("Rosetta initialized!") + " Next steps:");
  console.log();
  console.log("  1. Edit " + import_chalk.default.white("ROSETTA.md") + " to describe your project");
  console.log("  2. Run " + import_chalk.default.white("'rosetta add-module <name>'") + " to add module docs");
  console.log("  3. Add Rosetta protocol to your agent prompts");
  console.log();
  if (options.bootstrap) {
    console.log(import_chalk.default.yellow("\u2500".repeat(60)));
    console.log();
    console.log(import_chalk.default.cyan("Bootstrap Protocol"));
    console.log(import_chalk.default.gray("Copy and paste the following into your AI coding agent:"));
    console.log();
    try {
      const bootstrapPrompt = loadTemplate(TEMPLATES.BOOTSTRAP);
      console.log(bootstrapPrompt);
    } catch {
      console.log(import_chalk.default.red("Failed to load bootstrap prompt"));
    }
  }
  console.log(import_chalk.default.gray("Docs: https://github.com/metisos/rosetta"));
}

// src/cli/commands/validate.ts
var import_fs2 = __toESM(require("fs"));
var import_path2 = __toESM(require("path"));
var import_chalk2 = __toESM(require("chalk"));

// src/cli/utils/parser.ts
var REQUIRED_SECTIONS = [
  "Overview",
  "Tech Stack",
  "Architecture",
  "Directory Structure",
  "Conventions",
  "Entry Points",
  "Module Index",
  "Gotchas",
  "Agent Notes"
];
var REQUIRED_MODULE_SECTIONS = [
  "Responsibility",
  "Key Files",
  "Data Flow",
  "Interfaces",
  "Gotchas"
];
function parseRosettaFile(content) {
  const lines = content.split("\n");
  const sections = [];
  const metadata = {};
  let currentSection = null;
  let currentContent = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const metadataMatch = line.match(/<!--\s*rosetta:(\w+):(.+?)\s*-->/);
    if (metadataMatch) {
      const [, key, value] = metadataMatch;
      if (key === "version") metadata.version = value;
      else if (key === "last-updated") metadata.lastUpdated = value;
      else if (key === "last-verified") metadata.lastVerified = value;
      else if (key === "paths") metadata.paths = value.split(",").map((p) => p.trim());
      continue;
    }
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      if (currentSection) {
        currentSection.content = currentContent.join("\n").trim();
        currentSection.endLine = i - 1;
        sections.push(currentSection);
      }
      const [, hashes, title] = headingMatch;
      currentSection = {
        name: title,
        level: hashes.length,
        content: "",
        startLine: i,
        endLine: i
      };
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    }
  }
  if (currentSection) {
    currentSection.content = currentContent.join("\n").trim();
    currentSection.endLine = lines.length - 1;
    sections.push(currentSection);
  }
  return {
    sections,
    metadata,
    rawContent: content
  };
}
function validateSections(parsed, requiredSections) {
  const sectionNames = parsed.sections.map((s) => s.name);
  const missing = [];
  const found = [];
  for (const required of requiredSections) {
    if (sectionNames.some((name) => name.toLowerCase().includes(required.toLowerCase()))) {
      found.push(required);
    } else {
      missing.push(required);
    }
  }
  return {
    valid: missing.length === 0,
    missing,
    found
  };
}
function parseModuleIndex(content) {
  const modules = [];
  const lines = content.split("\n");
  let inModuleIndex = false;
  let headerPassed = false;
  for (const line of lines) {
    if (line.includes("## Module Index")) {
      inModuleIndex = true;
      continue;
    }
    if (inModuleIndex && line.startsWith("##")) {
      break;
    }
    if (inModuleIndex) {
      if (line.includes("| Module |") || line.includes("|---")) {
        headerPassed = true;
        continue;
      }
      if (headerPassed && line.startsWith("|")) {
        const cells = line.split("|").map((c) => c.trim()).filter((c) => c);
        if (cells.length >= 4) {
          modules.push({
            module: cells[0],
            path: cells[1].replace(/`/g, ""),
            description: cells[2],
            loadWhen: cells[3]
          });
        }
      }
    }
  }
  return modules;
}
function parseAgentNotes(content) {
  const notes = [];
  const lines = content.split("\n");
  let currentNote = null;
  for (const line of lines) {
    const headerMatch = line.match(/^###\s+(\d{4}-\d{2}-\d{2})\s*\|\s*(.+)$/);
    if (headerMatch) {
      if (currentNote) {
        notes.push(currentNote);
      }
      currentNote = {
        date: headerMatch[1],
        agent: headerMatch[2].trim(),
        notes: []
      };
      continue;
    }
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

// src/cli/commands/validate.ts
async function validateCommand(options) {
  const targetPath = options.path || process.cwd();
  const rosettaPath = import_path2.default.join(targetPath, "ROSETTA.md");
  const rosettaDir = import_path2.default.join(targetPath, ".rosetta");
  const result = {
    errors: [],
    warnings: []
  };
  console.log(import_chalk2.default.cyan("Rosetta Validation Report"));
  console.log(import_chalk2.default.gray("\u2550".repeat(40)));
  console.log();
  if (!import_fs2.default.existsSync(rosettaPath)) {
    console.log(import_chalk2.default.red("\u2717") + " ROSETTA.md not found");
    console.log();
    console.log(import_chalk2.default.yellow("Run 'rosetta init' to initialize Rosetta"));
    return;
  }
  console.log(import_chalk2.default.white("ROSETTA.md"));
  const rosettaContent = import_fs2.default.readFileSync(rosettaPath, "utf-8");
  const parsed = parseRosettaFile(rosettaContent);
  const sectionValidation = validateSections(parsed, REQUIRED_SECTIONS);
  for (const section of sectionValidation.found) {
    console.log(import_chalk2.default.green("  \u2713") + ` ${section} section present`);
  }
  for (const section of sectionValidation.missing) {
    console.log(import_chalk2.default.red("  \u2717") + ` ${section} section missing`);
    result.errors.push(`Missing section: ${section}`);
  }
  if (parsed.metadata.lastUpdated) {
    const lastUpdated = new Date(parsed.metadata.lastUpdated);
    const daysSince = Math.floor((Date.now() - lastUpdated.getTime()) / (1e3 * 60 * 60 * 24));
    if (daysSince > 30) {
      console.log(import_chalk2.default.yellow("  \u26A0") + ` Last updated ${daysSince} days ago`);
      result.warnings.push(`ROSETTA.md last updated ${daysSince} days ago`);
    }
  } else {
    console.log(import_chalk2.default.yellow("  \u26A0") + " No last-updated metadata found");
    result.warnings.push("No last-updated metadata in ROSETTA.md");
  }
  console.log();
  const moduleIndex = parseModuleIndex(rosettaContent);
  console.log(import_chalk2.default.white("Module Index"));
  if (moduleIndex.length === 0) {
    console.log(import_chalk2.default.yellow("  \u26A0") + " No modules defined in index");
    result.warnings.push("No modules defined in Module Index");
  } else {
    for (const module2 of moduleIndex) {
      if (!module2.module || !module2.path) continue;
      const modulePath = import_path2.default.join(targetPath, module2.path);
      if (import_fs2.default.existsSync(modulePath)) {
        console.log(import_chalk2.default.green("  \u2713") + ` ${module2.module}.md exists`);
      } else {
        console.log(import_chalk2.default.red("  \u2717") + ` ${module2.module}.md missing (${module2.path})`);
        result.errors.push(`Module file missing: ${module2.path}`);
      }
    }
  }
  console.log();
  const modulesDir = import_path2.default.join(rosettaDir, "modules");
  if (import_fs2.default.existsSync(modulesDir)) {
    const moduleFiles = import_fs2.default.readdirSync(modulesDir).filter((f) => f.endsWith(".md"));
    if (moduleFiles.length > 0) {
      console.log(import_chalk2.default.white("Module Files"));
      for (const moduleFile of moduleFiles) {
        const modulePath = import_path2.default.join(modulesDir, moduleFile);
        const moduleContent = import_fs2.default.readFileSync(modulePath, "utf-8");
        const moduleParsed = parseRosettaFile(moduleContent);
        const moduleValidation = validateSections(moduleParsed, REQUIRED_MODULE_SECTIONS);
        if (moduleValidation.valid) {
          console.log(import_chalk2.default.green("  \u2713") + ` ${moduleFile} structure valid`);
        } else {
          console.log(import_chalk2.default.red("  \u2717") + ` ${moduleFile} missing sections: ${moduleValidation.missing.join(", ")}`);
          result.errors.push(`${moduleFile} missing sections: ${moduleValidation.missing.join(", ")}`);
        }
        if (moduleParsed.metadata.lastVerified) {
          const lastVerified = new Date(moduleParsed.metadata.lastVerified);
          const daysSince = Math.floor((Date.now() - lastVerified.getTime()) / (1e3 * 60 * 60 * 24));
          if (daysSince > 30) {
            console.log(import_chalk2.default.yellow("    \u26A0") + ` last-verified: ${daysSince} days ago`);
            result.warnings.push(`${moduleFile} last-verified ${daysSince} days ago`);
          }
        }
      }
    }
  }
  console.log();
  console.log(import_chalk2.default.gray("\u2500".repeat(40)));
  if (result.errors.length === 0 && result.warnings.length === 0) {
    console.log(import_chalk2.default.green("\u2713 All checks passed"));
  } else {
    console.log(
      `Summary: ${result.errors.length > 0 ? import_chalk2.default.red(`${result.errors.length} error(s)`) : "0 errors"}, ${result.warnings.length > 0 ? import_chalk2.default.yellow(`${result.warnings.length} warning(s)`) : "0 warnings"}`
    );
  }
  if (result.errors.length > 0) {
    process.exitCode = 1;
  }
}

// src/cli/commands/status.ts
var import_fs3 = __toESM(require("fs"));
var import_path3 = __toESM(require("path"));
var import_chalk3 = __toESM(require("chalk"));
var import_yaml = __toESM(require("yaml"));
function formatRelativeTime(date) {
  const now = /* @__PURE__ */ new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1e3 * 60 * 60 * 24));
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}
function getStatusIndicator(daysSince, warning, critical) {
  if (daysSince >= critical) return import_chalk3.default.red("\u2717 Critical");
  if (daysSince >= warning) return import_chalk3.default.yellow("\u26A0 Review needed");
  return import_chalk3.default.green("\u2713 Fresh");
}
async function statusCommand() {
  const cwd = process.cwd();
  const rosettaPath = import_path3.default.join(cwd, "ROSETTA.md");
  const rosettaDir = import_path3.default.join(cwd, ".rosetta");
  const configPath = import_path3.default.join(rosettaDir, "config.yml");
  const notesPath = import_path3.default.join(rosettaDir, "notes.md");
  const modulesDir = import_path3.default.join(rosettaDir, "modules");
  if (!import_fs3.default.existsSync(rosettaPath)) {
    console.log(import_chalk3.default.yellow("Rosetta not initialized in this project."));
    console.log();
    console.log("Run " + import_chalk3.default.white("'rosetta init'") + " to get started.");
    return;
  }
  let config = {
    staleness: { warning: 30, critical: 90 }
  };
  if (import_fs3.default.existsSync(configPath)) {
    try {
      const configContent = import_fs3.default.readFileSync(configPath, "utf-8");
      config = { ...config, ...import_yaml.default.parse(configContent) };
    } catch {
    }
  }
  const warningDays = config.staleness?.warning || 30;
  const criticalDays = config.staleness?.critical || 90;
  console.log(import_chalk3.default.cyan("Rosetta Status"));
  console.log(import_chalk3.default.gray("\u2550".repeat(40)));
  console.log();
  console.log(import_chalk3.default.white("Root Context"));
  const rosettaContent = import_fs3.default.readFileSync(rosettaPath, "utf-8");
  const rosettaParsed = parseRosettaFile(rosettaContent);
  let rootDays = 0;
  if (rosettaParsed.metadata.lastUpdated) {
    const lastUpdated = new Date(rosettaParsed.metadata.lastUpdated);
    rootDays = Math.floor((Date.now() - lastUpdated.getTime()) / (1e3 * 60 * 60 * 24));
    const status = getStatusIndicator(rootDays, warningDays, criticalDays);
    console.log(
      `  ROSETTA.md`.padEnd(24) + import_chalk3.default.gray(`updated ${formatRelativeTime(lastUpdated)}`.padEnd(24)) + status
    );
  } else {
    const stat = import_fs3.default.statSync(rosettaPath);
    rootDays = Math.floor((Date.now() - stat.mtime.getTime()) / (1e3 * 60 * 60 * 24));
    const status = getStatusIndicator(rootDays, warningDays, criticalDays);
    console.log(
      `  ROSETTA.md`.padEnd(24) + import_chalk3.default.gray(`modified ${formatRelativeTime(stat.mtime)}`.padEnd(24)) + status
    );
  }
  console.log();
  if (import_fs3.default.existsSync(modulesDir)) {
    const moduleFiles = import_fs3.default.readdirSync(modulesDir).filter((f) => f.endsWith(".md"));
    console.log(import_chalk3.default.white(`Modules (${moduleFiles.length} total)`));
    if (moduleFiles.length === 0) {
      console.log(import_chalk3.default.gray("  No module files found"));
    } else {
      const staleModules = [];
      for (const moduleFile of moduleFiles) {
        const modulePath = import_path3.default.join(modulesDir, moduleFile);
        const moduleContent = import_fs3.default.readFileSync(modulePath, "utf-8");
        const moduleParsed = parseRosettaFile(moduleContent);
        let moduleDays = 0;
        let timeStr = "";
        if (moduleParsed.metadata.lastVerified) {
          const lastVerified = new Date(moduleParsed.metadata.lastVerified);
          moduleDays = Math.floor((Date.now() - lastVerified.getTime()) / (1e3 * 60 * 60 * 24));
          timeStr = `verified ${formatRelativeTime(lastVerified)}`;
        } else {
          const stat = import_fs3.default.statSync(modulePath);
          moduleDays = Math.floor((Date.now() - stat.mtime.getTime()) / (1e3 * 60 * 60 * 24));
          timeStr = `modified ${formatRelativeTime(stat.mtime)}`;
        }
        const status = getStatusIndicator(moduleDays, warningDays, criticalDays);
        console.log(`  ${moduleFile}`.padEnd(24) + import_chalk3.default.gray(timeStr.padEnd(24)) + status);
        if (moduleDays >= warningDays) {
          staleModules.push(moduleFile);
        }
      }
    }
  } else {
    console.log(import_chalk3.default.white("Modules"));
    console.log(import_chalk3.default.gray("  .rosetta/modules/ not found"));
  }
  console.log();
  console.log(import_chalk3.default.white("Agent Notes"));
  if (import_fs3.default.existsSync(notesPath)) {
    const notesContent = import_fs3.default.readFileSync(notesPath, "utf-8");
    const notes = parseAgentNotes(notesContent);
    const totalEntries = notes.reduce((sum, n) => sum + n.notes.length, 0);
    const reviewMatch = notesContent.match(/Last human review:\s*(\d{4}-\d{2}-\d{2})/);
    let newEntriesSinceReview = 0;
    if (reviewMatch) {
      const reviewDate = new Date(reviewMatch[1]);
      for (const note of notes) {
        const noteDate = new Date(note.date);
        if (noteDate > reviewDate) {
          newEntriesSinceReview += note.notes.length;
        }
      }
    } else {
      newEntriesSinceReview = totalEntries;
    }
    console.log(`  Total entries:`.padEnd(24) + `${totalEntries}`);
    console.log(`  Since last review:`.padEnd(24) + `${newEntriesSinceReview} new`);
  } else {
    console.log(import_chalk3.default.gray("  .rosetta/notes.md not found"));
  }
  console.log();
  console.log(import_chalk3.default.white("Suggestions"));
  const suggestions = [];
  if (import_fs3.default.existsSync(modulesDir)) {
    const moduleFiles = import_fs3.default.readdirSync(modulesDir).filter((f) => f.endsWith(".md"));
    for (const moduleFile of moduleFiles) {
      const modulePath = import_path3.default.join(modulesDir, moduleFile);
      const moduleContent = import_fs3.default.readFileSync(modulePath, "utf-8");
      const moduleParsed = parseRosettaFile(moduleContent);
      if (moduleParsed.metadata.lastVerified) {
        const lastVerified = new Date(moduleParsed.metadata.lastVerified);
        const moduleDays = Math.floor((Date.now() - lastVerified.getTime()) / (1e3 * 60 * 60 * 24));
        if (moduleDays >= warningDays) {
          suggestions.push(`Review .rosetta/modules/${moduleFile} (stale)`);
        }
      }
    }
  }
  if (import_fs3.default.existsSync(notesPath)) {
    const notesContent = import_fs3.default.readFileSync(notesPath, "utf-8");
    const notes = parseAgentNotes(notesContent);
    const reviewMatch = notesContent.match(/Last human review:\s*(\d{4}-\d{2}-\d{2})/);
    if (reviewMatch) {
      const reviewDate = new Date(reviewMatch[1]);
      let newCount = 0;
      for (const note of notes) {
        const noteDate = new Date(note.date);
        if (noteDate > reviewDate) {
          newCount += note.notes.length;
        }
      }
      if (newCount > 0) {
        suggestions.push(`Curate .rosetta/notes.md (${newCount} new entries)`);
      }
    }
  }
  if (suggestions.length === 0) {
    console.log(import_chalk3.default.green("  \u2713 Everything looks good!"));
  } else {
    for (const suggestion of suggestions) {
      console.log(import_chalk3.default.yellow("  \u2192") + ` ${suggestion}`);
    }
  }
}

// src/cli/commands/add-module.ts
var import_fs4 = __toESM(require("fs"));
var import_path4 = __toESM(require("path"));
var import_chalk4 = __toESM(require("chalk"));
async function addModuleCommand(name, options) {
  const cwd = process.cwd();
  const rosettaDir = import_path4.default.join(cwd, ".rosetta");
  const modulesDir = import_path4.default.join(rosettaDir, "modules");
  const modulePath = import_path4.default.join(modulesDir, `${name}.md`);
  if (!import_fs4.default.existsSync(import_path4.default.join(cwd, "ROSETTA.md"))) {
    console.log(import_chalk4.default.yellow("Rosetta not initialized in this project."));
    console.log();
    console.log("Run " + import_chalk4.default.white("'rosetta init'") + " first.");
    return;
  }
  if (import_fs4.default.existsSync(modulePath)) {
    console.log(import_chalk4.default.yellow(`Module '${name}' already exists at ${modulePath}`));
    return;
  }
  if (!import_fs4.default.existsSync(modulesDir)) {
    import_fs4.default.mkdirSync(modulesDir, { recursive: true });
  }
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  try {
    const moduleTemplate = loadTemplate(TEMPLATES.MODULE);
    const moduleContent = renderTemplate(moduleTemplate, {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      DATE: today
    });
    import_fs4.default.writeFileSync(modulePath, moduleContent, "utf-8");
  } catch (error) {
    console.log(import_chalk4.default.red("\u2717") + ` Failed to create module file: ${error}`);
    return;
  }
  console.log(import_chalk4.default.green("\u2713") + ` Created .rosetta/modules/${name}.md`);
  console.log();
  console.log(import_chalk4.default.cyan("Next steps:"));
  console.log();
  console.log("  1. Edit " + import_chalk4.default.white(`.rosetta/modules/${name}.md`) + " to document the module");
  console.log("  2. Add an entry to the Module Index in ROSETTA.md:");
  console.log();
  console.log(import_chalk4.default.gray("     | Module | Path | Description | Load When |"));
  console.log(import_chalk4.default.gray("     |--------|------|-------------|-----------|"));
  console.log(
    import_chalk4.default.white(
      `     | ${name} | \`.rosetta/modules/${name}.md\` | ${options.description || "[description]"} | [when to load] |`
    )
  );
}

// src/cli/commands/note.ts
var import_fs5 = __toESM(require("fs"));
var import_path5 = __toESM(require("path"));
var import_chalk5 = __toESM(require("chalk"));
async function noteCommand(message, options) {
  const cwd = process.cwd();
  const rosettaDir = import_path5.default.join(cwd, ".rosetta");
  const notesPath = import_path5.default.join(rosettaDir, "notes.md");
  if (!import_fs5.default.existsSync(import_path5.default.join(cwd, "ROSETTA.md"))) {
    console.log(import_chalk5.default.yellow("Rosetta not initialized in this project."));
    console.log();
    console.log("Run " + import_chalk5.default.white("'rosetta init'") + " first.");
    return;
  }
  if (!import_fs5.default.existsSync(notesPath)) {
    console.log(import_chalk5.default.yellow(".rosetta/notes.md not found."));
    console.log();
    console.log("Run " + import_chalk5.default.white("'rosetta init'") + " to create it.");
    return;
  }
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const agent = options.agent || "human";
  let content = import_fs5.default.readFileSync(notesPath, "utf-8");
  const newNote = `
### ${today} | ${agent}
- ${message}
`;
  content = content.trimEnd() + "\n" + newNote;
  import_fs5.default.writeFileSync(notesPath, content, "utf-8");
  console.log(import_chalk5.default.green("\u2713") + " Added note to .rosetta/notes.md");
  console.log();
  console.log(import_chalk5.default.gray(`  ### ${today} | ${agent}`));
  console.log(import_chalk5.default.gray(`  - ${message}`));
}

// src/cli/commands/bootstrap.ts
var import_fs6 = __toESM(require("fs"));
var import_path6 = __toESM(require("path"));
var import_chalk6 = __toESM(require("chalk"));
async function bootstrapCommand(options) {
  const cwd = process.cwd();
  const rosettaPath = import_path6.default.join(cwd, "ROSETTA.md");
  if (!import_fs6.default.existsSync(rosettaPath)) {
    console.log(import_chalk6.default.yellow("Warning: ROSETTA.md not found."));
    console.log();
    console.log(
      import_chalk6.default.gray("Consider running ") + import_chalk6.default.white("'rosetta init'") + import_chalk6.default.gray(" first to create the file structure,")
    );
    console.log(import_chalk6.default.gray("then use this bootstrap prompt to have an agent populate the content."));
    console.log();
  }
  try {
    const bootstrapPrompt = loadTemplate(TEMPLATES.BOOTSTRAP);
    if (options.output) {
      import_fs6.default.writeFileSync(options.output, bootstrapPrompt, "utf-8");
      console.log(import_chalk6.default.green("\u2713") + ` Bootstrap prompt written to ${options.output}`);
    } else {
      console.log(import_chalk6.default.cyan("Rosetta Bootstrap Protocol"));
      console.log(import_chalk6.default.gray("\u2500".repeat(60)));
      console.log(import_chalk6.default.gray("Copy and paste the following into your AI coding agent:"));
      console.log(import_chalk6.default.gray("\u2500".repeat(60)));
      console.log();
      console.log(bootstrapPrompt);
      console.log();
      console.log(import_chalk6.default.gray("\u2500".repeat(60)));
      console.log(import_chalk6.default.gray("Tip: Use") + import_chalk6.default.white(" rosetta bootstrap | pbcopy ") + import_chalk6.default.gray("to copy to clipboard (macOS)"));
      console.log(import_chalk6.default.gray("     or") + import_chalk6.default.white(" rosetta bootstrap | xclip -selection clipboard ") + import_chalk6.default.gray("(Linux)"));
    }
  } catch (error) {
    console.log(import_chalk6.default.red("\u2717") + ` Failed to load bootstrap prompt: ${error}`);
    process.exitCode = 1;
  }
}

// src/cli/index.ts
var VERSION = "1.0.0";
var program = new import_commander.Command();
var banner = `
${import_chalk7.default.cyan("\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510")}
${import_chalk7.default.cyan("\u2502")}  ${import_chalk7.default.white("ROSETTA")} ${import_chalk7.default.gray("- Agent Codebase Understanding Protocol")}      ${import_chalk7.default.cyan("\u2502")}
${import_chalk7.default.cyan("\u2502")}  ${import_chalk7.default.gray(`v${VERSION}`)}                                                 ${import_chalk7.default.cyan("\u2502")}
${import_chalk7.default.cyan("\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518")}
`;
program.name("rosetta").description("Agent codebase understanding protocol - Help AI coding agents understand your codebase").version(VERSION).addHelpText("before", banner);
program.command("init").description("Initialize Rosetta in a project").option("-t, --template <template>", "Use a specific template (minimal, nextjs, python, generic)", "minimal").option("-f, --force", "Overwrite existing Rosetta files").option("-b, --bootstrap", "Output agent instructions to analyze and populate Rosetta").action(async (options) => {
  await initCommand(options);
});
program.command("validate").description("Check Rosetta files for structural issues").option("-p, --path <path>", "Path to validate (defaults to current directory)").action(async (options) => {
  await validateCommand(options);
});
program.command("status").description("Show staleness and coverage info").action(async () => {
  await statusCommand();
});
program.command("add-module <name>").description("Scaffold a new module file").option("-d, --description <description>", "Brief description of the module").action(async (name, options) => {
  await addModuleCommand(name, options);
});
program.command("note <message>").description("Manually add an agent-style note").option("-a, --agent <agent>", 'Agent/source name (defaults to "human")').action(async (message, options) => {
  await noteCommand(message, options);
});
program.command("bootstrap").description("Output the Bootstrap Protocol for an agent to populate Rosetta").option("-o, --output <file>", "Write to file instead of stdout").action(async (options) => {
  await bootstrapCommand(options);
});
program.parse();
if (!process.argv.slice(2).length) {
  console.log(banner);
  console.log(import_chalk7.default.cyan("Quick Start:"));
  console.log();
  console.log("  " + import_chalk7.default.white("rosetta init") + import_chalk7.default.gray("         Initialize Rosetta in your project"));
  console.log("  " + import_chalk7.default.white("rosetta init -b") + import_chalk7.default.gray("      Initialize and get bootstrap prompt"));
  console.log("  " + import_chalk7.default.white("rosetta status") + import_chalk7.default.gray("       Check documentation freshness"));
  console.log("  " + import_chalk7.default.white("rosetta validate") + import_chalk7.default.gray("     Validate Rosetta file structure"));
  console.log();
  console.log(import_chalk7.default.gray("Run ") + import_chalk7.default.white("rosetta --help") + import_chalk7.default.gray(" for all commands"));
  console.log();
  console.log(import_chalk7.default.gray("Docs: https://github.com/metisos/rosetta"));
}
//# sourceMappingURL=index.js.map