import express from "express";
import { container } from "tsyringe";
import { HealthController } from "../infrastructure/health/healthController";

const router = express.Router();
const controller = container.resolve(HealthController);

router.get("/", controller.healthCheck);

router.get("/readiness", controller.readinessCheck);

export = router;
