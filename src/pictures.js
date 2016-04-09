'use strict';

(function() {

  var blockFilters = document.querySelector('.filters');
  blockFilters.classList.add('hidden');

  var picturesContainer = document.querySelector('.pictures');
  var templateElement = document.getElementById('picture-template');
  var elementToClone;

  if('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.picture');
  } else {
    elementToClone = templateElement.querySelector('.pictures');
  }


  var getPictureElement = function(data, container) {

    var element = elementToClone.cloneNode(true);
    var backgroundImage = element.querySelector('img');

    element.querySelector('.picture-comments').textContent = data.comments;
    element.querySelector('.picture-likes').textContent = data.likes;
    container.appendChild(element);

    var loadImage = new Image();
    var backgroundLoadTimeout;

    backgroundImage.src = data.preview;

    loadImage.onload = function(evt) {
      clearTimeout(backgroundLoadTimeout);
      backgroundImage.src = evt.target.src;
      backgroundImage.width = 182;
      backgroundImage.height = 182;
    };

    loadImage.onerror = function() {
      element.classList.add('picture-load-failure');
    };

    loadImage.src = data.url;
    return element;
  };

  // pictures.forEach(function(pictures) {
  //   getPictureElement(pictures, picturesContainer);
  // });
  blockFilters.classList.remove('hidden');

  var pictures = [];
  // получим фоточки
  var getPictures = function(callback) {
    var picturesCont = document.querySelector('.pictures');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '//o0.github.io/assets/json/pictures.json');
    xhr.send();

    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) {
        picturesCont.classList.remove('pictures-loading');
      }
      return;
    };
    picturesCont.classList.add('pictures-loading');

    xhr.onload = function(evt) {
      var requestPhoto = evt.target;
      var response = requestPhoto.response;
      response = JSON.parse(response);
      callback(response);
    };

    xhr.onerror = function() {
      picturesCont.classList.add('pictures-failure');
    };
  };
  // отдадим фоточки
  var renderPictures = function(getPictures) {
    picturesContainer.innerHTML = '';

    getPictures.forEach(function(picture) {
      getPictureElement(picture, picturesContainer);
    });
  };
  // получим фоточки...
  getPictures(function(loadedPictures) {
    pictures = loadedPictures;
    renderPictures(pictures);
  });

  // отфильтруем фоточки

  var getFiltrationPictures = function(getPictures, filtration) {
    var picturesToFiltration = getPictures.slice(0);
    // фото по количеству комментариев
    switch (filtration) {
      case 'filter-discussed':
        picturesToFiltration.sort(function(a, b) {
          return b.comments - a.comments;
        });
        break;
      // новые
      case 'filter-new':
        picturesToFiltration.sort(function(a, b) {
          if (a.date < b.date) {
            return 1;
          }
          if (a.date > b.date) {
            return -1;
          }
          return 0;
        });
        // а прошлые две недели
        var dateNow = new Date();
        var twoWeekBack = ++dateNow - 14 * 24 * 60 * 60 * 1000;
        picturesToFiltration = picturesToFiltration.filter(function() {
          return dateNow > twoWeekBack;
        });
        break;
    }

    return picturesToFiltration;
  };

  var setFiltration = function(filtration) {
    var filtrationPictures = getFiltrationPictures(pictures, filtration);
    renderPictures(filtrationPictures);
  };

  getPictures(function(loadedPictures) {
    pictures = loadedPictures;
    renderPictures(pictures);
  });

  // начала делать выборку по фильтру
  blockFilters.onchange = function() {
    var selectedFiltration;
    setFiltration(selectedFiltration);
  };
})();
