"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorized = void 0;
const logging_1 = __importDefault(require("../../library/logging"));
const isAuthorized = (req, res, next) => {
    let requestHeader;
    let sharedSecrets;
    requestHeader = String(req.headers["x-reliance-authorization"]);
    sharedSecrets = process.env.SHARED_SECRETS || "";
    const SECRETS = JSON.parse(sharedSecrets);
    if (SECRETS.indexOf(requestHeader) >= 0) {
        logging_1.default.debug("REQUEST WAS AUTHORISED");
        next();
    }
    else {
        logging_1.default.warn("Unauthorized request received");
        res.status(403).json({ error: "Missing or incorrect x-reliance-authorization header" });
    }
};
exports.isAuthorized = isAuthorized;
