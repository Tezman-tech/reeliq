# ReelIQ — Deployment Checklist
## Follow these steps in order. Do not skip any.

---

## BEFORE YOU START
You need:
- A computer (Mac or Windows)
- The reeliq project folder (downloaded from Claude)
- Internet connection
- 30 minutes

---

## STEP 1 — Install Node.js (5 minutes)
1. Go to https://nodejs.org
2. Click the big green "LTS" download button
3. Open the downloaded file and install it (just click Next through everything)
4. When done, open Terminal (Mac) or Command Prompt (Windows)
5. Type this and press Enter to confirm it worked:
   node --version
   (You should see something like v18.x.x)

---

## STEP 2 — Create a GitHub account (3 minutes)
1. Go to https://github.com
2. Click "Sign up" and create a free account
3. Verify your email

---

## STEP 3 — Install Git (2 minutes)
Mac: Git is usually already installed. Test by typing: git --version
Windows: Download from https://git-scm.com and install it

---

## STEP 4 — Set up the project (5 minutes)
1. Download the reeliq folder from Claude
2. Open Terminal / Command Prompt
3. Navigate to where you saved the folder. Example:
   cd Downloads/reeliq
4. Install dependencies by typing:
   npm install
5. Test it works locally:
   npm run dev
6. Open your browser to: http://localhost:5173
7. You should see the ReelIQ app running
8. Press Ctrl+C in terminal to stop it

---

## STEP 5 — Create GitHub repository (3 minutes)
1. Go to https://github.com and log in
2. Click the "+" button top right → "New repository"
3. Name it: reeliq
4. Make it Public
5. Do NOT tick "Add README"
6. Click "Create repository"
7. Copy the repository URL (looks like: https://github.com/YOURNAME/reeliq.git)

---

## STEP 6 — Push code to GitHub (3 minutes)
In your terminal, inside the reeliq folder, run these commands ONE AT A TIME:

git init
git add .
git commit -m "Initial ReelIQ build"
git branch -M main
git remote add origin https://github.com/YOURNAME/reeliq.git
git push -u origin main

(Replace YOURNAME with your actual GitHub username)

---

## STEP 7 — Deploy on Vercel (5 minutes)
1. Go to https://vercel.com
2. Click "Sign Up" → choose "Continue with GitHub"
3. Authorise Vercel to access your GitHub
4. Click "Add New Project"
5. Find and select your "reeliq" repository
6. Leave all settings as default
7. Click "Deploy"
8. Wait 2 minutes while it builds

---

## STEP 8 — Get your live URL
1. Vercel will show you a URL like: reeliq.vercel.app
2. Click it to confirm the app is live
3. Share that URL with your first beta user

---

## YOU'RE LIVE. Go back to Claude and paste the URL.

---

## TROUBLESHOOTING
If npm install fails: Make sure Node.js installed correctly (Step 1)
If git push fails: Make sure you replaced YOURNAME with your actual GitHub username
If Vercel build fails: Screenshot the error and send it to Claude
