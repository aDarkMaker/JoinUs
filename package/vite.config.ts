import { resolve } from 'path';
import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import dts from 'vite-plugin-dts';

export default defineConfig({
	publicDir: 'public',
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'JoinUs',
			fileName: (format) => `joinus.${format === 'es' ? 'mjs' : 'js'}`,
			formats: ['es', 'umd'],
		},
		rollupOptions: {
			external: [],
			output: {
				globals: {},
			},
		},
		sourcemap: true,
		emptyOutDir: true,
		cssCodeSplit: false,
	},
	plugins: [
		cssInjectedByJsPlugin({
			styleId: 'joinus-styles',
		}),
		dts({
			insertTypesEntry: true,
			outDir: 'dist',
			include: ['src/**/*.ts'],
		}),
	],
});
