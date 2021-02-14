function updateNumberList() {
    var CECodes = [];

    $('ul#listCE li').each(function (index) {
        $(this).children('label.count').text((index + 1).numberFormat('000') + ': ');
        $(this).children('label.codeCE').text(pattCE.exec($(this).text())[0]);
    });

    updateCodeScan();
}

/* Start PopUp*/
function showPopUp(tittle, text, duration) {
    $(".pop_up .tittle").text(tittle);
    $(".pop_up .text").text(text);
    $('.pop_up').fadeIn().delay(duration).fadeOut();
}
/* End PopUp*/

/* Start ModalBox*/ //ModalBox("tittle", "text")
function ModalBox(tittle, text) {
    $(".cam_box .modal_box .tittle").text(tittle);
    $(".cam_box .modal_box .text").text(text);
    $('.cam_box').fadeIn();
}
/* End ModalBox*/

// Function to download data to a file
function download(data, filename, type) {
    var file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

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
                        h.innerHTML = this.innerHTML;
                        y = this.parentNode.getElementsByClassName("same-as-selected");
                        for (k = 0; k < y.length; k++) {
                            y[k].removeAttribute("class");
                        }
                        this.setAttribute("class", "same-as-selected");


                        updateConfig()

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

function playSound(status) {
    if ($('#o-SoundOn')[0].checked == true) {
        var sound = new Audio("resources/sound/beep_accept.wav");

        switch (status) {
            case "error":
                sound = new Audio("resources/sound/beep_error.wav");
                break;
            case "alert":
                sound = new Audio("resources/sound/beep_alert.wav");
                break;
            case "accept":
                sound = new Audio("resources/sound/beep_accept.wav");
                break;
        }
        sound.play();
    }
}

//document.body.requestFullscreen();
$(document).ready(function () {


    let selectedDeviceId;
    var torchON = false;
    const codeReader = new ZXing.BrowserMultiFormatReader()
    console.log('ZXing code reader initialized')
    codeReader.getVideoInputDevices()
        .then((videoInputDevices) => {

            const sourceSelect = document.getElementById('o-SourceCam');
            selectedDeviceId = videoInputDevices[0].deviceId;

            if (videoInputDevices.length >= 1) {
                videoInputDevices.forEach((element) => {
                    const sourceOption = document.createElement('option')
                    sourceOption.text = element.label
                    sourceOption.value = element.deviceId
                    sourceSelect.appendChild(sourceOption)
                })

                loadConfig();
                listCam();

                document.getElementById('opWrapCamera').style.display = 'block';
                document.getElementById('camera').style.display = 'inline-block';

            }

            document.getElementById('camera').addEventListener('click', () => {

                if (sourceSelect.children[sourceSelect.selectedIndex].value !== "null") {
                    selectedDeviceId = sourceSelect.children[sourceSelect.selectedIndex].value;

                    $("#menu").click();

                    $(".cam_box").toggle();
                    $(".cam_box .box").slideToggle(function () {

                        var lastResult;
                        codeReader.decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {

                            if ($('#torchButton').is(':visible') == false && codeReader.videoElement.srcObject.getVideoTracks()[0].getCapabilities().torch) {
                                $('#torchButton').show();
                            }

                            if (result && lastResult !== result.text) {

                                lastResult = result.text;

                                if ($('#o-DrawLine')[0].checked == true) {
                                    const video = codeReader.videoElement
                                    const canvas = document.getElementById("canvas");
                                    canvas.width = video.videoWidth;
                                    canvas.height = video.videoHeight;
                                    var ctx = canvas.getContext('2d');

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
                                    }, 500);
                                }

                                AddCE(result.text);

                                console.log(result);
                            }
                            if (err && !(err instanceof ZXing.NotFoundException)) {
                                console.error(err)
                            }
                        })
                        console.log(`Started continous decode from camera with id ${selectedDeviceId}`)
                    });


                } else {
                    swal({
                        title: "Please select SourceCam",
                        icon: "error",
                    })
                        .then((willDelete) => {
                            if (willDelete) {
                                $(".options_box").fadeIn("fast", "linear", function () {
                                    $(".options_box .box").addClass("on");
                                });
                            }
                        });
                    //swal("Please select SourceCam", "", "error");
                }
            });

            document.getElementById('camClose').addEventListener('click', () => {
                codeReader.reset()
                torchON = false;

                $(".cam_box .box").slideToggle(function () {
                    $(".cam_box").toggle();
                });

                $('#torchButton').hide();

                console.log('Reset.')
            });


            document.getElementById('torchButton').addEventListener('click', () => {

                if (codeReader.videoElement) {
                    onCapabilitiesReady(codeReader.videoElement.srcObject.getVideoTracks()[0]);
                }

                function onCapabilitiesReady(capabilities) {
                    if (capabilities.getCapabilities().torch) {

                        torchON = !torchON;

                        console.log('Torch ' + torchON)

                        capabilities.applyConstraints({
                            advanced: [{ torch: Boolean(torchON) }]
                        })
                            .catch(e => console.log(e));
                    }
                }
            });
        })
        .catch((err) => {
            console.error(err)
        })

    //Add Code

    // Start click version
    $('#version').on('click', function () {
        swal({ title: "Aggiornamenti:", text: "1.0.1 - prima versione stabile; \n 1.1.0 - [ADD] Caricamento del file; \n 1.1.1 - [EDIT] Spostato tasto condividi; \n 1.1.1 - [Add] FilterMode;"});
        return false;
    });
    // End click version


    const shareData = {
        title: 'MDN',
        text: 'Learn web development on MDN!',
        url: 'https://developer.mozilla.org',
    }
    // Must be triggered some kind of "user activation"
    document.querySelector('#share').addEventListener('click', async () => {
        try {
            await navigator.share(shareData)
        } catch (err) {

        }
    });

    // Start click whatsapp
    $('#whatsapp').on('click', function () {
        swal({
            title: "Vuoi condividere su WhatsApp?",
            icon: "warning",
            dangerMode: true,
            buttons: true,
        })
            .then((willDelete) => {
                if (willDelete) {

                    var MsgWhatsApp = JSON.parse(localStorage.CodeScan).CodeCP;
                    JSON.parse(localStorage.CodeScan).CodeCE.forEach(function (code) {
                        MsgWhatsApp += '%0D%0A' + code;
                    });
                    window.open("https://api.whatsapp.com/send?text=" + MsgWhatsApp, '_blank').focus();

                }
            });
        return false;
    });
    // End click whatsapp

    // Start click download
    $('#download').on('click', function () {
        swal({
            title: "Vuoi scaricare il file?",
            icon: "warning",
            dangerMode: true,
            buttons: true,
        })
            .then((willDelete) => {
                if (willDelete) {

                    var data = JSON.parse(localStorage.CodeScan).CodeCP;
                    JSON.parse(localStorage.CodeScan).CodeCE.forEach(function (code) {
                        data += '\n' + code;
                    });

                    download(data, JSON.parse(localStorage.CodeScan).CodeCP, ".txt")

                    swal({ icon: "success", timer: 1000, });
                }
            });
        return false;
    });
    // End click download

    // Start click upload
    $('#upload').on('click', function () {
        swal({
            title: "Vuoi caricare il file?",
            icon: "warning",
            dangerMode: true,
            buttons: true,
        })
            .then((willDelete) => {
                if (willDelete) {

                    localStorage.removeItem('CodeScan');
                    loadCodeScan();

                    var input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.txt';

                    input.onchange = e => {

                        // getting a hold of the file reference
                        var file = e.target.files[0];

                        // setting up the reader
                        var reader = new FileReader();
                        reader.readAsText(file, 'UTF-8');

                        // here we tell the reader what to do when it's done reading...
                        reader.onload = readerEvent => {
                            var content = readerEvent.target.result.split('\n'); // this is the content!

                            if (pattCP.test(content[0]) || content[0] == "ID Carton Pallet") {
                                content.forEach(element => {
                                    AddCE(element, false);
                                });
                                swal({ icon: "success", timer: 1000, });
                            } else {
                                swal({ icon: "error", timer: 1000, });
                            }
                        }
                    }

                    input.click();
                }
            });
        return false;
    });
    // End click upload

    // Start click newFile
    $('#newFile').on('click', function () {

        swal({
            title: "Vuoi creare nuovo file?",
            icon: "warning",
            dangerMode: true,
            buttons: true,
        })
            .then((willDelete) => {
                if (willDelete) {

                    localStorage.removeItem('CodeScan');
                    loadCodeScan();

                    swal({title: "Vuoi creare nuovo file?", icon: "success" });
                }
            });
        return false;
    });
    // End click newFile


    $('#inputCE').keyup(function (e) {
        if (e.keyCode == 13) {

            AddCE($(this).val());
            $(this).val("");
        }
    });

    /* Start Add CE to List*/
    function AddCE(value, effect = true) {

        if ($('#o-FilterMode')[0].checked == false) {
            if (effect == true) {
                playSound("accept");
                showPopUp("Add:", value, 250)
            }

            $("#listCE").append('<li><label class="count noselect">' +
                ($('ul#listCE li').length + 1).numberFormat('000') +
                ': </label><label class="codeCE">' +
                value +
                '</label><i class="fas fa-times"></i></li>');

            if ($('#o-AutoScroll')[0].checked == true) {
                $('.scrollable-content.containerList').stop().animate({
                    scrollTop: $('#listCE').outerHeight(true)
                }, 500, 'swing');
            }

            updateCodeScan();
            return false;
        }

        value = value.toUpperCase();

        if (pattCE.test(value)) {

            const ceCode = pattCE.exec(value)[0];
            var exist = false;

            if ($('#o-DoubleCode')[0].checked == false) {
                $('ul#listCE li').each(function () {
                    if (pattCE.exec($(this).text())[0] == ceCode) {
                        exist = true;
                        if (effect == true) {
                            playSound("error");
                            showPopUp("Exist:", ceCode, 250);
                        }
                        return false;
                    }
                });
            }

            if (exist == false) {
                if (effect == true) {
                    playSound("accept");
                    showPopUp("Add:", ceCode, 250)
                }

                $("#listCE").append('<li><label class="count noselect">' +
                    ($('ul#listCE li').length + 1).numberFormat('000') +
                    ': </label><label class="codeCE">' +
                    ceCode +
                    '</label><i class="fas fa-times"></i></li>');

                if ($('#o-AutoScroll')[0].checked == true) {
                    $('.scrollable-content.containerList').stop().animate({
                        scrollTop: $('#listCE').outerHeight(true)
                    }, 500, 'swing');
                }

                updateCodeScan();
            }

        } else if (pattCP.test(value)) {

            if (effect == true) {
                playSound("alert");
            }

            const cpCode = pattCP.exec(value)[0];

            swal({
                title: "Vuoi cambiare CP?",
                icon: "warning",
                dangerMode: true,
                buttons: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        $('.top_nav .codeCP').children('b').text(cpCode);
                        updateCodeScan();
                        if (effect == true) {
                            showPopUp("Set Carton Pallet:", cpCode, 500);
                        }
                    }
                });


        } else {
            if (effect == true) {
                showPopUp("Not Recognized:", value, 250)
                playSound("error");
            }
        }
    }
    /* End Add CE to List*/

    // Start Animated element removal
    var FastDeleteEnabled = false;
    $('ul#listCE').on('click', 'li i', function () {


        if (FastDeleteEnabled == false) {
            swal({
                title: "Vuoi eliminare CE?",
                icon: "warning",
                dangerMode: true,
                buttons: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        removeCE($(this).parents('li'));

                        if ($('#o-FastDelete')[0].checked == true) {
                            FastDeleteEnabled = true;
                            setTimeout(function () {
                                FastDeleteEnabled = false;
                            }, 5000);
                        }
                    }
                });
        } else {
            removeCE($(this).parents('li'));
        }
    });

    function removeCE(element) {
        element.animate({ opacity: '0' }, 100, function () {
            element.slideToggle(100, function () {
                element.remove();
                showPopUp("Removed:", $(this).children('label.codeCE').text(), 250)
                updateNumberList();
            });
        });
    }
    // End Animated element removal

    /*Start Script For Toggle Menu JQuery*/
    $("#menu").click(function () {
        $(this).toggleClass("on");
        $(".button_wrap .button_toggle").slideToggle()
        if ($(this).hasClass("on")) {
            $('.input_wrap').animate({
                width: 'toggle',
                'padding-right': 60,
            }, 500);
        } else {
            $('.input_wrap').animate({
                width: 'toggle',
                'padding-right': 0,
            }, 500);
        }

        return false;
    });
    /*End Script For Toggle Menu JQuery*/

    $("#options").click(function () {

        $(".options_box").fadeIn("fast", "linear", function () {
            $(".options_box .box").addClass("on");
        });

        return false;
    });

    $("#opClose, .options_box .clicToClose").click(function () {
        $(".options_box .box").removeClass("on");
        $(".options_box").delay(250).fadeOut("fast");


        return false;
    });

    $('[id^="o-"]').change(function () {
        updateConfig();
    });
});