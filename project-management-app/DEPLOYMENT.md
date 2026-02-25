# Deployment Guide - Project Management App

## 🚀 Backend Deployment

### Option 1: Heroku

1. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Create Heroku App**
   ```bash
   heroku login
   cd backend
   heroku create your-app-name
   ```

3. **Add MongoDB Atlas**
   ```bash
   heroku config:set MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/project-management
   heroku config:set JWT_SECRET=your-secret-key-here
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **Verify**
   ```bash
   heroku logs --tail
   heroku open
   ```

### Option 2: Railway.app

1. **Sign up** at https://railway.app

2. **Connect GitHub repo**
   - Select your repository
   - Select backend folder

3. **Set Environment Variables**
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/project-management
   JWT_SECRET=your-secret-key
   NODE_ENV=production
   ```

4. **Deploy**
   - Railway auto-deploys on git push

5. **Get URL**
   - Copy the generated domain from Railway dashboard

### Option 3: AWS EC2

1. **Launch EC2 Instance** (Ubuntu 20.04)

2. **Connect via SSH**
   ```bash
   ssh -i key.pem ubuntu@your-instance-ip
   ```

3. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Install MongoDB**
   ```bash
   # Use MongoDB Atlas instead (easier)
   # Or install local MongoDB:
   sudo apt-get install -y mongodb
   sudo systemctl start mongodb
   ```

5. **Clone and Deploy**
   ```bash
   git clone your-repo
   cd project-management-app/backend
   npm install
   npm start
   ```

6. **Use PM2 for Process Management**
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name "project-api"
   pm2 startup
   pm2 save
   ```

7. **Setup Nginx Reverse Proxy**
   ```bash
   sudo apt-get install nginx
   ```

   Create `/etc/nginx/sites-available/default`:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo systemctl restart nginx
   ```

---

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Sign up** at https://vercel.com

2. **Connect GitHub**
   - Select your repository
   - Select frontend folder as root

3. **Set Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend-domain.com/api
   ```

4. **Deploy**
   - Vercel auto-deploys on git push

5. **Get URL**
   - Vercel provides a domain (or use custom domain)

### Option 2: Netlify

1. **Sign up** at https://netlify.com

2. **Connect GitHub**
   - Select your repository

3. **Build Settings**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`

4. **Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend-domain.com/api
   ```

5. **Deploy**
   - Click "Deploy site"

### Option 3: AWS S3 + CloudFront

1. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://your-bucket-name
   ```

2. **Build React App**
   ```bash
   cd frontend
   npm run build
   ```

3. **Upload to S3**
   ```bash
   aws s3 sync build/ s3://your-bucket-name/
   ```

4. **Create CloudFront Distribution**
   - Origin: S3 bucket
   - Add environment variable to React

5. **Enable Static Website Hosting**
   - S3 bucket settings → Static website hosting
   - Index: `index.html`
   - Error: `index.html` (for SPA routing)

### Option 4: GitHub Pages (Free)

1. **Update package.json**
   ```json
   "homepage": "https://yourusername.github.io/project-management-app"
   ```

2. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Update scripts**
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

---

## 🔒 Production Checklist

### Backend
- [ ] JWT_SECRET changed from default
- [ ] MONGODB_URI is production database
- [ ] NODE_ENV=production
- [ ] CORS updated for production domain
- [ ] Error logging enabled
- [ ] Request validation in place
- [ ] Rate limiting added
- [ ] HTTPS enforced
- [ ] Security headers configured

### Frontend
- [ ] REACT_APP_API_URL points to production backend
- [ ] Removed debug console logs
- [ ] Build optimized (npm run build)
- [ ] Performance monitoring added
- [ ] Error boundary implemented
- [ ] Lazy loading for components

---

## 🔐 Security Improvements

### Add Rate Limiting (Backend)

```bash
npm install express-rate-limit
```

Add to `server.js`:
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### Add Helmet for Security Headers

```bash
npm install helmet
```

Add to `server.js`:
```javascript
import helmet from 'helmet';
app.use(helmet());
```

### Add HTTPS

```bash
npm install express-redirect-ssl
```

Add to `server.js`:
```javascript
import redirectSSL from 'express-redirect-ssl';
app.use(redirectSSL.default());
```

---

## 📊 Monitoring & Logging

### Add Morgan for Request Logging

```bash
npm install morgan
```

```javascript
import morgan from 'morgan';
app.use(morgan('combined'));
```

### Add Sentry for Error Tracking

```bash
npm install @sentry/node
```

```javascript
import * as Sentry from "@sentry/node";

Sentry.init({ dsn: process.env.SENTRY_DSN });
app.use(Sentry.Handlers.errorHandler());
```

---

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow (.github/workflows/deploy.yml)

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install & Test Backend
        run: |
          cd backend
          npm install
          npm test
      
      - name: Deploy to Heroku
        env:
          HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
        run: |
          git push heroku main

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install & Build Frontend
        run: |
          cd frontend
          npm install
          npm run build
      
      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: |
          npm install -g vercel
          vercel --prod --token=$VERCEL_TOKEN
```

---

## 📈 Scaling Tips

1. **Database**
   - Use MongoDB Atlas for auto-scaling
   - Enable read replicas
   - Index frequently queried fields

2. **Backend**
   - Use load balancing (Heroku auto-scaling)
   - Cache with Redis
   - Use CDN for file delivery

3. **Frontend**
   - Lazy load components
   - Code splitting
   - Image optimization
   - Service workers for offline support

4. **Monitoring**
   - New Relic for APM
   - Datadog for infrastructure
   - CloudWatch for AWS services

---

## 💰 Cost Estimation

### Free Tier Options
- Backend: Heroku (550 free hours/month) or Railway (10$/month)
- Frontend: Vercel or Netlify (free)
- Database: MongoDB Atlas (free tier with limits)
- Total: ~$10-15/month

### Small Scale (100 users)
- Backend: $50-100/month
- Frontend: Free
- Database: $50-100/month
- CDN: $10-20/month
- Total: ~$110-220/month

### Large Scale (10,000+ users)
- Backend: $200-500/month
- Frontend: $20-50/month
- Database: $500-1000/month
- CDN: $50-200/month
- Monitoring: $100-200/month
- Total: ~$870-1950/month

---

## 🆘 Troubleshooting

### Backend won't connect to MongoDB Atlas
```
- Whitelist IP address in MongoDB Atlas
- Check connection string format
- Verify credentials
```

### Frontend can't reach backend
```
- Check REACT_APP_API_URL in .env
- Verify CORS in backend
- Check if backend is running
```

### Build fails on Vercel
```
- Clear build cache
- Check Node version compatibility
- Verify environment variables set
```

### Database migration needed
```
- Back up existing data
- Run migration scripts
- Test in staging first
```

---

Happy Deployment! 🚀
