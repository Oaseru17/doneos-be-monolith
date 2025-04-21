"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchemaValidation = exports.userIdSchemaValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userIdSchemaValidation = joi_1.default.string().required();
exports.userSchemaValidation = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required()
});
