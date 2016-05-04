'use strict';
define(function() {
  var picturesContainer = document.querySelector('.pictures');
  var containerSides = picturesContainer.getBoundingClientRect();

  // Общие переменные
  return {
    picturesContainer: document.querySelector('.pictures'),
    pics: [],
    renderedPictures: [],
    filteredPictures: [],
    IMAGE_SIZE: 182,
    pageNumber: 0,
    PAGE_SIZE: 12,

    // inherit: function(child, parent) {
    //   function EmptyCtor() {}
    //   EmptyCtor.prototype = parent.prototype;
    //   child.prototype = new EmptyCtor();
    //   return inherit;
    // },

    isBottomReached: function() {
      return containerSides.top - window.innerHeight <= 0;
    },

    isNextPageAvailable: function(pictures, page, pageSize) {
      return page < Math.floor(this.filteredPictures.length / pageSize);
    },

    getFilteredPictures: function() {
      return this.filteredPictures;
    }
  };
});
