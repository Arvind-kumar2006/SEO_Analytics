import { Router } from 'express';
import { generateExecution } from '../controllers/executionController';

const router = Router();

router.post('/generate', generateExecution);

export default router;
