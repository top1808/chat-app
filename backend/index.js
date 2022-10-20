const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');

dotenv.config();

const app = express();

//CONNECT_DATABASE
mongoose.connect((process.env.MONGODB_URL), () => {
    console.log("Connect to Mongoose");
})

app.use(cors());
app.use(express.json());
app.use(cookieParser());


//ROUTES
app.use('/v1/auth', authRouter)
app.use('/v1/user', userRouter);


app.listen(8080, () => {
    console.log("Server is running in Port: 8080");
})