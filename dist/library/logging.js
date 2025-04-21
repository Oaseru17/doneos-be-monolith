"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verbose = exports.debug = exports.warn = exports.error = exports.log = void 0;
const winston_1 = require("winston");
const config_1 = require("../config/config");
const api_1 = __importDefault(require("@opentelemetry/api"));
const logger = (0, winston_1.createLogger)({
    level: config_1.CONFIG.LOG_LEVEL,
    format: winston_1.format.combine(winston_1.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss"
    }), winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.json()),
    defaultMeta: { service: config_1.CONFIG.SERVICE_NAME },
    transports: [new winston_1.transports.File({ filename: `${config_1.CONFIG.SERVICE_NAME}-logs.log` })]
});
logger.add(new winston_1.transports.Console({
    format: winston_1.format.combine(winston_1.format.colorize())
}));
const addSpanEvent = (message) => {
    const activeSpan = api_1.default.trace.getSpan(api_1.default.context.active());
    if (activeSpan) {
        activeSpan.addEvent(JSON.stringify(message));
    }
};
const log = (message) => {
    addSpanEvent(message);
    logger.info(message);
};
exports.log = log;
const error = (message) => {
    addSpanEvent(message);
    logger.error(message);
};
exports.error = error;
const warn = (message) => {
    addSpanEvent(message);
    logger.warn(message);
};
exports.warn = warn;
const debug = (message) => {
    addSpanEvent(message);
    logger.debug(message);
};
exports.debug = debug;
const verbose = (message) => {
    addSpanEvent(message);
    logger.verbose(message);
};
exports.verbose = verbose;
exports.default = logger;
