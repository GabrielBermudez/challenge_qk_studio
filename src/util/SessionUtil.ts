import { Response } from 'express';

import EnvVars from '../constants/EnvVars';


/**
 * Remove cookie
 */
function clearCookie(res: Response): Response {
  const { Key, Options } = EnvVars.CookieProps;
  return res.clearCookie(Key, Options);
}

// **** Export default **** //

export default {
  clearCookie,
} as const;
