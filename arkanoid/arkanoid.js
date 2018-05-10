window.onload = function() {
  window.System.scale = suitScreen(820, 600);
};

// 球
(function() {
  const maxVelocity = 3,
    minVy = 0.5;

  function Ball() {
    this.x;
    this.y;
    this.r;
    this.vx;
    this.vy;
    this.run = false;
  }
  Ball.prototype.init = function(options) {
    this.getData();
    var options = options || {};
    this.x = options.x || 410;
    this.y = options.y || 490;
    this.r = options.r || 10;
    this.vx = options.vx || 0;
    this.vy = options.vy || 0;
  }
  Ball.prototype.getData = function() {
    this.data = window.Data;
    this.canvas = window.Control.canvas;
    this.brick = window.Control.brick;
    this.baffle = window.Control.baffle;
    this.info = window.Control.info;
    this.logic = window.Control.logic;
  }
  Ball.prototype.ballRun = function() {
    this.run = true;
    this.vy = -1;
  }
  Ball.prototype.move = function() {
    this.x = this.x + this.vx * this.data.delta * 0.2;
    this.y = this.y + this.vy * this.data.delta * 0.2;
    this.speedLimit();
  }
  Ball.prototype.translation = function(value) {
    this.x += value;
    this.speedLimit();
  }
  Ball.prototype.speedLimit = function() {
    let velocitySquared = this.vx * this.vx + this.vy * this.vy,
      maxVelocitySquared = maxVelocity * maxVelocity;
    if (velocitySquared <= maxVelocitySquared) {
      return;
    }
    let k = Math.sqrt(velocitySquared / maxVelocitySquared);
    this.vx /= k;
    this.vy /= k;
    if (Math.abs(this.vy) < minVy) {
      let maxVx = Math.sqrt(maxVelocitySquared - minVy * minVy)
      this.vy = this.vy > 0 ? minVy : -minVy;
      if (Math.abs(this.vx) > maxVx) {
        this.vx = this.vx > 0 ? maxVx : -maxVx;
      }
    }
  }
  Ball.prototype.collision = function(options) {
    var options = options || {};
    if (options.x) {
      this.vx = -this.vx;
      this.x = this.x + this.vx;
    }
    if (options.y) {
      this.vy = -this.vy;
      this.y = this.y + this.vy;
    }
    if (options.i !== undefined) {
      this.brick.hurt(options.i, options.j);
    }
    if (options.direction !== undefined) {
      this.correct(options.direction);
    }
    if (options.score !== undefined) {
      this.info.addScore(options.score);
    }
    if (this.brick.health <= 0) {
      this.run = false;
      this.logic.gameWin();
    }
  }
  Ball.prototype.correct = function(options) {
    if (options.left) {
      this.vx -= Math.random() * 2;
    } else if (options.right) {
      this.vx += Math.random() * 2;
    } else {
      this.vx += Math.random() - 0.5;
    }
  }
  Ball.prototype.judge = function() {
    this.judgeBrick = function() {
      var arrange = this.brick.arrange;
      for (var i = 0, leni = arrange.length; i < leni; i++) {
        for (var j = 0, lenj = arrange[i].length; j < lenj; j++) {
          if (arrange[i][j] === 0) {
            continue;
          }
          var brickX1 = j * this.brick.width + 10,
            brickX2 = j * this.brick.width + this.brick.width + 10,
            brickY1 = i * this.brick.height + 10,
            brickY2 = i * this.brick.height + this.brick.height + 10;
          if (this.x <= brickX1 && this.y <= brickY1) {
            if ((brickX1 - this.x) * (brickX1 - this.x) + (brickY1 - this.y) * (brickY1 - this.y) <= (this.r * this.r)) {
              this.collision({
                x: true,
                y: true,
                i: i,
                j: j,
                score: arrange[i][j] * 10
              });
              return;
            }
          }
          if (this.x <= brickX1 && this.y >= brickY2) {
            if ((brickX1 - this.x) * (brickX1 - this.x) + (brickY2 - this.y) * (brickY2 - this.y) <= (this.r * this.r)) {
              this.collision({
                x: true,
                y: true,
                i: i,
                j: j,
                score: arrange[i][j] * 10
              });
              return;
            }
          }
          if (this.x >= brickX2 && this.y <= brickY1) {
            if ((brickX2 - this.x) * (brickX2 - this.x) + (brickY1 - this.y) * (brickY1 - this.y) <= (this.r * this.r)) {
              this.collision({
                x: true,
                y: true,
                i: i,
                j: j,
                score: arrange[i][j] * 10
              });
              return;
            }
          }
          if (this.x >= brickX2 && this.y >= brickY2) {
            if ((brickX2 - this.x) * (brickX2 - this.x) + (brickY2 - this.y) * (brickY2 - this.y) <= (this.r * this.r)) {
              this.collision({
                x: true,
                y: true,
                i: i,
                j: j,
                score: arrange[i][j] * 10
              });
              return;
            }
          }
          if (this.x > brickX1 && this.x < brickX2) {
            if (this.y >= brickY1 - this.r && this.y <= brickY2 + this.r) {
              this.collision({
                y: true,
                i: i,
                j: j,
                score: arrange[i][j] * 10
              });
              return;
            }
          }
          if (this.y > brickY1 && this.y < brickY2) {
            if (this.x >= brickX1 - this.r && this.x <= brickX2 + this.r) {
              this.collision({
                x: true,
                i: i,
                j: j,
                score: arrange[i][j] * 10
              });
              return;
            }
          }
        }
      }
    }
    this.judgeBaffle = function() {
      var baffleX1 = this.baffle.x - this.baffle.width / 2,
        baffleX2 = this.baffle.x + this.baffle.width / 2,
        baffleY1 = this.baffle.y,
        baffleY2 = this.baffle.y + this.baffle.height,
        direction = this.baffle.direction;
      if (this.x >= baffleX1 - this.r && this.x <= baffleX2 + this.r) {
        if (this.y >= baffleY1 - this.r && this.y < baffleY2 - this.r) {
          this.collision({
            y: true,
            direction: direction
          });
          return;
        }
      }
      if (this.y > baffleY1 - this.r && this.y < baffleY2 + this.r / 2) {
        if (this.x >= baffleX1 - this.r && this.x <= baffleX2 - this.baffle.width / 2) {
          this.collision({
            x: true,
            direction: direction
          });
          return;
        }
        if (this.x <= baffleX2 + this.r && this.x >= baffleX1 + this.baffle.width / 2) {
          this.collision({
            x: true,
            direction: direction
          });
          return;
        }
      }
    }
    this.judgeWall = function() {
      if (this.x - this.r <= 10) {
        this.collision({
          x: true,
        });
        return;
      }
      if (this.x + this.r >= this.canvas.width - 10) {
        this.collision({
          x: true,
        });
        return;
      }
      if (this.y - this.r <= 10) {
        this.collision({
          y: true,
        });
        return;
      }
    }
    this.judgeFail = function() {
      if (this.y > this.canvas.height + this.r) {
        this.run = false;
        this.logic.gameOver();
      }
    }
    this.judgeBrick();
    this.judgeBaffle();
    this.judgeWall();
    this.judgeFail();
  }
  window.Ball = Ball;
})();

// 砖块
(function() {
  const RangeArrange = {
    0: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    2: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 1]
    ],
    1: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0, 0, 0]
    ]
  };

  function Brick() {
    this.width = 80;
    this.height = 30;
    this.arrange;
  }
  Brick.prototype.init = function(rank) {
    this.health = 0;
    this.arrange = RangeArrange[rank];
    for (let i = 0, leni = this.arrange.length; i < leni; i++) {
      for (let j = 0, lenj = this.arrange[i].length; j < lenj; j++) {
        this.health += this.arrange[i][j];
      }
    }
  }
  Brick.prototype.hurt = function(i, j) {
    this.arrange[i][j]--;
    this.health--;
  }
  window.Brick = Brick;
})();

// 奖励品
(function() {
  function Reward() {

  }
  Reward.prototype.init = function() {}
  window.Reward = Reward;
})();

// 挡板
(function() {
  function Baffle() {
    this.x = 410;
    this.y = 500;
    this.width = 100;
    this.height = 15;
    this.moveSpeed = 1;
    this.direction = {
      left: false,
      right: false
    };
    this.moveStart = function(e) {
      var e = e || window.e || arguments.callee.caller.arguments[0];
      switch (e && e.keyCode) {
        case 65:
          this.direction.left = true;
          break;
        case 68:
          this.direction.right = true;
          break;
      }
    }.bind(this);
    this.moveEnd = function(e) {
      var e = e || window.e || arguments.callee.caller.arguments[0];
      switch (e && e.keyCode) {
        case 65:
          this.direction.left = false;
          break;
        case 68:
          this.direction.right = false;
          break;
      }
    }.bind(this);
    this.moblieMoveStart = function(e) {
      e.preventDefault();
      var left = canvas.getBoundingClientRect().left,
        cursorX = (e.touches[0].pageX - left) / this.system.scale;
      var previous = this.x;
      this.x = parseInt(cursorX);
      this.move(previous);
    }.bind(this);
    this.moblieMoveEnd = function(e) {
      e.preventDefault();
    }.bind(this);
  }
  Baffle.prototype.init = function() {
    this.getData();
    document.addEventListener('keydown', this.moveStart, false);
    document.addEventListener('keyup', this.moveEnd, false);
    if (this.system.mobile) {
      canvas.addEventListener('touchstart', this.moblieMoveStart, false);
      canvas.addEventListener('touchmove', this.moblieMoveStart, false);
      canvas.addEventListener('touchend', this.moblieMoveEnd, false);
    }
  }
  Baffle.prototype.getData = function() {
    this.data = window.Data;
    this.system = window.System;
    this.control = window.Control;
  }
  Baffle.prototype.keyboardMove = function() {
    if (this.direction.left == this.direction.right) {
      return;
    }
    var distance = this.moveSpeed * this.data.delta;
    if (this.direction.left) {
      distance = -distance;
    }
    var previous = this.x;
    this.x += distance;
    this.move(previous);
  }
  Baffle.prototype.move = function(previous) {
    this.x = Math.max(this.width / 2, Math.min(this.control.canvas.width - this.width / 2, this.x));
    if (!this.control.ball.run) {
      this.control.ball.translation(this.x - previous);
    }
  }

  window.Baffle = Baffle;
})();

// 信息
(function() {
  function Info(options) {
    this.score = options.score || 0;
    this.centerTextFontSize = options.centerTextFontSize || 64;
    this.centerTextShow = options.centerTextShow || false;
    this.centerText = options.centerText || '';
    this.show = options.show || false;
  }
  Info.prototype.init = function() {

  }
  Info.prototype.InfoData = function(options) {
    for (var property in options) {
      this[property] = options[property];
    }
  }
  Info.prototype.addScore = function(value) {
    this.score += value;
  }
  window.Info = Info;
})();

// 控制
(function() {
  function Logic() {
    this.init();
    this.pass = 1;

    this.launch = function() {
      canvas.removeEventListener('click', this.launch);
      this.control.ball.ballRun();
    }.bind(this);

    this.startGame = function(e, pass) {
      canvas.removeEventListener('click', this.startGame);
      // 游戏开始
      this.control.info.InfoData({
        score: 0,
        centerTextShow: false
      });
      this.control.brick = new Brick();
      this.control.brick.init(this.pass);
      this.control.baffle = new Baffle();
      this.control.baffle.init();
      this.control.ball = new Ball();
      this.control.ball.init();
      canvas.addEventListener('click', this.launch, false);
    }.bind(this);
  }
  Logic.prototype.init = function() {
    this.control = window.Control;
    canvas.addEventListener('click', this.startGame, false);
  }
  Logic.prototype.gameWin = function() {
    let score = window.Control.info.score;
    this.pass++;
    window.Control.info = new window.Info({
      score: score,
      centerTextShow: true,
      centerTextFontSize: 48,
      centerText: '恭喜成功过关，点击进入第' + this.pass + '关',
      show: true
    });
    canvas.addEventListener('click', this.startGame, false);
  }
  Logic.prototype.gameOver = function() {
    let score = window.Control.info.score;
    window.Control.info = new window.Info({
      score: score,
      centerTextShow: true,
      centerTextFontSize: 32,
      centerText: '游戏结束，得分' + score + '分，单击以重新开始游戏',
      show: true
    });
    this.init();
  }
  window.Logic = Logic;
})();

// 绘制
(function() {
  function Canvas(options) {
    this.canvas = options.canvas;
    this.width = options.width;
    this.height = options.height;
    this.cxt = canvas.getContext('2d');
  }
  Canvas.prototype.init = function() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.draw();
  }
  Canvas.prototype.getData = function() {
    this.image = System.image;
    this.info = Control.info;
    this.baffle = Control.baffle;
    this.brick = Control.brick;
    this.ball = Control.ball;
  }
  Canvas.prototype.setData = function() {
    this.time = function() {
      this.data = window.Data;
      this.now = Date.now();
      this.data.delta = Math.min(50, this.now - this.data.timePrevious);
      this.data.timePrevious = this.now;
    }
    this.time();
    if (this.baffle) {
      this.baffle.keyboardMove();
    }
    if (this.ball && this.ball.run) {
      this.ball.move();
      this.ball.judge();
    }
  }
  Canvas.prototype.drawSaveRestore = function(fn) {
    this.cxt.save();
    fn();
    this.cxt.restore();
  }
  Canvas.prototype.drawBackground = function() {
    var gr = this.cxt.createRadialGradient(this.width / 2, 0, this.height / 2, this.width / 2, 0, this.width);
    gr.addColorStop(0, '#0071ca');
    gr.addColorStop(0.8, '#01062c');
    this.drawSaveRestore(function() {
      this.cxt.fillStyle = gr;
      this.cxt.fillRect(0, 0, this.width, this.height);
    }.bind(this));
  }
  Canvas.prototype.drawWall = function() {
    this.drawSaveRestore(function() {
      this.cxt.fillStyle = '#444';
      this.cxt.fillRect(0, 0, 10, this.height);
      this.cxt.fillRect(0, 0, this.width, 10);
      this.cxt.fillRect(this.width - 10, 0, 10, this.height);
    }.bind(this));
  }
  Canvas.prototype.drawBrick = function() {
    if (!this.brick) {
      return;
    }
    var brick = this.brick,
      arrange = brick.arrange;
    for (var i = 0, leni = arrange.length; i < leni; i++) {
      for (var j = 0, lenj = arrange[i].length; j < lenj; j++) {
        if (arrange[i][j] >= 1) {
          this.drawSaveRestore(function() {
            switch (arrange[i][j]) {
              case 1:
                this.cxt.fillStyle = '#f00';
                break;
              case 2:
                this.cxt.fillStyle = '#0f0';
                break;
              case 3:
                this.cxt.fillStyle = '#00f';
                break;
              case 4:
                this.cxt.fillStyle = '#333';
                break;
              case 5:
                this.cxt.fillStyle = '#ff0';
                break;
              case 6:
                this.cxt.fillStyle = '#f0f';
                break;
              case 7:
                this.cxt.fillStyle = '#0ff';
                break;
              case 8:
                this.cxt.fillStyle = '#fff';
                break;
              default:
                this.cxt.fillStyle = '#ccc';
            }
            this.cxt.translate(j * brick.width + brick.width / 2, i * brick.height + 10);
            this.cxt.fillRect(-brick.height, 0, brick.width, brick.height);
            this.cxt.strokeRect(-brick.height, 0, brick.width, brick.height);
          }.bind(this));
        }
      }
    }
  }
  Canvas.prototype.drawBall = function() {
    if (!this.ball) {
      return;
    }
    this.drawSaveRestore(function() {
      this.cxt.beginPath();
      this.cxt.translate(this.ball.x, this.ball.y);
      var gr = this.cxt.createRadialGradient(0, 0, this.ball.r / 3, 0, 0, this.ball.r);
      gr.addColorStop(0, '#fff');
      gr.addColorStop(1, '#555');
      this.cxt.fillStyle = gr;
      this.cxt.arc(0, 0, this.ball.r, 0, 2 * Math.PI);
      this.cxt.fill();
    }.bind(this));
  }
  Canvas.prototype.drawBaffle = function() {
    if (!this.baffle) {
      return;
    }
    this.drawSaveRestore(function() {
      this.cxt.translate(this.baffle.x, this.baffle.y);
      this.cxt.drawImage(this.image, 0, 0, this.baffle.width / this.baffle.height * 30, 30, -this.baffle.width / 2, 0, this.baffle.width, this.baffle.height);
      this.cxt.beginPath();
      this.cxt.strokeStyle = '#000';
      this.cxt.strokeRect(-this.baffle.width / 2, 0, this.baffle.width, this.baffle.height)
      this.cxt.fill();
    }.bind(this));
  }
  Canvas.prototype.drawInfo = function() {
    this.score = function() {
      this.drawSaveRestore(function() {
        this.cxt.fillStyle = '#fff';
        this.cxt.font = '20px Microsoft YaHei';
        this.cxt.textAlign = 'left';
        this.cxt.fillText('SCORE: ' + this.info.score, 25, 575);
      }.bind(this));
    }
    this.centerText = function() {
      this.drawSaveRestore(function() {
        this.cxt.fillStyle = '#fff';
        this.cxt.font = this.info.centerTextFontSize + 'px Microsoft YaHei';
        this.cxt.textAlign = 'center';
        this.cxt.textBaseline = 'middle';
        this.cxt.fillText(this.info.centerText, 400, 300);
      }.bind(this));
    }
    this.score();
    if (this.info.centerTextShow) {
      this.centerText();
    }
  }
  Canvas.prototype.draw = function() {
    this.getData();
    this.setData();
    this.drawBackground();
    this.drawWall();
    this.drawBrick();
    this.drawBall();
    this.drawBaffle();
    this.drawInfo();
    requestAnimationFrame(this.draw.bind(this));
  }

  window.Canvas = Canvas;
})();

// 整体
(function() {
  var system = {},
    data = {};

  var control = {
    init: function() {
      this.initCanvas();
      system.mobile = /Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent) ? true : false;
    },
    initCanvas: function() {
      var image = new Image();
      image.src = 'arkanoid.png';
      image.addEventListener('load', function() {
        this.imageOnload(image);
      }.bind(this));
    },
    imageOnload: function(image) {
      loading.style.display = 'none'; // 读取中提示信息
      system.image = image;
      this.initData();
      this.canvas = new window.Canvas({
        canvas: canvas,
        width: 820,
        height: 600,
      });
      this.canvas.init();
    },
    initData: function() {
      this.logic = new window.Logic();
      this.logic.init();
      this.info = new window.Info({
        score: 0,
        centerTextShow: true,
        centerText: '点击开始游戏'
      });
      this.info.init();
    },
  };

  window.System = system;
  window.Control = control;
  window.Data = data;

  control.init();
})();