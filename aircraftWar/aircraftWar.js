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
    speedY: 0,
    scale: 1,
    top: 0,
    width: 400,
    height: 600
  },
  element: {
    startText: null,
    millenniumFalcon: null,
    bullet: null
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
  image.src = 'aircraftWar.png';
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
    canvas.width = 400;
    canvas.height = 600;
  }
}

function game() {
  data.element.startText = new StartText();
  if (data.system.mobile) {
    canvas.addEventListener('touchend', init, false);
  } else {
    canvas.addEventListener('click', init, false);
  }
}

function init() {
  canvas.removeEventListener('click', init);
  data.system.start = true;
  var ele = data.element;
  ele.bullet = new Bullet();
  ele.bullet.init();
  ele.millenniumFalcon = new MillenniumFalcon();
  ele.millenniumFalcon.init();
  document.addEventListener('keydown', millenniumFalconMove, false);
  document.addEventListener('keyup', millenniumFalconMoveEnd, false);
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
    ele.bullet.draw(cxt);
    ele.millenniumFalcon.draw(cxt);
  } else {
    ele.startText.draw(cxt);
  }
}

function StartText() {
  this.x = 200;
  this.y = 200;
  this.testAlpha = 1;
  this.picState = 1; //0下降，1上升
  this.textState = 0; //0减弱，1增强
  this.position = [0, 0];

  this.testAlpahChange = function() {
    if (this.textState) {
      this.testAlpha += data.system.time.delta * 0.005;
      if (this.testAlpha > 1) {
        this.textState = 0;
      }
    } else {
      this.testAlpha -= data.system.time.delta * 0.001;
      if (this.testAlpha < 0) {
        this.textState = 1;
      }
    }
  }
  this.startPicFloat = function() {
    if (this.picState) {
      this.y += data.system.time.delta * 0.02;
      if (this.y > 225) {
        this.picState = 0;
      }
    } else {
      this.y -= data.system.time.delta * 0.02;
      if (this.y < 175) {
        this.picState = 1;
      }
    }
  }
  this.draw = function(cxt) {
    this.testAlpahChange();
    this.startPicFloat();
    cxt.save();
    cxt.translate(this.x, this.y);
    cxt.drawImage(data.image, this.position[0], this.position[1], 400, 200, -200, -100, 400, 200);
    cxt.restore();

    cxt.save();
    cxt.beginPath();
    cxt.font = "20px Microsoft YaHei";
    cxt.textAlign = "center";
    cxt.fillStyle = 'rgba(255, 255, 255,' + this.testAlpha + ')';
    cxt.shadowColor = '#000';
    cxt.shadowOffsetX = 1;
    cxt.shadowOffsetY = 1;
    cxt.shadowBlur = 1;
    cxt.fillText("点击以开始游戏", 200, 500);
    cxt.restore();
  }
}

function MillenniumFalcon() {
  this.x;
  this.y;
  this.width = 80;
  this.height = 80;
  this.health;
  this.direction = {
    up: false,
    right: false,
    down: false,
    left: false
  }
  this.attack = {
    on: false,
    value: 1
  }
  this.time;

  this.init = function() {
    var self = this;
    this.x = 200;
    this.y = 500;
    this.time = setInterval(function() {
      self.attack.on = true;
    }, data.system.time.delta * 10);
  }
  this.move = function() {
    var dir;
    var delta = data.system.time.delta;

    if (this.direction.up & this.direction.right) {
      dir = 2;
    } else if (this.direction.right & this.direction.down) {
      dir = 4;
    } else if (this.direction.down & this.direction.left) {
      dir = 6;
    } else if (this.direction.left & this.direction.up) {
      dir = 8;
    } else if (this.direction.up) {
      dir = 1;
    } else if (this.direction.right) {
      dir = 3;
    } else if (this.direction.down) {
      dir = 5;
    } else if (this.direction.left) {
      dir = 7;
    }

    switch (dir) { //1向上移动，顺时针8个方位
      case 1:
        this.y -= delta * 0.5;
        break;
      case 2:
        this.x += delta * 0.35;
        this.y -= delta * 0.35;
        break;
      case 3:
        this.x += delta * 0.5;
        break;
      case 4:
        this.x += delta * 0.35;
        this.y += delta * 0.35;
        break;
      case 5:
        this.y += delta * 0.5;
        break;
      case 6:
        this.x -= delta * 0.35;
        this.y += delta * 0.35;
        break;
      case 7:
        this.x -= delta * 0.5;
        break;
      case 8:
        this.x -= delta * 0.35;
        this.y -= delta * 0.35;
        break;
    }
  }
  this.draw = function(cxt) {
    this.move();
    if (this.attack.on) {
      data.element.bullet.create(this.x - 15, this.y, -50, this.attack.value, 2, 0);
      data.element.bullet.create(this.x + 15, this.y, -50, this.attack.value, 2, 0);
      this.attack.on = false;
    }

    cxt.save();
    cxt.translate(this.x, this.y); //坐标原点位于飞机中心
    cxt.drawImage(data.image, 0, 200, this.width, this.height, -this.width / 2, -this.height / 2, this.width, this.height);
    cxt.restore();
  }
}

function Bullet() {
  this.bullet = [];
  this.time;

  this.init = function() {
    var self = this;
    this.bullet = [];
    this.time = setInterval(function() {
      self.destroy();
    }, data.system.time.delta * 100);
  }
  this.create = function(x, y, vy, attack, radius, type) {
    this.bullet.push({
      x: x,
      y: y,
      vy: vy,
      attack: attack,
      radius: radius,
      type: type
    });
  }
  this.move = function(bullet) {
    bullet.y += bullet.vy * data.system.time.delta * 0.01;
  }
  this.destroy = function() {
    for (var i = this.bullet.length - 1; i >= 0; i--) {
      if (this.bullet[i].y < -10 || this.bullet[i].x > 610) {
        this.bullet.splice(i, 1);
      }
    }
  }
  this.draw = function(cxt) {
    this.destroy();
    for (var i = 0, len = this.bullet.length; i < len; i++) {
      this.move(this.bullet[i]);

      cxt.save();
      cxt.beginPath();
      cxt.fillStyle = '#fff';
      cxt.arc(this.bullet[i].x, this.bullet[i].y, this.bullet[i].radius, 0, 2 * Math.PI);
      cxt.fill();
      cxt.restore();
    }
  }
}

function Star() {
  this.star = [];

  this.init = function() {
    this.star = [];
  }
  this.position = [
    [1, 1],
    [2, 1]
  ]
  this.create = function(x, y, type) {
    this.star.push({
      x: x,
      y: y,
      type: type
    });
  }
  this.draw = function() {

  }
}

function drawBackground(cxt) {
  var gr = cxt.createRadialGradient(data.system.width / 2, 0, 0, data.system.width / 2, 0, data.system.height * 1.2);
  gr.addColorStop(0, '#084097');
  gr.addColorStop(0.8, '#120241');
  cxt.fillStyle = gr;
  cxt.fillRect(0, 0, data.system.width, data.system.height);
}

function millenniumFalconMove(event) {
  var e = event || window.event || arguments.callee.caller.arguments[0];
  var direction = data.element.millenniumFalcon.direction;

  switch (e && e.keyCode) {
    case 87:
      direction.up = true;
      break;
    case 68:
      direction.right = true;
      break;
    case 83:
      direction.down = true;
      break;
    case 65:
      direction.left = true;
      break;
  }
}

function millenniumFalconMoveEnd(event) {
  var e = event || window.event || arguments.callee.caller.arguments[0];
  var direction = data.element.millenniumFalcon.direction;

  switch (e && e.keyCode) {
    case 87:
      direction.up = false;
      break;
    case 68:
      direction.right = false;
      break;
    case 83:
      direction.down = false;
      break;
    case 65:
      direction.left = false;
      break;
  }
}