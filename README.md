# taits-business-proof-kit

The 5-Day Business Proof Kit™ — The AI Toolstack™  
Interactive 5-day micro-course with Google Sheets progress persistence and sequential day unlocking.

---

## How it works

- Buyer receives a delivery email with a personalized link: `https://taits-business-proof-kit.netlify.app?email=buyer@email.com`
- App reads their email from the URL, loads their progress from Google Sheets
- Days unlock sequentially — Day 2 unlocks only after Day 1 is marked complete
- Progress saves to Google Sheets automatically on every "Mark Done" action
- Buyer can close and return on any device using the same link

---

## Project structure

```
taits-business-proof-kit/
├── public/
│   └── index.html
├── src/
│   ├── data/
│   │   └── days.js           ← all product content lives here
│   ├── hooks/
│   │   ├── useProgress.js    ← Google Sheets read/write logic
│   │   └── useCopy.js        ← clipboard copy utility
│   ├── components/
│   │   ├── Header.js
│   │   ├── DayTabs.js
│   │   ├── DayContent.js
│   │   ├── PromptBlock.js
│   │   ├── ResultBlock.js
│   │   ├── CompletionSection.js
│   │   └── ClosingCTA.js
│   ├── App.js
│   ├── App.module.css
│   └── index.js
├── .env.example
├── .gitignore
└── package.json
```

---

## Setup

### 1. Environment variables

Copy `.env.example` to `.env.local` and fill in your Apps Script URL:

```
REACT_APP_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

**Never commit `.env.local` to GitHub.**

### 2. Install dependencies

```bash
npm install
```

### 3. Run locally

```bash
npm start
```

Visit: `http://localhost:3000?email=test@example.com`

---

## Deployment (Netlify)

### First deploy

1. Push this repo to GitHub (`taits-business-proof-kit`)
2. Go to app.netlify.com → Add new site → Import from GitHub
3. Select `taits-business-proof-kit`
4. Build settings (auto-detected):
   - Build command: `npm run build`
   - Publish directory: `build`
5. Click **Deploy site**
6. Go to **Site configuration → Environment variables**
7. Add: `REACT_APP_SCRIPT_URL` = your Apps Script URL
8. Trigger a redeploy

### Subsequent deploys

```bash
git add .
git commit -m "describe your change"
git push
```

Netlify auto-deploys on every push to main.

---

## GHL delivery email setup

In your GHL delivery email template, use this link format:

```
https://taits-business-proof-kit.netlify.app?email={{contact.email}}
```

The `{{contact.email}}` merge tag automatically inserts each buyer's email.

---

## Google Sheets

Sheet name: `taits-business-proof-kit-progress`  
Location: Google Drive → `13-Apps/taits-business-proof-kit/`

Columns: `email | first-seen | day-1 | day-2 | day-3 | day-4 | day-5 | last-active | sentence`

Values for day columns: `yes` or `no`

---

## Apps Script

Script name: `taits-business-proof-kit-v1`  
Deployment URL stored in: Google Drive → `13-Apps/taits-business-proof-kit/taits-business-proof-kit-config`

To update the script after changes: Apps Script → Deploy → Manage deployments → create a new version, then update `REACT_APP_SCRIPT_URL` in Netlify environment variables.

---

*The AI Toolstack™ | taits-business-proof-kit | v1.0 | June 2026*
