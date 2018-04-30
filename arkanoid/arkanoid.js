window.onload = function() {
  suitScreen(800, 600);
};

// 欢迎界面
(function() {
  function Welcome(options) {
    this.show = options.show || false;
  }
  Welcome.prototype.init = function() {
    
  }
  window.Welcome = Welcome;
})();

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
  Canvas.prototype.drawInfo = function() {

  }
  Canvas.prototype.draw = function() {
    this.drawBackground();
    this.drawBrick();
    this.drawBall();
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
      this.welcome = new window.Welcome({
        show: true
      });
      this.welcome.init();
    },
  };

  window.System = system;
  window.Control = control;
  window.Data = data;

  control.init();
})();