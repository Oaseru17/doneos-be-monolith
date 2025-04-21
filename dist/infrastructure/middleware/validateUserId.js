"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserId = void 0;
const handleResponse_1 = require("../../utils/handleResponse");
const helper_1 = require("../../utils/helper");
const validations_1 = require("../../utils/validations");
const logging_1 = __importDefault(require("./../../library/logging"));
const validateUserId = (req, res, next) => {
    const { userId } = req.params;
    validations_1.userIdSchemaValidation
        .validateAsync(userId, { abortEarly: false })
        .then((_value) => {
        next();
    })
        .catch((error) => {
        const errorDetails = (0, helper_1.formatValidationError)(error);
        logging_1.default.error(errorDetails);
        return (0, handleResponse_1.handleResponse)(res, 400, error.message, errorDetails);
    });
};
exports.validateUserId = validateUserId;
