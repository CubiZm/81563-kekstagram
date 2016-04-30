'use strict';
define(function() {
  return function(pictures, filter) {
    var picturesToFilter = pictures.slice(0);
    var filterType = {
      POPULAR: 'filter-popular',
      NEW: 'filter-new',
      DISCUSSED: 'filter-discussed'
    };

    switch(filter) {
      case filterType.POPULAR:
        break;
      case filterType.NEW:
        picturesToFilter = picturesToFilter.filter(function(elem) {
          var dateTwoWeeksAgo = new Date(elem.date);
          var nowDate = new Date();
          return dateTwoWeeksAgo > nowDate - 14 * 24 * 60 * 60 * 1000;
        });
        picturesToFilter = picturesToFilter.sort(function(a, b) {
          return new Date(b.date) - new Date(a.date);
        });
        break;
      case filterType.DISCUSSED:
        picturesToFilter = picturesToFilter.sort(function(a, b) {
          return b.comments - a.comments;
        });
        break;
    }
    return picturesToFilter;
  };
});
