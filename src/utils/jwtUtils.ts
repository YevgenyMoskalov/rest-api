import jwt from 'jsonwebtoken';
import { TOKEN_LIFETIME } from './constants';
import { TokenPayload } from '../interfaces/tokenPayload';
import { IUser } from '../interfaces/user.interface';

export function genWebToken(user: IUser) {
  return jwt.sign({ id: user.id }, process.env.SECRET_KEY as string, { expiresIn: TOKEN_LIFETIME });
}

export function getWebTokenData(authorizationHeader: string) {
  const token = authorizationHeader.split(' ')[1];
  return jwt.decode(token) as TokenPayload;
}
