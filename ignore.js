
function first(a) {
    return function second(b) {
        return function third(c) {
            console.log(`${a} ${b} ${c}`);
        };
    };
};

first('Верстунов')('Верстак')('Верстунович');


const summ = a => b => c => console.log(`${a} ${b} ${c}`);
summ('Верстунов')('Верстак')('Верстунович'); // вуаля..

///////////////////////////////////////////////////////////////

fetch('https://api.instagram.com/v1/users/self/media/recent/?access_token=1820676164.1677ed0.87c8ed8be5fc4beab54d7a7b7d27633d&count=9')
    .then(res => res.json())
    .then(res => {
        res.data.forEach(el => {
            let url    = el.link;
            let imgUrl = el.images.low_resolution.url;
            let img  = document.createElement('img');
            
                img.src = imgUrl; 

            
                              
                console.log(img);
        });
    })
    .catch(err => console.log('ошибочка'));


    
// блын як цю хрень зразу тут в консоль вивести
// code runner install in
// https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner - не можу найти де цы настройки выдкрити
// https://i.stack.imgur.com/mDTrL.png - вот ці
//  VC

//  да тільки треба настройки виставити правильно



// i have new task from vovya
// 