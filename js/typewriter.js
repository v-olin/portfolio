document.addEventListener('DOMContentLoaded', function (event) {
    var text = ["CSE Student", "Developer", "Enthusiast", "Pilot"]

    function typeWriter(text, i, fnCallback) {
        if (i < (text.length)) {
            document.getElementById('typew-text').innerHTML = text.substring(0, i + 1) + '<span aria-hidden="true"></span>';

            setTimeout(function () {
                typeWriter(text, i + 1, fnCallback)
            }, 100);
        }
        else if (typeof fnCallback == 'function') {
            setTimeout(fnCallback, 1000);
        }
    }
    function StartTextAnimation(i) {
        if (typeof text[i] == 'undefined') {
            setTimeout(function () {
                StartTextAnimation(0);
            }, 2000);
        }
        else if (i < text[i].length) {
            typeWriter(text[i], 0, function () {
                StartTextAnimation(i + 1);
            });
        }
    }
    StartTextAnimation(0);
});