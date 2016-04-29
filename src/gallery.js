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

    var self = this;
    /** @type {Array.<string>} */
    this.galleryPictures = [];
    /** @type {number} */
    var activePicture = 0;

    this.pic.addEventListener('click', function(e) {
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
   // НАДО ПОПРАВИТЬ !!!!

   //нельзя писать методы в прототип внутри конструктора
   //надо вынести отдельно
   // var gallery = new Gallery.;
   // gallery.showPhoto();

    Gallery.prototype.showPhoto = function(numberPhoto) {  // ПРОТОТИП
      this.galleryContainer.classList.remove('invisible');
      var nextPhoto = this.photos[numberPhoto];
      this.thumbnailsContainer.src = nextPhoto.url;
      this.comments.textContent = nextPhoto.comments;
      this.likes.textContent = nextPhoto.likes;
      // Лена обещала обработчик ошибки -- Лена сделала обработчик.
      // Хотя кто это читает :(
      this.thumbnailsContainer.onerror = function() {
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

    this.thumbnailsContainer.addEventListener('keydown', this.keyRightCheck);
    this.thumbnailsContainer.addEventListener('click', switchNextPicture);

    this.thumbnailsContainer.addEventListener('keydown', this.keyLeftCheck);
    //thumbnailsContainer.addEventListener('click', switchPrevPicture);
  };
  return new Gallery();
});
