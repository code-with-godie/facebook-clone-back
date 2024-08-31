import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      default: '',
    },
    postType: {
      type: String,
      required: [true, 'please provide a post type'],
      enum: ['image', 'video', 'text'],
    },
    url: {
      public_id: {
        type: String,
        required: [true, 'please provide a post public id'],
      },
      postUrl: {
        type: String,
        required: [true, 'please provide a post url'],
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: [true, 'please provide userID for the post '],
    },
    likes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    },
    shares: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    },
    bookmarks: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    },
  },
  { timestamps: true }
);

export default mongoose.model('posts', postSchema);
