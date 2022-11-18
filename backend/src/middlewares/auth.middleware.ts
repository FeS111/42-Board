import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) res.redirect('/auth/login');
  next();
};
