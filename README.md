# Product Customizer (Vercel-ready)

React + Vite + three.js T-shirt customizer with AI-generated decals.

## Deploy on Vercel
1. Push this folder to GitHub (or run `npx vercel` from it).
2. Import the repo in Vercel — framework is auto-detected as Vite; no root-directory changes needed.
3. In **Project Settings → Environment Variables** add `OPENAI_API_KEY`, then redeploy.

## Local dev
```
npm install
npx vercel dev      # runs the frontend and /api/generate together (needs OPENAI_API_KEY in .env.local)
```
`npm run dev` runs only the frontend (AI generation won't work without the API function).
