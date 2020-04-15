$(document).ready(function () {

    /* ----------- WebApp -------------*/
    // Register service worker to control making site work offline
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('/sw.js')
            .then(function () { console.log('Service Worker Registered'); });
    }
    // Code to handle install prompt on desktop
    let deferredPrompt;

    var userRifiute = false;
    if (localStorage.uRifiute) {
        userRifiute = localStorage.uRifiute;
    }

    function showProm() {
        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
                localStorage.uRifiute = true;
                userRifiute = true;
                deferredPrompt = null;
        
                location.reload();
            } else {
                localStorage.uRifiute = true;
                userRifiute = true;
                deferredPrompt = null;
        
                location.reload();
                console.log('User dismissed the install prompt');
            }
        });
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;

        $('.container_opt.wrap_a2hs').show()

        $("#a2hsBtn").click(function () {
            showProm();
            return false;
        });

        if (userRifiute == false) {
            window.setTimeout(function () {
                swal({
                    title: "Install App",
                    text: "Access offline using our web App!",
                    icon: "info",
                    buttons: ["Not now", "install!"],
                    dangerMode: true,
                })
                    .then((willDelete) => {
                        if (willDelete) {
                            showProm();
                        } else {
                            localStorage.uRifiute = true;
                            userRifiute = true;
                            //swal("(^_^)", "You can install application when you want by pressing Menu -> Add to Home Screen!");
                        }
                    });
            }, 1000);
        }

    });

    window.addEventListener('appinstalled', (evt) => {
        console.log('a2hs installed');

        localStorage.removeItem('uRifiute');
        $('.container_opt.wrap_instApp ').hide()
    });
    /* ----------- End WebApp -------------*/
});