'use strict';

define('gallery', ['./utils'], function(utils) {
    return function(showGallery) {
      var galleryContainer = document.querySelector('.gallery-overlay');
      var closeElement = galleryContainer.querySelector('.gallery-overlay-close');
      var thumbnailsContainer = galleryContainer.querySelector('.gallery-overlay-image');
      var preview = galleryContainer.querySelector('.gallery-overlay-preview');
      var likes = galleryContainer.querySelector('.likes-count');
      var comments = galleryContainer.querySelector('.comments-count');
      var pic = document.querySelector('.pictures');
      var keyRightCheck = utils.listenKey(39, switchNextPicture);
      var keyLeftCheck = utils.listenKey(37, switchPrevPicture);
      // var keyEsc = (evt.keyCode === 27);


    /** @type {Array.<string>} */
      var galleryPictures = []
     /** @type {number} */
      var activePicture = 0;

      // pic.addEventListener('click', function(e) {
      //   e.preventDefault();
      //   galleryContainer.classList.remove('invisible')
      // });

    var closeGallery = function() {
      galleryContainer.classList.add('invisible');
    };
    closeElement.addEventListener('click', function() {
      closeGallery();
    });

    /**
   * @param {Array.<pictues>} pictures
   */
  var showPhoto = function(numberPhoto) {
  var nextPhoto = galleryPictures[numberPhoto];
  var pictureElement = new Image();


  pictureElement.onload = function(evt) {

      thumbnailsContainer.src = evt.target.src;
      thumbnailsContainer.alt = nextPhoto.date;
      likes.textContent = nextPhoto.likes;
      comments.textContent = nextPhoto.comments;
    };

    pictureElement.onerror = function() {
      showPhoto(activePicture + 1);
      }
    thumbnailsContainer.src = nextPhoto.url;
    }

    var setActivePicture = function(picture) {
      var thumbnails = thumbnailsContainer.querySelectorAll('img');
       preview.src = thumbnails[picture].src;
    }

  window.addEventListener('keydown', function(evt) {
    if (!galleryContainer.classList.contains('invisible') && evt.keyCode === 27) {
      evt.preventDefault();
      closeGallery();
    }
  });

  function switchNextPicture() {
    showPhoto(activePicture + 1);
  }

  function switchPrevPicture() {
   showPhoto(activePicture - 1);
  }

  window.addEventListener('keydown', keyRightCheck);
  thumbnailsContainer.addEventListener('click', switchNextPicture);

  window.addEventListener('keydown', keyLeftCheck);
  // prevPicture.addEventListener('click', switchPrevPicture);

// *
//   * Получение списка картинок
//   * @param  {Object}  picturesList
//   * @return {Object}

 function getPicturesList(picturesList) {
   galleryPictures = picturesList;
   return galleryPictures;
 }

  }
  return {
    showGallery: function(numberPhoto) {
    galleryContainer.classList.remove('invisible');
    activePicture = numberPhoto;
    showPhoto(activePicture);
    galleryPictures = pictures;
    activePicture = 0;
    }
  }
});

