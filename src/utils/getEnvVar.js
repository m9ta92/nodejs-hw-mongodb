import dotenv from 'dotenv';

dotenv.config();

//  Функція, яка забезпечує доступ до змінних оточення
export function getEnvVar(name, defaultValue) {
  const value = process.env[name];

  if (value) return value;

  if (defaultValue) return defaultValue;

  throw new Error(`Missing: process.env['${name}'].`);
}
