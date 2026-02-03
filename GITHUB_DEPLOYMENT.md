# Deploy to GitHub Pages Guide

Follow these steps to deploy your electrician website to GitHub Pages:

## Prerequisites
1. A GitHub account
2. Git installed on your computer
3. This project code

## Step 1: Create a GitHub Repository
1. Go to [GitHub](https://github.com) and log in
2. Click the "+" icon in the top right and select "New repository"
3. Name your repository (e.g., "samir-electrician-services")
4. Keep it public or private (GitHub Pages works with both)
5. Do NOT initialize with a README (we'll push existing code)
6. Click "Create repository"

## Step 2: Update Vite Config
Before deploying, update the `vite.config.ts` file:

```typescript
// Uncomment and replace with your actual repo name
base: '/samir-electrician-services/',
```

## Step 3: Initialize Git and Deploy
Run these commands in your project directory:

```bash
# Initialize Git repository
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit - Samir Khan Electrician Services"

# Add your GitHub repository as remote (replace with your username and repo name)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main

# Deploy to GitHub Pages
npm run deploy
```

## Step 4: Enable GitHub Pages
1. Go to your GitHub repository
2. Click "Settings"
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select "Deploy from a branch"
5. Select the "gh-pages" branch
6. Click "Save"

## Step 5: Access Your Website
Your website will be available at:
`https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

It may take a few minutes for the site to become available.

## Updating Your Website
To make changes and update your site:

```bash
# Make your changes to the code

# Commit and push changes
git add .
git commit -m "Description of your changes"
git push origin main

# Deploy the updated version
npm run deploy
```

## Troubleshooting
- If your site doesn't load, check that the base path in `vite.config.ts` matches your repository name
- Ensure the gh-pages branch was created and selected in GitHub Pages settings
- Try clearing your browser cache or using incognito mode
- Check the GitHub Actions tab to see if deployment succeeded

## Need Help?
For more information, visit the [GitHub Pages Documentation](https://pages.github.com/).
