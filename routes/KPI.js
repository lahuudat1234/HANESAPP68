var mysql = require('mysql');
var formidable = require('formidable');
const { PythonShell } = require('python-shell');
require('log-timestamp');
// mysql.create
var con3 = mysql.createPool({
    connectionLimit: 500,
    host: "pbvweb01v",
    user: "tranmung",
    password: "Tr6nM6ng",
    database: 'erphtml',
    authPlugins: {
        mysql_clear_password: () => () => Buffer.from('your_password') // Provide the password as a Buffer
    }
});
var con2 = mysql.createPool({
    connectionLimit: 500,
    host: "pbvweb01v",
    user: "tranmung",
    password: "Tr6nM6ng",
    database: 'erpsystem',
    authPlugins: {
        mysql_clear_password: () => () => Buffer.from('your_password') // Provide the password as a Buffer
    }
});
//cau hinh doc ejs
var express = require("express");
var app = express.Router();

app.get("/KPI/Sup_Evaluate", function (request, res) {
    if (request.isAuthenticated()) {
        if(request.user=='mdbeg') res.render("HR/KPI/Sup_Submit_English");
        else res.render("HR/KPI/Sup_Submit");
    }
    else {
        res.render("login");
    }
});
app.get("/KPI/Report", function (request, res) {
    if (request.isAuthenticated()) {
        get_dept(request.user, function (result) {
            user = result[0].User;
            dept = result[0].Department;
            position = result[0].Position;
            if (position == null) position = '';
            // console.log(result)
            if (position.includes('Manager') || request.user.toLowerCase() == 'mutran' || position.includes('Assistan') || request.user.toLowerCase() == 'hadinh' || request.user.toLowerCase() == 'quly') {
                if (request.user.toLowerCase() == 'lien.tran' || request.user.toLowerCase() == 'nghang' || request.user.toLowerCase() == 'mutran' || request.user.toLowerCase() == 'lehung' || request.user.toLowerCase() == 'hadinh' || request.user.toLowerCase() == 'quly')
                    res.render("HR/KPI/Report", { Dept: "ALL" });
                else res.render("HR/KPI/Report", { Dept: dept });
            }
            else res.send("Bạn không được phân quyền vào trang này!");
        });
    }
    else {
        res.render("login");
    }
});
function get_dept(user, callback) {
    var dept = '';
    con2.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        connection.query("SELECT User, Department, Position FROM setup_user where User='" + user + "';", function (err, result, fields) {
            connection.release();
            if (err) throw err;
            return callback(result);
        });
    });
    return dept;
}
app.get("/KPI/Self_Evaluate", function (request, res) {
    if (request.isAuthenticated()) {
        if(request.user=='mdbeg') res.render("HR/KPI/Emp_Submit_English");
        else res.render("HR/KPI/Emp_Submit");
    }
    else {
        res.render("login");
    }
});
app.get("/KPI", function (request, res) {
    if (request.isAuthenticated()) {
        if(request.user=='mdbeg') res.render("HR/KPI/Emp_Submit_English");
        else res.render("HR/KPI/Emp_Submit");
    }
    else {
        res.render("login");
    }
});
app.post('/Employee/Upload_KPI_Attach', function (req, res) {
    // ID=req.body.ID;
    var form = new formidable.IncomingForm();
    attachFile = '';
    form.parse(req);
    form.on('fileBegin', function (name, file) {
        attachFile = file.name;
        file.path = './public/Assets/Employee/KPI/' + attachFile;
    });
    form.on('file', function (name, file) {
        res.send('done');
        res.end();
    });
});
app.post("/Employee/Self_Evaluate", function (req, res) {
    if (req.isAuthenticated()) {
        IDKey = req.body.ID;
        empID = req.body.empID;
        period = req.body.period;
        txt_data = req.body.txt_data;
        year = req.body.year;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        userUpdate = req.user;
        con3.getConnection(function (err, connection) {
            if (err) throw err;
            sql1 = "select ID from employee_kpi where ID='" + IDKey + "'";
            connection.query(sql1, function (err, result, fields) {
                if (err) throw err;
                if (result.length > 0) {
                    sql2 = "update employee_kpi set EmpEvaluate='" + txt_data + "', TimeEmpSubmit='" + timeUpdate + "', UserEmpSubmit='" + userUpdate + "' where ID='" + IDKey + "';"
                    connection.query(sql2, function (err, result, fields) {
                        // connection.release();
                        if (err) throw err;
                        connection.release();
                        res.send('done_update');
                        res.end();
                    });
                } else {
                    sql = "replace into employee_kpi(ID, IDEmp, Period, Year, EmpEvaluate, TimeEmpSubmit, UserEmpSubmit) "
                        + " values('" + IDKey + "', '" + empID + "', '" + period + "', '" + year + "', '" + txt_data + "', '" + timeUpdate + "', '" + userUpdate + "');";
                    connection.query(sql, function (err, result, fields) {
                        // connection.release();
                        if (err) throw err;
                        connection.release();
                        res.send('done');
                        res.end();
                    });
                }
            })
        });
    } else {
        res.render("login");
    }
});
app.post("/Employee/Load_Available_Evaluate", function (req, res) {
    if (req.isAuthenticated()) {
        userSup = req.body.UserSup;
        con3.getConnection(function (err, connection) {
            if (err) throw err;
            sql1 = 'select IDName from erpsystem.setup_user where User="' + userSup + '";'
            connection.query(sql1, function (err, result, fields) {
                if (err) throw err;
                IDKey = result[0].IDName;
                sql = "select c8.*, e.User from "
                    + " ((select c.Supervisor from erphtml.employee_organize_chart c where c.ID='" + IDKey + "') "
                    + " union "
                    + " (select c1.Supervisor from "
                    + " (select c.Supervisor from erphtml.employee_organize_chart c where c.ID='" + IDKey + "') c  "
                    + " inner join erphtml.employee_organize_chart c1 on c.Supervisor=c1.ID) "
                    + " union "
                    + " (select c3.Supervisor from "
                    + " (select c1.Supervisor from "
                    + " (select c.Supervisor from erphtml.employee_organize_chart c where c.ID='" + IDKey + "') c  "
                    + " inner join erphtml.employee_organize_chart c1 on c.Supervisor=c1.ID) c2 "
                    + " inner join erphtml.employee_organize_chart c3 on c2.Supervisor=c3.ID) "
                    + " union "
                    + " (select c5.Supervisor from "
                    + " (select c3.Supervisor from "
                    + " (select c1.Supervisor from "
                    + " (select c.Supervisor from erphtml.employee_organize_chart c where c.ID='" + IDKey + "') c  "
                    + " inner join erphtml.employee_organize_chart c1 on c.Supervisor=c1.ID) c2 "
                    + " inner join erphtml.employee_organize_chart c3 on c2.Supervisor=c3.ID) c4 "
                    + " inner join erphtml.employee_organize_chart c5 on c4.Supervisor=c5.ID)"
                    + " union"
                    + " (select c7.Supervisor from "
                    + " (select c5.Supervisor from "
                    + " (select c3.Supervisor from "
                    + " (select c1.Supervisor from "
                    + " (select c.Supervisor from erphtml.employee_organize_chart c where c.ID='" + IDKey + "') c  "
                    + " inner join erphtml.employee_organize_chart c1 on c.Supervisor=c1.ID) c2 "
                    + " inner join erphtml.employee_organize_chart c3 on c2.Supervisor=c3.ID) c4 "
                    + " inner join erphtml.employee_organize_chart c5 on c4.Supervisor=c5.ID) c6"
                    + " inner join erphtml.employee_organize_chart c7 on c6.Supervisor=c7.ID)) c8 inner join erpsystem.setup_user e "
                    + " on c8.Supervisor=e.IDName;"
                connection.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    connection.release();
                    isEditable = 'N';
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].User.toLowerCase() == req.user.toLowerCase()) isEditable = 'Y';
                    }
                    res.send(isEditable);
                    res.end();
                });
            });
        });
    } else {
        res.render("login");
    }
});
app.post("/Employee/Load_Employees", function (req, res) {
    if (req.isAuthenticated()) {
        IDKey = req.body.ID;
        position = req.body.position;
        period = req.body.period;
        con3.getConnection(function (err, connection) {
            if (err) throw err;
            sql = "select k2.ID, Col1, e.Name, c.Position, c.Dept, e.Plant, kpi.ID File, kpi.Evaluate, UserSupSubmit from erpsystem.setup_emplist e inner join "
                + " ( "
                + " select ID, 0 as 'Col1' from employee_organize_chart where Supervisor='" + IDKey + "' "
                + " union "
                + " select o.ID, 1 as 'Col1' from employee_organize_chart o inner join "
                + " (select ID from employee_organize_chart where Supervisor='" + IDKey + "') t1 on o.Supervisor=t1.ID "
                + " union "
                + " select o2.ID, 2 as 'Col1' from employee_organize_chart o2 inner join "
                + " (select o1.ID from employee_organize_chart o1 inner join "
                + " (select ID from employee_organize_chart where Supervisor='" + IDKey + "') t1 on o1.Supervisor=t1.ID) "
                + " t2 on t2.ID=o2.Supervisor "
                + " union "
                + " select o3.ID, 3 as 'Col1' from employee_organize_chart o3 inner join "
                + " (select o2.ID from employee_organize_chart o2 inner join "
                + " (select o1.ID from employee_organize_chart o1 inner join "
                + " (select ID from employee_organize_chart where Supervisor='" + IDKey + "') t1 on o1.Supervisor=t1.ID) "
                + " t2 on t2.ID=o2.Supervisor) t3 on o3.Supervisor=t3.ID "
                + " union "
                + " select o4.ID, 4 as 'Col1' from employee_organize_chart o4 inner join "
                + " (select o3.ID from employee_organize_chart o3 inner join "
                + " (select o2.ID from employee_organize_chart o2 inner join "
                + " (select o1.ID from employee_organize_chart o1 inner join "
                + " (select ID from employee_organize_chart where Supervisor='" + IDKey + "') t1 on o1.Supervisor=t1.ID) "
                + " t2 on t2.ID=o2.Supervisor) t3 on o3.Supervisor=t3.ID) t4 on o4.Supervisor=t4.ID "
                + " ) k2 on e.ID=k2.ID "
                + " inner join employee_organize_chart c on k2.ID=c.ID "
                + " left join (select ID, IDEmp, Evaluate, UserSupSubmit from employee_kpi where Period='" + period + "') kpi on k2.ID=kpi.IDEmp GROUP BY k2.ID ORDER BY Col1;"
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                connection.release();
                res.send(result);
                res.end();
            });
        });
    } else {
        res.render("login");
    }
});
app.post("/Employee/Load_Employee_KPI_Detail", function (req, res) {
    if (req.isAuthenticated()) {
        IDKey = req.body.ID;
        con3.getConnection(function (err, connection) {
            if (err) throw err;
            sql = "select EmpEvaluate, SupEvaluate, SupRecommend, SupNote, Evaluate, TimeEmpSubmit, TimeSupSubmit, UserSupSubmit from employee_kpi where ID='" + IDKey + "';";
            // console.log(sql)
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                connection.release();
                res.send(result);
                res.end();
            });
        });
    } else {
        res.render("login");
    }
});
app.post("/Employee/Submit_Employee_KPI_Detail", function (req, res) {
    if (req.isAuthenticated()) {
        IDKey = req.body.ID;//ID+month+quy+year
        selfEvaluate = req.body.selfEvaluate;
        supEvaluate = req.body.supEvaluate;
        supRecommend = req.body.supRecommend;
        supNote = req.body.supNote;
        evaluateResult = req.body.evaluate;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        userUpdate = req.user;
        con3.getConnection(function (err, connection) {
            if (err) throw err;
            sql = "update employee_kpi set EmpEvaluate='" + selfEvaluate + "', SupEvaluate='" + supEvaluate + "', SupRecommend='" + supRecommend + "', SupNote='" + supNote + "', Evaluate='" + evaluateResult + "', TimeSupSubmit='" + timeUpdate + "', UserSupSubmit='" + req.user + "' where ID='" + IDKey + "';";
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                connection.release();
                res.send("done");
                res.end();
            });
        });
    } else {
        res.render("login");
    }
});
app.post("/HR/KPI_Report_Detail", function (req, res) {
    if (req.isAuthenticated()) {
        keyID = req.body.ID;
        empID = req.body.empID;
        supID = req.body.supID;
        dept = req.body.dept;
        evaluate = req.body.evaluate;
        plant = req.body.plant;
        join_sql = 'left';
        if (empID != '' || evaluate != '') join_sql = 'inner';
        con3.getConnection(function (err, connection) {
            if (err) throw err;
            sql = "select t2.ID EmpID, t2.Name EmpName, t2.Position, t2.Dept, t2.Plant, t2.Supervisor SupID, e1.Name SupName, t2.Evaluate, t2.File "
                + " from erpsystem.setup_emplist e1 inner join "
                + " (select t1.ID, e.Name, t1.Position, t1.Dept, e.Plant, t1.Supervisor, t1.Evaluate, t1.File "
                + " from erpsystem.setup_emplist e inner join "
                + " (select o.ID, Dept, Position, Supervisor, k.ID File, k.Evaluate from "
                + " (select * from employee_organize_chart "
                + " where ID like'%" + empID + "%' and Supervisor like '%" + supID + "%' and Dept like '%" + dept + "%') o " + join_sql + " join "
                + " (select * from employee_kpi where Period='" + keyID + "' and Evaluate like '%" + evaluate + "%') k on o.ID=k.IDEmp) t1 "
                + " on e.ID=t1.ID) t2 on t2.Supervisor=e1.ID where t2.Plant like '%" + plant + "%' order by SupName;"
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                connection.release();
                res.send(result);
                res.end();
            });
        });
    } else {
        res.render("login");
    }
});
app.post('/KPI/Export_KPI_File', function (req, res) {
    if (req.isAuthenticated()) {
        keyID = req.body.ID;
        empID = req.body.empID;
        supID = req.body.supID;
        dept = req.body.dept;
        evaluate = req.body.evaluate;
        plant = req.body.plant;
        period = req.body.period;
        year = req.body.year;
        var options = {
            mode: 'text',
            pythonPath: 'python',
            scriptPath: './public/Python/HR/KPI',
            pythonOptions: ['-u'],
            args: [keyID, empID, supID, dept, evaluate, plant, process.cwd(), period, year]
        }
        let shell = new PythonShell('export_kpi.py', options);
        shell.on('message', function (message) {
            // res.setHeader("Content-Type", "application/json");
            res.send(message);
            res.end();
        });
    } else {
        res.render("login");
    }
});
app.post("/HR/Load_KPI_Period", function (req, res) {
    if (req.isAuthenticated()) {
        year = req.body.year;
        con3.getConnection(function (err, connection) {
            if (err) throw err;
            sql = "SELECT k.*, IF(CURDATE()>=STARTDATE AND CURDATE()<=EXPIREDDATE, '1','0') IN_PERIOD FROM setup_kpi_period k where YEAR_PD='" + year + "' ORDER BY STARTDATE DESC;";
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                connection.release();
                res.send(result);
                res.end();
            });
        });
    } else {
        res.render("login");
    }
});
app.post("/HR/Add_KPI_Period", function (req, res) {
    if (req.isAuthenticated()) {
        period_name = req.body.period_name;
        period_year = req.body.period_year;
        period_note = req.body.period_note;
        period_from = req.body.period_from;
        period_to = req.body.period_to;
        IDKey = period_name + period_from + period_to
        con3.getConnection(function (err, connection) {
            if (err) throw err;
            sql = "Replace into erphtml.setup_kpi_period (ID, YEAR_PD, NAME, NOTE, STARTDATE, EXPIREDDATE, TIMEUPDATE, USER) "
                + " values ('" + IDKey + "', '" + period_year + "', '" + period_name + "', '" + period_note + "', '" + period_from + "', '" + period_to + "', NOW(), '" + req.user + "');";
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                connection.release();
                res.send('done');
                res.end();
            });
        });
    } else {
        res.render("login");
    }
});
app.post("/HR/Update_KPI_Period", function (req, res) {
    if (req.isAuthenticated()) {
        period_name = req.body.period_name;
        period_year = req.body.period_year;
        period_note = req.body.period_note;
        period_from = req.body.period_from;
        period_to = req.body.period_to;
        IDKey = req.body.IDKey;
        con3.getConnection(function (err, connection) {
            if (err) throw err;
            sql = "update erphtml.setup_kpi_period set NOTE='" + period_note + "', STARTDATE='" + period_from + "', EXPIREDDATE='" + period_to + "', TIMEUPDATE=NOW(), USER='" + req.user + "' where ID='" + IDKey + "';"
            // +" values ('"+IDKey+"', '"+period_year+"', '"+period_name+"', '"+period_note+"', '"+period_from+"', '"+period_to+"', NOW(), '"+req.user+"');";
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                connection.release();
                res.send('done');
                res.end();
            });
        });
    } else {
        res.render("login");
    }
});
app.post('/KPI/Upload_KPI_Organize_Chart', function (req, res) {
    if (req.isAuthenticated()) {
        var form = new formidable.IncomingForm();
        excelFile = '';
        form.parse(req);
        form.on('fileBegin', function (name, file) {
            excelFile = req.user + '_' + file.name;
            file.path = './public/Python/HR/KPI/Upload/' + excelFile;
        });

        form.on('file', function (name, file) {
            var options = {
                mode: 'text',
                pythonPath: 'python',
                scriptPath: './public/Python/HR/KPI',
                pythonOptions: ['-u'],
                args: [excelFile, process.cwd(), req.user]
            }
            let shell = new PythonShell('upload_organize_chart.py', options);
            shell.on('message', function (message) {
                // res.setHeader("Content-Type", "application/json");
                res.send(message);
                res.end();
            })
        });
    } else {
        res.render("login");
    }
});


module.exports = app;