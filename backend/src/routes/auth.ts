import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';
const router = Router();

router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.get('/userinfo', authMiddleware, authController.userinfo);
router.post('/mfa/verify', authController.mfaVerify);
router.post('/logout', authController.logout);
router.post('/log', authController.log);

export default router; 