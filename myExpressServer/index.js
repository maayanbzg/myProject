import express from 'express';
import mysqlRoutes from './routes/mysqlRoutes.js';
import mongoRoutes from './routes/mongoRoutes.js';
import { getCache, getAllUnassignedDogs } from './utils/redisClient.js';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:3001'
}));

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.use('/mysql', mysqlRoutes);
app.use('/mongo', mongoRoutes);

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  try {
    const numOfDogsAccess = await getCache('stats:dogs:get');
    console.log('------ Dogs was accessed', numOfDogsAccess || 0, 'times');

    const unassignedDogs = await getAllUnassignedDogs();
    console.log('------ Unassigned dogs:', unassignedDogs);
  } catch (err) {
    console.error('Error accessing Redis:', err);
  }
});