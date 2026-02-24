/**
 * Markdown structure parsing utilities for Rosetta files
 */
interface RosettaSection {
    name: string;
    level: number;
    content: string;
    startLine: number;
    endLine: number;
}
interface RosettaMetadata {
    version?: string;
    lastUpdated?: string;
    lastVerified?: string;
    paths?: string[];
}
interface ParsedRosetta {
    sections: RosettaSection[];
    metadata: RosettaMetadata;
    rawContent: string;
}
/**
 * Required sections in ROSETTA.md
 */
declare const REQUIRED_SECTIONS: string[];
/**
 * Required sections in module files
 */
declare const REQUIRED_MODULE_SECTIONS: string[];
/**
 * Parse a Rosetta markdown file into sections
 */
declare function parseRosettaFile(content: string): ParsedRosetta;
/**
 * Check if all required sections are present
 */
declare function validateSections(parsed: ParsedRosetta, requiredSections: string[]): {
    valid: boolean;
    missing: string[];
    found: string[];
};
/**
 * Parse the Module Index table from ROSETTA.md
 */
declare function parseModuleIndex(content: string): Array<{
    module: string;
    path: string;
    description: string;
    loadWhen: string;
}>;
/**
 * Extract agent notes from a Rosetta file
 */
declare function parseAgentNotes(content: string): Array<{
    date: string;
    agent: string;
    notes: string[];
}>;

/**
 * Template loading and rendering utilities
 * Templates are embedded directly for reliable distribution
 */
interface TemplateVars {
    [key: string]: string;
}
/**
 * Load a template
 */
declare function loadTemplate(templateName: string): string;
/**
 * Render a template with variables
 */
declare function renderTemplate(template: string, vars: TemplateVars): string;
/**
 * Load and render a template in one step
 */
declare function loadAndRenderTemplate(templateName: string, vars?: TemplateVars): string;
/**
 * Available templates
 */
declare const TEMPLATES: {
    readonly ROSETTA_MINIMAL: "ROSETTA-minimal.md";
    readonly MODULE: "module.md";
    readonly NOTES: "notes.md";
    readonly CONFIG: "config.yml";
    readonly BOOTSTRAP: "bootstrap-prompt.md";
    readonly AGENT_CONFIG_CLAUDE: "agent-config-claude.md";
    readonly AGENT_CONFIG_CURSOR: "agent-config-cursor.md";
    readonly AGENT_CONFIG_AIDER: "agent-config-aider.yml";
    readonly CLAUDE_HOOKS_SETTINGS: "claude-hooks-settings.json";
    readonly CLAUDE_HOOK_SESSION_START: "claude-hook-session-start.sh";
    readonly CLAUDE_HOOK_PROMPT_CONTEXT: "claude-hook-prompt-context.sh";
    readonly CLAUDE_HOOK_POST_EDIT_STALENESS: "claude-hook-post-edit-staleness.sh";
    readonly CLAUDE_HOOK_STOP_NOTES_REMINDER: "claude-hook-stop-notes-reminder.sh";
};

/**
 * Git integration utilities
 */
/**
 * Check if a directory is a git repository
 */
declare function isGitRepo(dir: string): boolean;
/**
 * Get the last modified date of a file from git
 */
declare function getLastModified(filePath: string): Date | null;
/**
 * Get files modified since a specific date
 */
declare function getFilesModifiedSince(dir: string, since: Date, patterns?: string[]): string[];
/**
 * Get the root of the git repository
 */
declare function getGitRoot(dir: string): string | null;

/**
 * AI Provider abstraction for Rosetta
 * Uses native fetch (Node 18+) to call Anthropic, OpenAI, and Gemini APIs
 */
interface AIProvider {
    name: string;
    displayName: string;
    models: AIModel[];
    generateRosetta(opts: GenerateOptions): Promise<string>;
}
interface AIModel {
    id: string;
    label: string;
    recommended?: boolean;
}
interface GenerateOptions {
    apiKey: string;
    model: string;
    systemPrompt: string;
    userPrompt: string;
}
declare const PROVIDERS: Record<string, AIProvider>;
declare function getProvider(name: string): AIProvider;

/**
 * Codebase analyzer for AI-assisted Rosetta initialization
 * Gathers project context and sends it to the selected AI provider
 */

interface AnalyzeOptions {
    cwd: string;
    provider: AIProvider;
    apiKey: string;
    model: string;
    onStatus?: (msg: string) => void;
}
/**
 * Run the full AI-assisted analysis
 */
declare function analyzeCodebase(opts: AnalyzeOptions): Promise<string>;

/**
 * Rosetta - Agent Codebase Understanding Protocol
 *
 * Programmatic API for integrating Rosetta into coding agents
 */

/**
 * Agent Loading Protocol
 *
 * When integrating Rosetta into a coding agent, follow this protocol:
 *
 * 1. On session start:
 *    - Read ROSETTA.md first (always)
 *    - Review the Module Index table
 *    - Load relevant module files from .rosetta/modules/
 *    - Check .rosetta/notes.md for recent learnings
 *
 * 2. During work:
 *    - Refer to Conventions and Key Patterns when writing code
 *    - Check Gotchas before modifying unfamiliar areas
 *
 * 3. Before session end:
 *    - If you discovered something valuable, append to .rosetta/notes.md
 *    - Format: ### YYYY-MM-DD | [agent-name]
 *    - Keep entries concise and actionable
 */
declare const ROSETTA_PROTOCOL: {
    ROOT_FILE: string;
    MODULES_DIR: string;
    NOTES_FILE: string;
    CONFIG_FILE: string;
};

export { type AIModel, type AIProvider, type GenerateOptions, PROVIDERS, type ParsedRosetta, REQUIRED_MODULE_SECTIONS, REQUIRED_SECTIONS, ROSETTA_PROTOCOL, type RosettaMetadata, type RosettaSection, TEMPLATES, analyzeCodebase, getFilesModifiedSince, getGitRoot, getLastModified, getProvider, isGitRepo, loadAndRenderTemplate, loadTemplate, parseAgentNotes, parseModuleIndex, parseRosettaFile, renderTemplate, validateSections };
