import { Reaction } from './reaction.interface';
import { User } from './user.interface';
import { Vote } from './vote.interface';

export interface Post {
  _id?: string;
  name: string;
  content: string;
  votes: Vote[];
  votesScore: number;
  tags: string[];
  reactions: Reaction[];
  comments: Comment[];
  user: User;
  ts: number;
}