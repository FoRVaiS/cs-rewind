/*
 * Error Categories
 *  - Server
 *  - Client
 *
 * There should be no more than 128 errors per category
 */

export const SERVER_ERROR = 0 << 8;
export const CLIENT_ERROR = 1 << 8;

export const ERROR_UNKNOWN = -1;

export const ERROR_INVALID_PASSWORD_FORMAT = CLIENT_ERROR | 1;
export const ERROR_INVALID_EMAIL_FORMAT = CLIENT_ERROR | 2;
export const ERROR_INVALID_CREDENTIALS = CLIENT_ERROR | 3;
export const ERROR_ACCOUNT_ALREADY_EXISTS = CLIENT_ERROR | 4;

export const ERROR_API_NOT_REACHABLE = SERVER_ERROR | 1;
