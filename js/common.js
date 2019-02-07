"use strict";
window.addEventListener('DOMContentLoaded',
  function () {
    // stare bzdo.. nechipaite
  }
);





window.addEventListener('load', function () {

    const d = document;
    const w = window;


     /* OnePage Scroll */
    (function(){
      const video = d.getElementById('h-video');
      onePageScroll(".home", {
        pagination: false,
        animationTime: 1500,
        footer: "footer",
        delay: 500,
        afterMove: index => (index == 4)? video.play() : video.pause()
      });
    }());

    /* Brands init slider */
    (function(){
      new Glide('.glide', {
        type: 'carousel',
        focusAt: 'center',
        perView: 3
      }).mount()
    }());

    /*Insta */
    (function(){
      fetch('https://api.instagram.com/v1/users/self/media/recent/?access_token=1820676164.1677ed0.87c8ed8be5fc4beab54d7a7b7d27633d&count=6')
      .then(res => res.json())
      .then(res => {
          const ul = d.getElementById('instafeed');
          if(ul) {
            res.data.forEach(el => {
                let img     = d.createElement('img');
                let li      = d.createElement('li');
                let link    = d.createElement('a');
                    li.className = "instafeed__item";
                    img.src = el.images.low_resolution.url;
                    link.href = el.link;
                    link.target = '_blank';
                    link.appendChild(img);
                    li.appendChild(link);
                    ul.appendChild(li);
            });
          }
      })
      .catch(err => console.error('Insta Error:', err));
    }());

});