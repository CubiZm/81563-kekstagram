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

    var loadImage = new Image();
    var backgroundLoadTimeout;

    backgroundImage.src = data.preview;

    loadImage.onload = function(evt) {
      clearTimeout(backgroundLoadTimeout);
      backgroundImage.src = evt.target.src;
      backgroundImage.width = 182;
      backgroundImage.height = 182;
    };

    loadImage.onerror = function() {
      element.classList.add('picture-load-failure');
    };

    loadImage.src = data.url;
    return element;
  };

  // pictures.forEach(function(pictures) {
  //   getPictureElement(pictures, picturesContainer);
  // });
  blockFilters.classList.remove('hidden');

  var pictures = [];
  // получим фоточки
  var getPictures = function(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '//o0.github.io/assets/json/pictures.json');
    xhr.send();
    xhr.onload = function(evt) {
      var requestPhoto = evt.target;
      var response = requestPhoto.response;
      response = JSON.parse(response);
      callback(response);
    };
    // xhr.onerror = function() {
    //   block_pictures.classList.add('pictures-failure');
    // };
  };
  // отдадим фоточки
  var renderPictures = function() {
    pictures.forEach(function(pictures) {
      getPictureElement(pictures, picturesContainer);
    });
  };
  // получим фоточки...
  getPictures(function(loadedPictures) {
    pictures = loadedPictures;
    renderPictures(pictures);
  });
})();
