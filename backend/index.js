
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
// const cookieParser = require('cookie-parser');
const session = require("express-session")
let RedisStore = require("connect-redis")(session)
const redisClient = require('./utils/redis');

dotenv.config();

const app = express();

//CONNECT_DATABASE
mongoose.connect("mongodb://localhost:27017", () => {
    console.log("Connect to Mongoose");
})

const corsOptions = {
    origin:['http://localhost:3000', 'https://localhost:8080', 'http://localhost:6379'], 
    credentials:true,
}

app.use(cors(corsOptions));
app.use(express.json());
// app.use(cookieParser());
app.set('trust proxy', 1) // trust first proxy
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: true,
    secret: process.env.REDIST_SECRET,
    resave: false,
    cookie: {
      secure: false,
      httpOnly: true,
    }
  })
);


//ROUTES
app.use('/v1/auth', authRouter)
app.use('/v1/user', userRouter);


app.listen(8080, () => {
    console.log("Server is running in Port: 8080");
})