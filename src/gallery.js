'use strict';

define('gallery', ['./utils'], function(utils) {
  var Gallery = function() {

    this.galleryContainer = document.querySelector('.gallery-overlay');
    //console.log(galleryContainer)
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
    var activePicture = 0;

    pic.addEventListener('click', function(e) {
      e.preventDefault();
      self.galleryContainer.classList.remove('invisible');
    });


    Gallery.prototype.closeGallery = function() {
      self.galleryContainer.classList.add('invisible');
    };
    closeElement.addEventListener('click', function() {
      self.closeGallery();
    });

    /**
   * @param {Array.<pictues>} pictures
   */
   //нельзя писать методы в прототип внутри конструктора
   //надо вынести отдельно


    Gallery.prototype.showPhoto = function(numberPhoto) {
      this.galleryContainer.classList.remove('invisible');
      var nextPhoto = this.photos[numberPhoto];
      thumbnailsContainer.src = nextPhoto.url;
      comments.textContent = nextPhoto.comments;
      likes.textContent = nextPhoto.likes;
      // Лена обещала обработчик ошибки -- Лена сделала обработчик.
      // Хотя кто это читает :(
      thumbnailsContainer.onerror = function() {
        self.showPhoto(++numberPhoto);
      };
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

    Gallery.prototype.photoForGallery = function(pictures) {
      self.photos = pictures;
    };

    thumbnailsContainer.addEventListener('keydown', keyRightCheck);
    thumbnailsContainer.addEventListener('click', switchNextPicture);

    thumbnailsContainer.addEventListener('keydown', keyLeftCheck);
    //thumbnailsContainer.addEventListener('click', switchPrevPicture);
  };
  return new Gallery();
});
