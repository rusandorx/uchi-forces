import { RequestHandler } from 'express';
import prisma from '../db';
import { ErrorTypes, handleMiddleError } from '../middleware';

export const getSubjects: RequestHandler = async (req, res, next) => {
    try {
        return res.json({ data: await prisma.subject.findMany() });
    } catch (e) {
        handleMiddleError(e, ErrorTypes.Server, next);
    }
};

export const getSubject: RequestHandler = async (req, res, next) => {
    try {
        const id = req.params.id;
        res.json({ data: await prisma.subject.findUnique({ where: { id }, include: {tasks: true} }) });
    } catch (e) {
        handleMiddleError(e, ErrorTypes.Input, next);
    }
};
