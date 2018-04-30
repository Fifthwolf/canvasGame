window.onload = function() {
  suitScreen();
  imageLoaded();
}

function imageLoaded() {
  var image = new Image();
  image.src = 'arkanoid.png';
  image.onload = function() {
    loading.style.display = 'none';
    _setCanvasProperty();
    /*
    data.system.cxt = canvas.getContext('2d');
    data.image = image;
    data.system.time.previous = Date.now();*/
  }

  function _setCanvasProperty() {
    /*
    canvas.width = 640;
    canvas.height = 480;*/
  }
}