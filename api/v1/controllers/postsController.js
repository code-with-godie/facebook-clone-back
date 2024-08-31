import Posts from '../models/Post.js';
import Users from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import NotFoundError from '../../../errors/not-found.js';
import BadRequestError from '../../../errors/bad-request.js';

export const createPost = async (req, res, next) => {
  try {
    const {
      user: { userID },
      body: { caption, url, postType },
      // file: { secure_url, public_id },
    } = req;
    const secure_url = url;
    const public_id = Date.now().toString();
    let post = await Posts.create({
      caption,
      postType,
      url: { public_id, postUrl: secure_url },
      user: userID,
    });
    post = await Posts.findById(post._id).populate({
      path: 'user',
      select: 'username profilePic name followings ',
    });

    return res.status(StatusCodes.OK).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};
export const getAllPosts = async (req, res, next) => {
  try {
    const {
      user: { userID },
    } = req;
    let user = null;
    let posts = null;
    user = await Users.findById(userID);
    if (!user) {
      throw new NotFoundError('no user found with the provided userID');
    }
    if (user) {
      const { followings } = user;
      posts = await Posts.find({ user: { $in: [followings] } })
        .populate({
          path: 'user',
          select: 'username profilePic name followings ',
        })
        .sort({ createdAt: -1 });

      if (posts.length < 30) {
        const Anotherposts = await Posts.find({
          user: { $nin: [followings, user._id] },
        })
          .populate({
            path: 'user',
            select: 'username profilePic name followings ',
          })
          .sort({ createdAt: -1 });
        posts = [...posts, ...Anotherposts];
      }
      if (posts.length < 30) {
        const Anotherposts = await Posts.find({})
          .populate({
            path: 'user',
            select: 'username profilePic name followings ',
          })
          .sort({ createdAt: -1 });
        posts = [...posts, ...Anotherposts];
      }

      return res
        .status(StatusCodes.OK)
        .json({ success: true, nbHits: posts.length, posts });
    }

    posts = await Posts.find({})
      .populate({
        path: 'user',
        select: 'username profilePic name followings ',
      })
      .sort({ createdAt: -1 });
    return res
      .status(StatusCodes.OK)
      .json({ success: true, nbHits: posts.length, posts });
  } catch (error) {
    next(error);
  }
};
export const getFollowingsPosts = async (req, res, next) => {
  try {
    const {
      user: { userID },
    } = req;
    const user = await Users.findById(userID);
    if (!user) {
      throw new BadRequestError('no user with the provided id');
    }

    const posts = await Posts.find({
      user: { $in: user.followings },
    }).populate({
      path: 'user',
      select: 'username profilePic name ',
    });
    return res
      .status(StatusCodes.OK)
      .json({ success: true, nbHits: posts.length, posts });
  } catch (error) {
    next(error);
  }
};
export const getUserAllPosts = async (req, res, next) => {
  try {
    const {
      params: { id: userID, slug },
    } = req;
    const user = await Users.findById(userID);
    if (!user) {
      throw new BadRequestError('no user with the provided id');
    }
    let posts = [];
    if (slug.trim() === 'image') {
      posts = await Posts.find({
        $and: [{ user: userID }, { postType: 'image' }],
      })
        .populate({
          path: 'user',
          select: 'username profilePic name ',
        })
        .sort({ createdAt: -1 });
      return res
        .status(StatusCodes.OK)
        .json({ success: true, nbHits: posts.length, posts });
    }
    if (slug.trim() === 'video') {
      posts = await Posts.find({
        $and: [{ user: userID }, { postType: 'video' }],
      })
        .populate({
          path: 'user',
          select: 'username profilePic name ',
        })
        .sort({ createdAt: -1 });
      return res
        .status(StatusCodes.OK)
        .json({ success: true, nbHits: posts.length, posts });
    }
    if (slug.trim() === 'all') {
      posts = await Posts.find({
        user: userID,
        // $and: [{ user: userID }, { postType: 'video' }],
      })
        .populate({
          path: 'user',
          select: 'username profilePic name ',
        })
        .sort({ createdAt: -1 });
      return res
        .status(StatusCodes.OK)
        .json({ success: true, nbHits: posts.length, posts });
    }
    if (slug.trim() === 'liked') {
      posts = await Posts.find({ likes: { $in: userID } })
        .populate({
          path: 'user',
          select: 'username profilePic name ',
        })
        .sort({ createdAt: -1 });
      return res
        .status(StatusCodes.OK)
        .json({ success: true, nbHits: posts.length, posts });
    }
    if (slug.trim() === 'favourite') {
      posts = await Posts.find({ bookmarks: { $in: userID } })
        .populate({
          path: 'user',
          select: 'username profilePic name ',
        })
        .sort({ createdAt: -1 });
      return res
        .status(StatusCodes.OK)
        .json({ success: true, nbHits: posts.length, posts });
    }

    posts = await Posts.find({ user: userID })
      .populate({
        path: 'user',
        select: 'username profilePic name ',
      })
      .sort({ createdAt: -1 });
    return res
      .status(StatusCodes.OK)
      .json({ success: true, nbHits: posts.length, posts });
  } catch (error) {
    next(error);
  }
};
export const getVideos = async (req, res, next) => {
  try {
    const {
      params: { slug },
    } = req;
    let posts = [];
    if (slug.trim() === 'saved') {
      posts = await Posts.find({ postType: 'video' })
        .populate({
          path: 'user',
          select: 'username profilePic name ',
        })
        .sort({ createdAt: -1 });
      return res
        .status(StatusCodes.OK)
        .json({ success: true, nbHits: posts.length, posts });
    }

    posts = await Posts.find({ postType: 'video' })
      .populate({
        path: 'user',
        select: 'username profilePic name ',
      })
      .sort({ createdAt: -1 });
    return res
      .status(StatusCodes.OK)
      .json({ success: true, nbHits: posts.length, posts });
  } catch (error) {
    next(error);
  }
};
export const getSavedPosts = async (req, res, next) => {
  try {
    const {
      user: { userID },
    } = req;
    const user = await Users.findById(userID);
    if (!user) {
      throw new BadRequestError('no user with the provided id');
    }
    const postIDS = user.saved?.map(item => item);
    const posts = await Posts.find({ _id: { $in: postIDS } })
      .populate({
        path: 'user',
        select: 'username profilePic name ',
      })
      .sort({ createdAt: -1 });
    return res
      .status(StatusCodes.OK)
      .json({ success: true, nbHits: posts.length, posts });
  } catch (error) {
    next(error);
  }
};
export const getSinglePost = async (req, res, next) => {
  try {
    const {
      params: { id: postID },
    } = req;
    const post = await Posts.findById(postID);
    if (!post) {
      throw new NotFoundError('no post with the provided id');
    }
    return res.status(StatusCodes.OK).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};
export const getSpecificPosts = async (req, res, next) => {
  try {
    const {
      params: { id: userID },
    } = req;
    const posts = await Posts.find({ userID });
    if (posts.length === 0) {
      throw new NotFoundError('you have no posts yet!!!');
    }
    return res.status(StatusCodes.OK).json({ success: true, posts });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const {
      params: { id: postID },
      user: { userID },
    } = req;
    let post = await Posts.findById(postID);
    if (!post) {
      throw new BadRequestError('no post with the provided id!');
    }
    if (post.userID !== userID) {
      throw new BadRequestError('you can only update your own posts!');
    }
    post = await Posts.findByIdAndUpdate(
      postID,
      { ...req.body },
      { new: true, runValidators: true }
    );
    return res.status(StatusCodes.OK).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};
export const deletePost = async (req, res, next) => {
  try {
    const {
      params: { id: postID },
      user: { userID },
    } = req;
    const post = await Posts.findById(postID);

    if (!post) {
      throw new BadRequestError('no post with the provided id!');
    }
    if (post.userID !== userID) {
      throw new NotFoundError('you can only delete your own posts!');
    }
    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: 'post  successfully deleted!' });
  } catch (error) {
    next(error);
  }
};
//like and unlike a post
export const toggleLikes = async (req, res, next) => {
  try {
    const {
      params: { id: postID },
      user: { userID: userID },
    } = req;
    let post = await Posts.findById(postID);
    if (!post) {
      throw new NotFoundError('no post with the provided id!');
    }
    if (!post.likes.includes(userID)) {
      post = await Posts.findByIdAndUpdate(
        postID,
        { $push: { likes: userID } },
        { new: true, runValidators: true }
      );
      return res.status(StatusCodes.OK).json({
        success: true,
        message: `you successfully liked`,
        liked: true,
      });
    }
    post = await Posts.findByIdAndUpdate(
      postID,
      { $pull: { likes: userID } },
      { new: true, runValidators: true }
    );
    return res.status(StatusCodes.OK).json({
      success: true,
      message: `you successfully unliked`,
      liked: false,
    });
  } catch (error) {
    next(error);
  }
};
//bookmark and unbookmark a post
export const togglebookmarks = async (req, res, next) => {
  try {
    const {
      params: { id: postID },
      user: { userID: userID },
    } = req;
    let post = await Posts.findById(postID);
    if (!post) {
      throw new NotFoundError('no post with the provided id!');
    }
    if (!post.bookmarks.includes(userID)) {
      post = await Posts.findByIdAndUpdate(
        postID,
        { $push: { bookmarks: userID } },
        { new: true, runValidators: true }
      );
      return res.status(StatusCodes.OK).json({
        success: true,
        message: `you successfully bookmarked a post`,
        bookmarked: true,
      });
    }
    post = await Posts.findByIdAndUpdate(
      postID,
      { $pull: { bookmarks: userID } },
      { new: true, runValidators: true }
    );
    return res.status(StatusCodes.OK).json({
      success: true,
      message: `you successfully unbookmarked a post`,
      bookmarked: false,
    });
  } catch (error) {
    next(error);
  }
};
