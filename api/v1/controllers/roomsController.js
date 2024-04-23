import { StatusCodes } from 'http-status-codes';
import NotFoundError from '../../../errors/not-found.js';
import Users from '../models/User.js';
import BadRequestError from '../../../errors/bad-request.js';
import Room from '../models/Room.js';

export const getUserRooms = async (req, res, next) => {
  try {
    const {
      user: { userID },
    } = req;
    const rooms = await Room.find({ members: { $in: userID } })
      .populate({ path: 'members', select: 'username profilePic' })
      .sort({
        createdAt: -1,
      });
    return res.status(StatusCodes.OK).json({ success: true, rooms });
  } catch (error) {
    next(error);
  }
};
export const createRoom = async (req, res, next) => {
  try {
    const {
      user: { userID },
      body: { userID: otherUserID },
    } = req;
    let room = await Room.findOne({
      $and: [{ members: { $in: userID } }, { members: { $in: otherUserID } }],
    }).populate({ path: 'members', select: 'username profilePic' });
    if (room) {
      console.log('room found');
      return res.status(StatusCodes.OK).json({
        success: true,
        room,
        message: 'room successfully found',
      });
    }
    room = await Room.create({ members: [userID, otherUserID] });
    room = await Room.findById(room._id).populate({
      path: 'members',
      select: 'username profilePic',
    });
    return res.status(StatusCodes.CREATED).json({
      success: true,
      room,
      message: 'room successfully created',
    });
  } catch (error) {
    next(error);
  }
};
export const deleteRoom = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
