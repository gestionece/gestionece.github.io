// Start Constant
const beepError = new Audio("/resources/sound/beep_error.wav");
const beepAccept = new Audio("/resources/sound/beep_accept.wav");
const beepAlert = new Audio("/resources/sound/beep_alert.wav");

const pattCE = new RegExp(/\d{2}[A-Z]\d[A-Z](\d|[A-Z]){4}\d{8}/);
const pattCP = new RegExp(/CASARS\d{12}/);
// End Constant

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



//Start Storage
function loadConfig() {
    if (typeof (Storage) !== "undefined") {
        if (localStorage.Config) {
            var loadConfig = JSON.parse(localStorage.Config);
            for (nameOption in loadConfig) {
                var idOptions = "#o-" + nameOption;
                $(idOptions)[0].value = loadConfig[nameOption];
                $(idOptions)[0].checked = loadConfig[nameOption];                    
            }
        } else {
            updateConfig()
        }

    } else {
        alert("Sorry, your browser does not support web storage...");
    }
}

function removeLastChar(string) {
    return string.substring(0, string.length - 1)
}

function updateConfig() {
    if (typeof (Storage) !== "undefined") {
        var Config = {};
        $('[id^="o-"]').each(function (index) {
            var nameOption = removeLastChar($(this).prev().text());
            if (Boolean(nameOption)) {
                Config[nameOption] = $(this)[0].checked;
            } else {
                nameOption = removeLastChar($(this).parent().prev('label').text());
                Config[nameOption] = $(this)[0].value;
            }  
        });
        localStorage.Config = JSON.stringify(Config);
    } else {
        alert("Sorry, your browser does not support web storage...");
    }
}

function loadCodeScan() {
    if (typeof (Storage) !== "undefined") {
        if (localStorage.CodeScan) {
            var CodeScan = JSON.parse(localStorage.CodeScan);            
            if (CodeScan.CodeCP) {
                $('.top_nav .codeCP').children('b').text(CodeScan.CodeCP);
            }
            if (CodeScan.CodeCE) {
                CodeScan.CodeCE.forEach(function (code) {
                    $("#listCE").append('<li><label class="count">' +
                        ($('ul#listCE > li').length + 1).numberFormat('000') +
                        ': </label><label class="codeCE">' +
                        pattCE.exec(code)[0] +
                        '</label><i class="fas fa-times"></i></li>');
                });
            }
        } else {
            $('.top_nav .codeCP').children('b').text("ID Carton Pallet");
            $(" ul#listCE li").remove();
            updateCodeScan();
        }
    } else {
        alert("Sorry, your browser does not support web storage...");
    }
}

function updateCodeScan() {
    if (typeof (Storage) !== "undefined") {
        var CodeScan = {};
        CodeScan.CodeCP = $('.top_nav .codeCP').children('b').text();
        var CECodes = [];
        $('ul#listCE li').each(function (index) {
            CECodes[CECodes.length] = pattCE.exec($(this).text())[0];
        });
        CodeScan.CodeCE = CECodes;
        localStorage.CodeScan = JSON.stringify(CodeScan);
    } else {
        alert("Sorry, your browser does not support web storage...");
    }
}

function darkMode() {
    let root = document.documentElement;         
    if ($('#o-DarkMode')[0].checked == true) {   
        root.style.setProperty('--primary-color', "#4CAF50");
        root.style.setProperty('--secondary-color', "#3A4750"); 
        
        root.style.setProperty('--textWhite-color', "#ffffff");
        root.style.setProperty('--textBlack-color', "#000000");
    } else {
        root.style.setProperty('--primary-color', "#2388d0");
        root.style.setProperty('--secondary-color', "#c8d0d6"); 
        
        root.style.setProperty('--textWhite-color', "#000000");
        root.style.setProperty('--textBlack-color', "#ffffff");
    }
}
//End Storage

loadConfig();
darkMode();
loadCodeScan();