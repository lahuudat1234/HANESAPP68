var mysql = require("mysql");
var nodemailer = require('nodemailer');
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
//Extend Combine
var con_server_cutting = mysql.createPool({
    connectionLimit: 500,
    host: "pbvweb01v",
    user: "tranmung",
    password: "Tr6nM6ng",
    database: "cutting_system",
    authPlugins: {
        mysql_clear_password: () => () => Buffer.from('your_password') // Provide the password as a Buffer
    }
});
var con2 = mysql.createPool({
    connectionLimit: 500,
    host: 'pbvweb01v',
    user: 'tranmung',
    password: 'Tr6nM6ng',
    database: 'erpsystem',
    authPlugins: {
        mysql_clear_password: () => () => Buffer.from('your_password') // Provide the password as a Buffer
    }
});
var con_server_linebalance = mysql.createPool({
    connectionLimit: 500,
    host: "pbvweb01v",
    user: "tranmung",
    password: "Tr6nM6ng",
    database: "linebalancing",
    authPlugins: {
        mysql_clear_password: () => () => Buffer.from('your_password') // Provide the password as a Buffer
    }
});
var con4 = mysql.createPool({
    connectionLimit: 500,
    host: "pbvweb01v",
    user: "tranmung",
    password: "Tr6nM6ng",
    database: "linebalancing",
    authPlugins: {
        mysql_clear_password: () => () => Buffer.from('your_password') // Provide the password as a Buffer
    }
});
// var con_lead_humility = mysql.createPool({
//     connectionLimit: 500,
//     host: 'pbvweb01v',
//     user: 'tranmung',
//     password: 'Tr6nM6ng',
//     database: 'leadwithhumility'
// });
// var mms_con = mysql.createPool({
//     connectionLimit: 500,
//     host: 'pbvweb01v',
//     user: 'tranmung',
//     password: 'Tr6nM6ng',
//     database: 'mms'
// });

var sql = require("mssql");

var config = {
    server: "PBVPAYQSQL1V",
    database: "PBCTS",
    user: "cts",
    password: "Ct$yS123",
    port: 1433,
};

var datetime = require('node-datetime');
var express = require("express");
var app = express.Router();
var formidable = require("formidable");
var bodyParser = require('body-parser');

function rfid_convert(rfid_inp, callback) {
    rfid = parseInt(rfid_inp);  //00542325
    var hexstring = rfid.toString(16);
    var emphex = hexstring.substring(2, hexstring.length);
    while (emphex.length < 8) {
        emphex = '0' + emphex;
    };
    var last4Digit = emphex.substring(4, 9);
    var pre4Digit = emphex.substring(0, 4);
    if (pre4Digit.length >= 3) {
        pre4Digit = parseInt(pre4Digit.substring(pre4Digit.length - 2, pre4Digit.length), 16).toString()
    };
    last4Digit = parseInt(last4Digit, 16).toString();
    while (pre4Digit.length < 3) {
        pre4Digit = '0' + pre4Digit;
    }
    while (last4Digit.length < 5) {
        last4Digit = '0' + last4Digit;
    }
    var emp8Digits = pre4Digit + last4Digit;
    return callback(emp8Digits);
};

function Query_get_name(register, callback) {
    con2.getConnection(function (err, connection3) {
        if (err) throw err; // not connected!
        connection3.query('SELECT name,shift,type FROM setup_emplist WHERE ID="' + register + '"', function (err, result, fields) {
            connection3.release();
            if (err) throw err;
            if (result.length > 0) {
                return callback(result);
            } else {
                return callback("invalid");
            };
        });
    });
};


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
};

function send(purchaser, subject, content) {
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        auth: {
            user: "PBAssistant@hanes.com",
            pass: "xLkUmsMZkbPaLAwcWSgMGhwWMTYk67"
        }
    });
    var mailOptions = {
        from: get(sent),
        to: "Mung.Tran@hanes.com",
        subject: "Hello",
        text: "",
        html: "abc"
            + "<div>Thanks, TranMung<div>"
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log("error: ", err);
        }
        else {
            console.log("email sent", info);
            transporter.close();
        }
    });
};
//=====================================CUTTING EXTEN=======================================
app.get('/cut_kanban_pro', function (req, res) {
    res.redirect('http://10.113.90.40/cut_kanban_pro');
    res.end()
})
app.get('/Cutting/AutoKanban', function (req, res) {
    res.redirect('http://10.113.90.40/cut_kanban_pro');
    res.end()
})

app.get("/cutting/off_standard", function (req, res) {
    var dt = datetime.create();
    var format_date = dt.format("Ymd");
    var dat = dt.format("d/m/Y");
    var past = '2019-12-29 00:00:00';
    var pastDateTime = datetime.create(past);
    var Difference_In_Time = dt.getTime() - pastDateTime.getTime();
    var week = 1 + Math.floor(Difference_In_Time / (1000 * 3600 * 24 * 7));
    con_server_linebalance.getConnection(function (err, connection_off) {
        if (err) throw err;
        var query_group = 'select groupname from web_ie_location where line<"Line 354" group by groupname order by groupname desc;';
        connection_off.query(query_group, function (err, result, fields) {
            connection_off.release();
            if (err) throw err;
            if (result.length > 0) {
                var tb = '';
                var i;
                for (i = 0; i < result.length; i++) {
                    tb += '<option>' + result[i].groupname + '</option>';
                }
                var restext = { name: 'Quét thẻ hoặc nhập mã số và nhấn Enter', 'listgroup': tb, 'dat': dat, 'table_body': "" };
                // var jsres=JSON.stringify(restext);
                res.render("IE/off_reg_cutting", restext);

            } else {
                res.render("IE/off_reg_cutting", { name: 'Tên Nhân Viên', 'listgroup': tb, 'dat': dat, 'table_body': "" });
            }
        });
    });

});

app.get("/getname/:emp_id", function (request, response) {
    var emp_id = request.params.emp_id;
    var dt = datetime.create();
    var format_date = dt.format("Y-m-d 00:00:00");
    var dat = dt.format("d/m/Y");
    var past = '2019-12-29 00:00:00';
    var pastDateTime = datetime.create(past);
    var Difference_In_Time = dt.getTime() - pastDateTime.getTime();
    var week = 1 + Math.floor(Difference_In_Time / (1000 * 3600 * 24 * 7));
    var shift = "RIT";
    rfid_convert(emp_id, function (result) {
        if (emp_id.length > 6) {
            emp_id = result;
            // mã 10 số
            con2.getConnection(function (err, connection_rfid) {
                connection_rfid.query('select employeeid,name from setup_rfidemplist where cardno="' + emp_id + '";', function (err2, result2, fields) {
                    connection_rfid.release();
                    if (err2) throw err2;
                    if (result2.length > 0) {
                        emp_id = result2[0].employeeid;
                        var emp_name = "invalid"
                        Query_get_name(emp_id, function (result) {
                            var shift_q = "RIT";
                            var typ = "IN";
                            if (result != "invalid") {
                                emp_name = result[0].name;
                                shift_q = result[0].shift;
                                typ = result[0].type;
                            }
                            if (shift_q.substring(0, 1) == "R") {
                                shift = "RIT";
                            } else {
                                shift = "BALI"
                            }
                            var emp_id5 = parseInt(emp_id).toString();
                            con_server_linebalance.getConnection(function (err, connection6) {
                                connection6.query('select wc,code,operation1,operation2,efficiency2,groupto,starttime,note from operation_offstandard_tracking where ID="' + emp_id5 + '" and dateupdate="' + format_date + '" and spantime is null', function (err, result1, fields) {
                                    connection6.release();
                                    if (err) throw err;
                                    if (result1.length > 0) {
                                        var status = "Bạn đã mở ticket trước đó";
                                        var d_in = datetime.create(result1[0].starttime);
                                        var date_in = d_in.format("Y-m-d H:M:S")
                                        var time_in = "-";
                                        var restext = [{ 'name': emp_name, 'id6': emp_id, 'st': status, 'di': date_in, 'ti': typ, 'shift': shift, 'result': result1 }];
                                        var jsres = JSON.stringify(restext);
                                        response.send(restext);
                                        response.end();
                                    }
                                    else {
                                        var status = "Bạn chưa mở ticket";
                                        var date_in = "-";
                                        var time_in = "-";
                                        con_server_linebalance.getConnection(function (err, con_newticket) {
                                            if (err) throw err;
                                            con_newticket.query('select wc,operation1,operation2,efficiency2,operation3,efficiency3,code from employee_offstandard_register where id="' + emp_id5 + '" and weekupdate="' + week + '" group by wc', function (err, result_newticket, fileds) {
                                                con_newticket.release();
                                                if (err) throw err;
                                                if (result_newticket.length > 0) {

                                                    var restext = [{ 'name': emp_name, 'id6': emp_id, 'st': status, 'di': date_in, 'ti': typ, 'shift': shift, 'result': result_newticket }];
                                                    var jsres = JSON.stringify(restext);
                                                    response.send(restext);
                                                    response.end();

                                                } else {
                                                    status = "ID chưa được đăng ký!"
                                                    var restext = [{ 'name': emp_name, 'id6': emp_id, 'st': status, 'di': date_in, 'ti': typ, 'shift': shift, 'result': "" }];
                                                    var jsres = JSON.stringify(restext);
                                                    response.send(restext);
                                                    response.end();
                                                }


                                            });
                                        });

                                    }


                                });
                            });
                        });
                    } else {
                        var status = "không dò được mã thẻ, vui lòng nhập tay";
                        var date_in = "-";
                        var time_in = "-";
                        var typ = "-";
                        var restext = [{ 'name': emp_name, 'id6': emp_id, 'st': status, 'di': date_in, 'ti': typ, 'shift': shift, 'result': "" }];
                        var jsres = JSON.stringify(restext);
                        response.send(restext);
                        response.end();
                    };

                });
            });

        } else {
            // mã 6 số
            var emp_name = "invalid"
            while (emp_id.length < 6) {
                emp_id = '0' + emp_id;
            }
            if (emp_id.toString().length == 6) {
                Query_get_name(emp_id, function (result) {
                    var shift_q = "RIT";
                    var typ = "IN";
                    if (result != "invalid") {
                        emp_name = result[0].name;
                        shift_q = result[0].shift;
                        typ = result[0].type;
                    }
                    if (shift_q.substring(0, 1) == "R") {
                        shift = "RIT";
                    } else {
                        shift = "BALI"
                    }

                    var emp_id5 = parseInt(emp_id).toString();
                    con_server_linebalance.getConnection(function (err, connection6) {
                        connection6.query('select wc,code,operation1,operation2,efficiency2,groupto,starttime,note from operation_offstandard_tracking where ID="' + emp_id5 + '" and dateupdate="' + format_date + '" and spantime is null', function (err, result1, fields) {
                            connection6.release();
                            if (err) throw err;
                            if (result1.length > 0) {
                                var status = "Bạn đã mở ticket trước đó";
                                var d_in = datetime.create(result1[0].starttime);
                                var date_in = d_in.format("Y-m-d H:M:S")
                                var time_in = "-";
                                var restext = [{ 'name': emp_name, 'id6': emp_id, 'st': status, 'di': date_in, 'ti': typ, 'shift': shift, 'result': result1 }];
                                var jsres = JSON.stringify(restext);
                                response.send(restext);
                                response.end();
                            }
                            else {
                                var status = "Bạn chưa mở ticket";
                                var date_in = "-";
                                var time_in = "-";
                                var typ = "-";
                                con_server_linebalance.getConnection(function (err, con_newticket) {
                                    if (err) throw err;
                                    con_newticket.query('select wc,operation1,operation2,efficiency2,operation3,efficiency3,code from employee_offstandard_register where id="' + emp_id5 + '" and weekupdate="' + week + '" group by wc', function (err, result_newticket, fileds) {
                                        con_newticket.release();
                                        if (err) throw err;
                                        if (result_newticket.length > 0) {

                                            var restext = [{ 'name': emp_name, 'id6': emp_id, 'st': status, 'di': date_in, 'ti': typ, 'shift': shift, 'result': result_newticket }];
                                            var jsres = JSON.stringify(restext);
                                            response.send(restext);
                                            response.end();

                                        } else {
                                            status = "ID chưa được đăng ký!"
                                            var restext = [{ 'name': emp_name, 'id6': emp_id, 'st': status, 'di': date_in, 'ti': typ, 'shift': shift, 'result': "" }];
                                            var jsres = JSON.stringify(restext);
                                            response.send(restext);
                                            response.end();
                                        }


                                    });
                                });

                            }


                        });
                    });
                });
            };


        };
        //after convert RFID
    });

});

app.get("/cutting/getname/:emp_id", function (request, response) {
    var emp_id = request.params.emp_id;
    var dt = datetime.create();
    var format_date = dt.format("Y-m-d");
    var dat = dt.format("d/m/Y");
    var past = '2019-12-29 00:00:00';
    var pastDateTime = datetime.create(past);
    var Difference_In_Time = dt.getTime() - pastDateTime.getTime();
    var week = 1 + Math.floor(Difference_In_Time / (1000 * 3600 * 24 * 7));
    var shift = "PLC";
    if (emp_id.length > 6) {
        rfid_convert(emp_id, function (result) {
            emp_id = result;
            // mã 10 số
            con2.getConnection(function (err, connection_rfid) {
                connection_rfid.query('select employeeid,name from setup_rfidemplist where cardno="' + emp_id + '";', function (err2, result2, fields) {
                    connection_rfid.release();
                    if (err2) throw err2;
                    if (result2.length > 0) {
                        emp_id = result2[0].employeeid;
                        var emp_name = "invalid"
                        Query_get_name(emp_id, function (result) {
                            var shift_q = "RMC";
                            var typ = "IN";
                            if (result != "invalid") {
                                emp_name = result[0].name;
                                shift_q = result[0].shift;
                                typ = result[0].type;
                            }
                            if (shift_q.substring(0, 1) == "R") {
                                shift = "RMC";
                            };
                            if (shift_q.substring(0, 1) == "B") {
                                shift = "BLC";
                            };
                            if (shift_q.substring(0, 1) == "C") {
                                shift = "CPC";
                            };
                            if (shift_q.substring(0, 1) == "P") {
                                shift = "PLC";
                            };

                            var emp_id5 = parseInt(emp_id).toString();
                            con_server_cutting.getConnection(function (err, connection6) {
                                connection6.query('select offcode as code,op_reg,op_tran,station,time_in as starttime,reason from offstandard_employee_tracking where ID like"%' + emp_id5 + '" and duration is null', function (err, result1, fields) {
                                    connection6.release();
                                    if (err) throw err;
                                    if (result1.length > 0) {
                                        var status = "Bạn đã mở ticket trước đó";
                                        var d_in = datetime.create(result1[0].starttime);
                                        var date_in = d_in.format("Y-m-d H:M:S")
                                        var time_in = "-";
                                        var restext = [{ 'name': emp_name, 'id6': emp_id, 'st': status, 'di': date_in, 'ti': typ, 'shift': shift, 'result': result1 }];
                                        var jsres = JSON.stringify(restext);
                                        response.send(restext);
                                        response.end();
                                    }
                                    else {
                                        var status = "Bạn chưa mở ticket";
                                        var date_in = "-";
                                        var time_in = "-";
                                        con_server_cutting.getConnection(function (err, con_newticket) {
                                            if (err) throw err;
                                            con_newticket.query('select op_reg,op_tran1,op_tran2,op_tran3,op_tran4,offcode as code from offstandard_employee_registed where id like "%' + emp_id5 + '" and week_reg="' + week + '"', function (err, result_newticket, fileds) {
                                                con_newticket.release();
                                                if (err) throw err;
                                                if (result_newticket.length > 0) {
                                                    var restext = [{ 'name': emp_name, 'id6': emp_id, 'st': status, 'di': date_in, 'ti': typ, 'shift': shift, 'result': result_newticket }];
                                                    var jsres = JSON.stringify(restext);
                                                    response.send(restext);
                                                    response.end();

                                                } else {
                                                    status = "ID chưa được đăng ký!"
                                                    var restext = [{ 'name': emp_name, 'id6': emp_id, 'st': status, 'di': date_in, 'ti': typ, 'shift': shift, 'result': "" }];
                                                    var jsres = JSON.stringify(restext);
                                                    response.send(restext);
                                                    response.end();
                                                }


                                            });
                                        });

                                    }
                                });
                            });
                        });
                    } else {
                        var status = "không dò được mã thẻ, vui lòng nhập tay";
                        var date_in = "-";
                        var time_in = "-";
                        var typ = "-";
                        var restext = [{ 'name': emp_name, 'id6': emp_id, 'st': status, 'di': date_in, 'ti': typ, 'shift': shift, 'result': "" }];
                        var jsres = JSON.stringify(restext);
                        response.send(restext);
                        response.end();

                    };

                });
            });
        });

    } else {
        // mã 6 số
        var emp_name = "invalid"
        while (emp_id.length < 6) {
            emp_id = '0' + emp_id;
        }
        if (emp_id.toString().length == 6) {
            Query_get_name(emp_id, function (result) {
                var shift_q = "RMC";
                var typ = "IN";
                if (result != "invalid") {
                    emp_name = result[0].name;
                    shift_q = result[0].shift;
                    typ = result[0].type;
                }
                if (shift_q.substring(0, 1) == "R") {
                    shift = "RMC";
                };
                if (shift_q.substring(0, 1) == "B") {
                    shift = "BLC";
                };
                if (shift_q.substring(0, 1) == "C") {
                    shift = "CPC";
                };
                if (shift_q.substring(0, 1) == "P") {
                    shift = "PLC";
                };

                var emp_id5 = parseInt(emp_id).toString();
                con_server_cutting.getConnection(function (err, connection6) {
                    connection6.query('select offcode as code,op_reg,op_tran,station,time_in as starttime,reason from offstandard_employee_tracking where ID like"%' + emp_id5 + '" and duration is null', function (err, result1, fields) {
                        connection6.release();
                        if (err) throw err;
                        if (result1.length > 0) {
                            var status = "Bạn đã mở ticket trước đó";
                            var d_in = datetime.create(result1[0].starttime);
                            var date_in = d_in.format("Y-m-d H:M:S")
                            var time_in = "-";
                            var restext = [{ 'name': emp_name, 'id6': emp_id, 'st': status, 'di': date_in, 'ti': typ, 'shift': shift, 'result': result1 }];
                            var jsres = JSON.stringify(restext);
                            response.send(restext);
                            response.end();
                        }
                        else {
                            var status = "Bạn chưa mở ticket";
                            var date_in = "-";
                            var time_in = "-";
                            con_server_cutting.getConnection(function (err, con_newticket) {
                                if (err) throw err;
                                con_newticket.query('select op_reg,op_tran1,op_tran2,op_tran3,op_tran4,offcode as code from offstandard_employee_registed where id like "%' + emp_id5 + '" and week_reg="' + week + '"', function (err, result_newticket, fileds) {
                                    con_newticket.release();
                                    if (err) throw err;
                                    if (result_newticket.length > 0) {

                                        var restext = [{ 'name': emp_name, 'id6': emp_id, 'st': status, 'di': date_in, 'ti': typ, 'shift': shift, 'result': result_newticket }];
                                        var jsres = JSON.stringify(restext);
                                        response.send(restext);
                                        response.end();

                                    } else {
                                        status = "ID chưa được đăng ký!"
                                        var restext = [{ 'name': emp_name, 'id6': emp_id, 'st': status, 'di': date_in, 'ti': typ, 'shift': shift, 'result': "" }];
                                        var jsres = JSON.stringify(restext);
                                        response.send(restext);
                                        response.end();
                                    }
                                });
                            });
                        }
                    });
                });
            });
        };
    };
    //after convert RFID
});

app.post("/cutting/off_std_reg_new", function (req, res) {
    var empid = req.body.employee_id;
    var empid5 = parseInt(empid);
    empid = empid5.toString();
    var empname = req.body.name_text;
    var off_code = req.body.sel_code;
    var op1 = req.body.sel_op1;
    var op2 = req.body.sel_op2;
    var groupto = req.body.groupto;
    var shift = req.body.shift;
    var target = req.body.target_t;
    var user_reg = req.body.user_reg;
    var reason = "";
    var dt = datetime.create();
    var dupdate = dt.format("Y-m-d 00:00:00");
    var starttime = dt.format('Y-m-d H:M:S');
    if (off_code == "09 (Không sản xuất)") {
        reason = req.body.sel_reason;
    } else {
        reason = req.body.text_note;
    }
    var command = empid + ' ' + empname + ' ' + off_code + ' ' + ' op1: ' + op1 + ' op2:' + op2 + ' group ' + groupto + ' rs: ' + reason;
    con_server_cutting.getConnection(function (err, con_newreg) {
        if (err) throw err;
        query_insertnew = 'insert into offstandard_employee_tracking (id,name,shift,offcode,op_reg,op_tran,station,time_in,reason,date_in,last_update,approved,sup) values("' + empid + '","' + empname + '","' + shift + '","' + off_code + '","' + op1 + '","' + op2 + '","' + groupto + '","' + starttime + '","' + reason + '","' + dupdate + '","' + starttime + '","0","' + user_reg + '")'
        con_newreg.query(query_insertnew, function (err, result) {
            con_newreg.release();
            if (err) {
                res.send("submit failed");
                res.end();
                throw err;
            };
            res.send("Bạn đã mở ticket vào lúc " + starttime);
            res.end();
        });
    });
});

app.post("/cutting/off_std_reg_close", function (req, res) {
    var empid = req.body.employee_id;
    var empid5 = parseInt(empid);
    empid = empid5.toString();
    var start_time = req.body.start_time;
    var pastDateTime = datetime.create(start_time);
    var datein = pastDateTime.format("Y-m-d 00:00:00");
    var reason = "";
    var dt = datetime.create();
    var dupdate = dt.format("Y-m-d 00:00:00");
    var finish_time = dt.format('Y-m-d H:M:S');
    var Difference_In_Time = dt.getTime() - pastDateTime.getTime();
    var span = Math.round(100 * Difference_In_Time / (1000 * 3600)) / 100;
    var id5 = parseInt(empid);
    var command = ' diftime ' + span.toString();
    con_server_cutting.getConnection(function (err, con_closeTicket) {
        if (err) throw err;
        qr_update = 'update offstandard_employee_tracking set time_out=now(),duration="' + span.toString() + '",last_update="' + finish_time + '" where ID="' + id5.toString() + '" and date_in="' + datein + '" and duration is null'
        con_closeTicket.query(qr_update, function (err, result) {
            con_closeTicket.release();
            if (err) {
                res.send("closed failed");
                res.end();
                throw err;
            }
            res.send("Bạn đã đóng ticket! thời gian = " + span.toString() + " giờ!");
            res.end();
        });


    });
});

app.post("/cutting/off_std_approved_submit", function (req, res) {
    var empid = req.body.d1_id;
    var offcode = req.body.d1_offcode;
    var starttime = req.body.d1_start;
    var iea = req.body.d1_user;
    var kqa = req.body.d1_sel_approve;
    var dt = datetime.create();
    var finish_time = dt.format('Y-m-d H:M:S');
    con_server_cutting.getConnection(function (err, con_closeTicket) {
        if (err) throw err;
        qr_update = 'update offstandard_employee_tracking set last_update=now(),approved="' + kqa + '",user_approved="' + iea + '" where ID="' + empid + '" and offcode="' + offcode + '" and time_in="' + starttime + '" and duration is not null';
        con_closeTicket.query(qr_update, function (err, result) {
            con_closeTicket.release();
            if (err) {
                res.send("data không được phê duyệt");
                res.end();
                throw err;
            }
            res.send("Data đã được phê duyệt");
            res.end();
        });
    });

});

app.get("/cutting/get_off_data/:day/:month/:year/:group/:shift", function (req, res) {
    var day_select = req.params.day;
    var month_select = req.params.month;
    var year_select = req.params.year;
    var date_update = year_select + '-' + month_select + '-' + day_select + ' 00:00:00'
    var group = req.params.group;
    var shift = req.params.shift;
    sql_query = 'select id,name,op_reg,op_tran,offcode as code,convert(time_in,char) as regtime,duration as spantime,approved as ieapprovedresult,user_approved as ieapproveduser,reason as note from offstandard_employee_tracking where date_in="' + date_update + '" and shift="' + shift + '" and station="' + group + '" order by regtime'
    con_server_cutting.getConnection(function (err, connection2) {
        if (err) throw err; // not connected!
        connection2.query(sql_query, function (err, result, fields) {
            connection2.release();
            if (err) throw err;
            if (result.length > 0) {
                // var nam=result[0].name.toString();
                res.send(result);
                res.end();
            } else {
                res.send([{ id: '-', name: '-', code: '-', date_in: '-', time_in: '-', duration: '-', approved: '-', sup: '-', reason: '-' }]);
                res.end();
            }
        });
    });
});

app.get("/cutting/SAH_adj", function (req, res) {
    res.render("IE/cutting_loadfile_sah_adj", { table_body_ds: "" });
    res.end();
});

app.post("/cutting/SAH_adj", function (req, res) {
    var form = new formidable.IncomingForm();
    ie = "abc";
    fileupName = "";
    fcheck = "";
    form.parse(req, function (err, fields, files) {
        ie = fields.ie_up;
    });
    form.on('fileBegin', function (name, file) {
        fileupName = file.name;
        fcheck = fileupName.substring(fileupName.length - 4, fileupName.length)
        if (fcheck == "xlsx") {
            file.path = './LineBalancing/public/save/' + fileupName;
            form.on('field', function (name, field) {
                ie = field;
                var options = {
                    mode: 'text',
                    pythonPath: 'python',
                    scriptPath: './LineBalancing/pyScript',
                    pythonOptions: ['-u'], // get print results in real-time
                    args: [fileupName, ie]
                };
                let shell = new PythonShell('uploadSAH_adj_totable.py', options);
                shell.on('message', function (message) {
                    if (message != "") {
                        message = JSON.parse(message);
                        var i;
                        var trHTML = '';
                        for (i = 0; i < message.length; i++) {
                            trHTML += '<tr><td >' + message[i].Cutlot + '</td><td >' + message[i].CUT + '</td><td >' + message[i].BDL + '</td><td >' + message[i].SPR + '</td><td >' + message[i].BIS + '</td><td >' + message[i].STS + '</td><td >' + message[i].MHL + '</td><td >' + message[i].CAS + '</td><td >' + message[i].CTE + '</td><td >' + message[i].PRE + '</td><td >' + message[i].BRB + '</td><td >' + message[i].MOV + '</td><td >' + message[i].CU2 + '</td><td >' + message[i].BD2 + '</td><td >' + message[i].SP2 + '</td><td >' + message[i].MH2 + '</td><td >' + message[i].CA2 + '</td></tr>';
                        };
                        res.render("IE/cutting_loadfile_sah_adj", { 'table_body_ds': trHTML });
                        res.end();
                    }
                });
            })
            // run script pytho

        } else {
            res.send('sai định dạng file. cần load file *.xlsx');
            res.end();
            return;
        }
    });
});

app.post("/cutting/off_standard_updatelist", async function (req, res) {
    var form = new formidable.IncomingForm();
    ie = "abc";
    fileupName = "";
    fcheck = "";
    form.parse(req, function (err, fields, files) {
        ie = fields.ie_up;
    });
    form.on('fileBegin', function (name, file) {
        fileupName = file.name;
        fcheck = fileupName.substring(fileupName.length - 4, fileupName.length)
        if (fcheck == "xlsx") {
            file.path = './LineBalancing/public/save/' + fileupName;
            form.on('field', function (name, field) {
                ie = field;
                var options = {
                    mode: 'text',
                    pythonPath: 'python',
                    scriptPath: './LineBalancing/pyScript',
                    pythonOptions: ['-u'], // get print results in real-time
                    args: [fileupName, ie]
                };
                let shell = new PythonShell('uploadOffstdct.py', options);
                shell.on('message', function (message) {
                    if (message != "") {
                        message = JSON.parse(message);
                        var i;
                        var trHTML = '';
                        for (i = 0; i < message.length; i++) {
                            trHTML += '<tr><td >' + message[i].ID + '</td><td >' + message[i].NAME + '</td><td >' + message[i].SECTION + '</td><td >' + message[i].OFF_CODE + '</td><td >' + message[i].OP_REG + '</td><td >' + message[i].OP_TRAN1 + '</td><td >' + message[i].OP_TRAN2 + '</td><td >' + message[i].OP_TRAN3 + '</td><td >' + message[i].OP_TRAN4 + '</td><td >' + message[i].WEEK_REG + '</td><td >' + message[i].REASON + '</td></tr>';
                        };
                        res.render("IE/cutting_loadfile_offstd", { 'table_body_ds': trHTML });
                        res.end();
                    }
                });


            })
            // run script pytho
        } else {
            res.send('sai định dạng file. cần load file *.xlsx');
            res.end();
            return;
        }
    });
});

app.get("/cutting/off_standard_updatelist", function (req, res) {
    res.render("IE/cutting_loadfile_offstd", { table_body_ds: "" });
    res.end();
});

app.get("/cutting/off_standard_review", function (req, res) {
    var dt = datetime.create();
    var format_date = dt.format("Ymd");
    var dat = dt.format("d/m/Y");
    var past = '2019-12-29 00:00:00';
    var pastDateTime = datetime.create(past);
    var Difference_In_Time = dt.getTime() - pastDateTime.getTime();
    var week = 1 + Math.floor(Difference_In_Time / (1000 * 3600 * 24 * 7));
    con_server_linebalance.getConnection(function (err, connection_off) {
        if (err) throw err;
        var query_group = 'select groupname from web_ie_location where line<"Line 354" group by groupname order by groupname desc;';
        connection_off.query(query_group, function (err, result, fields) {
            connection_off.release();
            if (err) throw err;
            if (result.length > 0) {
                var tb = '';
                var i;
                for (i = 0; i < result.length; i++) {
                    tb += '<option>' + result[i].groupname + '</option>';
                }
                var restext = { name: 'Quét thẻ hoặc nhập mã số và nhấn Enter', 'listgroup': tb, 'dat': dat, 'table_body': "" };
                // var jsres=JSON.stringify(restext);
                res.render("IE/off_reg_cutting_review", restext);

            } else {
                res.render("IE/off_reg_cutting_review", { name: 'Tên Nhân Viên', 'listgroup': tb, 'dat': dat, 'table_body': "" });
            }
        });
    });

});


//=====================================CUTTING=============================================
app.get("/Cutting/Reports", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("Cutting/Cutting");
    }
    else {
        res.render("login");
    }
});

app.get("/Cutting/Cutting", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("Cutting/Cutting");
    }
    else {
        res.render("login");
    }
});

app.get("/Cutting/PayrollCheck", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("Cutting/PayrollCheck");
    }
    else {
        res.render("login");
    }
});

app.get("/Cutting/OffStandard", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("Cutting/OffStandard");
    }
    else {
        res.render("login");
    }
});

// app.post('/Cutting/Payroll_Search/GroupNew', function(req, res){

//   if (req.isAuthenticated()) {
//       var groupName=req.body.group;
//       var date=req.body.date;

//       // var bundle=req.body.bundle;
//       var year  = date.substring(0,4);
//       var month = date.substring(4,6);
//       var day   = date.substring(6,8);
//       var dateFull=year+month+day;
//       var image_list;
//       con5.getConnection(function(err, connection){
//           if (err) throw err;
//           sql="SELECT Temp4.ISSUE_FILE, LEFT(Temp4.TICKET, 6) AS BUNDLE, max(QC) as QC, COUNT(Temp4.TICKET) AS ISSUE, COUNT(EMPLOYEE) AS SCAN, COUNT(deactive.TICKET) AS IASCAN, COUNT(Temp4.TICKET)-COUNT(EMPLOYEE)-COUNT(deactive.TICKET) AS IS_FULL, MAX(Temp4.FILE) as FILE, Temp4.TimeUpdate, TimeModified FROM "
//           +" (SELECT Temp3.FILE AS ISSUE_FILE, Temp3.TICKET, scan.QC, scan.EMPLOYEE, scan.FILE, scan.TimeUpdate, scan.TimeModified FROM employee_scanticket scan RIGHT JOIN "
//           +" (SELECT TICKET, active2.FILE FROM bundleticket_active active2 INNER JOIN (SELECT distinct active.FILE FROM bundleticket_active active "
//           +" INNER JOIN (SELECT TICKET FROM employee_scanticket where FILE LIKE '" + groupName +"_"+dateFull+ "%') AS Temp1 "
//           +" ON left(active.TICKET,10)=left(Temp1.TICKET,10)) AS Temp2 ON active2.`FILE`=Temp2.FILE WHERE active2.FILE!='0') AS Temp3 ON Temp3.TICKET=scan.TICKET) AS Temp4  LEFT JOIN bundleticket_deactive deactive ON left(Temp4.TICKET,10)=left(deactive.TICKET,10) "
//           +" GROUP BY Temp4.ISSUE_FILE;"
//           console.log(sql)
//           connection.query(sql, function (err, result, fields) {
//               connection.release();
//               if (err) throw err;
//               if (result.length>0){
//                   image_list=result;
//                   var error_list;
//                   con5.getConnection(function(err, connection){
//                       if (err) {
//                           throw err;
//                       }
//                       // connection.query("SELECT FILE from bundleticket_error where DATE='"+date+"' and FILE like '"+group+"%';", function (err, result, fields) {
//                       connection.query("SELECT FILE from bundleticket_error where FILE like '" + groupName +"_"+dateFull+ "%' and MODIFIED IS NULL;", function (err, result, fields) {
//                           connection.release();
//                           if (err) throw err;
//                           if (result.length>0) {
//                               error_list=result;
//                               res.send({image_list: image_list, error_list: error_list});
//                               res.end();
//                           } else {
//                               error_list='empty';
//                               res.send({image_list: image_list, error_list: error_list});
//                               res.end();
//                           }
//                       });
//                   });
//               } else {
//                   res.send({image_list:'empty'});
//                   res.end();
//               }
//           });
//       });
//   }
//   else {
//       res.render("login");
//   }
// });

// app.post("/Cutting/Payroll_Search/GroupMultipleOperations", function(req, res){
//     var groupName=req.body.group;
//     var date=req.body.date;
//     var date=req.body.date;
//     var year=date.slice(0,4)
//     var month=date.slice(4,6);
//     var datecr=date.slice(6,8);
//     var curDate= year+'-'+month+'-'+datecr;
//     con5.getConnection(function(err, connection){
//         if (err) {
//             connection.release();
//             throw err;
//         }
//         var sql=("SELECT * FROM "
//         + "(SELECT EMPLOYEE, COUNT(DISTINCT OPERATION_CODE) AS OP_CODE, COUNT(TICKET) AS TICKET, FILE, QC, SUM(IS_FULL) as SUM_FULL FROM employee_scanticket "
//         + " WHERE DATE='"+date+"' AND FILE LIKE '"+groupName+"%'"
//         + " GROUP BY EMPLOYEE, FILE ) AS TEMP "
//     +" WHERE TEMP.OP_CODE>1 and SUM_FULL<200;");
//     console.log(sql);
//         connection.query(sql, function (err, result, fields) {
//             connection.release();
//             if (err) throw err;
//             if (result.length>0){
//                 res.send(result);
//                 res.end();
//             } else {
//                 res.send({result:'empty'});
//                 res.end();
//             }
//         });
//     });
//   });


app.post('/Cutting/Payroll_Search/GroupNew', function (req, res) {

    if (req.isAuthenticated()) {
        var groupName = req.body.group;
        var date = req.body.date;

        // var bundle=req.body.bundle;
        var year = date.substring(0, 4);
        var month = date.substring(4, 6);
        var day = date.substring(6, 8);
        var dateFull = year + month + day;
        var image_list;
        con5.getConnection(function (err, connection) {
            if (err) throw err;
            sql = "SELECT Temp4.ISSUE_FILE, LEFT(Temp4.TICKET, 6) AS BUNDLE, max(QC) as QC, COUNT(Temp4.TICKET) AS ISSUE, COUNT(EMPLOYEE) AS SCAN, COUNT(deactive.TICKET) AS IASCAN, COUNT(Temp4.TICKET)-COUNT(EMPLOYEE)-COUNT(deactive.TICKET) AS IS_FULL, MAX(Temp4.FILE) as FILE, Temp4.TimeUpdate, TimeModified FROM "
                + " (SELECT Temp3.FILE AS ISSUE_FILE, Temp3.TICKET, scan.QC, scan.EMPLOYEE, scan.FILE, scan.TimeUpdate, scan.TimeModified FROM employee_scanticket scan RIGHT JOIN "
                + " (SELECT TICKET, active2.FILE FROM bundleticket_active active2 INNER JOIN (SELECT distinct active.FILE FROM bundleticket_active active "
                + " INNER JOIN (SELECT TICKET FROM employee_scanticket where FILE LIKE '" + groupName + "_" + dateFull + "%') AS Temp1 "
                + " ON left(active.TICKET,10)=left(Temp1.TICKET,10)) AS Temp2 ON active2.`FILE`=Temp2.FILE WHERE active2.FILE!='0') AS Temp3 ON Temp3.TICKET=scan.TICKET) AS Temp4  LEFT JOIN bundleticket_deactive deactive ON left(Temp4.TICKET,10)=left(deactive.TICKET,10) "
                + " GROUP BY Temp4.ISSUE_FILE;"
            // console.log(sql)
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                if (result.length > 0) {
                    image_list = result;
                    var error_list;
                    con5.getConnection(function (err, connection) {
                        if (err) {
                            throw err;
                        }
                        // connection.query("SELECT FILE from bundleticket_error where DATE='"+date+"' and FILE like '"+group+"%';", function (err, result, fields) {
                        connection.query("SELECT FILE from bundleticket_error where FILE like '" + groupName + "_" + dateFull + "%' and MODIFIED IS NULL;", function (err, result, fields) {
                            connection.release();
                            if (err) throw err;
                            if (result.length > 0) {
                                error_list = result;
                                res.send({ image_list: image_list, error_list: error_list });
                                res.end();
                            } else {
                                error_list = 'empty';
                                res.send({ image_list: image_list, error_list: error_list });
                                res.end();
                            }
                        });
                    });
                } else {
                    res.send({ image_list: 'empty' });
                    res.end();
                }
            });
        });
    }
    else {
        res.render("login");
    }
});

app.post("/Cutting/Payroll_Search/GroupMultipleOperations", function (req, res) {
    var groupName = req.body.group;
    var date = req.body.date;
    var date = req.body.date;
    var year = date.slice(0, 4)
    var month = date.slice(4, 6);
    var datecr = date.slice(6, 8);
    var curDate = year + '-' + month + '-' + datecr;

    con5.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            throw err;
        }
        var sql = ("SELECT * FROM "
            + "(SELECT EMPLOYEE, COUNT(DISTINCT OPERATION_CODE) AS OP_CODE, COUNT(TICKET) AS TICKET, FILE, QC, SUM(IS_FULL) as SUM_FULL FROM cutting_system.employee_scanticket "
            + " WHERE DATE='" + date + "' AND FILE LIKE '" + groupName + "%'"
            + " GROUP BY EMPLOYEE, FILE ) AS TEMP "
            + " WHERE TEMP.OP_CODE>1 and SUM_FULL<200;");
        //   console.log(sql);
        connection.query(sql, function (err, result, fields) {
            connection.release();
            // console.log(result);
            if (err) throw err;
            if (result.length > 0) {
                res.send(result);
                res.end();
            } else {
                res.send({ result: 'empty' });
                res.end();
            }
        });
    });
});
app.post('/Cutting/Payroll_Search/Submit', function (req, res) {
    if (req.isAuthenticated()) {
        var bundle = req.body.bundle;
        var ID = req.body.ID;
        var QC = req.body.QC;
        var file = req.body.file;
        var date = req.body.date;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        con5.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                throw err;
            }
            connection.query("select EMPLOYEE from employee_scanticket where TICKET='" + bundle + "';", function (err, result, fields) {
                if (err) throw err;
                // res.setHeader("Content-Type", "application/json");
                if (result.length == 0) {
                    connection.query("replace into employee_scanticket"
                        + " (TICKET, EMPLOYEE, DATE, BUNDLE, OPERATION_CODE, IRR, QC, FILE, IS_FULL, MODIFIED, TimeUpdate)"
                        + " values ('" + bundle + "', '" + ID + "', '" + date + "','" + bundle.substring(0, 6) + "', '" + bundle.substring(6, 10) + "','000','" + QC + "','" + file + "','100','" + req.user + "', '" + timeUpdate + "')", function (err, result, fields) {
                            connection.release();
                            if (err) throw err;
                            res.setHeader("Content-Type", "application/json");
                            res.send({ result: 'done' });
                            // next();
                            res.end();
                        });
                } else {
                    connection.query("update employee_scanticket set EMPLOYEE='" + ID + "', QC='" + QC + "', IS_FULL='100', MODIFIED='" + req.user + "', TimeModified='" + timeUpdate + "', FILE='" + file + "' where TICKET='" + bundle + "';", function (err, result, fields) {
                        connection.release();
                        if (err) throw err;
                        res.setHeader("Content-Type", "application/json");
                        res.send({ result: 'done' });
                        // next();
                        res.end();
                    });
                }

            });
        });
    }
    else {
        res.render("login");
    }
});

app.post('/Cutting/Payroll_Search/Submit1', function (req, res) {
    if (req.isAuthenticated()) {
        var bundle = req.body.bundle;
        var ID = req.body.ID;
        var QC = req.body.QC;
        var file = req.body.file;
        var date = req.body.date;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        con5.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query("replace into employee_scanticket"
                + " (TICKET, EMPLOYEE, DATE, BUNDLE, OPERATION_CODE, IRR, QC, FILE, IS_FULL, MODIFIED, TimeUpdate)"
                + " values ('" + bundle + "', '" + ID + "', '" + date + "','" + bundle.substring(0, 6) + "', '" + bundle.substring(6, 10) + "','000','" + QC + "','" + file + "','100','" + req.user + "', '" + timeUpdate + "')", function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    res.send({ result: 'done' });
                    res.end();
                });
        });
    }
    else {
        res.render("login");
    }
});

app.post('/Cutting/Payroll_Search/GetName', function (req, res) {
    if (req.isAuthenticated()) {
        var ID = req.body.ID;
        con2.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query("Select Name, ID, Line, Shift from setup_emplist where ID like '%" + ID + "' and Type='DR';", function (err, result, fields) {
                connection.release();
                if (err) throw err;
                if (result.length > 0) {
                    res.send(result);
                    res.end();
                } else {
                    res.send({ result: 'empty' });
                    res.end();
                }

            });
        });
    }
    else {
        res.render("login");
    }
});

app.post('/Cutting/Payroll_Search/GetTimeSheet', function (req, res) {
    if (req.isAuthenticated()) {
        var ID = req.body.ID;
        var date = req.body.date;
        var datefrom = req.body.datefrom;

        var year = date.slice(0, 4)
        var month = date.slice(4, 6);
        var datecr = date.slice(6, 8);
        var curDate = year + '-' + month + '-' + datecr;

        var yearfr = datefrom.slice(0, 4)
        var monthfr = datefrom.slice(4, 6);
        var datefr = datefrom.slice(6, 8);
        var frDate = yearfr + '-' + monthfr + '-' + datefr;
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "Select ROUND(SUM(WORK_HRS),2) AS WORK_HRS, ROUND(SUM(REG_HRS),2) AS REG_HRS, ROUND(SUM(OT15+OT20+OT30),2) as OT, ROUND(SUM(CD03),2) AS CD03, ROUND(SUM(CD08),2) AS CD08, ROUND(SUM(CD09),2) AS CD09 "
                + " from pr2k.employee_timesheet where ID like '" + ID + "%' AND DATE<='" + curDate + "' AND DATE>='" + frDate + "';"
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                if (result.length > 0) {
                    res.send(result);
                    res.end();
                } else {
                    res.send({ result: 'empty' });
                    res.end();
                }

            });
        });
    }
    else {
        res.render("login");
    }
});

app.post('/Cutting/Payroll_Search/Skip', function (req, res) {
    if (req.isAuthenticated()) {
        var file = req.body.file;
        var date = req.body.date;
        var QC = req.body.QC;
        if (QC == '') {
            QC = '999999';
        }
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        con5.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query("Update employee_scanticket set IS_FULL='100', QC='" + QC + "', MODIFIED='" + req.user + "', TimeModified='" + timeUpdate + "' where FILE='" + file + "';",
                function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    res.send({ result: 'done' });
                    res.end();
                });
        });
    }
    else {
        res.render("login");
    }
});

app.post('/Cutting/Payroll_Search/Dismiss_error', function (req, res) {
    if (req.isAuthenticated()) {
        var file = req.body.fileName;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        con5.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query("Update bundleticket_error set MODIFIED='" + req.user + "', TimeModified='" + timeUpdate + "' where FILE='" + file + "';",
                function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    res.send({ result: 'done' });
                    res.end();
                });
        });
    }
    else {
        res.render("login");
    }
});

app.post('/Cutting/Payroll_Search/Bundle', function (req, res) {
    if (req.isAuthenticated()) {
        var file = req.body.file;
        var date = req.body.date;
        var bundle = req.body.bundle;
        var bundle_read;
        con5.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query("SELECT TICKET, QC, EMPLOYEE FROM employee_scanticket where FILE='" + file + "' or TICKET like '" + bundle + "%';", function (err, result, fields) {
                connection.release();
                if (err) throw err;
                if (result.length > 0) {
                    bundle_read = result;
                    var bundle1 = bundle_read[0].TICKET.substring(0, 6);
                    var bundle = bundle1;
                    if (bundle_read.length > 2) {
                        var bundle2 = bundle_read[1].TICKET.substring(0, 6);
                        var bundle3 = bundle_read[2].TICKET.substring(0, 6);
                        if (bundle1 == bundle2 || bundle1 == bundle3)
                            bundle = bundle1;
                        if (bundle1 != bundle2 && bundle2 == bundle3)
                            bundle = bundle2;
                    }
                    var QC = bundle_read[0].QC;
                    con5.getConnection(function (err, connection) {
                        if (err) {
                            connection.release();
                            throw err;
                        }
                        var sql = "";
                        if (date < "20200601")
                            sql = "SELECT bundleticket_active.TICKET "
                                + " from bundleticket_active left join employee_scanticket "
                                + " on bundleticket_active.TICKET=employee_scanticket.TICKET "
                                + " where bundleticket_active.TICKET like '" + bundle + "%' and employee_scanticket.TICKET is null;";
                        else
                            sql = "SELECT TICKET from bundleticket_active where TICKET like '" + bundle + "%';"
                        connection.query(sql, function (err, result, fields) {
                            // connection.query(sql, function (err, result, fields) {
                            connection.release();
                            if (err) throw err;
                            if (result.length > 0) {
                                res.send({ bundle_read: bundle_read, bundle_full: result, QC: QC });
                                res.end();
                            } else {
                                res.send({ bundle_read: bundle_read, bundle_full: 'empty', QC: QC })
                                res.end();
                            }
                        });
                    });
                } else {
                    res.send({ result: 'empty' });
                    res.end();
                }
            });
        });
    }
    else {
        res.render("login");
    }
});

app.post('/Cutting/Payroll_Search/BundleNew', function (req, res) {
    if (req.isAuthenticated()) {
        var file = req.body.file;
        var date = req.body.date;
        var bundle = req.body.bundle;
        var bundle_read;
        con5.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "SELECT Temp3.TICKET, scan.QC, scan.EMPLOYEE FROM employee_scanticket scan RIGHT JOIN "
                + " (SELECT TICKET, active2.FILE FROM bundleticket_active active2 INNER JOIN (SELECT distinct active.FILE FROM bundleticket_active active "
                + " INNER JOIN (SELECT TICKET FROM employee_scanticket where FILE = '" + file + "') AS Temp1 "
                + " ON active.TICKET=Temp1.TICKET) AS Temp2 ON active2.`FILE`=Temp2.FILE) AS Temp3 ON Temp3.TICKET=scan.TICKET;"
            sql = `SELECT pr.TICKET,scan.QC, scan.EMPLOYEE FROM 
          (SELECT ac.TICKET,f.file FROM 
          (SELECT a.file FROM 
          (SELECT ticket FROM employee_scanticket WHERE FILE='${file}') sc LEFT JOIN bundleticket_active a ON sc.ticket=a.ticket GROUP BY FILE) f
          LEFT JOIN bundleticket_active ac ON f.file=ac.file) pr LEFT JOIN employee_scanticket scan ON pr.ticket=scan.ticket`
            //   console.log(sql)
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                if (result.length > 0 && result.length < 20) {
                    res.send(result);
                    res.end();
                } else {
                    res.send({ result: 'empty' });
                    res.end();
                }
            });
        });
    }
    else {
        res.render("login");
    }
});

app.post('/Cutting/Payroll_Search/BundleSearch', function (req, res) {
    if (req.isAuthenticated()) {
        var bundle = req.body.bundle;
        bundle = bundle.substr(0, 6);
        con5.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query("SELECT TICKET, EMPLOYEE, DATE, BUNDLE, OPERATION_CODE, EARNED_HOURS, WORK_LOT, FILE, MODIFIED, QC FROM employee_scanticket where TICKET like '" + bundle + "%';", function (err, result, fields) {
                connection.release();
                if (err) throw err;
                if (result.length > 0) {
                    res.send(result);
                    res.end();
                } else {
                    res.send({ result: 'empty' });
                    res.end();
                }
            });
        });
    }
    else {
        res.render("login");
    }
});

app.post('/Cutting/Payroll_Search/ID', function (req, res) {
    if (req.isAuthenticated()) {
        var id = req.body.id;
        //   id=id.substr(1);
        var date = req.body.date_to;
        var datefrom = req.body.datefrom;

        if (date != '--' && datefrom != '--') {
            //   console.log(datefrom);
            con5.getConnection(function (err, connection) {
                if (err) {
                    throw err;
                }
                if (datefrom == '--') {
                    sql = "SELECT e.TICKET, a.OPERATION_CODE, a.EARNED_HOURS, a.UNITS, a.WORK_LOT, a.SAH_ADJ, e.FILE "
                        + " FROM cutting_system.employee_scanticket e inner join cutting_system.bundleticket_active a on e.TICKET=a.TICKET,10 "
                        + " where EMPLOYEE LIKE'" + id + "%' and e.TimeUpdate<='" + date + " 06:00:00' and e.TimeUpdate>='" + date + " 23:00:00'"
                }
                else {
                    sql = "SELECT e.TICKET, a.OPERATION_CODE, a.EARNED_HOURS, a.UNITS, a.WORK_LOT, a.SAH_ADJ, e.FILE "
                        + " FROM cutting_system.employee_scanticket e inner join cutting_system.bundleticket_active a on e.TICKET=a.TICKET "
                        + " where EMPLOYEE LIKE'" + id + "%' and e.TimeUpdate<='" + date + " 05:00:00' and e.TimeUpdate>='" + datefrom + " 05:10:00'"
                }
                //   console.log(sql);
                connection.query(sql, function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    if (result.length > 0) {
                        res.send(result);
                        res.end();
                    } else {
                        res.send({ result: 'empty' });
                        res.end();
                    }
                });
            });
        }
        else {
            res.send({ result: 'empty' });
            res.end();
        }
    } else {
        res.render("login");
    }
});

// app.post('/Cutting/Payroll_Search/ID', function (req, res) {
//     if (req.isAuthenticated()) {
//         var id = req.body.id;
//         //   id=id.substr(1);
//         var date = req.body.date_to;
//         var datefrom = req.body.datefrom;

//         if (date != '--' && datefrom != '--') {
//             //   console.log(datefrom);
//             con5.getConnection(function (err, connection) {
//                 if (err) {
//                     throw err;
//                 }
//                 if (datefrom == '--') {
//                     sql = "SELECT e.TICKET, a.OPERATION_CODE, a.EARNED_HOURS, a.UNITS, a.WORK_LOT, a.SAH_ADJ, e.FILE "
//                         + " FROM cutting_system.employee_scanticket e inner join cutting_system.bundleticket_active a on e.TICKET=a.TICKET,10 "
//                         + " where EMPLOYEE LIKE'" + id + "%' and e.TimeUpdate<='" + date + " 06:00:00' and e.TimeUpdate>='" + date + " 23:00:00'"
//                 }
//                 else {
//                     sql = "SELECT e.TICKET, a.OPERATION_CODE, a.EARNED_HOURS, a.UNITS, a.WORK_LOT, a.SAH_ADJ, e.FILE "
//                         + " FROM cutting_system.employee_scanticket e inner join cutting_system.bundleticket_active a on e.TICKET=a.TICKET "
//                         + " where EMPLOYEE LIKE'" + id + "%' and e.TimeUpdate<='" + date + " 06:00:00' and e.TimeUpdate>='" + datefrom + " 06:00:00'"
//                 }
//                 //   console.log(sql);
//                 connection.query(sql, function (err, result, fields) {
//                     connection.release();
//                     if (err) throw err;
//                     if (result.length > 0) {
//                         res.send(result);
//                         res.end();
//                     } else {
//                         res.send({ result: 'empty' });
//                         res.end();
//                     }
//                 });
//             });
//         }
//         else {
//             res.send({ result: 'empty' });
//             res.end();
//         }
//     } else {
//         res.render("login");
//     }
// });

app.post('/Cutting/Payroll_Search/Ticket', function (req, res) {
    var ticket = req.body.ticket;
    con5.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        connection.query("SELECT EMPLOYEE, DATE, FILE FROM"
            + " employee_scanticket where TICKET='" + ticket + "';", function (err, result, fields) {
                connection.release();
                if (err) throw err;
                if (result.length > 0) {
                    res.send(result);
                    res.end();
                } else {
                    res.send({ result: 'empty' });
                    res.end();
                }
            });
    });
});

app.post('/Cutting/Payroll_Search/Worklot', function (req, res) {
    var worklot = req.body.worklot;
    worklot = worklot.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    con5.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            throw err;
        }
        sql = "SELECT t1.*,r.OP_REG,e.NAME, r.NAMEGROUP FROM "
            + " (SELECT a.TICKET, a.OPERATION_CODE, s.EMPLOYEE, a.EARNED_HOURS, a.SAH_ADJ, a.UNITS FROM bundleticket_active a LEFT JOIN employee_scanticket s ON a.TICKET=s.TICKET "
            + " WHERE a.WORK_LOT='" + worklot + "' AND a.`FILE`!='0' and  (s.date> DATE(DATE_SUB(now(), INTERVAL 120 DAY))) ) t1 LEFT JOIN "
            + " (SELECT RIGHT(ID, 5) ID, NAME, OP_REG, NAMEGROUP from offstandard_employee_registed WHERE WEEK_REG=(select max(WEEK_REG) from offstandard_employee_registed)) r ON t1.EMPLOYEE=r.ID "
            + " LEFT JOIN erpsystem.setup_emplist e ON RIGHT(e.ID, 5)=t1.EMPLOYEE";
        wle = worklot.substring(worklot.length - 3, worklot.length)
        if (wle == "RCS") {
            sql = "SELECT t1.*, e.NAME, r.OP_REG, r.NAMEGROUP FROM "
                + " (SELECT a.TICKET, a.OPERATION_CODE, s.EMPLOYEE, '0' as EARNED_HOURS, a.SAH_ADJ, a.UNITS FROM bundleticket_active a LEFT JOIN employee_scanticket s ON a.TICKET=s.TICKET "
                + " WHERE a.WORK_LOT='" + worklot.substring(0, worklot.length - 1) + "' AND a.printer!='' and (s.date>date(now())-120)) t1 LEFT JOIN "
                + " (SELECT RIGHT(ID, 5) ID, NAME, OP_REG, NAMEGROUP from offstandard_employee_registed WHERE WEEK_REG=(select max(WEEK_REG) from offstandard_employee_registed)) r ON t1.EMPLOYEE=r.ID "
                + " LEFT JOIN erpsystem.setup_emplist e ON RIGHT(e.ID, 5)=t1.EMPLOYEE;";
        }

        connection.query(sql, function (err, result, fields) {
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

app.post('/Cutting/Payroll_Search/Worklot2', function (req, res) {
    var worklot = req.body.worklot;
    worklot = worklot.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    con5.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            throw err;
        }
        sql = "SELECT t1.*,r.OP_REG,e.NAME, r.NAMEGROUP FROM "
            + " (SELECT a.TICKET, a.OPERATION_CODE, s.EMPLOYEE, a.EARNED_HOURS, a.SAH_ADJ, a.UNITS FROM bundleticket_active a LEFT JOIN employee_scanticket s ON a.TICKET=s.TICKET "
            + " WHERE a.WORK_LOT='" + worklot + "' AND a.`FILE`!='0' and (s.date>date(now())-120)) t1 LEFT JOIN "
            + " (SELECT RIGHT(ID, 5) ID, NAME, OP_REG, NAMEGROUP from offstandard_employee_registed WHERE WEEK_REG=(select max(WEEK_REG) from offstandard_employee_registed)) r ON t1.EMPLOYEE=r.ID "
            + " LEFT JOIN erpsystem.setup_emplist e ON RIGHT(e.ID, 5)=t1.EMPLOYEE";
        wle = worklot.substring(worklot.length - 3, worklot.length)
        if (wle == "RCS") {
            sql = "SELECT t1.*, e.NAME, r.OP_REG, r.NAMEGROUP FROM "
                + " (SELECT a.TICKET, a.OPERATION_CODE, s.EMPLOYEE, '0' as EARNED_HOURS, a.SAH_ADJ, a.UNITS FROM bundleticket_active a LEFT JOIN employee_scanticket s ON a.TICKET=s.TICKET "
                + " WHERE a.WORK_LOT='" + worklot.substring(0, worklot.length - 1) + "' AND a.printer!='' and (s.date>date(now())-120)) t1 LEFT JOIN "
                + " (SELECT RIGHT(ID, 5) ID, NAME, OP_REG, NAMEGROUP from offstandard_employee_registed WHERE WEEK_REG=(select max(WEEK_REG) from offstandard_employee_registed)) r ON t1.EMPLOYEE=r.ID "
                + " LEFT JOIN erpsystem.setup_emplist e ON RIGHT(e.ID, 5)=t1.EMPLOYEE;";
        }

        connection.query(sql, function (err, result, fields) {
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

app.post('/Cutting/Payroll_Search/AQL_detail', function (req, res) {
    var worklot = req.body.worklot;
    worklot = worklot.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    con5.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            throw err;
        }
        sql = "SELECT * FROM "
            + " (SELECT TABLE_CODE, QC, IRR, EMPLOYEE, NO_IRR, NO_SAMPLE, FILE FROM cutting_system.aql_record WHERE WORK_LOT='" + worklot + "' and date(timeupdate)>(date(now())-90)) t "
            + " LEFT JOIN (SELECT RIGHT(ID, 5) ID, NAME, OP_REG, NAMEGROUP from offstandard_employee_registed WHERE WEEK_REG=(week(now())-1)) r "
            + " on t.EMPLOYEE=r.ID;";

        connection.query(sql, function (err, result, fields) {
            connection.release();
            if (err) throw err;
            res.send(result);
            res.end();
        });
    });
});

app.post('/Cutting/Payroll_Search/WorklotSummary', function (req, res) {
    var worklot = req.body.worklot;
    worklot = worklot.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    con5.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        sql = "select Temp1.TICKET as BUNDLE, FILE, COUNT(Temp1.TICKET) as ISSUE, COUNT(Temp2.TICKET) as EARN, COUNT(Temp3.TICKET) as IA, COUNT(Temp1.TICKET)-COUNT(Temp2.TICKET)-COUNT(Temp3.TICKET) as NOT_EARN from "
            + " (select TICKET, FILE from bundleticket_active where work_lot='" + worklot + "' and FILE!='0' and create_date>(date(DATE_SUB(NOW(),INTERVAL 90 DAY))) ) as Temp1 "
            + " left join "
            + " (select TICKET from employee_scanticket where work_lot='" + worklot + "') as Temp2 on Temp1.TICKET=Temp2.TICKET "
            + " left join "
            + " (select TICKET from bundleticket_deactive where work_lot='" + worklot + "') as Temp3 on Temp1.TICKET=Temp3.TICKET "
            + " group by Temp1.FILE;";
        wle = worklot.substring(worklot.length - 3, worklot.length)
        if (wle == "RCS") {
            sql = "select Temp1.TICKET as BUNDLE, FILE, COUNT(Temp1.TICKET) as ISSUE, COUNT(Temp2.TICKET) as EARN, COUNT(Temp3.TICKET) as IA, COUNT(Temp1.TICKET)-COUNT(Temp2.TICKET)-COUNT(Temp3.TICKET) as NOT_EARN from "
                + " (select TICKET, FILE from bundleticket_active where work_lot='" + worklot.substring(0, worklot.length - 1) + "' and printer!='' and create_date>(date(DATE_SUB(NOW(),INTERVAL 90 DAY))) ) as Temp1 "
                + " left join "
                + " (select TICKET from employee_scanticket where work_lot='" + worklot + "') as Temp2 on Temp1.TICKET=Temp2.TICKET "
                + " left join "
                + " (select TICKET from bundleticket_deactive where work_lot='" + worklot.substring(0, worklot.length - 3) + "') as Temp3 on Temp1.TICKET=Temp3.TICKET "
                + " group by Temp1.FILE;";
        }
        connection.query(sql, function (err, result, fields) {
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

app.post('/Cutting/Payroll_Search/Alert', function (req, res) {
    if (req.isAuthenticated()) {
        var date = req.body.date;
        var datefrom = req.body.datefrom;
        con5.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "SELECT TICKET, OLD_EMPLOYEE, OLD_FILE, NEW_EMPLOYEE, NEW_FILE, STATUS FROM bundleticket_alert WHERE OLD_TimeUpdate>='" + datefrom + " 00:00:00' and OLD_TimeUpdate<='" + date + " 23:59:59' "
                + " AND NEW_EMPLOYEE!=OLD_EMPLOYEE and MID(OLD_FILE, 7, 1)!=MID(NEW_FILE, 7, 1) AND HOUR(OLD_TimeUpdate)!=HOUR(New_TIMEUPDATE) and (STATUS='Y' or STATUS='N') order by status desc, OLD_FILE;"
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                if (result.length > 0) {
                    res.send(result);
                    res.end();
                } else {
                    res.send({ result: 'empty' });
                    res.end();
                }
            });
        });
    } else {
        res.render("login");
    }
});

app.post('/Cutting/Payroll_Search/Alert_Update_Status', function (req, res) {
    if (req.isAuthenticated()) {
        var ticket = req.body.ticket;
        var status = req.body.status;
        con5.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update bundleticket_alert set STATUS='" + status + "' WHERE Ticket='" + ticket + "';"
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send({ result: 'done' });
                res.end()
            });
        });
    } else {
        res.render("login");
    }
});

app.post('/Cutting/Payroll_Search/Update_Date_Scan', function (req, res) {
    if (req.isAuthenticated()) {
        var date = req.body.date;
        var file_name = req.body.file_name;
        con5.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            for (var i = 0; i < file_name.length; i++) {
                file = file_name[i];
                // sql="update employee_scanticket set DATE='"+date+"' WHERE File='"+file+"';"
                // connection.query(sql, function (err, result, fields) {
                //     if (err) throw err;
                // });
            }
            connection.release();
            res.send({ result: 'done' });
            res.end();
        });
    } else {
        res.render("login");
    }
});

app.post("/Cutting/Payroll_Search/GroupReport", function (req, res) {
    var groupName = req.body.group;
    var shift = req.body.shift;
    var date = req.body.date;
    groupF = groupName.substring(0, 3);
    groupT = groupName.substring(4, 7);
    shift = shift.substring(0, 1);
    con2.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        var sql = "select t2.ID, t2.Name, t2.Line, OPERATION, BUNDLE, SAH from ( "
            + " select EMPLOYEE, bd.Operation_Code as OPERATION, COUNT(ac.Ticket) as Bundle, ROUND(SUM(ac.EARNED_HOURS),2) as SAH "
            + " from cutting_system.employee_scanticket ac left join cutting_system.bundleticket_active bd "
            + " on ac.TICKET=bd.TICKET "
            + " where DATE='" + date + "' and  ac.File like '" + groupF + groupT + shift + "%' "
            + " group by Employee, bd.OPERATION_Code order by bd.OPERATION_code) t1 left join "
            + " (select RIGHT(ID,5) as EMPLOYEE, ID, Name, Line "
            + " from setup_emplist) as t2 on t1.EMPLOYEE=t2.EMPLOYEE ;"
        connection.query(sql, function (err, result, fields) {
            connection.release();
            if (err) throw err;
            if (result.length > 0) {
                res.send(result);
                res.end();
            } else {
                res.send({ result: 'empty' });
                res.end();
            }
        });
    });
});

app.post("/Cutting/Payroll_Search/WipReport", function (req, res) {
    var shift = req.body.shift;
    var date = req.body.date;
    shift = shift.substring(0, 1);
    con2.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        var sql = "select MACHINE, WORK_LOT, ASSORTLOT, OPERATION_CODE, ISSUES, SCANS, VAR, ISSUES_UNIT, SCANS_UNIT from "
            + " (select t3.WORK_LOT, d.SECTION, p.ASSORTLOT, p.MACHINE, OPERATION_CODE, count(issue) ISSUES, count(scan) SCANS, count(issue)-count(scan) as VAR, SUM(ISSUE_UNIT) ISSUES_UNIT, SUM(SCAN_UNIT) SCANS_UNIT from "
            + " (select t2.WORK_LOT, t2.TICKET as issue, t2.OPERATION_CODE, e.TICKET as scan, t2.UNITS as ISSUE_UNIT, e.UNITS as SCAN_UNIT from "
            + " (select t1.WORK_LOT, a.TICKET, a.OPERATION_CODE, a.UNITS from "
            + " (select distinct work_lot from cutting_system.employee_scanticket where FILE like '%" + shift + "_" + date + "%' and work_lot!='') t1 "
            + " inner join cutting_system.bundleticket_active a on t1.WORK_LOT=a.WORK_LOT) t2 left join cutting_system.employee_scanticket e on t2.TICKET=e.TICKET) t3 "
            + " left join erpsystem.data_cutpartcutting d on t3.WORK_LOT=d.WORK_LOT "
            + " left join (select * from erpsystem.setup_plancutting group by WLs) p on t3.WORK_LOT=p.WLs "
            + " group by work_lot, operation_code) t1 where SECTION is null order by Machine, AssortLot, WORK_LOT;"
        connection.query(sql, function (err, result, fields) {
            connection.release();
            if (err) throw err;
            res.send(result);
            res.end();
        });
    });
});

// code xác nhận tem lương
app.get("/Cutting/Check_Tem/:emp_id", function (request, response) {
    var emp_id = request.params.emp_id;
    var date = request.query.date;
    var date2 = new Date(date);
    date2.setDate(date2.getDate() + 1);
    var dateto = date2.toISOString().slice(0, 10);
    rfid_convert(emp_id, function (result) {
        if (emp_id.length > 6) {
            emp_id = result;
            // mã 10 số
            con2.getConnection(function (err, connection_rfid) {
                connection_rfid.query('select employeeid,name from setup_rfidemplist where cardno="' + emp_id + '";', function (err2, result2, fields) {
                    connection_rfid.release();
                    if (err2) throw err2;
                    if (result2.length > 0) {
                        emp_id = result2[0].employeeid;
                        emp_id = emp_id.slice(-5)
                        con_server_cutting.getConnection(function (err, con_newticket) {
                            if (err) throw err;
                            var sql = 'SELECT e.TICKET, a.OPERATION_CODE, a.EARNED_HOURS, a.UNITS, a.WORK_LOT, a.SAH_ADJ, e.FILE '
                            +'FROM cutting_system.employee_scanticket e inner join cutting_system.bundleticket_active a on e.TICKET=a.TICKET '
                            +'where EMPLOYEE LIKE "'+emp_id+'%" and e.TimeUpdate<="'+dateto+' 06:00:00" and e.TimeUpdate>="'+date+' 06:00:00";'
                            console.log(sql)
                            con_newticket.query(sql, function (err, result_data, fileds) {
                                con_newticket.release();
                                if (err) throw err;
                                if (result_data.length > 0) {
                                    var restext = [{ 'status': true, 'data': result_data }];
                                    // var jsres = JSON.stringify(restext);
                                    response.send(restext);
                                    response.end();
                                } else {
                                    var restext = [{ 'status': false, 'data': [] }];
                                    // var jsres = JSON.stringify(restext);
                                    response.send(restext);
                                    response.end();
                                }


                            });
                        });  
                    } else {
                        console.log('zo else')
                        // var status = "không dò được mã thẻ, vui lòng nhập tay";
                        // var date_in = "-";
                        // var time_in = "-";
                        // var typ = "-";
                        // var restext = [{ 'name': emp_name, 'id6': emp_id, 'st': status, 'di': date_in, 'ti': typ, 'shift': shift, 'result': "" }];
                        // var jsres = JSON.stringify(restext);
                        // response.send(restext);
                        // response.end();
                    };

                });
            });
        };
        //after convert RFID
    });
});

app.get("/cutting/get-info-employee/:emp_id", function (request, response) {
    var emp_id = request.params.emp_id;
    rfid_convert(emp_id, function (result) {
        if (emp_id.length > 6) {
            emp_id = result;
            // mã 10 số
            con2.getConnection(function (err, connection_rfid) {
                connection_rfid.query('select employeeid,name from setup_rfidemplist where cardno="' + emp_id + '";', function (err2, result2, fields) {
                    connection_rfid.release();
                    if (err2) throw err2;
                    if (result2.length > 0) {
                        emp_id = result2[0].employeeid;
                        con_server_cutting.getConnection(function (err, con_newticket) {
                            if (err) throw err;
                            var sql = 'SELECT ID, NAME, Shift FROM erpsystem.setup_emplist s WHERE s.ID = "'+emp_id+'"';
                            console.log(sql)
                            con_newticket.query(sql, function (err, result_data, fileds) {
                                con_newticket.release();
                                if (err) throw err;
                                if (result_data.length > 0) {
                                    response.send(result_data);
                                    response.end();
                                }
                            });
                        });  
                    }
                });
            });
        };
        //after convert RFID
    });
});

app.get("/cutting/check-payroll", function (request, response) {
    var emp_id = request.query.emp_id;
    var date = request.query.date;
    rfid_convert(emp_id, function (result) {
        if (emp_id.length > 6) {
            emp_id = result;
            // mã 10 số
            con2.getConnection(function (err, connection_rfid) {
                connection_rfid.query('select employeeid,name from setup_rfidemplist where cardno="' + emp_id + '";', function (err2, result2, fields) {
                    connection_rfid.release();
                    if (err2) throw err2;
                    if (result2.length > 0) {
                        emp_id = result2[0].employeeid;
                        con_server_cutting.getConnection(function (err, con_newticket) {
                            if (err) throw err;
                            var sql = 'SELECT * FROM cutting_system.confirm_payroll s WHERE employee = "'+emp_id+'" and date = "'+date+'"';
                            console.log(sql)
                            con_newticket.query(sql, function (err, result_data, fileds) {
                                con_newticket.release();
                                if (err) throw err;
                                if (result_data.length > 0) {
                                    response.send(result_data);
                                    response.end();
                                } else {
                                    response.send([]);
                                    response.end();
                                }
                            });
                        });  
                    }
                });
            });
        };
    });
});

app.get("/cutting/confirm-payroll", function (request, response) {
    var employee = request.query.employee;
    var date = request.query.date;
    var keyx = date+"_"+employee
    con_server_cutting.getConnection(function (err, con_newticket) {
        if (err) throw err;
        var sql = "REPLACE INTO cutting_system.confirm_payroll (keyx, date, employee, timeupdate) "
        +"VALUES ('"+keyx+"', '"+date+"', '"+employee+"', NOW()) ";
        console.log(sql)
        con_newticket.query(sql, function (err, result_data, fileds) {
            con_newticket.release();
            if (err) {
                response.send({'status' : false});
                response.end();
            } else {
                response.send({'status' : true});
                response.end();
            }
            
        });
    });  
});

app.post("/cutting/insert-feedback-payroll", function (request, response) {
    var employee = request.body.employee;
    var date = request.body.date;
    var content = request.body.content;
    con_server_cutting.getConnection(function (err, con_newticket) {
        if (err) throw err;
        var sql = "INSERT INTO cutting_system.feedback_payroll (date, employee, content, timeupdate) "
        +"VALUES ('"+date+"', '"+employee+"', '"+content+"', NOW()) ";
        console.log(sql)
        con_newticket.query(sql, function (err, result_data, fileds) {
            con_newticket.release();
            if (err) {
                response.send({'status' : false});
                response.end();
            } else {
                response.send({'status' : true});
                response.end();
            }
            
        });
    });  
});

app.get("/cutting/check-date-confirm", function (request, response) {
    var employee = request.query.employee;
    con_server_cutting.getConnection(function (err, con_newticket) {
        if (err) throw err;
        var sql = "SELECT employee, DATE_FORMAT(date, '%Y-%m-%d') as date FROM cutting_system.confirm_payroll where employee = '"+employee+"'";
        console.log(sql)
        con_newticket.query(sql, function (err, result_data, fileds) {
            con_newticket.release();
            if (err) {
                response.send(false);
                response.end();
            } else {
                response.send(result_data);
                response.end();
            }
            
        });
    });  
});

app.post('/IT/generateTemp6', function (req, res) {
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

module.exports = app;
