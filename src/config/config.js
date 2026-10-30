// Same-origin serverless function on Vercel (and via `vercel dev` locally).
const config = {
  backendUrl: import.meta.env.VITE_API_URL || "/api/generate",
};

export default config;
