function formatSeconds (value) {
    var theTime = parseInt(value);// 秒

    if(!theTime){
        return ''
    }

    var theTime1 = 0;
    var theTime2 = 0;
    if (theTime > 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (theTime1 > 60) {
            theTime2 = parseInt(theTime1 / 60);
            theTime1 = parseInt(theTime1 % 60);
        }
    }
    var result = "" + parseInt(theTime) + "秒";
    if (theTime1 > 0) {
        result = "" + parseInt(theTime1) + "分" + result;
    }
    if (theTime2 > 0) {
        result = "" + parseInt(theTime2) + "小时" + result;
    }
    return result;
}

function getTimestamp(stringTime) {
    var timestamp = Date.parse(new Date(stringTime));
    timestamp = timestamp / 1000;
    return timestamp
}

function getWeek(stringTime,isChinese=true) {
    var _wt=['日','一','二','三','四','五','六'];
    var arys1= new Array();
    arys1=stringTime.split('-');
    var ssdate=new Date(arys1[0],parseInt(arys1[1]-1),arys1[2]);
    var w=ssdate.getDay()
    if(isChinese){
        return '星期'+ _wt[w]
    }
    return w
}

module.exports.getWeek=getWeek;
module.exports.formatSeconds=formatSeconds;
module.exports.getTimestamp=getTimestamp;
