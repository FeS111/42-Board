import express, { Request, Response, NextFunction } from 'express';
import { registerAuthHandler } from './handlers/auth.handler';
import { router as postRouter } from './handlers/post.handler';
import { router as commentsRouter } from './handlers/comments.handler';
import { router as voteRouter } from './handlers/vote.handler';
import session from 'express-session';
import fileStore from 'session-file-store'
const cookieParser = require('cookie-parser');

import { PORT, FRONT, MODE } from './vars.global';
import cors from 'cors';

const app = express();

const FileStore = fileStore(session);

app.set('trust proxy', 1); // trust first proxy
if (MODE == 'DEV') app.use(cors({ origin: FRONT, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    store: new FileStore() ,
    secret: 'fkdisjkfijIDUHaundsais',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: MODE == 'DEV' ? false : true }
  })
);

registerAuthHandler(app);
app.use('/posts', postRouter);
app.use('/comments', commentsRouter);
app.use('/vote', voteRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status ?? 500).send(err.error ?? 'Something went wrong');
});

app.listen(Number(PORT), async () => {
  console.log(`Server is running in ${MODE} mode on Port '${PORT}' `);
});
