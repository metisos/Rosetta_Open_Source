#!/bin/bash
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

for keyword in "${exploration_keywords[@]}"; do
    if echo "$user_prompt" | grep -qi "\b$keyword\b"; then
        is_exploration=true
        break
    fi
done

# If it's an exploration question, remind about Rosetta
if [ "$is_exploration" = true ]; then
    # Check if ROSETTA.md was likely already read (heuristic: check session transcript)
    transcript=$(echo "$input" | jq -r '.transcript_path // empty' 2>/dev/null)

    # Provide context as additional info
    context=$(cat << 'EOF'
{
  "additionalContext": "This project uses Rosetta Protocol. ROSETTA.md contains project context including architecture, conventions, gotchas, and module index. Check .rosetta/notes.md for recent agent discoveries."
}
EOF
)
    echo "$context"
fi

exit 0
