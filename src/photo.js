'use strict';
define('Photo', function() {
function Photo(data, number, picturesContainer) {
  this.data = data;
  this.number = number;
  this.element = getPictureElement(data, picturesContainer);

  this.onPhotoClick = (function(evt) {
    evt.preventDefault();
    showGallery(this.number);
  }).bind(this);

  this.remove = function() {
    this.element.removeEventListener('click', this.onPhotoClick);
    this.element.parentNode.removeChild(this.element);
  };

  this.element.addEventListener('click', this.onPhotoClick);
  picturesContainer.appendChild(this.element);
};
 return Photo
});
