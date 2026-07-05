const { del } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { url } = req.body || {};
    if (!url) {
      res.status(400).json({ error: 'Missing url' });
      return;
    }
    await del(url);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Delete failed' });
  }
};
