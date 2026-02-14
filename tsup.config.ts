import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/extended.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
});
