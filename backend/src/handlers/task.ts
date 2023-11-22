import { RequestHandler } from 'express';
import prisma from '../db';
import { AuthedRequest } from '../modules/auth';
import { ErrorTypes, handleMiddleError } from '../middleware';

export const getTasks: RequestHandler = async (req, res, next) => {
    try {
        res.json({ data: await prisma.task.findMany() });
    } catch (e) {
        handleMiddleError(e, ErrorTypes.Server, next);
    }
};

export const getTask: RequestHandler = async (req, res, next) => {
    try {
        const id = req.body.id;

        return res.json(
          { data: await prisma.task.findUnique({ where: { id } }) });
    } catch (e) {
        handleMiddleError(e, ErrorTypes.Input, next);
    }
};

export const getTasksBySubject: RequestHandler = async (req, res, next) => {
    try {
        const subjectId = req.body.id;

        res.json(
          { data: await prisma.task.findMany({ where: { subjectId } }) });
    } catch (e) {
        handleMiddleError(e, ErrorTypes.Input, next);
    }
};

export const getCompletedTasks: RequestHandler = async (
  req: AuthedRequest, res, next) => {
    try {
        res.json({
            data: await prisma.tasksOnUsers.findMany(
              {
                  where: { userId: req.user?.id },
                  include: { solvedTask: true },
              }),
        });
    } catch (e) {
        handleMiddleError(e, ErrorTypes.Unauthorized, next);
    }
};

export const getCompletedTasksBySubject: RequestHandler = async (
  req: AuthedRequest, res, next) => {
    try {
        const subjectId = req.body.subjectId;

        const tasks = prisma.tasksOnUsers.findMany(
          { where: { userId: req.user?.id, solvedTask: { subjectId } } });

        res.json({
            data: tasks,
        });
    } catch (e) {
        handleMiddleError(e, ErrorTypes.Unauthorized, next);
    }
};

export const createTask: RequestHandler = async (
  req: AuthedRequest, res, next) => {
    try {
        const { title, description, answer, subjectId } = req.body;
        const task = await prisma.task.create({
            data: {
                title,
                description,
                answer,
                subjectId: subjectId,
            },
        });

        res.json({ data: task });
    } catch (e) {
        handleMiddleError(e, ErrorTypes.Unauthorized, next);
    }
};

export const updateTask: RequestHandler = async (
  req: AuthedRequest, res, next) => {
    try {
        const id = req.params.id;
        const { title, description, answer, subjectId } = req.body;

        const updated = await prisma.task.update(
          {
              where: { author: { id: req.user?.id }, id },
              data: { title, description, answer, subjectId },
          });

        res.json({ data: updated });
    } catch (e) {
        handleMiddleError(e, ErrorTypes.Unauthorized, next);
    }
};

export const deleteTask: RequestHandler = async (
  req: AuthedRequest, res, next) => {
    try {
        const deleted = await prisma.task.delete({
            where: { author: { id: req.user?.id }, id: req.params.id },
        });

        res.json({ data: deleted });
    } catch (e) {
        handleMiddleError(e, ErrorTypes.Unauthorized, next);
    }
};

