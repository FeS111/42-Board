import { model, Schema } from 'mongoose';
import { Post as IPost } from '../interfaces/post.interface';
import { Reaction as IReaction } from '../interfaces/reaction.interface';
import { userSchema } from './user.model';

const createTs = () => {
  return new Date().getTime();
};

const reactionSchema: any = {
  emote: { type: String, required: true },
  ts: {
    type: Number,
    default: createTs
  },
  user: { type: userSchema, required: true }
};

const votesSchema: any = {
  up: Boolean,
  user: userSchema
};

const repliesSchema: any = {
  text: { type: String, required: true },
  votes: { type: [votesSchema], default: [] },
  ts: {
    type: Number,
    default: createTs
  },
  user: { type: userSchema, required: true }
};

const commentsSchema: any = {
  text: { type: String, required: true, minlength: 3 },
  votes: { type: [votesSchema], default: [] },
  ts: {
    type: Number,
    default: createTs
  },
  replies: { type: [repliesSchema], default: [] },
  user: { type: userSchema, required: true }
};

const postSchema = new Schema<IPost>({
  name: { type: String, required: true, minlength: 3 },
  content: { type: String, required: true, minlength: 5 },
  votes: { type: [votesSchema], default: [] },
  votesScore: { type: Number, default: 0 },
  reactions: { type: [reactionSchema], default: [] },
  comments: { type: [commentsSchema], default: [] },
  user: { type: userSchema, required: true },
  tags: { type: [String], default: [] },
  ts: {
    type: Number,
    default: createTs
  }
});

export const Post = model<IPost>('Post', postSchema);
