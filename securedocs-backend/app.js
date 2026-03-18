import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { connectDb } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js';

dotenv.config();

const app = express();

await connectDb();

app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

app.use(
  session({
    name: 'securedocs.sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions'
    }),
    cookie: {
      httpOnly: true,
      maxAge: Number(process.env.SESSION_MAX_AGE)
    }
  })
);

app.get('/', (req, res) => {
  res.json({ message: 'SecureDocs backend is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});