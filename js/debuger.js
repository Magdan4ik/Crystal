"use strict";

function countBody() {
  var b = document.querySelector('body'),
      container = document.createElement("div"),
      m = document.createElement("div");
  container.classList.add('container');
  container.innerHTML = "<div class=\"debuger-lines\"></div>";
  b.style.setProperty('--body-height', b.clientHeight + 'px');

  m.classList.add('_media')
  m.innerHTML="<i></i><i></i><i></i><i></i>"
  if (!document.querySelector('._media')) b.prepend(m);
  if (!document.querySelector('.debuger-lines')) b.prepend(container);
};

function showWindowSize() {
  var b = document.querySelector('body'),
      board = document.createElement("div"),
      w = window.innerWidth;
  board.style.display = 'none';
  board.innerHTML = "<div class=\"debuger-size-inner\"><i></i><span></span><i></i></div>";
  board.classList.add('debuger-size');

  if (!document.querySelector('.debuger-size')) {
    b.append(board);
  };
  
  document.querySelector('.debuger-size-inner span').innerHTML = w;
  document.querySelector('.debuger-size').style.display = 'block';
  board.addEventListener('click', function () {
    this.style.setProperty('display', 'none');
  });
};


window.addEventListener('load', countBody);
window.addEventListener('resize', countBody);
window.addEventListener('resize', showWindowSize);