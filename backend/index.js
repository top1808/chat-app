const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

//CONNECT_DATABASE
mongoose.connect((process.env.MONGODB_URL), () => {
    console.log("Connect to Mongoose");
})

app.use(bodyParser.json({limit: "50mb"}));
app.use(cors());
app.use(morgan("common"));


app.listen(8080, () => {
    console.log("Server is running in Port: 8080");
})