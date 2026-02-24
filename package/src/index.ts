import '../public/theme.css';

function ensureRemixIcon(): void {
	if (typeof document === 'undefined') return;
	const id = 'joinus-remixicon';
	if (document.getElementById(id)) return;
	try {
		const base = import.meta.url.replace(/\/[^/]+$/, '');
		const link = document.createElement('link');
		link.id = id;
		link.rel = 'stylesheet';
		link.href = `${base}/remixicon/remixicon.css`;
		document.head.appendChild(link);
	} catch {}
}

export { renderForm } from './form.js';
export type { FormConfig, Question, ShowWhen } from './form.js';

export { applyTheme, themes, themeYellow } from './config.js';
export type { ThemeConfig } from './config.js';

export { default as initPage } from './main.js';

/**
 * Auto-init when .joinus-root exists in DOM
 */
export function autoInit(): void {
	if (typeof document !== 'undefined') {
		const root = document.querySelector('.joinus-root') as HTMLElement | null;
		if (root) {
			import('./main.js').then(({ default: init }) => init()).catch(console.error);
		}
	}
}

if (typeof window !== 'undefined') {
	ensureRemixIcon();
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', autoInit);
	} else {
		autoInit();
	}
}
