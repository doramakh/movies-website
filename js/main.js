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

var getYoutubeVideoLink = videoId => `https://youtube.com/watch?v=${videoId}`;

var getYoutubeVideoBigThumbnail = videoId => `http://i3.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

var getYoutubeVideoThumbnail = videoId => `http://i3.ytimg.com/vi/${videoId}/hqdefault.jpg`;


