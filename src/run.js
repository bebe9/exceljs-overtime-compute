"use strict";

const fs = require('fs');
const path=require('path');
const Excel = require('exceljs');
const workbook = new Excel.Workbook();

const sheetHelper = require('./lib/sheetHelper')
const dealRow = require('./lib/util.js');
const formatSeconds = require('./lib/time').formatSeconds
const getWeek = require('./lib/time').getWeek

let _field = [];
let _fullData = [];

const _selectedFile='./file/origin.xlsx';
const _outPutPath='./file';

run()

function run(event) {
    console.log('srtart compute .....')
    try{
        startParse(event)
    }catch (err){
        console.log(err)
    }
}

function startParse() {

    workbook.xlsx.readFile(_selectedFile)
        .then(function () {
            let worksheet = workbook.getWorksheet(4);
            let fieldRow = worksheet.getRow(3)

            _field = fieldRow.values;
            let holiData=sheetHelper.getHoliData(workbook.getWorksheet(5))

            var dayRange=worksheet.getRow(1).getCell(1).value
            dayRange=dayRange.match(/\d{4}-\d{2}-\d{2}/g)

            _field.forEach((value, index) => {
                if (value == '姓名') {
                    _field[index] = 'userName'
                }
                if (value == '部门') {
                    _field[index] = 'department'
                }
                if (value == '工号') {
                    _field[index] = 'userNum'
                }
            });

            worksheet.eachRow(function (row, rowNumber) {
                if (rowNumber >= 4) {
                    let _tmpRowArr = []
                    row.eachCell({includeEmpty: true}, function (cell, colNumber) {
                        let _tmp = {
                            field: _field[colNumber],
                            value: cell.value
                        }
                        _tmpRowArr.push(_tmp)
                    });
                    _fullData.push(_tmpRowArr)
                }
            });

            var result=[]
            for(let i=0;i<_fullData.length;i++){
                let rowData = _fullData[i];
                let r=dealRow(rowData,dayRange,holiData)
                result.push(r)
            }
            outputFile(result,dayRange)
        });
}

function outputFile(result,dayRange) {
    var workbook = new Excel.Workbook();
    var worksheet  = workbook.addWorksheet('sheet1', {properties:{tabColor:{argb:'FFC0000'}}});
    worksheet = workbook.getWorksheet('sheet1');

    worksheet.columns = [
        { header: '姓名', key: 'userName', width: 15},
        { header: '部门', key: 'department', width: 10 },
        { header: '工号', key: 'userNum', width: 10 },
        { header: '总加班时长(秒)', key: 'totalSeconds', width: 15 },
        { header: '总加班分钟', key: 'totalSecondsF', width: 15 },
        { header: '日期', key: 'date', width: 13},
        { header: '星期', key: 'week', width: 10},
        { header: '补班', key: 'isBuban', width: 10},
        { header: '节假日', key: 'isFangjia', width: 10},
        { header: '异常', key: 'errorCode', width: 8},
        { header: '日加班时长(秒)', key: 'jbSeconds', width: 10},
        { header: '日加班分钟', key: 'jbSecondsF', width: 15},

        { header: '日打卡时间', key: 'signTime', width: 20},
    ];

    for(var item of result){
        for(var sitem of item.signDetail){
            worksheet.addRow({
                    userName:item.userName,
                    department:item.department,
                    userNum:item.userNum,
                    totalSeconds:item.totalSeconds,
                    totalSecondsF:item.totalSecondsF,
                    date:sitem.date,
                    week:getWeek(sitem.date) ,
                    isBuban:sitem.isBuban?'补班':'',
                    isFangjia:sitem.isFangjia?'放假':'',
                    jbSeconds:sitem.jbSeconds,
                    jbSecondsF:formatSeconds(sitem.jbSeconds),
                    signTime:sitem.value,
                    errorCode:sitem.errorCode ? '异常' :'',
                    day1:sitem.D,
                }
            );
        }
    }

    var fname='加班时长统计报表 '+dayRange[0]+'-'+dayRange[1];
    var _outPutFilePath=_outPutPath+'/'+fname+'.xlsx';
    workbook.xlsx.writeFile(_outPutFilePath)
        .then(function() {
            console.log('compute success , this file is in '+_outPutFilePath)
        });
}

module.exports.run=run;




