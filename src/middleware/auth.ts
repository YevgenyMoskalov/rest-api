import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserIdError from '../error/UserIdentificationError';
import UserAuthorizationError from '../error/UserAuthorizationError ';
import { TokenPayload } from '../interfaces/tokenPayload';
import redisClient from '../utils/redis-client';

// eslint-disable-next-line consistent-return
export function auth(req: Request, res: Response, next: NextFunction): Response | undefined {
  try {
    const authHeader = req.headers.authorization as string;
    const token = authHeader.split(' ')[1];
    const payload: TokenPayload = jwt.decode(token) as TokenPayload;
    if (req.body.id && req.body.id !== payload.id) {
      return res.status(400).json(new UserIdError('Invalid user ID'));
    }
    if (redisClient.exists(token) <= 0) {
      return res.status(401).json(new UserAuthorizationError('User authorization failed'));
    }
    next();
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json(error);
  }
}
