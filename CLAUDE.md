# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack TypeScript monorepo providing a chat interface for interacting with Aparavi data pipeline webhooks. The application consists of two main components:

- **app/** - Express backend proxy server (port 3001)
- **client/** - React frontend with Vite (port 3000)

The backend acts as a secure proxy between the frontend and the Aparavi webhook API, handling authentication, rate limiting, error handling, and response processing.

## Development Commands

### Root-level Commands
```bash
pnpm install              # Install all dependencies for both workspaces
pnpm dev                  # Start both frontend and backend in development mode
pnpm build                # Build both frontend and backend
pnpm start                # Build and start both services in production mode
pnpm lint                 # Lint all TypeScript/TSX files
pnpm lint:fix             # Auto-fix linting issues
```

### Backend Commands (app/)
```bash
cd app
pnpm dev                  # Start with ts-node-dev (hot reload)
pnpm build                # Compile TypeScript to dist/
pnpm start                # Run compiled production server
pnpm test                 # Run webhook test
pnpm type-check           # Check types without emitting
pnpm lint                 # Lint backend code
```

### Frontend Commands (client/)
```bash
cd client
pnpm dev                  # Start Vite dev server
pnpm build                # Build for production
pnpm preview              # Preview production build
pnpm lint                 # Lint frontend code
```

## Architecture

### Backend Structure (app/)

The backend uses a component-based architecture:

```
app/src/
├── server.ts              # Main Express app with middleware configuration
├── config/index.ts        # Configuration validation and management
├── router/
│   ├── index.ts           # Base router export
│   └── router.ts          # Auto-discovers and imports component routes
├── components/
│   └── chat/
│       ├── routes.ts      # Route definitions for /api/chat
│       └── controller.ts  # ChatController with business logic
├── middleware/
│   └── errorHandler.ts    # Global error handling and AppError class
├── utils/
│   ├── callout.ts         # Promise wrapper returning [error, data]
│   └── extractOutput.ts   # Extracts text from webhook response
├── translations/
│   └── translations.ts    # Error messages and i18n strings
└── types/
    ├── index.ts           # Shared TypeScript types
    └── express.d.ts       # Express type extensions
```

**Key Patterns:**

1. **Component Discovery:** The router automatically imports route files from `components/*/routes.ts` or `routes.js` (in production), allowing new components to be added without modifying the main router.

2. **Error Handling:** Use `AppError` class for throwing errors with status codes. The global error handler in `middleware/errorHandler.ts` processes all errors and returns appropriate responses.

3. **Async Error Handling:** The `callout()` utility returns `[error, data]` tuples, avoiding try-catch blocks:
   ```typescript
   const [error, response] = await callout(axios.put(...));
   if (error) { /* handle error */ }
   ```

4. **Webhook Integration:** The backend makes PUT requests to the Aparavi webhook with the API key in both headers (`Authorization`) and query params (`apikey`). Response structure is `data.objects.{id}.text`.

### Frontend Structure (client/)

```
client/src/
├── pages/
│   └── FilesChatbot.tsx   # Main chat page component
├── components/
│   ├── Header.tsx         # Header with navigation
│   ├── ChatMessage.tsx    # Individual message display
│   ├── InputBox.tsx       # Message input with send button
│   ├── LoadingDots.tsx    # Loading animation
│   ├── HeroBanner.tsx     # Hero section
│   ├── TitleSection.tsx   # Title display
│   └── SuggestedQuestions.tsx  # Quick action buttons
└── types/
    └── index.ts           # TypeScript types
```

**Key Patterns:**

1. **State Management:** The main chat state is managed in `FilesChatbot.tsx` with simple React hooks (no external state library).

2. **API Communication:** All backend requests go through `/api/chat` endpoint. The backend URL is configured via `VITE_API_URL` environment variable.

3. **Message Rendering:** Chat messages support markdown rendering and have distinct styling for user vs assistant messages.

## Environment Configuration

### Backend (.env in app/)
```env
# Required
WEBHOOK_BASE_URL=https://your-aparavi-instance.com/webhook
WEBHOOK_API_KEY=your-api-key-here

# Optional
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000      # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env in client/)
```env
VITE_API_URL=http://localhost:3001
```

**Important:** Vite requires the `VITE_` prefix for environment variables to be exposed to the client.

## Code Style Guidelines

### ESLint Configuration

This project uses a strict TypeScript ESLint configuration (`.eslintrc.json` in root):

- **Indentation:** Tabs (enforced)
- **Quotes:** Single quotes with escape allowance
- **Unused Parameters:** Prefix with underscore (e.g., `_req`, `_res`, `_next`)
- **No Floating Promises:** All promises must be awaited or properly handled
- **Member Ordering:** Private before public, static before instance
- **React Rules:** Applied only to `client/**/*.{ts,tsx}` files

### TypeScript Configuration

**Backend (app/tsconfig.json):**
- Target: ES2022
- Module: CommonJS
- Strict mode enabled
- Compiles `src/` to `dist/`
- No unused locals/parameters allowed

**Frontend (client/tsconfig.json):**
- Target: ES2020
- Module: ESNext
- React JSX enabled
- No emit (Vite handles bundling)

## Adding New Features

### Adding a New Backend Component

1. Create a new directory in `app/src/components/yourComponent/`
2. Create `routes.ts` that imports the base router:
   ```typescript
   import { Router } from 'express';
   import { YourController } from './controller';

   const router: Router = Router();
   const controller = new YourController();

   router.post('/your-endpoint', controller.method.bind(controller));

   export default router;
   ```
3. Create `controller.ts` with your business logic
4. The router will auto-discover and mount it at `/api/your-endpoint`

### Adding Error Messages

Add new error messages to `app/src/translations/translations.ts`:
```typescript
export const t = {
  errors: {
    yourNewError: 'Your error message'
  }
};
```

Then use in controllers:
```typescript
return next(new AppError(t.errors.yourNewError, 400));
```

## Testing

- Backend test command: `pnpm test` in `app/` directory runs `test-webhook.ts`
- No automated test framework is currently configured
- Manual testing: Start dev servers and test via browser at `http://localhost:3000`

## Common Issues

1. **CORS Errors:** Ensure `FRONTEND_URL` in backend .env matches the actual frontend URL. Development mode allows all localhost origins.

2. **Webhook Timeout:** Default timeout is 5 minutes (300000ms), configured in `app/src/config/index.ts`.

3. **Module Resolution:** Backend uses CommonJS (`require`), frontend uses ES modules (`import`). Keep this distinction when adding dependencies.

4. **Type Errors:** Run `pnpm type-check` in respective directories before committing. Unused parameters must be prefixed with underscore.

## Deployment Notes

- Backend can be deployed via Docker (Dockerfile and docker-compose.yml in `app/`)
- Frontend is a static SPA that can be deployed to Vercel, Netlify, or any static host
- Set `NODE_ENV=production` in backend for production builds
- Backend serves compiled JavaScript from `dist/`, not TypeScript files

Below is your complete **CLAUDE.md** — a coding-style specification designed so Claude writes code exactly like you do.

## **Joshua’s Coding Standards for JavaScript & TypeScript Projects**

This document defines how Claude should write code to match Joshua’s personal coding style.
All generated code, tests, comments, structure, naming, and formatting should follow these rules **unless a project’s linter enforces stricter behavior**, in which case the linter prevails.

---

# **1. Core Philosophy**

Claude must write code according to the following mindset:

1. **Code should read like English.**
2. **Avoid clever solutions; prioritize clarity.**
3. **Prefer many small functions over large ones.**
4. **Fail fast — validate early.**
5. **Keep logic clean, simple, and intention-revealing.**
6. **Never repeat yourself (DRY).**
7. **Only add comments where logic is non-obvious — not for things readable via naming.**

---

# **2. Naming Conventions**

### **2.1 Variables**

* Use **descriptive, human-readable names**.
* **Values → nouns**
  Example: `userId`, `accessToken`, `payloadData`
* **Booleans → start with `is` or `isNot`**
  Example: `isAuthenticated`, `isNotValidEmail`
* Avoid abbreviations except universally understood (e.g., `id`, `url`, `db`).

### **2.2 Functions**

* **Function names → verbs or action statements**
  Example: `fetchUserData`, `buildRequestPayload`
* Must clearly express what the function *does*.
* Keep functions small and cohesive.

### **2.3 File Naming**

* Use **camelCase** for all filenames:
  `userService.ts`, `errorHandler.ts`

---

# **3. Formatting & Structure**

If linter rules exist, follow them. If not, Claude should default to:

1. **Use semicolons**
2. **Use tabs**
3. **No trailing commas**
4. **No max line length enforced (but keep lines reasonably readable)**

### **3.1 Imports & Exports**

* **Imports:** Use named or default imports, and keep them alphabetized and grouped.
* **Exports:**

  * Default export when a file has one primary function / class.
  * Named exports for helpers or utilities.

### **3.2 Helper Function Placement**

* If used across multiple files → **move to `/utils`**.
* If used only in the local file → **place helpers at the top of the file**, above the main logic.

---

# **4. Error Handling**

### **4.1 Use Asynchronous Callout Helper**

Claude must *never* write `try/catch` directly.
Instead, it should always use the following pattern:

```ts
/**
 * Resolves promises and handles any success or error cases
 *
 * @param {Promise} promise - Promise to resolve
 *
 * @return {Promise<any>} Promise that resolves a two-element array
 *
 * @example
 *     const [err, data] = await callout(promise);
 */
export async function callout(promise: Promise<any>): Promise<any> {
	return promise.then((data) => [null, data]).catch((err) => [err]);
}
```

### **4.2 Wrapping Errors**

Claude must *always* wrap errors in an Error class:

```ts
const [err, resp] = await callout(SomeService.doThing(value));

if (err) {
	logger.error(err.message);
	throw new APIError('Failed to execute SomeService.doThing', 500);
}
```

### **4.3 Error Class Usage**

Errors should be meaningful and include:

* A human-readable message
* A status code
* Optionally underlying cause if needed

---

# **5. Logging Rules**

Claude should:

* **Never use `console.log`**
* Always use a logger abstraction like:

```ts
logger.info('Starting user registration');
logger.error('Failed to save user');
logger.debug('Payload received', payloadData);
```

Logging should be used liberally for:

* Function entry/exit
* Important branches in logic
* External service calls
* Errors

---

# **6. Asynchronous Patterns**

Claude should:

* Prefer **async/await**
* Use **Promise.all** when beneficial
* Avoid unnecessary `async` functions
* Never mix `.then/.catch` with async/await except inside the `callout` helper

---

# **7. TypeScript Rules**

### **7.1 Object Shapes**

Claude should:

* Always define **types** for object shapes
* Prefer `type` over `interface`
* Use `interface` only when extending / merging is required
* Avoid `any` unless absolutely unavoidable
* Use generics **only when necessary**

### **7.2 Optional Chaining**

* Avoid optional chaining **except** for deep safe-access where explicit checks become noise.

---

# **8. Utilities & File Organization**

### **8.1 Utilities**

* Have a **single `utils` module** for short, generic helpers.
* Put large multi-purpose functionality (logging, encryption, service integrations) in separate files/modules.

### **8.2 Single Responsibility**

Every file should focus on *one clear domain of responsibility*.
Examples:

* `authService.ts`
* `encryption.ts`
* `logger.ts`
* `callout.ts`

---

# **9. Comments, Documentation, and JSDoc**

### **9.1 JSDoc Requirement**

Every **exported function** must include a JSDoc block in this format:

```ts
/**
 * Description of what this function does.
 *
 * @param {type} paramNameOne - Description of value passed
 * @param {type} paramNameTwo - Description of value passed
 *
 * @return {object} Description of the value returned.
 *
 * @example
 *     await functionName(paramNameOne, paramNameTwo);
 */
```

### **9.2 Logic Comments**

* Use comments only when logic is genuinely non-obvious.
* Clear naming should make comments unnecessary.

### **9.3 README Snippets**

Add README entries only for:

* Environment variables
* Deployment steps
* Development setup
* Module usage

---

# **10. Tests**

Claude must automatically generate tests for all meaningful functions.

### **10.1 Testing Style**

* Use **describe → context → it** structure
* Use **sinon** for stubbing external calls
* Use **supertest + chai** for HTTP endpoints

### **10.2 Test Philosophy**

* Small, focused tests
* Stub network, file, database, or external services
* Do not test libraries — only your logic
* Validate both success and error paths

---

# **11. Additional Guidance**

### Claude must always:

* Prefer explicit code over magic
* Use early returns to simplify logic
* Keep functions pure unless side effects are necessary
* Keep business logic isolated from infrastructure
* Use meaningful variable names instead of comments

### Claude must never:

* Use console.log
* Use try/catch unless wrapping the callout helper
* Use optional chaining everywhere
* Write overly clever or concise “smart” code
* Allow repeated logic without extracting a helper

---

# **12. Summary Rule**

**Claude should always generate code that Joshua himself would be comfortable maintaining long-term: clean, explicit, descriptive, stable, and very easy for a human to understand at a glance.**

---

# **CLAUDE.md**

