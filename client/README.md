# Aparavi Pipeline Chat Frontend

React + TypeScript + Vite frontend providing a chat interface for interacting with Aparavi data pipelines.

## Features

- **Chat Interface**: Clean, intuitive messaging UI
- **Markdown Support**: Renders formatted responses
- **Real-time Interaction**: Communicates with backend API
- **TypeScript**: Full type safety
- **Vite HMR**: Instant hot module replacement
- **Responsive Design**: Works on desktop and mobile

## Prerequisites

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **pnpm** >= 8.0.0 ([Install guide](https://pnpm.io/installation))

## Development Setup

### 1. Install Dependencies

```bash
cd client
pnpm install
```

### 2. Configure Environment

Create a `.env` file in the `client/` directory:

```env
# For Express backend
VITE_BACKEND_TYPE=express
VITE_API_URL=http://localhost:3001

# For Lambda backend
# VITE_BACKEND_TYPE=lambda
# VITE_LAMBDA_URL=https://your-function-url.lambda-url.us-east-1.on.aws
```

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_BACKEND_TYPE` | No | `express` | Backend type: `express` or `lambda` |
| `VITE_API_URL` | No | `http://localhost:3001` | Express backend URL |
| `VITE_LAMBDA_URL` | No | - | Lambda function URL (when using Lambda) |

**Note**: All environment variables must be prefixed with `VITE_` to be exposed to the client.

### 3. Start Development Server

```bash
pnpm dev
```

The app will start on `http://localhost:3000` with hot module replacement enabled.

### Other Development Commands

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint

# Preview production build locally
pnpm preview
```

## Production Deployment

### Build

```bash
pnpm build
```

This creates optimized production files in the `dist/` directory.

### Deployment Options

The frontend is a static single-page application (SPA) that can be deployed to any static hosting service.

#### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd client
pnpm build
vercel --prod
```

Or connect your repository to [Vercel](https://vercel.com) for automatic deployments.

#### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd client
pnpm build
netlify deploy --prod --dir=dist
```

Or drag and drop the `dist/` folder to [Netlify Drop](https://app.netlify.com/drop).

#### AWS S3 + CloudFront

```bash
# Build the project
pnpm build

# Upload to S3 bucket
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache (if using)
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

#### Nginx

```bash
# Build the project
pnpm build

# Copy to nginx html directory
sudo cp -r dist/* /usr/share/nginx/html/

# Restart nginx
sudo systemctl restart nginx
```

**Nginx configuration** (`/etc/nginx/sites-available/default`):
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /usr/share/nginx/html;
    index index.html;

    # SPA routing - always serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Docker

```dockerfile
# Dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
docker build -t aparavi-frontend .
docker run -p 80:80 aparavi-frontend
```

### Environment Variables for Production

Update your production environment variables before building:

```env
# For Express backend
VITE_BACKEND_TYPE=express
VITE_API_URL=https://your-backend-domain.com

# For Lambda backend
# VITE_BACKEND_TYPE=lambda
# VITE_LAMBDA_URL=https://your-function-url.lambda-url.us-east-1.on.aws
```

**Important**: Environment variables are baked into the build at build time, so you must rebuild if they change.

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── About.tsx          # About page component
│   │   ├── ChatInput.tsx      # Message input component
│   │   ├── ChatMessage.tsx    # Message display component
│   │   └── LoadingDots.tsx    # Loading animation
│   ├── pages/
│   │   └── FilesChatbot.tsx   # Main chat page
│   ├── services/
│   │   └── api.ts             # API client for backend
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   ├── App.tsx                # Main app component & routing
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles
├── public/                     # Static assets
├── dist/                       # Production build (generated)
├── index.html                  # HTML template
├── package.json
├── vite.config.ts              # Vite configuration
└── tsconfig.json               # TypeScript configuration
```

## Backend Configuration

The frontend can work with two backend types:

### Express Backend (Default)

```env
VITE_BACKEND_TYPE=express
VITE_API_URL=http://localhost:3001
```

See [app/README.md](../app/README.md) for backend setup.

### Lambda Backend

```env
VITE_BACKEND_TYPE=lambda
VITE_LAMBDA_URL=https://your-function-url.lambda-url.us-east-1.on.aws
```

See [lambda/README.md](../lambda/README.md) for Lambda deployment.

## Troubleshooting

### Backend Connection Issues

**Error**: Failed to fetch / Network error

**Solution**:
1. Verify backend is running (Express on port 3001 or Lambda function is deployed)
2. Check `VITE_API_URL` or `VITE_LAMBDA_URL` in `.env`
3. Check CORS configuration on backend
4. Open browser DevTools Network tab to see exact error

### Environment Variables Not Working

**Error**: Environment variables are undefined

**Solution**:
1. Ensure variables are prefixed with `VITE_`
2. Restart dev server after changing `.env`
3. For production, rebuild the app (`pnpm build`)

### Build Errors

**Error**: TypeScript compilation errors

**Solution**:
```bash
# Check for type errors
pnpm type-check

# Clear cache and rebuild
rm -rf node_modules dist
pnpm install
pnpm build
```

### Port Already in Use

**Error**: Port 3000 is already in use

**Solution**:
Change the port in `vite.config.ts`:
```ts
export default defineConfig({
  server: {
    port: 3001  // Change to desired port
  }
})
```

## Development Tips

- Use React DevTools for component debugging
- Check browser console for errors
- Use `pnpm type-check` to catch type errors early
- Hot reload should work automatically - if not, restart dev server
- Follow coding standards in [CLAUDE.md](../CLAUDE.md)

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **React Markdown** - Markdown rendering
- **Axios** - HTTP client

## License

MIT
