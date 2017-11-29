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
    },
    background: {
      show: true,
      type: 0, //0白天，1黑夜
      draw: null
    },
    bottomStripe: {
      show: true,
      move: true,
      deviation: 0,
      draw: null
    },
    title: {
      show: true,
      type: 0, //0 flappyBird, 1 Get Ready, 2 Game Over
      draw: null
    },
    startButton: {
      show: true,
      draw: null
    },
    score: {
      show: false,
      value: 0,
      draw: null
    },
    rankings: {
      show: false,
      draw: null
    },
    mask: {
      show: false,
      alpha: 0,
      draw: null
    }
  },
  TIME: {}
}

window.onload = function () {
  drawDataCorresponding();
  imageLoaded();
}

function drawDataCorresponding () {
  data.element.bird.draw = drawBird;
  data.element.background.draw = drawBackground;
  data.element.bottomStripe.draw = drawBottomStripe;
  data.element.title.draw = drawTitle;
  data.element.startButton.draw = drawStartButton;
  data.element.score.draw = drawScore;
  data.element.rankings.draw = drawRankings;
  data.element.mask.draw = drawMask;
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
    for(var i in data.element){
      if (data.element[i].show === true) {
        data.element[i].draw(context);
      }
    }
  }, data.system.screenRefreshRate);
}

function drawBird (cxt) {
  cxt.drawImage(data.image, 0, 0, 288, 512, 0, -55, 400, 711);
}

function drawBackground (cxt) {
  cxt.drawImage(data.image, 0, 0, 288, 512, 0, -55, 400, 711);
}

function drawBottomStripe (cxt) {
  cxt.drawImage(data.image, 0, 0, 288, 512, 0, -55, 400, 711);
}

function drawTitle (cxt) {
  cxt.drawImage(data.image, 0, 0, 288, 512, 0, -55, 400, 711);
}

function drawStartButton (cxt) {
  cxt.drawImage(data.image, 0, 0, 288, 512, 0, -55, 400, 711);
}

function drawScore  (cxt) {
  cxt.drawImage(data.image, 0, 0, 288, 512, 0, -55, 400, 711);
}

function drawRankings (cxt) {
  cxt.drawImage(data.image, 0, 0, 288, 512, 0, -55, 400, 711);
}

function drawMask (cxt) {
  cxt.drawImage(data.image, 0, 0, 288, 512, 0, -55, 400, 711);
}