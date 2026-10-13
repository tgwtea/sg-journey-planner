import { Router } from 'express';
import { getCurrentWeather } from '../controllers/weather.controller.js';

const router = Router();

// GET /api/weather?area=City
router.get('/', getCurrentWeather);

export default router;
