var mysql = require('mysql');
const socketIO = require("socket.io");
require('log-timestamp');
// var dateFormat = require('dateformat');
var con1 = mysql.createPool({
    connectionLimit: 500,
    host: 'pbvweb01v',
    user: 'tranmung',
    password: 'Tr6nM6ng',
    database: 'linebalancing', authPlugins: {
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
var con3 = mysql.createPool({
    connectionLimit: 500,
    host: 'pbvweb01v',
    user: 'tranmung',
    password: 'Tr6nM6ng',
    database: 'erphtml',
    authPlugins: {
        mysql_clear_password: () => () => Buffer.from('your_password') // Provide the password as a Buffer
    }
});
var con4 = mysql.createPool({
    connectionLimit: 500,
    host: 'pbvweb01v',
    user: 'tranmung',
    password: 'Tr6nM6ng',
    database: 'pr2k',
    authPlugins: {
        mysql_clear_password: () => () => Buffer.from('your_password') // Provide the password as a Buffer
    }

});
var con5 = mysql.createPool({
    connectionLimit: 500,
    host: 'pbvweb01v',
    user: 'LaDat',
    password: 'l4d4t5',
    database: 'cutting_system',
    authPlugins: {
        mysql_clear_password: () => () => Buffer.from('your_password') // Provide the password as a Buffer
    }
});
var pr2k_con_pbvp = mysql.createPool({
    connectionLimit : 100,
    host: "pbvpweb01",
    user: "LaDat",
    password: "l4d4t5",
    database: "pr2k"
});
var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var logger = require("morgan");
var LocalStrategy = require('passport-local').Strategy;
const { PythonShell } = require('python-shell');
var formidable = require('formidable');
app.use(flash());

var compression = require('compression')
app.use(compression({
    level: 6,
    threshold: 100 * 500,

    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            // don't compress responses with this request header
            return false
        }
        return compression.filter(req, res)
    }

}));

// Static link file,routes,reporting
var staticResource = '//pbvfps1/Bundle_Scan/';
var staticResource2 = '//pbv-h0m2wv2/BK_Bundle/ScanTemp/Others/';
var staticResource3 = '//pbv-h0m2wv2/BK_Bundle1/Cutting/';
var staticResource4 = '//pbvfps1/Bundle_Scan/Cutting/';
var staticResource5 = '//pbv-h0m2wv2/BK_Bundle1/Backup/';
var staticResource6 = '//pbv-h0m2wv2/BK_Bundle2/Others/';
var staticResource7 = '//pbv-h0m2wv2/BK_Bundle2/Backup/';
var staticResource8 = '//pbv-h0m2wv2/BK_Bundle3/Backup/';
var staticResource9 = '//pbvfps1/SCAN/Bundle_scan/';
var staticResource10 = '//pbvfps1/SEWING/Bundle_Scan/';
var staticResource11 = '//pbvfps1/Bundle_Scan/backup/';

var staticReport = '//pbvfps1/PBShare2/Scan/Report/ReportWebserver/';

var imgpath1 = '\\\\10.113.90.40\\ScantemPB1\\scan_tem'
var imgpath2 = '\\\\10.113.90.98\\ScantemPB2\\scan_tem'




app.use('/image', express.static(staticResource));
app.use('/image2', express.static(staticResource2));
app.use('/image3', express.static(staticResource3));
app.use('/image4', express.static(staticResource4));
app.use('/image5', express.static(staticResource5));
app.use('/image6', express.static(staticResource6));
app.use('/image7', express.static(staticResource7));
app.use('/image8', express.static(staticResource8));
app.use('/image9', express.static(staticResource9));
app.use('/image10', express.static(staticResource10));
app.use('/report', express.static(staticReport));

app.use("/imgpath", express.static(imgpath1));
app.use("/imgpath2", express.static(imgpath2));

app.use('/image11', express.static(staticResource11));

// Link Public Folder
var cssPath = path.resolve(__dirname, "CSS");
var publicPath = path.resolve(__dirname, "public");
var dbPath = path.resolve(__dirname, "db");


app.use("/CSS", express.static(cssPath));
app.use("/public", express.static(publicPath));
app.use("/db", express.static(dbPath));
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(session({
//     secret: "vanmungtran",
//     saveUninitialized: true,
//     resave: true
// }));

app.use(session({
    name: 'app1.sid', // Đổi tên cookie cho ứng dụng đầu tiên
    secret: 'secret1',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Đặt thành true nếu sử dụng HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(logger("dev"));


// var CCS = require('./routes/CCS-System');//CCS

var Employee = require("./routes/Employee"); //EP
var FIN = require("./routes/FinancePB"); //EP
var HR = require("./routes/HumanResources");//HR
var Talent = require("./routes/TalentDevelopment"); //Talent
var KPI = require("./routes/KPI");//KPI
var QC = require("./routes/QC");//QC

// var ccsMung = require('./routes/CCS2')

var Planning = require('./routes/Planning')
var WareHouse = require('./routes/WareHouse')
// var cutting=require('./modules/cutting/cutting')// Cuting
var CuttingSystem = require('./routes/CuttingSystem')
var IT = require('./routes/IT')
var quality = require('./routes/quality-laboratory');//InnovationEngineering


// app.use('/', CCS);
// app.use('/', PI);
app.use("/", Employee);
app.use("/", FIN);
app.use('/', HR);
app.use("/", Talent);
app.use('/', KPI);
app.use('/', QC);

// app.use('/', ccsMung);
app.use('/', Planning);
app.use('/', WareHouse);
app.use('/', CuttingSystem);
app.use('/', IT);
app.use('/', quality);


app.set("view engine", "ejs");
app.set("views", "./views");


// app.set("view engine", "ejs");
// app.set("views", "./views");
// var server = require("http").Server(app);
// var io = require("socket.io")(server);
// server.listen(80, host);
// var port=80;
// var server = require("http").Server(app);
// var io = require("socket.io")(server);
// // server.listen(80, 'pbv-fzvx8x2');
// // console.log('Start running Server PBV-FZVX8X2');
// app.listen(port, () => {
//     console.log(`Running HanesPhubai-Mysql ${port}`)
//   });
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(68, 'PBVPWEB01');
//======================================POST GET HTTP Routers==============================================
app.get("/", function (request, response) {
    response.render("home", { ID: 'anonymous' });
    // console.log(request.user);
    
    // if (!request.isAuthenticated()) {
    //     respone.render("login");
    // } else {
    //     respone.render("home", { ID: request.user });
    // }
});

app.get("/logout", function (request, response) {
    // request.logout();
    response.render("login");
});

app.get("/login", function (request, response) {
    // request.logout();
    response.render("login");
    response.end();
});


app.post('/login', passport.authenticate("local", {
    failureRedirect: '/login',
    failureFlash: true
}), function (req, res) {
    get_dept(req.user, function (result) {
        console.log(result);
        user = result[0].User;
        dept = result[0].Department;
        position = result[0].Position;
        if (dept == "IE") {
            res.redirect('/')
        }
        else if (user == "ltdang") {
            res.redirect('/CCS/OperationDirector/NoPlantManager')
        }
        else if (user == "giphan"){
            res.redirect('/CCS/IND/Manager');
        }
        // else if (user == "phtuan") {
        //     res.redirect('/CCS/OperationDirector/NoPlantManager')
        // }
        // else if (user == "giphan"){
        //     res.redirect('/CCS/IND/Manager');
        // }
        // else if (dept == "HR") {
        //     res.redirect('/HR')
        // }
        // else if (dept == "AD") {
        //     res.redirect('/')
        // }
        // else if (dept == "FI") {
        //     res.redirect('/Finance/Finance_page')
        // }
        // else if (dept == "AM") {
        //     res.redirect('/AM/dashboard')
        // }
        // else if (dept == "PR") {
        //     res.redirect('/Production/PayrollCheck')
        // }
        // else if (dept == "AMTPR") {
        //     res.redirect('/Production/PayrollCheck')
        // }

        else {
            res.redirect('/')
            res.end();
        }

    })
})
// ---

passport.use(new LocalStrategy(
    (username, password, done) => {
        var flagLogin = false;
        con2.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query("SELECT Password, Position FROM setup_user where User='" + username + "';", function (err, result, fields) {
                connection.release();
                if (err) throw err;
                if (result.length > 0) {
                    if (password == result[0].Password) {
                        console.log(username + ' logged in');
                        flagLogin = true;
                        return done(null, username);
                    }
                }
                if (flagLogin == false) {
                    return done(null, false);
                }
            });
        });
    }
));
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
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
            if (result.length > 0) {
                // dept=result[0].Department;
                return callback(result);
            }
        });
    });
    return dept;
};

function get_date_infor(date, callback) {
    con4.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        connection.query("select StartTime, FinishTime, Shift, Note, Week from pr2k.operation_schedule where DATE='" + date + "';", function (err, result, fields) {
            connection.release();
            if (err) throw err;
            if (result.length > 0) {
                // dept=result[0].Department;
                return callback(result);
            }
        });
    });
    // return dept;
};

function get_sup_group(user, callback) {
    var dept = '';
    con2.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        // sql = ("SELECT IF(GR_RIT IS NULL, GR_BAL, GR_RIT) NAMEGROUP, IF(SUP_RIT IS NULL, 'B', 'R') SHIFT FROM "
        // + " (SELECT g1.NameGroup GR_RIT, g2.NameGroup GR_BAL, g1.SupervisorRitmo SUP_RIT, g2.SupervisorBali SUP_BAL "
        // + " FROM (SELECT NAME FROM setup_user WHERE USER='" + user + "') AS Temp1 "
        // + " left JOIN setup_group g1 ON g1.SUPERvisorRitmo=Temp1.NAME "
        // + " left JOIN setup_group g2 ON g2.SUPERvisorBali=Temp1.NAME) t2 GROUP BY SHIFT;")
        sql=("SELECT IF(GR_RIT IS NULL, GR_BAL, GR_RIT) NAMEGROUP, IF(SUP_RIT IS NULL, 'B', 'R') SHIFT FROM"
        + " (SELECT g1.NameGroup GR_RIT, g2.NameGroup GR_BAL, g1.SupervisorRitmo SUP_RIT, g2.SupervisorBali SUP_BAL"
        + " FROM (SELECT NAME FROM setup_user WHERE USER='" + user + "') AS Temp1" 
        + " left JOIN (SELECT * from setup_group g1 WHERE g1.`StatusScan`='Enable') g1 ON g1.SUPERvisorRitmo=Temp1.NAME" 
        + " left JOIN (SELECT * from setup_group g2 WHERE g2.`StatusScan`='Enable') g2 ON g2.SUPERvisorBali=Temp1.NAME) t2 GROUP BY SHIFT;")
        
        connection.query(sql, function (err, result, fields) {
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

// SocketIO
io.sockets.on('connection', function (socket) {
    // socket.on('call-auto-kanban', function(data){
    //     io.sockets.emit('client-response-warehouse', data);
    // });

    socket.on('warehouse-send-kanban', function (data) {
        io.sockets.emit('client-receive-kanban', data);
    });
    socket.on('client-send-kanban', function (data) {
        io.sockets.emit('warehouse-receive-kanban', data);
    });
    //cutpart checkin
    socket.on('submit-cutpart-checkin', function (barcode) {
        con2.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "SELECT SHIFT, WORKLOT, OUTPUT, MOONROCKNUMBER, TOTALMOONROCK, TIMESCAN, PRINTCODE FROM data_scancutpartcutting where Barcode='" + barcode + "';";
            if (barcode.length == 6)
                sql = "SELECT SHIFT, WORKLOT, OUTPUT, MOONROCKNUMBER, TOTALMOONROCK, TIMESCAN, PRINTCODE FROM data_scancutpartcutting where Worklot='" + barcode + "';";
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                if (result.length > 0) {
                    con2.getConnection(function (err, connection) {
                        if (err) {
                            throw err;
                        }
                        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
                        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
                        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
                        sql2 = "UPDATE data_scancutpartcutting set SewingWH='" + timeUpdate + "' where Barcode='" + barcode + "';";
                        if (barcode.length == 6) sql2 = "UPDATE data_scancutpartcutting set SewingWH='" + timeUpdate + "' where Worklot='" + barcode + "';"
                        connection.query(sql2, function (err, result2, fields) {
                            connection.release();
                            if (err) throw err;
                            io.sockets.emit('cutpart-checkin-result', JSON.stringify(result));
                        });
                    });
                } else {
                    io.sockets.emit('cutpart-checkin-result', "error");
                }
            });
        });

    });
});

app.post("/login_user", function (req, res) {
    res.send(req.user);
    res.end();
});

app.post("/Get_Week", function (req, res) {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
    currHrs = parseInt(timeUpdate.substring(11, 13));
    year = timeUpdate.substring(0, 4);
    month = timeUpdate.substring(5, 7);
    day = timeUpdate.substring(8, 10);
    date = year + month + day;
    con4.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        sql = "select WEEK from pr2k.operation_schedule where DATE='" + date + "';";
        connection.query(sql, function (err, result, fields) {
            connection.release();
            if (err) throw err;
            res.send(result);
            res.end();
        });
    });
});

app.post("/Get_RFID", function (req, res) {
    rfid = req.body.rfid;
    con4.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        sql = "select e.ID, e.Name, e.Shift, e.Line, e.Dept, e.Position from erpsystem.setup_rfidemplist r inner join erpsystem.setup_emplist e "
            + " on r.EmployeeID=e.ID where r.CardNo='" + rfid + "' or e.ID='" + rfid + "';";
        connection.query(sql, function (err, result, fields) {
            connection.release();
            if (err) throw err;
            res.send(result);
            res.end();
        });
    });
});

app.post("/Get_User_Infor", function (req, res) {
    con2.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        connection.query("SELECT User, Department, Position, Name FROM setup_user where User='" + req.user + "';", function (err, result, fields) {
            connection.release();
            if (err) throw err;
            res.send(result);
            res.end();
        });
    });
});

app.post("/Get_Group_By_User", function (req, res) {
    get_sup_group(req.user, function (result) {
        res.send(result);
        res.end();
    })
});


//=====================================PRODUCTION==========================================

app.get("/Production/Production", function (req, res) {
    res.redirect('http://pbvpweb01:98')
    res.end()
    // res.render("Production/Production");
});
app.post("/Production/Production/GroupSummary", function (req, res) {
    var date = req.body.date;
    res.send({ result: 'empty' });
    res.end();
    // con4.getConnection(function(err, connection){
    //     if (err) {
    //         connection.release();
    //         throw err;
    //     }
    //     connection.query("SELECT COUNT(DISTINCT employee_scanticket.BUNDLE)*3 as OUTPUT, worklot_active.LOCATION "
    //                         +"FROM pr2k.employee_scanticket left JOIN pr2k.worklot_active ON employee_scanticket.WORK_LOT=worklot_active.WORK_LOT "
    //                         +"WHERE employee_scanticket.DATE='" + date + "' AND employee_scanticket.WORK_LOT IS NOT NULL AND QC!='000000'"
    //                         +"GROUP BY worklot_active.LOCATION;", function (err, result, fields) {
    //         connection.release();
    //         if (err) throw err;
    //         if (result.length>0){
    //             res.send(result);
    //             res.end();
    //         } else {
    //             res.send({result:'empty'});
    //             res.end();
    //         }
    //     });
    // });
});
app.post("/Production/Payroll_Search/GroupOutput", function (req, res) {
    var groupName = req.body.group;
    var shift = req.body.shift;
    var date = req.body.date;
    var dateFile = req.body.dateFile;
    con2.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        groupF = groupName.substring(0, 3);
        groupT = groupName.substring(4, 7);
        if (groupF == '059') {
            groupF = '060';
            groupName = '059-066';
        }
        if (groupT == '059') {
            groupT = '058';
            groupName = '051-059';
        }
        if (groupF == '346') {
            groupF = '347';
            groupName = '347-353';
        }
        shiftT = shift.substring(0, 1);
        groupD = groupF + groupT + shiftT + dateFile;
        sql = "select Operation, COUNT(DIstinct ID) as HC, ROUND(COUNT(DISTINCT BUNDLE)*UNITS/12) as OUTPUT from "
            + " (select LEFT(Ticket,6) as BUNDLE, ID, OPERATION, EARNED_HOURS, UNITS "
            + " from pr2k.employee_scanticket ticket inner join "
            + " (select RIGHT(ID,5) as EMPLOYEE, ID, Name, Line "
            + " from setup_emplist inner join setup_location "
            + " on setup_emplist.Line=setup_location.Location "
            + " where NameGroup='" + groupName + "' and Shift like '" + shiftT + "%' group by ID) as Temp1 on ticket.EMPLOYEE=Temp1.EMPLOYEE "
            + " where ticket.DATE='" + date + "' order by Line) as Temp2 where Operation is not null group by Operation; "
        // sql="select Operation, COUNT(DISTINCT EMPLOYEE) HC, ROUND(SUM(UNITS)/12) OUTPUT from "
        //     +" (select * from "
        //     +" (select t1.*, t2.ID, t2.NAME, t2.LINE from "
        //     +" (select LEFT(TICKET, 6) BUNDLE, EMPLOYEE, OPERATION, EARNED_HOURS, UNITS "
        //     +" from pr2k.employee_scanticket where DATE='"+date+"') t1 left join "
        //     +" (select RIGHT(ID,5) as EMPLOYEE, ID, Name, Line "
        //     +" from setup_emplist  join setup_location "
        //     +" on setup_emplist.Line=setup_location.Location "
        //     +" where NameGroup='"+groupName+"' and Shift like '"+shiftT+"%' group by ID) t2 on t1.EMPLOYEE=t2.EMPLOYEE) t3 "
        //     +" where ID is not null) t4 group by OPERATION;"
        // sql="select * from "
        //     +" (select Operation, COUNT(DIstinct ID) as HC, ROUND(COUNT(DISTINCT BUNDLE)*UNITS/12) as OUTPUT from "
        //     +" (select * from "
        //     +" (select LEFT(Ticket,6) as BUNDLE, ID, OPERATION, EARNED_HOURS, UNITS "
        //     +" from (select * from pr2k.employee_scanticket where DATE='"+date+"' group by EMPLOYEE) ticket "
        //     +" left join "
        //     +" (select ID, Name, Line "
        //     +" from setup_emplist  join setup_location "
        //     +" on setup_emplist.Line=setup_location.Location "
        //     +" where NameGroup='"+groupName+"' and Shift like '"+shiftT+"%' group by ID) as Temp1 on ticket.EMPLOYEE=RIGHT(Temp1.ID, 5) "
        //     +" order by Line) t1 where ID is not null) as Temp2 where Operation is not null group by Operation) t1 where HC>0; "
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
app.post("/Production/Payroll_Search/GroupReport", function (req, res) {
    var groupName = req.body.group;
    var shift = req.body.shift;
    var date = req.body.date;
    groupF = groupName.substring(0, 3);
    groupT = groupName.substring(4, 7);
    if (groupF == '059') {
        groupF = '060';
        groupName = '059-066';
    }
    if (groupT == '059') {
        groupT = '058';
        groupName = '051-059';
    }
    if (groupF == '346') {
        groupF = '347';
        groupName = '347-353';
    }
    // var options={
    //     mode: 'json',
    //     pythonPath: 'python',
    //     scriptPath: './public/Python/Production/ReportUpdate',
    //     pythonOptions: ['-u'], // get print results in real-time
    //     args:[group, shift, date]
    // };
    // let shell=new PythonShell('Group_Report.py', options);
    // shell.on('message', function(message) {
    //     res.setHeader("Content-Type", "application/json");
    //     res.send(message);
    //     res.end();
    // });

    con2.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        var sql = "select ID, Name, Line, CONCAT(OPERATION_CODE,' - ', OPERATION) as Operation, COUNT(Ticket) as Bundle, SUM(EARNED_HOURS) as SAH "
            + " from pr2k.employee_scanticket ticket inner join "
            + " (select RIGHT(ID,5) as EMPLOYEE, ID, Name, Line "
            + " from setup_emplist inner join setup_location "
            + " on setup_emplist.Line=setup_location.Location "
            + " where NameGroup='" + groupName + "' and Shift like '" + shift + "%' group by ID) as Temp1 on ticket.EMPLOYEE=Temp1.EMPLOYEE "
            + " where ticket.DATE='" + date + "'"
            + " group by Temp1.Employee, OPERATION order by OPERATION;";
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
app.get("/Production/PayrollCheck", function (req, res) {
    res.redirect('http://pbvpweb01:98')
    res.end()
    // if (req.isAuthenticated()) {
    //     get_sup_group(req.user, function (result) {
    //         if (result.length > 0) res.render("Production/PayrollCheck", { group: result[0].NAMEGROUP, shift: result[0].SHIFT });
    //         else res.render("Production/PayrollCheck");
    //     });
    // }
    // else {
    //     res.render("login");
    // }
});
// app.get("/Production/PayrollCheck1", function(req, res){
//     if (req.isAuthenticated()) {
//         var sql="SELECT g1.NameGroup, g2.NameGroup, g1.SupervisorRitmo, g2.SupervisorBali "
//             +" FROM (SELECT NAME FROM setup_user WHERE USER='nghong') AS Temp1 "
//             +" left JOIN setup_group g1 ON g1.SUPERvisorRitmo=Temp1.NAME "
//             +" left JOIN setup_group g2 ON g2.SUPERvisorBali=Temp1.NAME;";
//         con2.getConnection(function(err, connection){
//         if (err) {
//             throw err;
//         }
//         connection.query(sql, function (err, result, fields) {
//             connection.release();
//             if (err) throw err;
//             if (result.length>0){
//                 // res.send(result);

//                 res.render("Production/PayrollCheck1", {});
//                 // res.end();
//             } else {
//                 res.send({result:'empty'});
//                 res.end();
//             }
//         });
//     });

//     }
//     else {
//         res.render("login");
//     }
// });
// app.get("/Production/PayrollCheckOld", function(req, res){
//     if (req.isAuthenticated()) {
//         res.render("Production/PayrollCheckOld");
//     }
//     else {
//         res.render("login");
//     }
// });
app.post('/Production/Payroll_Search/GroupNew', function (req, res) {
    if (req.isAuthenticated()) {
        var groupName = req.body.group;
        var date = req.body.date;
        // var bundle=req.body.bundle;
        var year = date.substring(0, 4);
        var month = date.substring(4, 6);
        var day = date.substring(6, 8);
        var dateFull = day + '-' + month + '-' + year;
        var image_list;
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "SELECT Temp4.ISSUE_FILE, LEFT(Temp4.TICKET, 6) AS BUNDLE, max(QC) as QC, COUNT(Temp4.TICKET) AS ISSUE, COUNT(EMPLOYEE) AS SCAN, COUNT(deactive.TICKET) AS IASCAN, COUNT(Temp4.TICKET)-COUNT(EMPLOYEE)-COUNT(deactive.TICKET) AS IS_FULL, MAX(Temp4.FILE) as FILE, Temp4.TimeUpdate, TimeModified FROM "
                + " (SELECT Temp3.FILE AS ISSUE_FILE, Temp3.TICKET, scan.QC, scan.EMPLOYEE, scan.FILE, scan.TimeUpdate, scan.TimeModified FROM pr2k.employee_scanticket scan RIGHT JOIN "
                + " (SELECT TICKET, active2.FILE FROM pr2k.bundleticket_active active2 INNER JOIN (SELECT distinct active.FILE FROM pr2k.bundleticket_active active "
                + " INNER JOIN (SELECT TICKET FROM pr2k.employee_scanticket where FILE LIKE '" + groupName + "_" + dateFull + "%') AS Temp1 "
                + " ON active.TICKET=Temp1.TICKET) AS Temp2 ON active2.`FILE`=Temp2.FILE WHERE active2.FILE!='0') AS Temp3 ON Temp3.TICKET=scan.TICKET) AS Temp4  LEFT JOIN pr2k.bundleticket_deactive deactive ON Temp4.TICKET=deactive.TICKET "
                + " GROUP BY Temp4.ISSUE_FILE;"
            sql2 = "SELECT COUNT(BUNDLE) as COUNT_BUNDLE, QC, SUM(IS_FULL) AS IS_FULL, FILE, TimeUpdate, TimeModified, BUNDLE "
                + "FROM pr2k.employee_scanticket "
                + "WHERE FILE LIKE '" + groupName + "_" + dateFull + "%'"// AND DATE='" + date + "' "
                + "GROUP BY FILE ORDER BY FILE DESC;"
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                if (result.length > 0) {
                    image_list = result;
                    var error_list;
                    con4.getConnection(function (err, connection) {
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
app.post('/Production/Payroll_Search/GroupNew3', function (req, res) {

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
                + " (SELECT Temp3.FILE AS ISSUE_FILE, Temp3.TICKET, scan.QC, scan.EMPLOYEE, scan.FILE, scan.TimeUpdate, scan.TimeModified FROM pr2k.employee_scanticket scan RIGHT JOIN "
                + " (SELECT TICKET, active2.FILE FROM bundleticket_active active2 INNER JOIN (SELECT distinct active.FILE FROM bundleticket_active active "
                + " INNER JOIN (SELECT TICKET FROM pr2k.employee_scanticket where FILE LIKE '" + groupName + "_" + dateFull + "%') AS Temp1 "
                + " ON active.TICKET=Temp1.TICKET) AS Temp2 ON active2.`FILE`=Temp2.FILE WHERE active2.FILE!='0') AS Temp3 ON Temp3.TICKET=scan.TICKET) AS Temp4  LEFT JOIN bundleticket_deactive deactive ON Temp4.TICKET=deactive.TICKET "
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

app.post('/Production/Payroll_Search/GroupNew2', function (req, res) {
    // console.log('Running check lisst issuse');
    if (req.isAuthenticated()) {
        var groupName = req.body.group;
        var date = req.body.date;
        // console.log(date);
        // var bundle=req.body.bundle;
        var year = date.substring(0, 4);
        var month = date.substring(4, 6);
        var day = date.substring(6, 8);
        var dateFull = day + '-' + month + '-' + year;
        var image_list;
        var dk = groupName + "_" + dateFull;
        // console.log('GROUP LINE: '+dk);
        req.setTimeout(100000);
        var options = {
            mode: 'text',
            pythonPath: 'python',
            scriptPath: './public/Python/Production/CheckTicket',
            pythonOptions: ['-u'], // get print results in real-time
            args: [dk]
        };

        let shell = new PythonShell('list_issue.py', options);
        shell.on('message', function (message) {
            // console.log(message);
            if (message != 'fail') {
                image_list = message;
                var error_list;
                con4.getConnection(function (err, connection) {
                    if (err) {
                        throw err;
                    }
                    sql = "SELECT FILE from pr2k.bundleticket_error where FILE like '" + groupName + "_" + dateFull + "%' and MODIFIED IS NULL;"
                    // console.log(sql);
                    connection.query(sql, function (err, result, fields) {
                        connection.release();
                        if (err) throw err;
                        if (result.length > 0) {
                            // console.log(result);
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
    }
    else {
        res.send('login')
        res.end()
    }
});


// app.post('/Production/Payroll_Search/GroupNew', function(req, res){
//     // res.send({image_list:'empty'});
//     // res.end();


//     if (req.isAuthenticated()) {
//         var groupName=req.body.group;
//         var date=req.body.date;
//         // var bundle=req.body.bundle;
//         var year  = date.substring(0,4);
//         var month = date.substring(4,6);
//         var day   = date.substring(6,8);
//         var dateFull=day+'-'+month+'-'+year;
//         var image_list;
//         con4.getConnection(function(err, connection){
//             if (err) throw err;
//             sql="";
//             if (date>='20200712'){
//                 sql="SELECT Temp4.ISSUE_FILE, LEFT(Temp4.TICKET, 6) AS BUNDLE, max(QC) as QC, COUNT(Temp4.TICKET) AS ISSUE, COUNT(EMPLOYEE) AS SCAN, COUNT(deactive.TICKET) AS IASCAN, COUNT(Temp4.TICKET)-COUNT(EMPLOYEE)-COUNT(deactive.TICKET) AS IS_FULL, MAX(Temp4.FILE) as FILE, Temp4.TimeUpdate, TimeModified FROM "
//                 +" (SELECT Temp3.FILE AS ISSUE_FILE, Temp3.TICKET, scan.QC, scan.EMPLOYEE, scan.FILE, scan.TimeUpdate, scan.TimeModified FROM employee_scanticket scan RIGHT JOIN "
//                 +" (SELECT TICKET, active2.FILE FROM bundleticket_active active2 INNER JOIN (SELECT distinct active.FILE FROM bundleticket_active active "
//                 +" INNER JOIN (SELECT TICKET FROM employee_scanticket where FILE LIKE '" + groupName +"_"+dateFull+ "%') AS Temp1 "
//                 +" ON active.TICKET=Temp1.TICKET) AS Temp2 ON active2.`FILE`=Temp2.FILE WHERE active2.FILE!='0') AS Temp3 ON Temp3.TICKET=scan.TICKET) AS Temp4  LEFT JOIN bundleticket_deactive deactive ON Temp4.TICKET=deactive.TICKET "
//                 +" GROUP BY Temp4.ISSUE_FILE;"
//                 // sql="SELECT Temp4.FILE AS ISSUE_FILE, LEFT(Temp4.TICKET, 6) AS BUNDLE, max(QC) as QC, COUNT(Temp4.TICKET) AS ISSUE, "
//                 //     +"COUNT(EMPLOYEE) AS SCAN, COUNT(deactive.TICKET) AS IASCAN, COUNT(Temp4.TICKET)-COUNT(EMPLOYEE)-COUNT(deactive.TICKET) AS IS_FULL, "
//                 //     +"MAX(Temp4.FILE) as FILE, Temp4.TimeUpdate, TimeModified "
//                 //     +"FROM  (SELECT Temp3.FILE AS ISSUE_FILE, Temp3.TICKET, scan.QC, scan.EMPLOYEE, scan.FILE, scan.TimeUpdate, scan.TimeModified "
//                 //     +"FROM employee_scanticket scan "
//                 //     +"inner JOIN  (SELECT TICKET, active2.FILE FROM bundleticket_active active2 INNER JOIN "
//                 //     +"(SELECT distinct active.FILE FROM bundleticket_active active  INNER JOIN "
//                 //     +"(SELECT TICKET FROM employee_scanticket where FILE LIKE '" + groupName +"_"+dateFull+ "%') AS Temp1  ON active.TICKET=Temp1.TICKET) AS Temp2 "
//                 //     +"ON active2.`FILE`=Temp2.FILE WHERE active2.FILE!='1') AS Temp3 "
//                 //     +"ON Temp3.TICKET=scan.TICKET where scan.FILE LIKE '" + groupName +"_"+dateFull+ "%') AS Temp4  LEFT JOIN bundleticket_deactive deactive "
//                 //     +"ON Temp4.TICKET=deactive.TICKET  GROUP BY bundle;"
//             } else {
//                 sql="SELECT COUNT(BUNDLE) as COUNT_BUNDLE, QC, SUM(IS_FULL) AS IS_FULL, FILE, TimeUpdate, TimeModified, BUNDLE "
//                 +"FROM employee_scanticket "
//                 +"WHERE FILE LIKE '" + groupName +"_"+dateFull+ "%'"// AND DATE='" + date + "' "
//                 +"GROUP BY FILE ORDER BY FILE DESC;"
//             }
//             console.log(sql)
//             connection.query(sql, function (err, result, fields) {
//                 connection.release();
//                 if (err) throw err;
//                 if (result.length>0){
//                     image_list=result;
//                     var error_list;
//                     con4.getConnection(function(err, connection){
//                         if (err) {
//                             throw err;
//                         }
//                         // connection.query("SELECT FILE from bundleticket_error where DATE='"+date+"' and FILE like '"+group+"%';", function (err, result, fields) {
//                         connection.query("SELECT FILE from bundleticket_error where FILE like '" + groupName +"_"+dateFull+ "%' and MODIFIED IS NULL;", function (err, result, fields) {
//                             connection.release();
//                             if (err) throw err;
//                             if (result.length>0) {
//                                 error_list=result;
//                                 res.send({image_list: image_list, error_list: error_list});
//                                 res.end();
//                             } else {
//                                 error_list='empty';
//                                 res.send({image_list: image_list, error_list: error_list});
//                                 res.end();
//                             }
//                         });
//                     });
//                 } else {
//                     res.send({image_list:'empty'});
//                     res.end();
//                 }
//             });
//         });
//     }
//     else {
//         res.render("login");
//     }
// });
// 17041993
app.post("/Production/Payroll_Search/GroupMultipleOperations", function (req, res) {
    var groupName = req.body.group;
    var date = req.body.date;
    con4.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            throw err;
        }
        var sql = ("SELECT * FROM "
            + "(SELECT EMPLOYEE, COUNT(DISTINCT OPERATION_CODE) AS OP_CODE, COUNT(TICKET) AS TICKET, FILE, QC, SUM(IS_FULL) as SUM_FULL FROM pr2k.employee_scanticket "
            + " WHERE DATE='" + date + "' AND FILE LIKE '" + groupName + "%'"
            + " GROUP BY EMPLOYEE, FILE ) AS TEMP "
            + " WHERE TEMP.OP_CODE>1 and SUM_FULL<200;");
        console.log(groupName, date)
        console.log(sql);
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
app.post('/Production/Payroll_Search/GroupOld', function (req, res) {
    if (req.isAuthenticated()) {
        var groupName = req.body.groupName;
        var date = req.body.date;
        var image_list;
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            var sql = ("SELECT COUNT_BUNDLE, QC, IS_FULL, FILE, TimeUpdate, BUNDLE "
                + " FROM (SELECT COUNT(BUNDLE) as COUNT_BUNDLE, QC, SUM(IS_FULL) AS IS_FULL, FILE, TimeUpdate, BUNDLE "
                + " FROM pr2k.employee_scanticket "
                + " WHERE FILE like '" + groupName + "%' AND DATE='" + date + "' "
                + " GROUP BY FILE ORDER BY TimeUpdate) AS TempTable where IS_FULL=0;")
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                if (result.length > 0) {
                    image_list = result;
                    var error_list;
                    con4.getConnection(function (err, connection) {
                        if (err) {
                            connection.release();
                            throw err;
                        }
                        connection.query("SELECT FILE from pr2k.bundleticket_error where DATE='" + date + "' and FILE like '" + groupName + "%' and Modified is null;", function (err, result, fields) {
                            connection.release();
                            if (err) throw err;
                            if (result.length > 0) {
                                error_list = result;
                                res.send({ image_list: image_list, error_list: error_list });
                                res.end();
                            } else {
                                error_list = 'empty';
                                res.send({ image_list: image_list, error_list: 'empty' });
                                res.end();
                            }
                        });
                    });
                } else {
                    con4.getConnection(function (err, connection) {
                        if (err) {
                            connection.release();
                            throw err;
                        }
                        // res.send({image_list:'empty'});
                        connection.query("SELECT FILE from pr2k.bundleticket_error where DATE='" + date + "' and FILE like '" + groupName + "%' and MODIFIED is nULL;", function (err, result, fields) {
                            connection.release();
                            if (err) throw err;
                            if (result.length > 0) {
                                error_list = result;
                                res.send({ image_list: 'empty', error_list: error_list });
                                res.end();
                            } else {
                                error_list = 'empty';
                                res.send({ image_list: 'empty', error_list: 'empty' });
                                res.end();
                            }
                        });

                        // res.end();
                    });
                }
            });
        });
    } else {
        res.render("login");
    }
});
app.post('/Production/Payroll_Search/Submit', function (req, res) {
    if (req.isAuthenticated()) {
        var bundle = req.body.bundle;
        var ID = req.body.ID;
        var QC = req.body.QC;
        var file = req.body.file;
        var date = req.body.date;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        con4.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                throw err;
            }
            connection.query("select EMPLOYEE from pr2k.employee_scanticket where TICKET='" + bundle + "';", function (err, result, fields) {
                if (err) throw err;
                // res.setHeader("Content-Type", "application/json");
                if (result.length == 0) {
                    sql = ("replace into pr2k.employee_scanticket"
                        + " (TICKET, EMPLOYEE, DATE, BUNDLE, OPERATION_CODE, IRR, QC, FILE, IS_FULL, MODIFIED, TimeUpdate)"
                        + " values ('" + bundle + "', '" + ID + "', '" + date + "','" + bundle.substring(0, 6) + "', '" + bundle.substring(6, 10) + "','000','" + QC + "','" + file + "','100','" + req.user + "', '" + timeUpdate + "')")
                    console.log(sql)
                    connection.query(sql, function (err, result, fields) {
                        connection.release();
                        if (err) throw err;
                        res.setHeader("Content-Type", "application/json");
                        res.send({ result: 'done' });
                        // next();
                        res.end();
                    });
                } else {
                    sql = ("update pr2k.employee_scanticket set EMPLOYEE='" + ID + "', QC='" + QC + "', IS_FULL='100', MODIFIED='" + req.user + "', TimeModified='" + timeUpdate + "', FILE='" + file + "' where TICKET='" + bundle + "';")
                    console.log(sql)
                    connection.query(sql, function (err, result, fields) {
                        connection.release();
                        if (err) throw err;
                        res.setHeader("Content-Type", "application/json");
                        res.send({ result: 'done' });
                        // next();
                        res.end();
                    });
                }

                // res.send({result:'done'});
                // res.end();
            });
        });
    }
    else {
        res.render("login");
    }
});

app.post('/Production/Payroll_Search/Submit1', function (req, res) {
    if (req.isAuthenticated()) {
        var bundle = req.body.bundle;
        var ID = req.body.ID;
        var QC = req.body.QC;
        var file = req.body.file;
        var date = req.body.date;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = ("replace into pr2k.employee_scanticket"
                + " (TICKET, EMPLOYEE, DATE, BUNDLE, OPERATION_CODE, IRR, QC, FILE, IS_FULL, MODIFIED, TimeUpdate)"
                + " values ('" + bundle + "', '" + ID + "', '" + date + "','" + bundle.substring(0, 6) + "', '" + bundle.substring(6, 10) + "','000','" + QC + "','" + file + "','100','" + req.user + "', '" + timeUpdate + "')")
            console.log(sql)
            connection.query(sql, function (err, result, fields) {
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
app.post('/Production/Payroll_Search/GetName', function (req, res) {
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

app.post('/Production/Payroll_Search/GetTimeSheet', function (req, res) {
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
        if (curDate != '--' && frDate != '--') {

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
            res.send({ result: 'empty' });
            res.end();
        }
    }
    else {
        res.render("login");
    }
});

app.post('/Production/Payroll_Search/GetWip', function (req, res) {
    if (req.isAuthenticated()) {
        var groupName = req.body.group;
        var date = req.body.date;
        var shift = req.body.shift.substring(0, 1);
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "select OPERATION, SUM(WIP) as WIP, WIP_TARGET as TARGET, SUM(WIP)-WIP_TARGET as VAR, SUM(SUM_WIP) as SUM_WIP, SUM(SUM_HC) as SUM_HC "
                + " from pr2k.operation_wip where DATE='" + date + "' and LINE='" + groupName + "' and SHIFT='" + shift + "' group by OPERATION order by ROW;"
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
app.post('/Production/Payroll_Search/Skip', function (req, res) {
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
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query("Update pr2k.employee_scanticket set IS_FULL='100', QC='" + QC + "', MODIFIED='" + req.user + "', TimeModified='" + timeUpdate + "' where FILE='" + file + "';",
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
app.post('/Production/Payroll_Search/Dismiss_error', function (req, res) {
    if (req.isAuthenticated()) {
        var file = req.body.fileName;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query("Update pr2k.bundleticket_error set MODIFIED='" + req.user + "', TimeModified='" + timeUpdate + "' where FILE='" + file + "';",
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
app.post('/Production/Payroll_Search/Bundle', function (req, res) {
    if (req.isAuthenticated()) {
        var file = req.body.file;
        var date = req.body.date;
        var bundle = req.body.bundle;
        var bundle_read;
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query("SELECT TICKET, QC, EMPLOYEE FROM pr2k.employee_scanticket where FILE='" + file + "' or TICKET like '" + bundle + "%';", function (err, result, fields) {
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
                    con4.getConnection(function (err, connection) {
                        if (err) {
                            connection.release();
                            throw err;
                        }
                        var sql = "";
                        if (date < "20200601")
                            sql = "SELECT bundleticket_active.TICKET "
                                + " from pr2k.bundleticket_active left join pr2k.employee_scanticket "
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

app.post('/Production/Payroll_Search/RFbundle', function (req, res) {
    var bundle = req.body.bundle;
    con4.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        sql = ('SELECT a.ticket,a.OPERATION,sc.EMPLOYEE,e.Name,DATE_FORMAT(sc.TimeUpdate,"%Y-%m-%d %T") AS sc FROM pr2k.bundleticket_active a '
            + 'left join pr2k.employee_scanticket sc '
            + 'ON a.TICKET=sc.TICKET '
            + 'LEFT JOIN erpsystem.setup_emplist e ON sc.EMPLOYEE=RIGHT(e.ID,5) '
            + 'WHERE a.ticket LIKE "' + bundle + '%" and a.file<>"0" order by sc.timeupdate;')
        connection.query(sql, function (err, result, fields) {
            connection.release();
            if (err) throw err;
            if (result.length > 0 && result.length < 28) {
                res.send(result);
                res.end();
            } else {
                res.send({ result: 'empty' });
                res.end();
            }
        });
    });
})

app.post('/Production/Payroll_Search/BundleNew', function (req, res) {
    if (req.isAuthenticated()) {
        var file = req.body.file;
        var date = req.body.date;
        var bundle = req.body.bundle;
        var bundle_read;
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "SELECT Temp3.TICKET, scan.QC, scan.EMPLOYEE FROM pr2k.employee_scanticket scan RIGHT JOIN "
                + " (SELECT TICKET, active2.FILE FROM pr2k.bundleticket_active active2 INNER JOIN (SELECT distinct active.FILE FROM pr2k.bundleticket_active active "
                + " INNER JOIN (SELECT TICKET FROM pr2k.employee_scanticket where FILE = '" + file + "') AS Temp1 "
                + " ON active.TICKET=Temp1.TICKET) AS Temp2 ON active2.`FILE`=Temp2.FILE) AS Temp3 ON Temp3.TICKET=scan.TICKET;"
            // sql=`SELECT pr.TICKET,scan.QC, scan.EMPLOYEE FROM 
            // (SELECT ac.TICKET,f.file FROM 
            // (SELECT a.file FROM 
            // (SELECT ticket FROM employee_scanticket WHERE FILE='${file}') sc LEFT JOIN bundleticket_active a ON sc.ticket=a.ticket GROUP BY FILE) f
            // LEFT JOIN bundleticket_active ac ON f.file=ac.file) pr LEFT JOIN employee_scanticket scan ON pr.ticket=scan.ticket`
            // console.log(sql)
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                if (result.length > 0 && result.length < 28) {
                    res.send(result);
                    res.end();
                    // bundle_read=result;
                    // var bundle1=bundle_read[0].TICKET.substring(0,6);
                    // ticket=bundle_read[0].TICKET;
                    // var bundle=bundle1;
                    // if (bundle_read.length>2){
                    //     var bundle2=bundle_read[1].TICKET.substring(0,6);
                    //     var bundle3=bundle_read[2].TICKET.substring(0,6);
                    //     if (bundle1==bundle2||bundle1==bundle3){
                    //         bundle=bundle1;
                    //         ticket=bundle_read[1].TICKET;
                    //     }
                    //     if (bundle1!=bundle2&&bundle2==bundle3){
                    //         bundle=bundle2;
                    //         ticket=bundle_read[2].TICKET;
                    //     }
                    // }
                    // var QC=bundle_read[0].QC;
                    // con4.getConnection(function(err, connection){
                    //     if (err) {
                    //         connection.release();
                    //         throw err;
                    //     }
                    //     // var sql="";
                    //     // if (date<"20200601")
                    //     sql="SELECT TICKET FROM (SELECT Temp2.TICKET, scan.FILE FROM pr2k.employee_scanticket scan RIGHT JOIN "
                    //         +" (SELECT TICKET FROM  pr2k.bundleticket_active active INNER JOIN "
                    //         +" (SELECT FILE FROM pr2k.bundleticket_active WHERE TICKET='"+ticket+"') AS Temp1 ON active.`FILE`=Temp1.FILE) AS Temp2 "
                    //         +" ON scan.TICKET=Temp2.TICKET) AS Temp3 WHERE FILE IS NULL;";
                    //     // else
                    //     // sql="SELECT TICKET from bundleticket_active where TICKET like '"+bundle+"%';"
                    //     connection.query(sql, function (err, result, fields) {
                    //     // connection.query(sql, function (err, result, fields) {
                    //         connection.release();
                    //         if (err) throw err;
                    //         if (result.length>0) {
                    //             res.send({bundle_read:bundle_read, bundle_full:result, QC:QC});
                    //             res.end();
                    //         } else {
                    //             res.send({bundle_read:bundle_read, bundle_full:'empty', QC:QC})
                    //             res.end();
                    //         }
                    //     });
                    // });
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
app.post('/Production/Payroll_Search/BundleSearch', function (req, res) {
    if (req.isAuthenticated()) {
        var bundle = req.body.bundle;
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query("SELECT TICKET, EMPLOYEE, DATE, BUNDLE, OPERATION_CODE, EARNED_HOURS, WORK_LOT, FILE, MODIFIED, QC FROM pr2k.employee_scanticket where TICKET like '" + bundle + "%';", function (err, result, fields) {
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
app.post('/Production/Payroll_Search/ID', function (req, res) {
    if (req.isAuthenticated()) {
        var id = req.body.id;
        var date = req.body.date;
        var datefrom = req.body.datefrom;
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "SELECT BUNDLE, OPERATION_CODE, EARNED_HOURS, UNITS, WORK_LOT, FILE FROM"
                + " pr2k.employee_scanticket where EMPLOYEE='" + id + "' and DATE<='" + date + "' and DATE>='" + datefrom + "'"
                + " union "
                + " select TOTAL_DZ as BUNDLE, MOVER as OPERATION_CODE, EARNED_HOURS*TOTAL_DZ*60 as EARNED_HOURS, TOTAL_DZ as UNITS, TOTAL_DZ as WORK_LOT, TOTAL_DZ as FILE"
                + " from pr2k.employee_mover where EMPLOYEE like '%" + id + "' and DATE<='" + date + "' and DATE>='" + datefrom + "'"
                + " union "
                + " select SUM(DzCase) as BUNDEL, CONCAT('MOVER',ZoneMover) as OPERATION_CODE, SUM(DzCase)*SAH*60 as EARNED_HOURS, SUM(DzCase) as UNITS, SUM(DzCase) as WORK_LOT, SUM(DzCase) as FILE"
                + " from erpsystem.data_finishedgoodssewing inner join erpsystem.setup_sahmover"
                + " on erpsystem.data_finishedgoodssewing.ZoneMover=erpsystem.setup_sahmover.Area "
                + " where IDEmployees like '%" + id + "' and DATE<=DATE_FORMAT('" + date + "','%Y-%m-%d') and DATE>=DATE_FORMAT('" + datefrom + "','%Y-%m-%d') group by ZoneMover;"
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
app.post('/Production/Payroll_Search/Ticket', function (req, res) {
    var ticket = req.body.ticket;
    con4.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        connection.query("SELECT EMPLOYEE, DATE, FILE FROM"
            + " pr2k.employee_scanticket where TICKET='" + ticket + "';", function (err, result, fields) {
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
app.post('/Production/Payroll_Search/Worklot', function (req, res) {
    var worklot = req.body.worklot;
    worklot = worklot.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    con4.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            throw err;
        }
        sql = "SELECT bundleticket_active.TICKET, bundleticket_active.CREATE_DATE, bundleticket_active.OPERATION_CODE, "
            + " bundleticket_active.EARNED_HOURS, bundleticket_active.UNITS, bundleticket_active.FILE, employee_scanticket.DATE, employee_scanticket.EMPLOYEE "
            + " FROM pr2k.bundleticket_active left join pr2k.employee_scanticket on bundleticket_active.TICKET=employee_scanticket.TICKET "
            + " where bundleticket_active.WORK_LOT='" + worklot + "' and bundleticket_active.TICKET not like '%0109' and bundleticket_active.TICKET not like '%0110' and bundleticket_active.TICKET not like '%0112';";
        // connection.query("SELECT BUNDLE, CREATE_DATE, OPERATION_CODE, EARNED_HOURS, UNITS, FILE FROM bundleticket_active"
        // +" where WORK_LOT='"+worklot+"';", function (err, result, fields) {
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
app.post('/Production/Payroll_Search/WorklotSummary', function (req, res) {
    var worklot = req.body.worklot;
    worklot = worklot.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    con4.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        sql = "select LEFT(Temp1.TICKET, 6) as BUNDLE, FILE, COUNT(Temp1.TICKET) as ISSUE, COUNT(Temp2.TICKET) as EARN, COUNT(Temp3.TICKET) as IA, COUNT(Temp1.TICKET)-COUNT(Temp2.TICKET)-COUNT(Temp3.TICKET) as NOT_EARN from "
            + " (select TICKET, FILE from pr2k.bundleticket_active where work_lot='" + worklot + "' and FILE!='0') as Temp1 "
            + " left join "
            + " (select TICKET from pr2k.employee_scanticket where work_lot='" + worklot + "') as Temp2 on Temp1.TICKET=Temp2.TICKET "
            + " left join "
            + " (select TICKET from pr2k.bundleticket_deactive where work_lot='" + worklot + "') as Temp3 on Temp1.TICKET=Temp3.TICKET "
            + " group by Temp1.FILE;";
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
app.post('/Production/Payroll_Search/Alert', function (req, res) {
    if (req.isAuthenticated()) {
        var date = req.body.date;
        var datefrom = req.body.datefrom;
        var groupName = req.body.group;
        groupF = groupName.substring(0, 3);
        groupT = groupName.substring(4, 7);
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "SELECT TICKET, OLD_EMPLOYEE, OLD_FILE, NEW_EMPLOYEE, NEW_FILE, STATUS FROM pr2k.bundleticket_alert WHERE TRIM(NEW_FILE) like '" + groupF + groupT + "%' and OLD_TimeUpdate>='" + datefrom + " 00:00:00' and OLD_TimeUpdate<='" + date + " 23:59:59' "
                + " AND NEW_EMPLOYEE!=OLD_EMPLOYEE and MID(OLD_FILE, 7, 1)!=MID(NEW_FILE, 7, 1) AND HOUR(OLD_TimeUpdate)!=HOUR(New_TIMEUPDATE) order by status desc, OLD_FILE;"
            console.log(sql);
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
app.post('/Production/Payroll_Search/Alert_Update_Status', function (req, res) {
    if (req.isAuthenticated()) {
        var ticket = req.body.ticket;
        var status = req.body.status;
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update pr2k.bundleticket_alert set STATUS='" + status + "' WHERE Ticket='" + ticket + "';"
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
app.post('/Production/Payroll_Search/Update_Date_Scan1', function (req, res) {
    if (req.isAuthenticated()) {
        var date = req.body.date;
        var file_name_list = req.body.file_x.split(';');
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            for (var i = 0; i < file_name_list.length; i++) {
                file = file_name_list[i];
                sql = "update pr2k.employee_scanticket set DATE='" + date + "' WHERE FILE='" + file + "';"
                connection.query(sql, function (err, result, fields) {
                    if (err) throw err;
                });
            }
            connection.release();
            res.send({ result: 'done' });
            res.end();
        });
    } else {
        res.render("login");
    }
});
app.post('/Production/Payroll_Search/Sup_Release', function (req, res) {
    if (req.isAuthenticated()) {
        var asslot = req.body.asslot;
        asslot = asslot.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "select * from pr2k.supervisor_release_bundle where work_lot='" + asslot + "';";
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
app.post('/Production/Payroll_Search/Sup_Release_Submit', function (req, res) {
    if (req.isAuthenticated()) {
        var worklot = req.body.worklot;
        var quantity = req.body.quantity;
        var note = req.body.note;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        worklot = worklot.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "insert into pr2k.supervisor_release_bundle (WORK_LOT, TIME_RELEASE, QTY_ISSUE, USER, NOTE) values ('" + worklot + "', '" + timeUpdate + "', '" + quantity + "', '" + req.user + "', '" + note + "');";
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
app.get("/Production/LineBalancing", function (req, res) {
    res.render("Production/LineBalancing");
});
app.get("/Production/OffStandard", function (req, res) {
    if (req.isAuthenticated()) {
        var group_list;
        con2.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query("SELECT distinct NameGroup as Line FROM setup_location where Location like 'Line%';", function (err, result, fields) {
                connection.release();
                if (err) throw err;
                group_list = result;
                get_dept(req.user, function (result1) {
                    // if (result1[0].Department=='IE'){
                    //     res.render("Production/OffStandard_IE", {group_list: group_list});
                    //     res.end();
                    // } else {
                    res.render("Production/OffStandard", { group_list: group_list });
                    res.end();
                    // }
                })
            });
        });
    } else {
        res.render("login");
    }

});
app.post('/Production/GetOffStandardInfo', function (req, res) {
    // if (req.isAuthenticated()) {
    empID = req.body.ID;
    week = req.body.week;
    date = req.body.date;
    var year = date.slice(0, 4)
    var month = date.slice(4, 6);
    var date = date.slice(6, 8);
    var curDate = year + '-' + month + '-' + date;
    console
    con4.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        sql = ("SELECT e.ID, e.WC, e.Operation1, e.Efficiency1, e.Operation2, e.Efficiency2, e.Operation3, e.Efficiency3, "
            + " e.CODE, o.StartTime, o.Shift from "
            + " (SELECT * FROM linebalancing.employee_offstandard_register WHERE ID='" + empID + "' AND WeekUpdate='" + week + "') e "
            + " LEFT JOIN (SELECT * from linebalancing.operation_offstandard_tracking  WHERE ID='" + empID + "' "
            + " AND DateUpdate like '" + curDate + "%' AND FinishTime IS NULL) o ON e.ID=o.ID;");
        // sql="select * from employee_offstandard_register where ID='"+ID+"' and WeekUpdate='"+week+"';";
        connection.query(sql, function (err, result, fields) {
            connection.release();
            if (err) throw err;
            res.send(result);
            res.end();
        });
    });
    // } else {
    //     res.render("login");
    // }
});
app.post('/Production/GetOffStandardCode', function (req, res) {
    // if (req.isAuthenticated()) {
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "select CONCAT(Code,' (',Description,')') OffCode from linebalancing.setup_operation_standard_code;";
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send(result);
                res.end();
            });
        });
    // } else {
    //     res.render("login");
    // }
});
app.post('/Production/GetStyleDetail1', function (req, res) {
    if (req.isAuthenticated()) {
        week = req.body.week;
        groupName = req.body.group;
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "SELECT DISTINCT style FROM linebalancing.web_data_ie_balance WHERE WEEK='" + week + "' AND groupcbc='" + groupName + "';";
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send(result);
                res.end();
            });
        });
    } else {
        res.render("login");
    }
});
app.post('/Production/GetOffStandardTracking', function (req, res) {
    // if (req.isAuthenticated()) {
        date = req.body.date;
        groupName = req.body.group;
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            // sql="select * from linebalancing.operation_offstandard_tracking where GroupTo='"+groupName+"' and DateUpdate='"+date+"';";
            u = req.user;
            if (u == "nnguyen" || u == "tudo") {
                sql = "select * from "
                    + " (select * from linebalancing.operation_offstandard_tracking "
                    + " where DateUpdate='" + date + "' and (code like '09%' or code like '12%')) t left join "
                    + " (select ID EMPLOYEE, WC WORK_CENTER from linebalancing.employee_offstandard_register) r on t.ID=r.EMPLOYEE group by t.StartTime order by groupto;"
            }
            else {
                sql = "select * from "
                    + " (select * from linebalancing.operation_offstandard_tracking "
                    + " where GroupTo='" + groupName + "' and DateUpdate='" + date + "') t left join "
                    + " (select ID EMPLOYEE, WC WORK_CENTER from linebalancing.employee_offstandard_register) r on t.ID=r.EMPLOYEE group by t.StartTime;"
            }

            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send(result);
                res.end();
            });
        });
    // } else {
    //     res.render("login");
    // }
});
app.post('/Production/IsExistedOffStandardTracking', function (req, res) {
    // if (req.isAuthenticated()) {
        date = req.body.date;
        empID = req.body.empID;
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "select * from linebalancing.operation_offstandard_tracking where ID='" + empID + "' and DateUpdate LIKE '" + date + "%' and FinishTime is null;";
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send(result);
                res.end();
            });
        });
    // } else {
    //     res.render("login");
    // }
});
app.post('/Production/InsertOffStandardTracking', function (req, res) {
    // if (req.isAuthenticated()) {
        ID = req.body.ID;
        name = req.body.name;
        shift = req.body.shift;
        code = req.body.code;
        wc = req.body.wc;
        op1 = req.body.op1;
        op2 = req.body.op2;
        eff2 = req.body.eff2;
        groupTo = req.body.groupTo;
        weekUpdate = req.body.weekUpdate;
        note = req.body.note;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        userUpdate = req.user;
        startTime = timeUpdate;
        dateUpdate = timeUpdate.split(' ')[0];
        hh = parseInt(timeUpdate.split(' ')[1].split(':')[0]);
        mm = parseInt(timeUpdate.split(' ')[1].split(':')[1]);
        // if (hh == 13 && mm > 45 && mm < 59) startTime = dateUpdate + ' 14:00:00';
        if (hh == 13 && mm > 44 && mm < 59) startTime = dateUpdate + ' 13:45:00';
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "Insert into linebalancing.operation_offstandard_tracking "
                + " (ID, Name, Shift, Code, WC, Operation1, Operation2, Efficiency2, GroupTo, "
                + " StartTime, UserUpdate, DateUpdate, WeekUpdate, Note, IEApprovedResult) values "
                + " ('" + ID + "', '" + name + "', '" + shift + "', '" + code + "', '" + wc + "', '" + op1 + "', '" + op2 + "', '" + eff2 + "', '" + groupTo
                + "', '" + startTime + "', '" + userUpdate + "', '" + dateUpdate + "', '" + weekUpdate + "', '" + note + "', '0');";
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send('done');
                res.end();
            });
        });
    // } else {
    //     res.render("login");
    // }
});
app.post('/Production/CloseOffStandardTracking', function (req, res) {
    // if (req.isAuthenticated()) {
        empID = req.body.empID;
        startTime = req.body.startTime;
        shift = req.body.shift;
        // finishTime=req.body.finishTime;
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            if (shift != 'ADM2') {
                sql = "update linebalancing.operation_offstandard_tracking set "
                    + " FinishTime= IF(StartTime<=CONCAT(CURDATE(),' 13:45:00'), IF(now()<=CONCAT(CURDATE(),' 13:45:00'), now(), CONCAT(CURDATE(),' 13:45:00')), "
                    + " IF(StartTime<=CONCAT(CURDATE(),' 22:00:00') AND StartTime>=CONCAT(CURDATE(),' 13:46:00'), IF(now()<=CONCAT(CURDATE(),' 22:00:00'), now(), CONCAT(CURDATE(),' 22:00:00')), NOW())), "
                    + " SpanTime=IF(ROUND(TIME_TO_SEC(TIMEDIFF(IF(StartTime<=CONCAT(CURDATE(),' 13:45:00'), IF(now()<=CONCAT(CURDATE(),' 13:45:00'), now(), CONCAT(CURDATE(),' 13:45:00')), "
                    + " IF(StartTime<=CONCAT(CURDATE(),' 22:00:00') AND StartTime>=CONCAT(CURDATE(),' 13:46:00'), IF(now()<=CONCAT(CURDATE(),' 22:00:00'), now(), CONCAT(CURDATE(),' 22:00:00')), NOW())),StartTime))/3600,2)>7.5, 7.5, "
                    + " ROUND(TIME_TO_SEC(TIMEDIFF(IF(StartTime<=CONCAT(CURDATE(),' 13:45:00'), IF(now()<=CONCAT(CURDATE(),' 13:45:00'), now(), CONCAT(CURDATE(),' 13:45:00')), "
                    + " IF(StartTime<=CONCAT(CURDATE(),' 22:00:00') AND StartTime>=CONCAT(CURDATE(),' 13:46:00'), IF(now()<=CONCAT(CURDATE(),' 22:00:00'), now(), CONCAT(CURDATE(),' 22:00:00')), NOW())),StartTime))/3600,2))  "
                    + " where ID='" + empID + "' and StartTime='" + startTime + "';"
                // sql = "update linebalancing.operation_offstandard_tracking set "
                //     + " FinishTime= IF(StartTime<=CONCAT(CURDATE(),' 13:30:00'), IF(now()<=CONCAT(CURDATE(),' 13:30:00'), now(), CONCAT(CURDATE(),' 13:30:00')), "
                //     + " IF(StartTime<=CONCAT(CURDATE(),' 22:20:00') AND StartTime>=CONCAT(CURDATE(),' 13:31:00'), IF(now()<=CONCAT(CURDATE(),' 22:20:00'), now(), CONCAT(CURDATE(),' 22:20:00')), NOW())), "
                //     + " SpanTime=IF(ROUND(TIME_TO_SEC(TIMEDIFF(IF(StartTime<=CONCAT(CURDATE(),' 13:30:00'), IF(now()<=CONCAT(CURDATE(),' 13:30:00'), now(), CONCAT(CURDATE(),' 13:30:00')), "
                //     + " IF(StartTime<=CONCAT(CURDATE(),' 22:20:00') AND StartTime>=CONCAT(CURDATE(),' 13:31:00'), IF(now()<=CONCAT(CURDATE(),' 22:20:00'), now(), CONCAT(CURDATE(),' 22:20:00')), NOW())),StartTime))/3600,2)>7.5, 7.5, "
                //     + " ROUND(TIME_TO_SEC(TIMEDIFF(IF(StartTime<=CONCAT(CURDATE(),' 13:30:00'), IF(now()<=CONCAT(CURDATE(),' 13:30:00'), now(), CONCAT(CURDATE(),' 13:30:00')), "
                //     + " IF(StartTime<=CONCAT(CURDATE(),' 22:20:00') AND StartTime>=CONCAT(CURDATE(),' 13:31:00'), IF(now()<=CONCAT(CURDATE(),' 22:20:00'), now(), CONCAT(CURDATE(),' 22:20:00')), NOW())),StartTime))/3600,2))  "
                //     + " where ID='" + empID + "' and StartTime='" + startTime + "';"
            }
            else {
                // sql = "update linebalancing.operation_offstandard_tracking set "
                //     + " FinishTime= IF(StartTime<=CONCAT(CURDATE(),' 13:30:00'), IF(now()<=CONCAT(CURDATE(),' 13:30:00'), now(), CONCAT(CURDATE(),' 13:30:00')), "
                //     + " IF(StartTime<=CONCAT(CURDATE(),' 22:20:00') AND StartTime>=CONCAT(CURDATE(),' 13:40:00'), IF(now()<=CONCAT(CURDATE(),' 22:20:00'), now(), CONCAT(CURDATE(),' 22:20:00')), NOW())), "
                //     + " SpanTime=IF(ROUND(TIME_TO_SEC(TIMEDIFF(IF(StartTime<=CONCAT(CURDATE(),' 13:30:00'), IF(now()<=CONCAT(CURDATE(),' 13:30:00'), now(), CONCAT(CURDATE(),' 13:30:00')), "
                //     + " IF(StartTime<=CONCAT(CURDATE(),' 22:20:00') AND StartTime>=CONCAT(CURDATE(),' 13:40:00'), IF(now()<=CONCAT(CURDATE(),' 22:20:00'), now(), CONCAT(CURDATE(),' 22:20:00')), NOW())),StartTime))/3600,2)>7.5, 7.5, "
                //     + " ROUND(TIME_TO_SEC(TIMEDIFF(IF(StartTime<=CONCAT(CURDATE(),' 13:30:00'), IF(now()<=CONCAT(CURDATE(),' 13:30:00'), now(), CONCAT(CURDATE(),' 13:30:00')), "
                //     + " IF(StartTime<=CONCAT(CURDATE(),' 22:20:00') AND StartTime>=CONCAT(CURDATE(),' 13:40:00'), IF(now()<=CONCAT(CURDATE(),' 22:20:00'), now(), CONCAT(CURDATE(),' 22:20:00')), NOW())),StartTime))/3600,2))  "
                //     + " where ID='" + empID + "' and StartTime='" + startTime + "';"

                sql = "UPDATE linebalancing.operation_offstandard_tracking SET"
                    + " FinishTime= IF(StartTime<= CONCAT(CURDATE(),' 16:00:00'), IF(NOW()<= CONCAT(CURDATE(),' 16:00:00'), NOW(), CONCAT(CURDATE(),' 16:00:00')), CONCAT(CURDATE(),' 16:00:00')),"
                    + " SpanTime=IF(ROUND(TIME_TO_SEC(TIMEDIFF(IF(StartTime<= CONCAT(CURDATE(),' 16:00:00'), IF(NOW()<= CONCAT(CURDATE(),' 16:00:00'), NOW(), CONCAT(CURDATE(),' 16:00:00')), CONCAT(CURDATE(),' 16:00:00')),StartTime))/3600,2)>7.5,7.5, ROUND(TIME_TO_SEC(TIMEDIFF(IF(StartTime<= CONCAT(CURDATE(),' 16:00:00'), IF(NOW()<= CONCAT(CURDATE(),' 16:00:00'), NOW(), CONCAT(CURDATE(),' 16:00:00')), CONCAT(CURDATE(),' 16:00:00')),StartTime))/3600,2))"
                    + " where ID='" + empID + "' and StartTime='" + startTime + "';"

            }
            connection.query(sql, function (err, result, fields) {
                // connection.release();
                if (err) throw err;
                sql1 = "select * from linebalancing.operation_offstandard_tracking where ID='" + empID + "' and StartTime='" + startTime + "'";
                connection.query(sql1, function (err, result2, fields) {
                    connection.release();
                    if (err) throw err;
                    res.send(result2);
                    res.end();
                })
            });
        });
    // } else {
    //     res.render("login");
    // }
});
app.post('/Production/QueryOffStandardTracking', function (req, res) {
    if (req.isAuthenticated()) {
        shiftR = req.body.shiftR;
        shiftB = req.body.shiftB;
        code02 = req.body.code02;
        code03 = req.body.code03;
        code04 = req.body.code04;
        code05 = req.body.code05;
        code06 = req.body.code06;
        code07 = req.body.code07;
        code08 = req.body.code08;
        code09 = req.body.code09;
        dateFrom = req.body.dateFrom;
        dateTo = req.body.dateTo;
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "SELECT * FROM linebalancing.operation_offstandard_tracking o "
                + " WHERE (Shift LIKE '" + shiftR + "%' OR Shift LIKE '" + shiftB + "%') AND o.DateUpdate>='" + dateFrom + " 00:00:00' AND o.DateUpdate<='" + dateTo + " 23:59:00' "
                + " AND (CODE LIKE '" + code02 + "%' OR CODE LIKE '" + code03 + "%' OR CODE LIKE '" + code04 + "%' OR CODE LIKE '" + code05 + "%' "
                + " OR CODE LIKE '" + code06 + "%' OR CODE LIKE '" + code07 + "%' OR CODE LIKE '" + code08 + "%' OR CODE LIKE '" + code09 + "%');";
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send(result);
                res.end();
            });
        });
    } else {
        res.render("login");
    }
});
app.post('/Production/ApproveOffStandardTracking', function (req, res) {
    if (req.isAuthenticated()) {
        result = req.body.result;
        empID = req.body.empID;
        start = req.body.start;
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update linebalancing.operation_offstandard_tracking set IEApprovedUser='" + req.user + "', IEApprovedResult='" + result + "', IEApprovedDate=NOW() where ID='" + empID + "' and StartTime='" + start + "';";
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send("done");
                res.end();
            });
        });
    } else {
        res.render("login");
    }
});
app.post('/Production/GetOperationByEmployee7000', function (req, res) {
    // if (req.isAuthenticated()) {
        empID = req.body.empID;
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            // sql="select t1.OPERATION, t1.EFF ACTUAL, o.EFFICIENCY GOAL, r.TARGET  from "
            // +" (select t.OPERATION, max(EFF) EFF from linebalancing.employee_eff_data_ie_setup_temp t "
            // +" where t.EMPLOYEE='"+empID+"' and t.OPERATION!='ie_assign' group by t.OPERATION) t1 "
            // +" left join linebalancing.setup_operation_7000_target o on t1.OPERATION=o.OPERATION "
            // +" left join (select * from linebalancing.data_operation_7000_register where EMPLOYEE='"+empID+"' "
            // +" and MONTH(TimeUpdate)=MONTH(CURDATE()) and YEAR(TimeUpdate)=Year(CURDATE())) r on r.OPERATION=t1.OPERATION;";
            sql = "select t1.OPERATION, t1.EFF ACTUAL, o.EFFICIENCY GOAL, r.TARGET, t1.DAYS from "
                + " (select * from "
                + " (select t.OPERATION_NAME OPERATION, '0' as EFF, COUNT(IND) DAYS from linebalancing.bundle_group_by_employee_detail t "
                + " where t.EMPLOYEE='" + empID + "' group by t.OPERATION_NAME) t2 where DAYS>3) t1 "
                + " left join linebalancing.setup_operation_7000_target o on t1.OPERATION=o.OPERATION "
                + " left join (select * from linebalancing.data_operation_7000_register where EMPLOYEE='" + empID + "' "
                + " and YEAR(TimeUpdate)=Year(CURDATE())) r on r.OPERATION=t1.OPERATION;"
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send(result);
                res.end();
            });
        });
    // } else {
    //     res.render("login");
    // }
});
app.post('/Production/GetOperationByEmployee7000Summary', function (req, res) {
    if (req.isAuthenticated()) {
        groupName = req.body.groupName;
        week = req.body.week;
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "select t1.*, r.TimeUpdate  from "
                + " (select Employee, Name, Operation from linebalancing.employee_eff_data_ie_setup_temp t "
                + " where t.week='" + week + "' and Year(TimeUpdate)=Year(NOW()) and Operation!='ie_assign' and t.groupline='" + groupName + "' "
                + " group by Employee, Operation ) t1 left join linebalancing.data_operation_7000_register r "
                + " on t1.Employee=r.EMPLOYEE and t1.Operation=r.OPERATION;"
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send(result);
                res.end();
            });
        });
    } else {
        res.render("login");
    }
});
app.post('/Production/AddOperationByEmployee7000', function (req, res) {
    // if (req.isAuthenticated()) {
        empID = req.body.empID;
        operation = req.body.operation;
        actual = req.body.actual;
        target = req.body.target;
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "replace into linebalancing.data_operation_7000_register (ID, EMPLOYEE, OPERATION, ACTUAL, TARGET, TimeUpdate, User) "
                + " values (CONCAT('" + empID + operation + "',MONTH(NOW()), YEAR(NOW())), '" + empID + "', '" + operation + "', '" + actual + "', '" + target + "', NOW(),'" + req.user + "');";
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send('done');
                res.end();
            });
        });
    // } else {
    //     res.render("login");
    // }
});
app.post('/Production/DeleteOperationByEmployee7000', function (req, res) {
    if (req.isAuthenticated()) {
        empID = req.body.empID;
        operation = req.body.operation;
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "delete from linebalancing.data_operation_7000_register where ID=CONCAT('" + empID + operation + "',MONTH(NOW()), YEAR(NOW()));";
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send('done');
                res.end();
            });
        });
    } else {
        res.render("login");
    }
});
app.get("/Production/MixSolve", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("Production/MixSolve");
    } else {
        res.render("login");
    }
});
app.get("/Production/OffStandard_Report", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("Production/OffStandard_Report");
    } else {
        res.render("login");
    }
});
app.get("/Production/OffStandard_IE_Approve", function (req, res) {
    if (req.isAuthenticated()) {
        get_dept(req.user, function (result) {
            if (result[0].Department == 'IE' || req.user == 'tudo' || req.user == 'nnguyen') {
                res.render("Production/OffStandard_IE");
            } else {
                res.send('Bạn không có quyền truy cập vào trang này!');
            }
        });
    } else {
        res.render("login");
    }
});
app.post('/Production/OffStandard/IE_Upload', function (req, res) {
    if (req.isAuthenticated()) {
        var form = new formidable.IncomingForm();
        excelFile = '';
        form.parse(req);
        form.on('fileBegin', function (name, file) {
            excelFile = req.user + '_' + file.name;
            file.path = './public/Python/Production/OffStandard/Upload/' + excelFile;
        });
        form.on('file', function (name, file) {
            var options = {
                mode: 'text',
                pythonPath: 'python',
                scriptPath: './public/Python/Production/OffStandard',
                pythonOptions: ['-u'],
                args: [excelFile, __dirname, req.user]
            }
            let shell = new PythonShell('upload_offstandard.py', options);
            shell.on('message', function (message) {
                res.send(message);
                res.end();
            })
        });
    } else {
        res.render("login");
    }
});
app.post('/Production/GetOffStandardRegister', function (req, res) {
    if (req.isAuthenticated()) {
        week = req.body.week;
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "select * from linebancing.employee_offstandard_register where WeekUpdate='" + week + "' and Year(TimeUpdate)=Year(NOW());"
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send(result);
                res.end();
            });
        });
    } else {
        res.render("login");
    }
});
app.post('/Production/OffStandard/DownloadReport', function (req, res) {
    if (req.isAuthenticated()) {
        dateFrom = req.body.dateFrom;
        dateTo = req.body.dateTo;
        cd02 = req.body.cd02;
        cd03 = req.body.cd03;
        cd04 = req.body.cd04;
        cd05 = req.body.cd05;
        cd06 = req.body.cd06;
        cd07 = req.body.cd07;
        cd08 = req.body.cd08;
        cd09 = req.body.cd09;
        cd13 = req.body.cd13;
        cd15 = req.body.cd15;
        cd10 = req.body.cd10;
        cd12 = req.body.cd12;
        var options = {
            mode: 'text',
            pythonPath: 'python',
            scriptPath: './public/Python/Production/OffStandard',
            pythonOptions: ['-u'],
            args: [dateFrom, dateTo, cd02, cd03, cd04, cd05, cd06, cd07, cd08, cd09, cd13, cd15,cd10, cd12, __dirname]
        }
        let shell = new PythonShell('export_offstandard.pyw', options);
        shell.on('message', function (message) {
            // res.setHeader("Content-Type", "application/json");
            res.send(message);
            res.end();
        });
    } else {
        res.render("login");
    }
});
//====================AUTO KANBAN===============================
app.get("/Production/AutoKanban", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("Production/AutoKanban");
    } else {
        res.render("login");
    }
});
app.get("/Production/AutoKanban1", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("Production/AutoKanban1");
    } else {
        res.render("login");
    }
});
app.post("/Production/AutoKanban/GetOperations", function (req, res) {
    if (req.isAuthenticated()) {
        var worklot = req.body.worklot;
        worklot = worklot.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = 'SELECT scan.OPERATION FROM pr2k.bundleticket_active scan '
                + ' INNER JOIN pr2k.operation_sequence sq ON scan.OPERATION_CODE=sq.OPERATION_CODE '
                + ' WHERE WORK_LOT="' + worklot + '" AND sq.MFG=scan.STYLE and scan.OPERATION not like "PACKING" '
                + ' GROUP BY OPERATION ORDER BY SEQUENCE;';
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send(result);
                res.end();
            });
        });
    } else {
        res.render("login");
    }
});
app.post("/Production/AutoKanban/GetAsslotInfor", async function (req, res) {
    if (req.isAuthenticated()) {
        var asslot = req.body.asslot;
        var shift = req.body.shift;
        var span = req.body.span;
        var operation = req.body.operation;
        var group_special = req.body.group_special;
        console.log(asslot, shift, span, operation, group_special)
        var options = {
            mode: 'json',
            pythonPath: 'python',
            scriptPath: './public/Python/Production/AutoKanban',
            pythonOptions: ['-u'], // get print results in real-time
            args: [asslot, shift, span, operation, group_special]
        };
        let shell = new PythonShell('GetAsslotInfo.py', options);
        shell.on('message', function (message) {
            res.setHeader("Content-Type", "application/json");
            res.send(message);
            res.end();
        });
    } else {
        res.render("login");
    }
});
app.get("/Production/Reports", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("Production/Reports");
    } else {
        res.render("login");
    }
});
app.post("/Production/AutoKanban/GetEmployeeInfo", function (req, res) {
    if (req.isAuthenticated()) {
        ID = req.body.ID;
        style_detail = req.body.style_detail;
        operation = req.body.operation;
        con1.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            // connection.query("SELECT NAME, ROUND(AVG(EFF),2) as EFF FROM employee_eff_data_ie_setup_temp where EMPLOYEE='"+ID+"' and OPERATION='"+operation+"' and STYLE_DETAIL='"+style_detail+"';", function (err, result, fields) {
            sql = "SELECT emp.ID, emp.NAME, emp.LINE, ROUND(AVG(EFF),2) as EFF FROM (SELECT * from employee_eff_data_ie_setup_temp "
                + " WHERE EMPLOYEE='" + ID + "' and OPERATION='" + operation + "' and STYLE_DETAIL='" + style_detail + "') eff "
                + " right JOIN (SELECT ID, RIGHT(ID, 5) as EMPLOYEE, NAME, LINE from erpsystem.setup_emplist WHERE RIGHT(ID, 5)='" + ID + "') emp "
                + " ON emp.EMPLOYEE=eff.EMPLOYEE WHERE emp.EMPLOYEE='" + ID + "';";
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send(result);
                res.end();
            });
        });
    } else {
        res.render("login");
    }
});
app.post("/Production/AutoKanban/SubmitAsslotHistory", function (req, res) {
    if (req.isAuthenticated()) {
        data = req.body.data;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        date = timeUpdate.substring(0, 11);
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            for (var i = 0; i < data.length; i++) {
                asslot = data[i].asslot;
                worklot = data[i].worklot;
                shift = data[i].shift;
                spantime = data[i].spantime;
                ID = data[i].ID;
                work_hrs = data[i].work_hrs;
                color = data[i].color;
                output = data[i].output;
                if (output == '') output = '0';
                Key_ID = asslot + spantime + ID + color + date + shift;
                sql1 = "replace into pr2k.asslot_control (ID, ASS_LOT, WORK_LOT, SPAN_TIME, SHIFT, EMPLOYEE, WORK_HRS, COLOR, OUTPUT, TimeUpdate, UserUpdate) "
                    + " values('" + Key_ID + "', '" + asslot + "', '" + worklot + "', '" + spantime + "', '" + shift + "', '" + ID + "', '" + work_hrs + "', '" + color + "', '" + output + "', '" + timeUpdate + "', '" + req.user + "');";
                connection.query(sql1, function (err, result, fields) {
                    if (err) throw err;
                });
            }
            connection.release();
            res.send('done');
            res.end();
        });
    } else {
        res.render("login");
    }
});
app.post("/Production/AutoKanban/DeleteAsslotHistory", function (req, res) {
    asslot = req.body.asslot;
    shift = req.body.shift;
    spantime = req.body.spantime;
    con4.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        sql = "delete from pr2k.asslot_control where ASS_LOT='" + asslot + "' and SHIFT='" + shift + "' and SPAN_TIME='" + spantime + "';";
        connection.query(sql, function (err, result, fields) {
            connection.release();
            if (err) throw err;
            res.send('done');
            res.end();
        });
    });
});
app.post("/Production/GetShiftTime", function (req, res) {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
    currHrs = parseInt(timeUpdate.substring(11, 13));
    year = timeUpdate.substring(0, 4);
    month = timeUpdate.substring(5, 7);
    day = timeUpdate.substring(8, 10);
    date = year + month + day;
    con4.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        sql = "select StartTime, FinishTime, Shift, Note, Week from pr2k.operation_schedule where DATE='" + date + "';";
        connection.query(sql, function (err, result, fields) {
            connection.release();
            if (err) throw err;
            res.send(result);
            res.end();
        });
    });
});
app.post("/Production/GetGroup", function (req, res) {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
    currHrs = parseInt(timeUpdate.substring(11, 13));
    year = timeUpdate.substring(0, 4);
    month = timeUpdate.substring(5, 7);
    day = timeUpdate.substring(8, 10);
    date = year + month + day;
    get_date_infor(date, function (result) {
        week = result[0].Week;
        nextWeek = week + 1
        lastWeek = week - 1
        con1.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "SELECT GroupName AS GROUP_PLAN from  web_ie_location l WHERE l.line <= 'Line 360' AND GroupName NOT IN('000-000','DKN_PB2') GROUP BY GroupName"
            sql = "SELECT DISTINCT (NameGroup) AS GROUP_PLAN FROM erpsystem.setup_group g WHERE g.NameGroup NOT IN ('NOTNAME','600','NSI') AND g.Zone IN ('1','2','3','4','5','6') AND LENGTH(NameGroup)>4"
            // sql="SELECT GroupName AS GROUP_IE, NameGroup AS GROUP_PLAN, p.PLAN FROM (select distinct GroupName from web_ie_location) w LEFT JOIN "
            // +" (select NameGroup, PLAN from erpsystem.setup_plansewing where Week='"+lastWeek+"' or Week='"+week+"' or Week='"+nextWeek+"' group by NameGroup) p ON w.groupName=p.NameGroup GROUP BY groupName;"
            // sql="SELECT NameGroup AS GROUP_PLAN FROM"
            // " (SELECT s.User,s.Name,g.NameGroup FROM erpsystem.setup_user s" 
            // " LEFT JOIN erpsystem.setup_group g ON s.Name=g.SupervisorRitmo"
            // " OR s.Name=g.SupervisorBali WHERE  namegroup IS NOT NULL) t WHERE t.User='"+res.user+"'"
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send(result);
                res.end();
            });
        });
    });
});
app.post("/Production/GetGroupKanban", function (req, res) {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
    currHrs = parseInt(timeUpdate.substring(11, 13));
    year = timeUpdate.substring(0, 4);
    month = timeUpdate.substring(5, 7);
    day = timeUpdate.substring(8, 10);
    date = year + month + day;
    get_date_infor(date, function (result) {
        week = result[0].Week;
        nextWeek = week + 1
        lastWeek = week - 1
        con2.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "select t1.NAMEGROUP, HQAS, PLAN, ASS_STATUS, ASS_CALL, ASS_SEND, ASS_RECEIVE, ASS_PENDING from "
                + " (select NAMEGROUP, PLAN from erpsystem.setup_plansewing where Week='" + lastWeek + "' or Week='" + week + "' or Week='" + nextWeek + "' group by NameGroup) t1 "
                + " left join (select GROUP_CONCAT(HQAS SEPARATOR'+') HQAS, NAMEGROUP, ASS_STATUS, ASS_CALL, ASS_SEND, ASS_RECEIVE, ASS_PENDING "
                + " from pr2k.operation_kanban where ASS_STATUS!='DONE' group by NameGroup order by FIELD(ASS_STATUS, 'NOTIFY','CALL','SEND','PENDING','SUSPEND')) t2 on t1.NAMEGROUP=t2.NAMEGROUP order by t1.NAMEGROUP;"
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send(result);
                res.end();
            });
        });
    });
});
app.post("/Production/AutoKanban/GetNextAsslot", function (req, res) {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
    currHrs = parseInt(timeUpdate.substring(11, 13));
    year = timeUpdate.substring(0, 4);
    month = timeUpdate.substring(5, 7);
    day = timeUpdate.substring(8, 10);
    date = year + month + day;
    asslot = req.body.asslot;
    // groupName=req.body.groupName;
    get_date_infor(date, function (result) {
        week = result[0].Week;
        nextWeek = week + 1
        preWeek = week - 1;
        con2.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "select CutLot, HQAS, LotAnet, LotTotal, RIGHT(COLOR,3) as COLOR, SELLSTYLE, SIZE, TOTAL, pl.NAMEGROUP from setup_plansewing pl inner join "
                + " (select NameGroup from setup_plansewing where LotTotal='" + asslot + "' group by NameGroup) t1 "
                + " on pl.NameGroup=t1.NameGroup where (Week='" + preWeek + "' or Week='" + week + "' or Week='" + nextWeek + "') order by pl.Week, pl.IdSystem;"
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send(result);
                res.end();
            });
        });
    });
});
app.post("/Production/AutoKanban/GetNextAsslot6", function (req, res) {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
    currHrs = parseInt(timeUpdate.substring(11, 13));
    year = timeUpdate.substring(0, 4);
    month = timeUpdate.substring(5, 7);
    day = timeUpdate.substring(8, 10);
    date = year + month + day;
    asslot6 = req.body.asslot6;
    // groupName=req.body.groupName;
    get_date_infor(date, function (result) {
        week = parseInt(result[0].Week);
        nextWeek = week + 1;
        if (nextWeek == 54) nextWeek = 1;
        preWeek = week - 1;
        if (preWeek == -1) preWeek = 53;
        con2.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "select Plan from erpsystem.setup_plansewing where HQAS='" + asslot6 + "' or CUTLOT='" + asslot6 + "';"
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                if (result.length == 0) {
                    connection.release();
                    res.send('notfound');
                    res.end();
                } else {
                    if (result[0].Plan == 'PBIE') {
                        sql1 = "select CutLot, HQAS, LotAnet, LotTotal, RIGHT(COLOR,3) as COLOR, SELLSTYLE, SIZE, TOTAL, pl.NAMEGROUP from setup_plansewing pl inner join "
                            + " (select NameGroup from setup_plansewing where (Plan='PBIE') group by NameGroup) t1 "
                            + " on pl.NameGroup=t1.NameGroup where (Week='" + preWeek.toString() + "' or Week='" + week.toString() + "' or Week='" + nextWeek.toString() + "');"
                        connection.query(sql1, function (err, result, fields) {
                            connection.release();
                            if (err) throw err;
                            res.send(result);
                            res.end();
                        });
                    } else {
                        sql1 = "select CutLot, HQAS, LotAnet, LotTotal, RIGHT(COLOR,3) as COLOR, SELLSTYLE, SIZE, TOTAL, pl.NAMEGROUP from setup_plansewing pl inner join "
                            + " (select NameGroup from setup_plansewing where (HQAS='" + asslot6 + "' or CutLot='" + asslot6 + "') group by NameGroup) t1 "
                            + " on pl.NameGroup=t1.NameGroup where (Week='" + preWeek.toString() + "' or Week='" + week.toString() + "' or Week='" + nextWeek.toString() + "') order by pl.Week, pl.IdSystem;"
                        connection.query(sql1, function (err, result, fields) {
                            connection.release();
                            if (err) throw err;
                            res.send(result);
                            res.end();
                        });
                    }
                }
            });
        });
    });
});
app.post("/Production/AutoKanban/GetKanbanAsslot", function (req, res) {
    groupName = req.body.group;
    con2.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        sql = "select p.CutLot, p.HQAS, p.LotAnet, p.LotTotal, RIGHT(p.Color,3) as COLOR, p.SELLSTYLE, p.SIZE, p.TOTAL, p.NAMEGROUP from "
            + " (select ASS_LOT, ASS_STATUS from pr2k.operation_kanban where NAMEGROUP='" + groupName + "' and (ASS_STATUS!='DONE' and ASS_STATUS!='PENDING') order by TimeUpdate desc) t1 "
            + " inner join erpsystem.setup_plansewing p on t1.ASS_LOT=p.LotTotal;"
        connection.query(sql, function (err, result, fields) {
            connection.release();
            if (err) throw err;
            res.send(result);
            res.end();
        });
    });
});
app.post("/Production/AutoKanban/GetKanbanAsslot6", function (req, res) {
    groupName = req.body.group;
    con2.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        sql = "select p.CutLot, p.HQAS, p.LotAnet, p.LotTotal, RIGHT(p.Color,3) as COLOR, p.SELLSTYLE, p.SIZE, p.TOTAL, p.NAMEGROUP from "
            + " (select HQAS, ASS_STATUS from pr2k.operation_kanban where NAMEGROUP='" + groupName + "' and (ASS_STATUS!='DONE') order by TimeUpdate desc) t1 "
            + " inner join erpsystem.setup_plansewing p on t1.HQAS=p.HQAS;"
        connection.query(sql, function (err, result, fields) {
            connection.release();
            if (err) throw err;
            res.send(result);
            res.end();
        });
    });
});
app.post("/Production/AutoKanban/NotifyAsslots", function (req, res) {
    if (req.isAuthenticated()) {
        next_asslot_str = req.body.next_asslot;
        next_asslot_list = next_asslot_str.split(';');
        curr_group = req.body.curr_group;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            result = '';
            id = -1;
            for (var i = 0; i < next_asslot_list.length; i++) {
                next_asslot = next_asslot_list[i];
                sql = "select * from pr2k.operation_kanban where ASS_LOT='" + next_asslot + "' and TimeUpdate>(CURDATE()-INTERVAl 30 DAY);";
                connection.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    if (result.length > 0) {
                        result = 'existed';
                        id = i;
                    }
                });
                sql = "replace into operation_kanban (ASS_LOT, NAMEGROUP, ASS_STATUS, ASS_NOTIFY, TimeUpdate, User) "
                    + " values ('" + next_asslot + "','" + curr_group + "','NOTIFY','" + timeUpdate + "','" + timeUpdate + "', '" + req.user + "');";
                connection.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    result = 'done';
                });
            }
            connection.release();
            res.send({ result: result, id: id });
            res.end();
        });
    } else {
        res.render("login");
    }
});
app.post("/Production/AutoKanban/NotifyAsslots6", function (req, res) {
    if (req.isAuthenticated()) {
        next_asslot_str = req.body.next_asslot;
        next_asslot_list = next_asslot_str.split(';');
        curr_group = req.body.curr_group;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            result = '';
            id = -1;
            for (var i = 0; i < next_asslot_list.length; i++) {
                next_asslot = next_asslot_list[i];
                sql = "select * from pr2k.operation_kanban where HQAS='" + next_asslot + "' and TimeUpdate>(CURDATE()-INTERVAl 30 DAY);";
                connection.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    if (result.length > 0) {
                        result = 'existed';
                        id = i;
                    }
                });
                asslot = '98' + next_asslot + '01';
                sql = "replace into pr2k.operation_kanban (ASS_LOT, HQAS, NAMEGROUP, ASS_STATUS, ASS_NOTIFY, TimeUpdate, User) "
                    + " values ('" + asslot + "', '" + next_asslot + "','" + curr_group + "','NOTIFY','" + timeUpdate + "','" + timeUpdate + "', '" + req.user + "');";
                connection.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    result = 'done';
                });
            }
            connection.release();
            res.send({ result: result, id: id });
            res.end();
        });
    } else {
        res.render("login");
    }
});
app.post("/Production/AutoKanban/CancelAsslots6", function (req, res) {
    if (req.isAuthenticated()) {
        curr_group = req.body.curr_group;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            result = '';
            sql = "delete from pr2k.operation_kanban where NAMEGROUP='" + curr_group + "' and ASS_STATUS='NOTIFY';";
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
app.post("/Production/AutoKanban/NotifyAsslot", function (req, res) {
    if (req.isAuthenticated()) {
        next_asslot = req.body.next_asslot;
        curr_group = req.body.curr_group;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "select * from pr2k.operation_kanban where ASS_LOT='" + next_asslot + "' and TimeUpdate>(CURDATE()-INTERVAl 30 DAY);";
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                if (result.length > 0) {
                    res.send('existed');
                    res.end();
                } else {
                    sql = "replace into pr2k.operation_kanban (ASS_LOT, NAMEGROUP, ASS_STATUS, ASS_NOTIFY, TimeUpdate, User) "
                        + " values ('" + next_asslot + "','" + curr_group + "','NOTIFY','" + timeUpdate + "','" + timeUpdate + "', '" + req.user + "');";
                    connection.query(sql, function (err, result, fields) {
                        if (err) throw err;
                        connection.release();
                        res.send('done');
                        res.end();
                    });
                }
            });
        });
    } else {
        res.render("login");
    }
});
app.post("/Production/AutoKanban/CallAsslots", function (req, res) {
    if (req.isAuthenticated()) {
        asslot_list = req.body.asslot.split(';');
        curr_group = req.body.curr_group;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            // sql="insert ignore into operation_kanban (ASS_LOT, NAMEGROUP, ASS_STATUS, ASS_CALL, TimeUpdate, User) "
            //     +" values ('"+next_asslot+"','"+curr_group+"','CALL','"+timeUpdate+"','"+timeUpdate+"', '"+req.user+"');";
            for (var i = 0; i < asslot_list.length; i++) {
                asslot = asslot_list[i]
                sql = "update pr2k.operation_kanban set ASS_STATUS='CALL', ASS_CALL='" + timeUpdate + "', TimeUpdate='" + timeUpdate + "', User='" + req.user + "' where ASS_LOT='" + asslot + "';"
                connection.query(sql, function (err, result, fields) {
                    if (err) throw err;
                });
            }
            connection.release();
            res.send('done');
            res.end();
        });
    } else {
        res.render("login");
    }
});
app.post("/Production/AutoKanban/CallAsslots6", function (req, res) {
    if (req.isAuthenticated()) {
        asslot_list = req.body.asslot.split(';');
        curr_group = req.body.curr_group;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            // sql="insert ignore into operation_kanban (ASS_LOT, NAMEGROUP, ASS_STATUS, ASS_CALL, TimeUpdate, User) "
            //     +" values ('"+next_asslot+"','"+curr_group+"','CALL','"+timeUpdate+"','"+timeUpdate+"', '"+req.user+"');";
            for (var i = 0; i < asslot_list.length; i++) {
                asslot = asslot_list[i]
                sql = "update pr2k.operation_kanban set ASS_STATUS='CALL', ASS_CALL='" + timeUpdate + "', TimeUpdate='" + timeUpdate + "', User='" + req.user + "' where HQAS='" + asslot + "';"
                connection.query(sql, function (err, result, fields) {
                    if (err) throw err;
                });
            }
            connection.release();
            res.send('done');
            res.end();
        });
    } else {
        res.render("login");
    }
});
app.post("/Production/AutoKanban/CallAsslot", function (req, res) {
    if (req.isAuthenticated()) {
        asslot = req.body.asslot;
        curr_group = req.body.curr_group;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            // sql="insert ignore into operation_kanban (ASS_LOT, NAMEGROUP, ASS_STATUS, ASS_CALL, TimeUpdate, User) "
            //     +" values ('"+next_asslot+"','"+curr_group+"','CALL','"+timeUpdate+"','"+timeUpdate+"', '"+req.user+"');";
            sql = "update pr2k.operation_kanban set ASS_STATUS='CALL', ASS_CALL='" + timeUpdate + "', TimeUpdate='" + timeUpdate + "', User='" + req.user + "' where ASS_LOT='" + asslot + "';"
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send('done');
                res.end();
            });
        });
    } else {
        res.render("login");
    }
});
app.post("/Production/AutoKanban/SendAsslots", function (req, res) {
    if (req.isAuthenticated()) {
        asslot_list = req.body.asslot.split(';');
        groupName = req.body.group;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            for (var i = 0; i < asslot_list.length; i++) {
                asslot = asslot_list[i];
                sql = "update pr2k.operation_kanban set ASS_STATUS='SEND', ASS_SEND='" + timeUpdate + "', ASS_STATUS='DONE', TimeUpdate='" + timeUpdate + "', User='" + req.user + "' where ASS_LOT='" + asslot + "';"
                connection.query(sql, function (err, result, fields) {
                    if (err) throw err;
                });
            }
            connection.release();
            res.send('done');
            res.end();
        });
    } else {
        res.render("login");
    }
});
app.post("/Production/AutoKanban/SendAsslots6", function (req, res) {
    if (req.isAuthenticated()) {
        asslot_list = req.body.asslot.split(';');
        groupName = req.body.group;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            for (var i = 0; i < asslot_list.length; i++) {
                asslot = asslot_list[i];
                sql = "update pr2k.operation_kanban set ASS_STATUS='DONE', ASS_SEND='" + timeUpdate + "', ASS_DONE='" + timeUpdate + "', TimeUpdate='" + timeUpdate + "', User='" + req.user + "' where HQAS='" + asslot + "';"
                connection.query(sql, function (err, result, fields) {
                    if (err) throw err;
                });
            }
            connection.release();
            res.send('done');
            res.end();
        });
    } else {
        res.render("login");
    }
});
app.post("/Production/AutoKanban/ReceiveAsslots", function (req, res) {
    if (req.isAuthenticated()) {
        asslot_list = req.body.asslot.split(';');
        groupName = req.body.group;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            for (var i = 0; i < asslot_list.length; i++) {
                asslot = asslot_list[i];
                sql = "update operation_kanban set ASS_STATUS='RECEIVE', ASS_RECEIVE='" + timeUpdate + "', TimeUpdate='" + timeUpdate + "', User='" + req.user + "' where ASS_LOT='" + asslot + "';"
                connection.query(sql, function (err, result, fields) {
                    if (err) throw err;
                });
            }
            connection.release();
            res.send('done');
            res.end();
        });
    } else {
        res.render("login");
    }
});
app.post("/Production/AutoKanban/ReceiveAsslots6", function (req, res) {
    if (req.isAuthenticated()) {
        asslot_list = req.body.asslot.split(';');
        groupName = req.body.group;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            for (var i = 0; i < asslot_list.length; i++) {
                asslot = asslot_list[i];
                sql = "update pr2k.operation_kanban set ASS_STATUS='RECEIVE', ASS_RECEIVE='" + timeUpdate + "', TimeUpdate='" + timeUpdate + "', User='" + req.user + "' where HQAS='" + asslot + "';"
                connection.query(sql, function (err, result, fields) {
                    if (err) throw err;
                });
            }
            connection.release();
            res.send('done');
            res.end();
        });
    } else {
        res.render("login");
    }
});
app.post("/Production/AutoKanban/ReceiveAsslot", function (req, res) {
    if (req.isAuthenticated()) {
        asslot = req.body.asslot;
        groupName = req.body.group;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update pr2k.operation_kanban set ASS_STATUS='RECEIVE', ASS_RECEIVE='" + timeUpdate + "', TimeUpdate='" + timeUpdate + "', User='" + req.user + "' where ASS_LOT='" + asslot + "';"
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send('done');
                res.end();
            });
        });
    } else {
        res.render("login");
    }
});
app.post("/Production/AutoKanban/ReceiveAsslot6", function (req, res) {
    if (req.isAuthenticated()) {
        asslot = req.body.asslot;
        groupName = req.body.group;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update pr2k.operation_kanban set ASS_STATUS='RECEIVE', ASS_RECEIVE='" + timeUpdate + "', TimeUpdate='" + timeUpdate + "', User='" + req.user + "' where HQAS='" + asslot + "';"
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send('done');
                res.end();
            });
        });
    } else {
        res.render("login");
    }
});
app.post("/Production/AutoKanban/SuppliesAsslots", function (req, res) {
    if (req.isAuthenticated()) {
        asslot_list = req.body.asslot.split(';');
        groupName = req.body.group;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            for (var i = 0; i < asslot_list.length; i++) {
                asslot = asslot_list[i];
                sql = "update pr2k.operation_kanban set ASS_STATUS='SUPPLIES', ASS_SUPPLIES='" + timeUpdate + "', TimeUpdate='" + timeUpdate + "', User='" + req.user + "' where ASS_LOT='" + asslot + "';"
                connection.query(sql, function (err, result, fields) {
                    if (err) throw err;
                });
            }
            connection.release();
            res.send('done');
            res.end();
        });
    } else {
        res.render("login");
    }
});
app.post("/Production/AutoKanban/SuppliesAsslots6", function (req, res) {
    if (req.isAuthenticated()) {
        asslot_list = req.body.asslot.split(';');
        groupName = req.body.group;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            for (var i = 0; i < asslot_list.length; i++) {
                asslot = asslot_list[i];
                sql = "update pr2k.operation_kanban set ASS_STATUS='SUPPLIES', ASS_SUPPLIES='" + timeUpdate + "', TimeUpdate='" + timeUpdate + "', User='" + req.user + "' where HQAS='" + asslot + "';"
                connection.query(sql, function (err, result, fields) {
                    if (err) throw err;
                });
            }
            connection.release();
            res.send('done');
            res.end();
        });
    } else {
        res.render("login");
    }
});
app.post("/Production/AutoKanban/PendingAsslots", function (req, res) {
    if (req.isAuthenticated()) {
        asslot_list = req.body.asslot.split(';');
        groupName = req.body.group;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            for (var i = 0; i < asslot_list.length; i++) {
                asslot = asslot_list[i];
                sql = "update pr2k.operation_kanban set ASS_STATUS='PENDING', ASS_PENDING='" + timeUpdate + "', ASS_DONE='" + timeUpdate + "', TimeUpdate='" + timeUpdate + "', User='" + req.user + "' where ASS_LOT='" + asslot + "';"
                connection.query(sql, function (err, result, fields) {
                    if (err) throw err;
                });
            }
            connection.release();
            res.send('done');
            res.end();
        });
    } else {
        res.render("login");
    }
});
app.post("/Production/AutoKanban/PendingAsslots6", function (req, res) {
    if (req.isAuthenticated()) {
        asslot_list = req.body.asslot.split(';');
        groupName = req.body.group;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            for (var i = 0; i < asslot_list.length; i++) {
                asslot = asslot_list[i];
                sql = "update pr2k.operation_kanban set ASS_STATUS='PENDING', ASS_PENDING='" + timeUpdate + "', ASS_DONE='" + timeUpdate + "', TimeUpdate='" + timeUpdate + "', User='" + req.user + "' where HQAS='" + asslot + "';"
                connection.query(sql, function (err, result, fields) {
                    if (err) throw err;
                });
            }
            connection.release();
            res.send('done');
            res.end();
        });
    } else {
        res.render("login");
    }
});
app.post("/Production/AutoKanban/DoneAsslots", function (req, res) {
    if (req.isAuthenticated()) {
        asslot_list = req.body.asslot.split(';');
        groupName = req.body.group;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            for (var i = 0; i < asslot_list.length; i++) {
                asslot = asslot_list[i]
                sql = "update pr2k.operation_kanban set ASS_STATUS='DONE', ASS_SUPPLIES='" + timeUpdate + "', ASS_DONE='" + timeUpdate + "', TimeUpdate='" + timeUpdate + "', User='" + req.user + "' where ASS_LOT='" + asslot + "';"
                connection.query(sql, function (err, result, fields) {
                    if (err) throw err;
                });
            }
            connection.release();
            res.send('done');
            res.end();
        });
    } else {
        res.render("login");
    }
});
app.post("/Production/AutoKanban/DoneAsslots6", function (req, res) {
    if (req.isAuthenticated()) {
        asslot_list = req.body.asslot.split(';');
        groupName = req.body.group;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            for (var i = 0; i < asslot_list.length; i++) {
                asslot = asslot_list[i]
                sql = "update pr2k.operation_kanban set ASS_STATUS='DONE', ASS_SUPPLIES='" + timeUpdate + "', ASS_DONE='" + timeUpdate + "', TimeUpdate='" + timeUpdate + "', User='" + req.user + "' where HQAS='" + asslot + "';"
                connection.query(sql, function (err, result, fields) {
                    if (err) throw err;
                });
            }
            connection.release();
            res.send('done');
            res.end();
        });
    } else {
        res.render("login");
    }
});
app.post("/Production/Report/CheckCutlot", function (req, res) {
    if (req.isAuthenticated()) {
        week = req.body.week;
        groupName = req.body.group;
        // var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        // var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        // var timeUpdate=localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "SELECT CUTLOT, LOTANET, LOTTOTAL, p.HQAS, LEFT(COLOR, 4) MFG, RIGHT(COLOR, 3) COLOR, SELLSTYLE, SIZE, TOTAL, c.TimeScan, k.ASS_STATUS "
                + " FROM erpsystem.setup_plansewing p "
                + " LEFT JOIN erpsystem.data_scancutpartcutting c ON p.CutLot=c.WorkLot "
                + " LEFT JOIN pr2k.operation_kanban k ON p.Hqas=k.HQAS "
                + " WHERE p.NameGroup='" + groupName + "' AND p.WEEK='" + week + "';"
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
//================================ dieu chinh sah PAD ====================================
app.get("/Production/check_packer_wip", function (req, res) {
    if (req.isAuthenticated()) {
        var restext = { user: req.user }
        res.render("Production/Wip_packer", restext);
        res.end
    }
    else {
        res.render("login");
    }
})


app.post("/Production/packer_wip_d", async function (req, res) {
    console.log("POST - /Production/packer_wip_d ")
    try{
        var da = req.body.datesel;
        var gr = req.body.groupname;
        var shift = req.body.shift;

        var morning = await get_shift_by_date(da.replace(/-/g, ""))
        if (morning.length == 0) {
            res.send("notfoundshift")
            res.end()
            return
        }
        if (morning[0]['morning'] == 'B') {
            var shift_m = 'B'
            var shift_a = 'R'
        } else {
            var shift_m = 'R'
            var shift_a = 'B'
        }
        var gr2 = gr.replace("-", "");
        var sttime = ''
        var ftime = ''
        if (shift == "BuoiSang") {
            gr2 = gr2+shift_m
            sttime = da + ' 13:00:00'
            ftime = da + ' 14:15:00'
        } else {
            gr2 = gr2+shift_a
            sttime = da + ' 21:15:00'
            ftime = da + ' 22:45:00'
        }

        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            // sql_c = ('SELECT work_lot,bundle,groupname,timeupdate,file as tenfile,qc FROM '
            //     + '(SELECT sc.bundle,sc.WORK_LOT,if(p.NameGroup is null,ac.location,p.NameGroup) as groupname,DATE_FORMAT(sc.timeupdate,"%d/%m/%Y %H:%i:%s") AS timeupdate,a.file,sc.qc FROM pr2k.employee_scanticket sc '
            //     + '    LEFT JOIN erpsystem.setup_plansewing p ON sc.WORK_LOT=p.LotAnet '
            //     + '    LEFT JOIN pr2k.worklot_active ac ON ac.work_lot=sc.work_lot '
            //     + '    LEFT JOIN pr2k.bundleticket_active a ON sc.TICKET= a.TICKET '
            //     + '    WHERE '
            //     + '    sc.TimeUpdate>="' + sttime + '" and sc.timeUpdate<="' + ftime + '" AND sc.QC LIKE "%8888%" '
            //     + '    AND a.`FILE` LIKE "%SEWING%" '
            //     + '    GROUP BY bundle) AS ttw WHERE groupname="' + gr + '" order by work_lot,bundle;')

            sql_c = ('SELECT work_lot,bundle, "'+gr+'" as groupname,DATE_FORMAT(timeupdate,"%d/%m/%Y %H:%i:%s") AS timeupdate,file as tenfile,qc FROM pr2k.employee_scanticket e WHERE e.`FILE` LIKE "'+gr2+'%" ' 
            + 'AND e.DATE = date("'+da+'") AND e.QC LIKE "%888%" and TimeUpdate>="' + sttime + '" and timeUpdate<="' + ftime + '" GROUP BY bundle;')
            console.log(sql_c)

            connection.query(sql_c, function (err, result, fields) {
                if (err) {
                    res.send("empty")
                    res.end()
                    throw err;
                }
                connection.release();
                res.send(result)
                res.end()
            });

        })
    }
    catch(e){
        console.log(e)
    }

})

function get_shift_by_date(date) {
    return new Promise((resolve, reject) => {
        var sql_schedule = `SELECT Shift as morning FROM operation_schedule o WHERE o.DATE = '${date}' ;`;
        console.log(sql_schedule)
        con4.getConnection(function(err, list_con) {
            if (err) {
                return reject(err);
            }
            list_con.query(sql_schedule, function(err, result) {
                list_con.release();
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    });
}


//================================ DIEU CHINH SAH PAD====================================
app.get("/Production/pad_change_sah", function (req, res) {

    if (req.isAuthenticated()) {
        var restext = { user: req.user }
        res.render("Production/pad_change", restext);
        res.end
    }
    else {
        res.render("login");
    }
})
app.post("/Production/pad_update_sah", function (req, res) {
    if (req.isAuthenticated()) {
        u = req.user;
        lot = req.body.lot;
        lot = lot.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        old_sah = req.body.old_sah;
        new_sah = req.body.new_sah;
        if (u == "tranmung" || u === "hungo") {
            con4.getConnection(function (err, connection) {
                if (err) {
                    throw err;
                }
                sql_c = 'update pr2k.pad_change_submit set user_update="' + u + '",new_sah_per_dz="' + new_sah + '",old_sah_per_dz="' + old_sah + '",time_update=now() where work_lot="' + lot + '";'
                connection.query(sql_c, function (err, result, fields) {
                    if (err) throw err;
                    connection.release();
                    res.send("updated")
                    res.end()
                });

            })

        } else {
            res.send("user invalid")
            res.end();
        }

    }
    else {
        res.send("Vui long dang nhap");
    }
})

app.post("/Production/pad_approval", function (req, res) {
    if (req.isAuthenticated()) {
        u = req.user;
        lot = req.body.lot;
        lot = lot.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        requ = req.body.requ;
        approve = req.body.approve
        if (u == "tudo" || u === "nnguyen") {
            con4.getConnection(function (err, connection) {
                if (err) {
                    throw err;
                }
                sql_c = 'update pr2k.pad_change_submit set user_approved="' + u + '",time_approved=now(),approved="' + approve + '" where work_lot="' + lot + '" and req_user="' + requ + '";'
                connection.query(sql_c, function (err, result, fields) {
                    if (err) throw err;
                    connection.release();
                    res.send("Approval updated")
                    res.end()
                });

            })

        } else {
            res.send("user invalid")
            res.end();
        }

    }
    else {
        res.send("Vui long dang nhap");
    }
})

app.post("/Production/pad_lot_change", function (req, res) {
    if (req.isAuthenticated()) {
        var wlot = req.body.lot;
        var group = req.body.group;
        var style = req.body.style;
        var color = req.body.color;
        var size = req.body.size;
        wlot = wlot.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql_c = "select * from bundleticket_active where work_lot='" + wlot + "' and operation='Pad Print' and file<>'0';"
            connection.query(sql_c, function (err, result, fields) {
                if (err) throw err;
                connection.release();
                if (result.length > 0) {
                    sql_i = "replace into pr2k.pad_change_submit (work_lot,req_user,time_req,location,style,color,size) values ('" + wlot + "','" + req.user + "',now(),'" + group + "','" + style + "','" + color + "','" + size + "');"
                    con4.getConnection(function (err, connection2) {
                        connection2.query(sql_i, function (err, result, fields) {
                            if (err) throw err;
                            connection2.release();
                            res.send("Hệ thống đã cập nhật yêu cầu cho lot : " + wlot + " yêu cầu bởi " + req.user)
                            res.end()
                        })
                    })

                }
                else {
                    res.send("Thông tin wlot không đúng! Vui lòng kiểm tra lại!")
                    res.end()
                }
            });

        })

    }
    else {
        res.send("Vui long login truoc");
        res.end();
    }
})

app.post('/Production/pad_lot_check', function (req, res) {
    if (req.isAuthenticated()) {
        wlot = req.body.lot;
        wlot = wlot.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql_c = "SELECT location,selling_style,color,size FROM pr2k.worklot_active WHERE work_lot='" + wlot + "';"
            connection.query(sql_c, function (err, result, fields) {
                if (err) throw err;
                connection.release();
                if (result.length > 0) {
                    res.send(result)
                    res.end()
                }
                else {
                    res.send("empty")
                    res.end()
                }
            });

        })

    }
    else {
        res.send("Vui long login truoc");
        res.end();
    }
})

app.post("/Production/pad_lot_list", function (req, res) {
    if (req.isAuthenticated()) {
        wlot = req.body.lot;
        wlot = wlot.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        con4.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql_c = "SELECT *,DATE_FORMAT(time_req,'%Y-%m-%d %H:%i:%S') AS time_req_cv,DATE_FORMAT(time_update,'%Y-%m-%d %H:%i:%S') AS time_update_cv  FROM pr2k.pad_change_submit where date(time_req)>date(DATE_SUB(NOW(), INTERVAL 30 DAY));"
            connection.query(sql_c, function (err, result, fields) {
                if (err) throw err;
                connection.release();
                if (result.length > 0) {
                    res.send(result)
                    res.end()
                }
                else {
                    res.send("empty")
                    res.end()
                }
            });

        })

    }
    else {
        res.send("Vui long login truoc");
        res.end();
    }
})
function get_kanban_infor(plant = 'PB', groupName = '000-000', callback) {
    con4.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        if (plant == 'PB' && groupName == '000-000') sql = "select se.NAMEGROUP, kb.ASS_LOT, kb.ASS_STATUS, kb.ASS_CALL, kb.ASS_SEND, kb.ASS_RECEIVE, kb.ASS_SUSPEND from pr2k.operation_kanban kb "
            + " inner join erpsystem.setup_plansewing se on kb.ASS_LOT=se.LotAnet where STAtUS!='DONE' group by se.NameGroup;";
        else if (plant != 'PB' && groupName == '000-000') sql = "select se.NAMEGROUP, kb.ASS_LOT, kb.ASS_STATUS, kb.ASS_CALL, kb.ASS_SEND, kb.ASS_RECEIVE, kb.ASS_SUSPEND from pr2k.operation_kanban kb "
            + " inner join erpsystem.setup_plansewing se on kb.ASS_LOT=se.LotAnet where STATUS!='DONE' and PLAN='" + plant + "' group by se.NameGroup;";
        else if (plant == 'PB' && groupName != '000-000') sql = "select se.NAMEGROUP, kb.ASS_LOT, kb.ASS_STATUS, kb.ASS_CALL, kb.ASS_SEND, kb.ASS_RECEIVE, kb.ASS_SUSPEND from pr2k.operation_kanban kb "
            + " inner join erpsystem.setup_plansewing se on kb.ASS_LOT=se.LotAnet where STATUS!='DONE' and se.NameGroup='" + groupName + "' group by se.NameGroup;";
        else if (plant != 'PB' && groupName == '000-000') sql = "select se.NAMEGROUP, kb.ASS_LOT, kb.ASS_STATUS, kb.ASS_CALL, kb.ASS_SEND, kb.ASS_RECEIVE, kb.ASS_SUSPEND from pr2k.operation_kanban kb "
            + " inner join erpsystem.setup_plansewing se on kb.ASS_LOT=se.LotAnet where STATUS!='DONE' and PLAN='" + plant + "' and se.NameGroup='" + groupName + "' group by se.NameGroup;";
        connection.query(sql, function (err, result, fields) {
            connection.release();
            if (err) throw err;
            return callback(result);
        });
    });
}

//================================ TEST AN TEM CHUNG ==============================================

app.get("/tem-chung", function (req, res) {
    console.log("GET /tem-chung");
    res.render("TemChung/index");
    res.end
})

app.post('/load-user', function (req, res) {
    var rfid = req.body.rfid
    try {

        var EmpCard = convert_10digit(rfid);
        console.log(EmpCard)
        if (rfid == '000') {
            EmpCard = '22236946'
        }
        // return
        console.log('load-user: ' + EmpCard);
        var sql_data_emplist = ("SELECT r.CardNo,r.EmployeeID,e.Name,e.Dept,e.Type, e.Shift, e.Position from (SELECT CardNo,EmployeeID,Name FROM erpsystem.setup_rfidemplist WHERE CardNo='" + String(EmpCard) + "') r"
        + " INNER JOIN erpsystem.setup_emplist e on r.EmployeeID=e.ID");
        
        console.log(sql_data_emplist)
        pr2k_con_pbvp.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            connection.query(sql_data_emplist, function (err, data_emplist, fields) {
                connection.release();
                if (err) throw err;
                if (data_emplist.length > 0) {
                    recordSet = data_emplist;
                    res.send(recordSet);
                    res.end();
                }
                else {
                    recordSet = [];
                    res.send(recordSet);
                    res.end();
                }
            });
        });
    } catch (err) {
        console.log(err);
        recordSet = [];
        res.send(recordSet);
        res.end();
    }
});

app.post("/tem-chung/insert-data", function (req, res) {
    console.log(req.body)
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
    var keyx = req.body.id + '_' +  timeUpdate
    console.log(keyx)
    // return
    con5.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        sql = ("replace into cutting_system.time_scan"
        + " (keyx, id, name, date, operation, cluster, time_in, shift, time_update)"
        + " values ('"+keyx+"', '" + req.body.id + "', '" + req.body.name + "', DATE(NOW()),'" + req.body.operation + "','" + req.body.cluster + "', '"+timeUpdate+"','" + req.body.shift + "','"+timeUpdate+"')")
        
        connection.query(sql, function (err, result, fields) {
            if (err) throw err;
        });
        connection.release();
        res.send('done');
        res.end();
    });
});

app.post("/tem-chung/update_timeout", function (req, res) {
    con5.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        sql = ("update cutting_system.time_scan set time_out = now(), hours = ROUND(TIMESTAMPDIFF(SECOND, time_in, now()) / 3600, 2)  where date = date(now()) and id =  '"+req.body.id+"' and time_out is null ")
        connection.query(sql, function (err, result, fields) {
            if (err) throw err;
        });
        connection.release();
        res.send('done');
        res.end();
    });
});

app.get("/tem-chung/check-not-timeout", function (req, res) {
    con5.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        sql_c = `SELECT * FROM cutting_system.time_scan t where t.date = date(now()) and t.time_out is null and t.id = '${req.query.id}'`
        connection.query(sql_c, function (err, result, fields) {
            if (err) throw err;
            connection.release();
            if (result.length > 0) {
                res.send({status: true, msg: result[0]['cluster']})
                res.end()
            }
            else {
                res.send({status: false, msg: ''})
                res.end()
            }
        });
    })
});

app.get("/tem-chung/more-than-2-rows", function (req, res) {
    con5.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        sql_c = `SELECT count(*) as count FROM cutting_system.time_scan t where t.date = date(now()) and t.id = '${req.query.id}'`
        connection.query(sql_c, function (err, result, fields) {
            if (err) throw err;
            connection.release();
            if (result.length > 0) {
                res.send(result)
                res.end()
            }
            else {
                res.send([])
                res.end()
            }
        });
    })
});

app.get("/tem-chung/load-data", function (req, res) {
    con5.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        sql_c = `SELECT *, DATE_FORMAT(time_in,'%Y-%m-%d %T') AS time_in_str, DATE_FORMAT(time_out,'%Y-%m-%d %T') AS time_out_str, hours  
        AS diff FROM cutting_system.time_scan t where t.date = date(now()) and t.cluster = '${req.query.cluster}' order by time_in desc`
        connection.query(sql_c, function (err, result, fields) {
            if (err) throw err;
            connection.release();
            res.send(result);
            res.end();
        });
    })
});

app.get("/tem-chung/get-sum-hours", function (req, res) {
    con5.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        sql_c = `SELECT round(sum(hours),2) sum_hours FROM cutting_system.time_scan t where t.date = date(now()) and t.cluster = '${req.query.cluster}' 
        and id = '${req.query.id}'`
        connection.query(sql_c, function (err, result, fields) {
            if (err) throw err;
            connection.release();
            res.send(result);
            res.end();
        });
    })
});

function convert_10digit(digit10) {
    rfid = parseInt(digit10);  //00542325
    var hexstring = rfid.toString(16);
    var emphex = hexstring;
    if (hexstring.length > 6) emphex = hexstring.substring(hexstring.length - 6, hexstring.length);
    while (emphex.length < 8) {
        emphex = '0' + emphex;
    };
    console.log(emphex);
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
    console.log("emp8digit", emp8Digits)
    return emp8Digits;
}



// //=====================================CUTTING=============================================
// app.get("/Cutting/Cutting", function(req, res){
//     res.render("Cutting/Cutting");
// });
// app.get("/Cutting/PayrollCheck", function(req, res){
//     if (req.isAuthenticated()) {
//         res.render("Cutting/PayrollCheck");
//     }
//     else {
//         res.render("login");
//     }
// });
// app.get("/Cutting/OffStandard", function(req, res){
//     if (req.isAuthenticated()) {
//         res.render("Cutting/OffStandard");
//     }
//     else {
//         res.render("login");
//     }
// });
// app.post('/Cutting/Payroll_Search/GroupNew', function(req, res){
//     // res.send({image_list:'empty'});
//     // res.end();
//     if (req.isAuthenticated()) {
//         var groupName=req.body.group;
//         var date=req.body.date;

//         // var bundle=req.body.bundle;
//         var year  = date.substring(0,4);
//         var month = date.substring(4,6);
//         var day   = date.substring(6,8);
//         var dateFull=year+month+day;
//         var image_list;
//         con5.getConnection(function(err, connection){
//             if (err) throw err;
//             sql="SELECT Temp4.ISSUE_FILE, LEFT(Temp4.TICKET, 6) AS BUNDLE, max(QC) as QC, COUNT(Temp4.TICKET) AS ISSUE, COUNT(EMPLOYEE) AS SCAN, COUNT(deactive.TICKET) AS IASCAN, COUNT(Temp4.TICKET)-COUNT(EMPLOYEE)-COUNT(deactive.TICKET) AS IS_FULL, MAX(Temp4.FILE) as FILE, Temp4.TimeUpdate, TimeModified FROM "
//             +" (SELECT Temp3.FILE AS ISSUE_FILE, Temp3.TICKET, scan.QC, scan.EMPLOYEE, scan.FILE, scan.TimeUpdate, scan.TimeModified FROM employee_scanticket scan RIGHT JOIN "
//             +" (SELECT TICKET, active2.FILE FROM bundleticket_active active2 INNER JOIN (SELECT distinct active.FILE FROM bundleticket_active active "
//             +" INNER JOIN (SELECT TICKET FROM employee_scanticket where FILE LIKE '" + groupName +"_"+dateFull+ "%') AS Temp1 "
//             +" ON active.TICKET=Temp1.TICKET) AS Temp2 ON active2.`FILE`=Temp2.FILE WHERE active2.FILE!='0') AS Temp3 ON Temp3.TICKET=scan.TICKET) AS Temp4  LEFT JOIN bundleticket_deactive deactive ON Temp4.TICKET=deactive.TICKET "
//             +" GROUP BY Temp4.ISSUE_FILE;"
//             console.log(sql)
//             connection.query(sql, function (err, result, fields) {
//                 connection.release();
//                 if (err) throw err;
//                 if (result.length>0){
//                     image_list=result;
//                     var error_list;
//                     con5.getConnection(function(err, connection){
//                         if (err) {
//                             throw err;
//                         }
//                         // connection.query("SELECT FILE from bundleticket_error where DATE='"+date+"' and FILE like '"+group+"%';", function (err, result, fields) {
//                         connection.query("SELECT FILE from bundleticket_error where FILE like '" + groupName +"_"+dateFull+ "%' and MODIFIED IS NULL;", function (err, result, fields) {
//                             connection.release();
//                             if (err) throw err;
//                             if (result.length>0) {
//                                 error_list=result;
//                                 res.send({image_list: image_list, error_list: error_list});
//                                 res.end();
//                             } else {
//                                 error_list='empty';
//                                 res.send({image_list: image_list, error_list: error_list});
//                                 res.end();
//                             }
//                         });
//                     });
//                 } else {
//                     res.send({image_list:'empty'});
//                     res.end();
//                 }
//             });
//         });
//     }
//     else {
//         res.render("login");
//     }
// });
// app.post("/Cutting/Payroll_Search/GroupMultipleOperations", function(req, res){
//     var groupName=req.body.group;
//     var date=req.body.date;
//     con5.getConnection(function(err, connection){
//         if (err) {
//             connection.release();
//             throw err;
//         }
//         var sql=("SELECT * FROM "
//                     + "(SELECT EMPLOYEE, COUNT(DISTINCT OPERATION_CODE) AS OP_CODE, COUNT(TICKET) AS TICKET, FILE, QC, SUM(IS_FULL) as SUM_FULL FROM employee_scanticket "
//                     + " WHERE DATE='"+date+"' AND FILE LIKE '"+groupName+"%'"
//                     + " GROUP BY EMPLOYEE, FILE ) AS TEMP "
//                 +" WHERE TEMP.OP_CODE>1 and SUM_FULL<200;");
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
// });
// app.post('/Cutting/Payroll_Search/Submit', function(req, res){
//     if (req.isAuthenticated()) {
//         var bundle=req.body.bundle;
//         var ID=req.body.ID;
//         var QC=req.body.QC;
//         var file=req.body.file;
//         var date=req.body.date;
//         var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
//         var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
//         var timeUpdate=localISOTime.replace(/T/, ' ').replace(/\..+/, '');
//         con5.getConnection(function(err, connection){
//             if (err) {
//                 connection.release();
//                 throw err;
//             }
//             connection.query("select EMPLOYEE from employee_scanticket where TICKET='"+bundle+"';", function (err, result, fields) {
//                 if (err) throw err;
//                 // res.setHeader("Content-Type", "application/json");
//                 if (result.length==0){
//                     connection.query("replace into employee_scanticket" 
//                         + " (TICKET, EMPLOYEE, DATE, BUNDLE, OPERATION_CODE, IRR, QC, FILE, IS_FULL, MODIFIED, TimeUpdate)"
//                         + " values ('"+bundle+"', '"+ID+"', '"+date+"','"+bundle.substring(0,6)+"', '"+bundle.substring(6,10)+"','000','"+QC+"','"+file+"','100','"+req.user+"', '"+timeUpdate+"')", function (err, result, fields) {
//                         connection.release();
//                         if (err) throw err;
//                         res.setHeader("Content-Type", "application/json");
//                         res.send({result:'done'});
//                         // next();
//                         res.end();
//                     });
//                 } else {
//                     connection.query("update employee_scanticket set EMPLOYEE='"+ID+"', QC='"+QC+"', IS_FULL='100', MODIFIED='"+req.user+"', TimeModified='"+timeUpdate+"', FILE='"+file+"' where TICKET='"+bundle+"';" , function (err, result, fields) {
//                         connection.release();
//                         if (err) throw err;
//                         res.setHeader("Content-Type", "application/json");
//                         res.send({result:'done'});
//                         // next();
//                         res.end();
//                     });
//                 }

//             });
//         });
//     }
//     else {
//         res.render("login");
//     }
// });
// app.post('/Cutting/Payroll_Search/Submit1', function(req, res){
//     if (req.isAuthenticated()) {
//         var bundle=req.body.bundle;
//         var ID=req.body.ID;
//         var QC=req.body.QC;
//         var file=req.body.file;
//         var date=req.body.date;
//         var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
//         var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
//         var timeUpdate=localISOTime.replace(/T/, ' ').replace(/\..+/, '');
//         con5.getConnection(function(err, connection){
//             if (err) {
//                 throw err;
//             }
//             connection.query("replace into employee_scanticket" 
//                 + " (TICKET, EMPLOYEE, DATE, BUNDLE, OPERATION_CODE, IRR, QC, FILE, IS_FULL, MODIFIED, TimeUpdate)"
//                 + " values ('"+bundle+"', '"+ID+"', '"+date+"','"+bundle.substring(0,6)+"', '"+bundle.substring(6,10)+"','000','"+QC+"','"+file+"','100','"+req.user+"', '"+timeUpdate+"')", function (err, result, fields) {
//                 connection.release();
//                 if (err) throw err;
//                 res.send({result:'done'});
//                 res.end();
//             });
//         });
//     }
//     else {
//         res.render("login");
//     }
// });
// app.post('/Cutting/Payroll_Search/GetName', function(req, res){
//     if (req.isAuthenticated()) {
//         var ID=req.body.ID;
//         con2.getConnection(function(err, connection){
//             if (err) {
//                 throw err;
//             }
//             connection.query("Select Name, ID, Line, Shift from setup_emplist where ID like '%"+ID+"' and Type='DR';", function (err, result, fields) {
//                 connection.release();
//                 if (err) throw err;
//                 if (result.length>0){
//                     res.send(result);
//                     res.end();
//                 } else {
//                     res.send({result:'empty'});
//                     res.end();
//                 }

//             });
//         });
//     }
//     else {
//         res.render("login");
//     }
// });
// app.post('/Cutting/Payroll_Search/GetTimeSheet', function(req, res){
//     if (req.isAuthenticated()) {
//         var ID=req.body.ID;
//         var date=req.body.date;
//         var datefrom=req.body.datefrom;
//         con4.getConnection(function(err, connection){
//             if (err) {
//                 throw err;
//             }
//             sql="Select ROUND(SUM(WORK_HRS),2) AS WORK_HRS, ROUND(SUM(REG_HRS),2) AS REG_HRS, ROUND(SUM(OT15+OT20+OT30),2) as OT, ROUND(SUM(CD03),2) AS CD03, ROUND(SUM(CD08),2) AS CD08, ROUND(SUM(CD09),2) AS CD09 "
//                 +" from employee_timesheet where ID like '"+ID+"%' AND DATE<='"+date+"' AND DATE>='"+datefrom+"';"
//             connection.query(sql, function (err, result, fields) {
//                 connection.release();
//                 if (err) throw err;
//                 if (result.length>0){
//                     res.send(result);
//                     res.end();
//                 } else {
//                     res.send({result:'empty'});
//                     res.end();
//                 }

//             });
//         });
//     }
//     else {
//         res.render("login");
//     }
// });
// app.post('/Cutting/Payroll_Search/Skip', function(req, res){
//     if (req.isAuthenticated()) {
//         var file=req.body.file;
//         var date=req.body.date;
//         var QC=req.body.QC;
//         if (QC==''){
//             QC='999999';
//         }
//         var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
//         var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
//         var timeUpdate=localISOTime.replace(/T/, ' ').replace(/\..+/, '');
//         con5.getConnection(function(err, connection){
//             if (err) {
//                 throw err;
//             }
//             connection.query("Update employee_scanticket set IS_FULL='100', QC='"+QC+"', MODIFIED='"+req.user+"', TimeModified='"+timeUpdate+"' where FILE='"+file+"';" , 
//                 function (err, result, fields) {
//                 connection.release();
//                 if (err) throw err;
//                 res.send({result:'done'});
//                 res.end();
//             });
//         });
//     }
//     else {
//         res.render("login");
//     }
// });
// app.post('/Cutting/Payroll_Search/Dismiss_error', function(req, res){
//     if (req.isAuthenticated()) {
//         var file=req.body.fileName;
//         var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
//         var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
//         var timeUpdate=localISOTime.replace(/T/, ' ').replace(/\..+/, '');
//         con5.getConnection(function(err, connection){
//             if (err) {
//                 throw err;
//             }
//             connection.query("Update bundleticket_error set MODIFIED='"+req.user+"', TimeModified='"+timeUpdate+"' where FILE='"+file+"';" , 
//                 function (err, result, fields) {
//                 connection.release();
//                 if (err) throw err;
//                 res.send({result:'done'});
//                 res.end();
//             });
//         });
//     }
//     else {
//         res.render("login");
//     }
// });
// app.post('/Cutting/Payroll_Search/Bundle', function(req, res){
//     if (req.isAuthenticated()) {
//         var file=req.body.file;
//         var date=req.body.date;
//         var bundle=req.body.bundle;
//         var bundle_read;
//         con5.getConnection(function(err, connection){
//             if (err) {
//                 throw err;
//             }
//             connection.query("SELECT TICKET, QC, EMPLOYEE FROM employee_scanticket where FILE='"+file+"' or TICKET like '"+bundle+"%';", function (err, result, fields) {
//                 connection.release();
//                 if (err) throw err;
//                 if (result.length>0){
//                     bundle_read=result;
//                     var bundle1=bundle_read[0].TICKET.substring(0,6);
//                     var bundle=bundle1;
//                     if (bundle_read.length>2){
//                         var bundle2=bundle_read[1].TICKET.substring(0,6);
//                         var bundle3=bundle_read[2].TICKET.substring(0,6);
//                         if (bundle1==bundle2||bundle1==bundle3)
//                             bundle=bundle1;
//                         if (bundle1!=bundle2&&bundle2==bundle3)
//                             bundle=bundle2;
//                     }
//                     var QC=bundle_read[0].QC;
//                     con5.getConnection(function(err, connection){
//                         if (err) {
//                             connection.release();
//                             throw err;
//                         }
//                         var sql="";
//                         if (date<"20200601")
//                         sql="SELECT bundleticket_active.TICKET "
//                             +" from bundleticket_active left join employee_scanticket "
//                             +" on bundleticket_active.TICKET=employee_scanticket.TICKET "
//                             +" where bundleticket_active.TICKET like '"+bundle+"%' and employee_scanticket.TICKET is null;";
//                         else
//                         sql="SELECT TICKET from bundleticket_active where TICKET like '"+bundle+"%';"
//                         connection.query(sql, function (err, result, fields) {
//                         // connection.query(sql, function (err, result, fields) {
//                             connection.release();
//                             if (err) throw err;
//                             if (result.length>0) {
//                                 res.send({bundle_read:bundle_read, bundle_full:result, QC:QC});
//                                 res.end();
//                             } else {
//                                 res.send({bundle_read:bundle_read, bundle_full:'empty', QC:QC})
//                                 res.end();
//                             }
//                         });
//                     });
//                 } else {
//                     res.send({result:'empty'});
//                     res.end();
//                 }
//             });
//         });
//     }
//     else {
//         res.render("login");
//     }
// });
// app.post('/Cutting/Payroll_Search/BundleNew', function(req, res){
//     if (req.isAuthenticated()) {
//         var file=req.body.file;
//         var date=req.body.date;

//         var bundle=req.body.bundle;
//         var bundle_read;
//         con5.getConnection(function(err, connection){
//             if (err) {
//                 throw err;
//             }
//             sql="SELECT Temp3.TICKET, scan.QC, scan.EMPLOYEE FROM employee_scanticket scan RIGHT JOIN "
//             +" (SELECT TICKET, active2.FILE FROM bundleticket_active active2 INNER JOIN (SELECT distinct active.FILE FROM bundleticket_active active "
//             +" INNER JOIN (SELECT TICKET FROM employee_scanticket where FILE = '"+file+"') AS Temp1 "
//             +" ON active.TICKET=Temp1.TICKET) AS Temp2 ON active2.`FILE`=Temp2.FILE) AS Temp3 ON Temp3.TICKET=scan.TICKET;"
//             sql=`SELECT pr.TICKET,scan.QC, scan.EMPLOYEE FROM 
//             (SELECT ac.TICKET,f.file FROM 
//             (SELECT a.file FROM 
//             (SELECT ticket FROM employee_scanticket WHERE FILE='${file}') sc LEFT JOIN bundleticket_active a ON sc.ticket=a.ticket GROUP BY FILE) f
//             LEFT JOIN bundleticket_active ac ON f.file=ac.file) pr LEFT JOIN employee_scanticket scan ON pr.ticket=scan.ticket`
//             console.log(sql)
//             connection.query(sql, function (err, result, fields) {
//                 connection.release();
//                 if (err) throw err;
//                 if (result.length>0&&result.length<20){
//                     res.send(result);
//                     res.end();
//                 } else {
//                     res.send({result:'empty'});
//                     res.end();
//                 }
//             });
//         });
//     }
//     else {
//         res.render("login");
//     }
// });
// app.post('/Cutting/Payroll_Search/BundleSearch', function(req, res){
//     if (req.isAuthenticated()) {
//         var bundle=req.body.bundle;
//         con5.getConnection(function(err, connection){
//             if (err) {
//                 throw err;
//             }
//             connection.query("SELECT TICKET, EMPLOYEE, DATE, BUNDLE, OPERATION_CODE, EARNED_HOURS, WORK_LOT, FILE, MODIFIED, QC FROM employee_scanticket where TICKET like '"+bundle+"%';", function (err, result, fields) {
//                 connection.release();
//                 if (err) throw err;
//                 if (result.length>0){
//                     res.send(result);
//                     res.end();
//                 } else {
//                     res.send({result:'empty'});
//                     res.end();
//                 }
//             });
//         });
//     }
//     else {
//         res.render("login");
//     }
// });
// app.post('/Cutting/Payroll_Search/ID', function(req, res){
//     if (req.isAuthenticated()) {
//         var id=req.body.id;
//         var date=req.body.date;
//         var datefrom=req.body.datefrom;
//         con5.getConnection(function(err, connection){
//             if (err) {
//                 throw err;
//             }
//             sql="SELECT e.TICKET, a.OPERATION_CODE, a.EARNED_HOURS, a.UNITS, a.WORK_LOT, a.SAH_ADJ, e.FILE "
//                 +" FROM employee_scanticket e inner join bundleticket_active a on e.TICKET=a.TICKET "
//                 +" where EMPLOYEE='"+id+"' and e.TimeUpdate<='"+date+" 06:00:00' and e.TimeUpdate>='"+datefrom+" 06:00:00'"
//             // sql="SELECT BUNDLE, OPERATION_CODE, EARNED_HOURS, UNITS, WORK_LOT, FILE FROM"
//             //     + " employee_scanticket where EMPLOYEE='"+id+"' and DATE<='"+date+"' and DATE>='"+datefrom+"'";
//             connection.query(sql, function (err, result, fields) {
//                 connection.release();
//                 if (err) throw err;
//                 if (result.length>0){
//                     res.send(result);
//                     res.end();
//                 } else {
//                     res.send({result:'empty'});
//                     res.end();
//                 }
//             });
//         });
//     } else {
//         res.render("login");
//     }
// });
// app.post('/Cutting/Payroll_Search/Ticket', function(req, res){
//     var ticket=req.body.ticket;
//     con5.getConnection(function(err, connection){
//         if (err) {
//             throw err;
//         }
//         connection.query("SELECT EMPLOYEE, DATE, FILE FROM"
//         +" employee_scanticket where TICKET='"+ticket+"';", function (err, result, fields) {
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
// });
// app.post('/Cutting/Payroll_Search/Worklot', function(req, res){
//     var worklot=req.body.worklot;
//     con5.getConnection(function(err, connection){
//         if (err) {
//             connection.release();
//             throw err;
//         }
//         // sql="SELECT t1.*, r.NAME, r.OP_REG, r.NAMEGROUP FROM "
//         //     +" (SELECT a.TICKET, a.OPERATION_CODE, s.EMPLOYEE, a.EARNED_HOURS, a.SAH_ADJ, a.UNITS FROM bundleticket_active a LEFT JOIN employee_scanticket s ON a.TICKET=s.TICKET "
//         //     +" WHERE a.WORK_LOT='"+worklot+"' AND a.`FILE`!='0' and (s.date>date(now())-120)) t1 LEFT JOIN "
//         //     +" (SELECT RIGHT(ID, 5) ID, NAME, OP_REG, NAMEGROUP from offstandard_employee_registed WHERE WEEK_REG=(select max(WEEK_REG) from offstandard_employee_registed)) r ON t1.EMPLOYEE=r.ID ;";
//         sql="SELECT t1.*,r.OP_REG,e.NAME, r.NAMEGROUP FROM "
//         +" (SELECT a.TICKET, a.OPERATION_CODE, s.EMPLOYEE, a.EARNED_HOURS, a.SAH_ADJ, a.UNITS FROM bundleticket_active a LEFT JOIN employee_scanticket s ON a.TICKET=s.TICKET "
//         +" WHERE a.WORK_LOT='"+worklot+"' AND a.`FILE`!='0' and (s.date>date(now())-120)) t1 LEFT JOIN "
//         +" (SELECT RIGHT(ID, 5) ID, NAME, OP_REG, NAMEGROUP from offstandard_employee_registed WHERE WEEK_REG=(select max(WEEK_REG) from offstandard_employee_registed)) r ON t1.EMPLOYEE=r.ID "
//         +" LEFT JOIN erpsystem.setup_emplist e ON RIGHT(e.ID, 5)=t1.EMPLOYEE";
//         wle=worklot.substring(worklot.length-3,worklot.length)
//         if (wle=="RCS"){
//             // sql="SELECT t1.*, r.NAME, r.OP_REG, r.NAMEGROUP FROM "
//             // +" (SELECT a.TICKET, a.OPERATION_CODE, s.EMPLOYEE, '0' as EARNED_HOURS, a.SAH_ADJ, a.UNITS FROM bundleticket_active a LEFT JOIN employee_scanticket s ON a.TICKET=s.TICKET "
//             // +" WHERE a.WORK_LOT='"+worklot.substring(0,worklot.length-1)+"' AND a.printer!='' and (s.date>date(now())-120)) t1 LEFT JOIN "
//             // +" (SELECT RIGHT(ID, 5) ID, NAME, OP_REG, NAMEGROUP from offstandard_employee_registed WHERE WEEK_REG=(select max(WEEK_REG) from offstandard_employee_registed)) r ON t1.EMPLOYEE=r.ID ;";
//             sql="SELECT t1.*, e.NAME, r.OP_REG, r.NAMEGROUP FROM "
//             +" (SELECT a.TICKET, a.OPERATION_CODE, s.EMPLOYEE, '0' as EARNED_HOURS, a.SAH_ADJ, a.UNITS FROM bundleticket_active a LEFT JOIN employee_scanticket s ON a.TICKET=s.TICKET "
//             +" WHERE a.WORK_LOT='"+worklot.substring(0,worklot.length-1)+"' AND a.printer!='' and (s.date>date(now())-120)) t1 LEFT JOIN "
//             +" (SELECT RIGHT(ID, 5) ID, NAME, OP_REG, NAMEGROUP from offstandard_employee_registed WHERE WEEK_REG=(select max(WEEK_REG) from offstandard_employee_registed)) r ON t1.EMPLOYEE=r.ID "
//             +" LEFT JOIN erpsystem.setup_emplist e ON RIGHT(e.ID, 5)=t1.EMPLOYEE;";
//         }

//         connection.query(sql, function (err, result, fields) {
//             connection.release();
//             if (err) throw err;
//             if (result.length>0){
//                 res.send(result);
//                 res.end();
//             } else {
//                 var data={result: 'empty'};
//                 res.send(data);
//                 res.end();
//             }
//         });
//     });
// });

// app.post('/Cutting/Payroll_Search/AQL_detail', function(req, res){
//     var worklot=req.body.worklot;
//     con5.getConnection(function(err, connection){
//         if (err) {
//             connection.release();
//             throw err;
//         }
//         sql="SELECT * FROM "
//             +" (SELECT TABLE_CODE, QC, IRR, EMPLOYEE, NO_IRR, NO_SAMPLE, FILE FROM cutting_system.aql_record WHERE WORK_LOT='"+worklot+"' and date(timeupdate)>(date(now())-90)) t "
//             +" LEFT JOIN (SELECT RIGHT(ID, 5) ID, NAME, OP_REG, NAMEGROUP from offstandard_employee_registed WHERE WEEK_REG=(week(now())-1)) r "
//             +" on t.EMPLOYEE=r.ID;";

//         connection.query(sql, function (err, result, fields) {
//             connection.release();
//             if (err) throw err;
//             res.send(result);
//             res.end();
//         });
//     });
// });
// app.post('/Cutting/Payroll_Search/WorklotSummary', function(req, res){
//     var worklot=req.body.worklot;
//     con5.getConnection(function(err, connection){
//         if (err) {
//             throw err;
//         }
//         sql="select Temp1.TICKET as BUNDLE, FILE, COUNT(Temp1.TICKET) as ISSUE, COUNT(Temp2.TICKET) as EARN, COUNT(Temp3.TICKET) as IA, COUNT(Temp1.TICKET)-COUNT(Temp2.TICKET)-COUNT(Temp3.TICKET) as NOT_EARN from "
//             +" (select TICKET, FILE from bundleticket_active where work_lot='"+worklot+"' and FILE!='0' and create_date>(date(DATE_SUB(NOW(),INTERVAL 90 DAY))) ) as Temp1 "
//             +" left join "
//             +" (select TICKET from employee_scanticket where work_lot='"+worklot+"') as Temp2 on Temp1.TICKET=Temp2.TICKET "
//             +" left join "
//             +" (select TICKET from bundleticket_deactive where work_lot='"+worklot+"') as Temp3 on Temp1.TICKET=Temp3.TICKET "
//             +" group by Temp1.FILE;";
//         wle=worklot.substring(worklot.length-3,worklot.length)
//         if (wle=="RCS"){
//             sql="select Temp1.TICKET as BUNDLE, FILE, COUNT(Temp1.TICKET) as ISSUE, COUNT(Temp2.TICKET) as EARN, COUNT(Temp3.TICKET) as IA, COUNT(Temp1.TICKET)-COUNT(Temp2.TICKET)-COUNT(Temp3.TICKET) as NOT_EARN from "
//             +" (select TICKET, FILE from bundleticket_active where work_lot='"+worklot.substring(0,worklot.length-1)+"' and printer!='' and create_date>(date(DATE_SUB(NOW(),INTERVAL 90 DAY))) ) as Temp1 "
//             +" left join "
//             +" (select TICKET from employee_scanticket where work_lot='"+worklot+"') as Temp2 on Temp1.TICKET=Temp2.TICKET "
//             +" left join "
//             +" (select TICKET from bundleticket_deactive where work_lot='"+worklot.substring(0,worklot.length-3)+"') as Temp3 on Temp1.TICKET=Temp3.TICKET "
//             +" group by Temp1.FILE;";
//         }
//         connection.query(sql, function (err, result, fields) {
//             connection.release();
//             if (err) throw err;
//             if (result.length>0){
//                 res.send(result);
//                 res.end();
//             } else {
//                 var data={result: 'empty'};
//                 res.send(data);
//                 res.end();
//             }
//         });
//     });
// });

// app.post('/Cutting/Payroll_Search/Alert', function(req, res){
//     if (req.isAuthenticated()) {
//         var date=req.body.date;
//         var datefrom=req.body.datefrom;
//         con5.getConnection(function(err, connection){
//             if (err) {
//                 throw err;
//             }
//             sql="SELECT TICKET, OLD_EMPLOYEE, OLD_FILE, NEW_EMPLOYEE, NEW_FILE, STATUS FROM bundleticket_alert WHERE OLD_TimeUpdate>='"+datefrom+" 00:00:00' and OLD_TimeUpdate<='"+date+" 23:59:59' "
//                 +" AND NEW_EMPLOYEE!=OLD_EMPLOYEE and MID(OLD_FILE, 7, 1)!=MID(NEW_FILE, 7, 1) AND HOUR(OLD_TimeUpdate)!=HOUR(New_TIMEUPDATE) and (STATUS='Y' or STATUS='N') order by status desc, OLD_FILE;"
//             connection.query(sql, function (err, result, fields) {
//                 connection.release();
//                 if (err) throw err;
//                 if (result.length>0){
//                     res.send(result);
//                     res.end();
//                 } else {
//                     res.send({result:'empty'});
//                     res.end();
//                 }
//             });
//         });
//     } else {
//         res.render("login");
//     }
// });
// app.post('/Cutting/Payroll_Search/Alert_Update_Status', function(req, res){
//     if (req.isAuthenticated()) {
//         var ticket=req.body.ticket;
//         var status=req.body.status;
//         con5.getConnection(function(err, connection){
//             if (err) {
//                 throw err;
//             }
//             sql="update bundleticket_alert set STATUS='"+status+"' WHERE Ticket='"+ticket+"';"
//             connection.query(sql, function (err, result, fields) {
//                 connection.release();
//                 if (err) throw err;
//                 res.send({result:'done'});
//                 res.end()
//             });
//         });
//     } else {
//         res.render("login");
//     }
// });
// app.post('/Cutting/Payroll_Search/Update_Date_Scan', function(req, res){
//     if (req.isAuthenticated()) {
//         var date=req.body.date;
//         var file_name=req.body.file_name;
//         con5.getConnection(function(err, connection){
//             if (err) {
//                 throw err;
//             }
//             for (var i=0; i<file_name.length; i++){
//                 file=file_name[i];
//                 // sql="update employee_scanticket set DATE='"+date+"' WHERE File='"+file+"';"
//                 // connection.query(sql, function (err, result, fields) {
//                 //     if (err) throw err;
//                 // });
//             }
//             connection.release();
//             res.send({result:'done'});
//             res.end();
//         });
//     } else {
//         res.render("login");
//     }
// });
// app.post("/Cutting/Payroll_Search/GroupReport", function(req, res){
//     var groupName=req.body.group;
//     var shift=req.body.shift;
//     var date=req.body.date;
//     groupF=groupName.substring(0,3);
//     groupT=groupName.substring(4,7);
//     shift=shift.substring(0,1);
//     con2.getConnection(function(err, connection){
//         if (err) {
//             throw err;
//         }
//         var sql="select t2.ID, t2.Name, t2.Line, OPERATION, BUNDLE, SAH from ( "
//             +" select EMPLOYEE, bd.Operation_Code as OPERATION, COUNT(ac.Ticket) as Bundle, ROUND(SUM(ac.EARNED_HOURS),2) as SAH "
//             +" from cutting_system.employee_scanticket ac left join cutting_system.bundleticket_active bd "
//             +" on ac.TICKET=bd.TICKET "
//             +" where DATE='"+date+"' and  ac.File like '"+groupF+groupT+shift+"%' "
//             +" group by Employee, bd.OPERATION_Code order by bd.OPERATION_code) t1 left join "
//             +" (select RIGHT(ID,5) as EMPLOYEE, ID, Name, Line "
//             +" from setup_emplist) as t2 on t1.EMPLOYEE=t2.EMPLOYEE ;"
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
// });

// app.post("/Cutting/Payroll_Search/WipReport", function(req, res){
//     var shift=req.body.shift;
//     var date=req.body.date;
//     shift=shift.substring(0,1);
//     con2.getConnection(function(err, connection){
//         if (err) {
//             throw err;
//         }
//         var sql="select MACHINE, WORK_LOT, ASSORTLOT, OPERATION_CODE, ISSUES, SCANS, VAR, ISSUES_UNIT, SCANS_UNIT from "
//                 +" (select t3.WORK_LOT, d.SECTION, p.ASSORTLOT, p.MACHINE, OPERATION_CODE, count(issue) ISSUES, count(scan) SCANS, count(issue)-count(scan) as VAR, SUM(ISSUE_UNIT) ISSUES_UNIT, SUM(SCAN_UNIT) SCANS_UNIT from "
//                 +" (select t2.WORK_LOT, t2.TICKET as issue, t2.OPERATION_CODE, e.TICKET as scan, t2.UNITS as ISSUE_UNIT, e.UNITS as SCAN_UNIT from "
//                 +" (select t1.WORK_LOT, a.TICKET, a.OPERATION_CODE, a.UNITS from "
//                 +" (select distinct work_lot from cutting_system.employee_scanticket where FILE like '%"+shift+"_"+date+"%' and work_lot!='') t1 "
//                 +" inner join cutting_system.bundleticket_active a on t1.WORK_LOT=a.WORK_LOT) t2 left join cutting_system.employee_scanticket e on t2.TICKET=e.TICKET) t3 "
//                 +" left join erpsystem.data_cutpartcutting d on t3.WORK_LOT=d.WORK_LOT "
//                 +" left join (select * from erpsystem.setup_plancutting group by WLs) p on t3.WORK_LOT=p.WLs "
//                 +" group by work_lot, operation_code) t1 where SECTION is null order by Machine, AssortLot, WORK_LOT;"
//         connection.query(sql, function (err, result, fields) {
//             connection.release();
//             if (err) throw err;
//             res.send(result);
//             res.end();
//         });
//     });
// });

// //=====================================WAREHOUSE==========================================
// app.get("/Warehouse/Warehouse", function(req, res){
//     res.render("Warehouse/Warehouse");
// });
// app.get("/Warehouse/Phubai1", function(req, res){
//     if (req.isAuthenticated()) {
//         get_dept(req.user, function(result){
//             if (req.user!='mutran'&&result[0].Department!='LP'&&req.user!='nale'&&req.user!='tranmung') {
//                 res.send('You dont have permission to access this page!');
//                 res.end();
//             } 
//             else res.render("Warehouse/Phubai1");
//         });
//     } else {
//         res.render("login");
//     }
// });
// app.get("/Warehouse/Phubai2", function(req, res){
//     if (req.isAuthenticated()) {
//         get_dept(req.user, function(result){
//             if (req.user!='mutran'&&result[0].Department!='LP'&&req.user!='tranmung') {
//                 res.send('You dont have permission to access this page!');
//                 res.end();
//             } 
//             else res.render("Warehouse/Phubai2");
//         });
//     } else {
//         res.render("login");
//     }
// });
// app.get("/Warehouse/PhubaiIE", function(req, res){
//     if (req.isAuthenticated()) {
//         get_dept(req.user, function(result){
//             if (req.user!='mutran'&&result[0].Department!='LP'&&req.user!='tranmung') {
//                 res.send('You dont have permission to access this page!');
//                 res.end();
//             } 
//             else res.render("Warehouse/PhubaiIE");
//         });
//     } else {
//         res.render("login");
//     }
// });
// app.get("/Warehouse/Cutting", function(req, res){
//     res.render("Warehouse/Cutting");
// });
// app.get("/Warehouse/Cutpart", function(req, res){
//     if (req.isAuthenticated()) {
//         get_dept(req.user, function(result){
//             if (req.user!='mutran'&&result[0].Department!='LP') {
//                 res.send('You dont have permission to access this page!');
//                 res.end();
//             } 
//             res.render("Warehouse/Cutpart");
//         });
//     } else {
//         res.render("login");
//     }
// });
// app.get("/Warehouse/CutpartInfo", function(req, res){
//     res.render("Warehouse/CutpartInfo");
// });
/*
//=====================================IE==================================================
app.get("/IE/IE_page", function(request, res)  {
    res.render("IE/IE_page");
    // var group_list;
    // con2.getConnection(function(err, connection){
    //     if (err) {
    //         connection.release();
    //         throw err;
    //     }
    //     connection.query("SELECT distinct NameGroup FROM setup_location where Location like 'Line%';", function (err, result, fields) {
    //         connection.release();
    //         if (err) throw err;
    //         group_list=result;
    //         res.render("IE/IE_page", {group_list: group_list});
    //     });
    // });
});
app.post("/IE/group_query", function(request, response){
    var groupName=request.body.group;
    var week=request.body.week.substring(1,3);
    con1.getConnection(function(err, connection){
        if (err) {
            connection.release();
            throw err;
        }
        connection.query("SELECT distinct Fabric FROM setup_group_fabric where Line='"+groupName+"' and Week='"+week+"';", function (err, result, fields) {
            connection.release();
            if (err) throw err;
            var wc_list=result;
            response.send(wc_list);
            response.end();
        });
    })
        
});
app.post("/IE/style_query", function(request, response){
    var groupName=request.body.group;
    var wc=request.body.wc;
    var week=request.body.week.substring(1,3);
    con1.getConnection(function(err, connection){
        if (err) {
            connection.release();
            throw err;
        }
        connection.query("SELECT distinct Style FROM setup_group_fabric where Line='"+groupName+"' and Fabric='"+wc+"' and Week='"+week+"';", function (err, result, fields) {
            connection.release();
            if (err) throw err;
            var style_list=result;
            response.send(style_list);
            response.end();
        });
    })
});
app.post("/IE/size_query", function(request, response){
    var groupName=request.body.groupName;
    var style=request.body.style;
    var wc=request.body.wc;
    var week=request.body.week.substring(1,3);
    con1.getConnection(function(err, connection){
        if (err) {
            connection.release();
            throw err;
        }
        connection.query("SELECT distinct Size FROM setup_group_fabric where Line='"+groupName+"' and Fabric='"+wc+"' and Week='"+week+"' and Style='"+style+"';", function (err, result, fields) {
            connection.release();
            if (err) throw err;
            var size_list=result;
            response.send(size_list);
            response.end();
        });
    })
    
});
app.post("/IE/load_emp_data", function(request, response){
    var groupName   = request.body.group;
    var wc      = request.body.wc;
    var shift   = request.body.shift;
    var week    = request.body.week.substring(1,3);
    var options = {
        mode: 'json',
        pythonPath: 'python',
        scriptPath: './public/Python/IE/LineBalancing',
        pythonOptions: ['-u'], // get print results in real-time
        args:[groupName, wc, shift, week]
    };
    let shell=new PythonShell('get_employee_data.py', options);
    shell.on('message', function(message){
        response.setHeader("Content-Type", "application/json");
        response.send(message);
        response.end();
    });
});
app.post("/IE/get_lineBalancing", async function(request, response){
    var style=request.body.style;
    var size=request.body.size;
    var emp_list=JSON.stringify(request.body.emp_list);
    var options={
        mode: 'json',
        pythonPath: 'python',
        scriptPath: './public/Python/IE/LineBalancing',
        pythonOptions: ['-u'], // get print results in real-time
        args:[style, size, emp_list]
    };
    let shell=new PythonShell('lineBalancing.py', options);
    shell.on('message', function(message) {
        response.setHeader("Content-Type", "application/json");
        response.send(message);
        response.end();
    });
    
});

*/

app.disable('view cache');
//===========================================Schedular Task=====================================
// // var cronPythonScanTicket = require('node-cron');
// var cronUpdateTicket     = require('node-cron');
// var cronUpdateDeactive   = require('node-cron');
// var cronUpdateTicketCutting   = require('node-cron');
// var cronUpdateDeactiveCutting = require('node-cron');
// const { query, request } = require('express');
// const { info, time, group } = require('console');
// /*
// cronPythonScanTicket: scan folder Pilot will start at 5:30AM and run continously until 23:15 PM
// */
// cronUpdateTicket.schedule('0 */5 * * * *', function(){
//     var yesterdate = new Date();
//     yesterdate.setDate(yesterdate.getDate() - 2);
//     var localISOTime_yesterday=yesterdate.toISOString().slice(0, -1).substr(0,10);
//     // year=localISOTime_yesterday.substring(0,4);
//     // month=localISOTime_yesterday.substring(5,7);
//     // day=localISOTime_yesterday.substring(8,10);
//     date=localISOTime_yesterday;// year+month+day;
//     sql="UPDATE pr2k.employee_scanticket employee_scanticket, pr2k.bundleticket_active bundleticket_active"
//         + " SET employee_scanticket.PLANT=bundleticket_active.PLANT, employee_scanticket.EARNED_HOURS=bundleticket_active.EARNED_HOURS,"
//         + " employee_scanticket.STYLE=bundleticket_active.STYLE,  employee_scanticket.COLOR=bundleticket_active.COLOR,"
//         + " employee_scanticket.SIZE=bundleticket_active.SIZE, employee_scanticket.UNITS=bundleticket_active.UNITS,"
//         + " employee_scanticket.OPERATION=bundleticket_active.OPERATION, employee_scanticket.WORK_LOT=bundleticket_active.WORK_LOT"
//         + " WHERE employee_scanticket.TICKET=bundleticket_active.TICKET AND employee_scanticket.UNITS IS NULL and employee_scanticket.TimeUpdate>='"+date+" 00:00:00' ;"
//     con4.getConnection(function(err, connection){
//         if (err) {
//             throw err;
//         }
//         connection.query(sql, function (err, result, fields) {
//             connection.release();
//             if (err) throw err;
//         });
//     });
// });

// cronUpdateDeactive.schedule('0 */5 * * * *', function(){
//     sql="UPDATE pr2k.bundleticket_deactive bundleticket_deactive, pr2k.bundleticket_active bundleticket_active "
//         +" SET bundleticket_deactive.WORK_LOT=bundleticket_active.WORK_LOT "
//         +" WHERE bundleticket_deactive.TICKET=bundleticket_active.TICKET AND bundleticket_deactive.WORK_LOT='';"
//     con4.getConnection(function(err, connection){
//         if (err) {
//             connection.release();
//             throw err;
//         }
//         connection.query(sql, function (err, result, fields) {
//             connection.release();
//             if (err) throw err;
//         });
//     });
// });

// cronUpdateTicketCutting.schedule('0 */7 * * * *', function(){
//     var yesterdate = new Date();
//     yesterdate.setDate(yesterdate.getDate() - 2);
//     var localISOTime_yesterday=yesterdate.toISOString().slice(0, -1).substr(0,10);
//     // year=localISOTime_yesterday.substring(0,4);
//     // month=localISOTime_yesterday.substring(5,7);
//     // day=localISOTime_yesterday.substring(8,10);
//     date=localISOTime_yesterday;// year+month+day;
//     sql="UPDATE cutting_system.employee_scanticket employee_scanticket, cutting_system.bundleticket_active bundleticket_active"
//         + " SET employee_scanticket.PLANT=bundleticket_active.PLANT, employee_scanticket.EARNED_HOURS=bundleticket_active.EARNED_HOURS,"
//         + " employee_scanticket.STYLE=bundleticket_active.STYLE,  employee_scanticket.COLOR=bundleticket_active.COLOR,"
//         + " employee_scanticket.SIZE=bundleticket_active.SIZE, employee_scanticket.UNITS=bundleticket_active.UNITS,"
//         + " employee_scanticket.OPERATION=bundleticket_active.OPERATION, employee_scanticket.WORK_LOT=bundleticket_active.WORK_LOT"
//         + " WHERE employee_scanticket.TICKET=bundleticket_active.TICKET AND employee_scanticket.UNITS IS NULL and employee_scanticket.TimeUpdate>='"+date+" 00:00:00' ;"
//     con5.getConnection(function(err, connection){
//         if (err) {
//             throw err;
//         }
//         connection.query(sql, function (err, result, fields) {
//             connection.release();
//             if (err) throw err;
//         });
//     });
// });

// cronUpdateDeactiveCutting.schedule('0 */7 * * * *', function(){
//     sql="UPDATE cutting_system.bundleticket_deactive bundleticket_deactive, cutting_system.bundleticket_active bundleticket_active "
//         +" SET bundleticket_deactive.WORK_LOT=bundleticket_active.WORK_LOT "
//         +" WHERE bundleticket_deactive.TICKET=bundleticket_active.TICKET AND bundleticket_deactive.WORK_LOT='';"
//     con5.getConnection(function(err, connection){
//         if (err) {
//             connection.release();
//             throw err;
//         }
//         connection.query(sql, function (err, result, fields) {
//             connection.release();
//             if (err) throw err;
//         });
//     });
// });