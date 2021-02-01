import { Router } from 'express';
import * as latencyController from '../services/latency.service';
import * as middleware from '../middleware/auth';

const latencyRouter = Router();

latencyRouter.get('/latency', middleware.auth, latencyController.getLatency);

export default latencyRouter;
