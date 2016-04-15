/* global Resizer: true */

/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */


'use strict';

var browserCookies = require('browser-cookies');

(function() {
  /** @enum {string} */
  var FileType = {
    'GIF': '',
    'JPEG': '',
    'PNG': '',
    'SVG+XML': ''
  };

  /** @enum {number} */
  var Action = {
    ERROR: 0,
    UPLOADING: 1,
    CUSTOM: 2
  };

  /**
   * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
   * из ключей FileType.
   * @type {RegExp}
   */
  var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

  /**
   * @type {Object.<string, string>}
   */
  var filterMap;

  /**
   * Объект, который занимается кадрированием изображения.
   * @type {Resizer}
   */
  var currentResizer;

  /**
   * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
   * изображением.
   */
  function cleanupResizer() {
    if (currentResizer) {
      currentResizer.remove();
      currentResizer = null;
    }
  }

  /**
   * Ставит одну из трех случайных картинок на фон формы загрузки.
   */
  function updateBackground() {
    var images = [
      'img/logo-background-1.jpg',
      'img/logo-background-2.jpg',
      'img/logo-background-3.jpg'
    ];

    var backgroundElement = document.querySelector('.upload');
    var randomImageNumber = Math.round(Math.random() * (images.length - 1));
    backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
  }

  /**
   * Проверяет, валидны ли данные, в форме кадрирования.
   * @return {boolean}
   */
   // Надеюсь это сюда..
  var resizeForm = document.forms['upload-resize']; // найдем форму
  var resizeFormX = resizeForm['resize-x']; // зададим переменную для левой стороны
  var resizeFormY = resizeForm['resize-y']; // ..верха
  var resizeFormSide = resizeForm['resize-size']; // зададим переменную для стороны
  var resizeBtn = resizeForm['resize-fwd']; // кнопочка

  //var resizeFwd = document.querySelector('#resize-fwd');
  //var resizeMessage = document.querySelector('.error-message');
  // Надоели минусы, не дадим им шанса!
  resizeFormX.min = 0;
  resizeFormY.min = 0;
  resizeFormSide.min = 1;
// Т.к. из-за того, что убрали отрицательные значения сломалось всё, то всё по новой
  // function resizeFormIsValid() {
  //   var x = +resizeFormX.value;
  //   var y = +resizeFormY.value;
  //   var side = +resizeFormSide.value;
  //   var imageWidth = currentResizer._image.naturalWidth;
  //   var imageHeight = currentResizer._image.naturalHeight;

  //   if (x + side <= imageWidth && y + side <= imageHeight) {
  //     resizeBtn.disabled = false;
  //     resizeMessage.classList.add('invisible');
  //     return true;
  //   }

  //   resizeBtn.disabled = true;
  //   resizeMessage.classList.remove('invisible');
  //   return false;
  // }

  // resizeForm.onchange = function() {
  //   resizeFormIsValid();
  // };
  function resizeFormIsValid() {
    var x = +resizeFormX.value;
    var y = +resizeFormY.value;
    var side = +resizeFormSide.value;
    var imageWidth = currentResizer._image.naturalWidth;
    var imageHeight = currentResizer._image.naturalHeight;
    var messageWrapper = document.getElementById('upload-resize-message');

    if (x + side <= imageWidth && y + side <= imageHeight) {
      resizeBtn.disabled = false;
      if (messageWrapper) {
        messageWrapper.textContent = '';
      }
      // resizeMessage.classList.add('invisible');
      return true;
    }

    if (!messageWrapper) {
      messageWrapper = document.createElement('div');
      messageWrapper.id = 'upload-resize-message';
    }

    resizeBtn.disabled = true;
    messageWrapper.textContent = 'Введеные значения не верны! Проверьте правильность введеных значений.';
    console.log(messageWrapper);
    resizeForm.appendChild(messageWrapper);
    return false;
  }

  function formIsValid() {
    var isValid = true;
  // проверяем не пустые ли поля
    if (resizeFormX.value.length === 0 || resizeFormY.value.length === 0 || resizeFormSide.value.length === 0) {
      isValid = false;
      return isValid;
    }
    for (var i = 0; i < resizeForm.elements.length; i++) {
      isValid = resizeForm.elements[i].validity.valid;
      if (!isValid) {
        break;
      }
    }
    if (isValid) {
      resizeBtn.removeAttribute('disabled');
      return true;
    } else {
      resizeBtn.setAttribute('disabled', '');
    }
    return formIsValid();
  }
  formIsValid();
  // делаем по умолчанию кнопку отправки неактивной
  resizeBtn.setAttribute('disabled', '');

// вычисляем максимально возможное значение сторон
  function setMaxSideValue(x, y) {
    resizeFormSide.max = Math.min( parseInt((currentResizer._image.naturalWidth - x.value), 10), parseInt((currentResizer._image.naturalHeight - y.value), 10));
  }
  resizeForm.onchange = function() {
    setMaxSideValue(resizeFormX, resizeFormY);
    resizeFormIsValid();
  };

  /**
   * Форма загрузки изображения.
   * @type {HTMLFormElement}
   */
  var uploadForm = document.forms['upload-select-image'];

  /**
   * Форма кадрирования изображения.
   * @type {HTMLFormElement}
   */
  //var resizeForm = document.forms['upload-resize'];

  /**
   * Форма добавления фильтра.
   * @type {HTMLFormElement}
   */
  var filterForm = document.forms['upload-filter'];

  /**
   * @type {HTMLImageElement}
   */
  var filterImage = filterForm.querySelector('.filter-image-preview');

  /**
   * @type {HTMLElement}
   */
  var uploadMessage = document.querySelector('.upload-message');

  /**
   * @param {Action} action
   * @param {string=} message
   * @return {Element}
   */
  function showMessage(action, message) {
    var isError = false;

    switch (action) {
      case Action.UPLOADING:
        message = message || 'Кексограмим&hellip;';
        break;

      case Action.ERROR:
        isError = true;
        message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
        break;
    }

    uploadMessage.querySelector('.upload-message-container').innerHTML = message;
    uploadMessage.classList.remove('invisible');
    uploadMessage.classList.toggle('upload-message-error', isError);
    return uploadMessage;
  }

  function hideMessage() {
    uploadMessage.classList.add('invisible');
  }

  /**
   * Обработчик изменения изображения в форме загрузки. Если загруженный
   * файл является изображением, считывается исходник картинки, создается
   * Resizer с загруженной картинкой, добавляется в форму кадрирования
   * и показывается форма кадрирования.
   * @param {Event} evt
   */
  uploadForm.addEventListener('change', function(evt) {
    var element = evt.target;
    if (element.id === 'upload-file') {
      // Проверка типа загружаемого файла, тип должен быть изображением
      // одного из форматов: JPEG, PNG, GIF или SVG.
      if (fileRegExp.test(element.files[0].type)) {
        var fileReader = new FileReader();

        showMessage(Action.UPLOADING);

        fileReader.addEventListener('load', function() {
          cleanupResizer();

          currentResizer = new Resizer(fileReader.result);
          currentResizer.setElement(resizeForm);
          uploadMessage.classList.add('invisible');

          uploadForm.classList.add('invisible');
          resizeForm.classList.remove('invisible');

          hideMessage();
        });

        fileReader.readAsDataURL(element.files[0]);
      } else {
        // Показ сообщения об ошибке, если загружаемый файл, не является
        // поддерживаемым изображением.
        showMessage(Action.ERROR);
      }
    }
  });

  /**
   * Обработка сброса формы кадрирования. Возвращает в начальное состояние
   * и обновляет фон.
   * @param {Event} evt
   */
  resizeForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  });

  /**
   * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
   * кропнутое изображение в форму добавления фильтра и показывает ее.
   * @param {Event} evt
   */
  resizeForm.addEventListener('submit', function(evt) {
    evt.preventDefault();

    if (resizeFormIsValid()) {
      filterImage.src = currentResizer.exportImage().src;

      resizeForm.classList.add('invisible');
      filterForm.classList.remove('invisible');
    }
  });

  /**
   * Сброс формы фильтра. Показывает форму кадрирования.
   * @param {Event} evt
   */
  filterForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  });

  /**
   * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
   * записав сохраненный фильтр в cookie.
   * @param {Event} evt
   */
  filterForm.addEventListener('submit', function(evt) {
    evt.preventDefault();

    filterForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
    // Жизнь печеньки
    evt.preventDefault();
    var year = new Date();
    var yearNow = year.getFullYear() - 1;
    var bDay = new Date(yearNow, 3, 18).getTime();
    var dateDiff = (Date.now() - bDay) / 24 / 60 / 60 / 1000;
    var filterCookies = browserCookies.get('filter');
    if (filterCookies) {
      document.getElementById(filterCookies).checked = true;
    }

    filterForm.addEventListener('change', function() {
      var filters = filterForm['upload-filter'];
      var checkedFilter;
      for (var i = 0, l = filters.length; i < l; i++) {
        if (filters[i].checked) {
          checkedFilter = filters[i].id;
          break;
        }
      }
      // Установка куки
      browserCookies.set('filter', checkedFilter, {
        expires: dateDiff
      });
    });
    cleanupResizer();
    updateBackground();
  });

  /**
   * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
   * выбранному значению в форме.
   */
  filterForm.addEventListener('change', function() {
    if (!filterMap) {
      // Ленивая инициализация. Объект не создается до тех пор, пока
      // не понадобится прочитать его в первый раз, а после этого запоминается
      // навсегда.
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia'
      };
    }

    var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
      return item.checked;
    })[0].value;

    // Класс перезаписывается, а не обновляется через classList потому что нужно
    // убрать предыдущий примененный класс. Для этого нужно или запоминать его
    // состояние или просто перезаписывать.
    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
  });

  cleanupResizer();
  updateBackground();
})();
