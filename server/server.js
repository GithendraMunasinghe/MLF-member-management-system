import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import organizationRoutes from './routes/organizationRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import coordinator from './routes/coordinatorRoutes.js';
import titleOrderRoutes from "./routes/titleOrderRoutes.js";
import path from 'path'

dotenv.config();
const app = express();

app.use(cors({
  origin: [
    "http://localhost:8080",
    "http://localhost:8081",
    "http://localhost:5173"
  ],
  credentials: true,
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running');
});

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/auth', adminRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/events' , eventRoutes);
app.use('/api/coordinators', coordinator);
app.use('/api/members', memberRoutes);
app.use("/api/title-orders", titleOrderRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

