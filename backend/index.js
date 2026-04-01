const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  family: 4
})
  .then(() => console.log('MongoDB connected ✅'))
  .catch(err => console.log('MongoDB error:', err.message));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'KaamConnect server is running!' });
});

// Routes
app.use('/api/auth',  require('./routes/auth'));
app.use('/api/jobs',  require('./routes/jobs'));
app.use('/api/users', require('./routes/users'));

// Socket.io
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
require('./socket')(io);

server.listen(process.env.PORT || 5000, () =>
  console.log('Server running on port 5000 ✅'));