// Start Constant
const beepError = new Audio("/resources/sound/beep_error.wav");
const beepAccept = new Audio("/resources/sound/beep_accept.wav");
const beepAlert = new Audio("/resources/sound/beep_alert.wav");

const pattCE = new RegExp(/\d{2}[A-Z]\d[A-Z](\d|[A-Z]){4}\d{8}/);
const pattCP = new RegExp(/CASARS\d{12}/);
// End Constant

//Start Storage
function loadlStorage() {
    if (typeof (Storage) !== "undefined") {
        if (localStorage.CPCode) {
            $('.top_nav .codeCP').children('b').text(localStorage.CPCode);
        } else {
            $('.top_nav .codeCP').children('b').text("ID Carton Pallet");
        }

        if (localStorage.CECode) {

            var CECodes = JSON.parse(localStorage.CECode);
            CECodes.forEach(function (code) {
                $("#listCE").append('<li><label class="count">' +
                    ($('ul#listCE > li').length + 1).numberFormat('000') +
                    ': </label><label class="codeCE">' +
                    pattCE.exec(code)[0] +
                    '</label><i class="fas fa-times"></i></li>');
            });
        } else {
            $(" ul#listCE li").remove();
        }
    } else {
        alert("Sorry, your browser does not support web storage...");
    }
}

function addCPStorage(CP) {
    if (typeof (Storage) !== "undefined") {
        localStorage.CPCode = CP.toString();
    } else {
        alert("Sorry, your browser does not support web storage...");
    }
}

function addCEStorage(CE) {
    if (typeof (Storage) !== "undefined") {
        if (localStorage.CECode) {
            var CECodes = JSON.parse(localStorage.CECode);
            CECodes[CECodes.length] = CE;
            localStorage.CECode = JSON.stringify(CECodes);
        } else {
            localStorage.CECode = JSON.stringify([CE]);
        }
    } else {
        alert("Sorry, your browser does not support web storage...");
    }
}
//End Storage

function updateNumberList() {
    var CECodes = [];

    $('ul#listCE li').each(function (index) {
        $(this).children('label.count').text((index + 1).numberFormat('000') + ': ');
        $(this).children('label.codeCE').text(pattCE.exec($(this).text())[0]);

        CECodes[CECodes.length] = pattCE.exec($(this).text())[0];
        localStorage.CECode = JSON.stringify(CECodes);
    });
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

/* Start Method for chang space for zero 1->01 "1 22 333 4444 a1 a22 1b 11".numberFormat("000") */
String.prototype.numberFormat = function (format) {
    return this.replace(/\b\d+(?!\S)/g, function (num) {
        return format.toString().substr(num.length) + num;
    });
}

Number.prototype.numberFormat = function (format) {
    return this.toString().replace(/\b\d+(?!\S)/g, function (num) {
        return format.toString().substr(num.length) + num;
    });
}
/* End Method for chang space for zero 1->01 "1 22 333 4444".numberFormat("000") */

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

//document.body.requestFullscreen();
$(document).ready(function () {
    loadlStorage();
    //Add Code

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

                    var MsgWhatsApp = localStorage.CPCode;
                    JSON.parse(localStorage.CECode).forEach(function (code) {
                        MsgWhatsApp += '%0D%0A' + code;
                    });

                    window.open("https://wa.me/?text=" + MsgWhatsApp, '_blank').focus();
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

                    var data = localStorage.CPCode;
                    JSON.parse(localStorage.CECode).forEach(function (code) {
                        data += '\n' + code;
                    });

                    download(data, localStorage.CPCode, ".txt")

                    swal({ icon: "success", timer: 1000, });
                }
            });
        return false;
    });
    // End click download

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

                    localStorage.removeItem('CECode');
                    localStorage.removeItem('CPCode');
                    loadlStorage();

                    swal({ icon: "success", timer: 1000, });
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
    function AddCE(value) {

        if (pattCE.test(value)) {
            beepAccept.play();
            const ceCode = pattCE.exec(value)[0];

            addCEStorage(ceCode)

            showPopUp("Add:", ceCode, 500)

            $("#listCE").append('<li><label class="count">' +
                ($('ul#listCE li').length + 1).numberFormat('000') +
                ': </label><label class="codeCE">' +
                ceCode +
                '</label><i class="fas fa-times"></i></li>');

            $('.scrollable-content.containerList').stop().animate({
                scrollTop: $('#listCE').outerHeight(true) 
            }, 500, 'swing');

        } else if (pattCP.test(value)) {
            beepAlert.play();

            const cpCode = pattCP.exec(value)[0];

            swal({
                title: "Vuoi cambiare CP?",
                icon: "warning",
                dangerMode: true,
                buttons: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        addCPStorage(cpCode);
                        showPopUp("Set Carton Pallet:", cpCode, 1000)
                        $('.top_nav .codeCP').children('b').text(cpCode);
                    }
                });


        } else {
            beepError.play();
        }
    }
    /* End Add CE to List*/

    // Start Animated element removal
    $('ul#listCE').on('click', 'li i', function () {

        swal({
            title: "Vuoi eliminare CE?",
            icon: "warning",
            dangerMode: true,
            buttons: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    var el = $(this).parents('li');
                    el.animate({ opacity: '0' }, 100, function () {
                        el.slideToggle(100, function () {
                            el.remove();
                            showPopUp("Removed:", $(this).children('label.codeCE').text(), 500)
                            updateNumberList();
                        });
                    });
                }
            });
    });
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
});