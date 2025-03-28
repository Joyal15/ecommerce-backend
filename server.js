import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import morgan from 'morgan';
import authRoute from './routes/authRoute.js';

dotenv.config();

connectDB();

const app = express();
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

//routes
app.use('/api/v1/auth', authRoute);

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 

