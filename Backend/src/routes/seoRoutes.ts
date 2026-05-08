import { Router } from 'express';
import { analyzeSEO, getSEOReport } from '../controllers/seoController';

const router = Router();

router.post('/analyze/:organizationId', analyzeSEO);
router.get('/report/:reportId', getSEOReport);

export default router;
