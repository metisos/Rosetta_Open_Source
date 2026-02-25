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
var import_chalk11 = __toESM(require("chalk"));

// src/cli/commands/init.ts
var import_fs2 = __toESM(require("fs"));
var import_path2 = __toESM(require("path"));
var import_chalk2 = __toESM(require("chalk"));

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
var CLAUDE_HOOKS_FILES = [
  { name: "rosetta-session-start.sh", template: "claude-hook-session-start.sh" },
  { name: "rosetta-prompt-context.sh", template: "claude-hook-prompt-context.sh" },
  { name: "rosetta-post-edit-staleness.sh", template: "claude-hook-post-edit-staleness.sh" },
  { name: "rosetta-stop-notes-reminder.sh", template: "claude-hook-stop-notes-reminder.sh" }
];

// src/cli/commands/setup-agent.ts
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_chalk = __toESM(require("chalk"));
var AGENT_CONFIGS = [
  {
    name: "Claude Code",
    files: [".claude/CLAUDE.md", "CLAUDE.md"],
    template: TEMPLATES.AGENT_CONFIG_CLAUDE,
    appendMode: true,
    sectionMarker: "## Rosetta Protocol"
  },
  {
    name: "Cursor",
    files: [".cursorrules"],
    template: TEMPLATES.AGENT_CONFIG_CURSOR,
    appendMode: true,
    sectionMarker: "## Rosetta Protocol"
  },
  {
    name: "Aider",
    files: [".aider.conf.yml"],
    template: TEMPLATES.AGENT_CONFIG_AIDER,
    appendMode: false
    // YAML needs special handling
  }
];
function findExistingFile(files, cwd) {
  for (const file of files) {
    const filePath = import_path.default.join(cwd, file);
    if (import_fs.default.existsSync(filePath)) {
      return filePath;
    }
  }
  return null;
}
function setupClaudeHooks(cwd, force) {
  const result = { created: 0, skipped: 0, updated: 0 };
  const hooksDir = import_path.default.join(cwd, ".claude", "hooks");
  const settingsPath = import_path.default.join(cwd, ".claude", "settings.json");
  if (!import_fs.default.existsSync(hooksDir)) {
    import_fs.default.mkdirSync(hooksDir, { recursive: true });
  }
  for (const hookFile of CLAUDE_HOOKS_FILES) {
    const hookPath = import_path.default.join(hooksDir, hookFile.name);
    if (import_fs.default.existsSync(hookPath) && !force) {
      console.log(import_chalk.default.yellow("  \u2298") + ` Hook ${hookFile.name} already exists (use --force to replace)`);
      result.skipped++;
      continue;
    }
    const content = loadTemplate(hookFile.template);
    import_fs.default.writeFileSync(hookPath, content, { mode: 493 });
    console.log(import_chalk.default.green("  \u2713") + ` Created hook: ${hookFile.name}`);
    result.created++;
  }
  const hooksConfig = JSON.parse(loadTemplate(TEMPLATES.CLAUDE_HOOKS_SETTINGS));
  if (import_fs.default.existsSync(settingsPath)) {
    try {
      const existingContent = import_fs.default.readFileSync(settingsPath, "utf-8");
      const existingSettings = JSON.parse(existingContent);
      if (existingSettings.hooks && !force) {
        console.log(import_chalk.default.yellow("  \u2298") + " settings.json already has hooks (use --force to replace)");
        result.skipped++;
      } else {
        existingSettings.hooks = hooksConfig.hooks;
        import_fs.default.writeFileSync(settingsPath, JSON.stringify(existingSettings, null, 2) + "\n", "utf-8");
        console.log(import_chalk.default.green("  \u2713") + " Updated .claude/settings.json with Rosetta hooks");
        result.updated++;
      }
    } catch {
      const backupPath = settingsPath + ".backup";
      import_fs.default.copyFileSync(settingsPath, backupPath);
      import_fs.default.writeFileSync(settingsPath, JSON.stringify(hooksConfig, null, 2) + "\n", "utf-8");
      console.log(import_chalk.default.yellow("  \u26A0") + ` Backed up invalid settings.json, created new with hooks`);
      result.created++;
    }
  } else {
    import_fs.default.writeFileSync(settingsPath, JSON.stringify(hooksConfig, null, 2) + "\n", "utf-8");
    console.log(import_chalk.default.green("  \u2713") + " Created .claude/settings.json with Rosetta hooks");
    result.created++;
  }
  return result;
}
function hasRosettaSection(content, marker) {
  return content.includes(marker);
}
async function setupAgentCommand(options) {
  const cwd = process.cwd();
  const rosettaPath = import_path.default.join(cwd, "ROSETTA.md");
  if (!options.skipRosettaCheck && !import_fs.default.existsSync(rosettaPath)) {
    console.log(import_chalk.default.yellow("ROSETTA.md not found."));
    console.log();
    console.log("Run " + import_chalk.default.white("'rosetta init'") + " first to initialize Rosetta.");
    return;
  }
  console.log(import_chalk.default.cyan("Rosetta Agent Setup"));
  console.log(import_chalk.default.gray("\u2550".repeat(40)));
  console.log();
  const targetAgents = options.agent === "all" || !options.agent ? AGENT_CONFIGS : AGENT_CONFIGS.filter((a) => a.name.toLowerCase().includes(options.agent));
  let updated = 0;
  let skipped = 0;
  let created = 0;
  for (const agent of targetAgents) {
    const existingFile = findExistingFile(agent.files, cwd);
    const templateContent = loadTemplate(agent.template);
    if (existingFile) {
      const content = import_fs.default.readFileSync(existingFile, "utf-8");
      if (agent.sectionMarker && hasRosettaSection(content, agent.sectionMarker)) {
        if (!options.force) {
          console.log(import_chalk.default.yellow("\u2298") + ` ${agent.name}: Rosetta section already exists (use --force to replace)`);
          skipped++;
          continue;
        }
        const lines = content.split("\n");
        const sectionStart = lines.findIndex((l) => l.includes(agent.sectionMarker));
        if (sectionStart !== -1) {
          let sectionEnd = lines.length;
          for (let i = sectionStart + 1; i < lines.length; i++) {
            if (lines[i].match(/^## /) && !lines[i].includes("Rosetta")) {
              sectionEnd = i;
              break;
            }
          }
          lines.splice(sectionStart, sectionEnd - sectionStart);
          const newContent = lines.join("\n").trimEnd() + "\n\n" + templateContent;
          import_fs.default.writeFileSync(existingFile, newContent, "utf-8");
          console.log(import_chalk.default.green("\u2713") + ` ${agent.name}: Updated ${import_path.default.relative(cwd, existingFile)}`);
          updated++;
        }
      } else if (agent.appendMode) {
        const newContent = content.trimEnd() + "\n\n" + templateContent;
        import_fs.default.writeFileSync(existingFile, newContent, "utf-8");
        console.log(import_chalk.default.green("\u2713") + ` ${agent.name}: Added Rosetta section to ${import_path.default.relative(cwd, existingFile)}`);
        updated++;
      } else {
        if (content.includes("ROSETTA.md")) {
          console.log(import_chalk.default.yellow("\u2298") + ` ${agent.name}: Already configured for Rosetta`);
          skipped++;
        } else {
          const newContent = content.trimEnd() + "\n\n" + templateContent;
          import_fs.default.writeFileSync(existingFile, newContent, "utf-8");
          console.log(import_chalk.default.green("\u2713") + ` ${agent.name}: Updated ${import_path.default.relative(cwd, existingFile)}`);
          updated++;
        }
      }
    } else {
      const targetFile = import_path.default.join(cwd, agent.files[0]);
      const targetDir = import_path.default.dirname(targetFile);
      if (!import_fs.default.existsSync(targetDir)) {
        import_fs.default.mkdirSync(targetDir, { recursive: true });
      }
      import_fs.default.writeFileSync(targetFile, templateContent, "utf-8");
      console.log(import_chalk.default.green("\u2713") + ` ${agent.name}: Created ${agent.files[0]}`);
      created++;
    }
  }
  const shouldInstallHooks = options.hooks !== false && (options.agent === "claude" || options.agent === "all" || !options.agent);
  let hooksResult = null;
  if (shouldInstallHooks) {
    console.log();
    console.log(import_chalk.default.cyan("Installing Claude Code Hooks..."));
    hooksResult = setupClaudeHooks(cwd, options.force || false);
    created += hooksResult.created;
    updated += hooksResult.updated;
    skipped += hooksResult.skipped;
  }
  console.log();
  console.log(import_chalk.default.gray("\u2500".repeat(40)));
  console.log(
    `Summary: ${created > 0 ? import_chalk.default.green(`${created} created`) : "0 created"}, ${updated > 0 ? import_chalk.default.cyan(`${updated} updated`) : "0 updated"}, ${skipped > 0 ? import_chalk.default.yellow(`${skipped} skipped`) : "0 skipped"}`
  );
  if (created > 0 || updated > 0) {
    console.log();
    console.log(import_chalk.default.green("Agent configs are now Rosetta-aware!"));
    console.log(import_chalk.default.gray("Future agent sessions will automatically use Rosetta context."));
    if (hooksResult && (hooksResult.created > 0 || hooksResult.updated > 0)) {
      console.log();
      console.log(import_chalk.default.cyan("Claude Code hooks installed:"));
      console.log(import_chalk.default.gray("  \u2022 SessionStart: Reminds to load ROSETTA.md"));
      console.log(import_chalk.default.gray("  \u2022 UserPromptSubmit: Adds Rosetta context for exploration"));
      console.log(import_chalk.default.gray("  \u2022 PostToolUse: Warns about documentation staleness"));
      console.log(import_chalk.default.gray("  \u2022 Stop: Reminds to update .rosetta/notes.md"));
    }
  }
}

// src/cli/commands/init.ts
async function initCommand(options) {
  const cwd = process.cwd();
  if (options.lite) {
    console.log(import_chalk2.default.cyan("Rosetta Lite Init"));
    console.log(import_chalk2.default.gray("Setting up agent configs for a new project..."));
    console.log();
    await setupAgentCommand({ agent: "all", force: options.force, skipRosettaCheck: true });
    console.log();
    console.log(import_chalk2.default.cyan("Lite init complete!"));
    console.log();
    console.log(import_chalk2.default.white("What happens next:"));
    console.log("  \u2022 Agents will see instructions to create ROSETTA.md");
    console.log("  \u2022 They'll wait until your project has enough to document");
    console.log("  \u2022 When ready, they'll initialize full Rosetta automatically");
    console.log();
    console.log(import_chalk2.default.gray("Triggers for full init:"));
    console.log("  \u2022 First feature/module complete");
    console.log("  \u2022 Clear directory structure established");
    console.log("  \u2022 Patterns starting to emerge");
    console.log("  \u2022 First non-obvious gotcha discovered");
    console.log();
    console.log(import_chalk2.default.gray("Or run ") + import_chalk2.default.white("rosetta init") + import_chalk2.default.gray(" manually when ready."));
    return;
  }
  const rosettaPath = import_path2.default.join(cwd, "ROSETTA.md");
  const rosettaDir = import_path2.default.join(cwd, ".rosetta");
  if (import_fs2.default.existsSync(rosettaPath) && !options.force) {
    console.log(import_chalk2.default.yellow("ROSETTA.md already exists. Use --force to overwrite."));
    return;
  }
  const modulesDir = import_path2.default.join(rosettaDir, "modules");
  if (!import_fs2.default.existsSync(rosettaDir)) {
    import_fs2.default.mkdirSync(rosettaDir, { recursive: true });
  }
  if (!import_fs2.default.existsSync(modulesDir)) {
    import_fs2.default.mkdirSync(modulesDir, { recursive: true });
  }
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  try {
    const templateName = options.template === "nextjs" ? "ROSETTA.md" : TEMPLATES.ROSETTA_MINIMAL;
    const rosettaTemplate = loadTemplate(templateName);
    const rosettaContent = renderTemplate(rosettaTemplate, { DATE: today });
    import_fs2.default.writeFileSync(rosettaPath, rosettaContent, "utf-8");
    console.log(import_chalk2.default.green("\u2713") + " Created ROSETTA.md");
  } catch (error) {
    console.log(import_chalk2.default.red("\u2717") + " Failed to create ROSETTA.md");
    console.error(error);
    return;
  }
  try {
    const notesTemplate = loadTemplate(TEMPLATES.NOTES);
    const notesContent = renderTemplate(notesTemplate, { DATE: today });
    import_fs2.default.writeFileSync(import_path2.default.join(rosettaDir, "notes.md"), notesContent, "utf-8");
    console.log(import_chalk2.default.green("\u2713") + " Created .rosetta/notes.md");
  } catch (error) {
    console.log(import_chalk2.default.red("\u2717") + " Failed to create .rosetta/notes.md");
  }
  try {
    const configTemplate = loadTemplate(TEMPLATES.CONFIG);
    import_fs2.default.writeFileSync(import_path2.default.join(rosettaDir, "config.yml"), configTemplate, "utf-8");
    console.log(import_chalk2.default.green("\u2713") + " Created .rosetta/config.yml");
  } catch (error) {
    console.log(import_chalk2.default.red("\u2717") + " Failed to create .rosetta/config.yml");
  }
  import_fs2.default.writeFileSync(import_path2.default.join(modulesDir, ".gitkeep"), "", "utf-8");
  console.log(import_chalk2.default.green("\u2713") + " Created .rosetta/modules/");
  console.log();
  console.log(import_chalk2.default.cyan("Rosetta initialized!") + " Next steps:");
  console.log();
  console.log("  1. Edit " + import_chalk2.default.white("ROSETTA.md") + " to describe your project");
  console.log("  2. Run " + import_chalk2.default.white("'rosetta add-module <name>'") + " to add module docs");
  console.log("  3. Run " + import_chalk2.default.white("'rosetta setup-agent'") + " to configure agent files");
  console.log();
  if (options.bootstrap) {
    console.log(import_chalk2.default.yellow("\u2500".repeat(60)));
    console.log();
    console.log(import_chalk2.default.cyan("Bootstrap Protocol"));
    console.log(import_chalk2.default.gray("Copy and paste the following into your AI coding agent:"));
    console.log();
    try {
      const bootstrapPrompt = loadTemplate(TEMPLATES.BOOTSTRAP);
      console.log(bootstrapPrompt);
    } catch {
      console.log(import_chalk2.default.red("Failed to load bootstrap prompt"));
    }
  }
  console.log(import_chalk2.default.gray("Docs: https://github.com/metisos/rosetta"));
}

// src/cli/commands/validate.ts
var import_fs3 = __toESM(require("fs"));
var import_path3 = __toESM(require("path"));
var import_chalk3 = __toESM(require("chalk"));

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

// src/cli/commands/validate.ts
async function validateCommand(options) {
  const targetPath = options.path || process.cwd();
  const rosettaPath = import_path3.default.join(targetPath, "ROSETTA.md");
  const rosettaDir = import_path3.default.join(targetPath, ".rosetta");
  const result = {
    errors: [],
    warnings: []
  };
  console.log(import_chalk3.default.cyan("Rosetta Validation Report"));
  console.log(import_chalk3.default.gray("\u2550".repeat(40)));
  console.log();
  if (!import_fs3.default.existsSync(rosettaPath)) {
    console.log(import_chalk3.default.red("\u2717") + " ROSETTA.md not found");
    console.log();
    console.log(import_chalk3.default.yellow("Run 'rosetta init' to initialize Rosetta"));
    return;
  }
  console.log(import_chalk3.default.white("ROSETTA.md"));
  const rosettaContent = import_fs3.default.readFileSync(rosettaPath, "utf-8");
  const parsed = parseRosettaFile(rosettaContent);
  const sectionValidation = validateSections(parsed, REQUIRED_SECTIONS);
  for (const section of sectionValidation.found) {
    console.log(import_chalk3.default.green("  \u2713") + ` ${section} section present`);
  }
  for (const section of sectionValidation.missing) {
    console.log(import_chalk3.default.red("  \u2717") + ` ${section} section missing`);
    result.errors.push(`Missing section: ${section}`);
  }
  if (parsed.metadata.lastUpdated) {
    const lastUpdated = new Date(parsed.metadata.lastUpdated);
    const daysSince = Math.floor((Date.now() - lastUpdated.getTime()) / (1e3 * 60 * 60 * 24));
    if (daysSince > 30) {
      console.log(import_chalk3.default.yellow("  \u26A0") + ` Last updated ${daysSince} days ago`);
      result.warnings.push(`ROSETTA.md last updated ${daysSince} days ago`);
    }
  } else {
    console.log(import_chalk3.default.yellow("  \u26A0") + " No last-updated metadata found");
    result.warnings.push("No last-updated metadata in ROSETTA.md");
  }
  console.log();
  const moduleIndex = parseModuleIndex(rosettaContent);
  console.log(import_chalk3.default.white("Module Index"));
  if (moduleIndex.length === 0) {
    console.log(import_chalk3.default.yellow("  \u26A0") + " No modules defined in index");
    result.warnings.push("No modules defined in Module Index");
  } else {
    for (const module2 of moduleIndex) {
      if (!module2.module || !module2.path) continue;
      const modulePath = import_path3.default.join(targetPath, module2.path);
      if (import_fs3.default.existsSync(modulePath)) {
        console.log(import_chalk3.default.green("  \u2713") + ` ${module2.module}.md exists`);
      } else {
        console.log(import_chalk3.default.red("  \u2717") + ` ${module2.module}.md missing (${module2.path})`);
        result.errors.push(`Module file missing: ${module2.path}`);
      }
    }
  }
  console.log();
  const modulesDir = import_path3.default.join(rosettaDir, "modules");
  if (import_fs3.default.existsSync(modulesDir)) {
    const moduleFiles = import_fs3.default.readdirSync(modulesDir).filter((f) => f.endsWith(".md"));
    if (moduleFiles.length > 0) {
      console.log(import_chalk3.default.white("Module Files"));
      for (const moduleFile of moduleFiles) {
        const modulePath = import_path3.default.join(modulesDir, moduleFile);
        const moduleContent = import_fs3.default.readFileSync(modulePath, "utf-8");
        const moduleParsed = parseRosettaFile(moduleContent);
        const moduleValidation = validateSections(moduleParsed, REQUIRED_MODULE_SECTIONS);
        if (moduleValidation.valid) {
          console.log(import_chalk3.default.green("  \u2713") + ` ${moduleFile} structure valid`);
        } else {
          console.log(import_chalk3.default.red("  \u2717") + ` ${moduleFile} missing sections: ${moduleValidation.missing.join(", ")}`);
          result.errors.push(`${moduleFile} missing sections: ${moduleValidation.missing.join(", ")}`);
        }
        if (moduleParsed.metadata.lastVerified) {
          const lastVerified = new Date(moduleParsed.metadata.lastVerified);
          const daysSince = Math.floor((Date.now() - lastVerified.getTime()) / (1e3 * 60 * 60 * 24));
          if (daysSince > 30) {
            console.log(import_chalk3.default.yellow("    \u26A0") + ` last-verified: ${daysSince} days ago`);
            result.warnings.push(`${moduleFile} last-verified ${daysSince} days ago`);
          }
        }
      }
    }
  }
  console.log();
  console.log(import_chalk3.default.gray("\u2500".repeat(40)));
  if (result.errors.length === 0 && result.warnings.length === 0) {
    console.log(import_chalk3.default.green("\u2713 All checks passed"));
  } else {
    console.log(
      `Summary: ${result.errors.length > 0 ? import_chalk3.default.red(`${result.errors.length} error(s)`) : "0 errors"}, ${result.warnings.length > 0 ? import_chalk3.default.yellow(`${result.warnings.length} warning(s)`) : "0 warnings"}`
    );
  }
  if (result.errors.length > 0) {
    process.exitCode = 1;
  }
}

// src/cli/commands/status.ts
var import_fs4 = __toESM(require("fs"));
var import_path4 = __toESM(require("path"));
var import_chalk4 = __toESM(require("chalk"));
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
  if (daysSince >= critical) return import_chalk4.default.red("\u2717 Critical");
  if (daysSince >= warning) return import_chalk4.default.yellow("\u26A0 Review needed");
  return import_chalk4.default.green("\u2713 Fresh");
}
async function statusCommand() {
  const cwd = process.cwd();
  const rosettaPath = import_path4.default.join(cwd, "ROSETTA.md");
  const rosettaDir = import_path4.default.join(cwd, ".rosetta");
  const configPath = import_path4.default.join(rosettaDir, "config.yml");
  const notesPath = import_path4.default.join(rosettaDir, "notes.md");
  const modulesDir = import_path4.default.join(rosettaDir, "modules");
  if (!import_fs4.default.existsSync(rosettaPath)) {
    console.log(import_chalk4.default.yellow("Rosetta not initialized in this project."));
    console.log();
    console.log("Run " + import_chalk4.default.white("'rosetta init'") + " to get started.");
    return;
  }
  let config = {
    staleness: { warning: 30, critical: 90 }
  };
  if (import_fs4.default.existsSync(configPath)) {
    try {
      const configContent = import_fs4.default.readFileSync(configPath, "utf-8");
      config = { ...config, ...import_yaml.default.parse(configContent) };
    } catch {
    }
  }
  const warningDays = config.staleness?.warning || 30;
  const criticalDays = config.staleness?.critical || 90;
  console.log(import_chalk4.default.cyan("Rosetta Status"));
  console.log(import_chalk4.default.gray("\u2550".repeat(40)));
  console.log();
  console.log(import_chalk4.default.white("Root Context"));
  const rosettaContent = import_fs4.default.readFileSync(rosettaPath, "utf-8");
  const rosettaParsed = parseRosettaFile(rosettaContent);
  let rootDays = 0;
  if (rosettaParsed.metadata.lastUpdated) {
    const lastUpdated = new Date(rosettaParsed.metadata.lastUpdated);
    rootDays = Math.floor((Date.now() - lastUpdated.getTime()) / (1e3 * 60 * 60 * 24));
    const status = getStatusIndicator(rootDays, warningDays, criticalDays);
    console.log(
      `  ROSETTA.md`.padEnd(24) + import_chalk4.default.gray(`updated ${formatRelativeTime(lastUpdated)}`.padEnd(24)) + status
    );
  } else {
    const stat = import_fs4.default.statSync(rosettaPath);
    rootDays = Math.floor((Date.now() - stat.mtime.getTime()) / (1e3 * 60 * 60 * 24));
    const status = getStatusIndicator(rootDays, warningDays, criticalDays);
    console.log(
      `  ROSETTA.md`.padEnd(24) + import_chalk4.default.gray(`modified ${formatRelativeTime(stat.mtime)}`.padEnd(24)) + status
    );
  }
  console.log();
  if (import_fs4.default.existsSync(modulesDir)) {
    const moduleFiles = import_fs4.default.readdirSync(modulesDir).filter((f) => f.endsWith(".md"));
    console.log(import_chalk4.default.white(`Modules (${moduleFiles.length} total)`));
    if (moduleFiles.length === 0) {
      console.log(import_chalk4.default.gray("  No module files found"));
    } else {
      const staleModules = [];
      for (const moduleFile of moduleFiles) {
        const modulePath = import_path4.default.join(modulesDir, moduleFile);
        const moduleContent = import_fs4.default.readFileSync(modulePath, "utf-8");
        const moduleParsed = parseRosettaFile(moduleContent);
        let moduleDays = 0;
        let timeStr = "";
        if (moduleParsed.metadata.lastVerified) {
          const lastVerified = new Date(moduleParsed.metadata.lastVerified);
          moduleDays = Math.floor((Date.now() - lastVerified.getTime()) / (1e3 * 60 * 60 * 24));
          timeStr = `verified ${formatRelativeTime(lastVerified)}`;
        } else {
          const stat = import_fs4.default.statSync(modulePath);
          moduleDays = Math.floor((Date.now() - stat.mtime.getTime()) / (1e3 * 60 * 60 * 24));
          timeStr = `modified ${formatRelativeTime(stat.mtime)}`;
        }
        const status = getStatusIndicator(moduleDays, warningDays, criticalDays);
        console.log(`  ${moduleFile}`.padEnd(24) + import_chalk4.default.gray(timeStr.padEnd(24)) + status);
        if (moduleDays >= warningDays) {
          staleModules.push(moduleFile);
        }
      }
    }
  } else {
    console.log(import_chalk4.default.white("Modules"));
    console.log(import_chalk4.default.gray("  .rosetta/modules/ not found"));
  }
  console.log();
  console.log(import_chalk4.default.white("Agent Notes"));
  if (import_fs4.default.existsSync(notesPath)) {
    const notesContent = import_fs4.default.readFileSync(notesPath, "utf-8");
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
    console.log(import_chalk4.default.gray("  .rosetta/notes.md not found"));
  }
  console.log();
  console.log(import_chalk4.default.white("Suggestions"));
  const suggestions = [];
  if (import_fs4.default.existsSync(modulesDir)) {
    const moduleFiles = import_fs4.default.readdirSync(modulesDir).filter((f) => f.endsWith(".md"));
    for (const moduleFile of moduleFiles) {
      const modulePath = import_path4.default.join(modulesDir, moduleFile);
      const moduleContent = import_fs4.default.readFileSync(modulePath, "utf-8");
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
  if (import_fs4.default.existsSync(notesPath)) {
    const notesContent = import_fs4.default.readFileSync(notesPath, "utf-8");
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
    console.log(import_chalk4.default.green("  \u2713 Everything looks good!"));
  } else {
    for (const suggestion of suggestions) {
      console.log(import_chalk4.default.yellow("  \u2192") + ` ${suggestion}`);
    }
  }
}

// src/cli/commands/add-module.ts
var import_fs5 = __toESM(require("fs"));
var import_path5 = __toESM(require("path"));
var import_chalk5 = __toESM(require("chalk"));
async function addModuleCommand(name, options) {
  const cwd = process.cwd();
  const rosettaDir = import_path5.default.join(cwd, ".rosetta");
  const modulesDir = import_path5.default.join(rosettaDir, "modules");
  const modulePath = import_path5.default.join(modulesDir, `${name}.md`);
  if (!import_fs5.default.existsSync(import_path5.default.join(cwd, "ROSETTA.md"))) {
    console.log(import_chalk5.default.yellow("Rosetta not initialized in this project."));
    console.log();
    console.log("Run " + import_chalk5.default.white("'rosetta init'") + " first.");
    return;
  }
  if (import_fs5.default.existsSync(modulePath)) {
    console.log(import_chalk5.default.yellow(`Module '${name}' already exists at ${modulePath}`));
    return;
  }
  if (!import_fs5.default.existsSync(modulesDir)) {
    import_fs5.default.mkdirSync(modulesDir, { recursive: true });
  }
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  try {
    const moduleTemplate = loadTemplate(TEMPLATES.MODULE);
    const moduleContent = renderTemplate(moduleTemplate, {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      DATE: today
    });
    import_fs5.default.writeFileSync(modulePath, moduleContent, "utf-8");
  } catch (error) {
    console.log(import_chalk5.default.red("\u2717") + ` Failed to create module file: ${error}`);
    return;
  }
  console.log(import_chalk5.default.green("\u2713") + ` Created .rosetta/modules/${name}.md`);
  console.log();
  console.log(import_chalk5.default.cyan("Next steps:"));
  console.log();
  console.log("  1. Edit " + import_chalk5.default.white(`.rosetta/modules/${name}.md`) + " to document the module");
  console.log("  2. Add an entry to the Module Index in ROSETTA.md:");
  console.log();
  console.log(import_chalk5.default.gray("     | Module | Path | Description | Load When |"));
  console.log(import_chalk5.default.gray("     |--------|------|-------------|-----------|"));
  console.log(
    import_chalk5.default.white(
      `     | ${name} | \`.rosetta/modules/${name}.md\` | ${options.description || "[description]"} | [when to load] |`
    )
  );
}

// src/cli/commands/note.ts
var import_fs6 = __toESM(require("fs"));
var import_path6 = __toESM(require("path"));
var import_chalk6 = __toESM(require("chalk"));
async function noteCommand(message, options) {
  const cwd = process.cwd();
  const rosettaDir = import_path6.default.join(cwd, ".rosetta");
  const notesPath = import_path6.default.join(rosettaDir, "notes.md");
  if (!import_fs6.default.existsSync(import_path6.default.join(cwd, "ROSETTA.md"))) {
    console.log(import_chalk6.default.yellow("Rosetta not initialized in this project."));
    console.log();
    console.log("Run " + import_chalk6.default.white("'rosetta init'") + " first.");
    return;
  }
  if (!import_fs6.default.existsSync(notesPath)) {
    console.log(import_chalk6.default.yellow(".rosetta/notes.md not found."));
    console.log();
    console.log("Run " + import_chalk6.default.white("'rosetta init'") + " to create it.");
    return;
  }
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const agent = options.agent || "human";
  let content = import_fs6.default.readFileSync(notesPath, "utf-8");
  const newNote = `
### ${today} | ${agent}
- ${message}
`;
  content = content.trimEnd() + "\n" + newNote;
  import_fs6.default.writeFileSync(notesPath, content, "utf-8");
  console.log(import_chalk6.default.green("\u2713") + " Added note to .rosetta/notes.md");
  console.log();
  console.log(import_chalk6.default.gray(`  ### ${today} | ${agent}`));
  console.log(import_chalk6.default.gray(`  - ${message}`));
}

// src/cli/commands/bootstrap.ts
var import_fs7 = __toESM(require("fs"));
var import_path7 = __toESM(require("path"));
var import_chalk7 = __toESM(require("chalk"));
async function bootstrapCommand(options) {
  const cwd = process.cwd();
  const rosettaPath = import_path7.default.join(cwd, "ROSETTA.md");
  if (!import_fs7.default.existsSync(rosettaPath)) {
    console.log(import_chalk7.default.yellow("Warning: ROSETTA.md not found."));
    console.log();
    console.log(
      import_chalk7.default.gray("Consider running ") + import_chalk7.default.white("'rosetta init'") + import_chalk7.default.gray(" first to create the file structure,")
    );
    console.log(import_chalk7.default.gray("then use this bootstrap prompt to have an agent populate the content."));
    console.log();
  }
  try {
    const bootstrapPrompt = loadTemplate(TEMPLATES.BOOTSTRAP);
    if (options.output) {
      import_fs7.default.writeFileSync(options.output, bootstrapPrompt, "utf-8");
      console.log(import_chalk7.default.green("\u2713") + ` Bootstrap prompt written to ${options.output}`);
    } else {
      console.log(import_chalk7.default.cyan("Rosetta Bootstrap Protocol"));
      console.log(import_chalk7.default.gray("\u2500".repeat(60)));
      console.log(import_chalk7.default.gray("Copy and paste the following into your AI coding agent:"));
      console.log(import_chalk7.default.gray("\u2500".repeat(60)));
      console.log();
      console.log(bootstrapPrompt);
      console.log();
      console.log(import_chalk7.default.gray("\u2500".repeat(60)));
      console.log(import_chalk7.default.gray("Tip: Use") + import_chalk7.default.white(" rosetta bootstrap | pbcopy ") + import_chalk7.default.gray("to copy to clipboard (macOS)"));
      console.log(import_chalk7.default.gray("     or") + import_chalk7.default.white(" rosetta bootstrap | xclip -selection clipboard ") + import_chalk7.default.gray("(Linux)"));
    }
  } catch (error) {
    console.log(import_chalk7.default.red("\u2717") + ` Failed to load bootstrap prompt: ${error}`);
    process.exitCode = 1;
  }
}

// src/cli/commands/sync.ts
var import_fs10 = __toESM(require("fs"));
var import_path10 = __toESM(require("path"));
var import_chalk8 = __toESM(require("chalk"));
var import_ora = __toESM(require("ora"));

// src/cli/ai/diff-sync.ts
var import_child_process = require("child_process");
var import_fs8 = __toESM(require("fs"));
var import_path8 = __toESM(require("path"));
var NO_CHANGES = "NO_CHANGES_NEEDED";
function getGitDiff(cwd, since) {
  try {
    if (since) {
      return (0, import_child_process.execSync)(`git diff ${since} -- . ':!.rosetta' ':!ROSETTA.md'`, {
        cwd,
        encoding: "utf-8",
        timeout: 15e3
      }).trim();
    }
    let diff = (0, import_child_process.execSync)("git diff HEAD -- . ':!.rosetta' ':!ROSETTA.md'", {
      cwd,
      encoding: "utf-8",
      timeout: 15e3
    }).trim();
    if (!diff) {
      diff = (0, import_child_process.execSync)("git diff HEAD~1 HEAD -- . ':!.rosetta' ':!ROSETTA.md'", {
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
    return (0, import_child_process.execSync)(`git diff --stat ${ref} -- . ':!.rosetta' ':!ROSETTA.md'`, {
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
  const rosettaPath = import_path8.default.join(cwd, "ROSETTA.md");
  if (!import_fs8.default.existsSync(rosettaPath)) {
    throw new Error('ROSETTA.md not found. Run "rosetta init" first.');
  }
  onStatus?.("Reading current ROSETTA.md...");
  const currentRosetta = import_fs8.default.readFileSync(rosettaPath, "utf-8");
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
var import_fs9 = __toESM(require("fs"));
var import_path9 = __toESM(require("path"));
var import_yaml2 = require("yaml");

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

// src/cli/ai/config.ts
var ENV_KEY_MAP = {
  anthropic: "ANTHROPIC_API_KEY",
  openai: "OPENAI_API_KEY",
  gemini: "GEMINI_API_KEY"
};
function readConfigFile(cwd) {
  const configPath = import_path9.default.join(cwd, ".rosetta", "config.yml");
  if (!import_fs9.default.existsSync(configPath)) return null;
  try {
    const raw = import_fs9.default.readFileSync(configPath, "utf-8");
    return (0, import_yaml2.parse)(raw);
  } catch {
    return null;
  }
}
function saveProviderToConfig(cwd, providerName, model) {
  const configPath = import_path9.default.join(cwd, ".rosetta", "config.yml");
  let config = { version: 1 };
  if (import_fs9.default.existsSync(configPath)) {
    try {
      const raw = import_fs9.default.readFileSync(configPath, "utf-8");
      config = (0, import_yaml2.parse)(raw) || { version: 1 };
    } catch {
    }
  }
  config.ai = { provider: providerName, model };
  const dir = import_path9.default.dirname(configPath);
  if (!import_fs9.default.existsSync(dir)) {
    import_fs9.default.mkdirSync(dir, { recursive: true });
  }
  import_fs9.default.writeFileSync(configPath, (0, import_yaml2.stringify)(config), "utf-8");
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
async function resolveConfigInteractive(cwd, flags) {
  const inquirer2 = await import("inquirer");
  const resolved = resolveConfigNonInteractive(cwd, flags);
  let provider = resolved.provider;
  let providerName = resolved.providerName;
  let model = resolved.model;
  let apiKey = resolved.apiKey;
  if (!provider) {
    const providerChoices = Object.values(PROVIDERS).map((p) => ({
      name: p.displayName,
      value: p.name
    }));
    const answer = await inquirer2.default.prompt([{
      type: "list",
      name: "providerName",
      message: "Which AI provider?",
      choices: providerChoices
    }]);
    providerName = answer.providerName;
    provider = getProvider(providerName);
  }
  if (!model) {
    const modelChoices = provider.models.map((m) => ({
      name: m.label,
      value: m.id
    }));
    const answer = await inquirer2.default.prompt([{
      type: "list",
      name: "model",
      message: "Which model?",
      choices: modelChoices
    }]);
    model = answer.model;
  }
  if (!apiKey) {
    const answer = await inquirer2.default.prompt([{
      type: "password",
      name: "apiKey",
      message: `Enter your ${provider.displayName} API key:`,
      mask: "*",
      validate: (input) => input.trim().length > 0 || "API key is required"
    }]);
    apiKey = answer.apiKey.trim();
  }
  saveProviderToConfig(cwd, providerName, model);
  return { provider, model, apiKey };
}

// src/cli/commands/sync.ts
async function syncCommand(options) {
  const cwd = process.cwd();
  const rosettaPath = import_path10.default.join(cwd, "ROSETTA.md");
  if (!import_fs10.default.existsSync(rosettaPath)) {
    console.log(import_chalk8.default.red("Error:") + " ROSETTA.md not found.");
    console.log(import_chalk8.default.gray("Run ") + import_chalk8.default.white("rosetta init") + import_chalk8.default.gray(" first."));
    process.exitCode = 1;
    return;
  }
  const isInteractive = process.stdin.isTTY && !options.yes;
  let config;
  try {
    if (isInteractive) {
      config = await resolveConfigInteractive(cwd, options);
    } else {
      const resolved = resolveConfigNonInteractive(cwd, options);
      if (!resolved.provider || !resolved.model || !resolved.apiKey) {
        const missing = [];
        if (!resolved.provider) missing.push("--provider");
        if (!resolved.apiKey) missing.push("--key or env var");
        console.log(import_chalk8.default.red("Error:") + ` Missing config: ${missing.join(", ")}`);
        console.log(import_chalk8.default.gray("Set via flags, env vars (ANTHROPIC_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY), or .rosetta/config.yml"));
        process.exitCode = 1;
        return;
      }
      config = {
        provider: resolved.provider,
        model: resolved.model,
        apiKey: resolved.apiKey
      };
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(import_chalk8.default.red("Config error:") + " " + msg);
    process.exitCode = 1;
    return;
  }
  if (isInteractive) {
    const summary = getChangedFilesSummary(cwd, options.since);
    if (summary) {
      console.log();
      console.log(import_chalk8.default.cyan("  Changed files:"));
      for (const line of summary.split("\n").slice(0, 15)) {
        console.log(import_chalk8.default.gray("    " + line));
      }
      console.log();
    }
  }
  const spinner = (0, import_ora.default)({
    text: "Analyzing changes...",
    color: "cyan"
  });
  if (!options.dryRun) {
    spinner.start();
  }
  try {
    const result = await syncRosetta({
      cwd,
      provider: config.provider,
      apiKey: config.apiKey,
      model: config.model,
      since: options.since,
      onStatus: (msg) => {
        if (options.dryRun) {
          console.log(import_chalk8.default.gray("  " + msg));
        } else {
          spinner.text = msg;
        }
      }
    });
    if (!options.dryRun) {
      spinner.stop();
    }
    if (!result.updated) {
      console.log(import_chalk8.default.green("  \u2713") + " " + result.summary);
      return;
    }
    console.log(import_chalk8.default.cyan("  Changes detected:") + " " + result.summary);
    console.log();
    const currentContent = import_fs10.default.readFileSync(rosettaPath, "utf-8");
    const currentLines = currentContent.split("\n");
    const newLines = result.content.split("\n");
    const previewLimit = 20;
    let displayedChanges = 0;
    for (let i = 0; i < Math.max(currentLines.length, newLines.length) && displayedChanges < previewLimit; i++) {
      const oldLine = currentLines[i] || "";
      const newLine = newLines[i] || "";
      if (oldLine !== newLine) {
        if (oldLine) console.log(import_chalk8.default.red("  - " + oldLine));
        if (newLine) console.log(import_chalk8.default.green("  + " + newLine));
        displayedChanges++;
      }
    }
    const totalChanges = currentLines.filter((line, i) => line !== (newLines[i] || "")).length + Math.max(0, newLines.length - currentLines.length);
    if (totalChanges > previewLimit) {
      console.log(import_chalk8.default.gray(`  ... and ${totalChanges - previewLimit} more changes`));
    }
    console.log();
    if (options.dryRun) {
      console.log(import_chalk8.default.yellow("  Dry run \u2014 no files modified."));
      return;
    }
    if (isInteractive) {
      const inquirer2 = await import("inquirer");
      const { confirm } = await inquirer2.default.prompt([{
        type: "confirm",
        name: "confirm",
        message: "Apply these updates to ROSETTA.md?",
        default: true
      }]);
      if (!confirm) {
        console.log(import_chalk8.default.yellow("  Skipped \u2014 ROSETTA.md unchanged."));
        return;
      }
    }
    import_fs10.default.writeFileSync(rosettaPath, result.content, "utf-8");
    console.log(import_chalk8.default.green("  \u2713") + " ROSETTA.md updated");
  } catch (err) {
    if (!options.dryRun) {
      spinner.fail("Sync failed");
    }
    const msg = err instanceof Error ? err.message : String(err);
    console.log(import_chalk8.default.red("  Error: ") + msg);
    process.exitCode = 1;
  }
}

// src/cli/commands/watch.ts
var import_fs11 = __toESM(require("fs"));
var import_path11 = __toESM(require("path"));
var import_chalk9 = __toESM(require("chalk"));
var import_child_process2 = require("child_process");
var lastSyncHash = null;
var syncCount = 0;
var isRunning = false;
function getTreeHash(cwd) {
  try {
    return (0, import_child_process2.execSync)("git diff --stat HEAD -- . ':!.rosetta' ':!ROSETTA.md'", {
      cwd,
      encoding: "utf-8",
      timeout: 1e4
    }).trim();
  } catch {
    return "";
  }
}
function formatTime(date) {
  return date.toLocaleTimeString("en-US", { hour12: false });
}
async function watchCommand(options) {
  const cwd = process.cwd();
  const rosettaPath = import_path11.default.join(cwd, "ROSETTA.md");
  if (!import_fs11.default.existsSync(rosettaPath)) {
    console.log(import_chalk9.default.red("Error:") + " ROSETTA.md not found.");
    console.log(import_chalk9.default.gray("Run ") + import_chalk9.default.white("rosetta init") + import_chalk9.default.gray(" first."));
    process.exitCode = 1;
    return;
  }
  const intervalMinutes = parseInt(options.interval || "5", 10);
  if (isNaN(intervalMinutes) || intervalMinutes < 1) {
    console.log(import_chalk9.default.red("Error:") + " Interval must be at least 1 minute.");
    process.exitCode = 1;
    return;
  }
  const intervalMs = intervalMinutes * 60 * 1e3;
  const isInteractive = process.stdin.isTTY && !options.yes;
  const autoApply = !!options.yes;
  let config;
  try {
    if (isInteractive) {
      config = await resolveConfigInteractive(cwd, options);
    } else {
      const resolved = resolveConfigNonInteractive(cwd, options);
      if (!resolved.provider || !resolved.model || !resolved.apiKey) {
        const missing = [];
        if (!resolved.provider) missing.push("--provider");
        if (!resolved.apiKey) missing.push("--key or env var");
        console.log(import_chalk9.default.red("Error:") + ` Missing config: ${missing.join(", ")}`);
        console.log(import_chalk9.default.gray("Set via flags, env vars, or .rosetta/config.yml"));
        process.exitCode = 1;
        return;
      }
      config = {
        provider: resolved.provider,
        model: resolved.model,
        apiKey: resolved.apiKey
      };
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(import_chalk9.default.red("Config error:") + " " + msg);
    process.exitCode = 1;
    return;
  }
  lastSyncHash = getTreeHash(cwd);
  console.log();
  console.log(import_chalk9.default.cyan("  Rosetta Watch Mode"));
  console.log(import_chalk9.default.gray(`  Provider: ${config.provider.displayName} (${config.model})`));
  console.log(import_chalk9.default.gray(`  Interval: every ${intervalMinutes} minute${intervalMinutes > 1 ? "s" : ""}`));
  console.log(import_chalk9.default.gray(`  Auto-apply: ${autoApply ? "yes" : "no (will prompt)"}`));
  console.log();
  console.log(import_chalk9.default.gray(`  [${formatTime(/* @__PURE__ */ new Date())}] Watching for changes... (Ctrl+C to stop)`));
  console.log();
  const cleanup = () => {
    console.log();
    console.log(import_chalk9.default.gray(`  [${formatTime(/* @__PURE__ */ new Date())}] Watch stopped. ${syncCount} sync${syncCount !== 1 ? "s" : ""} performed.`));
    process.exit(0);
  };
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
  const checkAndSync = async () => {
    if (isRunning) return;
    const currentHash = getTreeHash(cwd);
    if (currentHash === lastSyncHash) {
      if (isInteractive) {
        process.stdout.write(import_chalk9.default.gray(`\r  [${formatTime(/* @__PURE__ */ new Date())}] No changes detected, waiting...`));
      }
      return;
    }
    isRunning = true;
    try {
      console.log(import_chalk9.default.cyan(`  [${formatTime(/* @__PURE__ */ new Date())}] Changes detected, analyzing...`));
      const result = await syncRosetta({
        cwd,
        provider: config.provider,
        apiKey: config.apiKey,
        model: config.model,
        onStatus: (msg) => {
          if (isInteractive) {
            process.stdout.write(import_chalk9.default.gray(`\r  [${formatTime(/* @__PURE__ */ new Date())}] ${msg}                    `));
          }
        }
      });
      if (!result.updated) {
        console.log(import_chalk9.default.green(`  [${formatTime(/* @__PURE__ */ new Date())}] \u2713 ${result.summary}`));
        lastSyncHash = currentHash;
        isRunning = false;
        return;
      }
      console.log(import_chalk9.default.cyan(`  [${formatTime(/* @__PURE__ */ new Date())}] Updates needed: ${result.summary}`));
      if (autoApply) {
        import_fs11.default.writeFileSync(rosettaPath, result.content, "utf-8");
        console.log(import_chalk9.default.green(`  [${formatTime(/* @__PURE__ */ new Date())}] \u2713 ROSETTA.md updated automatically`));
        syncCount++;
      } else if (isInteractive) {
        const inquirer2 = await import("inquirer");
        const { confirm } = await inquirer2.default.prompt([{
          type: "confirm",
          name: "confirm",
          message: "Apply updates to ROSETTA.md?",
          default: true
        }]);
        if (confirm) {
          import_fs11.default.writeFileSync(rosettaPath, result.content, "utf-8");
          console.log(import_chalk9.default.green(`  [${formatTime(/* @__PURE__ */ new Date())}] \u2713 ROSETTA.md updated`));
          syncCount++;
        } else {
          console.log(import_chalk9.default.yellow(`  [${formatTime(/* @__PURE__ */ new Date())}] Skipped this sync`));
        }
      } else {
        console.log(import_chalk9.default.yellow(`  [${formatTime(/* @__PURE__ */ new Date())}] Updates available. Run with --yes to auto-apply.`));
      }
      lastSyncHash = currentHash;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(import_chalk9.default.red(`  [${formatTime(/* @__PURE__ */ new Date())}] Sync error: ${msg}`));
    }
    isRunning = false;
  };
  await checkAndSync();
  setInterval(checkAndSync, intervalMs);
  await new Promise(() => {
  });
}

// src/cli/interactive/init.ts
var import_fs13 = __toESM(require("fs"));
var import_path13 = __toESM(require("path"));
var import_chalk10 = __toESM(require("chalk"));
var import_inquirer = __toESM(require("inquirer"));
var import_ora2 = __toESM(require("ora"));

// src/cli/ai/analyze.ts
var import_fs12 = __toESM(require("fs"));
var import_path12 = __toESM(require("path"));
var import_child_process3 = require("child_process");
function getDirectoryTree(cwd) {
  try {
    const files = (0, import_child_process3.execSync)("git ls-files --cached --others --exclude-standard", {
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
  const entries = import_fs12.default.readdirSync(dir, { withFileTypes: true }).filter((e) => !e.name.startsWith(".") && e.name !== "node_modules" && e.name !== "dist").sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });
  const lines = [];
  for (const entry of entries) {
    const isDir = entry.isDirectory();
    lines.push(`${prefix}${entry.name}${isDir ? "/" : ""}`);
    if (isDir) {
      const sub = getBasicTree(import_path12.default.join(dir, entry.name), prefix + "  ", depth + 1, maxDepth);
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
    const fullPath = import_path12.default.join(cwd, file);
    if (import_fs12.default.existsSync(fullPath)) {
      try {
        let content = import_fs12.default.readFileSync(fullPath, "utf-8");
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
    const fullPath = import_path12.default.join(cwd, file);
    if (import_fs12.default.existsSync(fullPath)) {
      try {
        let content = import_fs12.default.readFileSync(fullPath, "utf-8");
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
  const srcDir = import_path12.default.join(cwd, "src");
  if (import_fs12.default.existsSync(srcDir) && totalSize < maxTotalSize) {
    const srcFiles = collectSourceFiles(srcDir, cwd, 3);
    for (const file of srcFiles) {
      if (totalSize >= maxTotalSize) break;
      if (entries.find((e) => e.relativePath === file)) continue;
      const fullPath = import_path12.default.join(cwd, file);
      try {
        let content = import_fs12.default.readFileSync(fullPath, "utf-8");
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
    const entries = import_fs12.default.readdirSync(dir, { withFileTypes: true }).filter((e) => !e.name.startsWith(".") && e.name !== "node_modules" && !e.name.endsWith(".test.ts") && !e.name.endsWith(".spec.ts"));
    const indexFiles = entries.filter((e) => !e.isDirectory() && e.name.startsWith("index"));
    for (const f of indexFiles) {
      files.push(import_path12.default.relative(rootDir, import_path12.default.join(dir, f.name)));
    }
    const otherFiles = entries.filter(
      (e) => !e.isDirectory() && !e.name.startsWith("index") && codeExtensions.has(import_path12.default.extname(e.name))
    );
    for (const f of otherFiles.slice(0, 5)) {
      files.push(import_path12.default.relative(rootDir, import_path12.default.join(dir, f.name)));
    }
    const subDirs = entries.filter((e) => e.isDirectory());
    for (const d of subDirs) {
      files.push(...collectSourceFiles(import_path12.default.join(dir, d.name), rootDir, maxDepth, depth + 1));
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
  const projectName = import_path12.default.basename(cwd);
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

// src/cli/interactive/init.ts
async function interactiveInit() {
  const cwd = process.cwd();
  const rosettaPath = import_path13.default.join(cwd, "ROSETTA.md");
  const rosettaDir = import_path13.default.join(cwd, ".rosetta");
  if (import_fs13.default.existsSync(rosettaPath)) {
    const { overwrite } = await import_inquirer.default.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: "ROSETTA.md already exists. Overwrite it?",
        default: false
      }
    ]);
    if (!overwrite) {
      console.log(import_chalk10.default.yellow("Aborted. Existing ROSETTA.md preserved."));
      return;
    }
  }
  console.log();
  const { method } = await import_inquirer.default.prompt([
    {
      type: "list",
      name: "method",
      message: "How would you like to initialize Rosetta?",
      choices: [
        {
          name: `${import_chalk10.default.green("AI-Assisted")} ${import_chalk10.default.gray("- An AI model analyzes your codebase and generates ROSETTA.md")}`,
          value: "ai"
        },
        {
          name: `${import_chalk10.default.blue("Manual")} ${import_chalk10.default.gray("- Creates a template for you to fill in")}`,
          value: "manual"
        }
      ]
    }
  ]);
  if (method === "manual") {
    await manualInit(cwd, rosettaPath, rosettaDir);
  } else {
    await aiAssistedInit(cwd, rosettaPath, rosettaDir);
  }
}
async function manualInit(cwd, rosettaPath, rosettaDir) {
  const { template } = await import_inquirer.default.prompt([
    {
      type: "list",
      name: "template",
      message: "Which template?",
      choices: [
        { name: "Minimal (recommended)", value: "minimal" },
        { name: "Full (with more placeholders)", value: "full" }
      ]
    }
  ]);
  createDirectoryStructure(rosettaDir);
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const templateName = template === "full" ? "ROSETTA.md" : TEMPLATES.ROSETTA_MINIMAL;
  const rosettaTemplate = loadTemplate(templateName);
  const rosettaContent = renderTemplate(rosettaTemplate, { DATE: today });
  import_fs13.default.writeFileSync(rosettaPath, rosettaContent, "utf-8");
  console.log(import_chalk10.default.green("  \u2713") + " Created ROSETTA.md");
  createSupportFiles(rosettaDir, today);
  await promptAgentSetup();
  printNextSteps("manual");
}
async function aiAssistedInit(cwd, rosettaPath, rosettaDir) {
  const providerChoices = Object.values(PROVIDERS).map((p) => ({
    name: p.displayName,
    value: p.name
  }));
  const { providerName } = await import_inquirer.default.prompt([
    {
      type: "list",
      name: "providerName",
      message: "Which AI provider?",
      choices: providerChoices
    }
  ]);
  const provider = getProvider(providerName);
  const { apiKey } = await import_inquirer.default.prompt([
    {
      type: "password",
      name: "apiKey",
      message: `Enter your ${provider.displayName} API key:`,
      mask: "*",
      validate: (input) => {
        if (!input || input.trim().length === 0) {
          return "API key is required";
        }
        return true;
      }
    }
  ]);
  const modelChoices = provider.models.map((m) => ({
    name: m.label,
    value: m.id
  }));
  const { model } = await import_inquirer.default.prompt([
    {
      type: "list",
      name: "model",
      message: "Which model?",
      choices: modelChoices
    }
  ]);
  console.log();
  const spinner = (0, import_ora2.default)({
    text: "Scanning project structure...",
    color: "cyan"
  }).start();
  try {
    const rosettaContent = await analyzeCodebase({
      cwd,
      provider,
      apiKey: apiKey.trim(),
      model,
      onStatus: (msg) => {
        spinner.text = msg;
      }
    });
    spinner.succeed("ROSETTA.md generated!");
    console.log();
    const lines = rosettaContent.split("\n");
    const previewLines = lines.slice(0, 15);
    console.log(import_chalk10.default.gray("  \u2500\u2500\u2500 Preview \u2500\u2500\u2500"));
    for (const line of previewLines) {
      console.log(import_chalk10.default.gray("  \u2502 ") + line);
    }
    if (lines.length > 15) {
      console.log(import_chalk10.default.gray(`  \u2502 ... (${lines.length - 15} more lines)`));
    }
    console.log(import_chalk10.default.gray("  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500"));
    console.log();
    const { confirm } = await import_inquirer.default.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: "Write this ROSETTA.md to your project?",
        default: true
      }
    ]);
    if (!confirm) {
      console.log(import_chalk10.default.yellow("Aborted. No files written."));
      return;
    }
    createDirectoryStructure(rosettaDir);
    import_fs13.default.writeFileSync(rosettaPath, rosettaContent, "utf-8");
    console.log(import_chalk10.default.green("  \u2713") + " Created ROSETTA.md");
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    createSupportFiles(rosettaDir, today);
    await promptAgentSetup();
    printNextSteps("ai");
  } catch (err) {
    spinner.fail("Failed to generate ROSETTA.md");
    console.log();
    const message = err instanceof Error ? err.message : String(err);
    console.log(import_chalk10.default.red("  Error: ") + message);
    console.log();
    console.log(import_chalk10.default.gray("  Tips:"));
    console.log(import_chalk10.default.gray("  \u2022 Check that your API key is valid"));
    console.log(import_chalk10.default.gray("  \u2022 Ensure you have sufficient API credits"));
    console.log(import_chalk10.default.gray("  \u2022 Try a different model or provider"));
    console.log();
    const { fallback } = await import_inquirer.default.prompt([
      {
        type: "confirm",
        name: "fallback",
        message: "Fall back to manual template?",
        default: true
      }
    ]);
    if (fallback) {
      await manualInit(cwd, rosettaPath, rosettaDir);
    }
  }
}
function createDirectoryStructure(rosettaDir) {
  const modulesDir = import_path13.default.join(rosettaDir, "modules");
  if (!import_fs13.default.existsSync(rosettaDir)) {
    import_fs13.default.mkdirSync(rosettaDir, { recursive: true });
  }
  if (!import_fs13.default.existsSync(modulesDir)) {
    import_fs13.default.mkdirSync(modulesDir, { recursive: true });
  }
}
function createSupportFiles(rosettaDir, today) {
  const modulesDir = import_path13.default.join(rosettaDir, "modules");
  try {
    const notesTemplate = loadTemplate(TEMPLATES.NOTES);
    const notesContent = renderTemplate(notesTemplate, { DATE: today });
    import_fs13.default.writeFileSync(import_path13.default.join(rosettaDir, "notes.md"), notesContent, "utf-8");
    console.log(import_chalk10.default.green("  \u2713") + " Created .rosetta/notes.md");
  } catch {
    console.log(import_chalk10.default.red("  \u2717") + " Failed to create .rosetta/notes.md");
  }
  try {
    const configTemplate = loadTemplate(TEMPLATES.CONFIG);
    import_fs13.default.writeFileSync(import_path13.default.join(rosettaDir, "config.yml"), configTemplate, "utf-8");
    console.log(import_chalk10.default.green("  \u2713") + " Created .rosetta/config.yml");
  } catch {
    console.log(import_chalk10.default.red("  \u2717") + " Failed to create .rosetta/config.yml");
  }
  import_fs13.default.writeFileSync(import_path13.default.join(modulesDir, ".gitkeep"), "", "utf-8");
  console.log(import_chalk10.default.green("  \u2713") + " Created .rosetta/modules/");
}
async function promptAgentSetup() {
  console.log();
  const { setupAgents } = await import_inquirer.default.prompt([
    {
      type: "confirm",
      name: "setupAgents",
      message: "Configure AI agent instruction files? (CLAUDE.md, .cursorrules, etc.)",
      default: true
    }
  ]);
  if (setupAgents) {
    const { agents } = await import_inquirer.default.prompt([
      {
        type: "checkbox",
        name: "agents",
        message: "Which agents?",
        choices: [
          { name: "Claude Code", value: "claude", checked: true },
          { name: "Cursor", value: "cursor", checked: true },
          { name: "Aider", value: "aider", checked: true }
        ]
      }
    ]);
    if (agents.length > 0) {
      console.log();
      for (const agent of agents) {
        await setupAgentCommand({ agent, force: false, skipRosettaCheck: true });
      }
    }
  }
}
function printNextSteps(method) {
  console.log();
  console.log(import_chalk10.default.cyan("  Rosetta initialized!"));
  console.log();
  if (method === "manual") {
    console.log(import_chalk10.default.white("  Next steps:"));
    console.log("    1. Edit " + import_chalk10.default.white("ROSETTA.md") + " to describe your project");
    console.log("    2. Run " + import_chalk10.default.white("rosetta add-module <name>") + " to add module docs");
    console.log("    3. Run " + import_chalk10.default.white("rosetta validate") + " to check your work");
  } else {
    console.log(import_chalk10.default.white("  Next steps:"));
    console.log("    1. Review " + import_chalk10.default.white("ROSETTA.md") + " and adjust as needed");
    console.log("    2. Run " + import_chalk10.default.white("rosetta validate") + " to check structure");
    console.log("    3. Run " + import_chalk10.default.white("rosetta add-module <name>") + " for detailed module docs");
  }
  console.log();
  console.log(import_chalk10.default.gray("  Docs: https://github.com/metisos/Rosetta_Open_Source"));
}

// package.json
var package_default = {
  name: "rosetta-context",
  version: "1.5.0",
  description: "Agent-first codebase context protocol - AI agents build and share institutional knowledge about codebases",
  main: "dist/index.js",
  bin: {
    rosetta: "./dist/cli/index.js"
  },
  scripts: {
    build: "tsup",
    dev: "tsup --watch",
    start: "node dist/cli/index.js",
    test: "vitest",
    lint: "eslint src/",
    typecheck: "tsc --noEmit"
  },
  keywords: [
    "ai",
    "agents",
    "coding-assistant",
    "documentation",
    "context",
    "claude",
    "claude-code",
    "codex",
    "cursor",
    "aider",
    "copilot",
    "llm",
    "codebase",
    "developer-tools"
  ],
  author: "Christian Johnson <cjohnson@metisos.com>",
  license: "MIT",
  repository: {
    type: "git",
    url: "git+https://github.com/metisos/Rosetta_Open_Source.git"
  },
  bugs: {
    url: "https://github.com/metisos/Rosetta_Open_Source/issues"
  },
  homepage: "https://github.com/metisos/Rosetta_Open_Source#readme",
  engines: {
    node: ">=18.0.0"
  },
  files: [
    "dist",
    "README.md",
    "LICENSE"
  ],
  dependencies: {
    chalk: "^4.1.2",
    commander: "^12.1.0",
    glob: "^10.3.10",
    inquirer: "^8.2.7",
    ora: "^5.4.1",
    yaml: "^2.3.4"
  },
  devDependencies: {
    "@types/inquirer": "^8.2.12",
    "@types/node": "^20.10.0",
    "@typescript-eslint/eslint-plugin": "^7.18.0",
    "@typescript-eslint/parser": "^7.18.0",
    eslint: "^9.13.0",
    tsup: "^8.0.1",
    typescript: "^5.3.2",
    vitest: "^1.0.0"
  }
};

// src/cli/index.ts
var VERSION = package_default.version;
var program = new import_commander.Command();
var banner = [
  "",
  import_chalk11.default.cyanBright("   \u2588\u2580\u2580\u2588 \u2588\u2580\u2580\u2588 \u2588\u2580\u2580 \u2588\u2580\u2580 \u2580\u2580\u2588\u2580\u2580 \u2580\u2580\u2588\u2580\u2580 \u2588\u2580\u2580\u2588"),
  import_chalk11.default.cyan("   \u2588\u2584\u2584\u2580 \u2588  \u2588 \u2580\u2580\u2588 \u2588\u2580\u2580   \u2588     \u2588   \u2588\u2584\u2584\u2588"),
  import_chalk11.default.gray("   \u2588  \u2588 \u2580\u2580\u2580\u2580 \u2580\u2580\u2580 \u2580\u2580\u2580   \u2580     \u2580   \u2588  \u2588"),
  "",
  `   ${import_chalk11.default.gray("Agent Codebase Understanding Protocol")}  ${import_chalk11.default.cyanBright("v" + VERSION)}`,
  ""
].join("\n");
program.name("rosetta").description("Agent codebase understanding protocol - Help AI coding agents understand your codebase").version(VERSION).addHelpText("before", banner).action(() => {
  console.log(banner);
  console.log(import_chalk11.default.cyan("  Quick Start:"));
  console.log();
  console.log("    " + import_chalk11.default.white("rosetta init") + import_chalk11.default.gray("         Interactive setup (AI-assisted or manual)"));
  console.log("    " + import_chalk11.default.white("rosetta sync") + import_chalk11.default.gray("         Update ROSETTA.md from git diffs via AI"));
  console.log("    " + import_chalk11.default.white("rosetta watch") + import_chalk11.default.gray("        Monitor changes and auto-sync"));
  console.log("    " + import_chalk11.default.white("rosetta status") + import_chalk11.default.gray("       Check documentation freshness"));
  console.log("    " + import_chalk11.default.white("rosetta validate") + import_chalk11.default.gray("     Validate Rosetta file structure"));
  console.log();
  console.log(import_chalk11.default.gray("  Run ") + import_chalk11.default.white("rosetta --help") + import_chalk11.default.gray(" for all commands"));
  console.log();
  console.log(import_chalk11.default.gray("  Docs: https://github.com/metisos/Rosetta_Open_Source"));
  console.log();
});
program.command("init").description("Initialize Rosetta in a project (interactive by default)").option("-t, --template <template>", "Use a specific template (minimal, nextjs, python, generic)", "minimal").option("-f, --force", "Overwrite existing Rosetta files").option("-b, --bootstrap", "Output agent instructions to analyze and populate Rosetta").option("-l, --lite", "Lite mode: only create agent configs, no ROSETTA.md (for new projects)").option("--no-interactive", "Skip interactive prompts, use template mode directly").action(async (options) => {
  const isInteractive = process.stdin.isTTY && options.interactive !== false && !options.bootstrap && !options.lite;
  if (isInteractive) {
    console.log(banner);
    await interactiveInit();
  } else {
    await initCommand(options);
  }
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
program.command("setup-agent").description("Configure agent instruction files (CLAUDE.md, .cursorrules, etc.) to use Rosetta").option("-a, --agent <agent>", "Target agent: claude, cursor, aider, or all (default: all)", "all").option("-f, --force", "Overwrite existing Rosetta sections").option("--hooks", "Install Claude Code hooks (auto-enabled for Claude agent)").option("--no-hooks", "Skip Claude Code hooks installation").action(async (options) => {
  await setupAgentCommand(options);
});
program.command("sync").description("Analyze git diffs and update ROSETTA.md using AI").option("-p, --provider <provider>", "AI provider: anthropic, openai, or gemini").option("-m, --model <model>", "Model to use").option("-k, --key <key>", "API key (or set via env var)").option("-s, --since <ref>", "Git ref to diff from (commit, tag, or date)").option("-y, --yes", "Auto-apply without confirmation (non-interactive)").option("-n, --dry-run", "Show proposed changes without applying").action(async (options) => {
  await syncCommand(options);
});
program.command("watch").description("Monitor file changes and periodically sync ROSETTA.md").option("-p, --provider <provider>", "AI provider: anthropic, openai, or gemini").option("-m, --model <model>", "Model to use").option("-k, --key <key>", "API key (or set via env var)").option("-i, --interval <minutes>", "Sync interval in minutes (default: 5)", "5").option("-y, --yes", "Auto-apply updates without confirmation").action(async (options) => {
  await watchCommand(options);
});
program.parse();
//# sourceMappingURL=index.js.map