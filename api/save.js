import { put, list } from '@vercel/blob';

const BLOB_NAME = 'growth-model-data.json';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      // Find the blob
      const { blobs } = await list({ prefix: BLOB_NAME });
      if (blobs.length > 0) {
        const response = await fetch(blobs[0].url);
        const data = await response.json();
        return res.status(200).json(data);
      }
      return res.status(404).json({ error: 'No data found' });
    }

    if (req.method === 'POST') {
      // Save data to blob
      const data = req.body;
      const blob = await put(BLOB_NAME, JSON.stringify(data), {
        access: 'public',
        addRandomSuffix: false,
      });
      return res.status(200).json({ success: true, message: 'Saved to server!', url: blob.url });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
