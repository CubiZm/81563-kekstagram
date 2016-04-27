'use strict';
define(function() {
  var templateElement = document.getElementById('picture-template');
  var elementToClone;

  if ('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.picture');
  } else {
    elementToClone = templateElement.querySelector('.picture');
  }

  var getPictureElement = function(data, container) {
    var element = elementToClone.cloneNode(true);
    element.querySelector('.picture-comments').textContent = data.comments;
    element.querySelector('.picture-likes').textContent = data.likes;

    var image = element.querySelector('img');

    var pictureImage = new Image();

    pictureImage.onload = function() {
      clearTimeout(imageLoadTimeout);
      image.src = data.url;
      image.width = '182';
      image.height = '182';
      image.alt = data.date;
    };

    pictureImage.onerror = function() {
      image.classList.add('picture-load-failure');
    };

    pictureImage.src = data.url;
    gallery.photoForGallery(pics);
    var imageLoadTimeout = setTimeout(function() {
      image.src = '';
    });

    container.appendChild(element);
    return element;
  };
  return {
    getPictureElement: getPictureElement
  };
});
