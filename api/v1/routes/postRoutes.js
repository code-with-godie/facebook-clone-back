import express from 'express';
import {
  createPost,
  getAllPosts,
  getFollowingsPosts,
  getSavedPosts,
  getUserAllPosts,
  getVideos,
  toggleLikes,
  togglebookmarks,
} from '../controllers/postsController.js';
import authorize from '../../../middlewares/authentication.js';
import handleUpload from '../../../middlewares/uploadToCloudinary.js';

const Router = express.Router();

Router.route('/').post(authorize, handleUpload, createPost);
Router.route('/saved').get(authorize, getSavedPosts);
Router.route('/').get(authorize, getAllPosts);
Router.route('/watch/:slug').get(authorize, getVideos);
Router.route('/like/:id').patch(authorize, toggleLikes);
Router.route('/bookmark/:id').patch(authorize, togglebookmarks);
Router.route('/single/:slug/:id').get(getUserAllPosts);
Router.route('/followings/posts').get(authorize, getFollowingsPosts);

export default Router;
