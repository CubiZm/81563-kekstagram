'use strict';

define('gallery', ['./utils'], function(utils) {
// return function(showGallery) {
  var galleryContainer = document.querySelector('.gallery-overlay');
  var closeElement = galleryContainer.querySelector('.gallery-overlay-close');
  var thumbnailsContainer = galleryContainer.querySelector('.gallery-overlay-image');
  var pic = document.querySelector('.pictures');
  var likes = galleryContainer.querySelector('.likes-count');
  var comments = galleryContainer.querySelector('.comments-count');
  var keyRightCheck = utils.listenKey(39, switchNextPicture);
  var keyLeftCheck = utils.listenKey(37, switchPrevPicture);
  var keyEsc = utils.listenKey(27);

  /** @type {Array.<string>} */
  var galleryPictures = [];
  /** @type {number} */
  var activePicture = 0;

  pic.addEventListener('click', function(e) {
    e.preventDefault();
    galleryContainer.classList.remove('invisible');
  });


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
    thumbnailsContainer.src = nextPhoto.url;
    comments.textContent = nextPhoto.comments;
    likes.textContent = nextPhoto.likes;
  };

  window.addEventListener('keydown', function(evt) {
    if (!galleryContainer.classList.contains('invisible') && keyEsc) {
      evt.preventDefault();
      closeGallery();
    }
  });

  function switchNextPicture() {
    showPhoto(++activePicture);
  }

  function switchPrevPicture() {
    showPhoto(--activePicture);
  }

  thumbnailsContainer.addEventListener('keydown', keyRightCheck);
  thumbnailsContainer.addEventListener('click', switchNextPicture);

  thumbnailsContainer.addEventListener('keydown', keyLeftCheck);
  //thumbnailsContainer.addEventListener('click', switchPrevPicture);
  return {
    showGallery: function(numberPhoto) {
      galleryContainer.classList.remove('invisible');
      activePicture = numberPhoto;
      showPhoto(activePicture);
    },
    photoForGallery: function(pictures) {
      galleryPictures = pictures;
    }
  };
});
