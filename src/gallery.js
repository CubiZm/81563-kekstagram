'use strict';

define('gallery', ['./utils'], function(utils) {
  var Gallery = function() { // КОНСТРУКТОР

    this.galleryContainer = document.querySelector('.gallery-overlay');
    //console.log(galleryContainer)
    this.closeElement = this.galleryContainer.querySelector('.gallery-overlay-close');
    this.thumbnailsContainer = this.galleryContainer.querySelector('.gallery-overlay-image');
    this.pic = document.querySelector('.pictures');
    this.likes = this.galleryContainer.querySelector('.likes-count');
    this.comments = this.galleryContainer.querySelector('.comments-count');
    this.keyRightCheck = utils.listenKey(39, switchNextPicture);
    this.keyLeftCheck = utils.listenKey(37, switchPrevPicture);
    var keyEsc = utils.listenKey(27);
    this.hashRegExp = new RegExp(/#photo\/(\S+)/);
    this.currentHash = window.location.hash;
    var self = this;
    /** @type {Array.<string>} */
    this.galleryPictures = [];
    /** @type {number} */
    var activePicture = 0;

      self.pic.addEventListener('click', function(e) {
      e.preventDefault();
      self.galleryContainer.classList.remove('invisible');
      });


    Gallery.prototype.closeGallery = function() { // ПРОТОТИП
      self.galleryContainer.classList.add('invisible');
    };

    this.closeElement.addEventListener('click', function() {
      self.closeGallery();
    });

    /**
   * @param {Array.<pictues>} pictures
   */

    Gallery.prototype.showPhoto = function() {  // ПРОТОТИП
      this.galleryContainer.classList.remove('invisible');
    };

    this.showPhoto = function(numberPhoto) {
      this.nextPhoto = this.photos[numberPhoto];
      this.thumbnailsContainer.src = this.nextPhoto.url;
      this.comments.textContent = this.nextPhoto.comments;
      this.likes.textContent = this.nextPhoto.likes;

      window.location.hash = 'photo/' + this.nextPhoto.url;

      this.thumbnailsContainer.onerror = function() {
        // self.showPhoto(++numberPhoto);
        window.location.href = '';
      };
    };

    Gallery.prototype.photoForGallery = function(pictures) {
      self.photos = pictures;
    };

    window.addEventListener('keydown', function(evt) {
      if (!self.galleryContainer.classList.contains('invisible') && keyEsc) {
        evt.preventDefault();
        self.closeGallery();
        window.location.href = '';
      }
    });

    function switchNextPicture() {
      self.showPhoto(++activePicture);
    }

    function switchPrevPicture() {
      self.showPhoto(--activePicture);
    }

    this.thumbnailsContainer.addEventListener('keydown', this.keyRightCheck);
    this.thumbnailsContainer.addEventListener('click', switchNextPicture);

    this.thumbnailsContainer.addEventListener('keydown', this.keyLeftCheck);
    //thumbnailsContainer.addEventListener('click', switchPrevPicture);

  // Проверка хэша страницы
    this.changeGalleryState = function() {
      self.currentHash = window.location.hash;
      self.hashRegExp = new RegExp(/#photo\/(\S+)/);
      if(self.currentHash.match(self.hashRegExp)) {
        self.galleryContainer.classList.remove('invisible');
        self.showPhoto(activePicture);
        //self.photoForGallery();
      } else {
      self.closeGallery();
      }
    };

    window.addEventListener('hashchange', this.changeGalleryState);
  };
  return new Gallery();
});
