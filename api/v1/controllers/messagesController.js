import Messages from '../models/Message.js';
import { StatusCodes } from 'http-status-codes';
import NotFoundError from '../../../errors/not-found.js';
import BadRequestError from '../../../errors/bad-request.js';

export const getMessagesGroupedByDate = async (req, res, next) => {
  const {
    params: { id: roomID },
  } = req;
  console.log(roomID);

  const messeges = await Messages.aggregate([
    {
      $match: {
        roomID: { $eq: roomID },
      },
    },
    // {
    //   $group: {
    //     _id: {
    //       $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
    //     },
    //     messages: { $push: '$$ROOT' },
    //   },
    // },
    {
      $sort: { _id: 1 }, // Sort by date ascending
    },
  ]);
  return res
    .status(StatusCodes.OK)
    .json({ success: true, nbHits: messeges.length, messeges });
};
export const getRoomMessages = async (req, res, next) => {
  try {
    const {
      params: { id: roomID },
    } = req;
    const messeges = await Messages.find({ roomID }).populate({
      path: 'receiver',
      select: ' username profilePic',
    });
    return res
      .status(StatusCodes.OK)
      .json({ success: true, nbHits: messeges.length, messeges });
  } catch (error) {
    next(error);
  }
};
export const getLastRoomMessage = async (req, res, next) => {
  try {
    const {
      params: { id: roomID },
    } = req;
    const messege = await Messages.find({ roomID })
      .sort({ createdAt: -1 })
      .limit(1);
    return res.status(StatusCodes.OK).json({ success: true, messege });
  } catch (error) {
    next(error);
  }
};
export const sendMessage = async (req, res, next) => {
  try {
    const {
      params: { id: receiver },
      user: { userID: sender },
    } = req;
    let messege = await Messages.create({
      ...req.body,
      sender,
      receiver,
    });
    messege = await Messages.findById(messege._id).populate({
      path: 'receiver',
      select: 'profilePic',
    });
    return res.status(StatusCodes.OK).json({ success: true, messege });
  } catch (error) {
    next(error);
  }
};
export const deleteMessage = async (req, res, next) => {
  try {
    const {
      params: { id: messageID },
      user: { senderID },
    } = req;
    let message = await Messages.findById(messageID);
    if (!message) {
      throw new NotFoundError('no message with the provided id');
    }
    if (!message.users.includes(senderID) || message.to === senderID) {
      throw new BadRequestError('you can only delete your own messages!!!');
    }
    await Messages.findByIdAndDelete(messageID);
    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: 'message deleted successfully' });
  } catch (error) {
    next(error);
  }
};
