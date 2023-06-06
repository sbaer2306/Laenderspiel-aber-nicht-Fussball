const express = require('express');
const passport = require('passport');
require('dotenv').config();
const prisma = require('./prisma/prisma.js')

const app = express();
prisma.initializePrisma();

// Initialize Passport middleware
app.use(passport.initialize());

// Include the auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

app.get('/example', (req, res) => {
  res.send('Hello, this is the example route!');
});

const gamehistoryRoutes = require('./routes/playedGameRoutes')
app.use('/user', gamehistoryRoutes)

const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);

const rankingRoutes = require('./routes/rankingRoutes');
app.use('/ranking', rankingRoutes);
// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
