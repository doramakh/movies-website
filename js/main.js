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

var localBookmarks = JSON.parse(localStorage.getItem("bookmarkedMovies"));
var ITEMS_PER_PAGE = 8;
// variable for user input (title) source
var titleRegex = '';
var categories = [];
// var foundMovies = [];
var bookmarks = localBookmarks || [];
console.log(bookmarks);

// create an array of top 100 movies
var foundMovies = movies.slice().sort((a,b) => b.imdbRating - a.imdbRating).slice(0, 100);


// DOM

var elMoviesList = $_('.movies-list');
var elMovieCardTemplate = $_('.movie-card-template').content;
var elPaginationTemplate = $_('.pagination-template').content;

var elSearchForm = $_('.search-form');
var elTitleInput = $_('.title-input');
var elYearInput = $_('.year-input');
var elCategorySelect = $_('.category-select');
var elratingSelect = $_('.rating-select');

var elNoResult = $_('.no-result ');

var elPagination = $_('.pagination');
var elCount = $_('.result-count');

var elSorting = $_('.sort-list');

var elModal = $_('.modal-section');
var elModalTitle = $_('.modal-title');
var elModalSummary = $_('.modal-summary');
var elModalHour = $_('.duration-hour-number');
var elModalMin = $_('.duration-min-number');
var elModalLang = $_('.modal-lang');
var elModalCloseBtn = $_('.modal-close-btn');
var isBookmarkList = false;
var elAddBookmarkBtn = $_('.add-bookmark-btn')
var elBookmarkCounter = $_('.bookmark-number');
var elBookmarkOpenButton = $_('.bookmark-btn')


// Push category names from movie object to categories array
for (var movie of movies) {
  for (var category of movie.categories) {
    if (!categories.includes(category)){
      categories.push(category);
    };
  };
};

// Display categories in html categories select
for (var category of categories) {
  var categoryOption = document.createElement('option');
  categoryOption.textContent = category;
  categoryOption.value = category;
  
  elCategorySelect.appendChild(categoryOption);
} 

var updateBookmarkedMovieNumbers = () => elBookmarkCounter.textContent = bookmarks.length;
updateBookmarkedMovieNumbers();

// FUNCTIONS 

var sortMoviesAZ = data => {
  data.sort((a, b) => {
    if (a.title > b.title) {
      return 1;
    } else if (a.title < b.title) {
      return -1;
    }
    return 0;
  });
};

var sortMoviesZA = data => {
  data.sort((a, b) => {
    if (a.title < b.title) {
      return 1;
    } else if (a.title > b.title) {
      return -1;
    }
    return 0;
  });
};

var sortMoviesRatingDesc = data => {
  data.sort((a, b) => a.imdbRating - b.imdbRating);
};

var sortMoviesRatingAsc = data => {
  data.sort((a, b) => b.imdbRating - a.imdbRating);
};

var sortMoviesYearDesc = data => {
  data.sort((a, b) => a.year - b.year);
};

var sortMoviesYearAsc = data => {
  data.sort((a, b) => b.year - a.year);
};

var sortMovies = (data, sortType) => {
  if (sortType === 'az') {
    sortMoviesAZ(data);
  } else if (sortType === 'za') {
    sortMoviesZA(data);
  } else if (sortType === 'lower-rating') {
    sortMoviesRatingDesc(data);
  } else if (sortType === 'higher-rating') {
    sortMoviesRatingAsc(data);
  } else if (sortType === 'older') {
    sortMoviesYearDesc(data);
  } else if (sortType === 'newer') {
    sortMoviesYearAsc(data);
  }
};

var searchMovies = (titleRegex = '', genre = 'All') => {
  return movies.filter(movie => {
    var doesMatchCategory = genre === 'All' || movie.categories.includes(genre);
    return movie.title.match(titleRegex) && doesMatchCategory;
  });
};

var getPage = pageNumber => {
  var startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
  var endIndex = startIndex + ITEMS_PER_PAGE;
  return foundMovies.slice(startIndex, endIndex);
};

var getBookmarkPage = pageNumber => {
  var startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
  var endIndex = startIndex + ITEMS_PER_PAGE;
  return bookmarks.slice(startIndex, endIndex);
};

createMovieCard = movie => {
  elMovie = elMovieCardTemplate.cloneNode(true);
  
  elMovie.querySelector('.movie-thumbnail').src = movie.smallPoster;
  elMovie.querySelector('.movie-thumbnail').alt = `Poster of ${movie.title}`;
  elMovie.querySelector('.movie-year').textContent = movie.year;
  elMovie.querySelector('.movie-rating').textContent = movie.imdbRating;
  elMovie.querySelector('.more-info-link').dataset.imdbId = movie.imdbId;
  elMovie.querySelector('.add-bookmark-btn').dataset.imdbId = movie.imdbId;
  
  var elMovieTitle = elMovie.querySelector('.movie-title').textContent = movie.title;
  
  if (titleRegex.source === '(?:)') {
    elMovieTitle.textContent = movie.title;
  } else {
    elMovieTitle.innerHTML = movie.title.replace(titleRegex, `<mark class="px-0">${movie.title.match(titleRegex)}</mark>`);
  }
  
  bookmarks.forEach((bookmark) => {
    if (bookmark.imdbId === movie.imdbId) {
      $_(".add-bookmark-btn", elMovie).textContent = 'Remove';
    }
  });
  
  return elMovie;
};

var displayMovies = movies => {
  elMoviesList.innerHTML = '';
  
  elMovieFragment = document.createDocumentFragment();
  movies.forEach(movie => {
    elMovieFragment.appendChild(createMovieCard(movie));
  });
  
  elMoviesList.appendChild(elMovieFragment);
};

var displayPagination = movies =>{
  var pagesCount = Math.ceil(movies.length / ITEMS_PER_PAGE);
  
  elPagination.innerHTML = '';
  var elPaginationFragment = document.createDocumentFragment();
  
  for (var i = 1; i <= pagesCount; i++) {
    var elPaginationItem = elPaginationTemplate.cloneNode(true);
    elPaginationItem.querySelector('.page-link').textContent = i;
    elPaginationItem.querySelector('.page-link').dataset.pageNumber = i;
    
    elPaginationFragment.appendChild(elPaginationItem);
  };
  
  elPagination.appendChild(elPaginationFragment);
  elPagination.querySelector('.page-item').classList.add('active');
}

// Display top 100 movies 
displayMovies(getPage(1));
displayPagination(foundMovies);

elSearchForm.addEventListener('submit', evt => {
  evt.preventDefault();
  isBookmarkList = false;
  titleRegex = new RegExp(elTitleInput.value, 'gi');
  var genre = elCategorySelect.value;
  
  foundMovies = searchMovies(titleRegex, genre);
  elNoResult.classList.add('d-none');
  elCount.textContent = foundMovies.length;
  document.querySelector('.result-count__wrapper').classList.remove('d-none');
  document.querySelector('.result-count__wrapper').classList.remove('alert-danger');
  document.querySelector('.result-count__wrapper').classList.add('alert-success');
  
  if(!foundMovies.length) {
    elMoviesList.innerHTML = '';
    document.querySelector('.result-count__wrapper').classList.remove('alert-success');
    document.querySelector('.result-count__wrapper').classList.add('alert-danger');
    elPagination.classList.add('d-none');
    
    return;
  }
  
  displayMovies(getPage(1));
  displayPagination(foundMovies);
  
  elSearchForm.reset();
});

elPagination.addEventListener('click', evt => {
  if (evt.target.matches('.page-link')) {
    var pageNumber = Number((evt.target.dataset.pageNumber));
    displayMovies(getPage(pageNumber));
    
    elPagination.querySelectorAll('.page-item').forEach(item => { 
      item.classList.remove('active');
    });
    
    evt.target.parentElement.classList.add('active');
    
    window.scrollTo(0, 0);
  };
});

$_('.az-button').addEventListener('click', () => {
  var sorting = $_('.az-button').dataset.value;
  isBookmarkList = false;
  
  elMoviesList.innerHTML = '';
  
  sortMovies(foundMovies, sorting);
  displayMovies(getPage(1));
  displayPagination(foundMovies)
  console.log('ishladi')
});

$_('.za-button').addEventListener('click', () => {
  var sorting = $_('.za-button').dataset.value;
  isBookmarkList = false;
  
  elMoviesList.innerHTML = '';
  
  sortMovies(foundMovies, sorting);
  displayMovies(getPage(1));
  displayPagination(foundMovies)
  console.log('ishladi')
});

$_('.newer-button').addEventListener('click', () => {
  var sorting = $_('.newer-button').dataset.value;
  isBookmarkList = false;
  
  elMoviesList.innerHTML = '';
  
  sortMovies(foundMovies, sorting);
  displayMovies(getPage(1));
  displayPagination(foundMovies)
  console.log('ishladi')
});

$_('.older-button').addEventListener('click', () => {
  var sorting = $_('.older-button').dataset.value;
  isBookmarkList = false;
  
  elMoviesList.innerHTML = '';
  
  sortMovies(foundMovies, sorting);
  displayMovies(getPage(1));
  displayPagination(foundMovies)
  console.log('ishladi')
});

$_('.higher-button').addEventListener('click', () => {
  var sorting = $_('.higher-button').dataset.value;
  isBookmarkList = false;
  
  elMoviesList.innerHTML = '';
  
  sortMovies(foundMovies, sorting);
  displayMovies(getPage(1));
  displayPagination(foundMovies)
  console.log('ishladi')
});

$_('.lower-button').addEventListener('click', () => {
  var sorting = $_('.lower-button').dataset.value;
  isBookmarkList = false;
  
  elMoviesList.innerHTML = '';
  
  sortMovies(foundMovies, sorting);
  displayMovies(getPage(1));
  displayPagination(foundMovies)
  console.log('ishladi')
});

elMoviesList.addEventListener('click', evt => {
  if (evt.target.matches('.more-info-link')) {
    elModal.classList.remove('d-none');
    var movie = foundMovies.find(movie => movie.imdbId === evt.target.dataset.imdbId);
    var movieRuntime = movie.runtime;
    var movieHour = Math.floor(movie.runtime / 60)
    var movieMin = movieRuntime - (movieHour * 60);
    
    elModalTitle.textContent = movie.title;
    elModalSummary .textContent = movie.summary;
    elModalHour.textContent = movieHour;
    elModalMin.textContent = movieMin;
    elModalLang.textContent = movie.language;
    
    console.log(movie);
  }
});

elModalCloseBtn.addEventListener('click', () =>  elModal.classList.add('d-none'));

elMoviesList.addEventListener('click', evt => {
  if (evt.target.matches('.add-bookmark-btn')) {
    var movie = foundMovies.find(movie => movie.imdbId === evt.target.dataset.imdbId);
    var startIndex = bookmarks.findIndex(movie => movie.imdbId === evt.target.dataset.imdbId);
    
    $_('.bookmark-result').classList.remove('d-none');
    setTimeout( () => {$_('.bookmark-result').classList.add('d-none')}, 1800);
    
    if (startIndex === -1) {
      bookmarks.push(movie);
      updateBookmarkedMovieNumbers();
      $_('.bookmark-result').textContent = `${movie.title} is successfully added to the bookmarks`;
      evt.target.textContent = 'Remove'
    } else {
      bookmarks.splice(startIndex, 1)
      updateBookmarkedMovieNumbers();
      $_('.bookmark-result').textContent = `Successfully removed from the bookmarks`;
      evt.target.textContent = 'Bookmark'
    }
    if (isBookmarkList) {
      displayMovies(getBookmarkPage(1));
      displayPagination(bookmarks);
    }
    localStorage.setItem("bookmarkedMovies", JSON.stringify(bookmarks));
  }
});

elBookmarkOpenButton.addEventListener('click', () => {
  $_('.result-count__wrapper').classList.add('d-none');
  isBookmarkList = true;
  displayMovies(getBookmarkPage(1));
  displayPagination(bookmarks);
});