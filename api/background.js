const { head } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  try {
    const info = await head('background/current');
    res.status(200).json({ url: info.url, contentType: info.contentType || '' });
  } catch (error) {
    res.status(200).json({ url: null });
  }
};
