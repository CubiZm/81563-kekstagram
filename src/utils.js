'use strict';
define('utils', function() {
  function listenKey(keyCode, callback) {
    return function(evt) {
      if (evt.keyCode === keyCode) {
        callback();
      }
    };
  }

  function setBlockHidden(blockToToggle, whenToToggle) {
    blockToToggle.classList.toggle('invisible', whenToToggle);
  }

  return {
    setBlockHidden: setBlockHidden,
    listenKey: listenKey
  };
});
