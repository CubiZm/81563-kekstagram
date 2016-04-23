'use strict';

  define(function() {
    return function(showGallery) {
      var galleryContainer = document.querySelector('.gallery-overlay');
      var closeElement = galleryContainer.querySelector('.gallery-overlay-close');
      var thumbnailsContainer = galleryContainer.querySelector('.gallery-overlay-image');
      var preview = galleryContainer.querySelector('.gallery-overlay-preview');
      var likes = galleryContainer.querySelector('.likes-count');
      var comments = galleryContainer.querySelector('.comments-count');
      var pic = document.querySelector('.pictures')

    /** @type {Array.<string>} */
      var galleryPictures = []
     /** @type {number} */
      var activePicture = 0;

      pic.addEventListener('click', function(e) {
        e.preventDefault();
        galleryContainer.classList.remove('invisible')
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
    }
  // }


// *
//   * Получение списка картинок
//   * @param  {Object}  picturesList
//   * @return {Object}

//  function getPicturesList(picturesList) {
//    galleryPictures = picturesList;
//    return galleryPictures;
//  }

    var closeGallery = function() {
      galleryContainer.classList.add('invisible');
    };
    closeElement.addEventListener('click', function() {
      closeGallery();
    });
  }
  return {
    showGallery: function(numberPhoto) {
    galleryContainer.classList.remove('invisible');
    activePicture = numberPhoto;
    showPhoto(activePicture);
    }
  }
});

