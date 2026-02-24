import { resolve } from 'path';
import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import dts from 'vite-plugin-dts';

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'JoinUs',
			fileName: (format) => `joinus.${format === 'es' ? 'mjs' : 'js'}`,
			formats: ['es', 'umd'],
		},
		rollupOptions: {
			// 外部依赖 - 这些不会打包进库，用户需要自行安装
			external: [],
			output: {
				// 全局变量映射（UMD 用）
				globals: {},
				// CSS 文件名
				assetFileNames: (assetInfo) => {
					if (assetInfo.name === 'style.css') return 'joinus.css';
					return assetInfo.name || 'asset[extname]';
				},
			},
		},
		// 是否生成 sourcemap
		sourcemap: true,
		// 清空输出目录
		emptyOutDir: true,
	},
	plugins: [
		cssInjectedByJsPlugin(),
		dts({
			insertTypesEntry: true,
			outDir: 'dist',
			include: ['src/**/*.ts'],
		}),
	],
});
