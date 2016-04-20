'use strict';
define(function() {
  return function(callback) {
    var LOAD_URL = '//o0.github.io/assets/json/pictures.json';
    var picturesContainer = document.querySelector('.pictures');
    var xhr = new XMLHttpRequest();

    xhr.onload = function(evt) {
      var loadedData = JSON.parse(evt.target.response);
      picturesContainer.classList.add('pictures-loading');
      callback(loadedData);
    };

    xhr.onerror = function() {
      picturesContainer.classList.add('pictures-failure');
    };

    xhr.open('GET', LOAD_URL);
    xhr.send();
  };
});
