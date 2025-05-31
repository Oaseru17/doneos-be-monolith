import express, { Request, Response, NextFunction } from "express";
import LOG from "../library/logging";

// routes
import healthRoutes from "../routes/health";
import authRoutes from "../domains/user/routes/auth";
import { errorHandler } from "../infrastructure/middleware/errorHandler";
import valueZoneRoutes from "../domains/valueZone/routes/valueZoneRoutes";
import taskRoutes from "../domains/task/routes/taskRoutes";

const createServer = () => {
  const app = express();

  /** Log the request */
  app.use((req, res, next) => {
    /** Log the req */
    LOG.info(`Incoming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on("finish", () => {
      /** Log the res */
      LOG.info(
        `Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`
      );
    });

    next();
  });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  /** Rules of our API */
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-reliance-authorization");

    if (req.method == "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      res.status(200).json({});
      return;
    }

    next();
  });

  /** Routes */

  /** Health check */
  app.use("/v1/health", healthRoutes);
  app.use("/v1/auth", authRoutes);
  app.use("/v1/value-zones", valueZoneRoutes);
  app.use("/v1/tasks", taskRoutes);

  /** Error handling */
  app.use(errorHandler);

  return app;
};

export default createServer;
