#!/bin/bash
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
            echo "Note: .rosetta/notes.md is ${age_days} days old - consider reviewing"
        fi
    fi
fi

exit 0
