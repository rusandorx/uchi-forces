import app from './server';
import * as dotenv from 'dotenv';
import config from './config';

dotenv.config();

const handleUncaughtException: NodeJS.UncaughtExceptionListener = (
  error, origin) => {
    console.error(error.message);
    console.error(`Origin: ${origin}`);
};

process.on('uncaughtException', handleUncaughtException);
process.on('unhandledRejection', handleUncaughtException);

app.listen(config.port, () => {
    console.log(`Server started on port ${config.port}`);
});
