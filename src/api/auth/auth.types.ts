/**
 * Auth API request/response shapes.
 *
 * These describe the backend contract for the sign-in flow so the query hooks
 * and screens share one source of truth. Fields we don't consume yet are typed
 * loosely (the backend returns a large user object); tighten as needed.
 */
import type { UserLogObj } from '../core/deviceInfo';

/** POST /authenticate request body. */
export interface TokenRequest {
  userLogObj: UserLogObj;
  username: string;
  /** AES-encrypted password (see aes.ts). */
  password: string;
}

/** POST /authenticate response body. */
export interface TokenResponse {
  accessToken: string;
  /** Session lifetime in milliseconds. */
  expiryDuration: number;
  refreshToken?: string;
  [key: string]: any;
}

/** The user object nested under `data` in the /landingPageInfo response. */
export interface UserInfo {
  companyKey?: string;
  colorTheme?: string;
  encryptionYN?: 'Y' | 'N';
  userId?: string;
  userName?: string;
  emailId?: string;
  [key: string]: any;
}

/** GET /landingPageInfo response body. */
export interface UserInfoResponse {
  data: UserInfo;
  [key: string]: any;
}
