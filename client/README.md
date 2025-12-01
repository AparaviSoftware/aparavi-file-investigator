# Aparavi Pipeline Chat Frontend

A clean, Claude-like chat interface for your Aparavi data pipeline.

## Features

- 💬 Clean, modern chat interface
- 📎 File upload support
- ⚡ Real-time message updates
- 📱 Responsive design
- 🎨 Claude-inspired UI
- ⌨️ Keyboard shortcuts (Enter to send, Shift+Enter for new line)
- ✨ Markdown support for responses
- 🔄 Loading states and error handling

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Backend server running on port 3001

## Quick Start

### 1. Install pnpm (if needed)
```bash
npm install -g pnpm
# or
corepack enable
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env if your backend is on a different URL
```

### 4. Start Development Server
```bash
pnpm dev
```

The app will open at `http://localhost:3000`

### 5. Build for Production
```bash
pnpm build
pnpm preview
```

## Project Structure
```
src/
├── components/          # React components
│   ├── ChatMessage.tsx  # Message bubble
│   ├── ChatInput.tsx    # Input area
│   ├── FileUpload.tsx   # File upload button
│   └── LoadingDots.tsx  # Loading animation
├── services/
│   └── api.ts          # API client
├── types/
│   └── index.ts        # TypeScript types
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Run ESLint |
| `pnpm type-check` | Check TypeScript types |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| VITE_API_URL | http://localhost:3001 | Backend API URL |

## Usage

### Sending Messages
- Type your message in the input box
- Press Enter to send (Shift+Enter for new line)
- Or click the send button

### Uploading Files
- Click the upload button (📎)
- Select a file
- The file will be processed through your pipeline

## Customization

### Changing Colors
Edit the CSS variables in your component styles:
- User messages: `.avatar-user` background
- Assistant messages: `.avatar-assistant` background
- Send button: `.send-button` background

### Changing API URL
Update the `.env` file:
```bash
VITE_API_URL=https://your-api-url.com
```

## Deployment

### Vercel
```bash
pnpm build
# Deploy dist/ folder to Vercel
```

### Netlify
```bash
pnpm build
# Deploy dist/ folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine as build
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Troubleshooting

**CORS errors**
- Make sure your backend has CORS configured for your frontend URL
- Check the FRONTEND_URL in your backend's .env

**Connection errors**
- Verify backend is running on port 3001
- Check VITE_API_URL in frontend .env

**File upload fails**
- Check file size limits (backend defaults to 100MB)
- Verify Content-Type headers are being sent

## License

MIT