/**
 * AI Provider abstraction for Rosetta
 * Uses native fetch (Node 18+) to call Anthropic, OpenAI, and Gemini APIs
 */

export interface AIProvider {
  name: string;
  displayName: string;
  models: AIModel[];
  generateRosetta(opts: GenerateOptions): Promise<string>;
}

export interface AIModel {
  id: string;
  label: string;
  recommended?: boolean;
}

export interface GenerateOptions {
  apiKey: string;
  model: string;
  systemPrompt: string;
  userPrompt: string;
}

// --- Anthropic ---

const ANTHROPIC_MODELS: AIModel[] = [
  { id: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4 (recommended)', recommended: true },
  { id: 'claude-opus-4-20250514', label: 'Claude Opus 4' },
  { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5' },
];

async function anthropicGenerate(opts: GenerateOptions): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': opts.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: opts.model,
      max_tokens: 8192,
      system: opts.systemPrompt,
      messages: [{ role: 'user', content: opts.userPrompt }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Anthropic API error (${res.status}): ${body}`);
  }

  const data = await res.json() as {
    content: Array<{ type: string; text?: string }>;
  };
  const textBlock = data.content.find((b) => b.type === 'text');
  if (!textBlock?.text) {
    throw new Error('Anthropic returned no text content');
  }
  return textBlock.text;
}

// --- OpenAI ---

const OPENAI_MODELS: AIModel[] = [
  { id: 'gpt-4o', label: 'GPT-4o (recommended)', recommended: true },
  { id: 'gpt-4o-mini', label: 'GPT-4o Mini' },
  { id: 'o3-mini', label: 'o3-mini' },
];

async function openaiGenerate(opts: GenerateOptions): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${opts.apiKey}`,
    },
    body: JSON.stringify({
      model: opts.model,
      max_tokens: 8192,
      messages: [
        { role: 'system', content: opts.systemPrompt },
        { role: 'user', content: opts.userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${body}`);
  }

  const data = await res.json() as {
    choices: Array<{ message: { content: string } }>;
  };
  if (!data.choices?.[0]?.message?.content) {
    throw new Error('OpenAI returned no content');
  }
  return data.choices[0].message.content;
}

// --- Google Gemini ---

const GEMINI_MODELS: AIModel[] = [
  { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash (recommended)', recommended: true },
  { id: 'gemini-2.0-pro', label: 'Gemini 2.0 Pro' },
  { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
];

async function geminiGenerate(opts: GenerateOptions): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${opts.model}:generateContent?key=${opts.apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: opts.systemPrompt }] },
      contents: [{ parts: [{ text: opts.userPrompt }] }],
      generationConfig: { maxOutputTokens: 8192 },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${body}`);
  }

  const data = await res.json() as {
    candidates: Array<{ content: { parts: Array<{ text: string }> } }>;
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini returned no content');
  }
  return text;
}

// --- Provider registry ---

export const PROVIDERS: Record<string, AIProvider> = {
  anthropic: {
    name: 'anthropic',
    displayName: 'Anthropic (Claude)',
    models: ANTHROPIC_MODELS,
    generateRosetta: anthropicGenerate,
  },
  openai: {
    name: 'openai',
    displayName: 'OpenAI (GPT)',
    models: OPENAI_MODELS,
    generateRosetta: openaiGenerate,
  },
  gemini: {
    name: 'gemini',
    displayName: 'Google (Gemini)',
    models: GEMINI_MODELS,
    generateRosetta: geminiGenerate,
  },
};

export function getProvider(name: string): AIProvider {
  const provider = PROVIDERS[name];
  if (!provider) {
    throw new Error(`Unknown provider: ${name}. Available: ${Object.keys(PROVIDERS).join(', ')}`);
  }
  return provider;
}
