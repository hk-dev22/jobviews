import express from "express";
import connectDB from "./db/connect.js";
import dotenv from 'dotenv';
import {notFoundMiddleware, errorHandlerMiddleware, auth} from "./middleware/middleware.js"
import {authRouter, jobsRouter} from "./routes/routes.js";
import morgan from 'morgan';
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

dotenv.config();
const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/api/v1', (req, res) => {
  res.status(200).json({msg: 'Dashboard server'})
})

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// acces the json post in the request
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.static(path.resolve(__dirname, './client/build')));

// routers
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', auth, jobsRouter);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
})

// middleware

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`server running on port ${port}`)
    })
  } catch (error) {
    console.log(error);
  }
}

start();