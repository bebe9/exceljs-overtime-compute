function getHoliData(sheet) {
    let bubanData=[];
    sheet.getRow(1).values.forEach(function (value,index) {
        if(index>=2){
            bubanData.push(String(value))
        }
    })

    let fangjiaData=[]
    sheet.getRow(2).values.forEach(function (value,index) {
        if(index>=2){
            fangjiaData.push(String(value))
        }
    })

    return {
        bubanData:bubanData,
        fangjiaData:fangjiaData
    }
}


module.exports={
    getHoliData:getHoliData
}