// и Photo и Gallery должны стать BaseComponent

// [12:29]
// чтобы он у них был записан в __proto__

// [12:29]
// стало быть чото они должны брать оттуда из BaseComponent

'use strict';
define(['./render-photo'], function() {
  var BaseComponent = function(data, container) {
    console.log('^_^');
    this.data = data;
    console.log(this.data);
    this.element = this.getPictureElement(this.data);
    this.onPhotoClick = this.onPhotoClick.bind(this);
    this.remove = this.remove.bind(this);
    this.element.addEventListener('click', this.onPhotoClick);
    container.appendChild(this.element);
  };
  BaseComponent.prototype.getElement = function(data) {
    return data.element;
  };
  return BaseComponent;
});
