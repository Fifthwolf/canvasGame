window.onload = function() {
  suitScreen(820, 600);
};

// 游戏
(function() {
  function Game() {

  }
  Game.prototype.init = function() {}
  window.Game = Game;
})();

// 球
(function() {
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
  }
  Ball.prototype.ballRun = function() {
    this.run = true;
    this.vy = -1;
  }
  Ball.prototype.move = function() {
    this.x = this.x + this.vx * this.data.delta * 0.2;
    this.y = this.y + this.vy * this.data.delta * 0.2;
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
  }
  Ball.prototype.correct = function(options) {
    if (options.left) {
      this.vx -= Math.random() * 0.5;
    }
    if (options.right) {
      this.vx += Math.random() * 0.5;
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
                j: j
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
                j: j
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
                j: j
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
                j: j
              });
              return;
            }
          }
          if (this.x > brickX1 && this.x < brickX2) {
            if (this.y >= brickY1 - this.r && this.y <= brickY2 + this.r) {
              this.collision({
                y: true,
                i: i,
                j: j
              });
              return;
            }
          }
          if (this.y > brickY1 && this.y < brickY2) {
            if (this.x >= brickX1 - this.r && this.x <= brickX2 + this.r) {
              this.collision({
                x: true,
                i: i,
                j: j
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
        baffleY2 = this.baffle.y + this.baffle.height;
      if (this.x <= baffleX1 && this.y <= baffleY1) {
        if ((baffleX1 - this.x) * (baffleX1 - this.x) + (baffleY1 - this.y) * (baffleY1 - this.y) <= (this.r * this.r)) {
          this.collision({
            y: true,
            direction: this.baffle.direction
          });
          return;
        }
      }
      if (this.x <= baffleX1 && this.y >= baffleY2) {
        if ((baffleX1 - this.x) * (baffleX1 - this.x) + (baffleY2 - this.y) * (baffleY2 - this.y) <= (this.r * this.r)) {
          this.collision({
            y: true,
            direction: this.baffle.direction
          });
          return;
        }
      }
      if (this.x >= baffleX2 && this.y <= baffleY1) {
        if ((baffleX2 - this.x) * (baffleX2 - this.x) + (baffleY1 - this.y) * (baffleY1 - this.y) <= (this.r * this.r)) {
          this.collision({
            y: true,
            direction: this.baffle.direction
          });
          return;
        }
      }
      if (this.x >= baffleX2 && this.y >= baffleY2) {
        if ((baffleX2 - this.x) * (baffleX2 - this.x) + (baffleY2 - this.y) * (baffleY2 - this.y) <= (this.r * this.r)) {
          this.collision({
            y: true,
            direction: this.baffle.direction
          });
          return;
        }
      }
      if (this.x > baffleX1 && this.x < baffleX2) {
        if (this.y >= baffleY1 - this.r && this.y <= baffleY2 + this.r) {
          this.collision({
            y: true,
            direction: this.baffle.direction
          });
          return;
        }
      }
      if (this.y > baffleY1 && this.y < baffleY2) {
        if (this.x >= baffleX1 - this.r && this.x <= baffleX2 + this.r) {
          this.collision({
            y: true,
            direction: this.baffle.direction
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
    this.judgeBrick();
    this.judgeBaffle();
    this.judgeWall();
  }
  window.Ball = Ball;
})();

// 砖块
(function() {
  const RangeArrange = {
    1: [
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
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    3: [
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
    this.arrange = RangeArrange[rank];
  }
  Brick.prototype.hurt = function(i, j) {
    this.arrange[i][j]--;
  }
  window.Brick = Brick;
})();

// 挡板
(function() {
  function Baffle() {
    this.x = 410;
    this.y = 500;
    this.width = 100;
    this.height = 10;
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
  }
  Baffle.prototype.init = function() {
    this.getData();
    document.addEventListener('keydown', this.moveStart, false);
    document.addEventListener('keyup', this.moveEnd, false);
  }
  Baffle.prototype.getData = function() {
    this.data = window.Data;
    this.control = window.Control;
  }
  Baffle.prototype.move = function() {
    if (this.direction.left == this.direction.right) {
      return;
    }
    if (this.direction.left) {
      this.x -= this.moveSpeed * this.data.delta;
    }
    if (this.direction.right) {
      this.x += this.moveSpeed * this.data.delta;
    }
    this.x = Math.max(this.width / 2, Math.min(this.control.canvas.width - this.width / 2, this.x));
  }
  window.Baffle = Baffle;
})();

// 信息
(function() {
  function Info(options) {
    this.score = options.score || 0;
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
    this.control = window.Control;
    this.launch = function() {
      this.control.ball.ballRun();
    }.bind(this);
    this.startGame = function() {
      canvas.removeEventListener('click', this.startGame);
      // 游戏开始
      this.control.info.InfoData({
        centerTextShow: false
      });
      this.control.brick = new Brick();
      this.control.brick.init(1);
      this.control.baffle = new Baffle();
      this.control.baffle.init();
      this.control.ball = new Ball();
      this.control.ball.init();
      canvas.addEventListener('click', this.launch, false);
    }.bind(this);
  }
  Logic.prototype.init = function() {
    canvas.addEventListener('click', this.startGame, false);
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
      this.baffle.move();
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
      this.cxt.fillStyle = '#f0f';
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
            this.cxt.fillStyle = '#ff0';
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
      this.cxt.fillStyle = '#0ff';
      this.cxt.translate(this.ball.x, this.ball.y);
      this.cxt.arc(0, 0, this.ball.r, 0, 2 * Math.PI);
      this.cxt.fill();
    }.bind(this));
  }
  Canvas.prototype.drawBaffle = function() {
    if (!this.baffle) {
      return;
    }
    this.drawSaveRestore(function() {
      this.cxt.fillStyle = '#f00';
      this.cxt.translate(this.baffle.x, this.baffle.y);
      this.cxt.fillRect(-this.baffle.width / 2, 0, this.baffle.width, this.baffle.height);
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
        this.cxt.font = '64px Microsoft YaHei';
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