'use strict';

var pictureTemplate = function pictureTemplate() {
  var blockFilters = document.querySelector('.filters');
  blockFilters.classList.add('hidden');

  var picturesContainer = document.querySelector('.pictures');
  var templateElement = document.getElementById('picture-template');
  var elementToClone;

  if('content' in templateElement) {
    elemetToClone = templateElement.content.querySelector('.pictures');
  } else {
    elemetToClone = templateElement.querySelector('.pictures');
  }

  var getpictureElement = function(data, container) {
    var element = elementToClone.cloneNode(true);
    var backgroundImage = element.querySelector('img');

    element.querySelector('.picture-comments').textContent = data.comments;
    element.querySelector('.picture-likes').textContent = data.likes;
    container.appendChild(element);
    
    var backgroundImage = new Image();
    var backgroundLoadTimeout;

    backgroundImage.onload = function(evt) {
      clearTimeout(backgroundLoadTimeout);
      backgroundImage.src = evt.target.src;
      backgroundImage.width = 182;
      backgroundImage.height = 182;
    };

    backgroundImage.onerror = function() {
      element.classList.add('picture-load-failure');
    };

    backgroundImage.src = data.preview;

    backgroundLoadTimeout = setTimeout(function() {
        backgroundImage.src = '';
        element.classList.add('hotel-nophoto');
    }, 10000);

    return element;
  };
};
