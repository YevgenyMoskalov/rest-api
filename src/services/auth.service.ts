import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import UserModel from '../models/user.schemas';
import * as jwt from '../utils/jwtUtils';
import { IUser } from '../interfaces/user.interface';
import UserIdError from '../error/UserIdentificationError';
import UserNotFoundError from '../error/UserNotFoundError';
import MissingParameterError from '../error/MissingParameterError';
import { REGEXP_EMAIL, REGEXP_PHONE, TOKEN_LIFETIME } from '../utils/constants';
import redisClient from '../utils/redis-client';
import UserAuthorizationError from '../error/UserAuthorizationError ';

function isValidId(id: string) {
  return REGEXP_EMAIL.test(id) || REGEXP_PHONE.test(id);
}

export async function create(req: Request, res: Response) {
  try {
    if (!isValidId(req.body.id)) {
      return res.status(400).json(new UserIdError('Invalid user ID'));
    }
    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(req.body.password, salt);

    const user: IUser = {
      id: req.body.id,
      idType: REGEXP_EMAIL.test(req.body.id) ? 'Email' : 'Phone',
      password,
    };
    await UserModel.create(user);

    const token = jwt.genWebToken(user);
    redisClient.set(token, user.id, 'EX', TOKEN_LIFETIME);

    return res.status(201).json({ token });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json(error);
  }
}

export async function getUserData(req: Request, res: Response) {
  try {
    const user = await UserModel.findOne({ id: req.body.id });
    const pasResult = bcrypt.compareSync(req.body.password, user.password);
    if (!pasResult) {
      return res.status(400).json(new UserAuthorizationError('Wrong password'));
    }
    if (!user) {
      return res.status(404).json(new UserNotFoundError('User not found'));
    }

    const token = jwt.genWebToken(user);
    redisClient.set(token, user.id, 'EX', TOKEN_LIFETIME);

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json(error);
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const { all } = req.query;
    if (!all) {
      return res.status(400).json(new MissingParameterError('Missing parameter all: true/false'));
    }
    if (all === 'true') {
      redisClient.flushall();
    } else if (all === 'false') {
      const authHeader = req.headers.authorization as string;
      const token = authHeader.split(' ')[1];
      redisClient.del(token);
    } else {
      return res.status(400).json(new MissingParameterError('Missing parameter all: true/false)'));
    }
    return res.status(204).json({ message: 'logout success!' });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json(error);
  }
}
