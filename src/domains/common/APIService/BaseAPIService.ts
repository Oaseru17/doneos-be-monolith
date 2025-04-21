import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { APIError } from './errors/APIError';
import logger from '../../../utils/logger';

export abstract class BaseAPIService {
    protected readonly axiosInstance: AxiosInstance;
    private readonly logger = logger;

    constructor(
        baseURL: string,
        private readonly config: {
            timeout?: number;
            headers?: Record<string, string>;
            retryAttempts?: number;
            retryDelay?: number;
        } = {}
    ) {
        this.axiosInstance = axios.create({
            baseURL,
            timeout: config.timeout || 15000,
            headers: {
                'Content-Type': 'application/json',
                ...config.headers
            }
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        this.axiosInstance.interceptors.request.use(
            (config) => {
                this.logger.debug('Outgoing request', {
                    url: config.url,
                    method: config.method,
                    headers: config.headers
                });
                return config;
            },
            (error) => {
                this.logger.error('Request configuration error', error);
                return Promise.reject(new APIError('Request configuration error', error));
            }
        );

        this.axiosInstance.interceptors.response.use(
            (response) => {
                this.logger.debug('Response received', {
                    status: response.status,
                    url: response.config.url
                });
                return response;
            },
            async (error) => {
                const originalRequest = error.config;

                // Implement retry logic for specific status codes
                if (
                    error.response?.status === 429 || // Rate limit
                    error.response?.status === 503 || // Service unavailable
                    !error.response // Network error
                ) {
                    if (!originalRequest._retry) {
                        originalRequest._retry = 0;
                    }

                    if (originalRequest._retry < (this.config.retryAttempts || 3)) {
                        originalRequest._retry++;

                        const delay = (this.config.retryDelay || 1000) * originalRequest._retry;
                        await new Promise(resolve => setTimeout(resolve, delay));

                        return this.axiosInstance(originalRequest);
                    }
                }

                this.logger.error('API Error', {
                    status: error.response?.status,
                    data: error.response?.data,
                    url: originalRequest.url
                });

                if (error.response) {
                    throw new APIError(
                        `API Error: ${error.response.status}`,
                        error.response.data,
                        error.response.status
                    );
                } else if (error.request) {
                    throw new APIError('No response received', error.request);
                } else {
                    throw new APIError('Request setup error', error);
                }
            }
        );
    }

    protected async get<T>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        return this.axiosInstance.get<T>(url, config);
    }

    protected async post<T>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        return this.axiosInstance.post<T>(url, data, config);
    }
}
