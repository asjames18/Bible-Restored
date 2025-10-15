# Deploying Bible Project to Vercel

This guide will help you deploy your Bible Project application to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (free tier works great)
2. [Vercel CLI](https://vercel.com/docs/cli) (optional, for command-line deployment)
3. Git repository pushed to GitHub, GitLab, or Bitbucket (recommended)

## Deployment Methods

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Add Vercel configuration"
   git push origin main
   ```

2. **Import your repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the `vercel.json` configuration

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application
   - You'll get a production URL like `https://your-project.vercel.app`

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   For production deployment:
   ```bash
   vercel --prod
   ```

## Configuration Files

The following files have been created/modified for Vercel deployment:

### `vercel.json`
Configures how Vercel builds and serves your application:
- **buildCommand**: Runs `npm run build:vercel` in the frontend directory
- **outputDirectory**: Points to `frontend/dist` where the built files are
- **rewrites**: Ensures all routes are handled by React Router (SPA routing)

### `frontend/package.json`
Added `build:vercel` script that skips the Python preprocessing scripts since the Bible data is already in your `public/translations` folder.

### `.vercelignore`
Excludes unnecessary files from deployment (backend scripts, source files, etc.)

## Important Notes

### Bible Data
The Bible translations are already present in `frontend/public/translations/`. The Python scripts in the `backend` folder are not needed for deployment - they're only used for preprocessing the Bible data locally.

If you need to update the Bible data:
1. Run the scripts locally: `npm run sync-bible` (from the frontend directory)
2. Commit the updated translation files
3. Redeploy to Vercel

### Environment Variables
If you need to add environment variables:
1. Go to your project settings in Vercel Dashboard
2. Navigate to "Environment Variables"
3. Add any required variables

### Custom Domain
To use a custom domain:
1. Go to your project settings in Vercel
2. Click on "Domains"
3. Add your custom domain and follow the DNS configuration instructions

## Updating Your Deployment

After the initial deployment, any push to your main branch will automatically trigger a new deployment (if using Git integration).

For manual deployments:
```bash
vercel --prod
```

## Troubleshooting

### Build Fails
- Check the build logs in Vercel Dashboard
- Ensure all dependencies are listed in `frontend/package.json`
- Make sure the Bible translation files exist in `frontend/public/translations/`

### Routes Not Working
- The `vercel.json` rewrites configuration handles SPA routing
- If issues persist, check the Vercel logs

### PWA Not Working
- Ensure HTTPS is enabled (Vercel provides this automatically)
- Clear browser cache and service workers when testing
- Check the manifest.json is being served correctly

## Performance Tips

1. **Enable Analytics**: Vercel provides free analytics in the dashboard
2. **Edge Network**: Your app is automatically distributed across Vercel's global CDN
3. **Automatic HTTPS**: SSL certificates are automatically provisioned
4. **Caching**: Static assets are automatically cached

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

---

Your Bible Project is now ready to deploy to Vercel! 🚀

