var data = {
  image: null,
  system: {
    time: {
      previous: 0,
      delta: 0
    },
    mobile: null,
    cxt: null,
    start: false,
    fail: false,
    scale: 1,
    top: 0,
    width: 640,
    height: 480
  },
  click: {
    down: 0,
    up: 0,
  },
  element: {
    start: null,
    monkey: null,
    roof: null,
    sun: null,
    cloud1: null,
    cloud2: null,
    groove: null,
    over: null,
    information: null
  },
}

window.onload = function() {
  if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    data.system.mobile = true;
  } else {
    data.system.mobile = false;
  }
  suitScreen();
  imageLoaded();
}

function imageLoaded() {
  var image = new Image();
  image.src = 'monkeyJump.png';
  image.onload = function() {
    loading.style.display = 'none';
    _setCanvasProperty();
    data.system.cxt = canvas.getContext('2d');
    data.image = image;
    data.system.time.previous = Date.now();
    game();
    gameloop();
  }

  function _setCanvasProperty() {
    canvas.width = 640;
    canvas.height = 480;
  }
}

function game() {
  data.element.start = new StartText();
  if (data.system.mobile) {
    canvas.addEventListener('touchend', init, false);
  } else {
    canvas.addEventListener('click', init, false);
  }
}

function init() {
  data.system.start = true;
  canvas.removeEventListener('click', init);
  canvas.removeEventListener('touchend', init);
  var ele = data.element;
  ele.information = new Information();
  ele.information.init();
  ele.monkey = new Monkey();
  ele.monkey.init();
  ele.groove = new PowerGroove();
  ele.roof = new Roof();
  ele.roof.init();
  ele.sun = new Sun();
  ele.cloud1 = new Cloud(760, 0, 360, 100, 200, 98, 0.75);
  ele.cloud2 = new Cloud(760, 110, 500, 150, 160, 110, 0.75);
  ele.over = null;
  data.system.fail = false;
}

function gameloop() {
  var time = data.system.time;
  requestAnimationFrame(gameloop);
  var now = Date.now();
  time.delta = now - time.previous;
  time.previous = now;
  if (time.delta > 30) {
    time.delta = 30;
  }
  drawImage();
}

function drawImage() {
  var cxt = data.system.cxt,
    ele = data.element;
  drawBackground(cxt);
  if (data.system.start) {
    ele.monkey.draw(cxt);
    ele.groove.draw(cxt);
    ele.roof.draw(cxt);
    ele.sun.draw(cxt);
    ele.information.draw(cxt);
    ele.cloud1.draw(cxt);
    ele.cloud2.draw(cxt);
  } else {
    ele.start.draw(cxt);
  }
  if (data.system.fail) {
    ele.over.draw(cxt);
  }
}

function drawBackground(cxt) {
  cxt.drawImage(data.image, 0, 0, 640, 480, 0, 0, 640, 480);
}

function StartText() {
  this.x = 320;
  this.y = 240;
  this.textAlpha = 1;
  this.picState = 1; //0下降，1上升
  this.textState = 0; //0减弱，1增强
  this.position = [420, 490];

  this.textAlphaChange = function() {
    if (this.textState) {
      this.textAlpha += data.system.time.delta * 0.005;
      if (this.textAlpha > 1) {
        this.textState = 0;
      }
    } else {
      this.textAlpha -= data.system.time.delta * 0.001;
      if (this.textAlpha < 0) {
        this.textState = 1;
      }
    }
  }
  this.startPicFloat = function() {
    if (this.picState) {
      this.y += data.system.time.delta * 0.02;
      if (this.y > 260) {
        this.picState = 0;
      }
    } else {
      this.y -= data.system.time.delta * 0.02;
      if (this.y < 220) {
        this.picState = 1;
      }
    }
  }
  this.draw = function(cxt) {
    this.textAlphaChange();
    this.startPicFloat();
    cxt.save();
    cxt.translate(this.x, this.y);
    cxt.drawImage(data.image, this.position[0], this.position[1], 500, 377, -250, -189, 500, 377);
    cxt.restore();

    cxt.save();
    cxt.beginPath();
    cxt.font = "20px Microsoft YaHei";
    cxt.textAlign = "left";
    cxt.fillStyle = 'rgba(255, 255, 255,' + this.textAlpha + ')';
    cxt.shadowColor = '#000';
    cxt.shadowOffsetX = 1;
    cxt.shadowOffsetY = 1;
    cxt.shadowBlur = 1;
    cxt.fillText("点击以开始游戏", 50, 350);
    cxt.restore();
  }
}

function Monkey() {
  this.x;
  this.y;
  this.vx;
  this.vy;
  this.gravity = 1;
  this.state;
  this.judge = false;
  this.position = [
    [660, 0],
    [660, 120]
  ];

  this.init = function() {
    this.x = 150;
    this.y = 430;
    this.state = 0;
  }
  this.jumpStart = function(initial) {
    canvas.removeEventListener('mousedown', onMouseDown);
    canvas.removeEventListener('touchstart', onMouseDown);
    canvas.removeEventListener('mouseup', onMouseUp);
    canvas.removeEventListener('touchend', onMouseUp);
    initial = Math.min(initial, 16);
    this.vy = -initial;
    this.vx = initial;
    this.state = 1;
    this.judge = false;
  }
  this.jump = function() {
    this.x += this.vx * data.system.time.delta / 20;
    this.y = this.y + this.vy * data.system.time.delta / 20;
    this.vy = this.vy + this.gravity;
    if (!this.judge && this.y > 430) {
      landing();
      this.judge = true;
    }
  }
  this.jumpWin = function(next) {
    this.state = 0;
    this.y = 430;

    if (next) {
      data.element.information.scoreAdd();
      allReturn();
    } else {
      if (data.system.mobile) {
        canvas.addEventListener('touchstart', onMouseDown, false);
      } else {
        canvas.addEventListener('mousedown', onMouseDown, false);
      }
    }
  };
  this.jumpFail = function() {
    data.element.over = new Over();
    setTimeout(function() {
      data.element.over.init();
    }, 400);
  }

  this.draw = function(cxt) {
    if (this.state == 1) {
      this.jump();
    }
    cxt.save();
    cxt.translate(this.x, this.y); //坐标原点位于猴子正中下方
    cxt.drawImage(data.image, this.position[this.state][0], this.position[this.state][1], 100, 100, -50, -97, 100, 100);
    cxt.restore();
  }
}

function Roof() {
  this.example = [];
  this.position = [
    [660, 350],
    [660, 415],
    [800, 245],
    [10, 590],
    [10, 660]
  ]

  this.init = function() {
    this.example.push({
      width: 160,
      center: 150,
      height: 50,
      type: Math.floor(Math.random() * 100) % 5
    });
    this.create();
  }
  this.create = function() {
    var widthBase, width, center, type;
    widthBase = Math.max(160 - data.element.information.score * 4, 30);
    width = widthBase + Math.floor(Math.random() * widthBase / 2);
    center = 500 - widthBase / 2 + Math.floor(Math.random() * widthBase / 2);
    type = Math.floor(Math.random() * 100) % 5;
    this.example.push({
      width: width,
      center: center,
      height: 0,
      type: type
    });
    this.example[this.example.length - 2].center = 150;
    this.up(this.example[this.example.length - 1]);
    this.clear();
    if (data.system.mobile) {
      canvas.addEventListener('touchstart', onMouseDown, false);
    } else {
      canvas.addEventListener('mousedown', onMouseDown, false);
    }
  }
  this.up = function(example) {
    requestAnimationFrame(_up);

    function _up() {
      example.height += data.system.time.delta / 4;
      if (example.height < 50) {
        requestAnimationFrame(_up);
      } else {
        example.height = 50;
      }
    }
  }
  this.clear = function() {
    if (this.example.length > 2) {
      this.example = this.example.slice(1);
    }
  }

  this.draw = function(cxt) {
    cxt.save();
    for (var i = 0, len = this.example.length; i < len; i++) {
      var example = this.example[i];
      position = this.position[example.type];
      cxt.beginPath();
      cxt.fillStyle = '#00f';
      cxt.drawImage(data.image, position[0], position[1], 200, 50,
        example.center - example.width / 2, 480 - example.height, example.width, 50);
      cxt.fill();
    }
    cxt.restore();
  }
}

function Sun() {
  this.x = 100;
  this.y = 80;
  this.rotate = 0;

  this.draw = function(cxt) {
    this.rotate = (this.rotate - data.system.time.delta / 20) % 360;
    cxt.save();
    cxt.translate(this.x, this.y); //坐标原点位于猴子正中下方
    cxt.rotate(this.rotate * Math.PI / 180);
    cxt.drawImage(data.image, 660, 240, 100, 100, -50, -50, 100, 100);
    cxt.restore();
  }
}

function Cloud(x, y, drawX, drawY, width, height, scale) {
  this.x = x;
  this.y = y;
  this.drawX = drawX;
  this.drawY = drawY;
  this.width = width;
  this.height = height;
  this.scale = scale;
  this.swayX = 0;
  this.swayState = parseInt(Math.random() * 100) % 2; //0向左，1向右

  this.sway = function() {
    var limit = this.width / 5;
    if (this.swayState) {
      this.swayX += data.system.time.delta / 20;
      if (this.swayX > limit) {
        this.swayState = 0;
      }
    } else {
      this.swayX -= data.system.time.delta / 20;
      if (this.swayX < -limit) {
        this.swayState = 1;
      }
    }
  }
  this.draw = function(cxt) {
    this.sway();
    cxt.save();
    cxt.translate(this.drawX + this.swayX, this.drawY); //坐标原点位于猴子正中下方
    cxt.scale(this.scale, this.scale);
    cxt.drawImage(data.image, this.x, this.y, this.width, this.height, -this.width / 2, -this.height / 2, this.width, this.height);
    cxt.restore();
  }
}

function PowerGroove() {
  this.value = 0;
  this.max = 100;
  this.state = 0; //0静止，1增加，2减少

  this.add = function() {
    this.state = 1;
  }
  this.reduce = function() {
    this.state = 2;

  }
  this.stop = function() {
    this.state = 0;
  }
  this.change = function() {
    if (this.state == 1) {
      this.value += 3 * data.system.time.delta / 20;
      if (this.value > this.max) {
        this.stop();
        this.value = this.max;
      }
    }
    if (this.state == 2) {
      this.value -= 15 * data.system.time.delta / 20;
      if (this.value < 0) {
        this.stop();
        this.value = 0;
      }
    }
  }
  this.draw = function(cxt) {
    this.change();
    cxt.save();
    cxt.beginPath();
    cxt.font = "20px Verdana";
    cxt.textAlign = "right";
    cxt.fillStyle = '#f00';
    cxt.fillText("POW", 490, 37);
    cxt.rect(500, 20, this.value, 20);
    cxt.fill();
    cxt.beginPath();
    cxt.strokeStyle = '#000';
    cxt.rect(500, 20, 100, 20);
    cxt.stroke();
    cxt.restore();
  }
}

function Over() {
  this.x = 0;
  this.y = 490;
  this.width = 400;
  this.height = 73;
  this.scale = 0;

  this.init = function() {
    data.system.fail = true;
    this.scale = 0;
  }
  this.addScale = function() {
    var nextScale = this.scale + data.system.time.delta * 0.002;
    if (nextScale < 1) {
      this.scale = nextScale;
    } else {
      this.scale = 1;
      if (data.system.mobile) {
        canvas.addEventListener('touchend', init, false);
      } else {
        canvas.addEventListener('click', init, false);
      }
    }
  }
  this.draw = function(cxt) {
    if (this.scale < 1) {
      this.addScale();
    }
    cxt.save();
    cxt.translate(data.system.width / 2, data.system.height / 2);
    cxt.scale(this.scale, this.scale);
    cxt.drawImage(data.image, this.x, this.y, this.width, this.height, -this.width / 2, -this.height / 2, this.width, this.height);
    cxt.restore();
  }
}

function Information() {
  this.score;

  this.init = function() {
    this.score = 0;
  }
  this.scoreAdd = function() {
    this.score++;
  }
  this.draw = function(cxt) {
    cxt.save();
    cxt.fillStyle = '#fff';
    cxt.font = '20px Microsoft YaHei';
    cxt.textAlign = 'center';
    cxt.fillText('SCORE: ' + this.score, 320, 38);
    cxt.restore();
  }
}

function landing() {
  var ele = data.element,
    example = ele.roof.example;
  var correct = 10;
  var monkeyX = ele.monkey.x;
  for (var i = 0, len = example.length; i < len; i++) {
    var exampleCenter = example[i].center,
      exampleWidth = example[i].width;
    if (monkeyX > exampleCenter - exampleWidth / 2 - correct && monkeyX < exampleCenter + exampleWidth / 2 + correct) {
      ele.monkey.jumpWin(i == len - 1); //判断是否落到下一个房顶上
      return;
    }
  }
  ele.monkey.jumpFail();
}

function allReturn() {
  var ele = data.element;
  var exa = ele.roof.example;
  var singleLength = data.system.time.delta * 0.75; //单次移动距离

  requestAnimationFrame(_move);

  function _move() {
    ele.monkey.x -= singleLength;
    for (var i = 0, len = exa.length; i < len; i++) {
      exa[i].center -= singleLength;
    }
    if (exa[exa.length - 1].center > 150) {
      requestAnimationFrame(_move);
    } else {
      ele.roof.create();
    }
  }
}

function onMouseDown(e) {
  e.preventDefault();
  if (data.system.mobile) {
    canvas.addEventListener('touchend', onMouseUp, false);
  } else {
    canvas.addEventListener('mouseup', onMouseUp, false);
  }
  data.click.down = new Date();
  data.element.groove.add();
}

function onMouseUp() {
  data.click.up = new Date();
  data.element.groove.reduce();
  var time = data.click.up - data.click.down;
  data.element.monkey.jumpStart(time / 40);
}