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
    mom: null
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
  data.element.mon = new MomObj();
  data.element.mon.init();
  data.cursor.x = data.system.width * 0.5;
  data.cursor.y = data.system.height * 0.5;
}

function gameloop() {
  requestAnimationFrame(gameloop);
  var now = Date.now();
  data.system.time.delta = now - data.system.time.previous;
  data.system.time.previous = now;
  drawBackground();
  data.element.ane.draw();
  data.element.fruit.draw();
  data.element.mon.draw();
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
    var aneID = Math.floor(Math.random() * data.element.ane.num);
    this.x[i] = data.element.ane.x[aneID];
    this.y[i] = data.system.height - data.element.ane.len[aneID];
    this.scale[i] = 0;
    this.alive[i] = true;
    this.type[i] = Math.random() < 0.2 ? 'blue' : 'orange';
  }
}

function MomObj() {
  this.x;
  this.y;
  this.angle = 0;
  this.init = function() {
    this.x = data.system.width * 0.5;
    this.y = data.system.height * 0.5;
  }
  this.draw = function() {
    this.x = this._lerpDistance(data.cursor.x, this.x, 0.98);
    this.y = this._lerpDistance(data.cursor.y, this.y, 0.98);

    var beta = Math.atan2(data.cursor.y - this.y, data.cursor.x - this.x) + Math.PI;
    this.angle = this._lerpAngle(beta, this.angle, 0.95);

    var cxt = data.system.cxt;
    cxt.save();
    cxt.translate(this.x, this.y);
    cxt.rotate(this.angle);
    cxt.drawImage(data.image, 50, 0, 50, 55, -25, -28, 50, 55); //身体
    cxt.drawImage(data.image, 30, 0, 12, 12, -6, -6, 12, 12); //眼睛
    cxt.drawImage(data.image, 50, 115, 30, 43, 15, -22, 30, 43); //尾巴
    cxt.restore();
  }
  this._lerpDistance = function(aim, cur, ratio) {
    var delta = cur - aim;
    return aim + delta * ratio;
  }
  this._lerpAngle = function(a, b, t) {
    var d = b - a;
    if (d > Math.PI) {
      d = d - 2 * Math.PI;
    }
    if (d < -Math.PI) {
      d = d + 2 * Math.PI;
    }
    return a + d * t;
  }
}

function onMouseMove(e) {
  if (e.offsetX || e.layerX) {
    data.cursor.x = e.offsetX == undefined ? e.layerX : e.offsetX;
    data.cursor.y = e.offsetY == undefined ? e.layerY : e.offsetY;
  }
}