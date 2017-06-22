const _t = require('./time')

const getTimestamp = _t.getTimestamp
const formatSeconds = _t.formatSeconds

function getJbTime(date) {
    var shangBan = getTimestamp(date + ' 08:30')
    var xiaBan = getTimestamp(date + ' 17:30')

    var timeStr1 = getTimestamp(date + ' 18:30');
    var timeStr2 = getTimestamp(date + ' 20:30');
    var timeStr3 = getTimestamp(date + ' 23:59');

    var jbRange1 = (timeStr2 - timeStr1) / 2

    return {
        'shangBan': shangBan,
        'xiaBan': xiaBan,
        'jbStar': timeStr1,
        'jbEnd1': timeStr2,
        'jbEnd2': timeStr3,
        'jbRange1': jbRange1
    }
}


function getTimeArr(str) {
    if (!str) {
        return null
    }
    var timeArr = str.match(/\d{2}:\d{2}/g)
    return timeArr
}

function dealRow(data, dayRange,holiData) {

    var startDay = dayRange[0]
    var endDay = dayRange[1]
    var month = startDay.substring(0, 7)

    var userName = data[0]['value']
    var department = data[1]['value']
    var userNum = data[2]['value']
    var signDetail= []
    var totalSeconds=0

    for (var i = 0; i < data.length; i++) {
        if (i >= 4) {
            let item = data[i];
            item.errorCode=0

            let D = item.field
            if (D == '六') {
                if(i==4){
                    D = String(parseInt(data[i +2]['field']) -2)
                }else{
                    D = String(parseInt(data[i - 1]['field']) + 1)
                }
            }
            if (D == '日') {
                if(i<=5){
                    D = String(parseInt(data[i +1]['field']) -1)
                }else{
                    D = String(parseInt(data[i - 2]['field']) + 2)
                }
            }
            var date = month + '-' + (D < 10 ? '0' : '') + D
            item.D=D
            item.date=date
            item.timePoints = getTimeArr(item.value)

            if(holiData.bubanData.indexOf(D)>=0){
                item.isBuban=1
            }else{
                item.isBuban=0
            }

            if(holiData.fangjiaData.indexOf(D)>=0){
                item.isFangjia=1
            }else{
                item.isFangjia=0
            }

            var res=getOneDaySeconds(date, item.timePoints,item.field,item.isBuban,item.isFangjia)
            item.jbSeconds=res.s;
            item.errorCode=res.errorCode
            signDetail.push(item)
            totalSeconds += res.s
        }
    }

    var _d={
        userName:userName,
        department:department,
        userNum:userNum,
        totalSeconds:totalSeconds,
        totalSecondsF:formatSeconds(totalSeconds),
        signDetail:signDetail,
    }
    return _d
}


function getOneDaySeconds(date, timePoints,field,isBuban,isFangjia) {
    if (!timePoints || !timePoints.length) {
        return {
            s:0,
            errorCode:0
        }
    }
    if (field == '六' || field == '日') {
        if(isBuban){
            return getWorkDaySecond(date,timePoints)
        }else {
            return getHoliDaySecond(date,timePoints)
        }
    } else {
        if(isFangjia){
            return getHoliDaySecond(date,timePoints)
        }else {
            return getWorkDaySecond(date,timePoints)
        }
    }
}

function getWorkDaySecond(date,timePoints) {
    var timeCheck = getJbTime(date)

    var lastPoint = date + ' ' + timePoints[timePoints.length - 1]
    var lastPointTime = getTimestamp(lastPoint)

    var jbSeconds = 0;
    if (lastPointTime > timeCheck.jbStar & lastPointTime <= timeCheck.jbEnd1) {
        jbSeconds += (lastPointTime - timeCheck.jbStar) / 2
    } else if (lastPointTime > timeCheck.jbEnd1 & lastPointTime <= timeCheck.jbEnd2) {
        jbSeconds += timeCheck.jbRange1
        jbSeconds += lastPointTime - timeCheck.jbEnd1
    }
    return {
        s:jbSeconds,
        errorCode:0
    }
}

function getHoliDaySecond(date,timePoints) {
    if(timePoints.length <= 1){
        return {
            s:0,
            errorCode:1
        }
    }
    var startPoint = date + ' ' + timePoints[0]
    var lastPoint = date + ' ' + timePoints[timePoints.length - 1]
    return {
        s:getTimestamp(lastPoint) - getTimestamp(startPoint),
        errorCode:0
    }
}

module.exports = dealRow;
