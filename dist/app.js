"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config/config");
const logging_1 = __importDefault(require("./library/logging"));
const banner_1 = require("./library/banner");
const server_1 = __importDefault(require("./utils/server"));
const app = (0, server_1.default)();
const StartServer = () => {
    logging_1.default.info("Server is starting");
    (0, banner_1.banner)();
    app.listen(config_1.CONFIG.SERVER.PORT, () => logging_1.default.info(`Server is running on port ${config_1.CONFIG.SERVER.PORT}`));
};
StartServer();
