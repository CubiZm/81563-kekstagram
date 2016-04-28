'use strict';

define('gallery', ['./utils'], function(utils) {
var Gallery = function() {

  console.log(self)

  this.galleryContainer = document.querySelector('.gallery-overlay');
  var closeElement = this.galleryContainer.querySelector('.gallery-overlay-close');
  var thumbnailsContainer = this.galleryContainer.querySelector('.gallery-overlay-image');
  var pic = document.querySelector('.pictures');
  var likes = this.galleryContainer.querySelector('.likes-count');
  var comments = this.galleryContainer.querySelector('.comments-count');
  var keyRightCheck = utils.listenKey(39, switchNextPicture);
  var keyLeftCheck = utils.listenKey(37, switchPrevPicture);
  var keyEsc = utils.listenKey(27);
 var self = this;
  /** @type {Array.<string>} */
  this.galleryPictures = [];
  /** @type {number} */
  this.activePicture = 0;

  pic.addEventListener('click', function(e) {
    e.preventDefault();
    self.galleryContainer.classList.remove('invisible');
  });


  this.closeGallery = function() {
    this.galleryContainer.classList.add('invisible');
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
    if (!self.galleryContainer.classList.contains('invisible') && keyEsc) {
      evt.preventDefault();
      self.closeGallery();
    }
  });

  function switchNextPicture() {
    self.showPhoto(++activePicture);
  }

  function switchPrevPicture() {
    self.showPhoto(--activePicture);
  }

  thumbnailsContainer.addEventListener('keydown', keyRightCheck);
  thumbnailsContainer.addEventListener('click', switchNextPicture);

  thumbnailsContainer.addEventListener('keydown', keyLeftCheck);
  //thumbnailsContainer.addEventListener('click', switchPrevPicture);
  }
  //return new Gallery
  return {
    Gallery,
    galleryshowGallery: function(numberPhoto) {
      this.galleryContainer.classList.remove('invisible');
      activePicture = numberPhoto;
      showPhoto(activePicture);
    },
    photoForGallery: function(pictures) {
      galleryPictures = pictures;
    }
  };

});
