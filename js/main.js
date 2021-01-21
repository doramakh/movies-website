var $_ = function (selector, node = document) {
  return node.querySelector(selector);
};

var $$_ = function (selector, node = document) {
  return node.querySelectorAll(selector);
};

var createElement = function (element, elementClass, text) {
  var newElement = document.createElement(element);

  if (elementClass) {
    newElement.setAttribute('class', elementClass);
  };
  
  if (text) {
    newElement.textContent = text;
  };
};

// GLOBAL VARIABLES

// variable for user input (title) source
var titleRegex = '';

// DOM

// create an array of top 100 movies
var topHundrendMovies = movies.slice().sort((a,b) => b.imdbRating - a.imdbRating).slice(0, 100);

var elMoviesList = $_('.movies-list');
var elMovieCardTemplate = $_('.movie-card-template').content;

// FUNCTIONS 

createMovieCard = movie => {
   elMovie = elMovieCardTemplate.cloneNode(true);

   elMovie.querySelector('.movie-thumbnail').src = movie.smallPoster;
   elMovie.querySelector('.movie-thumbnail').alt = `Poster of ${movie.title}`;
   elMovie.querySelector('.movie-year').textContent = movie.year;
   elMovie.querySelector('.movie-rating').textContent = movie.imdbRating;
   
   var elMovieTitle = elMovie.querySelector('.movie-title').textContent = movie.title;

   if (titleRegex.source === '(?:)') {
    elMovieTitle.textContent = movie.title;
  } else {
    elMovieTitle.innerHTML = movie.title.replace(titleRegex, `<mark class="px-0">${movie.title.match(titleRegex)}</mark>`);
  }

  return elMovie;
}

var displayMovies = movies => {
  elMoviesList.innerHTML = '';

  elMovieFragment = document.createDocumentFragment();
  movies.forEach(movie => {
    elMovieFragment.appendChild(createMovieCard(movie));
  });

  elMoviesList.appendChild(elMovieFragment);
}

// Display to 100 movies 

displayMovies(topHundrendMovies);
