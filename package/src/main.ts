import { applyTheme, themes, themeYellow } from './config.js';
import { renderForm, type FormConfig } from './form.js';

/**
 * Initialize JoinUs page from .joinus-root element
 */
export default async function initPage(): Promise<void> {
	const root = document.querySelector('.joinus-root') as HTMLElement | null;
	if (!root) {
		console.error('[JoinUs] .joinus-root element not found');
		return;
	}

	const configUrl = root.dataset.configUrl;
	if (!configUrl) {
		console.error('[JoinUs] data-config-url is required on .joinus-root');
		return;
	}

	try {
		const res = await fetch(configUrl);
		if (!res.ok) {
			throw new Error(`Failed to load config: ${res.status}`);
		}
		const config: FormConfig = await res.json();

		const themeName = root.dataset.theme || new URLSearchParams(location.search).get('theme') || config.theme || 'yellow';
		applyTheme(root, themes[themeName] ?? themeYellow);

		const titleEl = document.getElementById('joinus-title');
		const subtitleEl = document.getElementById('joinus-subtitle');
		const welcomeEl = document.getElementById('joinus-welcome');
		if (titleEl) titleEl.textContent = config.title;
		if (subtitleEl) subtitleEl.textContent = config.subtitle ?? 'JOIN US';
		if (welcomeEl) welcomeEl.innerHTML = (config.welcome ?? '').replace(/\n/g, '<br />');

		const formContainer = document.getElementById('joinus-form-container');
		if (formContainer) {
			renderForm(formContainer, config);
		} else {
			console.error('[JoinUs] #joinus-form-container not found');
		}
	} catch (error) {
		console.error('[JoinUs] Failed to initialize:', error);
	}
}

if (typeof window !== 'undefined') {
	const currentScript = document.currentScript;
	if (currentScript instanceof HTMLScriptElement && import.meta.url === currentScript.src) {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', initPage);
		} else {
			initPage();
		}
	}
}
