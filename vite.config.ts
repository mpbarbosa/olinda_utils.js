import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'OlindaUtils',
			formats: ['es', 'cjs'],
			fileName: (format) => (format === 'es' ? 'index.mjs' : 'index.cjs'),
		},
		outDir: 'dist/vite',
		sourcemap: true,
		emptyOutDir: true,
		rollupOptions: {
			external: ['fs', 'path', 'os'],
		},
	},
	plugins: [
		dts({
			rollupTypes: true,
			insertTypesEntry: true,
		}),
	],
});
