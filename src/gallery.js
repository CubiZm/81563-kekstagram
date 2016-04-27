'use strict';

define('gallery', ['./utils'], function(utils) {
// return function(showGallery) {
var Gallery = function() {
  var self = this;

  this.galleryContainer = document.querySelector('.gallery-overlay');
  var closeElement = this.galleryContainer.querySelector('.gallery-overlay-close');
  var thumbnailsContainer = this.galleryContainer.querySelector('.gallery-overlay-image');
  var pic = document.querySelector('.pictures');
  var likes = this.galleryContainer.querySelector('.likes-count');
  var comments = this.galleryContainer.querySelector('.comments-count');
  var keyRightCheck = utils.listenKey(39, switchNextPicture);
  var keyLeftCheck = utils.listenKey(37, switchPrevPicture);
  var keyEsc = utils.listenKey(27);

  /** @type {Array.<string>} */
  this.galleryPictures = [];
  /** @type {number} */
  this.activePicture = 0;

  pic.addEventListener('click', function(e) {
    e.preventDefault();
    galleryContainer.classList.remove('invisible');
  });


  this.closeGallery = function() {
    galleryContainer.classList.add('invisible');
  };
  closeElement.addEventListener('click', function() {
    closeGallery();
  });

  /**
 * @param {Array.<pictues>} pictures
 */

 this.showPhoto = function(numberPhoto) {
    var nextPhoto = self.galleryPictures[numberPhoto];
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
    this.showPhoto(++activePicture);
  }

  function switchPrevPicture() {
    this.showPhoto(--activePicture);
  }

  thumbnailsContainer.addEventListener('keydown', keyRightCheck);
  thumbnailsContainer.addEventListener('click', switchNextPicture);

  thumbnailsContainer.addEventListener('keydown', keyLeftCheck);
  //thumbnailsContainer.addEventListener('click', switchPrevPicture);
  return new Gallery();
  // {

    // showGallery: function(numberPhoto) {
    //   galleryContainer.classList.remove('invisible');
    //   activePicture = numberPhoto;
    //   showPhoto(activePicture);
    // },
    // photoForGallery: function(pictures) {
    //   galleryPictures = pictures;
    // }
  // };
}
});
