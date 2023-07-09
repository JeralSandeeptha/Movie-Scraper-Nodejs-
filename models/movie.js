const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    title: {
        type: String,
    },
    year: {
        type: String,
    },
    likes: {
        type: String,
    },
    critics: {
        type: String,
    },
    audience: {
        type: String,
    },
    imdb: {
        type: String,
    },
    PS: {
        type: String,
    },
    frameRate: {
        type: String,
    },
    playTime: {
        type: String,
    },
    genre: {
        type: String,
    },
    poster: {
        type: String,
    },
    plotsummary: {
        type: String,
    },
    uploadedBy: {
        type: String,
    },
    uploadedDate: {
        type: String,
    },
    youtubeVedioURL: {
        type: String,
    },
    similarMovies: [String],
    actors: [Object],
    director: {
        type: Object,
    },
    images: [String],
    tags: [String],
    reviews: [Object],
    torrents: [Object]
});

module.exports = mongoose.model('MovieURL', movieSchema);