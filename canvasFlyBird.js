var canvas = document.getElementById('canvas');

var data = {
  image: null,
  score: 0,
  system: {
    dataRefreshRate: 20, //数据刷新率
    screenRefreshRate: 40, //屏幕刷新率
    start: false,
    fail: false,
    width: 400,
    height: 600
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
    _setCanvasProperty();
    var cxt = canvas.getContext('2d');
    data.image = image;
    showWelcomeInterface();
    showTitle(true);
    showBottomStripe(true, true, 1.5);
    showMask(false, 600);
    drawImage(cxt);
  }

  function _setCanvasProperty () {
    canvas.width = 400;
    canvas.height = 600;
  }
}

function showWelcomeInterface () {
  data.element.background.type = 0;
  data.element.bird.left = 200;
}

/*
 显示标题
 *
 * @show {Boolean} true显示标题，false隐藏标题
 *
 */
function showTitle (show) {
  data.element.title.show = show ? true : false;
}

/*
 显示底部滚动条纹
 *
 * @show {Boolean} true显示标题，false隐藏标题
 *
 * @move {Boolean} true进行滚动，false停止滚动
 *
 * @deviation {Number} 每个周期偏移距离，应可以被24除尽
 *
 */
function showBottomStripe (show, move, deviation) {
  data.element.bottomStripe.show = show ? true : false;
  data.TIME.bottomStripe = setInterval(function () {
    data.element.bottomStripe.deviation = (data.element.bottomStripe.deviation + deviation) % 24;
  }, data.system.dataRefreshRate);
}

/*
 显示黑幕
 *
 * @show {Boolean} true生成黑色蒙版，false黑色蒙版再消失
 *
 * @time {Number} 蒙版持续时间，单位ms
 *
 */
function showMask (show, time) {
  var frequency = time / data.system.dataRefreshRate;
  data.element.mask.show = true;
  if (show === true) {
    data.element.mask.alpha = 0;
    _addMask();
  } else {
    data.element.mask.alpha = 1;
    _reduceMask();
  }

  function _addMask () {
    setTimeout(function () {
      data.element.mask.alpha = Math.min(1, data.element.mask.alpha + 1 / frequency);
      if (data.element.mask.alpha < 1) {
        _addMask();
      }
    }, data.system.dataRefreshRate);
  }

  function _reduceMask () {
    data.element.mask.alpha = Math.max(0, data.element.mask.alpha - 1 / frequency);
    setTimeout(function () {
      if (data.element.mask.alpha > 0) {
        _reduceMask();
      } else {
        data.element.mask.show = false;
      }
    }, data.system.dataRefreshRate);
  }
}

function drawImage (cxt) {
  var drawOrder = ['background', 'bottomStripe', 'title', 'startButton', 'score', 'rankings', 'bird', 'mask'];
  data.TIME.drawImage = setInterval(function () {
    for(var i = 0, len = drawOrder.length; i < len; i++){
      if (data.element[drawOrder[i]].show === true) {
        data.element[drawOrder[i]].draw(cxt);
      }
    }
  }, data.system.screenRefreshRate);
}

function drawBird (cxt) {
  //cxt.drawImage(data.image, 0, 0, 288, 512, 0, 0, 400, 600);
}

function drawBackground (cxt) {
  cxt.drawImage(data.image, 0, 0, 288, 512, 0, -55, 400, 711);
}

function drawBottomStripe (cxt) {
  cxt.drawImage(data.image, 584 + data.element.bottomStripe.deviation, 0, 336, 22, 0, 569, 465, 31);
}

function drawTitle (cxt) {
  cxt.drawImage(data.image, 702, 182, 178, 48, 76, 118, 247, 67);
}

function drawStartButton (cxt) {
  cxt.drawImage(data.image, 708, 236, 104, 58, 128, 400, 144, 81);
}

function drawScore  (cxt) {
  //cxt.drawImage(data.image, 0, 0, 288, 512, 0, -55, 400, 711);
}

function drawRankings (cxt) {
  //cxt.drawImage(data.image, 0, 0, 288, 512, 0, -55, 400, 711);
}

function drawMask (cxt) {
  cxt.beginPath();
  cxt.fillStyle = 'rgba(0, 0, 0, ' + data.element.mask.alpha + ')';
  cxt.fillRect(0, 0, data.system.width, data.system.height);
}