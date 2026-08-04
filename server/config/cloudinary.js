const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (fileBuffer, mimetype) => {
  return new Promise((resolve, reject) => {
    // If keys are placeholder or invalid, resolve with data URL for smooth offline/test experience
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.CLOUDINARY_CLOUD_NAME === 'demo_cloud' ||
      process.env.CLOUDINARY_API_KEY === '1234567890'
    ) {
      const base64 = fileBuffer.toString('base64');
      const dataUri = `data:${mimetype};base64,${base64}`;
      return resolve(dataUri);
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'ecommerce_products' },
      (error, result) => {
        if (error) {
          // Fallback to data URI on Cloudinary error
          const base64 = fileBuffer.toString('base64');
          return resolve(`data:${mimetype};base64,${base64}`);
        }
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

module.exports = { cloudinary, uploadToCloudinary };
