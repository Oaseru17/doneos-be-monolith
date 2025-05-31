import dotenv from "dotenv-safe";
import { ProjectConfiguration } from "../types/config";

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 1337;

const SERVICE_NAME = process.env.SERVICE_NAME || "PaymentAdapterGenericService";
const LOG_LEVEL = process.env.LOG_LEVEL || "info";

const SHARED_SECRETS = process.env.SHARED_SECRETS || "";
const JWT_SECRET = process.env.JWT_SECRET || "";
const MONGODB_URI = process.env.MONGODB_URI || "";
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "";

// this will contain global configs for the project
export const CONFIG: ProjectConfiguration = {
  SERVER: {
    PORT: SERVER_PORT
  },
  SERVICE_NAME,
  LOG_LEVEL,
  SHARED_SECRETS,
  JWT_SECRET,
  MONGODB_URI,
  MONGODB_DB_NAME
};
