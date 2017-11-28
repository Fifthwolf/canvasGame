var canvas = document.getElementById('canvas');

var data = {
  image: null
}

window.onload = function () {
  imageLoaded();
  //canvas.width = 400;
  //canvas.height = 600;
}

function imageLoaded () {
  var image = new Image();
  image.src = 'flyBird.png';
  image.onload = function () {
    data.image = image;
  }
}