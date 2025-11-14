# GitHub Setup Instructions for Snap2Cal

## Your repository is ready! Here's how to push it to your existing GitHub repo:

### Step 1: Connect your local repository to GitHub

Since you already have the Snap2Cal repository created on GitHub:

```bash
# Navigate to your project directory
cd /path/to/snap2cal

# Add GitHub as remote origin (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/snap2cal.git

# Push your code to GitHub
git push -u origin main
```

### Step 2: Verify

Visit `https://github.com/YOUR-USERNAME/snap2cal` to see your repository live!

## What's included in your repository:

- ✅ `index.html` - Main application file (your working Snap2Cal app)
- ✅ `README.md` - Comprehensive project documentation
- ✅ `.gitignore` - Protects sensitive files from being committed
- ✅ Initial commit with clear message

## Future commits:

Whenever you make changes:

```bash
git add .
git commit -m "Description of your changes"
git push
```

## Important Notes:

⚠️ **NEVER commit your API keys!** They are already excluded via .gitignore
⚠️ **Update the README** with your actual Google Client ID setup instructions
⚠️ Consider making the repository **private** if it contains any sensitive configuration

## Optional: Enable GitHub Pages

To host your app for free:

1. Go to your repository settings
2. Navigate to **Pages** section
3. Under "Source", select **main** branch
4. Click **Save**
5. Your app will be live at `https://YOUR-USERNAME.github.io/snap2cal`

Note: You'll need to update the Google OAuth authorized origins to include your GitHub Pages URL.

---

Need help? Check out [GitHub's documentation](https://docs.github.com/en/get-started)
