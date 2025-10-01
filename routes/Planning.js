var mysql = require("mysql");
require('log-timestamp');
// Python
const { PythonShell } = require("python-shell");
var con1 = mysql.createPool({
  connectionLimit: 500,
  host: "pbvweb01v",
  user: "tranmung",
  password: "Tr6nM6ng",
  database: "linebalancing",
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from('your_password') // Provide the password as a Buffer
  }
});
var con2 = mysql.createPool({
  connectionLimit: 500,
  host: "pbvweb01v",
  user: "tranmung",
  password: "Tr6nM6ng",
  database: "erpsystem",
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from('your_password') // Provide the password as a Buffer
  }
});
var con3 = mysql.createPool({
  connectionLimit: 500,
  host: "pbvweb01v",
  user: "tranmung",
  password: "Tr6nM6ng",
  database: "erphtml",
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from('your_password') // Provide the password as a Buffer
  }

});
var con4 = mysql.createPool({
  connectionLimit: 500,
  host: "pbvweb01v",
  user: "tranmung",
  password: "Tr6nM6ng",
  database: "pr2k",
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from('your_password') // Provide the password as a Buffer
  }
});
var con5 = mysql.createPool({
  connectionLimit: 500,
  host: "pbvweb01v",
  user: "tranmung",
  password: "Tr6nM6ng",
  database: "cutting_system",
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from('your_password') // Provide the password as a Buffer
  }
});

var express = require("express");
var app = express.Router();
var formidable = require("formidable");

function get_dept(user, callback) {
  var dept = "";
  con2.getConnection(function (err, connection) {
    if (err) {
      throw err;
    }
    connection.query("SELECT User, Department, Position, IDName, Name FROM setup_user where User='" + user + "';",
      function (err, result, fields) {
        connection.release();
        if (err) throw err;
        if (result.length > 0) {
          // dept=result[0].Department;
          return callback(result);
        }
      }
    );
  });
  return dept;
}

function get_right_dept(dept) {
  right_dept = "";
  switch (dept) {
    case "F&M":
      right_dept = "FM";
      break;
    case "IECT":
      right_dept = "CUT_IE";
      break;
    case "CT":
      right_dept = "CUT_Opr";
      break;
    default:
      right_dept = dept;
  }
  return right_dept;
}

//=====================================PLANNING=============================================
app.get("/Planning/Planning_page", function (request, res) {
  if (request.isAuthenticated()) {
    res.render("Planning/Planning");
  }
  else {
    res.render("login");
  }
});

app.get("/Planning/ProductionPlanning", function (request, res) {
  if (request.isAuthenticated()) {
    res.render("Planning/ProductionPlanning");
  }
  else {
    res.render("login");
  }
})

app.post("/Planning/DailyProduction/LoadSewingPlan", function (req, res) {
  week = req.body.week;
  limit = req.body.limit;
  plant = req.body.plant;
  con2.getConnection(function (err, connection) {
    if (err) {
      throw err;
    }
    sql = "select NAMEGROUP, PLAN as PLANT, CUTLOT, LOTANET, LOTTOTAL, HQAS, COLOR, PACKINGSTYLE, SELLSTYLE, SIZE, TOTAL, TIMEUPDATE, USER from setup_plansewing where WEEK='" + week + "' and Plan like '" + plant + "%' limit " + limit + ", 500;";
    connection.query(sql, function (err, result, fields) {
      connection.release();
      if (err) throw err;
      res.send(result);
      res.end();
    });
  });
});

app.post('/Planning/ProductionPlanning/UploadPBC', function (req, res) {
  var form = new formidable.IncomingForm();
  excelFile = '';
  form.parse(req);
  form.on('fileBegin', function (name, file) {
    excelFile = file.name;
    file.path = './public/Python/Planning/DailyProduction/Upload_Files/' + excelFile;
  });

  form.on('file', function (name, file) {
    var options = {
      mode: 'text',
      pythonPath: 'python',
      scriptPath: './public/Python/Planning/DailyProduction/',
      pythonOptions: ['-u'],
      args: [excelFile, __dirname, req.user]
    }
    let shell = new PythonShell('PhubaiComplex.py', options);
    shell.on('message', function (message) {
      res.send(message)
      res.end();
    });
  });
});

app.post('/Planning/ProductionPlanning/UploadPBIE', function (req, res) {
  var form = new formidable.IncomingForm();
  excelFile = '';
  form.parse(req);
  form.on('fileBegin', function (name, file) {
    excelFile = file.name;
    file.path = './public/Python/Planning/DailyProduction/Upload_Files/' + excelFile;
  });

  form.on('file', function (name, file) {
    var options = {
      mode: 'text',
      pythonPath: 'python',
      scriptPath: './public/Python/Planning/DailyProduction/',
      pythonOptions: ['-u'],
      args: [excelFile, __dirname, req.user]
    }
    let shell = new PythonShell('PhubaiIE.py', options);
    shell.on('message', function (message) {
      res.send(message)
      res.end();
    });
  });
});



module.exports = app;
