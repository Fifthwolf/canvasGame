var data = {
  image: null,
  score: 0,
  bestScore: 0,
  system: {
    dataRefreshRate: 20, //数据刷新率
    start: false,
    fail: false,
    scale: 1,
    top: 0,
    width: 640,
    height: 480
  },
  element: {
    background: {
      show: true,
      draw: drawBackground
    },
  },
  TIME: {}
}

window.onload = function() {
  suitScreen();
  imageLoaded();
}

function imageLoaded() {
  var image = new Image();
  image.src = 'jump2D.png';
  image.onload = function() {
    loading.style.display = 'none';
    _setCanvasProperty();
    var cxt = canvas.getContext('2d');
    data.image = image;
    drawImage(cxt);
  }

  function _setCanvasProperty() {
    canvas.width = 640;
    canvas.height = 480;
  }
}

function drawImage(cxt) {
  var drawOrder = ['background'];
  data.TIME.drawImage = requestAnimationFrame(function animationDraw() {
    for (var i = 0, len = drawOrder.length; i < len; i++) {
      if (data.element[drawOrder[i]].show === true) {
        data.element[drawOrder[i]].draw(cxt);
      }
    }
    data.TIME.drawImage = requestAnimationFrame(animationDraw);
  });
}

function drawBackground(cxt) {
  cxt.drawImage(data.image, 0, 0, 288, 512, 0, 0, 640, 480);
}