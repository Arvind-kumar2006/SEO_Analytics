import { Router } from 'express';
import { createOrganization, getOrganization } from '../controllers/organizationController';

const router = Router();

router.post('/', createOrganization);
router.get('/:id', getOrganization);

export default router;
