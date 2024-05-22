export enum KEYS {
  DOC = '_doc',
  ID = '_id',
  CLASS = 'class',
  CODE = 'code',
  VALUE = 'value',
  NAME = 'name',
  PARENT_CODE = 'parent_code',
  SYSTEM = 'system',
  CREATE_BY = 'create_by',
  CREATE_AT = 'create_at',
  CHANGE_BY = 'change_by',
  CHANGE_AT = 'change_at',
  LOG_ACTION = 'log_action',
  LOG_ID = 'log_id',
  LOG_BY = 'log_by',
  LOG_AT = 'log_at',
  ACTIVE_FLAG = 'active_flag',
  DEL_FLAG = 'del_flag',
  LOG_EXTENSION = '_log'
}

export enum LOG_ACTIONS {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE'
}

export enum RES {
  STATUS = 'status',
  RESULT = 'result',
  MESSAGE = 'message',
  ERROR = 'error',
  NUM = 'num',
}

export enum RES_STATUS {
  OK = 'OK',
  ERROR = 'ERROR',
  NG = 'NG'
}

export enum LOG_ACTION {
  INSERT = 'insert',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum ACCOUNT_STATUS {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
}
// ########################### ENVIRONMENT ###########################

export enum ENVIRONMENT {
  NODE_ENV = 'NODE_ENV',
  PORT = 'PORT',
  BASE_URI = 'BASE_URI',
  API_PREFIX = 'API_PREFIX',
  HTTP_TIMEOUT = 'HTTP_TIMEOUT',
  HTTP_MAX_REDIRECTS = 'HTTP_MAX_REDIRECTS',
  MONGODB_URI_LOG = 'MONGODB_URI_LOG',
  JWT_SECRET = 'JWT_SECRET',
  JWT_EXPIRED_TIME= 'JWT_EXPIRED_TIME',
  MONGODB_URI_BY_USER = 'MONGODB_URI_BY_USER'
}

export enum HISTOGRAM {
  URL = '/metrics',
  NAME = 'http_request_duration_seconds',
  HELP = 'HTTP request duration in seconds'
}

export enum ROLE {
  ROOT = 'root',
  ADMIN = 'admin',
  USER = 'user'
}

export const SYSTEM = 'by-org';


