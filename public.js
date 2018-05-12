Element.prototype['$'] = function(tag) {
  return $(tag, this);
}

var loading = $('#loading'),
  canvas = $('#canvas');

function suitScreen(canvasWidth, canvasHeight) {
  var WindowWidth = document.documentElement.clientWidth,
    WindowHeight = document.documentElement.clientHeight;
  var scale;
  if (WindowHeight / WindowWidth > canvasHeight / canvasWidth) {
    scale = WindowWidth / canvasWidth - 0.1;
  } else {
    scale = WindowHeight / canvasHeight - 0.1;
  }
  try {
    data.system.scale = scale;
  } catch (e) {
    //ignore
  }
  var top = (WindowHeight - canvasHeight) / scale / 2,
    left = (WindowWidth - canvasWidth) / scale / 2;
  try {
    data.system.top = top;
  } catch (e) {
    //ignore
  }
  canvas.style.transform = 'scale(' + scale + ', ' + scale + ') translateY(' + top + 'px)';
  return scale;
}

function addEvent(element, type, handler) {
  if (element.addEventListener) {
    element.addEventListener(type, handler, false);
  } else if (element.attachEvent) {
    element.attachEvent('on' + type, handler);
  } else {
    element['on' + type] = handler;
  }
}

function removeEvent(element, type, handler) {
  if (element.removeEventListener) {
    element.removeEventListener(type, handler, false);
  } else if (element.detachEvent) {
    element.detachEvent('on' + type, handler);
  } else {
    element['on' + type] = null;
  }
}

function setCookie(name, value, time) {
  var Minutes = time;
  var exp = new Date();
  exp.setTime(exp.getTime() + Minutes * 60 * 1000);
  document.cookie = name + "=" + decodeURI(value) + ";expires=" + exp.toGMTString();
}

function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  arr = document.cookie.match(reg);
  if (arr = document.cookie.match(reg)) {
    return decodeURIComponent(arr[2]);
  } else {
    return null;
  }
}

function $(tag, parent) {
  var tags = tag.split(' '),
    parent = parent || document,
    ele;
  for (var i = 0, len = tags.length; i < len; i++) {
    if (/^#[\w-_]+/.test(tags[i])) {
      ele = parent.getElementById(tags[i].slice(1));
    } else if (/^\.[\w-_]+/.test(tags[i])) {
      if (tags[i].match(/^\.([\w-_]+)\.(\d+)/)) {
        ele = parent.getElementsByClassName(RegExp.$1)[RegExp.$2];
      } else {
        ele = parent.getElementsByClassName(tags[i].slice(1));
      }
    } else {
      if (tags[i].match(/^([\w-_]+)\.(\d+)/)) {
        ele = parent.getElementsByTagName(RegExp.$1)[RegExp.$2];
      } else {
        ele = parent.getElementsByTagName(tags[i]);
      }
    }
    parent = ele;
  }
  return ele;
}