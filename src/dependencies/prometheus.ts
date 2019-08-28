import { register, collectDefaultMetrics, Gauge, DefaultMetricsCollectorConfiguration } from 'prom-client';
import http from 'http';
import * as loggerMod from '../logger';
import url from 'url';

const logger = loggerMod.logger.child({server:'metrics'});

export interface IMetricsServerOptions {
	host?: string;
	port: number;
}

export interface IMetricsServer extends http.Server {
	up: Gauge;
	health: Gauge;
}

export const configureDefaultMetrics = (defaultLabels: any, options: DefaultMetricsCollectorConfiguration = {}) => {

	register.setDefaultLabels(defaultLabels);
	collectDefaultMetrics({
		timeout: 5000,
		...options
	});

};

export const createMetricsServer = (options: IMetricsServerOptions): IMetricsServer => {

	const server = http.createServer() as IMetricsServer;
	server.up = new Gauge({
		name: 'up',
		help: '1 = up, 0 = down'
	});
	server.up.set(0);
	server.health = new Gauge({
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
		response.setHeader('Content-Type', register.contentType);
		if (request.method === 'GET') {
			const requestUrl = url.parse(request.url);
			if (requestUrl.pathname === '/metrics') {
				response.statusCode = 200;
				response.end(register.metrics());
				return;
			}
			if (requestUrl.pathname === '/metrics/ready') {
				const isUp = (register.getSingleMetric('up') as any).hashMap[''].value;
				const up = register.getSingleMetricAsString('up');
				response.statusCode = isUp === 1 ? 200 : 503;
				response.end(up);
				return;
			}
			if (requestUrl.pathname === '/metrics/health') {
				const isHealthy = (register.getSingleMetric('health') as any).hashMap[''].value;
				const health = register.getSingleMetricAsString('health');
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
}