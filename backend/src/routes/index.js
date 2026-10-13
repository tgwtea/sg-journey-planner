import { Router } from 'express';
import healthRoutes from './health.routes.js';
import weatherRoutes from './weather.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/weather', weatherRoutes);

// Add feature routers here, for example:
// router.use('/transport', transportRoutes);
// router.use('/reports', reportRoutes);

export default router;
