import { getRedis } from './lib/redis.js';

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

  // Store status data
  const statusData = {
    status: status,
    message: message,
    failed_node: failedNode,
    timestamp: Date.now()
  };

  try {
    const redis = getRedis();

    // Store in Redis with a key 'lead-gen:latest-status'
    // Set expiration to 5 minutes (300 seconds)
    await redis.set('lead-gen:latest-status', JSON.stringify(statusData), {
      ex: 300
    });

    return res.status(200).json({
      success: true,
      status: status
    });
  } catch (error) {
    console.error('Error storing status:', error);
    return res.status(500).json({ error: 'Failed to store status' });
  }
}
