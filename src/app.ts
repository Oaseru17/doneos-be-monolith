import 'reflect-metadata';
import './dependencyInjection/container';
import { CONFIG } from "./config/config";
import LOG from "./library/logging";
import { banner } from "./library/banner";
import createServer from "./bootstrap/server";

const app = createServer();

/** Start Server */
const StartServer = () => {
  LOG.info("Server is starting");
  banner();

  app.listen(CONFIG.SERVER.PORT, () => LOG.info(`Server is running on port ${CONFIG.SERVER.PORT}`));
};

/** Start the server */
StartServer();
