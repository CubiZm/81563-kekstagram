'use strict';

  define(function() {
    return function(gallery) {
      console.log('hi')
      var galleryContainer = document.querySelector('.gallery-overlay');
      var closeElement = galleryContainer.querySelector('.gallery-overlay-close');
      var thumbnailsContainer = galleryContainer.querySelector('.gallery-overlay-image');
      var preview = galleryContainer.querySelector('.gallery-overlay-preview');
      var likes = galleryContainer.querySelector('.likes-count');
      var comments = galleryContainer.querySelector('.comments-count');

    /** @type {Array.<string>} */
      var galleryPictures = []
     /** @type {number} */
      var activePicture = 0;

  /**
   * @param {number} picture
   */
      var setActivePicture = function(picture) {
        var thumbnails = thumbnailsContainer.querySelectorAll('img');

        var currentlyActivePic = thumbnailsContainer.querySelector('.hidden');
        if (currentlyActivePic) {
          currentlyActivePic.classList.remove('hidden');
        }

        thumbnails[picture].classList.add('hidden');
        preview.src = thumbnails[picture].src;
      };


      // var hideGallery = function() {
      //   utils.setElementHidden(galleryContainer, true);

      //   document.removeEventListener('keydown', onDocumentKeydownHandler);
      //   closeElement.removeEventListener('click', onCloseClickHandler);
      //   closeElement.removeEventListener('keydown', onCloseKeydownHandler);
      // };
  var closeGallery = function() {
    galleryContainer.classList.add('invisible');
  };
    }
  });
