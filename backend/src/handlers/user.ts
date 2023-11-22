import prisma from '../db';
import { RequestHandler } from 'express';
import { comparePasswords, createJWT, hashPassword } from '../modules/auth';
import { ErrorTypes, handleMiddleError } from '../middleware';

export const createNewUser: RequestHandler = async (req, res, next) => {
    try {
        const user = await prisma.user.create({
            data: {
                email: req.body.email,
                password: await hashPassword(req.body.password),
            },
        });

        const token = createJWT(user);
        res.json({ token });
    } catch (e) {
        handleMiddleError(e, ErrorTypes.Input, next);
    }
};

export const signIn: RequestHandler = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: req.body.email,
            },
        });

        const isValid = user &&
          await comparePasswords(req.body.password, user.password);

        if (!isValid) {
            res.status(401);
            return res.json(
              { message: 'incorrect email or password' });
        }

        const token = createJWT(user);
        res.json({ token });
    } catch (e) {
        handleMiddleError(e, ErrorTypes.Input, next);
    }
};
