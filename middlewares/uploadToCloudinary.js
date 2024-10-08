import { v2 as cloudinary } from 'cloudinary';

const handleUpload = async (req, res, next) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  // const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  // const api_key = process.env.CLOUDINARY_API_KEY;
  // const api_secret = process.env.CLOUDINARY_API_SECRET;
  // console.log(cloud_name, api_key, api_secret, 'inside');
  try {
    const {
      body: { url: post, folder },
    } = req;
    console.log('uploading', folder);
    const response = await uploadFile(post, folder);
    console.log(response);
    const { secure_url, public_id } = response;
    req.file = { secure_url, public_id };
    next();
  } catch (error) {
    next(error);
  }
};

export const uploadFile = async (file, folder) => {
  const response = await cloudinary.uploader.upload(file, {
    resource_type: 'auto',
    folder,
  });
  return response;
};
export const updateFile = async (file, folder) => {
  // cloudinary.config({
  //     cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  //     api_key:process.env.CLOUDINARY_API_KEY,
  //     api_secret:process.env.CLOUDINARY_API_SECRET
  // })
  const response = await cloudinary.uploader.upload(file, {
    resource_type: 'auto',
    folder,
  });
  return response;
};
export const deleteFile = async public_id => {
  // cloudinary.config({
  //     cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  //     api_key:process.env.CLOUDINARY_API_KEY,
  //     api_secret:process.env.CLOUDINARY_API_SECRET
  // })
  const response = await cloudinary.uploader.destroy(public_id);
  return response;
};

export default handleUpload;
