'use strict';
define(function() {
  var BaseComponent = function(data, container) {
    BaseComponent.prototype.add = function(data, container) {
      container.appendChild(data);
    };
    BaseComponent.prototype.remove = function(data, container) {
      container.removeChild(data);
    };
    return BaseComponent;
  };
});
