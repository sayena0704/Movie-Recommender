const mongoose = require('mongoose');

//Schema for scoredata

const schema = new mongoose.Schema({
  id: {
    type: Number,
  },
  score: {
    type: Array,
  },
});

const data = mongoose.model('scores', schema, 'scores');
module.exports = data;
