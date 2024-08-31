import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  text: {
    story: {
      type: String,
      default: '',
    },
    bg: {
      type: String,
      default: '',
    },
  },
  url: {
    public_id: {
      type: String,
      default: '',
    },
    storyUrl: {
      type: String,
      default: '',
    },
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
  createdAt: { type: Date, default: Date.now, expires: '24h' }, // TTL index
});
export default mongoose.model('stories', storySchema);
