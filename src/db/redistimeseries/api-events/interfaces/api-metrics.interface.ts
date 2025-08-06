export interface ApiMetrics {
    responseTime: number;
    requestsPerSecond: number;
    statusCode: number;
    endpoint: string;
    method: string;
}