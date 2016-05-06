// и Photo и Gallery должны стать BaseComponent

// [12:29]
// чтобы он у них был записан в __proto__

// [12:29]
// стало быть чото они должны брать оттуда из BaseComponent

'use strict';
define(['./render-photo'], function() {
  var BaseComponent = function(element) {
    console.log('^_^');
    this.element = element;
  };
  BaseComponent.prototype.remove = function() {
    this.element.parentNode.removeChild(this.element);
  };

  BaseComponent.prototype.add = function(container) {
    container.appendChild(this.element);
  };
  return BaseComponent;
});
