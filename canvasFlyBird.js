var canvas = document.getElementById('canvas');

var data = {
  image: null,
  score: 0,
  system: {
    dataRefreshRate: 20, //数据刷新率
    screenRefreshRate: 20, //屏幕刷新率
    start: false,
    fail: false,
    width: 400,
    height: 600
  },
  element: {
    bird: {
      show: true,
      color: 0, //0黄色，1蓝色，2红色
      attitude: 0, //姿态，0～2
      velocityY: 0,
      speedY: 0,
      left: 120,
      top: 315,
      gravity: 0,
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
    tip: {
      show: false,
      draw: drawTip
    },
    startButton: {
      show: false,
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
  randomData();
  imageLoaded();
}

function imageLoaded () {
  var image = new Image();
  image.src = 'flappyBird.png';
  image.onload = function () {
    _setCanvasProperty();
    var cxt = canvas.getContext('2d');
    data.image = image;
    birdAnimate();
    showWelcomeInterface();
    showTitle(true);
    showStartButton(true);
    showBottomStripe(true, true, 1.5);
    showMask(false, 600);
    drawImage(cxt);
    addEvent(canvas, 'mousemove', cursorMoveEvent);
    addEvent(canvas, 'click', cursorClickEvent);
  }

  function _setCanvasProperty () {
    canvas.width = 400;
    canvas.height = 600;
  }
}

function randomData () {
  data.element.bird.color = parseInt(Math.random() * 1000) % 3;
  data.element.background.type = parseInt(Math.random() * 1000) % 2;
}

function cursorClickEvent (e) {
  var e = e || window.e;
  if (data.system.start === false) {
    if (cursorInStart(e)) {
      removeEvent(canvas, 'mousemove', cursorMoveEvent);
      this.style.cursor = 'default';
      showMask(true, data.system.dataRefreshRate * 10);
      setTimeout(function () {
        getReady();
      }, data.system.dataRefreshRate * 10);
    }
  } else {
    
    data.element.bird.speedY = -8;
  }
}

function cursorMoveEvent (e) {
  var e = e || window.e;
  if (cursorInStart(e)) {
    this.style.cursor = 'pointer';
  } else {
    this.style.cursor = 'default';
  }
}

function cursorInStart (e) {
  if (_getMousePos(e).x > 128 && _getMousePos(e).x < 272
    && _getMousePos(e).y > 400 && _getMousePos(e).y < 481) {
    return true;
  } else {
    return false;
  }

  function _getMousePos (e) {
    var x = e.clientX - e.target.getBoundingClientRect().left;
    var y = e.clientY - e.target.getBoundingClientRect().top;
    return {'x': x, 'y': y};
  }
}

function gamePlaying () {
  if (data.system.start === false) {
    showTip(false);
    data.element.bird.gravity = 0.4;
    //createObstacle();
  }
  data.system.start  = true;
  data.element.bird.speedY = -8;
  //createScore(data.score);
}

function birdAnimate () {
  data.TIME.birdAnimate = setInterval(function () {
    data.element.bird.attitude = (data.element.bird.attitude + 1) % 3;
  }, data.system.dataRefreshRate * 9);
}

function getReady () {
  randomData();
  showMask(false, data.system.dataRefreshRate * 4);
  removeEvent(canvas, 'click', cursorClickEvent);
  addEvent(canvas, 'click', gamePlaying);
  showScore(true);
  showTitle(false);
  showTip(true);
  showStartButton(false);
  data.element.bird.left = 120;
  data.TIME.dataUpdate = setInterval(function () {
    data.element.bird.speedY = data.element.bird.speedY + data.element.bird.gravity;
    data.element.bird.top = data.element.bird.top + data.element.bird.speedY;
  }, data.system.dataRefreshRate);
}

function showWelcomeInterface () {
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
 显示操作提示
 *
 * @show {Boolean} true显示操作提示，false隐藏操作提示
 *
 */
function showTip (show) {
  data.element.tip.show = show ? true : false;
}

/*
 显示开始按钮标题
 *
 * @show {Boolean} true显示开始按钮，false隐藏开始按钮
 *
 */
function showStartButton (show) {
  data.element.startButton.show = show ? true : false;
}

/*
 显示分数
 *
 * @show {Boolean} true显示分数，false隐藏分数
 *
 */
function showScore (show) {
  data.element.score.show = show ? true : false;
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
      data.element.mask.alpha = data.element.mask.alpha + 1 / frequency;
      if (data.element.mask.alpha < 1) {
        _addMask();
      } else {
        data.element.mask.alpha = 1
      }
    }, data.system.dataRefreshRate);
  }

  function _reduceMask () {
    data.element.mask.alpha = data.element.mask.alpha - 1 / frequency;
    setTimeout(function () {
      if (data.element.mask.alpha > 0) {
        _reduceMask();
      } else {
        data.element.mask.alpha = 0;
        data.element.mask.show = false;
      }
    }, data.system.dataRefreshRate);
  }
}

function drawImage (cxt) {
  var drawOrder = ['background', 'bottomStripe', 'title', 'tip', 'startButton', 'score', 'rankings', 'bird', 'mask'];
  data.TIME.drawImage = setInterval(function () {
    for(var i = 0, len = drawOrder.length; i < len; i++){
      if (data.element[drawOrder[i]].show === true) {
        data.element[drawOrder[i]].draw(cxt);
      }
    }
  }, data.system.screenRefreshRate);
}

function drawBird (cxt) {
  var birdPosition = [ //34, 24
    [
      [6, 982],
      [62, 982],
      [118, 982]
    ],
    [
      [174, 982],
      [230, 658],
      [230, 710]
    ],
    [
      [230, 762],
      [230, 814],
      [230, 866]
    ]
  ];
  cxt.drawImage(data.image,
    birdPosition[data.element.bird.color][data.element.bird.attitude][0],
    birdPosition[data.element.bird.color][data.element.bird.attitude][1],
    34, 24, data.element.bird.left - 24, data.element.bird.top - 17, 48, 34);
}

function drawBackground (cxt) {
  if (data.element.background.type === 0) {
    cxt.drawImage(data.image, 0, 0, 288, 512, 0, -55, 400, 711);
  } else {
    cxt.drawImage(data.image, 292, 0, 288, 512, 0, -55, 400, 711);
  }
}

function drawBottomStripe (cxt) {
  cxt.drawImage(data.image, 584 + data.element.bottomStripe.deviation, 0, 336, 22, 0, 569, 465, 31);
}

function drawTitle (cxt) {
  cxt.drawImage(data.image, 702, 182, 178, 48, 76, 118, 247, 67);
}

function drawTip (cxt) {
  cxt.drawImage(data.image, 590, 118, 184, 50, 75, 190, 256, 69);
  cxt.drawImage(data.image, 584, 182, 114, 98, 120, 295, 158, 136);
}

function drawStartButton (cxt) {
  cxt.drawImage(data.image, 708, 236, 104, 58, 128, 400, 144, 81);
}

function drawScore  (cxt) {
  var scoreData = [
    [992, 120], //0
    [268, 910], //1
    [584, 320], //2
    [612, 320], //3
    [640, 320], //4
    [668, 320], //5
    [584, 368], //6
    [612, 368], //7
    [640, 368], //8
    [668, 368]  //9
  ];
  var single, ten, hundreds;
  if (data.score < 10) {
    cxt.drawImage(data.image, scoreData[data.score][0], scoreData[data.score][1], 24, 36, 182, 98, 33, 50);
  } else if (data.score < 100) {
    single = data.score % 10;
    ten = parseInt(score / 10);
    cxt.drawImage(data.image, scoreData[single][0], scoreData[single][1], 24, 36, 199, 98, 33, 50);
    cxt.drawImage(data.image, scoreData[ten][0], scoreData[ten][1], 24, 36, 165, 98, 33, 50);
  } else {
    single = score % 10;
    ten = parseInt((data.score / 10) % 10);
    hundreds = parseInt(data.score / 100);
    cxt.drawImage(data.image, scoreData[single][0], scoreData[single][1], 24, 36, 216, 98, 33, 50);
    cxt.drawImage(data.image, scoreData[ten][0], scoreData[ten][1], 24, 36, 182, 98, 33, 50);
    cxt.drawImage(data.image, scoreData[hundreds][0], scoreData[hundreds][1], 24, 36, 148, 98, 33, 50);
  }
}

function drawRankings (cxt) {
  //cxt.drawImage(data.image, 0, 0, 288, 512, 0, -55, 400, 711);
}

function drawMask (cxt) {
  cxt.beginPath();
  cxt.fillStyle = 'rgba(0, 0, 0, ' + data.element.mask.alpha + ')';
  cxt.fillRect(0, 0, data.system.width, data.system.height);
}

function addEvent (element, type, handler) {
  if (element.addEventListener) {
    element.addEventListener(type, handler, false);
  } else if (element.attachEvent) {  
    element.attachEvent('on' + type, handler);
  } else {  
    element['on' + type] = handler;
  }  
}

function removeEvent (element, type, handler) {
  if (element.removeEventListener) {
    element.removeEventListener(type, handler, false);
  } else if (element.detachEvent) {
    element.detachEvent('on' + type, handler); 
  } else {
    element['on' + type] = null;
  }
}
