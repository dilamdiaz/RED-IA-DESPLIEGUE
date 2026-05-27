const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async (fileBuffer, mimetype) => {

  return new Promise((resolve, reject) => {

    let resourceType = 'raw';

    // 🖼️ imágenes
    if (mimetype.includes('image')) {
      resourceType = 'image';
    }

    // 📄 PDFs
    else if (mimetype.includes('pdf')) {
      resourceType = 'image';
    }

    // 🎥 videos
    else if (mimetype.includes('video')) {
      resourceType = 'video';
    }

    cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,

        type: 'upload',

        access_mode: 'public',
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