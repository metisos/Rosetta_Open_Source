import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: { 'cli/index': 'src/cli/index.ts' },
    format: ['cjs'],
    target: 'es2020',
    sourcemap: true,
    clean: true,
    shims: true,
    banner: {
      js: '#!/usr/bin/env node',
    },
  },
  {
    entry: { 'index': 'src/index.ts' },
    format: ['cjs'],
    target: 'es2020',
    sourcemap: true,
    dts: true,
    shims: true,
  },
]);
