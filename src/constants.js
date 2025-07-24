import 'dotenv/config';

const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV;
const APP_URL = NODE_ENV === 'production' ? process.env.APP_URL : `http://localhost:${PORT}`;
const WHITELIST = process.env.WHITELIST || ['http://localhost:5175/'];
const MONGO_URL = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN;
const MAIL_SERVICE = process.env.MAIL_SERVICE;
const MAIL_PORT = process.env.MAIL_PORT;
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_OAUTH_URL = process.env.GOOGLE_OAUTH_URL;
const GOOGLE_ACCESS_TOKEN_URL = process.env.GOOGLE_ACCESS_TOKEN_URL;
const GOOGLE_TOKEN_INFO_URL = process.env.GOOGLE_TOKEN_INFO_URL;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;
const GOOGLE_OAUTH_SCOPES = [
  'https%3A//www.googleapis.com/auth/userinfo.email',
  'https%3A//www.googleapis.com/auth/userinfo.profile',
];
const CLOUD_NAME = process.env.CLOUD_NAME;
const CLOUD_API_KEY = process.env.CLOUD_API_KEY;
const CLOUD_API_SECRET = process.env.CLOUD_API_SECRET;

export {
  APP_URL,
  PORT,
  WHITELIST,
  MONGO_URL,
  NODE_ENV,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
  MAIL_SERVICE,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASS,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_OAUTH_URL,
  GOOGLE_ACCESS_TOKEN_URL,
  GOOGLE_TOKEN_INFO_URL,
  GOOGLE_CALLBACK_URL,
  GOOGLE_OAUTH_SCOPES,
  CLOUD_API_SECRET,
  CLOUD_API_KEY,
  CLOUD_NAME,
};
