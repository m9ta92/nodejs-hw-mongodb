////////////////////////////////////////////////////////////////////
import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
  signupUserSchema,
} from '../validation/auth.js';
import {
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  registerUserController,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
////////////////////////////////////////////////////////////////////
const authRouter = Router();
////////////////////////////////////////////////////////////////////
authRouter.post(
  '/signup',
  validateBody(signupUserSchema),
  ctrlWrapper(registerUserController),
);
////////////////////////////////////////////////////////////////////
authRouter.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);
////////////////////////////////////////////////////////////////////
authRouter.post('/logout', ctrlWrapper(logoutUserController));
////////////////////////////////////////////////////////////////////
authRouter.get('/current', ctrlWrapper(refreshUserSessionController));
////////////////////////////////////////////////////////////////////
authRouter.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);
////////////////////////////////////////////////////////////////////
authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);
////////////////////////////////////////////////////////////////////
export default authRouter;
