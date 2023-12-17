const MovieModel = require('./../model/movieModel');
const User = MovieModel.movieModel;

//function which finds all the movies asynchronously

const search_title = async function (reqTitle) {
  const search_func = await User.find(
    { $text: { $search: `${reqTitle}` } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(10);
  return search_func;
};
module.exports = { search: search_title };
