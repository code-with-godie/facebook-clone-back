import express from 'express';
import authorize from '../../../middlewares/authentication.js';
import {
  createComment,
  getPostComments,
} from '../controllers/commentsController.js';

const Router = express.Router();

Router.route('/').post(authorize, createComment);
Router.route('/:id').get(authorize, getPostComments);

export default Router;
