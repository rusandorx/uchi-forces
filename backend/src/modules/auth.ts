import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';

export const comparePasswords: typeof bcrypt.compare = (password, hash) =>
  bcrypt.compare(password, hash);

export const hashPassword = (password: string) =>
  bcrypt.hash(password, 7);

export const createJWT = (user: { id: number, email: string }) =>
  jwt.sign({
      id: user.id,
      email: user.email,
  }, process.env.JWT_SECRET!);

export const protect: RequestHandler = (req, res, next) => {
    const bearer = req.headers.authorization;

    if (!bearer) {
        res.status(401);
        return res.json({ message: 'probably forgot authorization token' });
    }

    const [, token] = bearer.split(' ');

    if (!token) {
        res.status(401);
        return res.json(
          { message: 'probably forgot to assign token to bearer' });
    }

    try {
        // @ts-ignore-next-line
        req.user = jwt.verify(token, process.env.JWT_SECRET!);
        next();
    } catch (e) {
        console.error(e);
        res.status(401);
        return res.json({ message: 'incorrect jwt token' });
    }
};
