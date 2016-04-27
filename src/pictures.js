'use strict';

define(['filter', 'ajax', 'gallery', 'utils', 'photo'], function(getFilteredPictures, getPictures, gallery, utils, Photo) {
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
    gallery.photoForGallery(pics);
    var imageLoadTimeout = setTimeout(function() {
      image.src = '';
    });

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
    var renderedPhotos = [];
    var from = page * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var container = document.createDocumentFragment();
    pictures.slice(from, to).forEach(function(picture, number) {
      //getPictureElement(picture, picturesContainer);
      renderedPhotos.push(new Photo(picture, from + number, container));
      //console.log(new Photo)
    });
    renderedPhotos.forEach(function(picture) {
      picture.remove();
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
