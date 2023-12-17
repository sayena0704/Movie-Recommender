const BASE_URL = '/';
const local = '/';

const changeData = (value) => {
  console.log('HI');
  let p = JSON.stringify(value);
  localStorage.setItem('obj', p);
  location.href = '/details.html';
};

/* // Declaring Variablessss */

let page = 1;
let arr;

/* // Controllers */

function htmltemplate(value) {
  let name = value.original_title;
  let img = value.poster_path;
  let str2 = `<div class="card" >
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

function selectMovie(obj) {
  if (!obj.vote_average || !obj.vote_count) return;
  fetch(
    `${local}getRecommendation?vote_average=${
      obj.vote_average * 1
    }&vote_count=${obj.vote_count * 1}&_id=${obj._id}&id=${obj.id}`
  )
    .then((data) => data.json())
    .then((data) => {
      data = data.recommendadtion;
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
window.onload = async function () {
  //Decoding URL

  var name = localStorage.getItem('obj');
  arr = JSON.parse(name);
  console.log(arr);

  // *******************************************8
  // *******************************************8
  // *******************************************8
  // *******************************************8
  // *************DOM MANIPULATION**************8
  // *******************************************8
  // *******************************************8
  // *******************************************8

  const title = document.querySelector('.title');
  const des = document.querySelector('.des');
  const ge = document.querySelector('.ge');
  const year = document.querySelector('.year');
  const votecnt = document.querySelector('.votecnt');
  const rting = document.querySelector('.rting');
  const run = document.querySelector('.run');
  const strr = document.querySelector('.strrr');

  let x = document.createElement('IMG');
  x.setAttribute('src', `https://image.tmdb.org/t/p/w500${arr.poster_path}`);
  x.setAttribute('width', '304');
  x.setAttribute('height', '228');
  x.setAttribute('alt', `${arr.original_title} Image`);
  document.querySelector('.left-column').appendChild(x);

  let yr = arr.release_date;
  title.textContent = `${arr.original_title.toUpperCase()}`;
  des.textContent = `${arr.overview}`;
  ge.textContent = `${arr.genres}`;
  run.textContent = `${arr.runtime} mins`;
  year.textContent = `${yr}`;
  rting.textContent = `Ratings : `;
  for (let i = 0; i < Math.trunc(arr.vote_average); i++) {
    rting.insertAdjacentHTML(
      'beforeend',
      `<span class="fa fa-star checked"> </span>`
    );
  }
  if (Math.trunc(arr.vote_average) < arr.vote_average) {
    rting.insertAdjacentHTML(
      'beforeend',
      `<span class="fa fa-star-half checked"> </span>`
    );
  }
  votecnt.textContent = `Vote count : ${arr.vote_count}`;
  selectMovie(arr);
};
