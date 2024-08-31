import Stories from '../models/Story.js';
import { StatusCodes } from 'http-status-codes';
import NotFoundError from '../../../errors/not-found.js';
import BadRequestError from '../../../errors/bad-request.js';

export const getUserStories = async (req, res, next) => {
  try {
    const {
      params: { id: userID },
    } = req;
    let otherStories = await Stories.find({})
      .populate({
        path: 'userID',
        select: ' username profilePic',
      })
      .sort({ createdAt: -1 });
    const myStories = await Stories.find({ userID })
      .populate({
        path: 'userID',
        select: ' username profilePic',
      })
      .sort({ createdAt: -1 });
    return res.status(StatusCodes.OK).json({
      success: true,
      stories: otherStories,
      // stories: [...otherStories, ...myStories],
    });
  } catch (error) {
    next(error);
  }
};
export const createStory = async (req, res, next) => {
  try {
    const {
      user: { userID },
    } = req;
    let story = await Stories.create({ ...req.body, userID });
    story = await Stories.findById(story._id).populate({
      path: 'userID',
      select: ' username profilePic',
    });
    return res.status(StatusCodes.CREATED).json({ success: true, story });
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
