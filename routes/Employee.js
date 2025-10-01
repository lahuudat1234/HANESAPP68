var mysql = require("mysql");
require('log-timestamp');
// Python
const { PythonShell } = require("python-shell");
var con1 = mysql.createPool({
  connectionLimit: 500,
  host: "pbvweb01v",
  user: "tranmung",
  password: "Tr6nM6ng",
  database: "linebalancing", authPlugins: {
    mysql_clear_password: () => () => Buffer.from('your_password') // Provide the password as a Buffer
  }
});
var con2 = mysql.createPool({
  connectionLimit: 500,
  host: "pbvweb01v",
  user: "tranmung",
  password: "Tr6nM6ng",
  database: "erpsystem", authPlugins: {
    mysql_clear_password: () => () => Buffer.from('your_password') // Provide the password as a Buffer
  }
});
var con3 = mysql.createPool({
  connectionLimit: 500,
  host: "pbvweb01v",
  user: "tranmung",
  password: "Tr6nM6ng",
  database: "erphtml", authPlugins: {
    mysql_clear_password: () => () => Buffer.from('your_password') // Provide the password as a Buffer
  }
});
var con4 = mysql.createPool({
  connectionLimit: 500,
  host: "pbvweb01v",
  user: "tranmung",
  password: "Tr6nM6ng",
  database: "pr2k", authPlugins: {
    mysql_clear_password: () => () => Buffer.from('your_password') // Provide the password as a Buffer
  }
});
var con5 = mysql.createPool({
  connectionLimit: 500,
  host: "pbvweb01v",
  user: "tranmung",
  password: "Tr6nM6ng",
  database: "cutting_system", authPlugins: {
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
    connection.query(
      "SELECT User, Department, Position, IDName, Name FROM setup_user where User='" +
      user +
      "';",
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


//=====================================EMPLOYEE FUNCTION===========================================
app.get("/Employee", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("Employee/Employee");
  } else {
    res.render("login");
  }
});

app.get("/Employee/TimeSheet", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("Employee/TimeSheet");
  } else {
    res.render("login");
  }
});

app.get("/Employee/SAH", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("Employee/EarnedHours");
  } else {
    res.render("login");
  }
});

app.get("/Employee/Traning", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("Employee/Traning");
  } else {
    res.render("login");
  }
});

app.get("/Employee/Notification", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("Employee/Notification");
  } else {
    res.render("login");
  }
});

app.get("/Employee/Surveys", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("Employee/Employee");
  } else {
    res.render("login");
  }
});


app.post("/Employee/Get_Employee_Infor", function (req, res) {
  var ID = req.body.ID;
  con2.getConnection(function (err, connection) {
    if (err) {
      throw err;
    }
    if (ID == '') sql = "SELECT e.ID, e.NAME, DEPT, e.POSITION, e.TYPE, e.LINE, e.SHIFT, e.PLANT, u.USER from setup_emplist e LEFT JOIN setup_user u ON e.ID=u.IDName WHERE u.USER='" + req.user + "';";
    else sql = "SELECT e.ID, e.NAME, DEPT, e.POSITION, e.TYPE, e.LINE, e.SHIFT, e.PLANT, u.USER from setup_emplist e LEFT JOIN setup_user u ON e.ID=u.IDName WHERE e.ID='" + ID + "';";
    connection.query(sql, function (err, result, fields) {
      connection.release();
      if (err) throw err;
      res.send(result);
      res.end();
    });
  });
});

app.post("/Employee/Get_Employee_TimeSheet", function (req, res) {

  try {
    var ID = req.body.ID;
    var datefrom = req.body.datefrom;
    var dateto = req.body.dateto;
    ID5 = ID;
    if (ID.length > 5) ID5 = ID.substring(1, 6);
    con4.getConnection(function (err, connection) {
      if (err) {
        throw err;
      }
      sql = "SELECT * FROM employee_timesheet WHERE ID LIKE '" + ID5 + "%'  AND DATE>='" + datefrom + "' AND DATE<='" + dateto + "' ORDER BY date;";
      connection.query(sql, function (err, result, fields) {
        connection.release();
        if (err) throw err;
        res.send(result);
        res.end();
      });
    });
  }
  catch (err) {
    console.log(err);
    res.send({ result: 'erro' });
    res.end();

  }
});

module.exports = app;
