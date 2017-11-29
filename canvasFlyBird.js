var canvas = document.getElementById('canvas');

var data = {
  image: null,
  score: 0,
  bird: {
    color: 0, //0黄色，1蓝色，2红色
    velocityY: 0,
    left: 120,
    top: 315,
  },
  system: {
    refreshRate: 20, //刷新频率
    start: false,
    fail: false,
  },
  background: {

  },
  TIME: {}
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
    drawImage();
  }
}

function drawImage () {
  var context = canvas.getContext('2d');
  data.TIME.drawImage = setInterval(function () {
    drawBackground(context);
  }, data.system.refreshRate);
}

function drawBackground (cxt) {
  cxt.drawImage(data.image, 0, 0, 288, 512, 0, -55, 400, 711);
}