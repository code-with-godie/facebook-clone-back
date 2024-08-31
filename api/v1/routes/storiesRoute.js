import express from 'express';
import authorize from '../../../middlewares/authentication.js';
import {
  createStory,
  getUserStories,
} from '../controllers/storysController.js';

const Router = express.Router();

Router.route('/').post(authorize, createStory);
Router.route('/:id').get(getUserStories);

export default Router;
