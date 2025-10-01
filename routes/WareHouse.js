var mysql = require("mysql");
// Python
const { PythonShell } = require("python-shell");
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
  database: "erpsystem",
});
var con3 = mysql.createPool({
  connectionLimit: 60,
  host: "pbvweb01v",
  user: "tranmung",
  password: "Tr6nM6ng",
  database: "erphtml",

});
var con4 = mysql.createPool({
  connectionLimit: 60,
  host: "pbvweb01v",
  user: "tranmung",
  password: "Tr6nM6ng",
  database: "pr2k",
});
var con5 = mysql.createPool({
  connectionLimit: 60,
  host: "pbvweb01v",
  user: "tranmung",
  password: "Tr6nM6ng",
  database: "cutting_system",
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
    connection.query("SELECT User, Department, Position, IDName, Name FROM setup_user where User='" + user +"';",
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

//=====================================WAREHOUSE==========================================
app.get("/Warehouse/Warehouse", function(req, res){
  res.render("Warehouse/Warehouse");
});
app.get("/Warehouse/Ultilization", function(req, res){
  res.render("Warehouse/Warehouse");
});


app.get("/Warehouse/Phubai1", function(req, res){
  if (req.isAuthenticated()) {
      get_dept(req.user, function(result){
          if (req.user!='mutran'&&req.user!='dala'&&result[0].Department!='LP'&&req.user!='nale'&&req.user!='tranmung') {
              res.send('You dont have permission to access this page!');
              res.end();
          } 
          else res.render("Warehouse/Phubai1");
      });
  } else {
      res.render("login");
  }
});

app.get("/Warehouse/Phubai2", function(req, res){
  if (req.isAuthenticated()) {
      get_dept(req.user, function(result){
          if (req.user!='mutran'&&req.user!='dala'&&result[0].Department!='LP'&&req.user!='tranmung') {
              res.send('You dont have permission to access this page!');
              res.end();
          } 
          else res.render("Warehouse/Phubai2");
      });
  } else {
      res.render("login");
  }
});

app.get("/Warehouse/PhubaiIE", function(req, res){
  if (req.isAuthenticated()) {
      get_dept(req.user, function(result){
          if (req.user!='mutran'&&result[0].Department!='LP'&&req.user!='tranmung') {
              res.send('You dont have permission to access this page!');
              res.end();
          } 
          else res.render("Warehouse/PhubaiIE");
      });
  } else {
      res.render("login");
  }
});

app.get("/Warehouse/Cutting", function(req, res){
  res.render("Warehouse/Cutting");
});

app.get("/Warehouse/Cutpart", function(req, res){
  if (req.isAuthenticated()) {
      get_dept(req.user, function(result){
          if (req.user!='mutran'&&result[0].Department!='LP') {
              res.send('You dont have permission to access this page!');
              res.end();
          } 
          res.render("Warehouse/Cutpart");
      });
  } else {
      res.render("login");
  }
});

app.get("/Warehouse/CutpartInfo", function(req, res){
  res.render("Warehouse/CutpartInfo");
});



module.exports = app;
