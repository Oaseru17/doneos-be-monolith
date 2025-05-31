export type ProjectConfiguration = {
  SERVER: {
    PORT: number;
  };
  SERVICE_NAME: string;
  LOG_LEVEL: string;
  SHARED_SECRETS: string; 
  JWT_SECRET: string;
  MONGODB_URI: string;
  MONGODB_DB_NAME: string;
};

export type QueryObj = {
  limit: number;
  offset: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
};
