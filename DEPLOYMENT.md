# Deployment Guide

This guide covers deploying the Freelance Portfolio app to Netlify (frontend) and a backend service.

## Frontend Deployment - Netlify

### Option 1: Deploy via Netlify CLI (Recommended)

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy from project directory**
   ```bash
   cd c:\Users\Lenovo\my-portfolio-app
   netlify deploy --prod --dir=public
   ```

### Option 2: Deploy via GitHub (Continuous Deployment)

1. **Push to GitHub** (already done)
   ```bash
   git push origin master
   ```

2. **Connect to Netlify**
   - Go to https://app.netlify.com
   - Click "New site from Git"
   - Select GitHub and authorize
   - Choose repository: `freelance-portfolio`
   - Build command: Leave empty (no build needed)
   - Publish directory: `public`
   - Click "Deploy site"

3. **Configure Netlify Settings**
   - Go to Site settings → Build & deploy
   - Production branch: `master`
   - Build command: (leave empty)
   - Publish directory: `public`

## Backend Deployment - Render (Free Tier)

### Deploy Node.js Server to Render

1. **Push latest code to GitHub**
   ```bash
   git add .
   git commit -m "Update for deployment"
   git push origin master
   ```

2. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub account

3. **Create New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repo `freelance-portfolio`
   - Fill in details:
     - **Name**: `freelance-portfolio-api` (or any name)
     - **Region**: Choose closest to you
     - **Runtime**: `Node`
     - **Build command**: `npm install`
     - **Start command**: `npm start`

4. **Add Environment Variables**
   - In Render dashboard, go to your service's Environment tab
   - Add these variables:
     ```
     NODE_ENV=production
     PORT=3000
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio
     JWT_SECRET=your-secure-secret-key-here
     ADMIN_USERNAME=admin
     ADMIN_PASSWORD=admin123
     ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (takes 2-5 minutes)
   - Copy the deployed URL (e.g., `https://freelance-portfolio-api.onrender.com`)

### MongoDB Setup (Required)

1. **Use MongoDB Atlas (Free Tier)**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free account
   - Create cluster
   - Add database user with username/password
   - Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/portfolio`
   - Whitelist all IPs (0.0.0.0/0) for Render access

2. **Or Use Local MongoDB**
   - Not recommended for production
   - Only works if your Render instance can reach your local machine

## Update Frontend with Backend URL

1. **Edit `public/index.html`**
   ```html
   <script>
     window.API_BASE_URL = 'https://your-backend.onrender.com'; // Your Render URL
   </script>
   ```

2. **Or edit `public/admin.html`** if admin panel is used:
   ```javascript
   const API_BASE = 'https://your-backend.onrender.com/api';
   ```

3. **Commit and push changes**
   ```bash
   git add public/
   git commit -m "Update backend URL for production"
   git push origin master
   ```

4. **Netlify auto-deploys** when you push to master

## Alternative Backend Services

### Railway (Similar to Render)
- URL: https://railway.app
- Same setup as Render
- Better free tier limits

### Heroku (Paid, $7/month minimum)
- URL: https://heroku.com
- More stable, larger free tier
- Use Heroku CLI for deployment

### Vercel (For Next.js/Serverless)
- URL: https://vercel.com
- Overkill for this project unless you convert to Next.js

## Testing Deployment

1. **Test Frontend**
   ```
   https://your-site.netlify.app
   ```

2. **Test Backend API**
   ```
   https://your-backend.onrender.com/api/profile
   ```

3. **Test Admin Panel**
   ```
   https://your-site.netlify.app/admin
   Login with admin/admin123
   ```

4. **Test Contact Form**
   - Fill and submit contact form
   - Check Render logs for submission

## Troubleshooting

### API Not Loading on Frontend
- Check browser console for CORS errors
- Update `API_BASE_URL` in `public/index.html`
- Ensure backend is running and accessible

### Admin Panel Not Connecting
- Check `API_BASE` in `public/admin.html`
- Verify JWT token is being sent in Authorization header
- Check backend logs in Render dashboard

### Image Upload Not Working
- Check file upload path in backend
- Ensure `/public/uploads/` exists
- Verify write permissions on Render

### MongoDB Connection Error
- Verify `MONGODB_URI` environment variable is correct
- Check MongoDB user credentials
- Whitelist Render IP in MongoDB Atlas

## Environment Variables Checklist

Backend (.env file):
- ✅ MONGODB_URI
- ✅ JWT_SECRET
- ✅ ADMIN_USERNAME
- ✅ ADMIN_PASSWORD
- ✅ PORT (optional, default 3000)
- ✅ NODE_ENV (production)

Frontend (public/index.html):
- ✅ API_BASE_URL (backend URL)

## Performance Tips

1. **Render Limits**
   - Free tier: 750 hours/month (1 instance)
   - Instance goes to sleep after 15 minutes of inactivity
   - First request after sleep takes ~30 seconds
   - Use paid tier ($7/month) to avoid sleep

2. **MongoDB Atlas**
   - Free tier: 512MB storage
   - Sufficient for small portfolios
   - Upgrade as needed

3. **Netlify**
   - Free tier: 300 build minutes/month
   - Unlimited bandwidth
   - Site goes live in seconds

## Custom Domain Setup

### Netlify Custom Domain
1. Go to Site settings → Domain management
2. Add custom domain
3. Follow DNS configuration steps

### Render Custom Domain
1. Go to service settings → Custom Domain
2. Add your domain
3. Update DNS records

## Continuous Deployment Setup

Both Netlify and Render auto-deploy when you push to master branch:
```bash
git add .
git commit -m "Your changes"
git push origin master
# Both sites auto-update within seconds
```

## Security Notes

- Never commit `.env` file (use `.env.example` as template)
- Use strong JWT_SECRET and ADMIN_PASSWORD
- Enable HTTPS (automatic on Netlify and Render)
- Whitelist only necessary IPs in MongoDB
- Use environment variables for all secrets

## Summary URLs After Deployment

- **Frontend**: `https://your-site.netlify.app`
- **Backend API**: `https://your-backend.onrender.com`
- **Admin Panel**: `https://your-site.netlify.app/admin`
- **API Profile**: `https://your-backend.onrender.com/api/profile`

---

Need help? Check the main README.md for more details.
