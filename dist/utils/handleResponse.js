"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleResponse = void 0;
const handleResponse = (res, statusCode, message, data) => {
    res.status(statusCode).json(Object.assign({ message }, data));
};
exports.handleResponse = handleResponse;
