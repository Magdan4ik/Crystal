"use strict";
window.addEventListener('DOMContentLoaded',
  function () {
    // stare bzdo.. nechipaite
  }
);

window.addEventListener('load', function () {



    var ctrl = new ScrollMagic.Controller({
      globalSceneOptions: {
        triggerHook: 'onLeave'
      }
    });


    document.querySelectorAll('.home section').forEach(section => {

      var name = section.id;

      new ScrollMagic.Scene({
          triggerElement: section
          // duration: 10000   // поставь это и будеш крутить скрол оч долго
          // triggerHook: 0    // 0.7 // 1    // a eta huita => 0 - top okna; 1 - dno okna
        })
        .setPin(section)
        .setClassToggle(section, "myclass") 
        .addIndicators({  // индикатор это подсказка справа
          colorStart: "rgba(255,255,255,0.5)",
          colorEnd: "rgba(255,255,255,0.5)",
          colorTrigger: "rgba(255,255,255,1)",
          name: name
        })

        .loglevel(3)
        .addTo(ctrl);

    });




});