import 'reflect-metadata';
import './dependencyInjection/container';
import './dependencyInjection/taskContainer';
import { CONFIG } from "./config/config";
import LOG from "./library/logging";
import { banner } from "./library/banner";
import createServer from "./bootstrap/server";
import { connectMongoDB } from './config/mongodb';

const app = createServer();

/** Start Server */
const StartServer = async () => {
  LOG.info("Server is starting");
  banner();

  // Connect to MongoDB
  await connectMongoDB();

  app.listen(CONFIG.SERVER.PORT, () => LOG.info(`Server is running on port ${CONFIG.SERVER.PORT}`));
};

/** Start the server */
StartServer();
