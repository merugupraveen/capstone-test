# Playwright Cucumber Framework (UI + API)

Single repository test framework using Playwright + Cucumber BDD for both UI and API automation.

## Tech stack

- TypeScript
- Cucumber (`@cucumber/cucumber`)
- Playwright (browser + API request context)

## Project structure

```text
src/
	api/clients/           # API client wrappers
	config/                # Environment configuration
	support/               # Cucumber world + hooks
	ui/pages/              # Base and sample page objects
	utils/                 # Shared assertions and helpers
tests/
	api/
		features/            # API .feature files
		steps/               # API step definitions
	ui/
		features/            # UI .feature files
		steps/               # UI step definitions
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Install Playwright browsers:

```bash
npx playwright install
```

3. Copy env template if you need custom URLs:

```bash
cp .env.example .env
```

For Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

## Run tests

Run type check:

```bash
npm run typecheck
```

Run UI BDD tests:

```bash
npm run test:ui
```

Run API BDD tests:

```bash
npm run test:api
```

Run both:

```bash
npm test
```

Run smoke tests only:

```bash
npm run test:smoke
```

Run regression tests only:

```bash
npm run test:regression
```

Run suite-level tags:

```bash
npm run test:ui:smoke
npm run test:ui:regression
npm run test:api:smoke
npm run test:api:regression
```

## API auth and schema validation

- Optional bearer token support is available through `API_AUTH_TOKEN`.
- Auth header helper: `src/api/auth/authHeaders.ts`
- Schema validator helper: `src/utils/schemaValidator.ts`
- Sample schema: `src/api/schemas/postSchema.ts`

## Sample tests included

- UI: validates heading on `http://localhost:8080/`
- API: validates `GET /posts/1` on `https://jsonplaceholder.typicode.com`