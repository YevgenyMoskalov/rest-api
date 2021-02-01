import { Request, Response } from 'express';
import request from 'request';
import redisClient from '../utils/redis-client';
import * as jwt from '../utils/jwtUtils';
import { TokenPayload } from '../interfaces/tokenPayload';
import { TOKEN_LIFETIME } from '../utils/constants';

export async function getLatency(req: Request, res: Response) {
  try {
    const DEFAULT_URL = 'http://google.com';
    const time = process.hrtime();
    request(DEFAULT_URL);
    const latency = process.hrtime(time);

    const bearerToken = req.headers.authorization as string;
    const payload: TokenPayload = jwt.getWebTokenData(bearerToken) as TokenPayload;
    redisClient.set(bearerToken.split(' ')[1], payload.id, 'EX', TOKEN_LIFETIME);
    return res.json({ latency: `${latency[0] * 1e9 + latency[1]} nanoseconds` });
  } catch (error) {
    return res.status(500).json(error);
  }
}
