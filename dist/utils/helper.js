"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatValidationError = void 0;
const formatValidationError = (error) => {
    const errorDetails = error.details.map((err) => ({
        key: err.context.key,
        message: err.message
    }));
    return errorDetails;
};
exports.formatValidationError = formatValidationError;
