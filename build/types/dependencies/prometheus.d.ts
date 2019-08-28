/// <reference types="node" />
import { Gauge, DefaultMetricsCollectorConfiguration } from 'prom-client';
import http from 'http';
export interface IMetricsServerOptions {
    host?: string;
    port: number;
}
export interface IMetricsServer extends http.Server {
    up: Gauge;
    health: Gauge;
}
export declare const configureDefaultMetrics: (defaultLabels: any, options?: DefaultMetricsCollectorConfiguration) => void;
export declare const createMetricsServer: (options: IMetricsServerOptions) => IMetricsServer;
