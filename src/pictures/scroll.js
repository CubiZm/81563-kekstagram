'use strict';

define(['./render', '../utils'], function(renderModule, utilsModule) {
  return {
    // Обработчик события scroll у объекта window, который отображает следующую страницу
    // с фотографиями по достижении низа страницы
    setScrollEnabled: function() {
      var pictures;
      var scrollTimeout;
      window.addEventListener('scroll', function() {
        // Оптмимизация скролла
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
          while(utilsModule.isBottomReached() && utilsModule.isNextPageAvailable(pictures, utilsModule.pageNumber, utilsModule.PAGE_SIZE)) {
            renderModule.drawNextPages();
          }
        }, 100);
      });
    }
  };
});
