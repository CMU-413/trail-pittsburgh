import express from 'express';
// import { getItems } from './db/queries';
import { getTrails, getUsers} from './db/queries.js';


const app = express();

// Middleware
app.use(express.json());

// Health check route
app.get('/healthz', (req: express.Request, res: express.Response) => {
    res.status(200).json({ status: 'ok' });
});

app.get('/api/trails', getTrails);
app.get('/api/users', getUsers);

export { app };
