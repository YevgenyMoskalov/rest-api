import express from 'express';
import { connect } from 'mongoose';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { json } from 'body-parser';
import userRouter from './api/user.controller';
import latencyRouter from './api/latency.controller';
import redisClient from './utils/redis-client';

dotenv.config();

connect(
  process.env.MONGODB_URL as string,
  { useNewUrlParser: true, dbName: 'rest-api' },
)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(
      `MongoDB connection error - could not connect to ${
        process.env.MONGODB_URL
      }`,
    );
    console.error(err);
  });

redisClient.on('error', (error: Error) => {
  console.error(error);
});

redisClient.on('ready', () => {
  console.log('redis is ready.');
});

const app = express();
app.use(cors());
app.use(json());

app.use(userRouter);
app.use(latencyRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log('server is listening on port 3000');
});
