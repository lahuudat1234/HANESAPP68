var mysql = require("mysql");
require('log-timestamp');
var sql = require("mssql");

var con1 = mysql.createPool({
    connectionLimit: 60,
    host: "pbvweb01v",
    user: "tranmung",
    password: "Tr6nM6ng",
    database: "linebalancing",
});
var con2 = mysql.createPool({
    connectionLimit: 60,
    host: "pbvweb01v",
    user: "tranmung",
    password: "Tr6nM6ng",
    database: "engineering",
});

var config = {
    server: "PBVPAYQSQL1V",
    database: "PBCTS",
    user: "cts",
    password: "Ct$yS123",
    port: 1433,
};

var express = require("express");

var app = express.Router();
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var path = require("path");
var formidable = require("formidable");
var fs = require("fs");
// Python
const { PythonShell } = require("python-shell");
const { query } = require("express");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

function formatDate() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
};

app.get("/quality-laboratory", function (req, res) {
    console.log(req.user);
    if (!req.isAuthenticated()) {
        res.render("login");
    } else {
        res.render("QualityLab/quality-laboratory", { user: req.user });
    }
});

app.post('/quality-laboratory', function (req, res) {
    console.log("POST /quality-laboratory");
    var currentdate = formatDate();
    // console.log(currentdate);
    var dbConn = new sql.Connection(config);
    dbConn.connect().then(function () {
        var request = new sql.Request(dbConn);
        sql_query = ("SELECT t3.Plant,t2.*,t3.setTemp,t3.SetHump,t3.RoomName,DATEDIFF(MINUTE, t2.TimeUpdate,  GETDATE()) AS VarTime"
            + " FROM (SELECT * FROM dbo.INNO_Quality_setup_labroom) t3"
            + " LEFT JOIN"
            + " (SELECT ftr.* FROM (SELECT DISTINCT Location ,MAX(TimeUpdate) as MTime FROM dbo.INNO_Quality_Data_TempuratureHumidity"
            + " WHERE CONVERT(Varchar, TimeUpdate, 121) LIKE '" + currentdate + "%' GROUP BY Location) t1"
            + " LEFT  JOIN  dbo.INNO_Quality_Data_TempuratureHumidity ftr ON ftr.Location =t1.Location AND ftr.TimeUpdate =t1.Mtime) t2"
            + " ON t2.Location=t3.RoomName ORDER BY t3.Plant,t3.RoomName");

        request.query(sql_query).then(function (recordSet) {
            // console.log(sql_query);
            // console.log(recordSet);
            if (recordSet.length > 0) {
                res.send(recordSet);
                res.end();
            } else {
                res.send({ result: 'empty' });
                res.end();
            }
            dbConn.close();
        })
            .catch(function (err) {
                console.log(err);
                res.end();
                dbConn.close();
            });
    })
        .catch(function (err) {
            res.end();
            console.log(err);
        });
});

app.post('/quality-chart', function (req, res) {
    console.log("POST /quality-chart");
    var dbConn = new sql.Connection(config);
    dbConn.connect().then(function () {
        var request = new sql.Request(dbConn);
        sql_query = ("SELECT t.*,l.setTemp, l.setHump FROM"
            + " (SELECT TOP 24 * FROM dbo.INNO_Quality_Data_TempuratureHumidity ORDER BY TimeUpdate DESC) t"
            + " LEFT JOIN dbo.INNO_Quality_setup_labroom l ON l.RoomName=t.Location ORDER BY t.TimeUpdate ASC");
        request.query(sql_query).then(function (recordSet) {
            // console.log(sql_query);
            // console.log(recordSet);
            if (recordSet.length > 0) {
                res.send(recordSet);
                res.end();
            } else {
                res.send({ result: 'empty' });
                res.end();
            }
            dbConn.close();
        })
            .catch(function (err) {
                console.log(err);
                res.end();
                dbConn.close();
            });
    })
        .catch(function (err) {
            res.end();
            console.log(err);
        });
});

app.post('/quality-download', function (req, res) {
    console.log("POST /quality-download");
    var dateFrom = req.body.dateFrom;
    var dateTo = req.body.dateTo;
    var location = req.body.location;
    console.log(dateFrom, dateTo, location);
    console.log("Start download reporting");
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: './public/Python/Quality/',
        pythonOptions: ['-u'],
        args: [dateFrom, dateTo, location]
    }
    let shell = new PythonShell('quality-download-temp.py', options);
    shell.on('message', function (message) {
        console.log(message);
        res.send(message);
        res.end();
    });
});



module.exports = app;