"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserBody = void 0;
const handleResponse_1 = require("../../utils/handleResponse");
const helper_1 = require("../../utils/helper");
const validations_1 = require("../../utils/validations");
const logging_1 = __importDefault(require("./../../library/logging"));
const validateUserBody = (req, res, next) => {
    validations_1.userSchemaValidation
        .validateAsync(req.body, { abortEarly: false })
        .then((_value) => {
        next();
    })
        .catch((error) => {
        const errorDetails = (0, helper_1.formatValidationError)(error);
        logging_1.default.error(errorDetails);
        return (0, handleResponse_1.handleResponse)(res, 400, error.message, errorDetails);
    });
};
exports.validateUserBody = validateUserBody;
