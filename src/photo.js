'use strict';
define('Photo',['./pictures'], function(element) {
function Photo(data, number, container) {
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
  container.appendChild(this.element);
  console.log('photooooo')
};
 return Photo
});
