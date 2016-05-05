'use strict';
define(['./render-photo'], function(getPictureElement) {
  var BaseComponent = function(data, container) {
    this.data = data;
    // NB! getPictureElement is not a function -- НАЙДИ ПРОБЛЕМУ (и ваще это переменная)
    this.element = getPictureElement(data, container);
    this.onPhotoListClick = this.onPhotoListClick.bind(this);

    this.element.addEventListener('click', this.onPhotoListClick);
    container.appendChild(this.element);
  }

  // NB!  Вот тут подумай как разберешься с функцией
  BaseComponent.prototype.getPictureElement = function(data) {
    return data.element;
  };
  BaseComponent.prototype.remove = function() {
    this.element.removeEventListener('click', this.onClick);
    this.element.parentNode.removeChild(this.element);
  };
  return BaseComponent;
});
