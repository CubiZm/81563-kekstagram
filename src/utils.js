'use strict';
define('utils', function() {
  function listenKey(keyCode, callback) {
    return function(evt) {
      if (evt.keyCode === keyCode) {
        callback();
      }
    };
  }
  return {
    listenKey: listenKey
  };
});
