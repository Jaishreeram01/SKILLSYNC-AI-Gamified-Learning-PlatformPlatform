# SkillSync Deployment & DevOps Strategy

## Infrastructure Overview

\`\`\`
┌─────────────────┐
│  Frontend       │
│  (Vercel)       │
│  - React App    │
│  - TailwindCSS  │
└────────┬────────┘
         │ HTTPS
┌────────▼────────────────────────────────┐
│       Backend API (Render)              │
│  - Express.js                           │
│  - Node.js                              │
│  - Socket.io                            │
└────────┬─────────────────────────────┬──┘
         │                             │
    ┌────▼────────┐         ┌─────────▼────┐
    │  Firebase   │         │  Cloudinary  │
    │  - Firestore│         │  - File      │
    │  - Auth     │         │    Storage   │
    │  - Hosting  │         └──────────────┘
    └─────────────┘

    Monitoring & Analytics:
    - Sentry (error tracking)
    - Google Analytics
    - Render monitoring
\`\`\`

## Frontend Deployment (Vercel)

### Setup
\`\`\`bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
\`\`\`

### Vercel Configuration (vercel.json)
\`\`\`json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": [
    "VITE_API_URL",
    "VITE_FIREBASE_PROJECT_ID",
    "VITE_FIREBASE_API_KEY"
  ],
  "regions": ["us-east-1"],
  "public": true
}
\`\`\`

### Environment Variables
\`\`\`
VITE_API_URL=https://skillsync-api.render.com/api
VITE_FIREBASE_PROJECT_ID=skillsync-prod
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=skillsync-prod.firebaseapp.com
VITE_FIREBASE_STORAGE_BUCKET=skillsync-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
VITE_GEMINI_API_KEY=(passed from backend only)
\`\`\`

### Build Optimization
\`\`\`json
{
  "scripts": {
    "build": "vite build",
    "build:analyze": "vite build --analyze"
  }
}
\`\`\`

### Performance
- Auto-minification by Vercel
- Code splitting for routes
- Image optimization
- Caching strategy

---

## Backend Deployment (Render)

### Setup
1. Create account on render.com
2. Connect GitHub repository
3. Create new Web Service

### Render Configuration (render.yaml)
\`\`\`yaml
services:
  - type: web
    name: skillsync-api
    env: node
    plan: standard
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
      - key: FIREBASE_PROJECT_ID
        fromDatabase:
          name: firebase
          property: projectId
      - key: FIREBASE_PRIVATE_KEY
        sync: false
      - key: GEMINI_API_KEY
        sync: false
      - key: CLOUDINARY_API_KEY
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: CORS_ORIGIN
        value: https://skillsync.vercel.app
      - key: DATABASE_URL
        fromDatabase:
          name: firebase
          property: connectionString
databases:
  - name: firebase
    plan: free
\`\`\`

### Environment Variables
\`\`\`
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://skillsync.vercel.app

# Firebase
FIREBASE_PROJECT_ID=skillsync-prod
FIREBASE_PRIVATE_KEY=xxx
FIREBASE_CLIENT_EMAIL=xxx

# Gemini API
GEMINI_API_KEY=xxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

# JWT
JWT_SECRET=xxx (32+ character random string)
JWT_EXPIRE=24h

# Email Service
SENDGRID_API_KEY=xxx

# Monitoring
SENTRY_DSN=xxx
\`\`\`

### Deployment Steps
\`\`\`bash
# 1. Commit changes
git add .
git commit -m "deploy: production release v1.0.0"

# 2. Push to GitHub
git push origin main

# 3. Render automatically deploys (if connected)
# Monitor at: https://dashboard.render.com

# 4. Verify deployment
curl https://skillsync-api.render.com/api/health
\`\`\`

---

## Database: Firebase Firestore

### Setup
1. Create Firebase project on console.firebase.google.com
2. Enable Firestore
3. Configure security rules
4. Export database backups

### Firestore Security Rules
\`\`\`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own profile
    match /users/{uid} {
      allow read: if request.auth.uid == uid;
      allow write: if request.auth.uid == uid;
    }

    // Users can read public skill data
    match /skills/{skillId} {
      allow read: if true;
      allow write: if false;
    }

    // Users can read/write messages in their teams
    match /teams/{teamId}/messages/{messageId} {
      allow read: if existsAfter(/databases/$(database)/documents/teams/$(teamId)) && 
                     request.auth.uid in resource.data.members;
      allow write: if request.auth.uid in resource.data.members;
    }

    // Deny all others
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
\`\`\`

### Backup Strategy
- Automated daily backups (Firebase Backup and Restore)
- Manual exports before major releases
- Point-in-time recovery available

---

## File Storage: Cloudinary

### Setup
\`\`\`bash
# Install Cloudinary SDK
npm install cloudinary next-cloudinary

# Create Cloudinary account
# Get API credentials from dashboard
\`\`\`

### Configuration
\`\`\`javascript
// backend/config/cloudinary.js
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary.v2;
\`\`\`

### Upload Implementation
\`\`\`javascript
// backend/routes/uploadRoutes.js
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        public_id: \`skillsync/\${Date.now()}\`,
        folder: 'skillsync'
      },
      (error, result) => {
        if (error) throw error;
        res.json({ success: true, data: { url: result.secure_url } });
      }
    );

    result.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});
\`\`\`

---

## Monitoring & Error Tracking

### Sentry Setup
\`\`\`javascript
// backend/config/sentry.js
import Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  attachStacktrace: true,
});

export default Sentry;
\`\`\`

### Google Analytics (Frontend)
\`\`\`javascript
// frontend/src/config/analytics.js
import { useEffect } from 'react';

export function useAnalytics() {
  useEffect(() => {
    // Initialize Google Analytics
    window.gtag('config', 'GA_MEASUREMENT_ID');
  }, []);
}
\`\`\`

### Logging Strategy
\`\`\`javascript
// backend/config/logger.js
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;
\`\`\`

---

## CI/CD Pipeline (GitHub Actions)

### Workflow (.github/workflows/deploy.yml)
\`\`\`yaml
name: Deploy to Production

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm test
      
      - name: Build frontend
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Render
        run: |
          curl -X POST https://api.render.com/deploy/srv-xxx \
            -H "Authorization: Bearer ${{ secrets.RENDER_DEPLOY_KEY }}"
      
      - name: Deploy to Vercel
        run: |
          npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
\`\`\`

---

## Scaling Strategy

### Phase 1 (0-1000 users)
- Single Render instance (standard)
- Firestore in standard mode
- CDN caching on Vercel

### Phase 2 (1000-10000 users)
- Load balancing on Render
- Firestore scaling limits check
- Cache layer (Redis) consideration

### Phase 3 (10000+ users)
- Multiple backend instances
- Firestore sharding
- Dedicated search infrastructure
- Global CDN optimization

---

## Security Checklist

- [x] HTTPS/TLS enabled
- [x] Environment variables secured
- [x] CORS properly configured
- [x] CSRF protection implemented
- [x] Input validation on all endpoints
- [x] Rate limiting for API
- [x] SQL injection prevention (using ORM)
- [x] XSS protection (React escaping)
- [x] Firestore security rules
- [x] API key rotation mechanism
- [x] Incident response plan

---

## Disaster Recovery

### Backup Strategy
- Firebase automated backups: Daily
- Code backup: GitHub
- Database export: Weekly manual

### Recovery Procedures
1. Firebase data restore (if needed)
2. Backend redeployment (Render rollback)
3. Frontend redeployment (Vercel rollback)
4. DNS failover (if applicable)

### RTO/RPO
- Recovery Time Objective: 2 hours
- Recovery Point Objective: 24 hours (daily backups)
\`\`\`
