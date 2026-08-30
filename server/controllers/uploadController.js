const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const asyncHandler = require('../utils/asyncHandler');

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const streamUpload = (file) => new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    { folder: 'vanya/media', resource_type: 'auto' },
    (err, result) => {
      if (err || !result) {
        reject(err || new Error('Upload failed'));
      } else {
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    }
  );
  streamifier.createReadStream(file.buffer).pipe(stream);
});

const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || !req.files.length) {
    res.status(400);
    throw new Error('No files provided');
  }

  try {
    const results = await Promise.all(req.files.map((f) => streamUpload(f)));
    res.status(201).json(results);
  } catch (error) {
    res.status(500);
    if (error.code === 'ENOTFOUND' || error.message?.includes('ENOTFOUND') || error.message?.includes('getaddrinfo')) {
      throw new Error('Cloudinary service is currently unreachable. Please check your internet connection or Cloudinary credentials.');
    }
    throw new Error(error.message || 'Failed to upload media to Cloudinary');
  }
});

module.exports = { uploadImages };
