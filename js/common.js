"use strict";
const lang = document.documentElement.lang;
let   cart = [];
if (getCookie('cart')) cart = JSON.parse(getCookie('cart'));

window.addEventListener('load', () => {
    const d = document;
    const w = window;
    const video      = d.getElementById('h-video');
    const instafeed  = d.getElementById('instafeed');
    const home       = d.querySelector('.home');
    const prodcard   = d.querySelector('.prodcard');
    const catMoreBtn = d.querySelector('.catalog__more-btn');
    const bSlider    = d.querySelector('#brands-slider');
    const filter     = d.querySelector('.filter');
    const order      = d.querySelector('.order');
    const steps      = d.querySelector('.cart-order__steps');
    const complete   = d.querySelector('.order-complete');
    let   device     =  {
      '768'   : w.matchMedia('(max-width: 768px)').matches,
      '1200'  : w.matchMedia('(max-width: 1200px)').matches
    }
    const hsale  =  {
      block : d.querySelector('.h-sale'),
      left  : d.querySelector('.h-sale__img--lside'),
      right : d.querySelector('.h-sale__img--rside')
    };

     /* Scroll effects */
    if(home && !device[1200]) {
      w.addEventListener("scroll",  () => {
        inView(video)? video.play() : video.pause();
        if(inView(hsale.block)) {
          let top = hsale.left.getBoundingClientRect().top;
          hsale.left.firstChild.style.transform = `translateY(${-top/3}px)`;
          hsale.right.firstChild.style.transform = `translateY(${top/3}px)`;
        };
      });
    };


    function inView(el) {
      if(el) {
        let docViewTop = window.pageYOffset;
        let docViewBottom = docViewTop + window.innerHeight;
        let elTop = el.getBoundingClientRect().top + window.pageYOffset;
        let elBottom = elTop + el.clientHeight;
        return (docViewBottom >= elTop && docViewTop <= elBottom);
      }
    }

    if (home && device[1200]) video.controls = true;

    /* Footer Toggle menu */
    if (device[768]) {
      const title      = [...d.querySelectorAll('.footer__navtitle')];
      const ul         = [...d.querySelectorAll('.footer__navlist')];
      const activeClss = "footer__navtitle--active";
      title.forEach(el => el.addEventListener('click', e => {
        e.preventDefault();
        if(!el.classList.contains(activeClss)) {
          title.forEach(el => el.classList.remove(activeClss));
          el.classList.add(activeClss);
          ul.forEach(ul => $(ul).slideUp());
          $(el.nextElementSibling).slideDown();
        };
       }));
    }

    /* Slick common obj */
    const slickObj = {
      brandS: {
        slidesToShow: 4,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '0px',
        arrows: true,
        autoplay: true,
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
        infinite: false,
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
        focusOnSelect: true,
        arrows: false
      },
      prodMore: {
        slidesToShow: 2,
        slidesToScroll: 1,
        centerMode: true,
        arrows: false,
        dots: true,
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

    $(bSlider).slick(slickObj.brandS);
    $('.prodslider__slider').slick(slickObj.prodS);
    $('.prodslider__nav').slick(slickObj.prodNav);
    if(device[768]) $('.prodmore__list').slick(slickObj.prodMore);


    /*Insta */
    if(instafeed) {
      const targetUrl = 'https://api.instagram.com/v1/users/self/media/recent/?access_token=308771480.1677ed0.0c498cb30a344f6c88f2620d4f9f8079&count=6'
      fetch(targetUrl)
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



  /* Mobile Menu*/
    (function() {
      /* Burger menu */
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

      /* Toggle Mobile Sumbenu */
      const ddown = d.querySelectorAll('.header__navlist-toggle');

        ddown.forEach(el => {
          el.addEventListener('click', (event) => {
            toggleMore(el);
          });
        });

        function toggleMore(el) {
          el.classList.toggle('active');
          if(el.classList.contains('active')) {
            $(el.nextElementSibling).slideDown();
          } else {
            $(el.nextElementSibling).slideUp();
          }
        };
  
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
      const timeL  = d.querySelector('.order__time-label');
      const timeS  = d.querySelector('.order__time--selected');
      const timeM  = d.querySelector('.order__time--readonly');
      const mBtn   = d.querySelectorAll('.cal__btn');
      let   date   = d.querySelectorAll('.cal__date--active');

      const inputs = {
        time:  form.querySelector('input[name="time"]'),
        date:  form.querySelector('input[name="date"]'),
        tel:   form.querySelector('input[name="tel"]'),
        event: form.querySelector('input[name="event"]'),
        city:  form.querySelector('input[name="city"]')
      }
      const defDate = {
        date: d.querySelector('.cal__date--today').dataset.calendarDate,
        time: d.querySelector('.order__time--selected').textContent
      }
      const prodVal  = [...d.querySelectorAll('input[name="prop[]"]')].map(inp => inp.value);
      const prodStr  = prodVal.join();
      const offTime  = [...time];
            offTime.splice(0, 5);
      let sunday;

      if(new Date().getDay() == 0) sunday = true;

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
            ifBusy(el.dataset.calendarDate);
            ifSunday(el.dataset.sunday);
          });
        });
      }
      liveDate();
      ifSunday(sunday);
      ifBusy(defDate.date);


      function saveDate(date, time) {
        if(time) inputs.time.value = time;
        if(date) inputs.date.value = date;
        if(time) timeM.value = time;
      }

      function saveCity(city) {
        if (city) inputs.city.value = decodeURIComponent(city);
      }

      function ifSunday(sunday) {
        if(sunday) {
          offTime.forEach(t => t.style.display = 'none');
          $(time[0]).click();
        } else {
          offTime.forEach(t => t.style.display = 'block');
        }
      }

      function ifBusy(date) {
        d.querySelectorAll(".order__timelist li").forEach(li => {li.style.display = 'block'});
        let city = decodeURIComponent(getCookie('city'));
        if(city == "Киев"  || city == "Київ")  city = 'kiev';
        if(city == "Львов" || city == "Львів") city = 'lviv';
        fetch(`/crm/site/getDate?city=${city}`)
        .then(res => res.json())
        .then(res => {
          for (let i in res) {
            if(res[i].date == date) {
              let blocked = d.querySelectorAll(".order__timelist li[data-time='"+ res[i].time +"']");
                  blocked.forEach(li => {li.style.display = 'none'});
            }
          }
        })
      }

      saveCity(getCookie('city'));
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
        tel: false
      }

      telMask
        .on('accept', () =>  isCompleteForm.tel = false)
        .on('complete', () => isCompleteForm.tel = true);


      /* Cart-order steps */
      const step = [...steps.querySelectorAll('.cart-order__step')];
      const clss = ['cart-order__step--prev', 'cart-order__step--active', 'cart-order__step--next'];
      const next = steps.querySelector('.cart__next-btn');
      if(next) {
        next.addEventListener('click', e => {
          e.preventDefault();
          let pr;
          step.forEach(st => {
            step.forEach(s => s.classList.remove(...clss));
            st.classList.add(clss[1]);
            const { nextElementSibling: next, previousElementSibling: prev } = st;
            prev && prev.classList.add(clss[0]);
            next && next.classList.add(clss[2]);
            pr = prev;
          });
          pr.addEventListener("webkitAnimationEnd", () => {
            pr.style.display = 'none';
            timeL.style.top = timeS.offsetTop + "px"; //Default
          });
        });
      }

      form.addEventListener('submit', e => {
        e.preventDefault();
        const isValid = Object.values(isCompleteForm).every(item => item);
        if (isValid) {
          const fd = new FormData(e.target);
          fd.append('product', prodStr); //append products variables as string
          fetch(e.target.action, {
            method: 'POST',
            body: fd
          })
          .then(() => {
            deleteCookie('cart');
            w.location.href = `/complete?date=${fd.get('date')}&time=${fd.get('time')}&city=${fd.get('city')}`;
          })
          .catch(() => alert('Ошибка отправки'));
        } else {
          alert('Заполните необходимые поля');
        }
      });

      /* Cart-order delte actions */
      const del        = [...d.querySelectorAll('.cartitem__delete')];
      const cartInner  = d.querySelector('.cart__inner');

      del.forEach(el => {
          el.addEventListener('click', e => {
            e.preventDefault();
            delItem(el, 500)
              .then(isCartEmpty);
        });
      });


      function delItem(el, deltime) {
        return new Promise((resolve, reject) =>  {
          el.closest('.cartitem').style.animation = `zoomOut ${deltime}ms both`;
          setTimeout(() => {
            el.closest('.cartitem').remove();
            resolve();
          }, deltime);
        });
      };

      const isCartEmpty = () => {
        if(cart.length == 0) {
          if(lang == 'ru') cartInner.innerHTML = '<h1 class="cart__title--empty">Ваша примерка пуста</h1>'
          if(lang == 'ua') cartInner.innerHTML = '<h1 class="cart__title--empty">Ваша примірка порожня</h1>'
        }
      }

    };

    /* Order complete page */
    if(complete) {
      let url = (new URL(document.location)).searchParams;
      let date = complete.querySelector('.order-complete__date');
      let addr = complete.querySelector('.order-complete__addr');
      let urlDate = url.get('date') || date.textContent;
      let urlTime = url.get('time') || date.textContent;
      let urlCity = url.get('city');
      let tarAddr = addr.textContent;
      if(urlCity == "Киев" || urlCity == "Київ") {
        if(lang == 'ua') tarAddr = "за адресою: м. Київ, вул. Шота Руставеллі, 34"
        if(lang == 'ru') tarAddr = "по адресу: г. Киев, ул. Шота Руставелли, 34"
      }
      else if (urlCity == "Львов" || urlCity == "Львів") {
        if(lang == 'ua') tarAddr = "за адресою: м. Львів, вул. І. Франка, 61"
        if(lang == 'ru') tarAddr = "по адресу: г. Львов, ул. И. Франка, 61"
      }
      date.textContent = `${urlDate} (${urlTime})`;
      addr.textContent = tarAddr;
    }


    /* Popup`s */
    d.querySelectorAll('.open-popup').forEach(el => {
      el.addEventListener('click', () => {
        d.querySelector(el.dataset.modal).dataset.visible = true;
      });
    });

    d.querySelectorAll('.popup-box').forEach(el => {
      el.addEventListener('click', e => {
        if(e.target.classList.contains("popup-box") || e.target.classList.contains("popup-box__close")) {
          el.dataset.visible = false;
        }
      });
    });

    if (!getCookie("city")) d.getElementById("popCity").dataset.visible = true;

    /* Load more Products */
    if(catMoreBtn) {
      const catalog = d.querySelector('.catalog__products');
      const paginat = d.querySelector('.pagination');
      const path    = catMoreBtn.dataset.path;
      const maxpage = +catMoreBtn.dataset.maxpage;
      let   curpage = +catMoreBtn.dataset.curentpage;

      noMoreProd(curpage, maxpage);

      catMoreBtn.addEventListener('click', () => {
        if(curpage < maxpage) {
          curpage ++;
          paginat.classList.add('invisible');
          catMoreBtn.classList.add('catalog__more-btn--loading');
          fetch(`/index.php?route=product/moreproduct&path=${path}&page=${curpage}`, {
            method: 'GET'
          })
          .then(resp => { return resp.text()})
          .then(html => {
            catMoreBtn.classList.remove('catalog__more-btn--loading');
            catalog.innerHTML += html;
          })
          .catch(err => console.error('Error:', err));
        }
        noMoreProd(curpage, maxpage);
      });
      function noMoreProd(cur, max) {
        if(cur === max) {
          $(catMoreBtn).fadeOut();
        }
      }
    }


});





/* Gallery in popup start */
{
  let current_photo = 1;
  let  images = null;
  document.addEventListener("click", e => popGallery(e));
  document.onkeydown = popGalleryKey;

  function popGallery(e) {
    if (e.srcElement.dataset.gallery == 'true') {
      images = (images == null ? document.querySelectorAll(".prodslider__slider img").length : images);

        document.querySelectorAll(".prodslider__slider li img").forEach((img, i) => {
          img.dataset.n = (i + 1);
        });

        current_photo = (parseInt(e.target.dataset.n));
        const popup = document.createElement('div');
        popup.id = 'popGallery';
        popup.className = 'popup-box';
        popup.dataset.visible = true;
        document.body.appendChild(popup);
        popup.innerHTML += `
          <div class="popup-box__content">
            <div class="popup-box__close"></div>
            <div id="popup-load" class="popup-box__load"></div>
            <div id="popup-prev" class="popup-box__nav">prev</div>
            <div id="popup-next" class="popup-box__nav">next</div>
            <div id="popup-slides" class="popup-box__slides"></div>
            <div class="popup-box__images" id="popup-img">
              <figure id="popup-zoom" class="popup-box__zoomed" style="background-image: url('${e.srcElement.dataset.popup}')" onmousemove='zooming(event)' >
                <img id="popup-photo" class="popup-box__image" src="${e.srcElement.dataset.popup}">
              </figure>
            </div>
          </div>`;
        popGalleryNav();
        popGalleryPreload(document.getElementById("popup-photo"));
    } else if (e.srcElement.classList.contains("popup-box") || e.srcElement.classList.contains("popup-box__close")) {
        if (document.getElementById("popGallery")) document.getElementById("popGallery").remove();
    } else if (document.getElementById("popGallery") && e.srcElement.id == "popup-next" || e.srcElement.id == "popup-prev") {
        (e.srcElement.id == "popup-next") ? current_photo++ : current_photo--;

        let elements = document.querySelectorAll(".prodslider__slider li");
        let src = (elements.item(current_photo - 1).getElementsByTagName("img")[0].dataset.popup);
        let img  = document.getElementById("popup-photo");
        let zoom = document.getElementById("popup-zoom");
        img.src = src;
        zoom.style.backgroundImage = `url('${src}')`;
        popGalleryNav();
        popGalleryPreload(img);
    }
  }

  function popGalleryNav() {
    document.getElementById("popup-slides").innerHTML = "<b>" + current_photo + "</b> / " + images;
    document.getElementById("popup-prev").style.display = (current_photo == 1 || images == 0) ? "none" : "flex";
    document.getElementById("popup-next").style.display = (current_photo == images || images == 0) ? "none" : "flex";
  }

  function popGalleryPreload(img) {
    let preload = document.getElementById("popup-load");
    let interval = setInterval(() => {
      if(img.complete) {
        $(preload).fadeOut();
        clearInterval(interval);
      } else {
        $(preload).fadeIn();
      }
    }, 100)
  }

  function popGalleryKey(e) {
    e = e || window.event;
    if (document.getElementById("popGallery")) {
        if (e.keyCode == "37") { // ON KEYDOWN LEFT ARROW
          if (document.getElementById("popup-prev").style.display != "none") document.getElementById("popup-prev").click();
        }
        else if (e.keyCode == "39") { // ON KEYDOWN RIGHT ARROW
          if (document.getElementById("popup-next").style.display != "none") document.getElementById("popup-next").click();
        }
        else if (e.keyCode == "27") { // ON KEYDOWN ESCAPE
          document.getElementById("popGallery").remove();
        }
    }
  }

}

function zooming(e) {
    let zoomer = e.currentTarget;
    let offsetX, offsetY, x, y;
    e.offsetX ? offsetX = e.offsetX : offsetX = e.touches[0].pageX
    e.offsetY ? offsetY = e.offsetY : offsetX = e.touches[0].pageX
    x = offsetX/zoomer.offsetWidth*100
    y = offsetY/zoomer.offsetHeight*100
    zoomer.style.backgroundPosition = x + '% ' + y + '%';
}


/* Google map */
function initMap() {

  const gMap = {
    Kiev: {
      position: {lat: 50.4370785, lng: 30.517750699999965},
      map() { return newMap('mapKiev', this.position) }
    },
    Lviv: {
      position: {lat: 49.8311398, lng: 24.033193900000015},
      map() { return newMap('mapLviv', this.position) }
    },
    LvivA: {
      position: {lat: 49.828446, lng: 23.991518},
      map() { return newMap('mapLvivA', this.position) }
    }
  };

  for(let key in gMap) {
      gMarker(gMap[key].position, gMap[key].map() );
  }

  function gMarker(position, map) {
    return new google.maps.Marker({
        position,
        map,
        animation: google.maps.Animation.BOUNCE,
        icon: { url: '/img/icons/map__marker--red.png'}
    })
  }

  function newMap(id, position) {
    return new google.maps.Map(document.getElementById(id), {zoom: 15, center: position})
  }
}


/* Global Cart scripts */
function addToCart(id, btn) {
  let color = [...document.querySelectorAll('[name=p-color]')].filter(el => el.checked)[0];
  let size  = [...document.querySelectorAll('[name=p-size]')].filter(el => el.checked)[0];

  for (let i in cart) {
      if(cart[i].id == id) {
          cart[i].prop = {
            color : (color) ? color.value : "",
            size  : (size)  ?  size.value : ""
          }
          saveCart();
          return;
      }
  }

  let item  = {
    id: id,
    prop: {
      color : (color) ? color.value : "",
      size  : (size)  ?  size.value : ""
    }
  };

  cart.push(item);
  saveCart();
  updCartQuantity();
  cartPopup(btn);
}

function saveCart() {
  if (navigator.cookieEnabled) {
    deleteCookie('cart');
    setCookie('cart', JSON.stringify(cart), 240);
  } else {
    alert('Включите cookie в настройках браузера');
  }
}

function deleteCartItem(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updCartQuantity();
}

function updCartQuantity() {
  let indicator = document.querySelectorAll('.header__booking-btn i');
  indicator.forEach(el => el.textContent = cart.length);
}

updCartQuantity();


function cartPopup(btn) {
  const popup       = document.querySelector('#popProduct');
  const popupTitle  = popup.querySelector('.popup-box__title i');
  let   prodName;
  if (btn.closest('.product'))  prodName = btn.closest('.product').querySelector('.product__title');
  if (btn.closest('.prodcard')) prodName = btn.closest('.prodcard').querySelector('.prodcard__name');
  popupTitle.innerHTML = '';
  popupTitle.innerHTML = prodName.textContent;
  popup.dataset.visible = true;
}

function cityPopup(city) {
  deleteCookie('city');
  setCookie('city', encodeURIComponent(city), 96);
  location.reload();
}


function applyCatalogFilter(form, event) {
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
  document.cookie = name+'=; Max-Age=-99999999;';
}