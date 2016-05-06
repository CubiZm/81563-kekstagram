'use strict';

define(['../utils', './base-component'], function(utilsModule, BaseComponent) {
  var elementToClone;
  var templateElement = document.querySelector('#picture-template');

  // Для IE
  if ('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.picture');
  } else {
    elementToClone = templateElement.querySelector('.picture');
  }

  // Создаем блок фотографии на основе шаблона
  var getPictureElement = function(data, container) {
    var element = elementToClone.cloneNode(true);
    element.querySelector('.picture-comments').textContent = data.comments;
    element.querySelector('.picture-likes').textContent = data.likes;

    // Создаем изображения
    var image = element.querySelector('img');

    var pictureImage = new Image();

    // Обработчик загрузки
    pictureImage.onload = function() {
      // Отмена таймаута
      clearTimeout(imageLoadTimeout);
      image.src = data.url;
      image.width = utilsModule.IMAGE_SIZE;
      image.height = utilsModule.IMAGE_SIZE;
      image.alt = data.date;
    };

    // Обработчик ошибки
    pictureImage.onerror = function() {
      image.classList.add('picture-load-failure');
    };

    pictureImage.src = data.url;

    // Таймаут
    var imageLoadTimeout = setTimeout(function() {
      image.src = '';
      image.classList.add('picture-load-failure');
    }, 5000);

    container.appendChild(element);
    return element;
  };

  var Photo = function(data, container) {
    //BaseComponent.call(this, this.element);

    this.data = data;
    this.element = getPictureElement(data, container);
    this.onPhotoListClick = this.onPhotoListClick.bind(this);

    this.element.addEventListener('click', this.onPhotoListClick);
    container.appendChild(this.element);

    //BaseComponent.prototype.add.call(this, container);
  };

  Photo.prototype.onPhotoListClick = function(evt) {
    evt.preventDefault();
    if (evt.target.nodeName !== 'IMG') {
      return false;
    }
    var list = utilsModule.getFilteredPictures();
    var index = 0;
    for (var i = 0; i < list.length; i++) {
      if (this.data.url === list[i].url) {
        index = i;
      }
    }

    window.location.hash = 'photo/' + list[index].url;
    return true;
  };

  Photo.prototype.remove = function() {
    this.element.removeEventListener('click', this.onPhotoListClick);
    this.element.parentNode.removeChild(this.element);
  };

//BaseComponent();
  utilsModule.inherit(Photo, BaseComponent);
  //console.dir(Photo)
  //console.dir(BaseComponent)

  return {
    getPictureElement: getPictureElement,
    Photo: Photo
  };
});
