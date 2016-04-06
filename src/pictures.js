/* global pictures */

'use strict';

(function() {
  var blockFilters = document.querySelector('.filters');
  blockFilters.classList.add('hidden');

  var picturesContainer = document.querySelector('.pictures');
  var templateElement = document.getElementById('picture-template');
  var elementToClone;

  if('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.picture');
  } else {
    elementToClone = templateElement.querySelector('.pictures');
  }
  var getPictureElement = function(data, container) {
    var element = elementToClone.cloneNode(true);
    var backgroundImage = element.querySelector('img');

    element.querySelector('.picture-comments').textContent = data.comments;
    element.querySelector('.picture-likes').textContent = data.likes;
    container.appendChild(element);

    var backgroundImage = new Image();
    var backgroundLoadTimeout;

    backgroundImage.src = data.preview;

    backgroundImage.onload = function(evt) {
      clearTimeout(backgroundLoadTimeout);
      backgroundImage.src = evt.target.src;
      backgroundImage.width = 182;
      backgroundImage.height = 182;
    };

    backgroundImage.onerror = function() {
      element.classList.add('picture-load-failure');
    };

     backgroundLoadTimeout = setTimeout(function() {
      backgroundImage.src = '';
      element.classList.add('picture-load-failure');
    }, 10000);

    return element;
  };

  pictures.forEach(function(pictures) {
    getPictureElement(pictures, picturesContainer);
  });
  blockFilters.classList.remove('hidden');
})();
