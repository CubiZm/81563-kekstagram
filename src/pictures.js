'use strict';

define(['filter', 'ajax', 'gallery', 'utils'], function(getFilteredPictures, getPictures, showPhoto) {
  var picturesContainer = document.querySelector('.pictures');
  var containerSides = picturesContainer.getBoundingClientRect();
  var templateElement = document.querySelector('#picture-template');
  var filters = document.querySelector('.filters');
  var pics = [];
  var filteredPictures = [];
  var elementToClone;
  var PAGE_SIZE = 12;
  var pageNumber = 0;
  filters.classList.add('hidden');

  if ('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.picture');
  } else {
    elementToClone = templateElement.querySelector('.picture');
  }

  var getPictureElement = function(data, container) {
    var element = elementToClone.cloneNode(true);
    element.querySelector('.picture-comments').textContent = data.comments;
    element.querySelector('.picture-likes').textContent = data.likes;

    var image = element.querySelector('img');

    var pictureImage = new Image();

    pictureImage.onload = function() {
      clearTimeout(imageLoadTimeout);
      image.src = data.url;
      image.width = '182';
      image.height = '182';
      image.alt = data.date;
    };

    pictureImage.onerror = function() {
      image.classList.add('picture-load-failure');
    };

    pictureImage.src = data.url;

    var imageLoadTimeout = setTimeout(function() {
      image.src = '';
    });

    // image.addEventListener('click', function() {
    //   showPhoto(data.pictures);
    // });

    container.appendChild(element);
    return element;
  };

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

    pictures.slice(from, to).forEach(function(picture) {
      getPictureElement(picture, picturesContainer);
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


  getPictures(function(loadedPictures) {
    pics = loadedPictures;
    setFiltrationEnabled();
    setFilterEnabled('filter-popular');
    setScrollEnabled();
    // showGallery();
    picturesContainer.classList.remove('pictures-loading');
  });

  filters.classList.remove('hidden');
});
