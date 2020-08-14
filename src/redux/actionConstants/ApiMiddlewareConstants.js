import { CALL_API as callAPI } from '@aftonbladet/redux-api-middleware';

export const CALL_API = callAPI;
export const API_MIDDLEWARE_REQUEST = process.env.NODE_ENV === 'test' ? 'API_MIDDLEWARE_REQUEST' : null;
