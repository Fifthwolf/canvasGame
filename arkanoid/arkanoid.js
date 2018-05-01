window.onload = function() {
  suitScreen(800, 600);
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
    this.vx;
    this.vy;
  }
  Ball.prototype.init = function() {
    this.x = 400;
    this.y = 500;
    this.vx = 0;
    this.vy = 0;
  }
  window.Ball = Ball;
})();

// 砖块
(function() {
  function Brick() {
    this.x;
    this.y;
    this.type;
  }
  Brick.prototype.init = function() {
    this.x;
    this.y;
  }
  window.Brick = Brick;
})();

// 挡板
(function() {
  function Baffle() {
    this.x = 400;
    this.y = 500;
    this.width = 80;
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
    this.startGame = function() {
      canvas.removeEventListener('click', this.startGame);
      // 游戏开始
      this.control.info.InfoData({
        centerTextShow: false
      });
      this.control.baffle = new Baffle();
      this.control.baffle.init();
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
  }
  Canvas.prototype.drawBackground = function() {
    var gr = this.cxt.createRadialGradient(this.width / 2, 0, this.height / 2, this.width / 2, 0, this.width);
    gr.addColorStop(0, '#0071ca');
    gr.addColorStop(0.8, '#01062c');
    this.cxt.fillStyle = gr;
    this.cxt.fillRect(0, 0, this.width, this.height);
  }
  Canvas.prototype.drawBrick = function() {

  }
  Canvas.prototype.drawBall = function() {

  }
  Canvas.prototype.drawBaffle = function() {
    if (!this.baffle) {
      return;
    }
    this.cxt.save();
    this.cxt.fillStyle = '#f00';
    this.cxt.translate(this.baffle.x, this.baffle.y);
    this.cxt.fillRect(-this.baffle.width / 2, 0, this.baffle.width, this.baffle.height);
    this.cxt.restore();
  }
  Canvas.prototype.drawInfo = function() {
    this.score = function() {
      this.cxt.save();
      this.cxt.fillStyle = '#fff';
      this.cxt.font = '20px Microsoft YaHei';
      this.cxt.textAlign = 'left';
      this.cxt.fillText('SCORE: ' + this.info.score, 40, 40);
      this.cxt.restore();
    }
    this.centerText = function() {
      this.cxt.save();
      this.cxt.fillStyle = '#fff';
      this.cxt.font = '64px Microsoft YaHei';
      this.cxt.textAlign = 'center';
      this.cxt.textBaseline = 'middle';
      this.cxt.fillText(this.info.centerText, 400, 300);
      this.cxt.restore();
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
        width: 800,
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