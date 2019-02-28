
(function first(a) {
    return function second(b) {
        return function third(c) {
            console.log(`${a} ${b} ${c}`);
        };
    };
})('Верстунов')('Верстак')('Верстунович');

// осталась главна мобайл


const summ = a => b => c => `${a} ${b} ${c}`;
console.log(summ('Верстунов')('Верстак')('Верстунович'))
///////////////////////////////////////////////////////////////


function sendData(url, data) {
    var formData = new FormData();

    for (var name in data) {
        formData.append(name, data[name]);
        console.log(name)
    }

    fetch(url, {
        method: 'POST',
        body: formData
    }).then(function (response) {
        return console.log(response)
    });
}

// { }

function sendData(url, name) {
    // let formData = new FormData();
    //     formData.append(name, name);
    // var myHeaders = new Headers();
    // myHeaders.
    fetch(url, {
      method: "POST",
    //   headers: myHeaders,
      body: JSON.stringify({'code': name})
    }).then(() => window.location.reload());
}

sendData('/index.php?route=common/language/language', this.dataset.lang);


sendLang('/index.php?route=common/language/language', 'uk-ua')


function getScrollbarWidth(element) {
    return element.offsetWidth - element.clientWidth;
}

//  headers: {'Content-Type': 'application/x-www-form-urlencoded'}


/*


*/