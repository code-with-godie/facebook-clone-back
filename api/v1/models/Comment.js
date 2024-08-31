import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'please provide a comment title'],
    },

    postID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'posts',
      required: [true, 'please provide the post ID'],
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: [true, 'please provide the user ID'],
    },
    type: {
      type: String,
      enum: ['text', 'video', 'image'],
      default: 'text',
    },
  },
  { timestamps: true }
);
export default mongoose.models?.comments ||
  mongoose.model('comments', commentSchema);
