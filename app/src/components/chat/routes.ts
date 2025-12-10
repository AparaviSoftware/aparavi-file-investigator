import { Router } from 'express';
import ChatController from './controller';

const router: Router = Router();

// Text/JSON chat endpoint
router.post('/chat', ChatController.chat);

export default router;
