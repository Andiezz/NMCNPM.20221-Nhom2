const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieSession = require('cookie-session');
require('dotenv').config();
const { errorHandler } = require('./middlewares/errorHandler');
const { NotFoundError } = require('./utils/error');

const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();

const corsOptions = {
	origin: '*',
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credential: true,
};

app.use(express.static(path.join(__dirname, 'images')));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(
	cookieSession({
		signed: false,
		secure: false,
	})
);

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// ==================== Errors Handler =====================
app.all('*', (req, res, next) => {
	throw new NotFoundError();
});
app.use(errorHandler);

mongoose
	.connect(process.env.MONGO_DATABASE)
	.then(() => {
		app.listen(3000);
		console.log('============ Database Connected ==========');
	})
	.catch((err) => {
		console.log(err);
	});
