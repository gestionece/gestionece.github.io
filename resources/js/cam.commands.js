window.addEventListener('load', function () {
    let selectedDeviceId;
    var torchON = false;
    const codeReader = new ZXing.BrowserMultiFormatReader()
    console.log('ZXing code reader initialized')
    codeReader.getVideoInputDevices()
        .then((videoInputDevices) => {

            const sourceSelect = document.getElementById('sourceSelect')
            selectedDeviceId = videoInputDevices[0].deviceId

            if (videoInputDevices.length >= 1) {
                videoInputDevices.forEach((element) => {
                    const sourceOption = document.createElement('option')
                    sourceOption.text = element.label
                    sourceOption.value = element.deviceId
                    sourceSelect.appendChild(sourceOption)
                })

                sourceSelect.onchange = () => {
                    selectedDeviceId = sourceSelect.value;
                };

                listCam();
                document.getElementById('opWrapCamera').style.display = 'block';
            }

            document.getElementById('camera').addEventListener('click', () => {

                $("#menu").click();

                $(".cam_box").toggle();
                $(".cam_box .box").slideToggle(function () {
                    codeReader.decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
                        if (result) {

                            const video = codeReader.videoElement
                            const canvas = document.getElementById("canvas");
                            canvas.width = video.videoWidth;
                            canvas.height = video.videoHeight;
                            var ctx = canvas.getContext('2d');

                            //ctx.drawImage(video, 0, 0);

                            // Green rectangle
                            ctx.beginPath();
                            ctx.lineWidth = "4";
                            ctx.strokeStyle = "green";
                            ctx.moveTo(result.resultPoints[0].x, result.resultPoints[0].y);
                            ctx.lineTo(result.resultPoints[1].x, result.resultPoints[1].y);
                            //ctx.rect(, res);
                            ctx.stroke();

                            setTimeout(function () {
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                            }, 3000);


                            AddCE(result.text);

                            console.log(result);
                        }
                        if (err && !(err instanceof ZXing.NotFoundException)) {
                            console.error(err)
                            document.getElementById('result').textContent = err
                        }
                    })
                    console.log(`Started continous decode from camera with id ${selectedDeviceId}`)




                });
            });

            document.getElementById('camClose').addEventListener('click', () => {
                codeReader.reset()
                torchON = false;

                $(".cam_box .box").slideToggle(function () {
                    $(".cam_box").toggle();
                });

                console.log('Reset.')
            });

            /*
            document.getElementById('torchButton').addEventListener('click', () => {

                if (codeReader.videoElement) {
                    onCapabilitiesReady(codeReader.videoElement.srcObject.getVideoTracks()[0]);
                }

                function onCapabilitiesReady(capabilities) {
                    if (capabilities.getCapabilities().torch) {

                        torchON = !torchON;

                        capabilities.applyConstraints({
                            advanced: [{ torch: Boolean(torchON) }]
                        })
                            .catch(e => console.log(e));
                    }
                }

                console.log('Torch.')
            })*/

        })
        .catch((err) => {
            console.error(err)
        })


    function listCam() {
        var x, i, j, selElmnt, a, b, c;
        /*look for any elements with the class "custom-select":*/
        x = document.getElementsByClassName("custom-select");
        for (i = 0; i < x.length; i++) {
            selElmnt = x[i].getElementsByTagName("select")[0];
            /*for each element, create a new DIV that will act as the selected item:*/
            a = document.createElement("DIV");
            a.setAttribute("class", "select-selected");
            a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
            x[i].appendChild(a);
            /*for each element, create a new DIV that will contain the option list:*/
            b = document.createElement("DIV");
            b.setAttribute("class", "select-items select-hide");
            for (j = 1; j < selElmnt.length; j++) {
                /*for each option in the original select element,
                create a new DIV that will act as an option item:*/
                c = document.createElement("DIV");
                c.innerHTML = selElmnt.options[j].innerHTML;
                c.addEventListener("click", function (e) {
                    /*when an item is clicked, update the original select box,
                    and the selected item:*/

                    var y, i, k, s, h;
                    s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                    h = this.parentNode.previousSibling;
                    for (i = 0; i < s.length; i++) {
                        if (s.options[i].innerHTML == this.innerHTML) {
                            s.selectedIndex = i;

                            selectedDeviceId = $('#sourceSelect option')[i].value;

                            h.innerHTML = this.innerHTML;
                            y = this.parentNode.getElementsByClassName("same-as-selected");
                            for (k = 0; k < y.length; k++) {
                                y[k].removeAttribute("class");
                            }
                            this.setAttribute("class", "same-as-selected");
                            break;
                        }
                    }

                    h.click();
                });
                b.appendChild(c);
            }
            x[i].appendChild(b);
            a.addEventListener("click", function (e) {
                /*when the select box is clicked, close any other select boxes,
                and open/close the current select box:*/
                e.stopPropagation();
                closeAllSelect(this);
                this.nextSibling.classList.toggle("select-hide");
                this.classList.toggle("select-arrow-active");
            });
        }
        function closeAllSelect(elmnt) {
            /*a function that will close all select boxes in the document,
            except the current select box:*/
            var x, y, i, arrNo = [];
            x = document.getElementsByClassName("select-items");
            y = document.getElementsByClassName("select-selected");
            for (i = 0; i < y.length; i++) {
                if (elmnt == y[i]) {
                    arrNo.push(i)
                } else {
                    y[i].classList.remove("select-arrow-active");
                }
            }
            for (i = 0; i < x.length; i++) {
                if (arrNo.indexOf(i)) {
                    x[i].classList.add("select-hide");
                }
            }
        }
        /*if the user clicks anywhere outside the select box,
        then close all select boxes:*/
        document.addEventListener("click", closeAllSelect);
    }
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