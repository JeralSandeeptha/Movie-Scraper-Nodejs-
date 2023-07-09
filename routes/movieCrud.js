const express = require('express');
const MovieSchema = require('../models/movie');
const axios  = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

const router = express.Router();

//create a new movie
router.post('/createAMovie', async (req, res) => {

    try {
        
        const { movieURL } = req.body;

        const response = await axios.get(movieURL);
        const $ = cheerio.load(response.data);
        const title = $('div[class="hidden-xs"] > h1').text();
        const playTime = $('#movie-tech-specs > div:nth-child(7) > div:nth-child(2) > div:nth-child(3)').text();
        const frameRate = $('#movie-tech-specs > div:nth-child(7) > div:nth-child(2) > div:nth-child(2)').text();
        const ps = $('#movie-tech-specs > div:nth-child(7) > div:nth-child(2) > div:nth-child(4)').text();
        const uploadedDate = $('#synopsis > p:nth-child(4) > span > em').text();
        const uploadedBy = $('#synopsis > p:nth-child(4) > em > a').text();
        const plotsummary = $('#synopsis > p.hidden-xs').text();
        const year = $('div[class="hidden-xs"] > h2').first().text();
        const likes = $('#movie-likes').text();
        const critics = $('#movie-info > div.bottom-info > div:nth-child(2) > span:nth-child(2)').text();
        const audience = $('#movie-info > div.bottom-info > div:nth-child(3) > span:nth-child(2)').text();
        const imdb = $('#movie-info > div.bottom-info > div:nth-child(4) > span:nth-child(2)').text();
        const genre = $('div[class="hidden-xs"] > h2').last().text();
        const poster = $('div[id="movie-poster"] > img[class="img-responsive"]').attr('src');
        const youtubeVedioURL = $('#playTrailer').attr('href');
        let reviews = [];
        $('#movie-reviews > div[class="review"]').each( (item, el) => {
            let title = $(el).find('h4').text();
            let review = $(el).find('article > p').text();
            let reviewedBy = $(el).find('div[class="review-properties"] > span[class="review-author"]').text();
            let dirtyRating = $(el).find('div[class="review-properties"] > span[class="review-rating"]').text();
            let rating = dirtyRating.replace(/\s/g, "");
            reviews.push({
                title,
                review,
                reviewedBy,
                rating
            });
        })
        let director = {
            image: '',
            name: ''
        };
        $('div[class="directors"] div[class="list-cast"]').each( (item, el) => {
            let dimage = $(el).find('div[class="tableCell"] > a[class="avatar-thumb"] > img').attr('src');
            let dname = $(el).find('div[class="list-cast-info tableCell"] > a[class="name-cast"] > span[itemprop="director"] > span[itemprop="name"]').text();
            director.image = dimage;
            director.name = dname;
        })

        let images = [];
        $('div[id="screenshots"] > div[class="screenshot"] > a > img').each( (item, el) => {
            let image = $(el).attr('src');
            images.push(image);
        })

        let similarMovies = [];
        $('div[id="movie-related"] > a > img').each( (item, el) => {
            let similarmovie = $(el).attr('src');
            similarMovies.push(similarmovie);
        })

        let actors = [];
        $('div[class="actors"] > div[class="list-cast"]').each( (item, el) => {
            let actorPic = $(el).find('div[class="tableCell"] a > img').attr('src');
            let actorName = $(el).find('div[class="list-cast-info tableCell"] > a > span > span[itemprop="name"]').text();
            let dirtyrole = $(el).find('div[class="list-cast-info tableCell"]').text();
            let role = dirtyrole.replace(/\n/g, '');
        actors.push({
            actorPic,
            actorName,
                role
            });
        })

        let tags = [];
        $('#movie-info > div.bottom-info > p:nth-child(6) > span > a').each( (item, el) => {
            let tag = $(el).text();
            tags.push(tag);
        })

        let torrents = [];
        $('div[class="modal-content"] > div[class="modal-torrent"]').each( (item, el) => {
            let torrent = $(el).find('a').attr('href');
            let quality = $(el).find('p:nth-child(2)').text();
            let size = $(el).find('p:nth-child(5)').text();
            torrents.push({
                torrent,
                quality,
                size
            });
        })

        const newMovie = await new MovieSchema({
            title: title,
            year: year,
            likes: likes,
            critics: critics,
            audience: audience,
            imdb: imdb,
            ps: ps,
            frameRate: frameRate,
            playTime: playTime,
            genre: genre,
            poster: poster,
            plotsummary: plotsummary,
            uploadedBy: uploadedBy,
            uploadedDate: uploadedDate,
            youtubeVedioURL: youtubeVedioURL,
            similarMovies: similarMovies,
            actors: actors,
            director: director,
            images: images,
            tags: tags,
            reviews: reviews,
            torrents: torrents
        });

        await newMovie.save();

        res.status(200).json({
            title: title,
            year: year,
            likes: likes,
            critics: critics,
            audience: audience,
            imdb: imdb,
            ps: ps,
            frameRate: frameRate,
            playTime: playTime,
            genre: genre,
            poster: poster,
            plotsummary: plotsummary,
            uploadedBy: uploadedBy,
            uploadedDate: uploadedDate,
            youtubeVedioURL: youtubeVedioURL,
            similarMovies: similarMovies,
            actors: actors,
            director: director,
            images: images,
            tags: tags,
            reviews: reviews,
            torrents: torrents
        });

    } catch (error) {
        console.log(error);
    }

})

//get all the movies
router.get('/getAllMovies', async (req, res) => {

    try {
        
        const moviesList = await MovieSchema.find();

        res.status(200).json(moviesList);

    } catch (error) {
        console.log(error);
    }

})

//get a single movie using their id
router.get('/getASingleMovie/:id', async (req, res) => {

    try {
        
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({error: "No id found related to that id"});
        }

        const movie = await MovieSchema.findById(id);

        res.status(200).json(movie);

    } catch (error) {
        console.log(error);
    }

})

//get movies by their title
router.get('/getMoviesByTitle', async (req, res) => {

    const { title } = req.body;

    try {

        const query = { title: { $regex: title,  $options: 'i' } };
        
        const searchedMovies = await MovieSchema.find(query);

        res.status(200).json(searchedMovies);

    } catch (error) {
        console.log(error);
    }

});

//get movies by their genre
router.get('/getMoviesByGenre', async (req, res) => {

    const { genre } = req.body;

    try {

        const query = { genre: { $regex: genre, $options: 'i' } };
        
        const searchedMovies = await MovieSchema.find(query);

        res.status(200).json(searchedMovies);

    } catch (error) {
        console.log(error);
    }

});

//get movies by their year
router.get('/getMoviesByYear', async (req, res) => {

    const { year } = req.body;

    try {

        const query = { year: { $eq: year } };
        
        const searchedMovies = await MovieSchema.find(query);

        res.status(200).json(searchedMovies);

    } catch (error) {
        console.log(error);
    }

});

//get movies by their tags
router.get('/getMoviesByTags', async (req, res) => {

    const { year } = req.body;

    try {

        const query = { year: { $eq: year } };
        
        const searchedMovies = await MovieSchema.find(query);

        res.status(200).json(searchedMovies);

    } catch (error) {
        console.log(error);
    }

});

module.exports = router;