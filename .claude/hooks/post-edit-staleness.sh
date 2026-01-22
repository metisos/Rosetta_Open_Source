#!/bin/bash
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
    "*/cli/commands/*"     # New commands
    "*/index.ts"           # Entry points
    "package.json"         # Dependencies
    "tsconfig.json"        # TypeScript config
    "*/utils/*"            # Utilities
)

is_critical=false
for pattern in "${critical_patterns[@]}"; do
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
            echo "Note: ROSETTA.md last updated ${age_days} days ago. Consider updating if architecture changed."
        fi
    fi
fi

exit 0
