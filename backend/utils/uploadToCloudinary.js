const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async (fileBuffer, mimetype) => {

  return new Promise((resolve, reject) => {

    const resourceType =
      mimetype.includes('image')
        ? 'image'
        : mimetype.includes('video')
        ? 'video'
        : 'raw';

    cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
      },
      (error, result) => {

        if (error) return reject(error);

        resolve(result);

      }
    ).end(fileBuffer);

  });
};

module.exports = uploadToCloudinary;