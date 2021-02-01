import { Request, Response } from 'express';
import UserModel from '../models/user.schemas';
import UserNotFoundError from '../error/UserNotFoundError';
import redisClient from '../utils/redis-client';
import { TOKEN_LIFETIME } from '../utils/constants';
import * as jwt from '../utils/jwtUtils';
import { TokenPayload } from '../interfaces/tokenPayload';

export async function getUserInfo(req: Request, res: Response) {
  try {
    const authorizationToken = req.headers.authorization as string;
    const payload: TokenPayload = jwt.getWebTokenData(authorizationToken);
    const user = await UserModel.findOne({ id: payload.id });
    if (!user) {
      res.status(404).json(new UserNotFoundError('User not found'));
    }
    const bearerToken = req.headers.authorization as string;
    const token = bearerToken.split(' ')[1];
    redisClient.set(token, user.id, 'EX', TOKEN_LIFETIME);

    return res.status(200).json({ idType: user.idType });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json(error);
  }
}
