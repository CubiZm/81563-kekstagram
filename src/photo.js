'use strict';
define('photo', function() {
  var Photo = function(data, number, container) {
    this.data = data;
    this.number = number;
    this.element = getPictureElement(data, container);

    this.clickPhoto = (function(evt) {
      evt.preventDefault();
      showGallery(this.number);
    }).bind(this);

  this.remove = function() {
    this.element.removeEventListener('click', this.clickPhoto);
    this.element.parentNode.removeChild(this.element);
  };

  this.element.addEventListener('click', this.clickPhoto);
  container.appendChild(this.element);
  }
  return Photo;
});
