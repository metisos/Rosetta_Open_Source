/**
 * AI configuration resolution
 * Resolves provider/model/key from: CLI flags > env vars > config.yml > interactive prompts
 */

import fs from 'fs';
import path from 'path';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { PROVIDERS, getProvider, type AIProvider } from './providers';

export interface AIConfig {
  provider: AIProvider;
  model: string;
  apiKey: string;
}

export interface AIConfigFlags {
  provider?: string;
  model?: string;
  key?: string;
}

interface RosettaYamlConfig {
  version?: number;
  ai?: {
    provider?: string;
    model?: string;
  };
  [key: string]: unknown;
}

const ENV_KEY_MAP: Record<string, string> = {
  anthropic: 'ANTHROPIC_API_KEY',
  openai: 'OPENAI_API_KEY',
  gemini: 'GEMINI_API_KEY',
};

/**
 * Read AI config from .rosetta/config.yml
 */
export function readConfigFile(cwd: string): RosettaYamlConfig | null {
  const configPath = path.join(cwd, '.rosetta', 'config.yml');
  if (!fs.existsSync(configPath)) return null;
  try {
    const raw = fs.readFileSync(configPath, 'utf-8');
    return parseYaml(raw) as RosettaYamlConfig;
  } catch {
    return null;
  }
}

/**
 * Save AI provider/model to .rosetta/config.yml (never saves the key)
 */
export function saveProviderToConfig(cwd: string, providerName: string, model: string): void {
  const configPath = path.join(cwd, '.rosetta', 'config.yml');
  let config: RosettaYamlConfig = { version: 1 };

  if (fs.existsSync(configPath)) {
    try {
      const raw = fs.readFileSync(configPath, 'utf-8');
      config = (parseYaml(raw) as RosettaYamlConfig) || { version: 1 };
    } catch {
      // use default
    }
  }

  config.ai = { provider: providerName, model };

  const dir = path.dirname(configPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(configPath, stringifyYaml(config), 'utf-8');
}

/**
 * Resolve API key from: flag > provider-specific env > generic env
 */
export function resolveApiKey(providerName: string, flagKey?: string): string | null {
  if (flagKey) return flagKey;

  // Provider-specific env var
  const envName = ENV_KEY_MAP[providerName];
  if (envName && process.env[envName]) {
    return process.env[envName]!;
  }

  // Generic env var
  if (process.env.ROSETTA_API_KEY) {
    return process.env.ROSETTA_API_KEY;
  }

  return null;
}

/**
 * Resolve full AI config non-interactively from flags + env + config file.
 * Returns null for any field that can't be resolved.
 */
export function resolveConfigNonInteractive(cwd: string, flags: AIConfigFlags): {
  provider: AIProvider | null;
  model: string | null;
  apiKey: string | null;
  providerName: string | null;
} {
  const fileConfig = readConfigFile(cwd);

  // Resolve provider: flag > env > config file
  const providerName = flags.provider
    || process.env.ROSETTA_PROVIDER
    || fileConfig?.ai?.provider
    || null;

  let provider: AIProvider | null = null;
  if (providerName && PROVIDERS[providerName]) {
    provider = getProvider(providerName);
  }

  // Resolve model: flag > config file > provider default
  const model = flags.model
    || fileConfig?.ai?.model
    || (provider ? provider.models.find(m => m.recommended)?.id || provider.models[0].id : null);

  // Resolve API key
  const apiKey = resolveApiKey(providerName || '', flags.key);

  return { provider, model, apiKey, providerName };
}

/**
 * Resolve full AI config with interactive prompts as fallback.
 * Only prompts for missing values when running in a TTY.
 */
export async function resolveConfigInteractive(cwd: string, flags: AIConfigFlags): Promise<AIConfig> {
  const inquirer = await import('inquirer');
  const resolved = resolveConfigNonInteractive(cwd, flags);

  let provider = resolved.provider;
  let providerName = resolved.providerName;
  let model = resolved.model;
  let apiKey = resolved.apiKey;

  // Prompt for provider if missing
  if (!provider) {
    const providerChoices = Object.values(PROVIDERS).map(p => ({
      name: p.displayName,
      value: p.name,
    }));

    const answer = await inquirer.default.prompt([{
      type: 'list',
      name: 'providerName',
      message: 'Which AI provider?',
      choices: providerChoices,
    }]);
    providerName = answer.providerName;
    provider = getProvider(providerName!);
  }

  // Prompt for model if missing
  if (!model) {
    const modelChoices = provider!.models.map(m => ({
      name: m.label,
      value: m.id,
    }));

    const answer = await inquirer.default.prompt([{
      type: 'list',
      name: 'model',
      message: 'Which model?',
      choices: modelChoices,
    }]);
    model = answer.model;
  }

  // Prompt for API key if missing
  if (!apiKey) {
    const answer = await inquirer.default.prompt([{
      type: 'password',
      name: 'apiKey',
      message: `Enter your ${provider!.displayName} API key:`,
      mask: '*',
      validate: (input: string) => input.trim().length > 0 || 'API key is required',
    }]);
    apiKey = answer.apiKey.trim();
  }

  // Save provider/model preference (not the key)
  saveProviderToConfig(cwd, providerName!, model!);

  return { provider: provider!, model: model!, apiKey: apiKey! };
}
