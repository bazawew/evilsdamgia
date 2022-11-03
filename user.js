// ==UserScript==
// @name         evil sdamgia
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license      MIT
// @description  evil sdamgia be like "show answers"
// @author       bazawew
// @match        http*://*.sdamgia.ru/test?id=*
// @icon         https://raw.githubusercontent.com/bazawew/evilsdamgia/main/image.ico
// @grant        none
// ==/UserScript==

//thx @Maxsior for sdamege hacks tho :3

const bregex = /<b>|<\/b>/g

var tasks = document.getElementsByClassName('nobreak');
for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i].getElementsByClassName('prob_nums')[0].innerHTML
    var sysid = tasks[i].parentElement.id.replace('maindiv', '');

    var currtexth = tasks[i].querySelectorAll('[id^=texth]');
    if (currtexth.length != 0) {
        var taskid = currtexth[0].id.replace('texth', '')
        console.log("Номер " + task + " -- это " + taskid);
        tasks[i].getElementsByClassName('prob_nums')[0].innerHTML += "\nЗадание № " + taskid;

        const tasktext = (await (await fetch("https://" + location.host + '/problem?id=' + taskid)).text());
        const taskdom = new DOMParser().parseFromString(tasktext, 'text/html');
        //console.log(taskdom.getElementById("sol" + taskid));
        tasks[i].appendChild(taskdom.getElementById("sol" + taskid));
    }
    else {
        var taskcond = tasks[i].getElementsByClassName('pbody')[0];
        var textcond = "";
        for (var j = 0; j < taskcond.children.length; j++) {
            var singlestr = taskcond.children[j].innerHTML.replace(bregex, '');
            if (j != 0 && singlestr.trim() != '' && singlestr != '&nbsp;') {
                textcond += singlestr;
                break;
            }
        }
        //console.log(textcond);
        //const searchtext = (await (await fetch("https://" + location.host + '/problem?id=' + tasks[i].getElementByid)).text());
        for (j = 0; j < 10; j++) { //тип 8 крашит точно, остальные - возможно))0)
            console.log(j);
            const tasktext = (await (await fetch("https://" + location.host + '/problem?id=' + textcond + '&page=' + (j + 1))).text());
            const taskdom = new DOMParser().parseFromString(tasktext, 'text/html');
            const maindiv = taskdom.getElementById("maindiv" + sysid);
            if (maindiv != null) {
                //console.log(maindiv.children[1]);
                taskid = maindiv.children[1].id.replace('sol', '');
                console.log("Номер " + task + " -- это " + taskid);
                tasks[i].getElementsByClassName('prob_nums')[0].innerHTML += "\nЗадание № " + taskid;
                maindiv.children[1].style="clear:both;";
                tasks[i].appendChild(maindiv.children[1]);
                break;
            }
        }

        //tasks[i].appendChild(taskdom.getElementById("maindiv" + sysid)
        //.children[1]);
    }

    console.log("Айди " + task + " -- это " + sysid);
    tasks[i].getElementsByClassName('prob_nums')[0].innerHTML += "\nID=" + sysid;
}
