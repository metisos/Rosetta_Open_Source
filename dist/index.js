"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  PROVIDERS: () => PROVIDERS,
  REQUIRED_MODULE_SECTIONS: () => REQUIRED_MODULE_SECTIONS,
  REQUIRED_SECTIONS: () => REQUIRED_SECTIONS,
  ROSETTA_PROTOCOL: () => ROSETTA_PROTOCOL,
  TEMPLATES: () => TEMPLATES,
  analyzeCodebase: () => analyzeCodebase,
  getFilesModifiedSince: () => getFilesModifiedSince,
  getGitDiff: () => getGitDiff,
  getGitRoot: () => getGitRoot,
  getLastModified: () => getLastModified,
  getProvider: () => getProvider,
  isGitRepo: () => isGitRepo,
  loadAndRenderTemplate: () => loadAndRenderTemplate,
  loadTemplate: () => loadTemplate,
  parseAgentNotes: () => parseAgentNotes,
  parseModuleIndex: () => parseModuleIndex,
  parseRosettaFile: () => parseRosettaFile,
  readConfigFile: () => readConfigFile,
  renderTemplate: () => renderTemplate,
  resolveApiKey: () => resolveApiKey,
  resolveConfigNonInteractive: () => resolveConfigNonInteractive,
  saveProviderToConfig: () => saveProviderToConfig,
  syncRosetta: () => syncRosetta,
  validateSections: () => validateSections
});
module.exports = __toCommonJS(src_exports);

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
    const metadataMatch = line.match(/<!--\s*rosetta:([\w-]+):(.+?)\s*-->/);
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

// src/cli/utils/templates.ts
var EMBEDDED_TEMPLATES = {
  "ROSETTA-minimal.md": `# Rosetta

> [One-sentence description of your project]

<!-- rosetta:sections:
overview
tech stack
architecture
directory structure
conventions
entry points
key patterns
module index
gotchas
agent notes
-->

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

### Module Loading Policy

- Always load this root \`ROSETTA.md\` first.
- Modules are additive: include modules relevant to the current task without removing root context.
- If definitions conflict, the module file takes precedence for its scoped area while root conventions remain the baseline elsewhere.
- Humans may curate modules, but agents should never drop modules from context unless the task is unrelated.

## Gotchas

- [Non-obvious things that will cause problems]

## Agent Notes

<!--
  AGENTS: Append learnings below this line.
  Format: ### YYYY-MM-DD | agent-name
  Humans curate this section periodically.
  Rules: Agents may only append new entries and must include a timestamp and identifier.
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

# AI provider for sync and watch commands (optional)
# API keys should be set via environment variables:
#   ANTHROPIC_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY
# Or pass via --key flag
ai: {}
  # provider: anthropic    # anthropic, openai, or gemini
  # model: claude-sonnet-4-20250514

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

4. **CRITICAL: Update agent instruction files** to ensure future sessions use Rosetta:

   Check for and update these files (create if they don't exist):

   **For Claude Code (.claude/CLAUDE.md or CLAUDE.md):**
   \`\`\`markdown
   ## Rosetta Protocol

   This project uses Rosetta for persistent AI context.

   **On session start:**
   1. Read ROSETTA.md immediately for project context
   2. Check Module Index and load relevant .rosetta/modules/ files
   3. Review .rosetta/notes.md for recent discoveries

   **During work:**
   - Follow conventions documented in ROSETTA.md
   - Check Gotchas before modifying unfamiliar areas
   - Reference Key Patterns for consistent code style

   **Before session end:**
   - Append valuable discoveries to .rosetta/notes.md
   - Format: ### YYYY-MM-DD | claude
   - Keep notes actionable and non-obvious
   \`\`\`

   **For Cursor (.cursorrules):**
   \`\`\`markdown
   ## Rosetta Protocol

   This codebase uses Rosetta for AI context management.

   ALWAYS read ROSETTA.md first for:
   - Project architecture and tech stack
   - Coding conventions and patterns
   - Known gotchas and warnings

   Load relevant modules from .rosetta/modules/ based on your task.
   Append learnings to .rosetta/notes.md before ending session.
   \`\`\`

   **For Aider (.aider.conf.yml):**
   \`\`\`yaml
   read:
     - ROSETTA.md
     - .rosetta/notes.md
   \`\`\`

   **For other agents:** Add similar instructions to their config files.

### Why Step 4 is Critical

Without updating agent instruction files, future sessions won't know Rosetta exists.
This step makes Rosetta self-propagating - once initialized, every future agent session
automatically benefits from accumulated context.

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

When complete, summarize:
1. What Rosetta files you created
2. Which agent config files you updated/created
3. Any areas that need human review
`,
  "agent-config-claude.md": `## Rosetta Protocol

This project uses Rosetta for persistent AI context.

**On session start:**
1. Read ROSETTA.md immediately for project context
2. Check the \`<!-- rosetta:last-updated:DATE -->\` metadata for staleness (>30 days = review needed)
3. Check Module Index and load relevant .rosetta/modules/ files
4. Review .rosetta/notes.md for recent discoveries

**During work:**
- Follow conventions documented in ROSETTA.md
- Check Gotchas before modifying unfamiliar areas
- Reference Key Patterns for consistent code style
- If you notice ROSETTA.md is outdated or incorrect, UPDATE IT:
  - Fix incorrect information immediately
  - Add new patterns you discover
  - Update the \`<!-- rosetta:last-updated:DATE -->\` comment

**Before session end:**
- Append valuable discoveries to .rosetta/notes.md
- Format: ### YYYY-MM-DD | claude
- Keep notes actionable and non-obvious
- If you made significant changes to the codebase, check if ROSETTA.md needs updating

**Staleness guide:**
- <30 days: Fresh, trust the content
- 30-90 days: Review sections relevant to your work
- >90 days: Verify critical sections before relying on them

**If ROSETTA.md doesn't exist:**
Check if the project is ready for documentation:
\`\`\`
Is project ready?
\u251C\u2500\u2500 New/empty project with no patterns yet \u2192 WAIT
\u2502   \u2514\u2500\u2500 Just start working, create ROSETTA.md later
\u2502
\u2514\u2500\u2500 Project has substance \u2192 CREATE ROSETTA.md now
    Triggers:
    \u2022 First feature/module is complete
    \u2022 Directory structure is established
    \u2022 You've discovered a non-obvious gotcha
    \u2022 Patterns are starting to emerge
\`\`\`

To create: Run \`rosetta init\` OR analyze the codebase and create ROSETTA.md manually.
See: https://github.com/metisos/Rosetta_Open_Source
`,
  "agent-config-cursor.md": `## Rosetta Protocol

This codebase uses Rosetta for AI context management.

**On session start:**
- ALWAYS read ROSETTA.md first for project context
- Check \`<!-- rosetta:last-updated:DATE -->\` - if >30 days old, verify critical sections
- Load relevant modules from .rosetta/modules/ based on your task

**During work:**
- Follow conventions and patterns in ROSETTA.md
- Check Gotchas before modifying unfamiliar code
- If you notice outdated/incorrect info in ROSETTA.md, UPDATE IT and bump the last-updated date

**Before session end:**
- Append learnings to .rosetta/notes.md (format: ### YYYY-MM-DD | cursor)
- If you changed the codebase significantly, update ROSETTA.md

**Staleness:** <30 days=fresh, 30-90=review, >90=verify before trusting

**If ROSETTA.md doesn't exist:**
- New/empty project \u2192 Wait until patterns emerge, then create it
- Established project \u2192 Create ROSETTA.md by analyzing the codebase
- Triggers: first feature done, directory structure set, gotcha discovered

See: https://github.com/metisos/Rosetta_Open_Source
`,
  "agent-config-aider.yml": `# Rosetta Protocol - Auto-load context files
read:
  - ROSETTA.md
  - .rosetta/notes.md
`,
  // Claude Code Hooks
  "claude-hooks-settings.json": `{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "\\"$CLAUDE_PROJECT_DIR\\"/.claude/hooks/rosetta-session-start.sh",
            "timeout": 10
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "\\"$CLAUDE_PROJECT_DIR\\"/.claude/hooks/rosetta-prompt-context.sh",
            "timeout": 5
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "\\"$CLAUDE_PROJECT_DIR\\"/.claude/hooks/rosetta-post-edit-staleness.sh",
            "timeout": 5
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "\\"$CLAUDE_PROJECT_DIR\\"/.claude/hooks/rosetta-stop-notes-reminder.sh",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
`,
  "claude-hook-session-start.sh": `#!/bin/bash
#
# Rosetta Session Start Hook
# Reminds Claude to load ROSETTA.md context at the beginning of sessions
#

# Get project directory from environment or input
if [ -n "$CLAUDE_PROJECT_DIR" ]; then
    PROJECT_DIR="$CLAUDE_PROJECT_DIR"
else
    # Try to extract from stdin JSON
    input=$(cat)
    PROJECT_DIR=$(echo "$input" | jq -r '.cwd // empty' 2>/dev/null)
fi

# Check if ROSETTA.md exists in the project
if [ -n "$PROJECT_DIR" ] && [ -f "$PROJECT_DIR/ROSETTA.md" ]; then
    echo "Rosetta Protocol Active: ROSETTA.md found"
    echo ""
    echo "Session start checklist:"
    echo "  1. Read ROSETTA.md for project context"
    echo "  2. Check Module Index and load relevant .rosetta/modules/ files"
    echo "  3. Review .rosetta/notes.md for recent discoveries"

    # Check if modules directory exists
    if [ -d "$PROJECT_DIR/.rosetta/modules" ]; then
        module_count=$(find "$PROJECT_DIR/.rosetta/modules" -name "*.md" 2>/dev/null | wc -l)
        if [ "$module_count" -gt 0 ]; then
            echo ""
            echo "Available modules: $module_count"
        fi
    fi

    # Check notes.md freshness
    if [ -f "$PROJECT_DIR/.rosetta/notes.md" ]; then
        last_modified=$(stat -c %Y "$PROJECT_DIR/.rosetta/notes.md" 2>/dev/null || stat -f %m "$PROJECT_DIR/.rosetta/notes.md" 2>/dev/null)
        current_time=$(date +%s)
        age_days=$(( (current_time - last_modified) / 86400 ))
        if [ "$age_days" -gt 7 ]; then
            echo ""
            echo "Note: .rosetta/notes.md is \${age_days} days old - consider reviewing"
        fi
    fi
fi

exit 0
`,
  "claude-hook-prompt-context.sh": `#!/bin/bash
#
# Rosetta Prompt Context Hook
# Adds Rosetta protocol context to user prompts when working in Rosetta projects
#

# Read input from stdin
input=$(cat)

# Get project directory
if [ -n "$CLAUDE_PROJECT_DIR" ]; then
    PROJECT_DIR="$CLAUDE_PROJECT_DIR"
else
    PROJECT_DIR=$(echo "$input" | jq -r '.cwd // empty' 2>/dev/null)
fi

# Only activate for projects with ROSETTA.md
if [ -z "$PROJECT_DIR" ] || [ ! -f "$PROJECT_DIR/ROSETTA.md" ]; then
    exit 0
fi

# Get the user's prompt
user_prompt=$(echo "$input" | jq -r '.prompt // empty' 2>/dev/null)

# Check if this seems like a codebase exploration question
exploration_keywords=("where" "how" "what" "find" "show" "explain" "understand" "architecture" "structure")
is_exploration=false

for keyword in "\${exploration_keywords[@]}"; do
    if echo "$user_prompt" | grep -qi "\\b$keyword\\b"; then
        is_exploration=true
        break
    fi
done

# If it's an exploration question, remind about Rosetta
if [ "$is_exploration" = true ]; then
    # Provide context as additional info
    context=$(cat << 'EOFCONTEXT'
{
  "additionalContext": "This project uses Rosetta Protocol. ROSETTA.md contains project context including architecture, conventions, gotchas, and module index. Check .rosetta/notes.md for recent agent discoveries."
}
EOFCONTEXT
)
    echo "$context"
fi

exit 0
`,
  "claude-hook-post-edit-staleness.sh": `#!/bin/bash
#
# Rosetta Post-Edit Hook - Staleness Detection
# Checks if ROSETTA.md might need updating after significant code changes
#

# Read input from stdin
input=$(cat)

# Get project directory
if [ -n "$CLAUDE_PROJECT_DIR" ]; then
    PROJECT_DIR="$CLAUDE_PROJECT_DIR"
else
    PROJECT_DIR=$(echo "$input" | jq -r '.cwd // empty' 2>/dev/null)
fi

# Only activate for projects with ROSETTA.md
if [ -z "$PROJECT_DIR" ] || [ ! -f "$PROJECT_DIR/ROSETTA.md" ]; then
    exit 0
fi

# Get the file that was edited
tool_name=$(echo "$input" | jq -r '.tool_name // empty' 2>/dev/null)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty' 2>/dev/null)

# Only check for Write and Edit tools
if [ "$tool_name" != "Write" ] && [ "$tool_name" != "Edit" ]; then
    exit 0
fi

# Skip if no file path
if [ -z "$file_path" ]; then
    exit 0
fi

# Check if editing critical files that might affect ROSETTA.md accuracy
critical_patterns=(
    "*/cli/commands/*"
    "*/index.ts"
    "package.json"
    "tsconfig.json"
    "*/utils/*"
)

is_critical=false
for pattern in "\${critical_patterns[@]}"; do
    if [[ "$file_path" == $pattern ]]; then
        is_critical=true
        break
    fi
done

# Check last-updated date in ROSETTA.md
if [ "$is_critical" = true ]; then
    last_updated=$(grep -o 'rosetta:last-updated:[0-9-]*' "$PROJECT_DIR/ROSETTA.md" | cut -d: -f3)
    if [ -n "$last_updated" ]; then
        last_updated_ts=$(date -d "$last_updated" +%s 2>/dev/null || date -j -f "%Y-%m-%d" "$last_updated" +%s 2>/dev/null)
        current_ts=$(date +%s)
        age_days=$(( (current_ts - last_updated_ts) / 86400 ))

        if [ "$age_days" -gt 14 ]; then
            echo "Note: ROSETTA.md last updated \${age_days} days ago. Consider updating if architecture changed."
        fi
    fi
fi

exit 0
`,
  "claude-hook-stop-notes-reminder.sh": `#!/bin/bash
#
# Rosetta Stop Hook - Notes Reminder
# Reminds Claude to update .rosetta/notes.md before ending the session
#

# Read input from stdin
input=$(cat)

# Get project directory
if [ -n "$CLAUDE_PROJECT_DIR" ]; then
    PROJECT_DIR="$CLAUDE_PROJECT_DIR"
else
    PROJECT_DIR=$(echo "$input" | jq -r '.cwd // empty' 2>/dev/null)
fi

# Only activate for projects with ROSETTA.md
if [ -z "$PROJECT_DIR" ] || [ ! -f "$PROJECT_DIR/ROSETTA.md" ]; then
    exit 0
fi

# Output reminder as additional context
cat << 'EOF'
Rosetta Session End Reminder:

Before ending this session, consider if you learned anything valuable:
- Non-obvious discoveries about the codebase
- Gotchas or pitfalls encountered
- Patterns or conventions you observed
- Integration points or dependencies found

If so, append to .rosetta/notes.md using format:
### YYYY-MM-DD | agent-name
- Discovery 1
- Discovery 2

Rules: Keep notes actionable and non-obvious. Skip if nothing new was learned.
EOF

# Allow the stop to proceed
echo '{"decision": "allow"}'
exit 0
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
function loadAndRenderTemplate(templateName, vars = {}) {
  const template = loadTemplate(templateName);
  return renderTemplate(template, vars);
}
var TEMPLATES = {
  ROSETTA_MINIMAL: "ROSETTA-minimal.md",
  MODULE: "module.md",
  NOTES: "notes.md",
  CONFIG: "config.yml",
  BOOTSTRAP: "bootstrap-prompt.md",
  AGENT_CONFIG_CLAUDE: "agent-config-claude.md",
  AGENT_CONFIG_CURSOR: "agent-config-cursor.md",
  AGENT_CONFIG_AIDER: "agent-config-aider.yml",
  CLAUDE_HOOKS_SETTINGS: "claude-hooks-settings.json",
  CLAUDE_HOOK_SESSION_START: "claude-hook-session-start.sh",
  CLAUDE_HOOK_PROMPT_CONTEXT: "claude-hook-prompt-context.sh",
  CLAUDE_HOOK_POST_EDIT_STALENESS: "claude-hook-post-edit-staleness.sh",
  CLAUDE_HOOK_STOP_NOTES_REMINDER: "claude-hook-stop-notes-reminder.sh"
};

// src/cli/utils/git.ts
var import_child_process = require("child_process");
var import_path = __toESM(require("path"));
function isGitRepo(dir) {
  try {
    (0, import_child_process.execSync)("git rev-parse --is-inside-work-tree", {
      cwd: dir,
      stdio: "pipe"
    });
    return true;
  } catch {
    return false;
  }
}
function getLastModified(filePath) {
  try {
    const dir = import_path.default.dirname(filePath);
    const result = (0, import_child_process.execSync)(`git log -1 --format=%cI -- "${import_path.default.basename(filePath)}"`, {
      cwd: dir,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"]
    }).trim();
    if (result) {
      return new Date(result);
    }
  } catch {
  }
  return null;
}
function getFilesModifiedSince(dir, since, patterns) {
  try {
    const sinceStr = since.toISOString();
    let cmd = `git log --since="${sinceStr}" --name-only --pretty=format:""`;
    if (patterns && patterns.length > 0) {
      cmd += ` -- ${patterns.map((p) => `"${p}"`).join(" ")}`;
    }
    const result = (0, import_child_process.execSync)(cmd, {
      cwd: dir,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"]
    });
    return [...new Set(result.split("\n").filter((f) => f.trim()))];
  } catch {
    return [];
  }
}
function getGitRoot(dir) {
  try {
    const result = (0, import_child_process.execSync)("git rev-parse --show-toplevel", {
      cwd: dir,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"]
    }).trim();
    return result;
  } catch {
    return null;
  }
}

// src/cli/ai/providers.ts
var ANTHROPIC_MODELS = [
  { id: "claude-sonnet-4-20250514", label: "Claude Sonnet 4 (recommended)", recommended: true },
  { id: "claude-opus-4-20250514", label: "Claude Opus 4" },
  { id: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5" }
];
async function anthropicGenerate(opts) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": opts.apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: opts.model,
      max_tokens: 8192,
      system: opts.systemPrompt,
      messages: [{ role: "user", content: opts.userPrompt }]
    })
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Anthropic API error (${res.status}): ${body}`);
  }
  const data = await res.json();
  const textBlock = data.content.find((b) => b.type === "text");
  if (!textBlock?.text) {
    throw new Error("Anthropic returned no text content");
  }
  return textBlock.text;
}
var OPENAI_MODELS = [
  { id: "gpt-4o", label: "GPT-4o (recommended)", recommended: true },
  { id: "gpt-4o-mini", label: "GPT-4o Mini" },
  { id: "o3-mini", label: "o3-mini" }
];
async function openaiGenerate(opts) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${opts.apiKey}`
    },
    body: JSON.stringify({
      model: opts.model,
      max_tokens: 8192,
      messages: [
        { role: "system", content: opts.systemPrompt },
        { role: "user", content: opts.userPrompt }
      ]
    })
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${body}`);
  }
  const data = await res.json();
  if (!data.choices?.[0]?.message?.content) {
    throw new Error("OpenAI returned no content");
  }
  return data.choices[0].message.content;
}
var GEMINI_MODELS = [
  { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash (recommended)", recommended: true },
  { id: "gemini-2.0-pro", label: "Gemini 2.0 Pro" },
  { id: "gemini-1.5-pro", label: "Gemini 1.5 Pro" }
];
async function geminiGenerate(opts) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${opts.model}:generateContent?key=${opts.apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: opts.systemPrompt }] },
      contents: [{ parts: [{ text: opts.userPrompt }] }],
      generationConfig: { maxOutputTokens: 8192 }
    })
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${body}`);
  }
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini returned no content");
  }
  return text;
}
var PROVIDERS = {
  anthropic: {
    name: "anthropic",
    displayName: "Anthropic (Claude)",
    models: ANTHROPIC_MODELS,
    generateRosetta: anthropicGenerate
  },
  openai: {
    name: "openai",
    displayName: "OpenAI (GPT)",
    models: OPENAI_MODELS,
    generateRosetta: openaiGenerate
  },
  gemini: {
    name: "gemini",
    displayName: "Google (Gemini)",
    models: GEMINI_MODELS,
    generateRosetta: geminiGenerate
  }
};
function getProvider(name) {
  const provider = PROVIDERS[name];
  if (!provider) {
    throw new Error(`Unknown provider: ${name}. Available: ${Object.keys(PROVIDERS).join(", ")}`);
  }
  return provider;
}

// src/cli/ai/analyze.ts
var import_fs = __toESM(require("fs"));
var import_path2 = __toESM(require("path"));
var import_child_process2 = require("child_process");
function getDirectoryTree(cwd) {
  try {
    const files = (0, import_child_process2.execSync)("git ls-files --cached --others --exclude-standard", {
      cwd,
      encoding: "utf-8",
      timeout: 1e4
    }).trim().split("\n").filter(Boolean);
    const tree = buildTreeString(files);
    return tree;
  } catch {
    return getBasicTree(cwd, "", 0, 3);
  }
}
function buildTreeString(files) {
  const dirs = /* @__PURE__ */ new Map();
  for (const file of files) {
    const parts = file.split("/");
    const topDir = parts.length > 1 ? parts[0] : ".";
    if (!dirs.has(topDir)) {
      dirs.set(topDir, []);
    }
    dirs.get(topDir).push(file);
  }
  const lines = [];
  for (const [dir, dirFiles] of dirs) {
    if (dir === ".") {
      for (const f of dirFiles) {
        lines.push(f);
      }
    } else {
      lines.push(`${dir}/`);
      const shown = dirFiles.slice(0, 20);
      for (const f of shown) {
        lines.push(`  ${f}`);
      }
      if (dirFiles.length > 20) {
        lines.push(`  ... and ${dirFiles.length - 20} more files`);
      }
    }
  }
  return lines.join("\n");
}
function getBasicTree(dir, prefix, depth, maxDepth) {
  if (depth >= maxDepth) return "";
  const entries = import_fs.default.readdirSync(dir, { withFileTypes: true }).filter((e) => !e.name.startsWith(".") && e.name !== "node_modules" && e.name !== "dist").sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });
  const lines = [];
  for (const entry of entries) {
    const isDir = entry.isDirectory();
    lines.push(`${prefix}${entry.name}${isDir ? "/" : ""}`);
    if (isDir) {
      const sub = getBasicTree(import_path2.default.join(dir, entry.name), prefix + "  ", depth + 1, maxDepth);
      if (sub) lines.push(sub);
    }
  }
  return lines.join("\n");
}
function gatherKeyFiles(cwd) {
  const entries = [];
  const maxFileSize = 8e3;
  const maxTotalSize = 6e4;
  let totalSize = 0;
  const priorityFiles = [
    "package.json",
    "README.md",
    "CONTRIBUTING.md",
    "Cargo.toml",
    "pyproject.toml",
    "setup.py",
    "go.mod",
    "Gemfile",
    "requirements.txt",
    "pom.xml",
    "build.gradle",
    "tsconfig.json",
    "next.config.js",
    "next.config.ts",
    "vite.config.ts",
    "webpack.config.js"
  ];
  for (const file of priorityFiles) {
    if (totalSize >= maxTotalSize) break;
    const fullPath = import_path2.default.join(cwd, file);
    if (import_fs.default.existsSync(fullPath)) {
      try {
        let content = import_fs.default.readFileSync(fullPath, "utf-8");
        if (content.length > maxFileSize) {
          content = content.slice(0, maxFileSize) + "\n... (truncated)";
        }
        entries.push({ relativePath: file, content });
        totalSize += content.length;
      } catch {
      }
    }
  }
  const sourcePatterns = [
    "src/index.ts",
    "src/index.js",
    "src/main.ts",
    "src/main.js",
    "src/app.ts",
    "src/app.js",
    "src/App.tsx",
    "src/App.jsx",
    "src/lib/index.ts",
    "src/lib/index.js",
    "app/layout.tsx",
    "app/page.tsx",
    "pages/index.tsx",
    "pages/index.jsx",
    "main.go",
    "cmd/main.go",
    "src/main.rs",
    "src/lib.rs",
    "main.py",
    "app.py",
    "manage.py"
  ];
  for (const file of sourcePatterns) {
    if (totalSize >= maxTotalSize) break;
    const fullPath = import_path2.default.join(cwd, file);
    if (import_fs.default.existsSync(fullPath)) {
      try {
        let content = import_fs.default.readFileSync(fullPath, "utf-8");
        if (content.length > maxFileSize) {
          content = content.slice(0, maxFileSize) + "\n... (truncated)";
        }
        if (!entries.find((e) => e.relativePath === file)) {
          entries.push({ relativePath: file, content });
          totalSize += content.length;
        }
      } catch {
      }
    }
  }
  const srcDir = import_path2.default.join(cwd, "src");
  if (import_fs.default.existsSync(srcDir) && totalSize < maxTotalSize) {
    const srcFiles = collectSourceFiles(srcDir, cwd, 3);
    for (const file of srcFiles) {
      if (totalSize >= maxTotalSize) break;
      if (entries.find((e) => e.relativePath === file)) continue;
      const fullPath = import_path2.default.join(cwd, file);
      try {
        let content = import_fs.default.readFileSync(fullPath, "utf-8");
        if (content.length > maxFileSize) {
          content = content.slice(0, maxFileSize) + "\n... (truncated)";
        }
        entries.push({ relativePath: file, content });
        totalSize += content.length;
      } catch {
      }
    }
  }
  return entries;
}
function collectSourceFiles(dir, rootDir, maxDepth, depth = 0) {
  if (depth >= maxDepth) return [];
  const files = [];
  const codeExtensions = /* @__PURE__ */ new Set([".ts", ".tsx", ".js", ".jsx", ".py", ".go", ".rs", ".java", ".rb"]);
  try {
    const entries = import_fs.default.readdirSync(dir, { withFileTypes: true }).filter((e) => !e.name.startsWith(".") && e.name !== "node_modules" && !e.name.endsWith(".test.ts") && !e.name.endsWith(".spec.ts"));
    const indexFiles = entries.filter((e) => !e.isDirectory() && e.name.startsWith("index"));
    for (const f of indexFiles) {
      files.push(import_path2.default.relative(rootDir, import_path2.default.join(dir, f.name)));
    }
    const otherFiles = entries.filter(
      (e) => !e.isDirectory() && !e.name.startsWith("index") && codeExtensions.has(import_path2.default.extname(e.name))
    );
    for (const f of otherFiles.slice(0, 5)) {
      files.push(import_path2.default.relative(rootDir, import_path2.default.join(dir, f.name)));
    }
    const subDirs = entries.filter((e) => e.isDirectory());
    for (const d of subDirs) {
      files.push(...collectSourceFiles(import_path2.default.join(dir, d.name), rootDir, maxDepth, depth + 1));
    }
  } catch {
  }
  return files;
}
function buildSystemPrompt() {
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
function buildUserPrompt(cwd, tree, files) {
  const projectName = import_path2.default.basename(cwd);
  let prompt = `# Codebase Analysis Request

Project directory: ${projectName}

## Directory Structure
\`\`\`
${tree}
\`\`\`

## Key Files
`;
  for (const file of files) {
    prompt += `
### ${file.relativePath}
\`\`\`
${file.content}
\`\`\`
`;
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
async function analyzeCodebase(opts) {
  const { cwd, provider, apiKey, model, onStatus } = opts;
  onStatus?.("Scanning project structure...");
  const tree = getDirectoryTree(cwd);
  onStatus?.("Reading key files...");
  const files = gatherKeyFiles(cwd);
  onStatus?.(`Sending to ${provider.displayName} (${model})...`);
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(cwd, tree, files);
  const generateOpts = {
    apiKey,
    model,
    systemPrompt,
    userPrompt
  };
  onStatus?.("Generating ROSETTA.md...");
  const result = await provider.generateRosetta(generateOpts);
  let cleaned = result.trim();
  if (cleaned.startsWith("```markdown")) {
    cleaned = cleaned.slice("```markdown".length);
  } else if (cleaned.startsWith("```md")) {
    cleaned = cleaned.slice("```md".length);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();
  if (!cleaned.startsWith("# Rosetta")) {
    const idx = cleaned.indexOf("# Rosetta");
    if (idx > -1) {
      cleaned = cleaned.slice(idx);
    }
  }
  return cleaned;
}

// src/cli/ai/diff-sync.ts
var import_child_process3 = require("child_process");
var import_fs2 = __toESM(require("fs"));
var import_path3 = __toESM(require("path"));
var NO_CHANGES = "NO_CHANGES_NEEDED";
function getGitDiff(cwd, since) {
  try {
    if (since) {
      return (0, import_child_process3.execSync)(`git diff ${since} -- . ':!.rosetta' ':!ROSETTA.md'`, {
        cwd,
        encoding: "utf-8",
        timeout: 15e3
      }).trim();
    }
    let diff = (0, import_child_process3.execSync)("git diff HEAD -- . ':!.rosetta' ':!ROSETTA.md'", {
      cwd,
      encoding: "utf-8",
      timeout: 15e3
    }).trim();
    if (!diff) {
      diff = (0, import_child_process3.execSync)("git diff HEAD~1 HEAD -- . ':!.rosetta' ':!ROSETTA.md'", {
        cwd,
        encoding: "utf-8",
        timeout: 15e3
      }).trim();
    }
    return diff;
  } catch {
    return "";
  }
}
function getChangedFilesSummary(cwd, since) {
  try {
    const ref = since || "HEAD~1";
    return (0, import_child_process3.execSync)(`git diff --stat ${ref} -- . ':!.rosetta' ':!ROSETTA.md'`, {
      cwd,
      encoding: "utf-8",
      timeout: 1e4
    }).trim();
  } catch {
    return "";
  }
}
function buildSyncSystemPrompt() {
  return `You are an expert at maintaining codebase documentation. You will receive:
1. The current ROSETTA.md file
2. A git diff showing recent code changes

Your job is to update ROSETTA.md to accurately reflect the changes. Follow these rules:

- ONLY update sections that are directly affected by the diff
- Preserve all existing content that is still accurate
- Do NOT modify the Agent Notes section (that is managed separately)
- Update the <!-- rosetta:last-updated:DATE --> metadata to today's date
- Keep the same format, structure, and level of detail
- Be concise \u2014 document what IS, not what should be
- If the diff only affects tests, configs, or non-architectural files, most sections won't need changes

If no meaningful documentation updates are needed, respond with exactly: ${NO_CHANGES}

Otherwise, respond with the complete updated ROSETTA.md content.
Start with "# Rosetta" on the first line. No preamble, no explanation, no code fences around the file.`;
}
function buildSyncUserPrompt(currentRosetta, diff, changedFiles) {
  const maxDiffSize = 4e4;
  let truncatedDiff = diff;
  if (diff.length > maxDiffSize) {
    truncatedDiff = diff.slice(0, maxDiffSize) + "\n\n... (diff truncated, " + diff.length + " total chars)";
  }
  return `## Current ROSETTA.md

${currentRosetta}

## Changed Files Summary

${changedFiles}

## Git Diff

\`\`\`diff
${truncatedDiff}
\`\`\`

## Instructions

Analyze the diff above and determine if ROSETTA.md needs updating.
Consider: architecture changes, new entry points, new dependencies, convention changes, new gotchas, directory structure changes.
If updates are needed, output the complete updated ROSETTA.md.
If no updates are needed, respond with exactly: ${NO_CHANGES}`;
}
function buildSummaryPrompt(currentRosetta, updatedRosetta) {
  const currentLines = currentRosetta.split("\n");
  const updatedLines = updatedRosetta.split("\n");
  const changes = [];
  const currentSections = extractSectionNames(currentRosetta);
  const updatedSections = extractSectionNames(updatedRosetta);
  for (const s of updatedSections) {
    if (!currentSections.includes(s)) changes.push(`Added section: ${s}`);
  }
  for (const s of currentSections) {
    if (!updatedSections.includes(s)) changes.push(`Removed section: ${s}`);
  }
  if (currentLines.length !== updatedLines.length) {
    const delta = updatedLines.length - currentLines.length;
    changes.push(`Content ${delta > 0 ? "expanded" : "condensed"} by ${Math.abs(delta)} lines`);
  }
  return changes.length > 0 ? changes.join(", ") : "Minor updates to existing sections";
}
function extractSectionNames(content) {
  return content.split("\n").filter((line) => line.startsWith("## ")).map((line) => line.replace("## ", "").trim());
}
async function syncRosetta(opts) {
  const { cwd, provider, apiKey, model, since, onStatus } = opts;
  const rosettaPath = import_path3.default.join(cwd, "ROSETTA.md");
  if (!import_fs2.default.existsSync(rosettaPath)) {
    throw new Error('ROSETTA.md not found. Run "rosetta init" first.');
  }
  onStatus?.("Reading current ROSETTA.md...");
  const currentRosetta = import_fs2.default.readFileSync(rosettaPath, "utf-8");
  onStatus?.("Analyzing git diff...");
  const diff = getGitDiff(cwd, since);
  if (!diff) {
    return {
      updated: false,
      content: currentRosetta,
      diff: "",
      summary: "No changes detected since last sync"
    };
  }
  const changedFiles = getChangedFilesSummary(cwd, since);
  onStatus?.(`Sending to ${provider.displayName} (${model})...`);
  const systemPrompt = buildSyncSystemPrompt();
  const userPrompt = buildSyncUserPrompt(currentRosetta, diff, changedFiles);
  const generateOpts = {
    apiKey,
    model,
    systemPrompt,
    userPrompt
  };
  onStatus?.("Analyzing changes...");
  const result = await provider.generateRosetta(generateOpts);
  const trimmed = result.trim();
  if (trimmed === NO_CHANGES || trimmed.includes(NO_CHANGES)) {
    return {
      updated: false,
      content: currentRosetta,
      diff,
      summary: "No documentation updates needed for these changes"
    };
  }
  let updatedContent = trimmed;
  if (updatedContent.startsWith("```markdown")) {
    updatedContent = updatedContent.slice("```markdown".length);
  } else if (updatedContent.startsWith("```md")) {
    updatedContent = updatedContent.slice("```md".length);
  } else if (updatedContent.startsWith("```")) {
    updatedContent = updatedContent.slice(3);
  }
  if (updatedContent.endsWith("```")) {
    updatedContent = updatedContent.slice(0, -3);
  }
  updatedContent = updatedContent.trim();
  if (!updatedContent.startsWith("# Rosetta")) {
    const idx = updatedContent.indexOf("# Rosetta");
    if (idx > -1) {
      updatedContent = updatedContent.slice(idx);
    }
  }
  const summary = buildSummaryPrompt(currentRosetta, updatedContent);
  return {
    updated: true,
    content: updatedContent,
    diff,
    summary
  };
}

// src/cli/ai/config.ts
var import_fs3 = __toESM(require("fs"));
var import_path4 = __toESM(require("path"));
var import_yaml = require("yaml");
var ENV_KEY_MAP = {
  anthropic: "ANTHROPIC_API_KEY",
  openai: "OPENAI_API_KEY",
  gemini: "GEMINI_API_KEY"
};
function readConfigFile(cwd) {
  const configPath = import_path4.default.join(cwd, ".rosetta", "config.yml");
  if (!import_fs3.default.existsSync(configPath)) return null;
  try {
    const raw = import_fs3.default.readFileSync(configPath, "utf-8");
    return (0, import_yaml.parse)(raw);
  } catch {
    return null;
  }
}
function saveProviderToConfig(cwd, providerName, model) {
  const configPath = import_path4.default.join(cwd, ".rosetta", "config.yml");
  let config = { version: 1 };
  if (import_fs3.default.existsSync(configPath)) {
    try {
      const raw = import_fs3.default.readFileSync(configPath, "utf-8");
      config = (0, import_yaml.parse)(raw) || { version: 1 };
    } catch {
    }
  }
  config.ai = { provider: providerName, model };
  const dir = import_path4.default.dirname(configPath);
  if (!import_fs3.default.existsSync(dir)) {
    import_fs3.default.mkdirSync(dir, { recursive: true });
  }
  import_fs3.default.writeFileSync(configPath, (0, import_yaml.stringify)(config), "utf-8");
}
function resolveApiKey(providerName, flagKey) {
  if (flagKey) return flagKey;
  const envName = ENV_KEY_MAP[providerName];
  if (envName && process.env[envName]) {
    return process.env[envName];
  }
  if (process.env.ROSETTA_API_KEY) {
    return process.env.ROSETTA_API_KEY;
  }
  return null;
}
function resolveConfigNonInteractive(cwd, flags) {
  const fileConfig = readConfigFile(cwd);
  const providerName = flags.provider || process.env.ROSETTA_PROVIDER || fileConfig?.ai?.provider || null;
  let provider = null;
  if (providerName && PROVIDERS[providerName]) {
    provider = getProvider(providerName);
  }
  const model = flags.model || fileConfig?.ai?.model || (provider ? provider.models.find((m) => m.recommended)?.id || provider.models[0].id : null);
  const apiKey = resolveApiKey(providerName || "", flags.key);
  return { provider, model, apiKey, providerName };
}

// src/index.ts
var ROSETTA_PROTOCOL = {
  ROOT_FILE: "ROSETTA.md",
  MODULES_DIR: ".rosetta/modules",
  NOTES_FILE: ".rosetta/notes.md",
  CONFIG_FILE: ".rosetta/config.yml"
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PROVIDERS,
  REQUIRED_MODULE_SECTIONS,
  REQUIRED_SECTIONS,
  ROSETTA_PROTOCOL,
  TEMPLATES,
  analyzeCodebase,
  getFilesModifiedSince,
  getGitDiff,
  getGitRoot,
  getLastModified,
  getProvider,
  isGitRepo,
  loadAndRenderTemplate,
  loadTemplate,
  parseAgentNotes,
  parseModuleIndex,
  parseRosettaFile,
  readConfigFile,
  renderTemplate,
  resolveApiKey,
  resolveConfigNonInteractive,
  saveProviderToConfig,
  syncRosetta,
  validateSections
});
//# sourceMappingURL=index.js.map