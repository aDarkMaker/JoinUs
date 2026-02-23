export interface Question {
	id: string;
	type: 'text' | 'tel' | 'email' | 'select' | 'textarea' | 'file';
	label: string;
	required?: boolean;
	placeholder?: string;
	icon?: string;
	options?: string[];
	rows?: number;
	accept?: string;
	multiple?: boolean;
}

export interface FormConfig {
	title: string;
	subtitle?: string;
	welcome?: string;
	theme?: string;
	questions: Question[];
	submit?: { label?: string; successMessage?: string; url?: string };
}

const defaultQuestion: Partial<Question> = { required: false };

function createField(q: Question): HTMLElement {
	const field = document.createElement('div');
	field.className = 'joinus-field';

	const label = document.createElement('label');
	label.className = 'joinus-label';
	label.innerHTML = `<div class="joinus-label-decor"></div>`;
	const labelText = document.createTextNode(q.label + (q.required ? '' : ''));
	label.appendChild(labelText);
	field.appendChild(label);

	const required = q.required ?? false;
	if (required) label.classList.add('required');

	let control: HTMLElement;
	const icon = q.icon ?? 'ri-edit-line';
	const ph = q.placeholder ?? '';

	switch (q.type) {
		case 'text':
		case 'tel':
		case 'email': {
			const wrap = document.createElement('div');
			wrap.className = 'joinus-input-wrap';
			const input = document.createElement('input');
			input.type = q.type;
			input.name = q.id;
			input.placeholder = ph;
			if (required) input.required = true;
			wrap.innerHTML = `<i class="${icon} joinus-input-icon"></i>`;
			wrap.appendChild(input);
			control = wrap;
			break;
		}
		case 'select': {
			const wrap = document.createElement('div');
			wrap.className = 'joinus-input-wrap joinus-select-custom';
			wrap.dataset.select = '';
			const hidden = document.createElement('input');
			hidden.type = 'hidden';
			hidden.name = q.id;
			if (required) hidden.required = true;
			const trigger = document.createElement('button');
			trigger.type = 'button';
			trigger.className = 'joinus-select-trigger';
			trigger.setAttribute('aria-expanded', 'false');
			trigger.setAttribute('aria-haspopup', 'listbox');
			trigger.innerHTML = `<i class="${icon} joinus-input-icon"></i>
				<span class="joinus-select-value placeholder">${ph}</span>
				<i class="ri-arrow-down-s-line joinus-select-arrow"></i>`;
			const dropdown = document.createElement('div');
			dropdown.className = 'joinus-select-dropdown';
			dropdown.setAttribute('role', 'listbox');
			const opts = (q.options ?? []).map((o, i) => {
				const div = document.createElement('div');
				div.className = 'joinus-select-option';
				div.setAttribute('data-value', String(i));
				div.setAttribute('role', 'option');
				div.textContent = o;
				return div;
			});
			dropdown.append(...opts);
			wrap.appendChild(hidden);
			wrap.appendChild(trigger);
			wrap.appendChild(dropdown);
			control = wrap;
			break;
		}
		case 'textarea': {
			const ta = document.createElement('textarea');
			ta.name = q.id;
			ta.placeholder = ph;
			ta.rows = q.rows ?? 5;
			if (required) ta.required = true;
			control = ta;
			break;
		}
		case 'file': {
			const wrap = document.createElement('div');
			wrap.className = 'joinus-file-wrap';
			const input = document.createElement('input');
			input.type = 'file';
			input.name = q.id;
			input.accept = q.accept ?? '*';
			if (q.multiple) input.multiple = true;
			if (required) input.required = true;
			const btn = document.createElement('label');
			btn.className = 'joinus-file-trigger';
			btn.innerHTML = `<i class="${icon} joinus-file-icon"></i>
				<span class="joinus-file-text">${ph}</span>`;
			btn.htmlFor = input.id || `joinus-file-${q.id}`;
			if (!input.id) input.id = `joinus-file-${q.id}`;
			const hint = document.createElement('div');
			hint.className = 'joinus-file-hint';
			wrap.appendChild(input);
			wrap.appendChild(btn);
			wrap.appendChild(hint);
			control = wrap;
			break;
		}
		default:
			control = document.createElement('div');
	}

	field.appendChild(control);
	return field;
}

function initSelect(wrap: HTMLElement): void {
	const trigger = wrap.querySelector('.joinus-select-trigger');
	const valueEl = wrap.querySelector('.joinus-select-value');
	const hidden = wrap.querySelector<HTMLInputElement>('input[type="hidden"]');
	const options = wrap.querySelectorAll('.joinus-select-option');
	const dropdown = wrap.querySelector('.joinus-select-dropdown');
	if (!trigger || !valueEl || !hidden || !dropdown) return;

	trigger.addEventListener('click', (e) => {
		e.preventDefault();
		wrap.classList.toggle('is-open');
	});

	options.forEach((opt) => {
		opt.addEventListener('click', () => {
			const v = opt.getAttribute('data-value') ?? '';
			const text = opt.textContent ?? '';
			hidden.value = text;
			valueEl.textContent = text;
			valueEl.classList.remove('placeholder');
			wrap.classList.remove('is-open');
			hidden.dispatchEvent(new Event('change', { bubbles: true }));
		});
	});

	document.addEventListener('click', (e) => {
		if (!wrap.contains(e.target as Node)) wrap.classList.remove('is-open');
	});
}

function initFile(wrap: HTMLElement): void {
	const input = wrap.querySelector<HTMLInputElement>('input[type="file"]');
	const hint = wrap.querySelector('.joinus-file-hint');
	if (!input || !hint) return;

	input.addEventListener('change', () => {
		const files = input.files;
		if (!files?.length) {
			hint.textContent = '点击选择文件';
			return;
		}
		const names = Array.from(files)
			.map((f) => f.name)
			.join(', ');
		hint.textContent = names.length > 40 ? names.slice(0, 40) + '...' : names;
	});
}

export function renderForm(container: HTMLElement, config: FormConfig): void {
	const form = document.createElement('form');
	form.action = config.submit?.url ?? '#';
	form.method = 'POST';
	form.enctype = 'multipart/form-data';
	form.onsubmit = (e) => e.preventDefault();

	for (const q of config.questions) {
		const field = createField({ ...defaultQuestion, ...q } as Question);
		form.appendChild(field);

		const selectWrap = field.querySelector<HTMLElement>('[data-select]');
		if (selectWrap) initSelect(selectWrap);

		const fileWrap = field.querySelector<HTMLElement>('.joinus-file-wrap');
		if (fileWrap) initFile(fileWrap);
	}

	const btn = document.createElement('button');
	btn.type = 'submit';
	btn.className = 'joinus-btn';
	btn.innerHTML = `<span>${config.submit?.label ?? '立即提交'}</span><i class="ri-arrow-right-line"></i>`;
	form.appendChild(btn);

	form.addEventListener('submit', async () => {
		const data = new FormData(form);
		const url = config.submit?.url;
		if (url) {
			try {
				const r = await fetch(url, { method: 'POST', body: data });
				if (r.ok) alert(config.submit?.successMessage ?? '提交成功');
				else throw new Error(String(r.status));
			} catch (e) {
				alert('提交失败: ' + (e instanceof Error ? e.message : String(e)));
			}
		} else {
			const obj: Record<string, unknown> = {};
			data.forEach((v, k) => {
				if (obj[k] === undefined) obj[k] = v;
				else if (Array.isArray(obj[k])) (obj[k] as unknown[]).push(v);
				else obj[k] = [obj[k], v];
			});
			console.log('form data:', obj);
			alert(config.submit?.successMessage ?? '提交成功');
		}
	});

	container.appendChild(form);
}
