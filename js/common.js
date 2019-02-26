"use strict";

window.addEventListener('load', () => {

    const d = document;
    const w = window;
    const video     = d.getElementById('h-video');
    const home      = d.querySelector('.home');
    const bSlider   = d.querySelector('#brands-slider');
    const instafeed = d.getElementById('instafeed');
    const filter    = d.querySelector('.filter');
    const order     = d.querySelector('.order');
    const pcard     = d.querySelector('.prodcard');
    const hbook     = d.querySelector('.header__booking');
    const hlang     = d.querySelector('.header__lang');
    const menu      = d.querySelector('.header__nav');
    let   device    =  {
      '768'   : w.matchMedia('(max-width: 768px)').matches,
      '1200'  : w.matchMedia('(max-width: 1200px)').matches
    }

     /* OnePage Scroll */
    if(home && !device[1200]) {
      onePageScroll(".home", {
        pagination: false,
        animationTime: 1500,
        footer: "footer",
        delay: 500,
        afterMove: (index, section) => toggleVideo(section)
      });
    };

    if (home && device[1200]) video.controls = true;

    if(device[768]) {
      menu.appendChild(hbook);
      menu.appendChild(hlang);
    }

    /* Slick common obj */
    const slickObj = {
      brandS: {
        slidesToShow: 4,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '0px',
        arrows: true,
        responsive: [
          {
            breakpoint: 993,
            settings: {
              slidesToShow: 3
            }
          },
          {
            breakpoint: 769,
            settings: {
              slidesToShow: 2
            }
          },
          {
            breakpoint: 500,
            settings: {
              slidesToShow: 1
            }
          }
        ]
      },
      prodS: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        speed: 0,
        fade: false,
        swipe: false,
        asNavFor: '.prodslider__nav',
        responsive: [
          {
            breakpoint: 769,
            settings: {
              dots: true,
              swipe: true,
              speed: 500
            }
          }
        ]
      },
      prodNav: {
        slidesToShow: 3,
        slidesToScroll: 1,
        asNavFor: '.prodslider__slider',
        vertical: true,
        focusOnSelect: true
      },
      prodMore: {
        slidesToShow: 2,
        slidesToScroll: 1,
        centerMode: true,
        arrows: false,
        centerPadding: '0px',
        responsive: [
          {
            breakpoint: 501,
            settings: {
              slidesToShow: 1
            }
          }
        ]
      }
    };

    /* Brands init slider */
    if(bSlider) {
      $(bSlider).slick(slickObj.brandS);
    };

    /*Insta */
    if(instafeed) {
      const proxyUrl  = 'https://cors-anywhere.herokuapp.com/',
            targetUrl = 'https://api.instagram.com/v1/users/self/media/recent/?access_token=308771480.1677ed0.0c498cb30a344f6c88f2620d4f9f8079&count=6'
      fetch(proxyUrl + targetUrl)
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
    };


  /* Burger Menu*/
    (function() {
      let burger  = d.querySelector('.header__burg'),
          nav     = d.querySelector('.header__nav'),
          overlay = d.createElement('div');
          overlay.className = 'overlay';

        function toggleMobmenu() {
          burger.classList.toggle('active');
          nav.classList.toggle('active');
          d.body.classList.toggle('hidden');
          (nav.classList.contains('active')) ? d.body.insertBefore(overlay, d.body.firstChild) : overlay.remove()
        };

        [overlay, burger].forEach(el => el.addEventListener('click', toggleMobmenu));
    }());


    /* Catalog filter toggle */
    if(filter) {
      const btn   = d.querySelector('.filter__toggle');
      const form  = d.getElementById('filterForm');
      const input = form.querySelectorAll('input[type="checkbox"]');
      const reset = form.querySelector('.filter__reset');
      const close = d.querySelector('.filter__close');

      form.addEventListener('change', activeFilter);
      reset.addEventListener('click', () => setInterval(activeFilter, 50));
      btn.addEventListener('click', toggleFilter);
      close.addEventListener('click', toggleFilter);

      function activeFilter(res) {
        input.forEach(el => {
          if(el.checked) res = true;
        });
        (res === true)? btn.dataset.dot = res : btn.dataset.dot = false;
      }
      activeFilter();

      function toggleFilter() {
        if(!device[768]) $(filter).slideToggle();
        filter.classList.toggle('filter--visible');
      }
    };


    /* Order form */
    if(order) {
        vanillacalendar.init(); /*init calendar */
        vanillacalendar.cal.classList.add('call--init');
        const form   = d.querySelector('.order__form form');
        const time   = d.querySelectorAll('.order__timelist li');
        const timeSp = d.querySelectorAll('.order__timelist li span');
        const timeL  = d.querySelector('.order__time-label');
        const timeS  = d.querySelector('.order__time--selected');
        const timeM  = d.querySelector('.order__time--readonly');
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
            if(w.getComputedStyle(timeM).display !== "none") {
              timeM.dataset.timelist = false;
            }
          });
        });
        timeL.style.top = timeS.offsetTop + "px"; //Default

        timeM.addEventListener('click', e => {
          e.preventDefault();
          (timeM.dataset.timelist == 'true') ? timeM.dataset.timelist = false : timeM.dataset.timelist = true;
        });

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
          if(time) timeM.value = time;
        }

        saveDate(defDate.date, defDate.time); //Default
        timeM.value = defDate.time; //Default

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

    /* Product card */
    if(pcard) {
      $('.prodslider__slider').slick(slickObj.prodS);
      $('.prodslider__nav').slick(slickObj.prodNav);
      if(device[768]) $('.prodmore__list').slick(slickObj.prodMore);
    };


    function toggleVideo(s) {
      if(s.querySelector('#h-video')) {
        video.play();
      } else {
        video.pause();
      }
    };

});




function initMap() {
  const iconUrl  = '/img/icons/map__marker--red.png';
  let coordLviv  = {lat: 49.8311398, lng: 24.033193900000015};
  let coordKiev  = {lat: 50.4370785, lng: 30.517750699999965};
  let coordLvivA = {lat: 49.82873699999999, lng: 23.991688000000067};
  let mapKiev    = new google.maps.Map(document.getElementById('mapKiev'), {zoom: 17, center: coordKiev});
  let mapLviv    = new google.maps.Map(document.getElementById('mapLviv'), {zoom: 17, center: coordLviv});
  let mapLvivA   = new google.maps.Map(document.getElementById('mapLvivA'),{zoom: 17, center: coordLvivA});

  const markerKiev     = new google.maps.Marker({
      position: coordKiev,
      map: mapKiev,
      animation: google.maps.Animation.BOUNCE,
      icon: { url: iconUrl}
  });
  const markerLviv = new google.maps.Marker({
      position: coordLviv,
      map: mapLviv,
      animation: google.maps.Animation.BOUNCE,
      icon: { url: iconUrl}
  });
  const markerLvivA  = new google.maps.Marker({
      position: coordLvivA,
      map: mapLvivA,
      animation: google.maps.Animation.BOUNCE,
      icon: { url: iconUrl}
  });
}