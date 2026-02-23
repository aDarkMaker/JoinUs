import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
	build: {
		lib: {
			entry: 'src/index.ts',
			name: 'JoinUs',
			fileName: 'joinus',
			formats: ['umd', 'es'],
		},
		rollupOptions: {
			output: {
				assetFileNames: 'joinus.[ext]',
			},
		},
	},
	plugins: [cssInjectedByJsPlugin()],
});
