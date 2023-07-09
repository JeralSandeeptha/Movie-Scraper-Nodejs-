const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');

const router = express.Router();

const urls = [
    // 'https://yts.mx/movies/m3gan-2022',
    'https://yts.mx/movies/green-lantern-2011',
    // 'https://yts.mx/movies/jodorowskys-dune-2013',
    // 'https://yts.mx/movies/gingerdead-man-vs-evil-bong-2013',
]

router.get('/', async (req, res) => {

    let moviesList = [];

    try {

        for(let movie of urls){
            const response = await axios.get(movie);
            const $ = cheerio.load(response.data);

            const title = $('div[class="hidden-xs"] > h1').text();
            const playTime = $('#movie-tech-specs > div:nth-child(7) > div:nth-child(2) > div:nth-child(3)').text();
            const frameRate = $('#movie-tech-specs > div:nth-child(7) > div:nth-child(2) > div:nth-child(2)').text();
            const PS = $('#movie-tech-specs > div:nth-child(7) > div:nth-child(2) > div:nth-child(4)').text();
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

            moviesList.push({
                title,
                year,
                likes,
                critics,
                audience,
                imdb,
                PS,
                frameRate,
                playTime,
                genre,
                poster,
                plotsummary,
                uploadedBy,
                uploadedDate,
                youtubeVedioURL,
                similarMovies,
                actors,
                director,
                images,
                tags,
                reviews,
                torrent,
                torrents
            });
        }

        res.json(moviesList);

    } catch (error) {
        console.log(error);
    }
    
});

module.exports = router;