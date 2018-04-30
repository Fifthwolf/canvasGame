window.onload = function() {
  suitScreen();
  // imageLoaded();
};

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

//砖块
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
    this.width = options.width || 800;
    this.height = options.height || 600;
    /*
    this.drawBackground = function() {
      console.log(1)
    }
    this.drawBrick = function() {}
    this.drawBall = function() {}
    this.drawInfo = function() {}
    
    this.draw = function() {
      this.drawBackground();
      this.drawBrick();
      this.drawBall();
      this.drawInfo();
      requestAnimationFrame(this.draw);
    }*/
  }
  Canvas.prototype.init = function() {
    this.draw();
  }
  Canvas.prototype.drawBackground = function() {
    
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
      system.cxt = canvas.getContext('2d');
      system.image = image;
      data.timePrevious = Date.now();
      this.initData();
      this.canvas = new window.Canvas({
        width: 800,
        height: 600,
      });
      this.canvas.init();
    },
    initData: function() {
      console.log('init');
    },
  };

  window.System = system;
  window.Control = control;
  window.Data = data;

  control.init();
})();