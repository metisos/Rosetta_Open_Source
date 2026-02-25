/**
 * Template loading and rendering utilities
 * Templates are embedded directly for reliable distribution
 */

export interface TemplateVars {
  [key: string]: string;
}

/**
 * Embedded templates
 */
const EMBEDDED_TEMPLATES: Record<string, string> = {
  'ROSETTA-minimal.md': `# Rosetta

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
├── [directory]/   # [purpose]
└── [directory]/   # [purpose]
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

  'module.md': `# Module: {{name}}

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
[Input] → [Process] → [Output]
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

  'notes.md': `# Agent Notes

Learnings from AI coding agents working in this codebase. Humans review periodically and promote valuable insights to ROSETTA.md or module files.

## Review Status

- Last human review: {{DATE}}
- Entries since last review: 0

---

<!-- AGENTS: Append new entries below. Do not edit existing entries. -->
<!-- Format: ### YYYY-MM-DD | agent-name -->
`,

  'config.yml': `# Rosetta Configuration
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

  'bootstrap-prompt.md': `## Task: Initialize Rosetta for This Codebase

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

  'agent-config-claude.md': `## Rosetta Protocol

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
├── New/empty project with no patterns yet → WAIT
│   └── Just start working, create ROSETTA.md later
│
└── Project has substance → CREATE ROSETTA.md now
    Triggers:
    • First feature/module is complete
    • Directory structure is established
    • You've discovered a non-obvious gotcha
    • Patterns are starting to emerge
\`\`\`

To create: Run \`rosetta init\` OR analyze the codebase and create ROSETTA.md manually.
See: https://github.com/metisos/Rosetta_Open_Source
`,

  'agent-config-cursor.md': `## Rosetta Protocol

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
- New/empty project → Wait until patterns emerge, then create it
- Established project → Create ROSETTA.md by analyzing the codebase
- Triggers: first feature done, directory structure set, gotcha discovered

See: https://github.com/metisos/Rosetta_Open_Source
`,

  'agent-config-aider.yml': `# Rosetta Protocol - Auto-load context files
read:
  - ROSETTA.md
  - .rosetta/notes.md
`,

  // Claude Code Hooks
  'claude-hooks-settings.json': `{
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

  'claude-hook-session-start.sh': `#!/bin/bash
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

  'claude-hook-prompt-context.sh': `#!/bin/bash
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

  'claude-hook-post-edit-staleness.sh': `#!/bin/bash
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

  'claude-hook-stop-notes-reminder.sh': `#!/bin/bash
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
`,
};

/**
 * Load a template
 */
export function loadTemplate(templateName: string): string {
  const template = EMBEDDED_TEMPLATES[templateName];
  if (!template) {
    throw new Error(`Template not found: ${templateName}`);
  }
  return template;
}

/**
 * Render a template with variables
 */
export function renderTemplate(template: string, vars: TemplateVars): string {
  let rendered = template;

  // Replace {{DATE}} with current date
  const today = new Date().toISOString().split('T')[0];
  rendered = rendered.replace(/\{\{DATE\}\}/g, today);

  // Replace other variables
  for (const [key, value] of Object.entries(vars)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    rendered = rendered.replace(regex, value);
  }

  return rendered;
}

/**
 * Load and render a template in one step
 */
export function loadAndRenderTemplate(templateName: string, vars: TemplateVars = {}): string {
  const template = loadTemplate(templateName);
  return renderTemplate(template, vars);
}

/**
 * Available templates
 */
export const TEMPLATES = {
  ROSETTA_MINIMAL: 'ROSETTA-minimal.md',
  MODULE: 'module.md',
  NOTES: 'notes.md',
  CONFIG: 'config.yml',
  BOOTSTRAP: 'bootstrap-prompt.md',
  AGENT_CONFIG_CLAUDE: 'agent-config-claude.md',
  AGENT_CONFIG_CURSOR: 'agent-config-cursor.md',
  AGENT_CONFIG_AIDER: 'agent-config-aider.yml',
  CLAUDE_HOOKS_SETTINGS: 'claude-hooks-settings.json',
  CLAUDE_HOOK_SESSION_START: 'claude-hook-session-start.sh',
  CLAUDE_HOOK_PROMPT_CONTEXT: 'claude-hook-prompt-context.sh',
  CLAUDE_HOOK_POST_EDIT_STALENESS: 'claude-hook-post-edit-staleness.sh',
  CLAUDE_HOOK_STOP_NOTES_REMINDER: 'claude-hook-stop-notes-reminder.sh',
} as const;

/**
 * Claude hooks file definitions for easy iteration
 */
export const CLAUDE_HOOKS_FILES = [
  { name: 'rosetta-session-start.sh', template: 'claude-hook-session-start.sh' },
  { name: 'rosetta-prompt-context.sh', template: 'claude-hook-prompt-context.sh' },
  { name: 'rosetta-post-edit-staleness.sh', template: 'claude-hook-post-edit-staleness.sh' },
  { name: 'rosetta-stop-notes-reminder.sh', template: 'claude-hook-stop-notes-reminder.sh' },
] as const;
