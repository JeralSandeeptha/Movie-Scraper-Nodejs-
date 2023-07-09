require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const moviesRoutes = require('./routes/movieRoutes');
const getRandomMovieRoutes = require('./routes/getRandomMovie');
const crudRoutes = require('./routes/movieCrud');

const app = express();

app.use(bodyParser.json());

app.use('/api/v1/movies', moviesRoutes);
app.use('/api/v1/getRandomMovie', getRandomMovieRoutes);
app.use('/api/v1/crudmovies', crudRoutes);

const port = process.env.PORT || 4000;  

mongoose.connect('mongodb://localhost:27017/YTS')
    .then( () => {
        console.log('Database connected successfully');
    })
    .catch( (error) => {
        console.log(error);
    });

app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});