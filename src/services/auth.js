////////////////////////////////////////////////////////////////////
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendMail.js';
import { randomBytes } from 'crypto';
import { SessionsCollection } from '../db/models/session.js';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/user.js';
import { UsersCollection } from '../db/models/user.js';
import { SMTP, TEMPLATES_DIR } from '../constants/index.js';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
////////////////////////////////////////////////////////////////////
const createSession = () => {
  //
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  //
  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};
////////////////////////////////////////////////////////////////////
export const signup = async (payload) => {
  //
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }
  //
  const hashPassword = await bcrypt.hash(payload.password, 10);
  //
  return await UsersCollection.create({ ...payload, password: hashPassword });
};
////////////////////////////////////////////////////////////////////
export const login = async (payload) => {
  //
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(401, 'Email not found !');
  }
  //
  const passwordCompare = await bcrypt.compare(payload.password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Please check your password');
  }
  //
  await SessionsCollection.deleteOne({ userId: user._id });
  //
  const sessionData = createSession();
  //
  return await SessionsCollection.create({
    userId: user._id,
    ...sessionData,
  });
};
////////////////////////////////////////////////////////////////////
export const current = async ({ sessionId, refreshToken }) => {
  //
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
  //
  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);
  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }
  //
  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });
  //
  const newSession = createSession();
  //
  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};
////////////////////////////////////////////////////////////////////
export const logout = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};
////////////////////////////////////////////////////////////////////
export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: getEnvVar(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
  });
};
////////////////////////////////////////////////////////////////////
export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};
////////////////////////////////////////////////////////////////////
