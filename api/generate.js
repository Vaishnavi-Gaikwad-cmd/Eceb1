// Vercel serverless function: POST /api/generate  { prompt } -> { photo: <base64>, mime }
// Replaces the old Express server. Requires OPENAI_API_KEY in Vercel env vars.
export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ message: 'Image generation endpoint is up' });
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'OPENAI_API_KEY is not configured on the server' });
  }

  const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
  if (!prompt) return res.status(400).json({ message: 'Prompt is required' });

  try {
    // DALL-E 2/3 have been retired; gpt-image-1 is the current default.
    // Override with OPENAI_IMAGE_MODEL if you have access to a different model.
    const model = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1';
    const body = { model, prompt: prompt.slice(0, 4000), n: 1, size: '1024x1024' };
    if (model.startsWith('gpt-image')) {
      // webp keeps the payload under Vercel's 4.5 MB response limit and supports transparency
      body.output_format = 'webp';
      body.quality = 'medium';
    } else {
      body.response_format = 'b64_json';
    }

    const r = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    if (!r.ok) {
      console.error('OpenAI error', r.status, data);
      return res.status(r.status).json({ message: data?.error?.message || 'Image generation failed' });
    }
    const photo = data?.data?.[0]?.b64_json;
    if (!photo) return res.status(502).json({ message: 'No image returned' });

    return res.status(200).json({ photo, mime: body.output_format || 'png' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}
