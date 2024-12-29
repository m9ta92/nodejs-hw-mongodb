import { login, register } from '../services/auth.js';
import { THIRTY_DAYS } from '../constants/user.js';

export const registerUserController = async (req, res) => {
  const user = await register(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user !',
    data: {
      name: user.name,
      email: user.email,
    },
  });
};

export const loginUserController = async (req, res) => {
  const session = await login(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully login a user !',
    data: {
      accessToken: session.accessToken,
    },
  });
};
