var data = {
  image: null,
  information: null,
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
    momWave: null,
    babyWave: null,
    dust: null
  }
}

window.onload = function() {
  suitScreen(800, 600);
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
  canvas.removeEventListener('click', game);
  init();
}

function init() {
  var ele = data.element;
  canvas.addEventListener('mousemove', onMouseMove, false);
  ele.ane = new AneObj();
  ele.ane.init();
  ele.fruit = new FruitObj();
  ele.fruit.init();
  ele.mom = new MomObj();
  ele.mom.init();
  ele.baby = new BabyObj();
  ele.baby.init();
  ele.momWave = new WavaObj();
  ele.momWave.init(10, 'white');
  ele.babyWave = new WavaObj();
  ele.babyWave.init(5, 'orange');
  ele.dust = new DustObj();
  ele.dust.init();
  data.information = new InformationObj();
  data.cursor.x = data.system.width * 0.5;
  data.cursor.y = data.system.height * 0.5;
}

function gameloop() {
  var ele = data.element,
    time = data.system.time;
  requestAnimationFrame(gameloop);
  var now = Date.now();
  time.delta = now - time.previous;
  time.previous = now;
  if (time.delta > 30) {
    time.delta = 30;
  }
  drawBackground();
  ele.ane.draw();
  ele.fruit.draw();
  ele.mom.draw();
  ele.baby.draw();
  ele.dust.draw();
  ele.momWave.draw();
  ele.babyWave.draw();
  data.information.draw();
  momFruitsCollision();
  momBabyCollision();
}

function drawBackground() {
  var cxt = data.system.cxt;
  var gr = cxt.createRadialGradient(data.system.width / 2, 0, data.system.height / 2, data.system.width / 2, 0, data.system.width);
  gr.addColorStop(0, '#0071ca');
  gr.addColorStop(0.8, '#01062c');
  cxt.fillStyle = gr;
  cxt.fillRect(0, 0, data.system.width, data.system.height);
}

function AneObj() {
  this.rootx = [];
  this.headx = [];
  this.heady = [];
  this.amp = [];
  this.time = 0;
  this.num = 50;

  this.init = function() {
    for (var i = 0; i < this.num; i++) {
      this.rootx[i] = i * 16 + Math.random() * 20;
      this.headx[i] = this.rootx[i];
      this.heady[i] = data.system.height - 200 + Math.random() * 50;
      this.amp[i] = Math.random() * 50 + 20;
    }
  }
  this.draw = function() {
    this.time += data.system.time.delta * 0.001;
    var deviation = Math.sin(this.time);
    var cxt = data.system.cxt;
    cxt.save();
    cxt.globalAlpha = 0.6;
    cxt.lineWidth = 20;
    cxt.lineCap = 'round';
    cxt.shadowColor = '#5e257b';
    cxt.shadowBlur = 20;
    cxt.strokeStyle = '#3b154e';
    for (var i = 0; i < this.num; i++) {
      cxt.beginPath();
      cxt.moveTo(this.rootx[i], data.system.height);
      this.headx[i] = this.rootx[i] + deviation * this.amp[i];
      cxt.quadraticCurveTo(this.rootx[i], data.system.height - 100, this.headx[i], this.heady[i]);
      cxt.stroke();
    }
    cxt.restore();
  }
}

function FruitObj() {
  this.alive = [];
  this.x = [];
  this.y = [];
  this.aneIndex = [];
  this.scale = [];
  this.spd = [];
  this.type = [];
  this.num = 15;

  this.init = function() {
    for (var i = 0; i < this.num; i++) {
      this.born(i);
    }
  }
  this.draw = function() {
    for (var i = 0; i < this.num; i++) {
      if (this.alive[i] === true) {
        if (this.scale[i] <= 1) {
          this.scale[i] += this.spd[i] * data.system.time.delta * 0.01;
          this.x[i] = data.element.ane.headx[this.aneIndex[i]];
          this.y[i] = data.element.ane.heady[this.aneIndex[i]];
        } else {
          this.y[i] -= this.spd[i] * data.system.time.delta;
        }
        if (this.type[i] === 'orange') {
          data.system.cxt.drawImage(data.image, 2, 2, 21, 21, this.x[i] - this.scale[i] * 10.5, this.y[i] - this.scale[i] * 10.5, 21 * this.scale[i], 21 * this.scale[i]);
        } else {
          data.system.cxt.drawImage(data.image, 2, 32, 21, 21, this.x[i] - this.scale[i] * 10.5, this.y[i] - this.scale[i] * 10.5, 21 * this.scale[i], 21 * this.scale[i]);
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
    this.aneIndex[i] = Math.floor(Math.random() * ane.num);
    this.spd[i] = Math.random() * 0.04 + 0.04;
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

  this.body = {
    count: 0,
    position: [
      [
        [50, 0],
        [100, 0],
        [150, 0],
        [200, 0],
        [250, 0],
        [300, 0],
        [350, 0],
        [400, 0]
      ],
      [
        [50, 60],
        [100, 60],
        [150, 60],
        [200, 60],
        [250, 60],
        [300, 60],
        [350, 60],
        [400, 60]
      ]
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
  this.move = function() {
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
  }
  this.draw = function() {
    this.move();
    var cxt = data.system.cxt;
    cxt.save();
    cxt.translate(this.x, this.y);
    cxt.rotate(this.angle);
    cxt.drawImage(data.image, this.tail.position[this.tail.count][0], this.tail.position[this.tail.count][1], 30, 43, 15, -22, 30, 43); //尾巴
    cxt.drawImage(data.image, this.body.position[data.information.double - 1][this.body.count][0], this.body.position[data.information.double - 1][this.body.count][1], 50, 55, -25, -28, 50, 55); //身体
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
  this.move = function() {
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
        data.information.over = true;
      }
    }

    this.eye.timer += data.system.time.delta;
    if (this.eye.timer > this.eye.interval) {
      this.eye.count = (this.eye.count + 1) % 2;
      this.eye.timer = 0;
      this.eye.interval = this.eye.count ? 200 : Math.random() * 1500 + 2000;
    }
  }
  this.draw = function() {
    this.move();
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

function WavaObj() {
  this.x = [];
  this.y = [];
  this.alive = [];
  this.r = [];
  this.maxR;
  this.num;
  this.color;

  this.init = function(num, color) {
    this.num = num;
    this.color = color;
    for (var i = 0; i < this.num; i++) {
      this.alive[i] = false;
    }
  }
  this.draw = function() {
    var cxt = data.system.cxt;
    cxt.save();
    if (this.color == 'white') {
      cxt.shadowColor = '#fff';
      cxt.lineWidth = 2;
      cxt.shadowBlur = 10;
      this.maxR = 60;
    } else {
      cxt.shadowColor = 'rgba(255, 56, 14)';
      cxt.lineWidth = 1;
      cxt.shadowBlur = 5;
      this.maxR = 120;
    }
    for (var i = 0; i < this.num; i++) {
      if (this.alive[i]) {
        this.r[i] += data.system.time.delta * 0.05;
        if (this.r[i] > this.maxR) {
          this.alive[i] = false;
          continue;
        }
        var alpha = 1 - this.r[i] / this.maxR;
        cxt.beginPath();
        cxt.arc(this.x[i], this.y[i], this.r[i], 0, Math.PI * 2);
        cxt.closePath();
        if (this.color == 'white') {
          cxt.strokeStyle = 'rgba(255, 255, 255, ' + alpha + ')';
        } else {
          cxt.strokeStyle = 'rgba(203, 91, 0, ' + alpha + ')';
        }
        cxt.stroke();
      }
    }
    cxt.restore();
  }
  this.born = function(x, y) {
    for (var i = 0; i < this.num; i++) {
      if (!this.alive[i]) {
        this.alive[i] = true;
        this.r[i] = 0;
        this.x[i] = x;
        this.y[i] = y;
        break;
      }
    }
  }
}

function DustObj() {
  this.x = [];
  this.y = [];
  this.amp = [];
  this.style = [];
  this.time;
  this.num = 40;
  this.position = [
    [0, 95, 20],
    [0, 119, 18],
    [0, 142, 16],
    [0, 163, 14],
    [0, 183, 12],
    [0, 201, 9],
    [0, 216, 6]
  ];

  this.init = function() {
    this.time = 0;
    for (var i = 0; i < this.num; i++) {
      this.x[i] = Math.random() * data.system.width;
      this.y[i] = Math.random() * data.system.height;
      this.amp[i] = 20 + Math.random() * 25;
      this.style[i] = Math.floor(Math.random() * 7);
    }
  }
  this.draw = function() {
    this.time += data.system.time.delta * 0.001;
    var deviation = Math.sin(this.time);
    var cxt = data.system.cxt;
    for (var i = 0; i < this.num; i++) {
      var position = this.position[this.style[i]];
      cxt.drawImage(data.image, position[0], position[1], position[2], position[2], this.x[i] + deviation * this.amp[i], this.y[i], position[2], position[2]);
    }
  }
}

function InformationObj() {
  this.fruitNum = 0;
  this.double = 1;
  this.score = 0;
  this.over = false;
  this.textAlpha = 0;

  this.addScore = function() {
    this.score += this.fruitNum * this.double;
    this.reset();
  }
  this.reset = function() {
    this.fruitNum = 0;
    this.double = 1;
  }
  this.draw = function() {
    var w = data.system.width,
      h = data.system.height;
    var cxt = data.system.cxt;

    cxt.save();
    cxt.fillStyle = '#fff';
    cxt.font = '20px Microsoft YaHei';
    cxt.textAlign = 'center';
    cxt.fillText('SCORE: ' + this.score, w * 0.5, h - 20);
    cxt.restore();

    if (this.over) {
      cxt.save();
      this.textAlpha += data.system.time.delta * 0.0005;
      if (this.textAlpha > 1) {
        this.textAlpha = 1;
        canvas.addEventListener('click', game, false);
      }
      cxt.font = '40px Microsoft YaHei';
      cxt.shadowBlur = 20;
      cxt.shadowColor = '#000';
      cxt.textAlign = 'center';
      cxt.fillStyle = 'rgba(255, 255, 255, ' + this.textAlpha + ')';
      cxt.fillText('GAMEOVER', w * 0.5, h * 0.5);
      cxt.restore();
    }
  }
}

function momFruitsCollision() {
  var fruit = data.element.fruit,
    mom = data.element.mom,
    momWave = data.element.momWave;
  if (!data.information.over) {
    for (var i = 0; i < fruit.num; i++) {
      if (fruit.alive[i]) {
        var l = calLength(fruit.x[i], fruit.y[i], mom.x, mom.y);
        if (l < 400) {
          momWave.born(fruit.x[i], fruit.y[i]);
          fruit.dead(i);
          data.information.fruitNum++;
          mom.body.count = Math.min(mom.body.count + 1, 7);
          if (fruit.type[i] == 'blue') {
            data.information.double = 2;
          }
        }
      }
    }
  }
}

function momBabyCollision() {
  var mom = data.element.mom,
    baby = data.element.baby,
    babyWave = data.element.babyWave;
  if (data.information.fruitNum > 0 && !data.information.over) {
    var l = calLength(mom.x, mom.y, baby.x, baby.y);
    if (l < 900) {
      babyWave.born(baby.x, baby.y);
      setTimeout(function() {
        babyWave.born(baby.x, baby.y);
      }, data.system.time.delta * 5);
      baby.body.count = 0;
      mom.body.count = 0;
      data.information.addScore();
    }
  }
}

function onMouseMove(e) {
  if (!data.information.over) {
    if (e.offsetX || e.layerX) {
      data.cursor.x = e.offsetX == undefined ? e.layerX : e.offsetX;
      data.cursor.y = e.offsetY == undefined ? e.layerY : e.offsetY;
    }
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