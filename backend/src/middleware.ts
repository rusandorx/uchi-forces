import { ErrorRequestHandler, NextFunction, RequestHandler } from 'express';
import { validationResult } from 'express-validator';

export enum ErrorTypes {
    Unauthorized,
    Input,
    Server
}

export interface TypedError extends Error {
    type?: ErrorTypes;
}

export const handleInputErrors: RequestHandler = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err.type === ErrorTypes.Unauthorized)
        return res.status(401).json({ error: 'Unauthorized' });
    if (err.type === ErrorTypes.Input)
        return res.status(400).json({ error: 'Invalid input' });

    res.status(500).json({ error: 'Uncaught error on server side' });
};

export const handleMiddleError = (err: unknown, errType: ErrorTypes, next: NextFunction) => {
    if (err instanceof Error) {
        const typedError = err as TypedError;
        typedError.type = ErrorTypes.Input;
        next(typedError);
    }
}
