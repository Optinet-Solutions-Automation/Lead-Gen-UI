import fs from 'fs';
import path from 'path';

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
    // Check if latest status file exists in /tmp
    const tmpDir = '/tmp';
    const statusFile = path.join(tmpDir, 'latest.json');

    if (fs.existsSync(statusFile)) {
      const statusData = JSON.parse(fs.readFileSync(statusFile, 'utf8'));

      // Delete the file after reading
      fs.unlinkSync(statusFile);

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
