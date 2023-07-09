const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/withRandomNumber', async (req, res) => {

    try {

        const randomNumber = Math.floor(Math.random() * 50426) + 1;

        const response = await axios.get(`https://yts.mx/api/v2/movie_details.json?movie_id=${randomNumber}&with_images=true&with_cast=true`);
        const data = response.data;

        res.json(data);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
    
});

router.post('/withUserRandomNumber', async (req, res) => {

    const id = req.body.movieId;

    try {
  
        const response = await axios.get(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}&with_images=true&with_cast=true`);
        const movieData = response.data.data.movie;
        const movie = {
          id: movieData.id,
          url: movieData.url,
          imdb_code: movieData.imdb_code,
          title: movieData.title_long,
          title_english: movieData.title_english,
          title_long: movieData.title_long,
          slug: movieData.slug,
          year: movieData.year,
          rating: movieData.rating,
          runtime: movieData.runtime,
          genres: movieData.genres,
          download_count: movieData.download_count,
          like_count: movieData.like_count,
          description_intro: movieData.description_intro,
          description_full: movieData.description_full,
          yt_trailer_code: movieData.yt_trailer_code,
          language: movieData.language,
          mpa_rating: movieData.mpa_rating,
          background_image: movieData.background_image,
          background_image_original: movieData.background_image_original,
          small_cover_image: movieData.small_cover_image,
          medium_cover_image: movieData.medium_cover_image,
          large_cover_image: movieData.large_cover_image,
          torrents: movieData.torrents,
          date_uploaded: movieData.date_uploaded,
          date_uploaded_unix: movieData.date_uploaded_unix
        };
  
      res.json(movie);

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/getRelatedMoviesWithUserRandomNumber', async (req, res) => {

    const id = req.body.movieId; 

    try {
  
        const response = await axios.get(`https://yts.mx/api/v2/movie_suggestions.json?movie_id=${id}`);
        res.json(response.data);

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;