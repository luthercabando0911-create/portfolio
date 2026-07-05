const { put, head } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const info = await head('about/current.json');
      const response = await fetch(info.url);
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(200).json({ text: '' });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const { text, passcode } = req.body || {};

      if (!process.env.ABOUT_EDIT_PASSCODE) {
        res.status(500).json({
          error: 'Editing is not set up yet. Add an ABOUT_EDIT_PASSCODE environment variable in Vercel, then redeploy.',
        });
        return;
      }
      if (passcode !== process.env.ABOUT_EDIT_PASSCODE) {
        res.status(401).json({ error: 'Incorrect passcode.' });
        return;
      }
      if (typeof text !== 'string' || text.length > 4000) {
        res.status(400).json({ error: 'Text is missing or too long.' });
        return;
      }

      await put('about/current.json', JSON.stringify({ text, updatedAt: new Date().toISOString() }), {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'application/json',
      });

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message || 'Failed to save' });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
};
