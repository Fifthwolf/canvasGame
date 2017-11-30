var canvas = document.getElementById('canvas');

var data = {
  image: null,
  score: 0,
  system: {
    dataScreenRefreshRate: 20, //数据刷新率
    screenRefreshRate: 50, //屏幕刷新率
    start: false,
    fail: false,
  },
  element: {
    bird: {
      show: true,
      color: 0, //0黄色，1蓝色，2红色
      velocityY: 0,
      left: 120,
      top: 315,
      draw: drawBird
    },
    background: {
      show: true,
      type: 0, //0白天，1黑夜
      draw: drawBackground
    },
    bottomStripe: {
      show: true,
      move: true,
      deviation: 0,
      draw: drawBottomStripe
    },
    title: {
      show: true,
      type: 0, //0 flappyBird, 1 Get Ready, 2 Game Over
      draw: drawTitle
    },
    startButton: {
      show: true,
      draw: drawStartButton
    },
    score: {
      show: false,
      value: 0,
      draw: drawScore
    },
    rankings: {
      show: false,
      draw: drawRankings
    },
    mask: {
      show: false,
      alpha: 0,
      draw: drawMask
    }
  },
  TIME: {}
}

window.onload = function () {
  imageLoaded();
}

function imageLoaded () {
  var image = new Image();
  image.src = 'flappyBird.png';
  image.onload = function () {
    data.image = image;
    drawImage();
  }
}

function drawImage () {
  data.TIME.drawImage = setInterval(function () {
    for(var i in data.element){
      if (data.element[i].show === true) {
        data.element[i].draw(canvas);
      }
    }
  }, data.system.screenRefreshRate);
}

function drawBird (cxt) {
  var cxt = canvas.getContext('2d');
  cxt.drawImage(data.image, 0, 0, 288, 512, 0, -55, 400, 711);
}

function drawBackground (cxt) {
  var cxt = canvas.getContext('2d');
  cxt.drawImage(data.image, 0, 0, 288, 512, 0, -55, 400, 711);
}

function drawBottomStripe (cxt) {
  var cxt = canvas.getContext('2d');
  cxt.drawImage(data.image, 0, 0, 288, 512, 0, -55, 400, 711);
}

function drawTitle (cxt) {
  var cxt = canvas.getContext('2d');
  cxt.drawImage(data.image, 0, 0, 288, 512, 0, -55, 400, 711);
}

function drawStartButton (cxt) {
  var cxt = canvas.getContext('2d');
  cxt.drawImage(data.image, 0, 0, 288, 512, 0, -55, 400, 711);
}

function drawScore  (cxt) {
  var cxt = canvas.getContext('2d');
  cxt.drawImage(data.image, 0, 0, 288, 512, 0, -55, 400, 711);
}

function drawRankings (cxt) {
  var cxt = canvas.getContext('2d');
  cxt.drawImage(data.image, 0, 0, 288, 512, 0, -55, 400, 711);
}

function drawMask (cxt) {
  var cxt = canvas.getContext('2d');
  cxt.drawImage(data.image, 0, 0, canvas.width, canvas.height, 0, -55, 400, 711);
}