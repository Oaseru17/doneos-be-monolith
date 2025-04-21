"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const healthController_1 = __importDefault(require("../infrastructure/health/healthController"));
const router = express_1.default.Router();
router.get("/", healthController_1.default.healthCheck);
router.get("/readiness", healthController_1.default.readinessCheck);
module.exports = router;
