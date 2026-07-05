const { handleUpload } = require('@vercel/blob/client');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async () => {
        return {
          // Any file type is allowed — images, video, pdf, docs, audio, archives.
          addRandomSuffix: false,
          maximumSizeInBytes: 200 * 1024 * 1024, // 200MB, generous for video
        };
      },
      onUploadCompleted: async () => {
        // No-op: /api/list reads directly from Blob storage.
      },
    });

    res.status(200).json(jsonResponse);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Upload failed' });
  }
};
