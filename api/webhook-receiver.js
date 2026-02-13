import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = req.body;

  // Validate required fields
  if (!data.status) {
    return res.status(400).json({ error: 'Missing status' });
  }

  const status = data.status; // Should be 'success' or 'error'
  const message = data.message || '';
  const failedNode = data.failed_node || '';

  // Store status data (using /tmp directory in Vercel)
  const statusData = {
    status: status,
    message: message,
    failed_node: failedNode,
    timestamp: Date.now()
  };

  try {
    // Write to /tmp directory (Vercel's temporary storage)
    const tmpDir = '/tmp';
    const statusFile = path.join(tmpDir, 'latest.json');

    fs.writeFileSync(statusFile, JSON.stringify(statusData));

    return res.status(200).json({
      success: true,
      status: status
    });
  } catch (error) {
    console.error('Error writing status:', error);
    return res.status(500).json({ error: 'Failed to store status' });
  }
}
