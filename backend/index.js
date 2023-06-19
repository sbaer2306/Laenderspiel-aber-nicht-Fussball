const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
const prisma = require('./prisma/prisma.js')
const cors = require('cors');

const app = express();
prisma.initializePrisma();

require('./config/passport')(passport)
app.use(passport.initialize())

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization, If-None-Match',
  exposedHeaders: 'ETag',
  credentials: true,
}));

// Include the auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

app.get('/example', (req, res) => {
  res.send('Hello, this is the example route!');
});

app.use(session({
  secret: 'geheimnis', // Passen Sie dies an ein sicheres Geheimnis an
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 600000 //10 minutes after start
  }
}));


app.use(express.json()); // body parsing middleware (express does not parse the body by default)

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
