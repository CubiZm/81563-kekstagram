 'use strict';

 (function() {
   /** @constant {number} */
   var PAGE_SIZE = 12;

 /** @type {Array.<Object>} */
   var filteredPictures = [];
 /** @type {number} */
   var pageNumber = 0;

   var GAP = 100;

   var blockFilters = document.querySelector('.filters');
   blockFilters.classList.add('hidden');

   var picturesContainer = document.querySelector('.pictures');
   var templateElement = document.getElementById('picture-template');
   var elementToClone;

   if('content' in templateElement) {
     elementToClone = templateElement.content.querySelector('.picture');
   } else {
     elementToClone = templateElement.querySelector('.pictures');
   }


   var getPictureElement = function(data, container) {

     var element = elementToClone.cloneNode(true);
     var backgroundImage = element.querySelector('img');

     element.querySelector('.picture-comments').textContent = data.comments;
     element.querySelector('.picture-likes').textContent = data.likes;
     container.appendChild(element);

     var loadImage = new Image();
     var backgroundLoadTimeout;

     backgroundImage.src = data.preview;

     loadImage.onload = function(evt) {
       clearTimeout(backgroundLoadTimeout);
       backgroundImage.src = evt.target.src;
       backgroundImage.width = 182;
       backgroundImage.height = 182;
     };

     loadImage.onerror = function() {
       element.classList.add('picture-load-failure');
     };

     loadImage.src = data.url;
     return element;
   };

   // pictures.forEach(function(pictures) {
   //   getPictureElement(pictures, picturesContainer);
   // });
   blockFilters.classList.remove('hidden');

   var pictures = [];
   // получим фоточки
   var getPictures = function(callback) {
     var picturesCont = document.querySelector('.pictures');
     var xhr = new XMLHttpRequest();
     xhr.open('GET', '//o0.github.io/assets/json/pictures.json');
     xhr.send();

     xhr.onreadystatechange = function() {
       if (xhr.readyState !== 4) {
         picturesCont.classList.remove('pictures-loading');
       }
       return;
     };
     picturesCont.classList.add('pictures-loading');

     xhr.onload = function(evt) {
       var requestPhoto = evt.target;
       var response = requestPhoto.response;
       response = JSON.parse(response);
       callback(response);
     };

     xhr.onerror = function() {
       picturesCont.classList.add('pictures-failure');
     };
   };
   // отдадим фоточки
   function renderPictures(picturesToRender, page, replace) {
     if (replace) {
       picturesContainer.innerHTML = '';
     }
     var fromTo = page * PAGE_SIZE;
     var to = fromTo + PAGE_SIZE;
     picturesToRender.slice(fromTo, to).forEach(function(picture) {
       getPictureElement(picture, picturesContainer, pageNumber);
     });
   }
   // получим фоточки...
   getPictures(function(loadedPictures) {
     pictures = loadedPictures;
     renderPictures(pictures);
   });

   // отфильтруем фоточки

   function setActiveFilter(id) {
     var activeFilter = 'filter-item';
     activeFilter = id;

     filteredPictures = pictures.slice(0);
     pageNumber = 0;
     renderPictures(filteredPictures, pageNumber, true);
     if (activeFilter === id) {
       return;
     }



     switch (id) {
       case 'filter-new':
         filteredPictures.sort(function(a, b) {
           if (a.date < b.date) {
             return 1;
           }
           if (a.date > b.date) {
             return -1;
           }
           return 0;
         });
         filteredPictures = filteredPictures.sort(function(a, b) {
           var dateA = new Date(a.date);
           var dateB = new Date(b.date);
           var callbackTwoWeek = dateB.getTime() - dateA.getTime();
           return callbackTwoWeek;
         });
         break;
       case 'filter-discussed':
         filteredPictures = filteredPictures.sort(function(a, b) {
           return b.comments - a.comments;
         });
         break;
     }

     renderPictures(filteredPictures, pageNumber);
   }

   var isNextPageAvailable = function(picture, page, pageSize) {
     return page < Math.floor(pictures.length / pageSize);
   };

  /** @return {boolean} */
   var isBottomReached = function() {
     var footerElement = picturesContainer;
     var footerPosition = footerElement.getBoundingClientRect();
     return footerPosition.top - window.innerHeight - GAP <= 0;
   };

   var setScrollEnabled = function() {
    window.addEventListener('scroll', function() {
      var scrollTimeout;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function() {
        if (isBottomReached() && isNextPageAvailable(pictures, pageNumber, PAGE_SIZE)) {
          pageNumber++;
          renderPictures(filteredPictures, pageNumber);
        }
      }, GAP);
    });
  };

   // var setFiltration = function(filtration) {
   //   var filtrationPictures = getFiltrationPictures(pictures, filtration);
   //   renderPictures(filtrationPictures);
   // };

   // getPictures(function(loadedPictures) {
   //   pictures = loadedPictures;
   //   renderPictures(pictures);
   // });

   // начала делать выборку по фильтру
   var filters = document.querySelectorAll('.filters-radio');
   for (var i = 0; i < filters.length; i++) {
     filters[i].onclick = function(evt) {
       var clickedElementID = evt.target.id;
       setActiveFilter(clickedElementID);
     };
   }

   getPictures();
   setScrollEnabled();
 })();

