////////////////////////////////////////////////////////////////////
import { register, login, logout, refresh } from '../services/auth.js';
import { THIRTY_DAYS } from '../constants/user.js';
////////////////////////////////////////////////////////////////////
const setupSession = (res, session) => {
  //
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  //
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
};
////////////////////////////////////////////////////////////////////
export const registerUserController = async (req, res) => {
  //
  const user = await register(req.body);
  //
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user !',
    data: {
      name: user.name,
      email: user.email,
    },
  });
};
////////////////////////////////////////////////////////////////////
export const loginUserController = async (req, res) => {
  //
  const session = await login(req.body);
  //
  setupSession(res, session);
  //
  res.status(200).json({
    status: 200,
    message: 'Successfully login a user !',
    data: {
      accessToken: session.accessToken,
    },
  });
};
////////////////////////////////////////////////////////////////////
export const refreshUserSessionController = async (req, res) => {
  //
  const session = await refresh({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });
  //
  setupSession(res, session);
  //
  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
////////////////////////////////////////////////////////////////////
export const logoutUserController = async (req, res) => {
  //
  if (req.cookies.sessionId) {
    await logout(req.cookies.sessionId);
  }
  //
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  //
  res.status(204).send();
};
////////////////////////////////////////////////////////////////////
