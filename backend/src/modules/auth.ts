import jwt from 'jsonwebtoken';
import { Request, RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import config from '../config';

export interface AuthedRequest extends Request {
    user?: { id: string };
}

export const comparePasswords: typeof bcrypt.compare = (password, hash) =>
  bcrypt.compare(password, hash);

export const hashPassword = (password: string) =>
  bcrypt.hash(password, 7);

export const createJWT = (user: { id: string, email: string }) =>
  jwt.sign({
      id: user.id,
      email: user.email,
  }, config.jwt);

export const protect: RequestHandler = (req: AuthedRequest, res, next) => {
    const bearer = req.headers.authorization;

    if (!bearer) {
        return res.status(401).
          json({ message: 'probably forgot authorization token' });
    }

    const [, token] = bearer.split(' ');

    if (!token) {
        return res.status(401).json(
          { message: 'probably forgot to assign token to bearer' });
    }

    try {
        req.user = jwt.verify(token, config.jwt) as AuthedRequest['user'];
        next();
    } catch (e) {
        console.error(e);
        return res.status(401).json({ message: 'incorrect jwt token' });
    }
};

const isAuthor = (user: User) => {
    // TODO: Do something with that ↓
    return false;
};
