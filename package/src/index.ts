// JoinUs Form Library - 招新报名表单组件库

// 核心表单渲染
export { renderForm } from './form.js';
export type { FormConfig, Question, ShowWhen } from './form.js';

// 主题配置
export { applyTheme, themes, themeYellow } from './config.js';
export type { ThemeConfig } from './config.js';

// 完整页面初始化（向后兼容，可直接使用）
export { default as initPage } from './main.js';

/**
 * 快速初始化 - 根据 DOM 自动初始化
 * 适用于直接引入 JS 文件的场景
 */
export function autoInit(): void {
	if (typeof document !== 'undefined') {
		const root = document.querySelector('.joinus-root') as HTMLElement | null;
		if (root) {
			import('./main.js').then(({ default: init }) => init()).catch(console.error);
		}
	}
}

// 如果直接引入，自动初始化
if (typeof window !== 'undefined') {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', autoInit);
	} else {
		autoInit();
	}
}
