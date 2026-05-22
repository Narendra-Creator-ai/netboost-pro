# Deployment Guide - Netboost Pro

Complete step-by-step guide to deploy Netboost Pro to production.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Choose Your Platform](#choose-your-platform)
3. [Platform-Specific Deployments](#platform-specific-deployments)
4. [Post-Deployment](#post-deployment)
5. [Monitoring & Maintenance](#monitoring--maintenance)

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All tests pass: `npm run build` succeeds
- [ ] Linting passes: `npm run lint` has no errors
- [ ] Environment variables are configured for production
- [ ] `.env.local` is **NOT** committed to git
- [ ] Git repository is clean: `git status` shows no uncommitted changes
- [ ] Latest code is on `main` branch

### Environment Setup

```bash
# Copy .env.example to .env.production
cp .env.example .env.production

# Edit with production values
nano .env.production
```

**Required variables:**
- `VITE_BLINK_PROJECT_ID` - Your production Blink SDK project ID
- `VITE_BLINK_PUBLISHABLE_KEY` - Your production Blink SDK key

## Choose Your Platform

| Platform | Best For | Difficulty | Cost | Setup Time |
|----------|----------|-----------|------|-----------|
| **Vercel** | Vite + React apps | Easy | Free tier available | 5 mins |
| **Netlify** | Static sites + functions | Easy | Free tier available | 10 mins |
| **AWS (S3+CF)** | Enterprise scale | Medium | Pay as you go | 20 mins |
| **DigitalOcean** | Self-hosted VPS | Medium | $5/month+ | 30 mins |
| **Docker** | Any platform | Medium | Varies | 15 mins |

**Recommendation**: **Vercel** for fastest setup and seamless Vite integration.

---

## Platform-Specific Deployments

### Vercel (Recommended)

**Pros:**
- ✅ Zero-config Vite support
- ✅ Free tier with generous limits
- ✅ Automatic deployments on git push
- ✅ Built-in SSL/HTTPS
- ✅ Global CDN

**Steps:**

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Vite + React

3. **Configure Environment**
   - Project Settings → Environment Variables
   - Add `VITE_BLINK_PROJECT_ID`
   - Add `VITE_BLINK_PUBLISHABLE_KEY`

4. **Deploy**
   - Vercel auto-deploys on `main` branch push
   - Production URL: `https://your-project.vercel.app`

**Custom Domain:**
- Settings → Domains
- Add your custom domain
- Update DNS records per Vercel instructions

---

### Netlify

**Pros:**
- ✅ Free tier with generous build minutes
- ✅ Easy deployment via UI
- ✅ Built-in CDN
- ✅ Form handling support

**Steps:**

1. **Create `netlify.toml`**
   ```toml
   [build]
   command = "npm run build"
   publish = "dist"

   [env.production]
   variables = { NODE_ENV = "production" }
   ```

2. **Push to GitHub**
   ```bash
   git add netlify.toml
   git commit -m "Add Netlify config"
   git push origin main
   ```

3. **Deploy via Netlify UI**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

4. **Add Environment Variables**
   - Site Settings → Build & Deploy → Environment
   - Add `VITE_BLINK_PROJECT_ID`
   - Add `VITE_BLINK_PUBLISHABLE_KEY`

5. **Deploy**
   - Click "Deploy site"
   - Production URL: `https://your-site.netlify.app`

---

### AWS (S3 + CloudFront)

**Pros:**
- ✅ Enterprise-grade infrastructure
- ✅ Highly scalable
- ✅ Pay only for what you use
- ✅ Complete control

**Steps:**

1. **Build locally**
   ```bash
   npm run build
   # Output in dist/
   ```

2. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://netboost-pro-prod --region us-east-1
   ```

3. **Enable Static Website Hosting**
   - S3 Console → Bucket → Properties → Static website hosting
   - Index: `index.html`
   - Error: `index.html` (for SPA routing)

4. **Upload Build Files**
   ```bash
   aws s3 sync dist/ s3://netboost-pro-prod --delete
   ```

5. **Create CloudFront Distribution**
   - S3 → Distribution → Create
   - Origin: Your S3 bucket
   - Viewer Protocol Policy: Redirect to HTTPS
   - Default Root Object: `index.html`

6. **Cache Configuration**
   - CloudFront → Behavior → Edit
   - Cache Policy: CachingOptimized (1 year)
   - Origin Request Policy: CORS-S3Origin

7. **Custom Domain (Optional)**
   - Route53 → Hosted Zone
   - Create ALIAS record pointing to CloudFront

---

### DigitalOcean (Docker)

**Pros:**
- ✅ Simple VPS with Docker support
- ✅ Affordable ($5/month)
- ✅ Full control
- ✅ Good documentation

**Steps:**

1. **Create Droplet**
   - Size: Basic ($5/month minimum)
   - Image: Ubuntu 24.04 LTS
   - Region: Choose closest to users

2. **SSH into Droplet**
   ```bash
   ssh root@your-droplet-ip
   ```

3. **Install Docker**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   ```

4. **Clone Repository**
   ```bash
   cd /root
   git clone https://github.com/your-username/netboost-pro.git
   cd netboost-pro
   ```

5. **Create Production `.env`**
   ```bash
   cat > .env.production << EOF
   VITE_BLINK_PROJECT_ID=your_production_id
   VITE_BLINK_PUBLISHABLE_KEY=your_production_key
   EOF
   ```

6. **Build and Deploy**
   ```bash
   docker build -t netboost-pro:latest .
   docker run -d -p 80:3000 \
     --name netboost-app \
     --restart always \
     --env-file .env.production \
     netboost-pro:latest
   ```

7. **Setup Nginx Reverse Proxy**
   ```bash
   sudo apt update && sudo apt install nginx -y
   ```
   
   Create `/etc/nginx/sites-available/default`:
   ```nginx
   server {
     listen 80 default_server;
     server_name _;

     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection "upgrade";
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
     }
   }
   ```

   ```bash
   sudo systemctl restart nginx
   ```

8. **SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d your-domain.com
   ```

---

### Docker Deployment (Any Platform)

**Prerequisites:**
- Docker installed locally and on server
- Docker registry (DockerHub, GitHub Container Registry, etc.)

**Steps:**

1. **Build Image**
   ```bash
   docker build -t netboost-pro:1.0 .
   ```

2. **Test Locally**
   ```bash
   docker run -p 3000:3000 \
     -e VITE_BLINK_PROJECT_ID=test \
     -e VITE_BLINK_PUBLISHABLE_KEY=test \
     netboost-pro:1.0
   # Visit http://localhost:3000
   ```

3. **Push to Registry**
   ```bash
   # GitHub Container Registry (free)
   docker tag netboost-pro:1.0 ghcr.io/your-username/netboost-pro:1.0
   docker push ghcr.io/your-username/netboost-pro:1.0
   ```

4. **Deploy on Server**
   ```bash
   docker pull ghcr.io/your-username/netboost-pro:1.0
   docker run -d -p 80:3000 \
     --name netboost-app \
     --restart always \
     --env-file .env.production \
     ghcr.io/your-username/netboost-pro:1.0
   ```

---

## Post-Deployment

### Verify Deployment

1. **Check Health**
   ```bash
   curl https://your-deployed-site.com
   ```

2. **Verify Environment Variables**
   - Test Blink SDK integration
   - Check console for errors

3. **Smoke Tests**
   - Navigate main app flows
   - Test 3D rendering (if applicable)
   - Verify form submissions
   - Check dark mode toggle

### Configure DNS

If using custom domain:

```bash
# For Vercel/Netlify (CNAME)
your-domain.com CNAME your-site.vercel.app

# For AWS CloudFront (ALIAS)
your-domain.com ALIAS d123xyz.cloudfront.net
```

### SSL/HTTPS

- ✅ Vercel: Automatic
- ✅ Netlify: Automatic
- ✅ AWS CloudFront: Automatic
- 🔧 DigitalOcean: Use Let's Encrypt (see above)
- 🔧 Docker: Use reverse proxy with SSL

---

## Monitoring & Maintenance

### Setup Error Tracking

**Option 1: Sentry (Free tier)**

```bash
npm install @sentry/react
```

Configure in `src/main.tsx`:
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
  tracesSampleRate: 0.1,
});
```

**Option 2: LogRocket**

```bash
npm install logrocket
```

### Monitor Performance

- Use built-in browser DevTools
- Setup Web Vitals monitoring
- Monitor bundle size over time

### Automated Deployments

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) automatically:

1. Runs linting on PR
2. Builds on every push
3. Deploys to production on `main` branch

### Maintenance Tasks

**Daily:**
- Monitor error logs
- Check health endpoints

**Weekly:**
- Review performance metrics
- Check dependency updates

**Monthly:**
- Update dependencies: `npm update`
- Security audit: `npm audit`
- Review analytics

### Rollback Procedure

**Vercel:**
```
Deployments → Select previous deployment → Promote to Production
```

**Netlify:**
```
Deploys → Click on previous deploy → Publish deploy
```

**Docker/DigitalOcean:**
```bash
docker ps -a  # Find previous image
docker run -p 80:3000 previous-image-id
```

---

## Troubleshooting

### Deployment Fails

1. Check build locally: `npm run build`
2. Check logs on deployment platform
3. Verify environment variables are set
4. Check Git history: `git log --oneline | head -10`

### Environment Variables Not Loading

- Verify variable names are correct
- Check they're set in platform dashboard
- Restart application/redeply

### Performance Issues

- Check bundle size: `npm run build` output
- Review network waterfall in DevTools
- Check CDN cache settings

### SSL/HTTPS Issues

- Renew certificates if expired
- Check domain DNS records
- Verify SSL configuration

---

## Support

- GitHub Issues: Report bugs
- Discord/Slack: Community support
- Email: support@example.com

**Deployment Status**: ✅ Ready for Production

---

**Last Updated**: 2026-05-22
