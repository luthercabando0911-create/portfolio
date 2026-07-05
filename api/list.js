const { list } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  try {
    const { blobs } = await list({ prefix: 'works/' });

    const works = blobs
      .map((b) => {
        const match = b.pathname.match(/^works\/(\d+)__(.+?)(\.[a-zA-Z0-9]+)?$/);
        const title = match ? decodeURIComponent(match[2]) : b.pathname.replace('works/', '');
        const ext = (match && match[3] ? match[3] : '').toLowerCase();
        return {
          url: b.url,
          title,
          ext,
          contentType: b.contentType || '',
          uploadedAt: b.uploadedAt,
        };
      })
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    res.status(200).json({ works });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to list works' });
  }
};
