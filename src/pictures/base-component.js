'use strict';
define(['./render-photo'], function(getPictureElement) {
  var BaseComponent = function(data, container) {
    this.data = data;
    this.element = getPictureElement(data, container);
    this.onPhotoListClick = this.onPhotoListClick.bind(this);

    this.element.addEventListener('click', this.onPhotoListClick);
    container.appendChild(this.element);
  }
  return BaseComponent;
});
