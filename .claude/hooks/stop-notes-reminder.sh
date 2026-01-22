#!/bin/bash
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

# Extract stop reason from input
stop_reason=$(echo "$input" | jq -r '.stop_hook_reason // empty' 2>/dev/null)

# Check if the transcript indicates significant work was done
transcript_path=$(echo "$input" | jq -r '.transcript_path // empty' 2>/dev/null)

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
