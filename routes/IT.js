var express = require("express");
var sql = require("mssql");
var mysql = require("mysql");
require('log-timestamp');

var app = express.Router();
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var path = require("path");
var formidable = require('formidable');
var fs = require('fs');
// Python
const { PythonShell } = require("python-shell");
var config = {
  server: "PBVPAYQSQL1V",
  database: "PBCTS",
  user: "cts",
  password: "Ct$yS123",
  port: 1433,
};

var con1 = mysql.createPool({
  connectionLimit: 500,
  host: 'pbvweb01v',
  user: 'tranmung',
  password: 'Tr6nM6ng',
  database: 'mms',
  multipleStatements: true,
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from('your_password') // Provide the password as a Buffer
  }
});

var con2 = mysql.createPool({
  connectionLimit: 500,
  host: 'pbvweb01v',
  user: 'tranmung',
  password: 'Tr6nM6ng',
  database: 'mms',
  multipleStatements: true,
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from('your_password') // Provide the password as a Buffer
  }
});


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true, }));
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
}

app.get("/IT/Home", function (request, response) {

  if (request.isAuthenticated()) {
    response.render("IT/IT-Tempurature");
  }
  else {
    response.render("login");
  }
});


app.get("/IT/Tempurature", function (request, response) {

  if (request.isAuthenticated()) {
    response.render("IT/IT-Tempurature");
  }
  else {
    response.render("login");
  }
});

app.post('/IT/generateTemp', function (req, res) {
  console.log("POST /IT/generateTemp");
  var currentdate = formatDate();
  var dbConn = new sql.Connection(config);
  dbConn.connect().then(function () {
    var request = new sql.Request(dbConn);
    sql_query = ("SELECT t3.Plant,t2.*,t3.setTemp,t3.LocationName"
      + " FROM (SELECT * FROM dbo.INNO_setup_location_tempurature) t3"
      + " LEFT JOIN"
      + " (SELECT ftr.* FROM (SELECT DISTINCT Location ,MAX(TimeUpdate) as MTime FROM dbo.INNO_tempurature_realtime WHERE CONVERT(Varchar, TimeUpdate, 121) LIKE '" + currentdate + "%' GROUP BY Location) t1"
      + " LEFT  JOIN  dbo.INNO_tempurature_realtime ftr ON ftr.Location =t1.Location AND ftr.TimeUpdate =t1.Mtime) t2"
      + " ON t2.Location=t3.LocationName ORDER BY t3.Plant,t3.LocationName");
    request.query(sql_query).then(function (recordSet) {
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

app.post('/IT/init_TempChart', function (req, res) {
  console.log("/FM/init_TempChart");
  var area = req.body.Location;
  var currentdate = formatDate();
  var dbConn = new sql.Connection(config);
  dbConn.connect().then(function () {
    var request = new sql.Request(dbConn);
    sql_query = ("SELECT m.*, s.setTemp,CONVERT(VARCHAR(8),m.Timeupdate,108) AS Xlabel"
      + " FROM (SELECT TOP 36 * from dbo.INNO_tempurature_realtime t WHERE t.Location='" + area + "'AND CONVERT(Varchar, t.TimeUpdate, 121) LIKE '" + currentdate + "%' ORDER BY T.Timeupdate DESC) m"
      + " LEFT JOIN dbo.INNO_setup_location_tempurature s ON s.LocationName=m.Location ORDER BY m.Timeupdate ASC;");
    request.query(sql_query).then(function (recordSet) {
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

app.post("/IT/Report/Download", function (req, res) {
  var date_report = req.body.date_report;
  console.log("Start download reporting");
  var options = {
    mode: 'text',
    pythonPath: 'python',
    scriptPath: './public/downloadFMReport/runPython/',
    pythonOptions: ['-u'],
    args: [date_report]
  }
  let shell = new PythonShell('report_FMTemp.py', options);
  shell.on('message', function (message) {
    res.send(message);
    res.end();
  });
});


module.exports = app;