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
    speedY: 0.2,
    scale: 1,
    top: 0,
    width: 400,
    height: 600
  },
  element: {
    startText: null,
    blast: null,
    millenniumFalcon: null,
    hostileAirplane: null,
    bullet: null,
    star: null
  },
  TIME: null
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
  canvas.removeEventListener('touchend', init);
  canvas.removeEventListener('click', init);
  data.system.start = true;
  var ele = data.element;
  ele.startText.firstGame = false;
  ele.star = new Star();
  ele.star.init();
  ele.blast = new Blast();
  ele.blast.init();
  ele.bullet = new Bullet();
  ele.bullet.init();
  ele.hostileAirplane = new HostileAirplane();
  ele.hostileAirplane.init();
  ele.millenniumFalcon = new MillenniumFalcon();
  ele.millenniumFalcon.init();
  clearLimitsElement();
  if (data.system.mobile) {
    canvas.addEventListener('touchstart', millenniumFalconMoveInMobile, false);
    canvas.addEventListener('touchmove', millenniumFalconMoveInMobile, false);
    canvas.addEventListener('touchend', millenniumFalconMoveInMobileEnd, false);
  } else {
    document.addEventListener('keydown', millenniumFalconMove, false);
    document.addEventListener('keyup', millenniumFalconMoveEnd, false);
  }

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
  if (data.system.start) {
    killHostileAirplane();
    hurtMillenniumFalcon();
  }
}

function gameover() {
  console.log('over');
  data.system.start = false;
  if (data.system.mobile) {
    canvas.addEventListener('touchend', init, false);
  } else {
    canvas.addEventListener('click', init, false);
  }
}

function drawImage() {
  var cxt = data.system.cxt,
    ele = data.element;
  drawBackground(cxt);
  if (data.system.start) {
    ele.star.draw(cxt);
    ele.bullet.draw(cxt);
    ele.hostileAirplane.draw(cxt);
    ele.millenniumFalcon.airDraw(cxt);
    ele.millenniumFalcon.infoDraw(cxt);
    ele.blast.draw(cxt);
  } else {
    ele.startText.draw(cxt);
  }
}

function StartText() {
  this.x = 200;
  this.y = 200;
  this.textAlpha = 1;
  this.firstGame = true;
  this.picState = 1; //0下降，1上升
  this.textState = 0; //0减弱，1增强
  this.position = [0, 0];

  this.textAlpahChange = function() {
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
    this.textAlpahChange();
    this.startPicFloat();
    cxt.save();
    cxt.translate(this.x, this.y);
    if (this.firstGame) {
      cxt.drawImage(data.image, this.position[0], this.position[1], 400, 200, -200, -100, 400, 200);
    } else {
      cxt.fillText("FAIL", 200, 200);
    }
    cxt.restore();

    cxt.save();
    cxt.beginPath();
    cxt.font = "20px Microsoft YaHei";
    cxt.textAlign = "center";
    cxt.fillStyle = 'rgba(255, 255, 255,' + this.textAlpha + ')';
    cxt.shadowColor = '#000';
    cxt.shadowOffsetX = 1;
    cxt.shadowOffsetY = 1;
    cxt.shadowBlur = 1;
    if (this.firstGame) {
      cxt.fillText("点击以开始游戏", 200, 500);
    } else {
      cxt.fillText("点击重新开始游戏", 200, 500);
    }
    cxt.restore();
  }
}

function Blast() {
  this.blast = [];

  this.init = function() {
    this.blast = [];
  }
  this.create = function(x, y, maxR) {
    this.blast.push({
      x: x,
      y: y,
      maxR: maxR,
      alpha: 0,
      scale: 0,
      state: 0
    });
  }
  this.grow = function(blast, i) {
    var delta = data.system.time.delta;
    switch (blast.state) {
      case 0:
        blast.scale += delta * 0.015;
        blast.alpha = Math.min(1, blast.alpha += delta * 0.02);
        if (blast.scale > 1) {
          blast.state = 1;
        }
        break;
      case 1:
        blast.scale += delta * 0.005;
        blast.alpha -= delta * 0.005;
        if (blast.alpha < 0) {
          blast.alpha = 0;
          blast.state = 2;
        }
        break;
      case 2:
        this.destroy(i);
        break;
    }
  }
  this.destroy = function(index) {
    this.blast.splice(index, 1);
  }
  this.draw = function(cxt) {
    for (var i = this.blast.length - 1; i >= 0; i--) {
      cxt.save();
      cxt.translate(this.blast[i].x, this.blast[i].y);
      cxt.scale(this.blast[i].scale, this.blast[i].scale);
      var gr = cxt.createRadialGradient(0, 0, this.blast[i].maxR / 3, 0, 0, this.blast[i].maxR);
      gr.addColorStop(0, 'rgba(255, 255, 255, ' + this.blast[i].alpha + ')');
      gr.addColorStop(0.7, 'rgba(255, 128, 0, ' + this.blast[i].alpha + ')');
      gr.addColorStop(1, 'rgba(255, 0, 0, ' + this.blast[i].alpha + ')');
      cxt.fillStyle = gr;
      cxt.beginPath();
      cxt.arc(0, 0, this.blast[i].maxR, 0, Math.PI * 2);
      cxt.closePath();
      cxt.fill();
      cxt.restore();
      this.grow(this.blast[i], i);
    }
  }
}

function MillenniumFalcon() {
  this.x;
  this.y;
  this.width = 80;
  this.height = 80;
  this.radius = 40;
  this.score;
  this.health;
  this.maxHealth;
  this.direction = {
    up: false,
    right: false,
    down: false,
    left: false
  }
  this.target = {
    on: false,
    x: 0,
    y: 0
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
    this.score = 0;
    this.health = 20;
    this.maxHealth = 20;
    this.targetInMobile = {
      on: false,
      x: 0,
      y: 0
    }
    this.attack = {
      on: false,
      value: 1
    };

    this.time = setInterval(function() {
      self.attack.on = true;
    }, data.system.time.delta * 10);
  }
  this.move = function() {
    var delta = data.system.time.delta;

    if ((this.direction.up && this.direction.right) ||
      (this.direction.right && this.direction.down) ||
      (this.direction.down && this.direction.left) ||
      (this.direction.left && this.direction.up)) {
      delta *= 0.7;
    }
    if (this.direction.up) {
      this.y -= 0.5 * delta;
    }
    if (this.direction.right) {
      this.x += 0.5 * delta;
    }
    if (this.direction.down) {
      this.y += 0.5 * delta;
    }
    if (this.direction.left) {
      this.x -= 0.5 * delta;
    }

    this.x = Math.max(0, Math.min(400, this.x));
    this.y = Math.max(0, Math.min(600, this.y));
  }
  this.moveInMobile = function(targetX, targetY) {
    if (Math.abs(targetX - this.x) < 10 && Math.abs(targetY - this.y) < 10) {
      return;
    }

    var delta = data.system.time.delta,
      ratio = (targetX - this.x) / (targetY - this.y),
      square = Math.sqrt((targetX - this.x) * (targetX - this.x) + (targetY - this.y) * (targetY - this.y)),
      vx = (targetX - this.x) / square,
      vy = (targetY - this.y) / square;

    this.x += vx * delta * 0.5;
    this.y += vy * delta * 0.5;
  }
  this.die = function() {
    this.radius = 0;
    this.width = 0;
    this.height = 0;
    this.health = 0;
    this.direction = {
      up: false,
      right: false,
      down: false,
      left: false
    }
    clearInterval(this.time);
    document.removeEventListener('keydown', millenniumFalconMove);
    document.removeEventListener('keyup', millenniumFalconMoveEnd);
  }

  this.airDraw = function(cxt) {
    this.move();
    if (this.targetInMobile.on) {
      this.moveInMobile(this.targetInMobile.x, this.targetInMobile.y);
    }
    if (this.attack.on) {
      data.element.bullet.create(this.x - 15, this.y, 0, -60, this.attack.value, 2, 0);
      data.element.bullet.create(this.x + 15, this.y, 0, -60, this.attack.value, 2, 0);
      this.attack.on = false;
    }

    cxt.save();
    cxt.translate(this.x, this.y); //坐标原点位于飞机中心
    cxt.drawImage(data.image, 0, 200, this.width, this.height, -this.width / 2, -this.height / 2, this.width, this.height);
    cxt.restore();
  }
  this.infoDraw = function(cxt) {
    cxt.save();
    cxt.beginPath();
    cxt.font = "20px Verdana";
    cxt.textAlign = "right";
    cxt.fillStyle = '#0f6';
    cxt.fillText("HP", 322, 33);
    cxt.rect(330, 15, Math.max(0, this.health) / this.maxHealth * 50, 20);
    cxt.fill();
    cxt.beginPath();
    cxt.strokeStyle = '#000';
    cxt.lineWidth = 2;
    cxt.rect(330, 15, 50, 20);
    cxt.stroke();
    cxt.textAlign = "left";
    cxt.fillStyle = '#fff';
    cxt.fillText("SCORE: " + this.score, 20, 33);
    cxt.restore();
  }
}

function HostileAirplane() {
  this.airplane = [];

  this.init = function() {
    var self = this;

    /* 1秒后第1波敌机 */
    createAir(1000, 10, 0);
    createAir(1000, 10, 1);

    /* 12秒后第2波敌机 */
    createAir(12000, 10, 2);
    createAir(12000, 10, 3);

    function createAir(time, num, type) {
      setTimeout(function() {
        switch (type) {
          case 0:
            _createY(num, 100, 1.5, 5, 0, 1, 2, 10);
            break;
          case 1:
            _createY(num, 300, -1.5, 5, 0, 1, 2, 10);
            break;
          case 2:
            _createSin(num, 5, 0, 1, 2, 10);
            break;
          case 3:
            _createSin(num, 5, 720, 1, 2, 10);
            break;
        }
      }, time);

      function _createY(num, x, vx, vy, rotate, attack, health, score) {
        self.create(x, -40, vx, vy, 20, rotate, attack, health, score, 0);
        if (num > 0) {
          num--;
          setTimeout(function() {
            _createY(num, x, vx, vy, rotate, attack, health, score);
          }, 800);
        }
      }

      function _createSin(num, vy, rotate, attack, health, score) {
        self.create(0, -40, 0, vy, 20, rotate, attack, health, score, 1);
        if (num > 0) {
          num--;
          setTimeout(function() {
            _createSin(num, vy, rotate, attack, health, score);
          }, 200);
        }
      }
    }
  }
  this.create = function(x, y, vx, vy, radius, rotate, attack, health, score, type) {
    this.airplane.push({
      x: x,
      y: y,
      vx: vx,
      vy: vy,
      radius: radius,
      rotate: rotate,
      attack: attack,
      health: health,
      score: score,
      type: type
    });
  }
  this.move = function(airplane) {
    switch (airplane.type) {
      case 0:
        airplane.x += airplane.vx * data.system.time.delta * 0.01;
        airplane.y += airplane.vy * data.system.time.delta * 0.01;
        airplane.rotate += data.system.time.delta * 0.02;
        break;
      case 1:
        airplane.x = Math.sin(airplane.rotate * 0.1) * 150 + 200;
        airplane.y += airplane.vy * data.system.time.delta * 0.01;
        airplane.rotate += data.system.time.delta * 0.02;
        break;
    }
  }
  this.destroy = function() {
    for (var i = this.airplane.length - 1; i >= 0; i--) {
      if (this.airplane[i].health <= 0 || this.airplane[i].y > 620) {
        this.airplane.splice(i, 1);
      }
    }
  }
  this.draw = function(cxt) {
    for (var i = 0, len = this.airplane.length; i < len; i++) {
      this.move(this.airplane[i]);
      cxt.save();
      cxt.translate(this.airplane[i].x, this.airplane[i].y); //坐标原点位于飞机中心
      cxt.rotate(this.airplane[i].rotate * Math.PI / 180);
      cxt.drawImage(data.image, 100, 200, 60, 60, -30, -30, 40, 40);
      cxt.restore();
    }
  }
}

function Bullet() {
  this.bullet = [];

  this.init = function() {
    this.bullet = [];
  }
  this.create = function(x, y, vx, vy, attack, radius, type) {
    this.bullet.push({
      x: x,
      y: y,
      vx: vx,
      vy: vy,
      attack: attack,
      radius: radius,
      type: type
    });
  }
  this.move = function(bullet) {
    bullet.x += bullet.vx * data.system.time.delta * 0.01;
    bullet.y += bullet.vy * data.system.time.delta * 0.01;
  }
  this.destroy = function() {
    for (var i = this.bullet.length - 1; i >= 0; i--) {
      if (this.bullet[i].y < -10 || this.bullet[i].y > 610) {
        this.bullet.splice(i, 1);
      }
    }
  }
  this.draw = function(cxt) {
    for (var i = 0, len = this.bullet.length; i < len; i++) {
      this.move(this.bullet[i]);

      cxt.save();
      cxt.beginPath();
      cxt.fillStyle = '#fff';
      cxt.rect(this.bullet[i].x, this.bullet[i].y, 1, 4);
      cxt.fill();
      cxt.restore();
    }
  }
}

function Star() {
  this.star = [];
  this.setup;
  this.time;

  this.init = function() {
    var self = this;
    this.star = [];
    this.setup = false;

    for (var i = 0; i < 6; i++) {
      var x = Math.random() * 300 + 50,
        y = Math.random() * 600,
        size = Math.floor(Math.random() * 5 + 1),
        opacity = Math.random() * 0.25,
        type = Math.floor(Math.random() * 100) % 2,
        rotate = Math.PI / 180 * (Math.random() * 100 - 50);
      this.create(x, y, size, opacity, type, rotate);
    }
    this.time = setInterval(function() {
      self.setup = true;
    }, data.system.time.delta * 15);
  }
  this.position = [
    [1, 1],
    [2, 1]
  ]
  this.create = function(x, y, size, opacity, type, rotate) {
    this.star.push({
      x: x,
      y: y,
      size: size,
      opacity: opacity,
      type: type,
      rotate: rotate
    });
  }
  this.move = function(star) {
    star.y += data.system.time.delta * data.system.speedY * star.size * 0.2;
  }
  this.destroy = function() {
    for (var i = this.star.length - 1; i >= 0; i--) {
      if (this.star[i].y > 620) {
        this.star.splice(i, 1);
      }
    }
  }
  this.draw = function(cxt) {
    if (this.setup) {
      var x = Math.random() * 300 + 50,
        y = -Math.random() * 100,
        size = Math.random() * 5 + 1,
        opacity = Math.random() * 0.25,
        type = Math.floor(Math.random() * 100) % 2,
        rotate = Math.PI / 180 * (Math.random() * 100 - 50);
      this.create(x, y, size, opacity, type, rotate);
      this.setup = false;
    }
    for (var i = 0, len = this.star.length; i < len; i++) {
      this.move(this.star[i]);
      cxt.save();;
      switch (this.star[i].type) {
        case 0:
          _type0(this.star[i]);
          break;
        case 1:
          _type1(this.star[i]);
          break;
      }
      cxt.restore();
    }

    function _type0(star) {
      var size = star.size;
      cxt.fillStyle = 'rgba(255, 255, 255, ' + star.opacity + ')';
      cxt.beginPath();
      cxt.translate(star.x, star.y);
      cxt.arc(0, 0, size, 0, 2 * Math.PI);
      cxt.fill();
      cxt.beginPath();
      cxt.moveTo(-size * 3, 0);
      cxt.lineTo(0, size);
      cxt.lineTo(size * 3, 0);
      cxt.lineTo(0, -size);
      cxt.closePath();
      cxt.fill();
      cxt.beginPath();
      cxt.moveTo(0, size * 3);
      cxt.lineTo(size, 0);
      cxt.lineTo(0, -size * 3);
      cxt.lineTo(-size, 0);
      cxt.closePath();
      cxt.fill();
    }

    function _type1(star) {
      var size = star.size;
      cxt.fillStyle = 'rgba(255, 255, 255, ' + star.opacity + ')';
      cxt.strokeStyle = 'rgba(255, 255, 255, ' + star.opacity + ')';
      cxt.beginPath();
      cxt.translate(star.x, star.y);
      cxt.arc(0, 0, size * 2, 0, 2 * Math.PI);
      cxt.fill();
      cxt.beginPath();
      cxt.rotate(star.rotate);
      cxt.scale(1, 0.4);
      cxt.arc(0, 0, size * 4, 0, 2 * Math.PI);
      cxt.stroke();
      cxt.restore();
    }
  }
}

function drawBackground(cxt) {
  var gr = cxt.createRadialGradient(data.system.width / 2, 0, 0, data.system.width / 2, 0, data.system.height * 1.2);
  gr.addColorStop(0, '#084097');
  gr.addColorStop(0.8, '#120241');
  cxt.fillStyle = gr;
  cxt.fillRect(0, 0, data.system.width, data.system.height);
}

function killHostileAirplane() {
  var ele = data.element,
    blast = ele.blast,
    falcon = ele.millenniumFalcon,
    air = ele.hostileAirplane.airplane,
    bullet = ele.bullet.bullet;

  for (var i = bullet.length - 1; i >= 0; i--) {
    if (bullet[i].y < 0) {
      continue;
    }
    for (var j = air.length - 1; j >= 0; j--) {
      if (_distance(bullet[i].x, bullet[i].y, air[j].x, air[j].y, air[j].radius)) {
        air[j].health -= bullet[i].attack;
        blast.create(bullet[i].x, bullet[i].y, 5);
        if (air[j].health <= 0) {
          falcon.score += air[j].score;
          blast.create(air[j].x, air[j].y, 25);
          air.splice(j, 1);
        }
        bullet.splice(i, 1);
        break;
      }
    }
  }

  function _distance(x1, y1, x2, y2, radius) {
    return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) < radius * radius;
  }
}

function hurtMillenniumFalcon() {
  var ele = data.element,
    blast = ele.blast,
    falcon = ele.millenniumFalcon,
    air = ele.hostileAirplane.airplane;

  for (var i = air.length - 1; i >= 0; i--) {
    if (_distance(falcon.x, falcon.y, falcon.radius, air[i].x, air[i].y, air[i].radius)) {
      falcon.health -= air[i].attack;
      air[i].health -= falcon.attack.value;
      if (air[i].health <= 0) {
        falcon.score += air[i].score;
        blast.create(air[i].x, air[i].y, 25);
        air.splice(i, 1);
      }
      if (falcon.health <= 0) {
        falcon.die();
        blast.create(falcon.x, falcon.y, 50);
        gameover();
      }
    }
  }

  function _distance(x1, y1, radius1, x2, y2, radius2) {
    var radius = radius1 + radius2;
    return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) < radius * radius;
  }
}

function clearLimitsElement() {
  var ele = data.element;
  data.TIME = setInterval(function() {
    ele.bullet.destroy();
    ele.star.destroy();
  }, 5000);
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

function millenniumFalconMoveInMobile(e) {
  e.preventDefault();
  var left = canvas.getBoundingClientRect().left,
    top = canvas.getBoundingClientRect().top,
    cursorX = (e.touches[0].pageX - left) / data.system.scale,
    cursorY = (e.touches[0].pageY - top) / data.system.scale;
  var falcon = data.element.millenniumFalcon;
  falcon.targetInMobile.on = true;
  falcon.targetInMobile.x = parseInt(cursorX);
  falcon.targetInMobile.y = parseInt(cursorY);
}

function millenniumFalconMoveInMobileEnd(e) {
  e.preventDefault();
  var falcon = data.element.millenniumFalcon;
  falcon.targetInMobile.on = false;
}