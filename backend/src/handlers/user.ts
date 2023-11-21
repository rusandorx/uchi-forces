import prisma from '../db';
import { RequestHandler } from 'express';
import { comparePasswords, createJWT, hashPassword } from '../modules/auth';

export const createNewUser: RequestHandler = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(401);
        return res.json(
          { message: 'no email or password' });
    }
    const user = await prisma.user.create({
        data: {
            email: req.body.email,
            password: await hashPassword(req.body.password),
        },
    });

    const token = createJWT(user);
    res.json({ token });
};

export const signIn: RequestHandler = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(401);
        return res.json(
          { message: 'no email or password' });

    }
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
};
