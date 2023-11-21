import { Router } from 'express';

const router = Router();

/**
 * Lessons
 */

router.get('/lesson', (req, res) => {
    res.json({message: 'hi there'});
});
router.get('/lesson/:id', () => {});
router.put('/lesson/:id', () => {});
router.post('/lesson', () => {});
router.delete('/lesson/:id', () => {});

/**
 * Tasks
 */

router.get('/task', () => {});
router.get('/task/:id', () => {});
router.put('/task/:id', () => {});
router.post('/task', () => {});
router.delete('/task/:id', () => {});

export default router;
