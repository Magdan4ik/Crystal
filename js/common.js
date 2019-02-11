"use strict";
window.addEventListener('DOMContentLoaded',
  function () {
    // stare bzdo.. nechipaite
  }
);





window.addEventListener('load', () => {

    const d = document;
    const w = window;


     /* OnePage Scroll */
    (function(){
      const video = d.getElementById('h-video');
      const home = d.querySelector('.home');
      if(home)
        onePageScroll(".home", {
          pagination: false,
          animationTime: 1500,
          footer: "footer",
          delay: 500,
          afterMove: (index, section) => {
            (section.querySelector('#h-video'))? video.play() : video.pause()
            // (index == 4)?  : video.pause() <<<check by index - bad solution
          }
        });
    }());

    /* Brands init slider */
    (function(){
      const brandsSlider = d.querySelector('.h-brands__slider');
      if(brandsSlider)
        new Glide('.glide', {
          type: 'carousel',
          focusAt: 'center',
          perView: 3
        }).mount()
    }());

    /*Insta */
    (function(){
      const instafeed = d.getElementById('instafeed');
      if(instafeed) {
        fetch('https://api.instagram.com/v1/users/self/media/recent/?access_token=1820676164.1677ed0.87c8ed8be5fc4beab54d7a7b7d27633d&count=6')
        .then(res => res.json())
        .then(res => {
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
                      instafeed.appendChild(li);
              });
        })
        .catch(err => console.error('Insta Error:', err));
      }
    }());

    /* Catalog filter toggle */
    (function(){
      const btn = d.querySelector('.filter__toggle');
      const filter = d.querySelector('.filter');
      const form  = d.getElementById('filterForm');
      const input = form.querySelectorAll('input[type="checkbox"]');
      const reset = form.querySelector('.filter__reset');

      if(filter) {
        form.addEventListener('change', activeFilter);
        reset.addEventListener('click', () => setInterval(activeFilter, 50));
        btn.addEventListener('click', toggleFilter);

        function activeFilter(res) {
          input.forEach(el => {
            if(el.checked) res = true;
          });
          (res === true)? btn.dataset.dot = res : btn.dataset.dot = false;
        }
        activeFilter();

        function toggleFilter() {
          filter.classList.toggle('filter--visible');
        }
      };

    }());
});