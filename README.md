## 加班时长计算器 exceljs-overtime-compute

基于nodejs，exceljs 的加班时长计算器

首先解析file/origin.xlx的数据，根据每日打卡时间计算每日加班时长，然后再将数据写入新的excel文件

---

## 启动

```bash
$ git clone https://github.com/bebe9/exceljs-overtime-compute
$ cd exceljs-overtime-compute
$ npm install
$ npm start
```
需要安装nodejs开发环境 [Node.js](https://nodejs.org)

## 加班规则

### 基础规则

1.正常工作时间：8:30-17:30
2.加班时间1  18:30——20:30，按照0.5比列折算可调休时间
3.加班时间2  20:30-24:00，按照1.0比列折算
4.加班时间3：周六、周日，按照1.0比列折算

你可以自己更改对应规则

### 法定假日的处理

在file/origin.xlsx文件内，配置节假日补班调休之信息

## Author

ck
mxstrong@126.com





