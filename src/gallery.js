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
    this.currentHash = location.hash;

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

    // this.closeElement.addEventListener('click', function() {
    //   self.closeGallery();
    //   history.replaceState(null, null, numberPhoto);
    // });

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
      this.thumbnailsContainer.onerror = function() {
        self.showPhoto(++numberPhoto);
      };

      //var strUrl = this.thumbnailsContainer.src.toString(); // получали, по сути, ссылку
      //var strUrl = this.thumbnailsContainer.src  ССЫЛКА НА КАРТИНКУ

      // NB! не могу сообразить регулярку,пока так
      // Всё будет очень плохо, если адрес поменяется

      // var url = strUrl.substr(21); // обрезали нужное число букоФФ

      var url = this.nextPhoto.url; // СТРОКА
      history.pushState(null, null, '#' + url);

      this.closeElement.addEventListener('click', function() {
        self.closeGallery();
        history.replaceState(null, null, '/');
      });
    };

    // Проверка хэша страницы

    Gallery.prototype.changeGalleryState = function() {
      if (this.currentHash.match(this.hashRegExp) ) {
        self.showGallery(this.currentHash);
      } else {
        self.closeGallery();
      }
    };

    window.addEventListener('hashchange', this.changeGalleryState);

    window.addEventListener('keydown', function(evt) {
      if (!self.galleryContainer.classList.contains('invisible') && keyEsc) {
        evt.preventDefault();
        self.closeGallery();
        history.replaceState(null, null, '/');
      }
    });

    Gallery.prototype.photoForGallery = function(pictures) {
      self.photos = pictures;
    };

    function switchNextPicture() {
      self.showPhoto(++activePicture);
      history.go(1);
    }

    function switchPrevPicture() {
      self.showPhoto(--activePicture);
      history.back(-1);
    }


    this.thumbnailsContainer.addEventListener('keydown', this.keyRightCheck);
    this.thumbnailsContainer.addEventListener('click', switchNextPicture);

    this.thumbnailsContainer.addEventListener('keydown', this.keyLeftCheck);
    //thumbnailsContainer.addEventListener('click', switchPrevPicture);
  };
  return new Gallery();
});
