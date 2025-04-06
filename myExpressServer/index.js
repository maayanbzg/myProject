import express from 'express';
import mysqlRoutes from './routes/mysqlRoutes.js';
import mongoRoutes from './routes/mongoRoutes.js';
import redisClient from './utils/redisClient.js';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.use(mysqlRoutes);
app.use(mongoRoutes);

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  try {
    const count = await redisClient.redis.get('stats:dogs:get');
    console.log('Dogs was accessed', count || 0, 'times');
  } catch (err) {
    console.error('Error accessing Redis:', err);
  }
});