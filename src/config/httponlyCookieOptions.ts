import { CookieOptions } from 'express';

const year = 1000 * 60 * 60 * 24 * 365;

export const httponlyCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  expires: new Date(new Date().getTime() + year),
  // sameSite: 'strict',
  sameSite: `none`,
  // sameSite: 'none',
  // domain: process.env.FRONTEND_DOMAIN
};
