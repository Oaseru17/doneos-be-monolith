"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = __importDefault(require("../../library/logging"));
const healthCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        status: "UP",
        uptime: process.uptime()
    });
});
const readinessCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({
            status: "UP",
            reasons: ["DB OK"]
        });
    }
    catch (err) {
        logging_1.default.error(err);
        res.status(500).json({
            status: "DOWN",
            reasons: ["Unable to connect with DB"]
        });
    }
});
exports.default = { healthCheck, readinessCheck };
