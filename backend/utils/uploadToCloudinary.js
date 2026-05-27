const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async (
  fileBuffer,
  mimetype,
  originalname
) => {

  return new Promise((resolve, reject) => {

    let resourceType = 'raw';

    // 🖼️ imágenes
    if (mimetype.includes('image')) {
      resourceType = 'image';
    }

    // 🎥 videos
    else if (mimetype.includes('video')) {
      resourceType = 'video';
    }

    // 📄 PDFs
    else if (mimetype.includes('pdf')) {
      resourceType = 'raw';
    }

    // 🔥 nombre limpio
    const publicId =
      originalname.replace(/\.[^/.]+$/, '');

    cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,

        type: 'upload',

        access_mode: 'public',

        public_id: publicId,

        use_filename: true,

        unique_filename: false,
      },

      (error, result) => {

        if (error) {
          return reject(error);
        }

        resolve(result);

      }

    ).end(fileBuffer);

  });
};

module.exports = uploadToCloudinary;