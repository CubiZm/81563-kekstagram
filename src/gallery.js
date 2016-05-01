'use strict';

define('gallery', ['./utils'], function(utils) {
  var Gallery = function() { // КОНСТРУКТОР

    this.galleryContainer = document.querySelector('.gallery-overlay');
    this.closeElement = this.galleryContainer.querySelector('.gallery-overlay-close');
    this.thumbnailsContainer = this.galleryContainer.querySelector('.gallery-overlay-image');
    this.pic = document.querySelector('.pictures');
    this.likes = this.galleryContainer.querySelector('.likes-count');
    this.comments = this.galleryContainer.querySelector('.comments-count');
    this.keyRightCheck = utils.listenKey(39, switchNextPicture);
    this.keyLeftCheck = utils.listenKey(37, switchPrevPicture);
    var keyEsc = utils.listenKey(27);
    this.hashRegExp = new RegExp(/#photos\/(\S+)/);
    // this.currentHash = location.hash;

    var self = this;
    /** @type {Array.<string>} */
    this.galleryPictures = [];
    /** @type {number} */
    var activePicture = 0;

    this.showGallery = function() {
      self.galleryContainer.classList.remove('invisible');
      this.pic.addEventListener('click', function(e) {
        e.preventDefault();
      });
    };
    this.showGallery();


    Gallery.prototype.closeGallery = function() { // ПРОТОТИП
      self.galleryContainer.classList.add('invisible');
    };

    /**
   * @param {Array.<pictues>} pictures
   */

    Gallery.prototype.showPhoto = function() {  // ПРОТОТИП
      this.galleryContainer.classList.remove('invisible');
    };

    this.showPhoto = function(numberPhoto) {
      //var picture;
      // self.url = this.thumbnailsContainer.src;
      // if (typeof numberPhoto === 'number') {
      //   //picture = this.thumbnailsContainer.src;
      //   console.log('number');
      // } else if (typeof numberPhoto === 'string') {
      //   //picture = self.url;
      //   console.log('string');
      // }
      this.nextPhoto = this.photos[numberPhoto];
      this.thumbnailsContainer.src = this.nextPhoto.url;
      this.comments.textContent = this.nextPhoto.comments;
      this.likes.textContent = this.nextPhoto.likes;
      this.url = this.thumbnailsContainer.src;
      this.thumbnailsContainer.onerror = function() {
        self.showPhoto(++numberPhoto);
      };

      //var url = this.thumbnailsContainer.src; // получали, по сути, ссылку
      //console.log(url);
      location.hash = this.nextPhoto.url;
      //history.pushState(null, null, '#' + url);
      this.closeElement.addEventListener('click', function() {
        self.closeGallery();
        history.replaceState(null, null, '/');
      });
    };

    Gallery.prototype.photoForGallery = function(pictures) {
      self.photos = pictures;
      //console.log(self.photos)
    };

    // Проверка хэша страницы
    Gallery.prototype.changeGalleryState = function() {
      self.showGallery();
      this.showPhoto(activePicture);
      console.log('загрузили объекты фото');
    };

    //this.changeGalleryState();
    window.addEventListener('hashchange', this.changeGalleryState);
    //console.log(/#photos\/(\S+)/.exec(window.location.hash));

    window.addEventListener('keydown', function(evt) {
      if (!self.galleryContainer.classList.contains('invisible') && keyEsc) {
        evt.preventDefault();
        self.closeGallery();
        history.replaceState(null, null, '/');
      }
    });

    function switchNextPicture() {
      self.showPhoto(++activePicture);
      //history.go(1);
    }

    function switchPrevPicture() {
      self.showPhoto(--activePicture);
      //history.back(-1);
    }


    this.thumbnailsContainer.addEventListener('keydown', this.keyRightCheck);
    this.thumbnailsContainer.addEventListener('click', switchNextPicture);

    this.thumbnailsContainer.addEventListener('keydown', this.keyLeftCheck);
    //thumbnailsContainer.addEventListener('click', switchPrevPicture);
  };
  return new Gallery();
});
