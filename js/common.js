"use strict";


let cart = [];

if (localStorage.cart) {
  cart = JSON.parse(localStorage.cart);
  showCart();
};

window.addEventListener('load', () => {

    const d = document;
    const w = window;
    const lang      = d.documentElement.lang;
    const video     = d.getElementById('h-video');
    const instafeed = d.getElementById('instafeed');
    const home      = d.querySelector('.home');
    const bSlider   = d.querySelector('#brands-slider');
    const filter    = d.querySelector('.filter');
    const order     = d.querySelector('.order');
    const pcard     = d.querySelector('.prodcard');
    const hbook     = d.querySelector('.header__booking');
    const hlang     = d.querySelector('.header__lang');
    const menu      = d.querySelector('.header__nav');
    const steps     = d.querySelector('.cart-order__steps');
    const complete  = d.querySelector('.order-complete');
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
        afterMove: (index, section) => {
          section.querySelector('#h-video')? video.play() : video.pause()
        }
      });
    };

    if (home && device[1200]) video.controls = true;

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
      const form   = d.querySelector('#cart-order-form');
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
        event: form.querySelector('input[name="event"]')
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
      const eventOptions = {
        mask: Date,
        min: new Date(2019, 0, 0),
        lazy: false
      };

      const telMask   = new IMask(inputs.tel, telOptions);
      const eventMask = new IMask(inputs.event, eventOptions);

      let isCompleteForm = {
        tel: false,
        wday: false
      }

      telMask
        .on('accept', () =>  isCompleteForm.tel = false)
        .on('complete', () => isCompleteForm.tel = true);

      eventMask
        .on('accept', () =>  isCompleteForm.wday = false)
        .on('complete', () => isCompleteForm.wday = true);


      /* Cart-order steps */
      const step = [...steps.querySelectorAll('.cart-order__step')];
      const clss = ['cart-order__step--prev', 'cart-order__step--active', 'cart-order__step--next'];
      const next = steps.querySelector('.cart__next-btn');

      next.addEventListener('click', e => {
        e.preventDefault();
        step.forEach(st => {
          step.forEach(s => s.classList.remove(...clss));
          st.classList.add(clss[1]);
          const { nextElementSibling: next, previousElementSibling: prev } = st;
          prev && prev.classList.add(clss[0]);
          next && next.classList.add(clss[2]);
        });
      });

      const maxH = step.reduce((a, b) => Math.max(a.offsetHeight, b.offsetHeight));
      steps.style.minHeight = maxH + 'px';

      form.addEventListener('submit', e => {
        e.preventDefault();
        const isValid = Object.values(isCompleteForm).every(item => item);
        if (isValid) {
          const fd = new FormData(e.target);
          fetch(e.target.action, {
            method: 'POST',
            body: fd
          })
          .then(() => {
            localStorage.removeItem('cart');
            deleteCookie('cart');
            w.location.href = `order-complete.html?date=${fd.get('date')}&time=${fd.get('time')}`;
          })
          .catch(() => alert('Ошибка отправки'));
        } else {
          alert('Заполните необходимые поля');
        }
      });
    };

    /* Order complete page */
    if(complete) {
      let date = complete.querySelector('.order-complete__date');
      let url = (new URL(document.location)).searchParams;
      date.textContent = url.get('date') +' ('+ url.get('time') +')';
    }


    /* Product card */
    if(pcard) {
      $('.prodslider__slider').slick(slickObj.prodS);
      $('.prodslider__nav').slick(slickObj.prodNav);
      if(device[768]) $('.prodmore__list').slick(slickObj.prodMore);
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

/* Global Cart scripts */
function addToCart(id) {
  let color = [...document.querySelectorAll('[name=p-color]')].filter(el => el.checked)[0];
  let size  = [...document.querySelectorAll('[name=p-size]')].filter(el => el.checked)[0];

  for (let i in cart) {
      if(cart[i].id == id) {
          cart[i].prop = {
            color : (color) ? color.value : null,
            size  : (size)  ?  size.value : null
          }
          showCart();
          saveCart();
          return;
      }
  }

  let item  = {
    id: id,
    prop: {
      color : (color) ? color.value : null,
      size  : (size)  ?  size.value : null
    }
  };

  cart.push(item);
  saveCart();
  showCart();
  updCartQuantity();
}

function saveCart() {
  if (window.localStorage) localStorage.cart = JSON.stringify(cart);
  deleteCookie('cart');
  setCookie('cart', localStorage.cart, 1);
}

function showCart() {
  let list = document.querySelector('.cart__items');
  if(list) {
      list.innerHTML = '';
      fetch('http://'+ window.location.host + '/_html/chunks/loop/product.json')
      .then(res => res.json())
      .then(res => {
        res.forEach(el => {
          for (let i in cart) {
            if(el.id == cart[i].id) {
              let li = document.createElement('li');
                  li.className = "cartitem";
                  li.innerHTML = `
                                  <figure class="cartitem__figure"><a href="product.html"><img src="${el.image}" alt="Tarik Ediz 50310"></a></figure>
                                  <div class="cartitem__info">
                                      <div class="cartitem__desc">
                                          <a class="cartitem__name" href="product.html">${el.title}</a>
                                          <b class="cartitem__price">${el.price}<i>грн</i></b>
                                      </div>
                                      <div class="cartitem__collection">
                                          <a href="collection.html" class="btn btn--trans">Tarik Ediz</a>
                                      </div>
                                      <button type="button" class="cartitem__delete" onclick="deleteCartItem(${el.id}, this)">X</button>
                                  </div>
                                `;
                  list.appendChild(li);
            }
           }
        });
      })
      .catch(err => console.error('Error:', err));
  }
}

function deleteCartItem(id, el) {
  cart = cart.filter(item => item.id !== id);

  el.closest('.cartitem').style.animation = `zoomOut 500ms both`;
    setTimeout(() => {
      el.closest('.cartitem').remove();
  }, 500);
  saveCart();
  updCartQuantity();
}


function updCartQuantity() {
  let indicator = document.querySelector('.header__booking-btn i');
  let cartInner = document.querySelector('.cart__inner');
  if(indicator) indicator.textContent = cart.length;
  if(cart.length == 0 && cartInner) cartInner.innerHTML = '<h1 class="cart__title--empty">Ваша корзина пуста</h1>'
}

updCartQuantity();


function applyCatalogFilter(form) {
  event.preventDefault();
  const filter  = [];
  const checked = [...document.querySelectorAll('.filter__filters input')].filter(el => el.checked);
  const action = form.action;
  checked.forEach(el => filter.push(el.value));
  window.location.href = `${action}&filter=${filter.join(',')}`;
}

function setCookie(cookiename, cookievalue, hours) {
  let date = new Date();
  date.setTime(date.getTime() + Number(hours) * 3600 * 1000);
  document.cookie = cookiename + "=" + cookievalue + "; path=/;expires = " + date.toGMTString();
}

function getCookie(name) {
  let match = document.cookie.match(RegExp('(?:^|;\\s*)' + name + '=([^;]*)')); return match ? match[1] : null;
}

function deleteCookie(name) {
  setCookie(name, "", {
    expires: -1
  })
}