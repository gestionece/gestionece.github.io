window.addEventListener('load', function () {
   
});
















/*
window.addEventListener('load', function () {

    //https://www.twilio.com/blog/2018/04/choosing-cameras-javascript-mediadevices-api.html

    //https://developers.google.com/web/fundamentals/native-hardware/build-for-webusb

    //https://web.dev/customize-install/

    //https://web.dev/progressive-web-apps/

    //https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen


    document.getElementById('camera').addEventListener('click', () => {

        $("#menu").click();

        $(".cam_box").toggle();
        $(".cam_box .box").slideToggle(function () {

            // Grab elements, create settings, etc.
            var video = document.getElementById('video');
            // Get access to the camera!
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                // Not adding `{ audio: true }` since we only want video now
                navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
                    //video.src = window.URL.createObjectURL(stream);
                    video.srcObject = stream;
                    video.play();
                });
            }
        });
    })

    document.getElementById('btnClose').addEventListener('click', () => {

        // Grab elements, create settings, etc.
        var video = document.getElementById('video');
        video.pause();
        video.removeAttribute('src'); // empty source
        video.load();
        video.pause();


        $(".cam_box .box").slideToggle(function () {
            $(".cam_box").toggle();
        });
    })
});
*/