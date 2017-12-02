var canvas = document.getElementById('canvas');

var data = {
  image: null,
  score: 0,
  bestScore: 0,
  system: {
    dataRefreshRate: 20, //数据刷新率
    screenRefreshRate: 20, //屏幕刷新率
    start: false,
    fail: false,
    scale: 1,
    top: 0,
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
      animate: false,
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
    obstacle: {
      show: false,
      previousAdopt: 56,
      adopt: 140,
      width: 72,
      transverseSpacing: 225,
      body: [],
      draw: drawObstacle
    },
    title: {
      show: true,
      type: 0, //0 flappyBird, 1 Get Ready, 2 Game Over
      top: 0,
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
      top: 600,
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
  var width = document.documentElement.clientWidth;
  var height = document.documentElement.clientHeight;
  if (height / width > 1.5) {
    data.system.scale = width / 400 - 0.1;
  } else {
    data.system.scale = height / 600 - 0.1;
  }
  data.system.top = (height - 600) / data.system.scale / 2;
  canvas.style.transform = 'scale(' + data.system.scale + ', ' + data.system.scale + ') translateY(' + data.system.top + 'px)';
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
    birdAnimate(true);
    data.element.bird.animate = true;
    data.element.bird.left = 200;
    showElement('title', true);
    showElement('startButton', true);
    controlBottomStripe(true, 2);
    showElement('bottomStripe', true);
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
  data.score = 0;
  data.element.bird.color = parseInt(Math.random() * 1000) % 3;
  data.element.background.type = parseInt(Math.random() * 1000) % 2;
  data.element.bird.top = 315;
  data.element.bird.speedY = 0;
  data.element.bird.left = 120;
  data.element.bird.gravity = 0;
  data.element.obstacle.previousAdopt = 56;
  data.element.obstacle.body = [];
  data.element.rankings.top = 600;
  if (data.system.fail === true) {
    birdAnimate(true);
    controlBottomStripe(true, 2);
  }
  showElement('startButton', false);
  showElement('rankings', false);
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
  if (_getMousePos(e).x > 128 * data.system.scale && _getMousePos(e).x < 272 * data.system.scale
    && _getMousePos(e).y > 400 * data.system.scale&& _getMousePos(e).y < 481 * data.system.scale) {
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

function gamePlayingSpace (e) {
  var e = e || window.e;
  if (e && e.keyCode == 32) {
    gamePlaying();
  }
}

function gamePlaying () {
  if (data.system.start === false) {
    data.element.bird.gravity = 0.4;
    showElement('title', false);
    showElement('tip', false);
    showElement('obstacle', true);
    createObstacle();
  }
  data.system.start  = true;
  data.element.bird.speedY = -7;
}

function birdAnimate (animate) {
  if (animate === true) {
    data.TIME.birdAnimate = setInterval(function () {
      data.element.bird.attitude = (data.element.bird.attitude + 1) % 3;
    }, data.system.dataRefreshRate * 9);
  } else {
    clearInterval(data.TIME.birdAnimate);
  }
}

function getReady () {
  data.element.title.type = 1;
  randomData();
  showMask(false, data.system.screenRefreshRate * 6);
  removeEvent(canvas, 'click', cursorClickEvent);
  addEvent(canvas, 'click', gamePlaying);
  addEvent(document, 'keydown', gamePlayingSpace);
  showElement('score', true);
  showElement('tip', true);
  showElement('startButton', false);
  data.element.bird.left = 120;
  dataUpdata(true);
}

function dataUpdata (update) {
  if (update === true) {
    data.TIME.dataUpdate = setInterval(function () {
      data.element.bird.speedY = data.element.bird.speedY + data.element.bird.gravity;
      data.element.bird.top = data.element.bird.top + data.element.bird.speedY;
    }, data.system.dataRefreshRate);
  } else {
    clearInterval(data.TIME.dataUpdate);
  }  
}

function createObstacle () {
  var scoreFlag = true
  data.TIME.obstacle = setInterval(function () {
    data.element.obstacle.previousAdopt = data.element.obstacle.previousAdopt + 1;
    for (var i = 0, len = data.element.obstacle.body.length; i < len; i++) {
      data.element.obstacle.body[i][0] -= 0.54;
    }
    if (data.element.obstacle.previousAdopt > 448) {
      data.element.obstacle.previousAdopt = 0;
      var obstacleTop = parseInt(Math.random() * 260) + 100,
          obstacleBottom = obstacleTop + data.element.obstacle.adopt;
      data.element.obstacle.body.push([400, obstacleTop, obstacleBottom]);
    }
    for (var i = 0; i < data.element.obstacle.body.length; i++) {
      if (data.element.obstacle.body[0][0] < -72) {
        data.element.obstacle.body.shift();
      }
      if (data.element.obstacle.body[0][0] < 0) {
        scoreFlag = true;
      }
      if (scoreFlag === true && data.element.obstacle.body[i][0] < 84 && data.element.obstacle.body[i][0] > 0) {
        scoreFlag = false;
        data.score++;
      }
    }
    if (!collisionJudge()) {
      gameover();
    }
  }, data.dataRefreshRate);
}

function collisionJudge () {
  var birdWidth = 40, birdHeight = 32;
  if (data.element.bird.top > 554) {
    return false;
  }
  for (var i = 0; i < data.element.obstacle.body.length; i++) {
    if (data.element.obstacle.body[i][0] < 120 + birdWidth / 2 && data.element.obstacle.body[i][0] > 48 - birdWidth / 2) {
      if (data.element.bird.top < data.element.obstacle.body[i][1] + birdHeight / 2 || data.element.bird.top > data.element.obstacle.body[i][1] + 140 - birdHeight / 2) {
        return false;
      }
    }
  }
  return true;
}

function gameover () {
  data.fail = true;
  data.speedY = 0;
  removeEvent(canvas, 'click', gamePlaying);
  removeEvent(document, 'keydown', gamePlayingSpace);
  birdAnimate(false);
  data.element.bird.animate = false;
  clearInterval(data.TIME.obstacle);
  dataUpdata(false);
  controlBottomStripe(false);
  if (data.element.bird.top <= 554) {  
    setTimeout(function () {
      data.TIME.dataUpdate = setInterval(function () {
        data.element.bird.speedY = data.element.bird.speedY + data.element.bird.gravity;
        data.element.bird.top = data.element.bird.top + data.element.bird.speedY;
        if (data.element.bird.top > 554) {
          clearInterval(data.TIME.dataUpdate);
          restart();
        }
      }, data.system.dataRefreshRate);
    }, data.system.dataRefreshRate * 10);
  } else {
    restart();
  } 
}

function restart () {
  var score, bestScore;
  _scoreCheckout();

  setTimeout(function () {
    _createGameover();
  }, data.system.dataRefreshRate * 20);
  setTimeout(function () {
    showElement('rankings', true);
    _createRankings(score, bestScore);
  }, data.system.dataRefreshRate * 40);

  function _scoreCheckout () {
    score = data.score;
    bestScore = getCookie('bestScore');
    if (bestScore <= score) {
      setCookie('bestScore', score, 60 * 24 * 365);
      bestScore = score;
    }
    data.bestScore = bestScore;
  }

  function _createGameover () {
    showElement('score', false);
    data.element.title.type = 2;
    data.element.title.top = 100;
    showElement('title', true);

    _gameover1();

    function _gameover1 () {
      data.element.title.top--;
      setTimeout(function () {
        if (data.element.title.top < 92) {
          _gameover2();
        } else {
          _gameover1();
        }
      }, data.system.dataRefreshRate);
    }

    function _gameover2 () {
      data.element.title.top++;
      setTimeout(function () {
        if (data.element.title.top < 100) {
          _gameover2();
        }
      }, data.system.dataRefreshRate);
    }
  }

  function _createRankings (score, bestScore) {
    data.element.rankings.top -= 20;
    setTimeout(function () {
      if (data.element.rankings.top > 206) {
        _createRankings(score, bestScore);
      } else {
        setTimeout(function () {
          showElement('startButton', true);
          addEvent(canvas, 'mousemove', cursorMoveEvent);
          addEvent(canvas, 'click', cursorClickEvent);
          data.system.start = false;
          data.system.fail = true;
        }, data.system.dataRefreshRate * 10);
      }
    }, data.system.dataRefreshRate);
  }
}

/*
 控制底部滚动条纹
 *
 * @move {Boolean} true进行滚动，false停止滚动
 *
 * @deviation {Number} 每个周期偏移距离，应可以被24除尽
 *
 */
function controlBottomStripe (move, deviation) {
  if (move === true) {
    data.TIME.bottomStripe = setInterval(function () {
      data.element.bottomStripe.deviation = (data.element.bottomStripe.deviation + deviation) % 24;
    }, data.system.dataRefreshRate);
  } else {
    clearInterval(data.TIME.bottomStripe);
  }
}

/*
 显示组件
 *
 * @name {String} 组件名称
 *
 * @show {Boolean} true显示分数，false隐藏分数
 */
function showElement (name, show) {
  data.element[name].show = show ? true : false;
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
  var drawOrder = ['background', 'obstacle', 'bottomStripe', 'title', 'tip', 'startButton', 'score', 'rankings', 'bird', 'mask'];
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

  cxt.save();
  cxt.translate(data.element.bird.left, data.element.bird.top);
  cxt.rotate(Math.atan(data.element.bird.speedY / 10));
  cxt.drawImage(data.image,
    birdPosition[data.element.bird.color][data.element.bird.attitude][0],
    birdPosition[data.element.bird.color][data.element.bird.attitude][1],
    34, 24, -24, -17, 48, 34);
  cxt.restore();
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

function drawObstacle (cxt) {
  var obstacleData = [ //52, 320
    [112, 646],
    [168, 646]
  ];
  for (var i = 0, len = data.element.obstacle.body.length; i < len; i++) {
    cxt.drawImage(data.image, 112, 646, 52, 320, data.element.obstacle.body[i][0], data.element.obstacle.body[i][1] - 445, 72, 445); //上层柱子
    cxt.drawImage(data.image, 168, 646, 52, 320, data.element.obstacle.body[i][0], data.element.obstacle.body[i][2], 72, 445); //下层柱子
  }
}

function drawTitle (cxt) {
  switch (data.element.title.type) {
    case 0: cxt.drawImage(data.image, 702, 182, 178, 48, 76, 118, 247, 67); break;
    case 1: cxt.drawImage(data.image, 590, 118, 184, 50, 75, 190, 256, 69); break;
    case 2: cxt.drawImage(data.image, 790, 118, 192, 42, 67, data.element.title.top, 266, 58); break;
  }
}

function drawTip (cxt) {
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
    ten = parseInt(data.score / 10);
    cxt.drawImage(data.image, scoreData[single][0], scoreData[single][1], 24, 36, 199, 98, 33, 50);
    cxt.drawImage(data.image, scoreData[ten][0], scoreData[ten][1], 24, 36, 165, 98, 33, 50);
  } else {
    single = data.score % 10;
    ten = parseInt((data.score / 10) % 10);
    hundreds = parseInt(data.score / 100);
    cxt.drawImage(data.image, scoreData[single][0], scoreData[single][1], 24, 36, 216, 98, 33, 50);
    cxt.drawImage(data.image, scoreData[ten][0], scoreData[ten][1], 24, 36, 182, 98, 33, 50);
    cxt.drawImage(data.image, scoreData[hundreds][0], scoreData[hundreds][1], 24, 36, 148, 98, 33, 50);
  }
}

function drawRankings (cxt) {
  cxt.drawImage(data.image, 6, 518, 226, 114, 43, data.element.rankings.top, 314, 158);
  _drawScore (data.score, data.element.rankings.top, false);
  _drawScore (data.bestScore, data.element.rankings.top, true);

  function _drawScore (score, scoreboardTop, isBest) {
    var scoreData = [ //14, 20
      [274, 612], //0
      [274, 954], //1
      [274, 978], //2
      [262, 1002], //3
      [1004, 0], //4
      [1004, 24], //5
      [1010, 52], //6
      [1010, 84], //7
      [586, 484], //8
      [622, 412]  //9
    ];

    var single, ten, hundreds, socreTop;

    if (isBest) {
      socreTop = 104 + data.element.rankings.top;
    } else {
      socreTop = 48 + data.element.rankings.top;
    }

    if (score < 10) {
      cxt.drawImage(data.image, scoreData[score][0], scoreData[score][1], 14, 20, 300, socreTop, 20, 28);
    } else if (score < 100) {
      single = score % 10;
      ten = parseInt(score / 10);
      cxt.drawImage(data.image, scoreData[single][0], scoreData[single][1], 14, 20, 300, socreTop, 20, 28);
      cxt.drawImage(data.image, scoreData[ten][0], scoreData[ten][1], 14, 20, 276, socreTop, 20, 28);
    } else {
      single = score % 10;
      ten = parseInt((score / 10) % 10);
      hundreds = parseInt(score / 100);
      cxt.drawImage(data.image, scoreData[single][0], scoreData[single][1], 14, 20, 300, socreTop, 20, 28);
      cxt.drawImage(data.image, scoreData[ten][0], scoreData[ten][1], 14, 20, 276, socreTop, 20, 28);
      cxt.drawImage(data.image, scoreData[hundreds][0], scoreData[hundreds][1], 14, 20, 252, socreTop, 20, 28);
    }
  }
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

function setCookie (name, value, time) {
  var Minutes = time;
  var exp = new Date();
  exp.setTime(exp.getTime() + Minutes * 60 * 1000);
  document.cookie = name + "=" + decodeURI(value) + ";expires=" + exp.toGMTString();
}

function getCookie (name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  arr = document.cookie.match(reg);
  if (arr = document.cookie.match(reg)) {
    return decodeURIComponent(arr[2]);
  } else {
    return null;
  }
}
