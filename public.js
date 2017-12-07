function addEvent (element, type, handler) {
  if (element.addEventListener) {
    element.addEventListener(type, handler, false);
  } else if (element.attachEvent) {  
    element.attachEvent('on' + type, handler);
  } else {  
    element['on' + type] = handler;
  }  
}

function removeEvent (element, type, handler) {
  if (element.removeEventListener) {
    element.removeEventListener(type, handler, false);
  } else if (element.detachEvent) {
    element.detachEvent('on' + type, handler); 
  } else {
    element['on' + type] = null;
  }
}

function setCookie (name, value, time) {
  var Minutes = time;
  var exp = new Date();
  exp.setTime(exp.getTime() + Minutes * 60 * 1000);
  document.cookie = name + "=" + decodeURI(value) + ";expires=" + exp.toGMTString();
}

function getCookie (name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  arr = document.cookie.match(reg);
  if (arr = document.cookie.match(reg)) {
    return decodeURIComponent(arr[2]);
  } else {
    return null;
  }
}
