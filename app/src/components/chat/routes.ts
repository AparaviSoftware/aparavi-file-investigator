import { Router } from 'express';
import { ChatController } from './controller';

const router: Router = Router();
const chatController = new ChatController();

// Text/JSON chat endpoint
router.post('/chat', chatController.chat.bind(chatController));

export default router;
