const mongoose = require('mongoose');

//Schema for moviedata

const UserSchema = new mongoose.Schema({
  backdrop_path: String,
  genres: String,
  id: Number,
  original_language: String,
  original_title: String,
  overview: String,
  poster_path: String,
  release_date: String,
  runtime: Number,
  vote_average: Number,
  vote_count: Number,
});

UserSchema.index({ original_title: 'text' });

const movies = mongoose.model('moviess', UserSchema, 'moviess');

module.exports = { movieModel: movies, movieScehma: UserSchema };
