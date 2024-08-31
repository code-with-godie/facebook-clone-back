import express from 'express';
import {
  auth,
  blockUser,
  createAccount,
  deleteUser,
  follow,
  getAllUsers,
  getSingleUser,
  getUserFollowingAccount,
  like,
  login,
  sendFriendRequest,
  toggleSave,
  updateUser,
} from '../controllers/usersController.js';
import authorize from '../../../middlewares/authentication.js';

const Router = express.Router();
Router.route('/').get(authorize, getAllUsers);
Router.route('/login').post(login);
Router.route('/register').post(createAccount);
Router.route('/auth').post(auth);
Router.route('/send-friend-request/:id').post(authorize, sendFriendRequest);
Router.route('/block-user/:id').patch(authorize, blockUser);
Router.route('/follow/:id').patch(authorize, follow);
Router.route('/like/:id').patch(authorize, like);
Router.route('/bookmark/:id').patch(authorize, toggleSave);
Router.route('/followings/account/:id').get(getUserFollowingAccount);
Router.route('/:id')
  .patch(authorize, updateUser)
  .delete(authorize, deleteUser)
  .get(getSingleUser);
export default Router;
