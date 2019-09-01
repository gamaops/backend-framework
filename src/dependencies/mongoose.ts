import { Mongoose } from 'mongoose';
import { logger } from '../logger';
import uuidv4 from 'uuid/v4';
const mongoLogger = logger.child({dependency: 'mongodb'});

export const connectMongoose = async (mongodbUri: string, mongoose: Mongoose): Promise<Mongoose> => {

	mongoose.connect(mongodbUri, {
		useNewUrlParser: true,
		useCreateIndex: true,
		autoReconnect: true,
		useFindAndModify: false,
	});

	mongoose.connection.on('error', (error) => {
		if (!error.errid)
			error.errid = uuidv4();
		mongoLogger.fatal({error});
		process.exit(1);
	});

	return new Promise((resolve) => {
		mongoose.connection.once('connected', () => {
			resolve();
		});
	});

};
