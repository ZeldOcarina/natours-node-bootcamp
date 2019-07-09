const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('unhandledRejection', (err) => {
	console.log(err.name, err.message);
	console.log('UNHANDLED REJECTION! 🧨 Shutting down...');
	server.close(() => {
		process.exit(1);
	});
});

process.on('uncaughtException', (err) => {
	console.log(err.name, err.message);
	console.log('UNCAUGHT EXCEPTION! 🧨 Shutting down...');
	server.close(() => {
		process.exit(1);
	});
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false
	})
	.then(() => {
		console.log('DB Connection successfull');
	});

// 4) SERVER CONFIG

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
	/* eslint-disable-next-line no-console */
	console.log(`App running on port ${port}`);
});
