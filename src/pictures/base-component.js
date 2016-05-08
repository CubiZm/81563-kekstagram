'use strict';
define(['./render-photo'], function() {
  var BaseComponent = function(element) {
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
