export default () => ({
  NODE_ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.PORT, 10) || 3001,
  BASE_URI: process.env.BASE_URI || 'http://localhost',
  API_PREFIX: process.env.API_PREFIX,
  HTTP_TIMEOUT: parseInt(process.env.HTTP_TIMEOUT, 10) || 5000,
  HTTP_MAX_REDIRECTS: parseInt(process.env.HTTP_MAX_REDIRECTS, 10) || 5,
  API_BY_CONFIG_URI: process.env.API_BY_CONFIG_URI,
  API_BY_RESOURCE_URI: process.env.API_BY_RESOURCE_URI,
  API_BY_USER_URI: process.env.API_BY_USER_URI,
  API_LOG_URI: process.env.API_LOG_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRED_TIME: process.env.JWT_EXPIRED_TIME,
  MONGODB_URI_BY_USER: process.env.MONGODB_URI_BY_USER
});