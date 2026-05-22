# Netboost Pro - Complete Development & Deployment Guide

This is a production-ready **Vite + React + TypeScript** application with Tailwind CSS, Shadcn/ui, and integrated Blink SDK support.

## Features

- ✅ **Modern Stack**: Vite 7, React 19, TypeScript 5.9, Tailwind CSS
- ✅ **UI Components**: Shadcn/ui + Radix UI pre-configured
- ✅ **3D Rendering**: Three.js + React Three Fiber ready
- ✅ **Form Handling**: React Hook Form + Zod validation
- ✅ **Routing**: React Router v7 configured
- ✅ **Dark Mode**: Next Themes support
- ✅ **Backend Integration**: Blink SDK pre-configured
- ✅ **CSS Variable Detection**: Automatic validation of Tailwind CSS variables
- ✅ **Enhanced Linting**: ESLint, Stylelint, TypeScript type checking
- ✅ **Docker Ready**: Multi-stage Dockerfile + docker-compose
- ✅ **CI/CD Pipeline**: GitHub Actions workflow

## Quick Start

### Prerequisites
- Node.js 20+ (LTS recommended)
- npm or yarn
- Docker (for containerization)

### Development

```bash
# Install dependencies
npm install

# Start development server (localhost:3000)
npm run dev

# Run all linting checks
npm run lint

# Run individual checks
npm run lint:types     # TypeScript
npm run lint:js        # ESLint
npm run lint:css       # Stylelint
npm run check:css-vars # CSS variables
```

### Environment Variables

Create a `.env.local` file:

```bash
VITE_BLINK_PROJECT_ID=your_project_id
VITE_BLINK_PUBLISHABLE_KEY=your_publishable_key
```

See `.env.example` for all available variables.

## Build & Deployment

### Production Build

```bash
npm run build
npm run preview  # Test production build locally
```

### Docker Deployment

**Build:**
```bash
docker build -t netboost-pro:latest .
```

**Run:**
```bash
docker run -p 3000:3000 \
  -e VITE_BLINK_PROJECT_ID=your_project_id \
  -e VITE_BLINK_PUBLISHABLE_KEY=your_key \
  netboost-pro:latest
```

**Or with docker-compose:**
```bash
# Create .env file with your Blink SDK credentials
docker-compose up
```

### Deployment Platforms

#### Vercel (Recommended for Vite + React)

1. Push your code to GitHub
2. Import repository in [Vercel Dashboard](https://vercel.com)
3. Configure environment variables:
   - `VITE_BLINK_PROJECT_ID`
   - `VITE_BLINK_PUBLISHABLE_KEY`
4. Deploy with `npm run build` as build command

#### Netlify

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables
5. Deploy

#### AWS (S3 + CloudFront)

1. Build: `npm run build`
2. Upload `dist/` to S3
3. Create CloudFront distribution
4. Configure domain

#### DigitalOcean / Self-Hosted

1. Use Docker image or deploy Node.js app directly
2. Set environment variables
3. Configure reverse proxy (nginx/Apache)
4. Set up SSL certificate (Let's Encrypt)

## Project Structure

```
src/
├── components/      # React components (Shadcn/ui)
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
├── App.tsx         # Main app component
├── main.tsx        # Entry point
├── index.css       # Global styles + CSS variables
└── App.css         # App styles

public/            # Static files
dist/              # Build output (generated)
scripts/           # Custom validation scripts
.github/workflows/ # CI/CD pipelines
```

## Quality Assurance

### Linting

All checks pass automatically:

```bash
✅ TypeScript type checking
✅ ESLint (code quality)
✅ Stylelint (CSS linting)
✅ CSS variable validation
✅ CSS class validation
```

### Pre-commit Hooks (Optional)

Install Husky for automatic linting on commit:

```bash
npm install husky lint-staged --save-dev
npx husky install
```

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) runs on every push:

1. **Linting Phase**: Type check, ESLint, Stylelint
2. **Build Phase**: Compile and optimize
3. **Docker Build**: Create container image
4. **Deployment** (main branch only): Deploy to production

## Troubleshooting

### Build fails with "Cannot find module"

```bash
npm install
npm run build
```

### ESLint errors

```bash
npm run lint:js
```

### CSS variable errors

```bash
npm run check:css-vars
# Add missing variables to src/index.css
```

### Development server won't start

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Performance

- **Bundle Size**: ~65 KB gzipped (JavaScript)
- **CSS Size**: ~11 KB gzipped (Tailwind CSS)
- **Build Time**: ~2.3 seconds
- **Dev Server**: Hot Module Replacement (HMR) enabled

## Security

- ⚠️ Never commit `.env.local` — use `.env.example` for documentation
- 🔐 Always use platform's secrets management for credentials
- 📦 Regular dependency audits: `npm audit`
- 🛡️ Enable Dependabot for automated security updates

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and run: `npm run lint`
3. Commit with meaningful message
4. Push and create Pull Request
5. CI/CD pipeline validates automatically

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_BLINK_PROJECT_ID` | Blink SDK project ID | `netboost-speed-app-ldcgpv7i` |
| `VITE_BLINK_PUBLISHABLE_KEY` | Blink SDK publishable key | `blnk_pk_...` |

## Support & Documentation

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/ui](https://ui.shadcn.com)
- [Blink SDK](https://blinkdotnew.com/docs)

## License

See LICENSE file for details.

---

**Last Updated**: 2026-05-22  
**Status**: ✅ Production Ready
