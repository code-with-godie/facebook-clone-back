import Comments from '../models/Comment.js';
import { StatusCodes } from 'http-status-codes';
import NotFoundError from '../../../errors/not-found.js';
import BadRequestError from '../../../errors/bad-request.js';

export const getPostComments = async (req, res, next) => {
  try {
    const {
      params: { id: postID },
    } = req;
    const comments = await Comments.find({ postID }).populate({
      path: 'userID',
      select: ' username profilePic',
    });
    return res
      .status(StatusCodes.OK)
      .json({ success: true, nbHits: comments.length, comments });
  } catch (error) {
    next(error);
  }
};
export const createComment = async (req, res, next) => {
  try {
    const {
      user: { userID },
    } = req;
    let comment = await Comments.create({ ...req.body, userID });
    comment = await Comments.findById(comment._id).populate({
      path: 'userID',
      select: ' username profilePic',
    });
    return res.status(StatusCodes.CREATED).json({ success: true, comment });
  } catch (error) {
    next(error);
  }
};
// export const sendMessage = async (req, res, next) => {
//   try {
//     const {
//       params: { id: receiver },
//       user: { userID: sender },
//     } = req;
//     let messege = await Messages.create({
//       ...req.body,
//       sender,
//       receiver,
//     });
//     messege = await Messages.findById(messege._id).populate({
//       path: 'receiver',
//       select: 'profilePic',
//     });
//     return res.status(StatusCodes.OK).json({ success: true, messege });
//   } catch (error) {
//     next(error);
//   }
// };
// export const deleteMessage = async (req, res, next) => {
//   try {
//     const {
//       params: { id: messageID },
//       user: { senderID },
//     } = req;
//     let message = await Messages.findById(messageID);
//     if (!message) {
//       throw new NotFoundError('no message with the provided id');
//     }
//     if (!message.users.includes(senderID) || message.to === senderID) {
//       throw new BadRequestError('you can only delete your own messages!!!');
//     }
//     await Messages.findByIdAndDelete(messageID);
//     return res
//       .status(StatusCodes.OK)
//       .json({ success: true, message: 'message deleted successfully' });
//   } catch (error) {
//     next(error);
//   }
// };
