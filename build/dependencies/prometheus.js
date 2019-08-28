"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const prom_client_1 = require("prom-client");
const http_1 = __importDefault(require("http"));
const loggerMod = __importStar(require("../logger"));
const url_1 = __importDefault(require("url"));
const logger = loggerMod.logger.child({ server: 'metrics' });
exports.configureDefaultMetrics = (defaultLabels, options = {}) => {
    prom_client_1.register.setDefaultLabels(defaultLabels);
    prom_client_1.collectDefaultMetrics({
        timeout: 5000,
        ...options
    });
};
exports.createMetricsServer = (options) => {
    const server = http_1.default.createServer();
    server.up = new prom_client_1.Gauge({
        name: 'up',
        help: '1 = up, 0 = down'
    });
    server.up.set(0);
    server.health = new prom_client_1.Gauge({
        name: 'health',
        help: '2 = green, 1 = yellow, 0 = red'
    });
    server.health.set(0);
    server.on('error', (error) => {
        logger.error(error, 'Metrics server error');
        process.exit(1);
    });
    server.listen(options.port, options.host, () => {
        logger.info('Metrics server is listening');
    });
    server.on('request', (request, response) => {
        response.setHeader('Content-Type', prom_client_1.register.contentType);
        if (request.method === 'GET') {
            const requestUrl = url_1.default.parse(request.url);
            if (requestUrl.pathname === '/metrics') {
                response.statusCode = 200;
                response.end(prom_client_1.register.metrics());
                return;
            }
            if (requestUrl.pathname === '/metrics/ready') {
                const isUp = prom_client_1.register.getSingleMetric('up').hashMap[''].value;
                const up = prom_client_1.register.getSingleMetricAsString('up');
                response.statusCode = isUp === 1 ? 200 : 503;
                response.end(up);
                return;
            }
            if (requestUrl.pathname === '/metrics/health') {
                const isHealthy = prom_client_1.register.getSingleMetric('health').hashMap[''].value;
                const health = prom_client_1.register.getSingleMetricAsString('health');
                response.statusCode = isHealthy === 2 || isHealthy === 1 ? 200 : 500;
                response.end(health);
                return;
            }
        }
        logger.warn(request, 'Metrics server invalid request');
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/plain');
        response.end('not found');
    });
    return server;
};
