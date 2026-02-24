# Publishing Guide

## Prerequisites

- Node.js >= 18 or Bun >= 1.0
- NPM account with 2FA enabled
- Access to publish packages (or be a member of the organization)

## NPM Authentication (2FA Required)

Since your NPM account has 2FA enabled, you need to use one of the following methods:

### Method 1: Granular Access Token (Recommended)

1. Go to https://www.npmjs.com/settings/tokens
2. Click "Generate New Token" → "Granular Access Token"
3. Set permissions:
   - **Packages and scopes**: Read and write
   - Select your package or organization
   - **Bypass two-factor authentication**: ✅ Enabled
4. Copy the token

5. Configure locally:
   ```bash
   # Option A: Set via environment variable
   export NPM_TOKEN=your_token_here
   echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc
   
   # Option B: Interactive login
   npm login --auth-type=web
   # Or use the token as password:
   npm login
   # Username: your_username
   # Password: your_granular_token
   ```

### Method 2: Web Login (Interactive)

```bash
npm login --auth-type=web
# Opens browser for authentication
```

### Method 3: Legacy Token (Not Recommended)

1. Generate "Legacy Token" at https://www.npmjs.com/settings/tokens
2. This token has full account access and bypasses 2FA
3. Use with caution

```bash
echo "//registry.npmjs.org/:_authToken=YOUR_LEGACY_TOKEN" > ~/.npmrc
```

## Build and Publish

### Step 1: Clean and Build

```bash
cd /Users/orange/Orange/SomeFun/JoinUs/package

# Clean previous build
rm -rf dist

# Install dependencies
bun install

# Build the package
bun run build
```

### Step 2: Verify Build

```bash
# Check what will be published
npm pack --dry-run
```

Expected output:
- `dist/joinus.mjs` - ESM build
- `dist/joinus.js` - UMD build
- `dist/theme.css` - Styles
- `dist/*.d.ts` - TypeScript declarations
- `README.md`
- `package.json`

### Step 3: Update Version (if needed)

```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major
```

### Step 4: Publish

```bash
# For scoped packages (@username/package)
npm publish --access public

# For unscoped packages
npm publish
```

## Verification

### Check Published Package

```bash
# View package info
npm view @orangelan/joinus-form

# View specific version
npm view @orangelan/joinus-form@1.0.0
```

### Test Installation

```bash
# Create test project
mkdir test-install && cd test-install
npm init -y

# Install from registry
npm install @orangelan/joinus-form

# Verify files exist
ls node_modules/@orangelan/joinus-form/dist
```

## Troubleshooting

### Error: 403 Forbidden - 2FA Required

**Solution**: Use Granular Access Token with "Bypass 2FA" enabled (Method 1 above)

### Error: 401 Unauthorized

**Solution**: 
```bash
npm logout
npm login --auth-type=web
```

### Error: Package name already exists

**Solution**: Update `package.json` with a unique name:
```json
{
  "name": "@your-username/joinus-form"
}
```

### Build warnings about dynamic imports

This is expected and harmless:
```
(!) main.ts is dynamically imported but also statically imported
```

The library works correctly; this is a Vite optimization notice.

## Post-Publish Checklist

- [ ] Package appears on https://www.npmjs.com/package/@orangelan/joinus-form
- [ ] README renders correctly
- [ ] Installation works: `npm install @orangelan/joinus-form`
- [ ] Types are recognized in TypeScript projects
- [ ] CSS import works: `import '@orangelan/joinus-form/style.css'`

## Automation (CI/CD)

For GitHub Actions or other CI:

```yaml
# .github/workflows/publish.yml
name: Publish to NPM

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      - run: bun install
      - run: bun run build
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Set `NPM_TOKEN` in repository secrets (use Granular Access Token).
