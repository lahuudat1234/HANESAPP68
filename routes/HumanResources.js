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


//=====================================POST GET HTTP=============================================
app.get("/HR/Hanes", function (request, res) {
    if (request.isAuthenticated()) {
        res.render("home", { ID: request.user });
    }
    else {
        res.render("login");
    }
});
app.get("/HR", function (request, res) {
    if (request.isAuthenticated()) {
        res.render("HR/HR_page");
    }
    else {
        res.render("login");
    }
});
app.get("/HR/Departments", function (request, res) {
    if (request.isAuthenticated()) {
        res.render("HR/HR_page");
    }
    else {
        res.render("login");
    }
});
app.get("/HR/ChangeShift", function (request, res) {
    if (request.isAuthenticated()) {
        res.render("HR/HR_page");
    }
    else {
        res.render("login");
    }
});
app.get("/HR/AL", function (request, res) {
    if (request.isAuthenticated()) {
        res.render("HR/HR_page");
    }
    else {
        res.render("login");
    }
});
app.get("/HR/OT", function (request, res) {
    if (request.isAuthenticated()) {
        res.render("HR/HR_page");
    }
    else {
        res.render("login");
    }
});

module.exports = app;
