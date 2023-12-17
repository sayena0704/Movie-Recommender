//this the main controller which extcutes different functions on different queries

const movie_data = require('./../model/movieModel');
const score_data = require('./../model/cosineModel');
const searchfunc = require('./../utils/searchbackend');

// funtion to get searched movies

exports.getMoives = async function (req, res) {
  // movies_found get all the searced movies from user
  const movies_found = await searchfunc.search(req.query.keyword);
  res.set({
    'Access-Control-Allow-Origin': '*',
  });
  res.json({
    movies: movies_found,
  });
};

//returning array of found movies

// funtion to get all movies
exports.getAllMovies = async (req, res) => {
  const limit = 5;

  let req_skip = limit * parseInt(req.query.page || 1);

  //here it fetches top 50 movies from our data base using find query of monogoose
  const movieListdata = await movie_data.movieModel
    .find()
    .limit(50)
    .skip(req_skip)
    .sort('_id');
  res.set({
    'Access-Control-Allow-Origin': '*',
  });
  res.json({
    movieListdata,
  }); //sending respond
};

// funtion which recommends movies
exports.getRecommendation = async (req, res) => {
  const newlimit = 12;
  const required_movie = await score_data.find({
    id: req.query.id * 1,
  });
  let arrunique = [];
  let arr = [];
  // if we dont get any movies from cosine then  we skip that
  if (required_movie.length != 0) {
    required_movie[0].score.forEach((obj) => {
      arr.push(obj.id * 1);
    });
  }
  const recommendedcosine = await movie_data.movieModel.aggregate([
    {
      $match: {
        id: {
          $in: arr,
          $ne: req.query.id * 1,
        },
      },
    },
    {
      $limit: 8,
    },
  ]);

  // recommendedcosine containing movie from cosine rules
  recommendedcosine.forEach((obj) => {
    arrunique.push(obj.id * 1);
  });
  let k = recommendedcosine.length;

  // console.log(recommendedcosine);
  //pipeline to aggregate different fileds and to return recommendations
  let recommendadtion = await movie_data.movieModel.aggregate([
    {
      $match: {
        id: { $ne: req.query.id * 1, $nin: arrunique },
      },
    },
    {
      $project: {
        original_title: 1,
        poster_path: 1,
        vote_average: 1,
        vote_count: 1,
        overview: 1,
        release_date: 1,
        runtime: 1,
        genres: 1,
        id: 1,
        distance: {
          $sqrt: {
            $add: [
              {
                $pow: [
                  {
                    $subtract: [
                      Number(req.query.vote_average),
                      '$vote_average',
                    ],
                  },
                  2,
                ],
              },
              {
                $pow: [
                  { $subtract: [Number(req.query.vote_count), '$vote_count'] },
                  2,
                ],
              },
            ],
          },
        },
      },
    },
    {
      $match: {
        distance: { $ne: null },
      },
    },
    {
      $sort: { distance: 1 },
    },
    {
      $limit: newlimit - k,
    },
  ]);

  //recommending final movies
  recommendadtion = recommendedcosine.concat(recommendadtion);
  res.set({
    'Access-Control-Allow-Origin': '*',
  });
  res.json({
    recommendadtion,
  });
};
