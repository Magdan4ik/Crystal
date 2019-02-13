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
      const filter = d.querySelector('.filter');
      if(filter) {
        const btn = d.querySelector('.filter__toggle');
        const form  = d.getElementById('filterForm');
        const input = form.querySelectorAll('input[type="checkbox"]');
        const reset = form.querySelector('.filter__reset');

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

    /* Order form */
    (function(){
      const order = d.querySelector('.order');
      if(order) {
        vanillacalendar.init(); /*init calendar */

        const form   = d.querySelector('.order__form form');
        const time   = d.querySelectorAll('.order__timelist li');
        const timeL  = d.querySelector('.order__time-label');
        const timeS  = d.querySelector('.order__time--selected');
        const mBtn   = d.querySelectorAll('.cal__btn');
        let   date   = d.querySelectorAll('.cal__date--active');

        const inputs = {
          time:  form.querySelector('input[name="time"]'),
          date:  form.querySelector('input[name="date"]'),
          tel:   form.querySelector('input[name="tel"]'),
          wdate: form.querySelector('input[name="wedding"]')
        }
        const defDate = {
          date: d.querySelector('.cal__date--today').dataset.calendarDate,
          time: d.querySelector('.order__time--selected').textContent
        }

        mBtn.forEach(el=> {
          el.addEventListener('click', () => {
              date = d.querySelectorAll('.cal__date--active');
              liveDate();
          });
        });

        time.forEach(el => {
          el.addEventListener('click', e => {
            e.preventDefault();
            time.forEach(el => el.classList.remove('order__time--selected'));
            el.classList.add('order__time--selected');
            timeL.style.top = el.offsetTop + "px";
            saveDate(null, el.textContent);
          });
        });
        timeL.style.top = timeS.offsetTop + "px"; //Default

        function liveDate() {
          date.forEach(el => {
            el.addEventListener('click', () => {
              saveDate(el.dataset.calendarDate, null);
            });
          });
        }
        liveDate();


        function saveDate(date, time) {
          if(time) inputs.time.value = time;
          if(date) inputs.date.value = date;
        }
        saveDate(defDate.date, defDate.time); //Default

        /* Inputs mask */
        const telOptions = {
          mask: '+{38}(000)000-00-00'
        };
        const wdateOptions = {
          mask: Date,
          min: new Date(2019, 0, 0),
          lazy: false
        };

        const telMask   = new IMask(inputs.tel, telOptions);
        const wdateMask = new IMask(inputs.wdate, wdateOptions);

        let isCompleteForm = {
          tel: false,
          wday: false
        }

        telMask
          .on('accept', () =>  isCompleteForm.tel = false)
          .on('complete', () => isCompleteForm.tel = true);

        wdateMask
          .on('accept', () =>  isCompleteForm.wday = false)
          .on('complete', () => isCompleteForm.wday = true);
      };
    }());



});