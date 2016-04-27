'use strict';

define(['filter', 'ajax', 'gallery', 'utils', 'get-picture'], function(getFilteredPictures, getPictures, gallery) {
  var picturesContainer = document.querySelector('.pictures');
  var containerSides = picturesContainer.getBoundingClientRect();

  var filters = document.querySelector('.filters');
  var pics = [];
  var filteredPictures = [];
  var elementToClone;
  var PAGE_SIZE = 12;
  var pageNumber = 0;
  filters.classList.add('hidden');


  var isBottomReached = function() {
    return containerSides.top - window.innerHeight <= 0;
  };

  var isNextPageAvailable = function(pictures, page, pageSize) {
    return page < Math.floor(filteredPictures.length / pageSize);
  };

  var renderPictures = function(pictures, page, replace) {
    if(replace) {
      picturesContainer.innerHTML = '';
    }

    var from = page * PAGE_SIZE;
    var to = from + PAGE_SIZE;

    pictures.slice(from, to).forEach(function(picture, number) {
      [].push(new Photo(picture, from + to, picturesContainer));
    });

    var picturesContainerHeight = parseFloat(getComputedStyle(picturesContainer).height);

    var blockIsNotFull = function() {
      return window.innerHeight - picturesContainerHeight > 0;
    };

    var renderNextPages = function() {
      while (blockIsNotFull() && isNextPageAvailable(pictures, pageNumber, PAGE_SIZE)) {
        pageNumber++;
        renderPictures(filteredPictures, pageNumber);
      }
    };

    renderNextPages();
  };

  var setFilterEnabled = function(filter) {
    filteredPictures = getFilteredPictures(pics, filter);
    pageNumber = 0;
    renderPictures(filteredPictures, pageNumber, true);
    gallery.photoForGallery(filteredPictures);
  };

  var setFiltrationEnabled = function() {
    filters.addEventListener('click', function(evt) {
      if (evt.target.classList.contains('filters-radio')) {
        setFilterEnabled(evt.target.id);
      }
    });
  };

  var setScrollEnabled = function() {
    var pictures;
    var scrollTimeout;
    window.addEventListener('scroll', function() {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function() {
        while(isBottomReached() && isNextPageAvailable(pictures, pageNumber, PAGE_SIZE)) {
          pageNumber++;
          renderPictures(filteredPictures, pageNumber);
        }
      }, 100);
    });
  };

  var setShowGallery = function() {
    var pic = document.querySelector('.pictures');
    pic.addEventListener('click', function(evt) {
      if (evt.target.src) {
        var clickedImage = evt.target;
        var allImages = pic.querySelectorAll('img');
        for (var key in allImages) {
          if (allImages[key] === clickedImage) {
            break;
          }
        }
        gallery.showGallery(key);
      }
    });
  };

  getPictures(function(loadedPictures) {
    pics = loadedPictures;
    setFiltrationEnabled();
    setFilterEnabled('filter-popular');
    setScrollEnabled();
    picturesContainer.classList.remove('pictures-loading');
    setShowGallery();
  });

  filters.classList.remove('hidden');
});
