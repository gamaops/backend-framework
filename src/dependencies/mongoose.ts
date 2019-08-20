import { Mongoose } from 'mongoose';
import { logger } from '../logger';

export const connectMongoose = async (mongodbUri: string, mongoose: Mongoose): Promise<Mongoose> => {

	mongoose.connect(mongodbUri, {
		useNewUrlParser: true,
		useCreateIndex: true,
		autoReconnect: true,
		useFindAndModify: false,
	});

	mongoose.connection.on('error', (error) => {
		logger.fatal(error);
		process.exit(1);
	});

	return new Promise((resolve) => {
		mongoose.connection.once('connected', () => {
			resolve();
		});
	});

};
