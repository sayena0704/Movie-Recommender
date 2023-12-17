const BASE_URL = '/';

let page = 1;
const movieList = {};

/* 
//////////////CONTROLLERS///////////////////////////
*/
const changeData2 = (value) => {
  let p = JSON.stringify(value);
  localStorage.setItem('obj1', p); // Pair  key : value
  location.href = '/search.html';
};

const changeData = (value) => {
  let p = JSON.stringify(value);
  localStorage.setItem('obj', p);
  location.href = '/details.html';
};

function htmltemplate(value) {
  let name = value.original_title;
  let img = value.poster_path;
  let str2 = `<div class="card"  >
          <div class="content">
              <div class="imgBx" >
              <img src="https://image.tmdb.org/t/p/w500${img}"/>
            </div>
            <div class="contentBx">
            <h3 class="name">${name}<br /></h3> </div>
          </div>
          <ul class="sci">
              <li><a href="">${value.vote_average}❤️</a></li>
          </ul>
        </div>`;
  return str2;
}

window.onload = function () {
  getMovies();
};

document.addEventListener('DOMContentLoaded', (event) => {
  document.querySelector('.search-btn').addEventListener('click', (obj) => {
    const po = document.querySelector('.search-text');
    fetch(`${BASE_URL}getMovie?keyword=${po.value}`)
      .then((data) => data.json())
      .then((data) => {
        data = data.movies;
        changeData2(data);
        console.log(data);
      });
  });
});

function getMovies() {
  fetch(`${BASE_URL}getAllMovies?page=${page}`)
    .then((data) => data.json())
    .then((data) => {
      data = data.movieListdata;
      console.log(data);
      data.forEach((value) => {
        const t = JSON.stringify(value);
        let inputElement = document.createElement('div');
        inputElement.addEventListener('click', () => {
          changeData(value);
        });
        const container = document.querySelector('.container2');
        const papacontainer = document.querySelector('.container');
        let str = htmltemplate(value);
        papacontainer.insertBefore(inputElement, container);
        inputElement.insertAdjacentHTML('afterbegin', str);
      });
    });
}
