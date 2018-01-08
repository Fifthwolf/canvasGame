var data = {
  image: null,
  cursor: {
    x: null,
    y: null
  },
  system: {
    time: {
      previous: 0,
      delta: 0
    },
    cxt: null,
    scale: 1,
    top: 0,
    width: 800,
    height: 600
  },
  element: {
    ane: null,
    fruit: null,
    mom: null,
    baby: null,
  }
}

window.onload = function() {
  suitScreen();
  imageLoaded();
}

function imageLoaded() {
  var image = new Image();
  image.src = 'tinyHeart.png';
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
    canvas.width = 800;
    canvas.height = 600;
  }
}

function game() {
  init();
}

function init() {
  canvas.addEventListener('mousemove', onMouseMove, false);
  data.element.ane = new AneObj();
  data.element.ane.init();
  data.element.fruit = new FruitObj();
  data.element.fruit.init();
  data.element.mom = new MomObj();
  data.element.mom.init();
  data.element.baby = new BabyObj();
  data.element.baby.init();
  data.cursor.x = data.system.width * 0.5;
  data.cursor.y = data.system.height * 0.5;
}

function gameloop() {
  requestAnimationFrame(gameloop);
  var now = Date.now();
  data.system.time.delta = now - data.system.time.previous;
  data.system.time.previous = now;
  if (data.system.time.delta > 30) {
    data.system.time.delta = 30;
  }
  drawBackground();
  data.element.ane.draw();
  data.element.fruit.draw();
  data.element.mom.draw();
  data.element.baby.draw();
  momFruitsCollision();
  momBabyCollision();
}

function drawBackground() {
  var gr = data.system.cxt.createRadialGradient(data.system.width / 2, 0, data.system.height / 2, data.system.width / 2, 0, data.system.width);
  gr.addColorStop(0, '#0071ca');
  gr.addColorStop(0.8, '#01062c');
  data.system.cxt.fillStyle = gr;
  data.system.cxt.fillRect(0, 0, data.system.width, data.system.height);
}

function AneObj() {
  this.x = [];
  this.len = [];
  this.num = 50;
  this.init = function() {
    for (var i = 0; i < this.num; i++) {
      this.x[i] = i * 16 + Math.random() * 20;
      this.len[i] = 200 + Math.random() * 50;
    }
  }
  this.draw = function() {
    var cxt = data.system.cxt;
    cxt.save();
    cxt.globalAlpha = 0.6;
    cxt.lineWidth = 20;
    cxt.lineCap = 'round';
    cxt.strokeStyle = '#3b154e';
    for (var i = 0; i < this.num; i++) {
      cxt.beginPath();
      cxt.moveTo(this.x[i], data.system.height);
      cxt.lineTo(this.x[i], data.system.height - this.len[i]);
      cxt.stroke();
    }
    cxt.restore();
  }
}

function FruitObj() {
  this.alive = [];
  this.x = [];
  this.y = [];
  this.scale = [];
  this.spd = [];
  this.type = [];
  this.num = 15;
  this.init = function() {
    for (var i = 0; i < this.num; i++) {
      this.alive[i] = true;
      this.x[i] = 0;
      this.y[i] = 0;
      this.spd[i] = Math.random() * 0.04 + 0.04;
      this.type[i] = '';
      this.born(i);
    }
  }
  this.draw = function() {
    for (var i = 0; i < this.num; i++) {
      if (this.alive[i] === true) {
        if (this.scale[i] <= 1) {
          this.scale[i] += this.spd[i] * data.system.time.delta * 0.01;
        } else {
          this.y[i] -= this.spd[i] * data.system.time.delta;
        }
        if (this.type[i] === 'orange') {
          data.system.cxt.drawImage(data.image, 0, 0, 21, 21, this.x[i] - this.scale[i] * 10.5, this.y[i] - this.scale[i] * 10.5, 21 * this.scale[i], 21 * this.scale[i]);
        } else {
          data.system.cxt.drawImage(data.image, 0, 30, 21, 21, this.x[i] - this.scale[i] * 10.5, this.y[i] - this.scale[i] * 10.5, 21 * this.scale[i], 21 * this.scale[i]);
        }
        if (this.y[i] < -10) {
          this.alive[i] = false;
          this.born(i);
        }
      }
    }
  }
  this.born = function(i) {
    var ane = data.element.ane;
    var aneID = Math.floor(Math.random() * ane.num);
    this.x[i] = ane.x[aneID];
    this.y[i] = data.system.height - ane.len[aneID];
    this.scale[i] = 0;
    this.alive[i] = true;
    this.type[i] = Math.random() < 0.2 ? 'blue' : 'orange';
  }
  this.dead = function(i) {
    this.alive[i] = false;
    this.born(i);
  }
}

function MomObj() {
  this.x;
  this.y;
  this.angle;

  this.tail = {
    timer: 0,
    count: 0,
    position: [
      [50, 115],
      [81, 115],
      [50, 115],
      [112, 115],
      [143, 115],
      [174, 115],
      [205, 115],
      [236, 115]
    ]
  }

  this.eye = {
    timer: 0,
    count: 0,
    interval: 2000,
    position: [
      [30, 15],
      [30, 0]
    ]
  }

  this.init = function() {
    this.x = data.system.width * 0.5;
    this.y = data.system.height * 0.5;
    this.angle = 0;
  }
  this.draw = function() {
    this.x = lerpDistance(data.cursor.x, this.x, 0.98);
    this.y = lerpDistance(data.cursor.y, this.y, 0.98);

    var beta = Math.atan2(data.cursor.y - this.y, data.cursor.x - this.x) + Math.PI;
    this.angle = lerpAngle(beta, this.angle, 0.95);

    this.tail.timer += data.system.time.delta;
    if (this.tail.timer > 50) {
      this.tail.timer = 0;
      this.tail.count = (this.tail.count + 1) % 8;
    }

    this.eye.timer += data.system.time.delta;
    if (this.eye.timer > this.eye.interval) {
      this.eye.count = (this.eye.count + 1) % 2;
      this.eye.timer = 0;
      this.eye.interval = this.eye.count ? 200 : Math.random() * 1500 + 2000;
    }

    var cxt = data.system.cxt;
    cxt.save();
    cxt.translate(this.x, this.y);
    cxt.rotate(this.angle);
    cxt.drawImage(data.image, this.tail.position[this.tail.count][0], this.tail.position[this.tail.count][1], 30, 43, 15, -22, 30, 43); //尾巴
    cxt.drawImage(data.image, 50, 0, 50, 55, -25, -28, 50, 55); //身体
    cxt.drawImage(data.image, this.eye.position[this.eye.count][0], this.eye.position[this.eye.count][1], 12, 12, -6, -6, 12, 12); //眼睛
    cxt.restore();
  }
}

function BabyObj() {
  this.x;
  this.y;
  this.angle;
  this.tail = {
    timer: 0,
    count: 0,
    position: [
      [298, 121],
      [325, 121],
      [352, 121],
      [379, 121],
      [406, 121],
      [433, 121],
      [460, 121],
      [460, 158]
    ]
  }
  this.body = {
    timer: 0,
    count: 0,
    position: [
      [50, 158],
      [91, 158],
      [132, 158],
      [173, 158],
      [214, 158],
      [255, 158],
      [296, 158],
      [337, 158],
      [378, 158],
      [419, 158],
      [50, 204],
      [91, 204],
      [132, 204],
      [173, 204],
      [214, 204],
      [255, 204],
      [296, 204],
      [337, 204],
      [378, 204],
      [419, 204]
    ]
  }
  this.eye = {
    timer: 0,
    count: 0,
    interval: 2000,
    position: [
      [0, 62],
      [0, 74]
    ]
  }
  this.init = function() {
    this.x = data.system.width * 0.5 - 50;
    this.y = data.system.height * 0.5 + 50;
    this.angle = 0;
  }
  this.draw = function() {
    var mom = data.element.mom;
    this.x = lerpDistance(mom.x, this.x, 0.99);
    this.y = lerpDistance(mom.y, this.y, 0.99);

    var beta = Math.atan2(mom.y - this.y, mom.x - this.x) + Math.PI;
    this.angle = lerpAngle(beta, this.angle, 0.95);

    this.tail.timer += data.system.time.delta;
    if (this.tail.timer > 50) {
      this.tail.count = (this.tail.count + 1) % 8;
      this.tail.timer = 0;
    }

    this.body.timer += data.system.time.delta;
    if (this.body.timer > 300) {
      this.body.timer = 0;
      this.body.count = this.body.count + 1;
      if (this.body.count > 19) {
        this.body.count = 19;
        //gameover
      }
    }

    this.eye.timer += data.system.time.delta;
    if (this.eye.timer > this.eye.interval) {
      this.eye.count = (this.eye.count + 1) % 2;
      this.eye.timer = 0;
      this.eye.interval = this.eye.count ? 200 : Math.random() * 1500 + 2000;
    }

    var cxt = data.system.cxt;
    cxt.save();
    cxt.translate(this.x, this.y);
    cxt.rotate(this.angle);
    cxt.drawImage(data.image, this.tail.position[this.tail.count][0], this.tail.position[this.tail.count][1], 27, 37, 10, -19, 27, 37); //尾巴
    cxt.drawImage(data.image, this.body.position[this.body.count][0], this.body.position[this.body.count][1], 41, 46, -21, -23, 41, 46); //身体
    cxt.drawImage(data.image, this.eye.position[this.eye.count][0], this.eye.position[this.eye.count][1], 10, 10, -5, -5, 10, 10); //眼睛
    cxt.restore();
  }
}

function momFruitsCollision() {
  var fruit = data.element.fruit,
    mom = data.element.mom;
  for (var i = 0; i < fruit.num; i++) {
    if (fruit.alive[i]) {
      var l = calLength(fruit.x[i], fruit.y[i], mom.x, mom.y);
      if (l < 400) {
        fruit.dead(i);
      }
    }
  }
}

function momBabyCollision() {
  var mom = data.element.mom,
    baby = data.element.baby;
  var l = calLength(mom.x, mom.y, baby.x, baby.y);
  if (l < 900) {
    baby.body.count = 0;
  }
}

function onMouseMove(e) {
  if (e.offsetX || e.layerX) {
    data.cursor.x = e.offsetX == undefined ? e.layerX : e.offsetX;
    data.cursor.y = e.offsetY == undefined ? e.layerY : e.offsetY;
  }
}

Object.prototype.lerpDistance = function(aim, cur, ratio) {
  var delta = cur - aim;
  return aim + delta * ratio;
}

Object.prototype.lerpAngle = function(a, b, t) {
  var d = b - a;
  if (d > Math.PI) {
    d = d - 2 * Math.PI;
  }
  if (d < -Math.PI) {
    d = d + 2 * Math.PI;
  }
  return a + d * t;
}

Object.prototype.calLength = function(x1, y1, x2, y2) {
  return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
}