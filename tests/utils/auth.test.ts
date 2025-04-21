import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { isAuthorized } from '../../src/infrastructure/middleware/auth';

describe('Auth Middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

    beforeEach(() => {
        mockRequest = {
            headers: {}
        } as Partial<Request>;

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as Partial<Response>;

        mockNext = jest.fn();

        // Mock environment variable
        process.env.SHARED_SECRETS = JSON.stringify(['secret1', 'secret2']);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should allow request with valid authorization header', () => {
        mockRequest.headers = {
            'x-reliance-authorization': 'secret1'
        };

        isAuthorized(
            mockRequest as Request,
            mockResponse as Response,
            mockNext as NextFunction
        );

        expect(mockNext).toHaveBeenCalled();
        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should reject request with invalid authorization header', () => {
        mockRequest.headers = {
            'x-reliance-authorization': 'invalid-secret'
        };

        isAuthorized(
            mockRequest as Request,
            mockResponse as Response,
            mockNext as NextFunction
        );

        expect(mockNext).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Missing or incorrect x-reliance-authorization header'
        });
    });

    it('should reject request with missing authorization header', () => {
        isAuthorized(
            mockRequest as Request,
            mockResponse as Response,
            mockNext as NextFunction
        );

        expect(mockNext).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Missing or incorrect x-reliance-authorization header'
        });
    });
});