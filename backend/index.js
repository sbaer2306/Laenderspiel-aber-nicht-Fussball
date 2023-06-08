const express = require('express');
const cors = require('cors');
const passport = require('passport');
require('dotenv').config();
const prisma = require('./prisma/prisma.js')
const session = require('express-session');

const app = express();
prisma.initializePrisma();

//Initialize CORS
app.use(cors());

// Initialize Passport middleware
app.use(passport.initialize());

// Include the auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

app.get('/example', (req, res) => {
  res.send('Hello, this is the example route!');
});

app.use(express.json()); // body parsing middleware (express does not parse the body by default)
//init express sesssion
app.use(
  session({
    secret: "secret-key-for-now-plain-text",
    resave: false,
    saveUninitialized: false,
    store: new session.MemoryStore(),
  })
)

const gameRoutes = require('./routes/gameRoutes.js')
app.use('/game', gameRoutes)

const gamehistoryRoutes = require('./routes/playedGameRoutes')
app.use('/user', gamehistoryRoutes)

const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);

const rankingRoutes = require('./routes/rankingRoutes');
app.use('/ranking', rankingRoutes);


const profileRoutes = require('./routes/profileRoutes');
app.use('/profile', profileRoutes);

const statsRoutes = require('./routes/statsRoute');
app.use('/user', statsRoutes);

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
