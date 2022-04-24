const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const app =  express();

dotenv.config({path:'./config.env'});
require('./db/connection')
const User = require('./models/userSchema');
app.use(express.json());
app.use(require('./router/auth'));

const PORT = process.env.PORT;

//Middleware
const middleware = (req,res,next) => {
    console.log(`Middleware is perfectly working`)
    next();
}

app.get('/', (req,res) => {
    res.send(`Hello from backend server`)
})

app.get('/about',middleware,(req,res) => {
    res.send(`About us page`)
})

app.get('/contact',(req,res) => {
    res.send(`Contact us page`)
})

app.get('/register',(req,res) => {
    res.send(`Register page`)
})

app.listen(PORT, () => {
    console.log(`Server is running on port no ${PORT}`)
})