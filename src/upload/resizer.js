'use strict';

(function() {
  /**
   * @constructor
   * @param {string} image
   */
  var Resizer = function(image) {
    // Изображение, с которым будет вестись работа.
    this._image = new Image();
    this._image.src = image;

    // Холст.
    this._container = document.createElement('canvas');
    this._ctx = this._container.getContext('2d');

    // Создаем холст только после загрузки изображения.
    this._image.onload = function() {
      // Размер холста равен размеру загруженного изображения. Это нужно
      // для удобства работы с координатами.
      this._container.width = this._image.naturalWidth;
      this._container.height = this._image.naturalHeight;

      /**
       * Предлагаемый размер кадра в виде коэффициента относительно меньшей
       * стороны изображения.
       * @const
       * @type {number}
       */
      var INITIAL_SIDE_RATIO = 0.75;

      // Размер меньшей стороны изображения.
      var side = Math.min(
          this._container.width * INITIAL_SIDE_RATIO,
          this._container.height * INITIAL_SIDE_RATIO);

      // Изначально предлагаемое кадрирование — часть по центру с размером в 3/4
      // от размера меньшей стороны.
      this._resizeConstraint = new Square(
          this._container.width / 2 - side / 2,
          this._container.height / 2 - side / 2,
          side);

      // Отрисовка изначального состояния канваса.
      this.setConstraint();
    }.bind(this);

    // Фиксирование контекста обработчиков.
    this._onDragStart = this._onDragStart.bind(this);
    this._onDragEnd = this._onDragEnd.bind(this);
    this._onDrag = this._onDrag.bind(this);
  };

  Resizer.prototype = {
    /**
     * Родительский элемент канваса.
     * @type {Element}
     * @private
     */
    _element: null,

    /**
     * Положение курсора в момент перетаскивания. От положения курсора
     * рассчитывается смещение на которое нужно переместить изображение
     * за каждую итерацию перетаскивания.
     * @type {Coordinate}
     * @private
     */
    _cursorPosition: null,

    /**
     * Объект, хранящий итоговое кадрирование: сторона квадрата и смещение
     * от верхнего левого угла исходного изображения.
     * @type {Square}
     * @private
     */
    _resizeConstraint: null,

    /**
     * Отрисовка канваса.
     */
    redraw: function() {
      // Очистка изображения.
      this._ctx.clearRect(0, 0, this._container.width, this._container.height);

      // Параметры линии.
      // NB! Такие параметры сохраняются на время всего процесса отрисовки
      // canvas'a поэтому важно вовремя поменять их, если нужно начать отрисовку
      // чего-либо с другой обводкой.

      // Толщина линии.
      this._ctx.lineWidth = 4;
      // Цвет обводки.
      //this._ctx.strokeStyle = '#ffe753';
      // Размер штрихов. Первый элемент массива задает длину штриха, второй
      // расстояние между соседними штрихами.
      //this._ctx.setLineDash([1, 2]);
      // Смещение первого штриха от начала линии.
      this._ctx.lineDashOffset = 7;

      // Сохранение состояния канваса.
      // Подробней см. строку 132.
      this._ctx.save();

      // Установка начальной точки системы координат в центр холста.
      this._ctx.translate(this._container.width / 2, this._container.height / 2);

      var displX = -(this._resizeConstraint.x + this._resizeConstraint.side / 2);
      var displY = -(this._resizeConstraint.y + this._resizeConstraint.side / 2);
      // Отрисовка изображения на холсте. Параметры задают изображение, которое
      // нужно отрисовать и координаты его верхнего левого угла.
      // Координаты задаются от центра холста.
      this._ctx.drawImage(this._image, displX, displY);

      // Отрисовка прямоугольника, обозначающего область изображения после
      // кадрирования. Координаты задаются от центра.
      this._ctx.strokeRect(
          (-this._resizeConstraint.side / 2) - this._ctx.lineWidth / 2,
          (-this._resizeConstraint.side / 2) - this._ctx.lineWidth / 2,
          this._resizeConstraint.side - this._ctx.lineWidth / 2,
          this._resizeConstraint.side - this._ctx.lineWidth / 2);

      // Отрисовка фона с прозрачностью 80%
      this._ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'; // Задали прямоугольник с цветом

      // Заполним фон
      this._ctx.beginPath();
      this._ctx.rect(displX, displY, this._container.width, this._container.height);
      this._ctx.rect(
         this._resizeConstraint.side / 2 - this._ctx.lineWidth / 2,
         -this._resizeConstraint.side / 2 - this._ctx.lineWidth,
         -this._resizeConstraint.side - this._ctx.lineWidth / 2,
         this._resizeConstraint.side + this._ctx.lineWidth / 2
       );
      this._ctx.fill();

      // Надпись сверху
      this._ctx.fillStyle = '#fff'; // цвет
      this._ctx.font = 'bold 20px Arial'; // шрифт
      this._ctx.textBaseline = 'bottom'; // линия
      this._ctx.textAlign = 'center'; // положение

       // Попробуем задать точки отсчета текста через переменные

      var textposX = 0;
      var textposY = -this._resizeConstraint.side / 2 - this._ctx.lineWidth;

      var textTop = this._image.naturalWidth + 'x' + this._image.naturalHeight; // выводит размер картинки

      this._ctx.fillText(textTop, textposX, textposY);

      // Выведем рамку!

      // this._ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      //this._ctx.fillStyle = '#ffe753';
      this._ctx.strokeStyle = '#ffe753';
      var lineLength = this._resizeConstraint.side;
      var lineWidth = this._ctx.lineWidth;
      var startX = -lineLength / 2 - lineWidth / 2;
      var startY = startX;

      var zigzagNumber = 30;
      var zigzagSpacing = lineLength / zigzagNumber;

      this._ctx.beginPath();
      this._ctx.moveTo(startX, startY);

      this.drawZigzagTop = function() {
        for (var n = 0; n < zigzagNumber; n++) {
          var x = startX + (n + 1) * zigzagSpacing;
          var y;

          if (n % 2 === 0) {
            y = startY - zigzagSpacing;
          } else {
            y = startY;
          }
          this._ctx.lineTo(x, y);
        }
      };

      this.drawZigzagRight = function() {
        for (var n = 0; n < zigzagNumber; n++) {
          var x;
          var y = startY + (n + 1) * zigzagSpacing;

          if (n % 2 === 0) {
            x = startX + zigzagSpacing;
          } else {
            x = startX;
          }
          this._ctx.lineTo(x + lineLength, y);
        }
      };

      this.drawZigzagBottom = function() {
        for (var n = 0; n < zigzagNumber; n++) {
          var x = startX + lineLength + n * zigzagSpacing;
          var y;

          if (n % 2 === 0) {
            y = startY + lineLength;
          } else {
            y = startY + lineLength + zigzagSpacing;
          }
          this._ctx.lineTo(lineLength - lineWidth - x, y);
        }
      };

      this.drawZigzagLeft = function() {
        for (var n = 0; n < zigzagNumber; n++) {
          var x;
          var y = startY + (n + 1) * zigzagSpacing;

          if (n % 2 === 0) {
            x = startX;
          } else {
            x = startX + zigzagSpacing;
          }
          this._ctx.lineTo(x - zigzagSpacing, -y - lineWidth);
        }
      };

      this.drawZigzagTop();
      this.drawZigzagRight();
      this.drawZigzagBottom();
      this.drawZigzagLeft();

      this._ctx.stroke();
     //  var lengthLine = this._resizeConstraint.side - 8;

     // // верх
     //  var LineFirstX = -this._resizeConstraint.side / 2 + 8;
     //  var LineFirstY = -this._resizeConstraint.side / 2 - this._ctx.lineWidth / 2;
     //  this._ctx.beginPath();
     //  for (var i = LineFirstX; i <= LineFirstX + lengthLine; i += 12 ) {
     //    this._ctx.arc(i, LineFirstY, 3, 0, Math.PI * 2);
     //    this._ctx.fill();
     //  }
     // // право
     //  var LineTwoX = this._resizeConstraint.side / 2 - this._ctx.lineWidth;
     //  var LineTwoY = -this._resizeConstraint.side / 2 + 10;
     //  this._ctx.beginPath();
     //  for (var a = LineTwoY; a <= LineTwoY + lengthLine; a += 12) {
     //    this._ctx.arc(LineTwoX, a, 3, 0, Math.PI * 2);
     //    this._ctx.fill();
     //  }
     // // низ
     //  var LineThreeY = this._resizeConstraint.side / 2 - this._ctx.lineWidth;
     //  var LineThreeX = -this._resizeConstraint.side / 2 - this._ctx.lineWidth / 2;
     //  this._ctx.beginPath();
     //  for (var b = LineThreeX; b <= LineThreeX + lengthLine; b += 12 ) {
     //    this._ctx.arc(b, LineThreeY, 3, 0, Math.PI * 2);
     //    this._ctx.fill();
     //  }
     // // лево
     //  var LineFourX = -this._resizeConstraint.side / 2 - this._ctx.lineWidth / 2;
     //  var LineFourY = -this._resizeConstraint.side / 2 - this._ctx.lineWidth / 2;
     //  this._ctx.beginPath();
     //  for (var c = LineFourY; c <= LineFourY + lengthLine; c += 12 ) {
     //    this._ctx.arc(LineFourX, c, 3, 0, Math.PI * 2);
     //    this._ctx.fill();
     //  }
      // Восстановление состояния канваса, которое было до вызова ctx.save
      // и последующего изменения системы координат. Нужно для того, чтобы
      // следующий кадр рисовался с привычной системой координат, где точка
      // 0 0 находится в левом верхнем углу холста, в противном случае
      // некорректно сработает даже очистка холста или нужно будет использовать
      // сложные рассчеты для координат прямоугольника, который нужно очистить.
      this._ctx.restore();
    },

    /**
     * Включение режима перемещения. Запоминается текущее положение курсора,
     * устанавливается флаг, разрешающий перемещение и добавляются обработчики,
     * позволяющие перерисовывать изображение по мере перетаскивания.
     * @param {number} x
     * @param {number} y
     * @private
     */
    _enterDragMode: function(x, y) {
      this._cursorPosition = new Coordinate(x, y);
      document.body.addEventListener('mousemove', this._onDrag);
      document.body.addEventListener('mouseup', this._onDragEnd);
    },

    /**
     * Выключение режима перемещения.
     * @private
     */
    _exitDragMode: function() {
      this._cursorPosition = null;
      document.body.removeEventListener('mousemove', this._onDrag);
      document.body.removeEventListener('mouseup', this._onDragEnd);
    },

    /**
     * Перемещение изображения относительно кадра.
     * @param {number} x
     * @param {number} y
     * @private
     */
    updatePosition: function(x, y) {
      this.moveConstraint(
          this._cursorPosition.x - x,
          this._cursorPosition.y - y);
      this._cursorPosition = new Coordinate(x, y);
    },

    /**
     * @param {MouseEvent} evt
     * @private
     */
    _onDragStart: function(evt) {
      this._enterDragMode(evt.clientX, evt.clientY);
    },

    /**
     * Обработчик окончания перетаскивания.
     * @private
     */
    _onDragEnd: function() {
      this._exitDragMode();
    },

    /**
     * Обработчик события перетаскивания.
     * @param {MouseEvent} evt
     * @private
     */
    _onDrag: function(evt) {
      this.updatePosition(evt.clientX, evt.clientY);
    },

    /**
     * Добавление элемента в DOM.
     * @param {Element} element
     */
    setElement: function(element) {
      if (this._element === element) {
        return;
      }

      this._element = element;
      this._element.insertBefore(this._container, this._element.firstChild);
      // Обработчики начала и конца перетаскивания.
      this._container.addEventListener('mousedown', this._onDragStart);
    },

    /**
     * Возвращает кадрирование элемента.
     * @return {Square}
     */
    getConstraint: function() {
      return this._resizeConstraint;
    },

    /**
     * Смещает кадрирование на значение указанное в параметрах.
     * @param {number} deltaX
     * @param {number} deltaY
     * @param {number} deltaSide
     */
    moveConstraint: function(deltaX, deltaY, deltaSide) {
      this.setConstraint(
          this._resizeConstraint.x + (deltaX || 0),
          this._resizeConstraint.y + (deltaY || 0),
          this._resizeConstraint.side + (deltaSide || 0));
    },

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} side
     */
    setConstraint: function(x, y, side) {
      if (typeof x !== 'undefined') {
        this._resizeConstraint.x = x;
      }

      if (typeof y !== 'undefined') {
        this._resizeConstraint.y = y;
      }

      if (typeof side !== 'undefined') {
        this._resizeConstraint.side = side;
      }

      requestAnimationFrame(function() {
        this.redraw();
        window.dispatchEvent(new CustomEvent('resizerchange'));
      }.bind(this));
    },

    /**
     * Удаление. Убирает контейнер из родительского элемента, убирает
     * все обработчики событий и убирает ссылки.
     */
    remove: function() {
      this._element.removeChild(this._container);

      this._container.removeEventListener('mousedown', this._onDragStart);
      this._container = null;
    },

    /**
     * Экспорт обрезанного изображения как HTMLImageElement и исходником
     * картинки в src в формате dataURL.
     * @return {Image}
     */
    exportImage: function() {
      // Создаем Image, с размерами, указанными при кадрировании.
      var imageToExport = new Image();

      // Создается новый canvas, по размерам совпадающий с кадрированным
      // изображением, в него добавляется изображение взятое из канваса
      // с измененными координатами и сохраняется в dataURL, с помощью метода
      // toDataURL. Полученный исходный код, записывается в src у ранее
      // созданного изображения.
      var temporaryCanvas = document.createElement('canvas');
      var temporaryCtx = temporaryCanvas.getContext('2d');
      temporaryCanvas.width = this._resizeConstraint.side;
      temporaryCanvas.height = this._resizeConstraint.side;
      temporaryCtx.drawImage(this._image,
          -this._resizeConstraint.x,
          -this._resizeConstraint.y);
      imageToExport.src = temporaryCanvas.toDataURL('image/png');

      return imageToExport;
    }
  };

  /**
   * Вспомогательный тип, описывающий квадрат.
   * @constructor
   * @param {number} x
   * @param {number} y
   * @param {number} side
   * @private
   */
  var Square = function(x, y, side) {
    this.x = x;
    this.y = y;
    this.side = side;
  };

  /**
   * Вспомогательный тип, описывающий координату.
   * @constructor
   * @param {number} x
   * @param {number} y
   * @private
   */
  var Coordinate = function(x, y) {
    this.x = x;
    this.y = y;
  };

  window.Resizer = Resizer;
})();
