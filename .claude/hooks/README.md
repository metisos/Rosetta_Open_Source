# Rosetta Claude Code Hooks

These hooks enhance Claude Code sessions when working with Rosetta-enabled projects.

## Hooks Overview

| Hook | Event | Purpose |
|------|-------|---------|
| `session-start.sh` | SessionStart | Reminds Claude to load ROSETTA.md context |
| `prompt-context.sh` | UserPromptSubmit | Adds Rosetta context for exploration questions |
| `post-edit-staleness.sh` | PostToolUse | Checks if ROSETTA.md needs updating after edits |
| `stop-notes-reminder.sh` | Stop | Reminds Claude to update .rosetta/notes.md |

## Hook Details

### session-start.sh

Runs when a Claude Code session starts. It:
- Checks if ROSETTA.md exists in the project
- Displays the Rosetta session checklist
- Shows available module count
- Warns if .rosetta/notes.md is stale (>7 days)

### prompt-context.sh

Runs before processing user prompts. It:
- Detects exploration questions (where, how, what, etc.)
- Adds context reminding Claude about Rosetta resources

### post-edit-staleness.sh

Runs after Write/Edit operations. It:
- Monitors edits to critical files (commands, entry points, configs)
- Warns if ROSETTA.md hasn't been updated in >14 days

### stop-notes-reminder.sh

Runs when Claude is about to stop. It:
- Reminds Claude to append discoveries to .rosetta/notes.md
- Provides the correct format for agent notes
- Allows the stop to proceed (non-blocking)

## Configuration

Hooks are configured in `.claude/settings.json`. The configuration uses `$CLAUDE_PROJECT_DIR` for portability across different project locations.

## Testing Hooks

Test hooks manually:

```bash
# Test session-start
echo '{"cwd": "/path/to/project"}' | CLAUDE_PROJECT_DIR=/path/to/project ./.claude/hooks/session-start.sh

# Test stop-notes-reminder
echo '{"cwd": "/path/to/project"}' | CLAUDE_PROJECT_DIR=/path/to/project ./.claude/hooks/stop-notes-reminder.sh

# Test post-edit-staleness
echo '{"tool_name": "Edit", "tool_input": {"file_path": "src/index.ts"}}' | \
  CLAUDE_PROJECT_DIR=/path/to/project ./.claude/hooks/post-edit-staleness.sh
```

## Adding New Hooks

1. Create a new `.sh` script in this directory
2. Make it executable: `chmod +x hook-name.sh`
3. Add configuration to `.claude/settings.json`
4. Test manually before relying on it

## Environment Variables

Hooks receive:
- `CLAUDE_PROJECT_DIR` - Absolute path to the project root
- JSON input via stdin with session context
