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
    var dept = '';
    con2.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        connection.query("SELECT User, Department, Position FROM setup_user where User='" + user + "';", function (err, result, fields) {
            connection.release();
            if (err) throw err;
            if (result.length > 0) {
                // dept=result[0].Department;
                return callback(result);
            }
        });
    });
    return dept;
};

//=====================================POST GET HTTP=============================================
app.get("/QC/QC", function (req, res) {
    res.render("QC/QC");
});
app.get("/QC/Endline", function (req, res) {
    res.render("QC/Endline");
});
app.get("/QC/Report", function (req, res) {
    if (req.isAuthenticated()) {
        get_dept(req.user, function (result) {
            if (result[0].Department == 'QA' || result[0].Department == 'IE') {
                res.render("QC/Report");
            } else {
                res.send("Bạn không có quyền truy cập vào đường link này!");
                res.end();
            }
        })
    } else {
        res.render("login");
    }
});
app.post('/QC/Report/Endline', function (req, res) {
    if (req.isAuthenticated()) {
        get_dept(req.user, function (result) {
            if (result[0].Department == 'QA' || result[0].Department == 'IE') {
                var datefrom = req.body.datefrom;
                var shift = req.body.shift;
                var options = {
                    mode: 'text',
                    pythonPath: 'python',
                    scriptPath: './public/Python/QC/Endline',
                    pythonOptions: ['-u'], // get print results in real-time
                    args: [datefrom, shift]
                };
                let shell = new PythonShell('Endline.py', options);
                shell.on('message', function (message) {
                    // res.setHeader("Content-type", "application/json")
                    res.send(message);
                    res.end();
                });
            }
        });
    } else {
        res.render("login");
    }
});
app.post('/QC/Endline/PlantSummary', function (req, res) {
    var date = req.body.date;
    con4.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            throw err;
        }
        connection.query("select employee_scanticket.PLANT, employee_scanticket.IRR, qc_irr_code.IRR_NAME, qc_irr_code.SOURCE, count(employee_scanticket.IRR) AS IRR_COUNT, count(distinct employee_scanticket.BUNDLE) AS BUNDLE_COUNT"
            + " from employee_scanticket left join qc_irr_code on employee_scanticket.IRR=qc_irr_code.ID"
            + " where WORK_LOT is not null and DATE='" + date + "' and"
            + " (TICKET not like '%100' or TICKET not like '%026' or TICKET not like '%116')"
            + " group by PLANT, IRR;", function (err, result, fields) {
                connection.release();
                if (err) throw err;
                if (result.length > 0) {
                    res.send(result);
                    res.end();
                } else {
                    var data = { result: 'empty' };
                    res.send(data);
                    res.end();
                }
            });
    });
});
app.post('/QC/Endline/FacemaskSummary', function (req, res) {
    var date = req.body.date;
    con4.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            throw err;
        }
        connection.query("select employee_scanticket.IRR, qc_irr_code.IRR_NAME, qc_irr_code.SOURCE, count(employee_scanticket.IRR) AS IRR_COUNT, count(distinct employee_scanticket.BUNDLE) AS BUNDLE_COUNT"
            + " from employee_scanticket left join qc_irr_code on employee_scanticket.IRR=qc_irr_code.ID"
            + " where WORK_LOT is not null and DATE='" + date + "' and STYLE='HBMSKE' and"
            + " (TICKET not like '%100' or TICKET not like '%026' or TICKET not like '%116')"
            + " group by IRR;", function (err, result, fields) {
                connection.release();
                if (err) throw err;
                if (result.length > 0) {
                    res.send(result);
                    res.end();
                } else {
                    var data = { result: 'empty' };
                    res.send(data);
                    res.end();
                }
            });
    });
});

app.post('/QC/Endline/MUWSummary', function (req, res) {
    var date = req.body.date;
    con4.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            throw err;
        }
        connection.query("select employee_scanticket.IRR, qc_irr_code.IRR_NAME, qc_irr_code.SOURCE, count(employee_scanticket.IRR) AS IRR_COUNT, count(distinct employee_scanticket.BUNDLE) AS BUNDLE_COUNT"
            + " from employee_scanticket left join qc_irr_code on employee_scanticket.IRR=qc_irr_code.ID"
            + " where WORK_LOT is not null and DATE='" + date + "' and STYLE!='HBMSKE' and"
            + " (TICKET not like '%100' or TICKET not like '%026' or TICKET not like '%116')"
            + " group by IRR;", function (err, result, fields) {
                connection.release();
                if (err) throw err;
                if (result.length > 0) {
                    res.send(result);
                    res.end();
                } else {
                    var data = { result: 'empty' };
                    res.send(data);
                    res.end();
                }
            });
    });
});
app.get("/QC/Documentation", function (req, res) {
    res.render("QC/Documentation");
});
app.get("/QC/Remark", function (req, res) {
    res.render("QC/Remark");
});


module.exports = app;
