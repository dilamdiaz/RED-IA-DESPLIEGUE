const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    ).end(fileBuffer);
  });
};

module.exports = uploadToCloudinary;