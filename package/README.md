# @orangelan/joinus-form

[![npm version](https://img.shields.io/npm/v/@orangelan/joinus-form.svg)](https://www.npmjs.com/package/@orangelan/joinus-form)
[![license](https://img.shields.io/npm/l/@orangelan/joinus-form.svg)](https://github.com/orangelan/joinus-form/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@orangelan/joinus-form)](https://bundlephobia.com/package/@orangelan/joinus-form)

> Lightweight, customizable recruitment form component for clubs and teams

JoinUs Form is a zero-dependency (runtime) form rendering library that turns a simple JSON configuration into a beautiful, functional recruitment form. Features include multi-step forms, conditional fields, file uploads, duplicate detection, and a built-in optional backend.

## Features

- **JSON-driven** - Define your entire form in a single JSON file
- **Themeable** - Multiple built-in themes with CSS custom properties
- **File uploads** - Native multipart form support with progress indication
- **Lightweight** - Small bundle size, no runtime dependencies
- **Duplicate detection** - Prevents duplicate submissions by name/contact
- **Submission overwrite** - Update existing submissions seamlessly
- **Export to Excel** - Backend supports CSV/Excel export
- **TypeScript** - Full TypeScript support with declaration files

## Installation

```bash
# npm
npm install @orangelan/joinus-form

# yarn
yarn add @orangelan/joinus-form

# pnpm
pnpm add @orangelan/joinus-form

# bun
bun add @orangelan/joinus-form
```

## Quick Start

### ESM / Modern Bundlers

```typescript
import { initPage } from '@orangelan/joinus-form';
import '@orangelan/joinus-form/style.css';

// Auto-initialize from /form.json
initPage();
```

### UMD / Browser

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/@orangelan/joinus-form@latest/dist/theme.css">
</head>
<body>
  <div id="joinus"></div>
  <script type="module">
    import { renderForm } from 'https://unpkg.com/@orangelan/joinus-form@latest/dist/joinus.mjs';
    
    renderForm('#joinus', {
      title: 'Join Our Club',
      description: 'Apply to become a member',
      questions: [
        {
          id: 'name',
          type: 'text',
          label: 'Full Name',
          required: true
        },
        {
          id: 'email',
          type: 'text',
          label: 'Email',
          inputType: 'email',
          required: true
        },
        {
          id: 'why',
          type: 'textarea',
          label: 'Why do you want to join?',
          rows: 4,
          required: true
        }
      ],
      submit: {
        url: '/api/submit',
        method: 'POST'
      }
    });
  </script>
</body>
</html>
```

### With Custom Configuration

```typescript
import { renderForm } from '@orangelan/joinus-form';
import '@orangelan/joinus-form/style.css';

const config = {
  title: '2024 Club Recruitment',
  description: 'Welcome! Please fill out the form below.',
  theme: 'yellow',
  questions: [
    // ... your questions
  ],
  submit: {
    url: '/api/submit',
    method: 'POST',
    contentType: 'multipart/form-data'
  }
};

renderForm('#app', config);
```

## Configuration (form.json)

The form is configured via a JSON file with the following structure:

```json
{
  "title": "Recruitment Form 2024",
  "description": "Join our amazing club!",
  "theme": "yellow",
  "questions": [
    {
      "id": "name",
      "type": "text",
      "label": "Full Name",
      "placeholder": "Enter your name",
      "required": true,
      "col": "1-2"
    },
    {
      "id": "contact",
      "type": "text",
      "label": "Phone Number",
      "inputType": "tel",
      "required": true,
      "col": "1-2"
    },
    {
      "id": "interests",
      "type": "radio",
      "label": "Area of Interest",
      "options": [
        "Development",
        "Design",
        "Marketing"
      ],
      "required": true
    },
    {
      "id": "portfolio",
      "type": "file",
      "label": "Portfolio (PDF/Images)",
      "accept": ".pdf,.jpg,.png",
      "multiple": true,
      "showWhen": {
        "interests": ["Development", "Design"]
      }
    }
  ],
  "submit": {
    "url": "/api/submit",
    "method": "POST",
    "contentType": "multipart/form-data"
  }
}
```

### Question Types

| Type | Description | Additional Properties |
|------|-------------|----------------------|
| `text` | Single-line text input | `inputType`, `placeholder`, `col` |
| `textarea` | Multi-line text input | `rows`, `placeholder` |
| `radio` | Single-choice options | `options` (array) |
| `checkbox` | Multiple-choice options | `options` (array) |
| `select` | Dropdown selection | `options` (array) |
| `file` | File upload | `accept`, `multiple`, `maxSize` |
| `date` | Date picker | - |
| `datetime` | Date and time picker | - |
| `time` | Time picker | - |
| `gap` | Section divider | `margin` |

### Conditional Fields (`showWhen`)

Show or hide fields based on other field values:

```json
{
  "id": "experience",
  "type": "textarea",
  "label": "Previous Experience",
  "showWhen": {
    "role": ["Senior", "Lead"]
  }
}
```

## API Reference

### `renderForm(container, config)`

Renders a form into the specified container.

```typescript
function renderForm(
  container: string | HTMLElement,
  config: FormConfig
): void;
```

**Parameters:**
- `container` - CSS selector string or HTMLElement
- `config` - Form configuration object (see Configuration)

### `initPage()`

Auto-initializes the form by fetching `/form.json` and rendering to `#joinus`.

```typescript
function initPage(): Promise<void>;
```

### `autoInit()`

Alias for `initPage()`. Called automatically when loaded via `<script src>`.

### `applyTheme(theme)`

Applies a theme to the form.

```typescript
function applyTheme(theme: ThemeConfig | string): void;
```

**Parameters:**
- `theme` - Theme name ('yellow') or custom ThemeConfig object

### Types

```typescript
interface FormConfig {
  title?: string;
  description?: string;
  theme?: string | ThemeConfig;
  questions: Question[];
  submit?: {
    url?: string;
    method?: 'GET' | 'POST';
    contentType?: string;
    successMessage?: string;
    export?: {
      endpoint?: string;
      filename?: string;
    };
  };
}

interface Question {
  id: string;
  type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'select' | 'file' | 'date' | 'datetime' | 'time' | 'gap';
  label?: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  accept?: string;
  multiple?: boolean;
  rows?: number;
  col?: string;
  inputType?: string;
  margin?: number;
  showWhen?: Record<string, string[]>;
}

interface ThemeConfig {
  palette: number[];
  containerBg: string;
  pageBg: string;
  formMaxWidth: string;
  formPadding: string;
  radius: string;
}
```

## Backend (Optional)

The package includes an optional Bun-based backend for form submission handling.

### Features

- JSON file storage (no database required)
- Automatic duplicate detection by name/contact
- File upload handling with unique folders per submission
- Excel/CSV export endpoint
- Overwrite existing submissions

### Quick Start (Backend)

```bash
# In your project
bun add @orangelan/joinus-form

# Create server script
# server.ts
import { serve } from '@orangelan/joinus-form/server';

serve({
  port: 3001,
  dataDir: './data'
});
```

See [Server Documentation](./server/README.md) for detailed backend configuration.

## Themes

### Built-in Themes

**Yellow Theme (default):**
```typescript
import { themeYellow, applyTheme } from '@orangelan/joinus-form';

applyTheme('yellow');
// or
applyTheme(themeYellow);
```

### Custom Themes

```typescript
import { applyTheme } from '@orangelan/joinus-form';

applyTheme({
  palette: [0xff5733, 0xc70039, 0x900c3f, 0x581845],
  containerBg: '#ffffff',
  pageBg: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  formMaxWidth: '800px',
  formPadding: '32px',
  radius: '12px'
});
```

CSS custom properties are also available for fine-grained styling:

```css
.joinus-form {
  --ju-primary: #ff5733;
  --ju-radius: 16px;
  --ju-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

## Browser Support

- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- iOS Safari 13+
- Chrome Android 80+

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT © [orangelan](https://github.com/orangelan)

---

<div align="center">
  <sub>Built with ❤️ for clubs and teams everywhere</sub>
</div>
