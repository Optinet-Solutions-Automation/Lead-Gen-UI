import { getRedis } from './lib/redis.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const redis = getRedis();

    // Get status from Redis
    const statusJson = await redis.get('lead-gen:latest-status');

    if (statusJson) {
      const statusData = typeof statusJson === 'string'
        ? JSON.parse(statusJson)
        : statusJson;

      // Delete the key after reading
      await redis.del('lead-gen:latest-status');

      return res.status(200).json({
        found: true,
        status: statusData.status,
        message: statusData.message || '',
        failed_node: statusData.failed_node || ''
      });
    } else {
      return res.status(200).json({
        found: false
      });
    }
  } catch (error) {
    console.error('Error reading status:', error);
    return res.status(200).json({
      found: false
    });
  }
}
