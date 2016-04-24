'use strict';

define('gallery', ['./utils'], function(utils) {
  // return function(showGallery) {
    var galleryContainer = document.querySelector('.gallery-overlay');
    var closeElement = galleryContainer.querySelector('.gallery-overlay-close');
    var thumbnailsContainer = galleryContainer.querySelector('.gallery-overlay-image');
    // var preview = galleryContainer.querySelector('.gallery-overlay-preview');
    var likes = galleryContainer.querySelector('.likes-count');
    var comments = galleryContainer.querySelector('.comments-count');
    var keyRightCheck = utils.listenKey(39, switchNextPicture);
    var keyLeftCheck = utils.listenKey(37, switchPrevPicture);
    var keyEsc = utils.listenKey(27, closeGallery);

    /** @type {Array.<string>} */
    var galleryPictures = [];
    /** @type {number} */
    var activePicture = 0;


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
      //galleryContainer.classList.remove('invisible');
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
      };
    //pictureElement.src = nextPhoto.url;
    };

    window.addEventListener('keydown', function(evt) {
      if (!galleryContainer.classList.contains('invisible') && keyEsc) {
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
    showPhoto(activePicture);
  // };
});

