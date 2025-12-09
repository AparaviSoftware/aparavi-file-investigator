# **CLAUDE.md**

This file provides guidance to Claude Code (claude.ai/code) when working in this repository. It also defines the coding style, architectural expectations, error-handling patterns, test requirements, and development rules that Claude must follow to match the Aparavi development team coding standards.

---

# **1. Project Overview**

This is a full-stack TypeScript monorepo that provides a chat interface for interacting with Aparavi data pipeline webhooks.

The two main components are:

* **app/** — Express backend proxy server (port 3001)
* **client/** — React frontend using Vite (port 3000)

The backend acts as a secure proxy between the frontend and Aparavi webhook APIs, handling authentication, rate limiting, validation, and error processing. The frontend provides a chat UI for interacting with processed webhook responses.

---

# **2. Development Commands**

## **Root**

```bash
pnpm install
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm lint:fix
```

## **Backend (app/)**

```bash
cd app
pnpm dev
pnpm build
pnpm start
pnpm test
pnpm type-check
pnpm lint
```

## **Frontend (client/)**

```bash
cd client
pnpm dev
pnpm build
pnpm preview
pnpm lint
```

---

# **3. Architecture**

## **Backend (app/src/)**

```
├── server.ts
├── config/
├── router/
│   ├── index.ts
│   └── router.ts          # Auto-discovers component routes
├── components/
│   └── chat/
│       ├── routes.ts
│       └── controller.ts
├── middleware/
│   └── errorHandler.ts
├── utils/
│   ├── callout.ts
│   └── extractOutput.ts
├── translations/
└── types/
```

### **Backend Key Patterns**

1. **Component Discovery:** `router.ts` automatically loads all `components/*/routes.ts` files.
2. **Error Handling:** Uses a central `AppError` class + global handler.
3. **Async Handling:** The `callout()` utility wraps promises into `[error, data]`.
4. **Webhook Integration:** PUT requests include the API key in both header and query param; relevant text is extracted via utilities.

## **Frontend (client/src/)**

```
├── pages/
│   └── FilesChatbot.tsx
├── components/
├── types/
```

### **Frontend Key Patterns**

* State managed with React hooks
* Backend communication through `/api/chat`
* Markdown-enabled chat display

---

# **4. Environment Configuration**

## **Backend `.env`**

```env
WEBHOOK_BASE_URL=
WEBHOOK_API_KEY=
PORT=3001
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## **Frontend `.env`**

```env
VITE_API_URL=http://localhost:3001
```

---

# **5. Coding Style & Standards**

These rules override all defaults unless a stricter project linter applies.

## **5.1 Core Philosophy**

* Code should read like English
* Prioritize clarity over cleverness
* Small, focused functions
* Avoid repetition (DRY)
* Fail fast — validate early
* Logic should be explicit, descriptive, and intention-revealing

---

# **5.2 Naming Conventions**

### **Variables**

* Descriptive nouns for values: `userId`, `authToken`
* Booleans start with: `is`, `isNot`
* No unnecessary abbreviations

### **Functions**

* Use verbs or action statements: `fetchUser`, `extractPayload`
* Describe exactly what they do

### **Files**

* Use **camelCase**: `userService.ts`, `errorHandler.ts`

---

# **5.3 Formatting Rules**

If linter rules don’t apply, Claude defaults to:

* Semicolons
* Tabs for indentation
* No trailing commas
* Reasonable line lengths
* Imports alphabetized and grouped
* Default export for the primary file function, otherwise named exports

---

# **5.4 Helper Function Placement**

* If used across multiple files → move to `/utils`.
* If only used locally → define **at the top of the file**.

---

# **6. Error Handling Rules**

## **6.1 Never Write try/catch**

Claude must use the `callout()` helper:

```ts
export async function callout(promise: Promise<any>): Promise<any> {
	return promise.then((data) => [null, data]).catch((err) => [err]);
}
```

## **6.2 Always Wrap Errors in an Error Class**

Example:

```ts
const [err, resp] = await callout(UserService.register(payload));

if (err) {
	logger.error(err.message);
	throw new AppError('Failed to register user', 500);
}
```

## **6.3 Logging**

* Never use `console.log`
* Always use the logger abstraction
* Log as much as needed: function entry/exit, important branches, external calls, and all errors

---

# **7. Async & Promise Rules**

* Prefer async/await
* `Promise.all` acceptable when appropriate
* Avoid unnecessary `async` functions
* No `.then/.catch` except internally inside `callout()`

---

# **8. TypeScript Rules**

* Always define object types
* Prefer `type`, use `interface` only when extending
* Avoid `any` unless truly unavoidable
* Use generics only when necessary
* Avoid optional chaining except for deep safe-access

---

# **9. Utilities & Structure**

* Use a single `utils` module for small generic helpers
* Larger domains get their own files (`logger.ts`, `encryption.ts`)
* Follow single-responsibility principles in every module

---

# **10. Comments & Documentation**

## **10.1 JSDoc Required for Every Exported Function**

Use this structure:

```ts
/**
 * Description
 *
 * @param {type} name - description
 * @return {type} description
 *
 * @example
 *     await functionName(a, b)
 */
```

## **10.2 Comments Only for Complex Logic**

Clear naming should minimize comment usage.

## **10.3 README Updates**

Add snippets only when environment variables, deployment rules, or usage patterns change.

---

# **11. Testing Requirements**

## **11.1 Every New Function Must Have Tests**

* Use `describe → context → it`
* Stub external calls with sinon
* For endpoints, use supertest

## **11.2 For Every Code Change**

> **You must run unit tests and fix any failing test or broken logic before completing the change.**

Claude must enforce this rule when writing instructions, code, or reviewing changes.

## **11.3 Test Philosophy**

* Tests should be small and focused
* Validate both success and error paths
* Do not test external libraries
* All mocks/stubs must be explicit

---

# **12. Adding New Backend Components**

1. Create a new folder under `app/src/components/yourComponent/`
2. Add a `routes.ts` that exports an Express router
3. Add a `controller.ts` with your business logic
4. The router auto-discovers and mounts it at `/api/yourComponent`

---

# **13. Deployment Notes**

* Backend runs on Node with compiled `dist/` output
* Frontend is a static Vite-built SPA
* Backend can be deployed via Docker
* Production builds require `NODE_ENV=production`

---

# **14. Summary Rule**

**Claude must always write code as if the Aparavi development team  will maintain it for years: clean, explicit, predictable, type-safe, and readable.**

