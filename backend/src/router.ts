import { Router } from 'express';
import { body } from 'express-validator';
import { handleInputErrors } from './middleware';
import { getSubject, getSubjects } from './handlers/subject';
import {
    createTask, deleteTask,
    getCompletedTasks,
    getCompletedTasksBySubject,
    getTask,
    getTasks,
    getTasksBySubject,
    updateTask,
} from './handlers/task';

const router = Router();

/**
 * Subjects
 */

router.get('/subject', getSubjects);
router.get('/subject/:id', getSubject);

/**
 * Tasks
 */

router.get('/task', getTasks);
router.get('/task/:id', getTask);
router.get('/completed-tasks', getCompletedTasks);
router.get('/tasks-by-subject/:id', getTasksBySubject);
router.get('/completed-tasks-by-subject/:id', getCompletedTasksBySubject);
router.put('/task/:id', updateTask);
router.post('/task',
  body(['title', 'description', 'answer', 'subject']).
    exists().
    isString().
    ltrim().
    rtrim().
    notEmpty(),
  handleInputErrors, createTask);
router.delete('/task/:id', deleteTask);

export default router;
