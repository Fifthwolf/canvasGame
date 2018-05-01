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

// 砖块
(function() {
  function Baffle() {
    this.x;
    this.y;
  }
  Baffle.prototype.init = function() {
    this.x;
    this.y;
  }
  window.Baffle = Baffle;
})();

// 信息
(function() {
  function Info(options) {
    this.score = options.score || 0;
    this.centerText = options.centerText || '';
    this.show = options.show || false;
  }
  Info.prototype.init = function() {

  }
  Info.prototype.addScore = function(value) {
    this.score += value;
  }
  window.Info = Info;
})();

// 控制
(function() {
  function Logic() {
    var self = this;
    this.startGame = function() {
      canvas.removeEventListener('click', self.startGame);
    }
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
    this.getData();
    this.draw();
  }
  Canvas.prototype.getData = function() {
    this.info = Control.info;
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
    this.centerTip = function() {
      this.cxt.save();
      this.cxt.fillStyle = '#fff';
      this.cxt.font = '64px Microsoft YaHei';
      this.cxt.textAlign = 'center';
      this.cxt.textBaseline = 'middle';
      this.cxt.fillText(this.info.centerText, 400, 300);
      this.cxt.restore();
    }
    this.score();
    this.centerTip();
  }
  Canvas.prototype.draw = function() {
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
      data.timePrevious = Date.now();
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