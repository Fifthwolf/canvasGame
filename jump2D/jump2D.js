var data = {
  image: null,
  system: {
    time: {
      previous: 0,
      delta: 0
    },
    cxt: null,
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
    monkey: null,
    roof: null,
    sun: null,
    groove: null,
    information: null
  },
}

window.onload = function() {
  suitScreen();
  imageLoaded();
}

function imageLoaded() {
  var image = new Image();
  image.src = 'jump2D.png';
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
  init();
}

function init() {
  var ele = data.element;
  ele.information = new Information();
  ele.information.init();
  ele.monkey = new Monkey();
  ele.monkey.init();
  ele.groove = new PowerGroove();
  ele.roof = new Roof();
  ele.roof.init();
  ele.sun = new Sun();
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
  ele.monkey.draw(cxt);
  ele.groove.draw(cxt);
  ele.roof.draw(cxt);
  ele.sun.draw(cxt);
  ele.information.draw(cxt);
}

function drawBackground(cxt) {
  cxt.drawImage(data.image, 0, 0, 640, 480, 0, 0, 640, 480);
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
    canvas.removeEventListener('mouseup', onMouseUp);
    initial = Math.min(initial, 15);
    this.vy = -initial;
    this.vx = initial;
    this.state = 1;
    this.judge = false;
  }
  this.jump = function() {
    this.x += this.vx;
    this.y = this.y + this.vy;
    this.vy = this.vy + this.gravity;
    if (!this.judge && this.y > 430) {
      landing();
      this.judge = true;
    }
  }
  this.jumpWin = function(next) {
    data.element.information.scoreAdd();
    console.log(data.element.information.score);

    this.state = 0;
    this.y = 430;
    if (next) {
      allReturn();
    } else {
      canvas.addEventListener('mousedown', onMouseDown, false);
    }
  };
  this.jumpFail = function() {
    //失败界面
  }

  this.draw = function(cxt) {
    if (this.state == 1) {
      this.jump();
    }
    cxt.save();
    cxt.translate(this.x, this.y); //坐标原点位于猴子正中下方
    cxt.drawImage(data.image, this.position[this.state][0], this.position[this.state][1], 100, 100, -50, -100, 100, 100);
    cxt.restore();
  }
}

function Roof() {
  this.example = [];
  this.difficulty;

  this.init = function() {
    this.difficulty = 1;
    this.example.push({
      width: 200,
      center: 150,
      type: 0
    });
    this.create();
  }
  this.create = function() {
    var widthBase, width, center;
    this.difficulty = Math.floor(data.element.information.score / 5);
    switch (this.difficulty) {
      case 0:
        widthBase = 160;
        break;
      case 1:
        widthBase = 120;
        break;
      case 2:
        widthBase = 90;
        break;
      case 3:
        widthBase = 60;
        break;
      default:
        widthBase = 30;
        break;
    }
    width = widthBase + Math.floor(Math.random() * widthBase / 2);
    center = 500 - widthBase / 2 + Math.floor(Math.random() * widthBase / 2);
    this.example.push({
      width: width,
      center: center,
      type: 0
    });
    this.example[this.example.length - 2].center = 150;
    this.clear();
    canvas.addEventListener('mousedown', onMouseDown, false);
  }
  this.clear = function() {
    if (this.example.length > 2) {
      this.example = this.example.slice(1);
    }
  }

  this.draw = function(cxt) {
    cxt.save();
    for (var i = 0, len = this.example.length; i < len; i++) {
      cxt.beginPath();
      cxt.fillStyle = '#00f';
      cxt.rect(this.example[i].center - this.example[i].width / 2, 427, this.example[i].width, 53);
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
    this.rotate = (this.rotate - 1) % 360;
    cxt.save();
    cxt.translate(this.x, this.y); //坐标原点位于猴子正中下方
    cxt.rotate(this.rotate * Math.PI / 180);
    cxt.drawImage(data.image, 660, 240, 100, 100, -50, -50, 100, 100);
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
      this.value += 6;
      if (this.value > this.max) {
        this.stop();
        this.value = this.max;
      }
    }
    if (this.state == 2) {
      this.value -= 15;
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
  var moveLength = exa[exa.length - 1].center - exa[exa.length - 2].center;
  var movesNumber = 20; //移动次数
  var singleLength = moveLength / movesNumber; //单次移动距离

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

function onMouseDown() {
  canvas.addEventListener('mouseup', onMouseUp, false);
  data.click.down = new Date();
  data.element.groove.add();
}

function onMouseUp() {
  data.click.up = new Date();
  data.element.groove.reduce();
  var time = data.click.up - data.click.down;
  data.element.monkey.jumpStart(time / 20);
}