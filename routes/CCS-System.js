var express = require("express");
var bodyParser = require('body-parser');
var app = express.Router();
var formidable = require('formidable');
var mysql = require("mysql");
var nodemailer = require("nodemailer");
const { PythonShell } = require("python-shell");
const { query } = require("express");

require('log-timestamp');
var con1 = mysql.createPool({
    connectionLimit: 500,
    host: "pbvweb01v",
    user: "tranmung",
    password: "Tr6nM6ng",
    database: "linebalancing",
    multipleStatements: true,
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
    multipleStatements: true,
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
    //   multipleStatements: true,
});
var con4 = mysql.createPool({
    connectionLimit: 500,
    host: "pbvweb01v",
    user: "tranmung",
    password: "Tr6nM6ng",
    database: "pr2k",
    multipleStatements: true,
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
    multipleStatements: true,
    authPlugins: {
        mysql_clear_password: () => () => Buffer.from('your_password') // Provide the password as a Buffer
    }
});


// ===============Funtion==============================
function get_dept(user, callback) {
    var dept = '';
    con2.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        connection.query("SELECT User, Department, Position, IDName, Name FROM setup_user where User='" + user + "';", function (err, result, fields) {
            connection.release();
            if (err) throw err;
            if (result.length > 0) {
                return callback(result);
            }
        });
    });
    return dept;
}

app.get('/CCS', function (req, res) {
    if (req.isAuthenticated()) {
        get_dept(req.user, function (result) {
            switch (result[0].Position) {
                case 'Operation Director':
                    res.redirect('/CCS/OperationDirector/NoPlantManager');
                    break;
                case 'Operation Manager | Plant Manager':
                    res.redirect('/CCS/OperationDirector/NoPlantManager');
                    break;
                case 'Plant Manager':
                    res.redirect('/CCS/PlantManager');
                    break;
                case 'Operation Manager':
                    res.redirect('/CCS/OperationManager');
                    break;
                case 'Manager':
                    res.redirect('/CCS/HeadDepartment');
                    break;
                case 'Assistan':
                    res.redirect('/CCS/Assistan');
                    break;
                case 'INDManager':
                    res.redirect('/CCS/IND/Manager');
                    break;
                default:
                    switch (result[0].Department) {
                        case 'FI':
                            res.redirect('/CCS/Finance');
                            break;
                        case 'PUR':
                            res.redirect('/CCS/Purchasing');
                            break;
                        default:
                            res.redirect('http://10.113.91.248/CCS/Request');
                    }
            }
        });
    }
    else {
        res.render("login");
    }
});

app.get('/CCS/Setup_Information', function (req, res) {
    if (req.isAuthenticated()) {
        res.render("Finance/CCS/Setup_infor", { user: req.user });
    }
    else {
        res.render("login");
    }
});

app.get('/CCS/Request', function (req, res) {
    res.redirect('http://10.113.91.248/CCS/Request')
    res.end()
    // if (req.isAuthenticated()) {
    //     res.render("Finance/CCS/Request", { user: req.user });
    // }
    // else {
    //     res.render("login");
    // }
});

app.get('/CCS/Order', function (req, res) {
    if (req.isAuthenticated()) {
        res.render("Finance/CCS/Order-New");
    }
    else {
        res.render("login");
    }
});

app.get('/CCS/Assistan', function (req, res) {
    if (req.isAuthenticated()) {
        get_dept(req.user, function (result) {
            if (req.user.toLowerCase() == 'tathi' || req.user.toLowerCase() == 'phphan2' || result[0].Position == 'Assistan') res.render("Finance/CCS/Assistan");
            else res.send('Bạn không có quyền vào trang web này!');
        });
    }
    else {
        res.render("login");
    }
});

app.get('/CCS/HeadDepartment', function (req, res) {
    if (req.isAuthenticated()) {
        get_dept(req.user, function (result) {
            if (req.user.toLowerCase() == 'tathi' || req.user.toLowerCase() == 'phphan2' || result[0].Position == 'Manager' || req.user == 'mutran' || req.user == 'ltdang') res.render("Finance/CCS/HeadDepartment");
            else res.send('Bạn không có quyền vào trang web này!');
        });
    }
    else {
        res.render("login");
    }
});

app.get('/CCS/PlantManager', function (req, res) {
    if (req.isAuthenticated()) {
        get_dept(req.user, function (result) {
            if (req.user.toLowerCase() == 'tathi' || req.user.toLowerCase() == 'phphan2' || result[0].Position == 'Plant Manager' || req.user == 'mutran'|| req.user.toLowerCase() == 'vinguy10') res.render("Finance/CCS/SubPlant");
            else res.send('Bạn không có quyền vào trang web này!');
        });
    }
    else {
        res.render("login");
    }
});

app.get('/CCS/OperationDirector', function (req, res) {
    if (req.isAuthenticated()) {
        get_dept(req.user, function (result) {
            if (req.user.toLowerCase() == 'tathi' || req.user.toLowerCase() == 'phphan2' || result[0].Position == 'Operation Director' || req.user == 'mutran'|| req.user.toLowerCase() == 'vinguy10') res.render("Finance/CCS/PlantMng");
            else res.send('Bạn không có quyền vào trang web này!');
        });
    }
    else {
        res.render("login");
    }
});

app.get('/CCS/IND/Manager', function (req, res) {
    if (req.isAuthenticated()) {
        get_dept(req.user, function (result) {
            if (req.user.toLowerCase() == 'tathi' || req.user.toLowerCase() == 'nhtran2' || result[0].Position == 'INDManager' || req.user == 'mutran') res.render("Finance/CCS/IndustrialMng");
            else res.send('Bạn không có quyền vào trang web này!');
        });
    }
    else {
        res.render("login");
    }
});

app.get('/CCS/OperationDirector/NoPlantManager', function (req, res) {
    if (req.isAuthenticated()) {
        get_dept(req.user, function (result) {
            if (req.user.toLowerCase() == 'tathi' || req.user.toLowerCase() == 'phphan2' || result[0].Position == 'Operation Manager | Plant Manager' || req.user == 'mutran') res.render("Finance/CCS/NoPlantMng");
            else res.send('Bạn không có quyền vào trang web này!');
        });
    }
    else {
        res.render("login");
    }
});

// app.get('/CCS/OperationManager', function(req, res){
//     if (req.isAuthenticated()) {
//         get_dept(req.user, function(result){
//             if (req.user.toLowerCase()=='ltdang' || req.user.toLowerCase()=='tale' || req.user.toLowerCase()=='mutran'|| req.user.toLowerCase()=='tathi'||req.user.toLowerCase()=='phphan2'||result[0].Position=='Operation Manager') res.render("Finance/CCS/OperationMng");
//             else res.send('Bạn không có quyền vào trang web này!');
//         });
//     }
//     else {
//         res.render("login");
//     }
// });
app.get('/CCS/OperationManager', function (req, res) {
    // if (req.isAuthenticated()) {
    //     get_dept(req.user, function (result) {
    //         if (req.user.toLowerCase() == 'ltdang' || req.user.toLowerCase() == 'tale' || req.user.toLowerCase() == 'mutran' || req.user.toLowerCase() == 'tathi' || req.user.toLowerCase() == 'qupham2' || req.user.toLowerCase() == 'phphan2' || result[0].Position == 'Operation Manager') {
    //             if (req.user.toLowerCase() == 'ltdang') res.render("Finance/CCS/OperationMng-Cutting");
    //             else res.render("Finance/CCS/OperationMng");
    //         }
    //         else { res.send('Bạn không có quyền vào trang web này!'); }
    //     });
    // }
    // else {
    //     res.render("login");
    // }
    if (req.isAuthenticated()) {
        get_dept(req.user, function (result) {
            if (req.user.toLowerCase() == 'mutran') {
                res.render("Finance/CCS/OperationMng");
            }
            else { res.send('Bạn không có quyền vào trang web này!'); }
        });
    }
    else {
        res.render("login");
    }
});


app.get('/CCS/SubFinance', function (req, res) {
    if (req.isAuthenticated()) {
        if (req.user.toLowerCase() == 'tathi' || req.user == 'mutran' || req.user.toLowerCase() == 'lapham'|| req.user.toLowerCase() == 'vinguy10') res.render("Finance/CCS/SubFinance");
        else res.send('Bạn không có quyền vào trang web này!');
    }
    else {
        res.render("login");
    }
});

app.get('/CCS/Finance', function (req, res) {
    if (req.isAuthenticated()) {
        // get_dept(req.user, function(result){
        if (req.user.toLowerCase() == 'tathi' || req.user.toLowerCase() == 'lapham' || req.user.toLowerCase() == 'phphan2' || req.user == 'mutran'|| req.user.toLowerCase() == 'vinguy10') res.render("Finance/CCS/Finance");
        else res.send('Bạn không có quyền vào trang web này!');
        // });
    }
    else {
        res.render("login");
    }
});

app.get('/CCS/Purchasing', function (req, res) {
    if (req.isAuthenticated()) {
        get_dept(req.user, function (result) {
            if (req.user.toLowerCase() == 'tathi' || req.user.toLowerCase() == 'phphan2' || result[0].Department == 'PUR' || req.user == 'mutran'|| req.user.toLowerCase() == 'vinguy10') res.render("Finance/CCS/Purchasing");
            else res.send('Bạn không có quyền vào trang web này!');
        });
        // res.render("Finance/CCS/Purchasing")
    }
    else {
        res.render("login");
    }
});

//=====================  Cost Control System =========================================
app.post('/CCS/Get_Budget_Info', function (req, res) {
    if (req.isAuthenticated()) {
        month = req.body.month;
        year = req.body.year;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "select * from erphtml.ccs_budget where month='" + month + "' and year='" + year + "' order by MONTH, PLANT, DEPT, COST_NATURE, ACCOUNT;";
            if (month == 0)
                sql = "select * from erphtml.ccs_budget where year='" + year + "';";
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send(result);
                res.end();
            });
        });
    }
    else {
        res.render("login");
    }
});

app.post('/CCS/Update_Budget_Info', function (req, res) {
    if (req.isAuthenticated()) {
        month = req.body.month;
        year = req.body.year;
        accountID = req.body.accountID;
        budget = req.body.budget;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_budget set Budget='" + budget + "' where ID='" + accountID + "';";
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send(result);
                res.end();
            });
        });
    }
    else {
        res.render("login");
    }
});

app.post('/CCS/Get_Currency', function (req, res) {
    if (req.isAuthenticated()) {
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "select * from ccs_currency_rate;";
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send(result);
                res.end();
            });
        });
    }
    else {
        res.render("login");
    }
});

app.post('/CCS/Get_Unit', function (req, res) {
    if (req.isAuthenticated()) {
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "select UoM, NAME from setup_unit order by NAME;";
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send(result);
                res.end();
            });
        });
    }
    else {
        res.render("login");
    }
});

app.post('/CCS/Get_Category', function (req, res) {
    if (req.isAuthenticated()) {
        dept = req.body.dept;
        dept = get_right_dept(dept);
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "SELECT * FROM erphtml.ccs_pic ORDER BY PRIORITY1='" + dept + "' DESC, PRIORITY2='" + dept + "' DESC, PRIORITY3='" + dept + "' DESC, PRIORITY4='" + dept + "' DESC, PRIORITY5='" + dept + "' DESC;";
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send(result);
                res.end();
            });
        });
    }
    else {
        res.render("login");
    }
});

app.post('/CCS/Get_Purchaser_Email', function (req, res) {
    if (req.isAuthenticated()) {
        dept = req.body.dept;
        dept = get_right_dept(dept);
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = ("SELECT Email FROM erpsystem.setup_user where User='" + req.user + "';");
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send(result);
                res.end();
            });
        });
    }
    else {
        res.render("login");
    }
});

app.post('/CCS/Purchase_reject_PO', function (req, res) {
    if (req.isAuthenticated()) {
        reason = req.body.reason;
        pr_id = req.body.pr_id
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = ("update erphtml.ccs_request_item_temp set Req_Status='Reject', PR_Note='" + reason + "', PR_TimeUpdate=NOW(), PR_User='" + req.user + "'  where RequestID='" + pr_id + "';");
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send('done');
                res.end();
            });
        });
    }
    else {
        res.render("login");
    }
});

app.post('/CCS/Get_Request_Item_Temp', function (req, res) {
    if (req.isAuthenticated()) {
        requestID = req.body.requestID;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = ("SELECT t.*, u.NAME UnitName, v.Name VendorName FROM erphtml.ccs_request_item_temp t "
                + " LEFT JOIN erphtml.setup_unit u ON t.Unit=u.UoM "
                + " LEFT JOIN erphtml.setup_vendor v ON t.Vendor=v.ID "
                + " where requestID='" + requestID + "';")
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send(result);
                res.end();
            });
        });
    }
});

app.post('/CCS/Add_Request_Item_Temp', function (req, res) {
    if (req.isAuthenticated()) {
        var item = JSON.parse(req.body.item);
        var requestID = req.body.requestID;
        var ID = requestID + ';' + item.name;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '').substring(0, 10);
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = ("replace into ccs_request_item_temp (ID, requestID, Project, Item, Specification, Origin, Unit, Quantity, Estimated, Purchaser, Notice, TimeUpdate, User) "
                + "values ('" + ID + "', '" + requestID + "', '" + item.project + "', '" + item.name + "', '" + item.spec + "', '" + item.origin + "', '" + item.unit + "', '" + item.quantity + "', '" + item.estimate + "', '" + item.purchaser + "', '" + item.notice + "', NOW(), '" + req.user + "');");
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send('done');
                res.end();
            });
        });
    } else {
        res.render('')
    }
});

app.post('/CCS/Send_Request_PR', function (req, res) {
    try{
        if (req.isAuthenticated()) {
            var requestID = req.body.requestID;
            var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
            var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
            var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
            con3.getConnection(function (err, connection) {
                if (err) {
                    throw err;
                }
                sql = ("update ccs_request_item_temp set Req_status='Request', Req_TimeUpdate='" + timeUpdate + "' where RequestID='" + requestID + "';")
                connection.query(sql, function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    res.send('done');
                    res.end();
                });
            });
        } else {
            res.render('')
        }
    }catch(err)
    {
        res.render('')
    }

});


app.post('/CCS/Add_new_PO', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        projectName = req.body.projectName;
        accountName = req.body.accountName;
        month_estimate = req.body.month_estimate;
        year_estimate = req.body.year_estimate;
        purchaser = req.body.purchaser;
        purchaser = req.body.purchaser;
        category = req.body.category;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = ("replace into ccs_order_list (ID, Month_Estimated, Year_Estimated, ProjectName, AccountName, Purchaser, Category, TimeUpdate, User) "
                + " values ('" + PO_ID + "', '" + month_estimate + "', '" + year_estimate + "', '" + projectName + "', '" + accountName + "', '" + purchaser + "', '" + category + "', NOW(), '" + req.user + "');");
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send('done');
                res.end();
            });
        });
    }
    else {
        res.render("login");
    }
});

app.post('/CCS/Add_new_PR', function (req, res) {
    if (req.isAuthenticated()) {
        PR_ID = req.body.PR_ID;
        category = req.body.category;
        project = req.body.project;
        month = req.body.month;
        year = req.body.year;
        notice = req.body.notice;
        pic = req.body.pic;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = ("replace into ccs_order_list (REQUEST, CATEGORY, PIC, PROJECT, MONTH, YEAR, TimeUpdate, User) "
                + " values ('" + PR_ID + "', '" + category + "', '" + pic + "', '" + project + "', '" + month + "', '" + year + "', NOW(), '" + req.user + "');")
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send('done');
                res.end();
            });
        });
    }
    else {
        res.render("login");
    }
});

app.post('/CCS/Load_created_PO', function (req, res) {
    if (req.isAuthenticated()) {
        month = req.body.month;
        year = req.body.year;
        console.log('month',month,'year',year)
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            // sql="select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL from erphtml.ccs_order_list l "
            // +" left join erphtml.ccs_order_item i on l.ID=i.OrderID "
            // +" where (i.DeptResult is NULL or i.DeptResult!='N') and (i.PlantMngResult is NULL or i.PlantMngResult!='N') and (i.FinanceResult is NULL or i.FinanceResult!='N') and month(l.TimeUpdate)='"+month+"' and year(l.TimeUpdate)='"+year+"' and l.User='"+req.user+"';"
            // sql = ("select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, Currency from erphtml.ccs_order_list l "
            //     + " left join erphtml.ccs_order_item i on l.ID=i.OrderID "
            //     + " where Month_Estimated='" + month + "' and Year_Estimated='" + year + "' and l.User='" + req.user + "' group by l.ID;");
            
            // if (month == 0) {
            //     sql = ("select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, Currency from erphtml.ccs_order_list l "
            //         + " left join erphtml.ccs_order_item i on l.ID=i.OrderID "
            //         + " where Year_Estimated='" + year + "' and l.User='" + req.user + "' group by l.ID;");
            // }

            sql=`
            select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL,
            SUM(i.Quantity*i.USD) TOTAL_USD, Currency from erphtml.ccs_order_list l  
            left join 
            (SELECT ID,OrderID,Quantity,ActualPrice,USD,CurreNcy,SUBSTRING_INDEX(ID,';',-1) ITEM
            FROM erphtml.ccs_order_item  
            WHERE USER ='${req.user}') i 
            on l.ID=i.OrderID 
            LEFT JOIN erphtml.ccs_leadtime_item t ON t.OrderID=i.OrderID AND t.ItemID=i.ITEM
            WHERE 
            (
            (Month_Estimated='${month}' and Year_Estimated='${year}')
            OR
            (Month_M1='${month}' and Year_M1='${year}' AND Quanity_M1>0)
            OR
            (Month_M2='${month}' and Year_M2='${year}' AND Quanity_M2>0)
            OR
            (Month_M3='${month}' and Year_M3='${year}' AND Quanity_M3>0)
            )
            and l.User='${req.user}' group by l.ID order by Year_Estimated,Month_Estimated,ID;
            `

            console.log(sql)
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send(result);
                res.end();
            });
        });
    }
    else {
        res.render("login");
    }
});

function get_right_dept(dept) {
    right_dept = '';
    switch (dept) {
        case 'F&M':
            right_dept = 'FM';
            break;
        case 'IECT':
            right_dept = 'CUT_IE';
            break;
        case 'CT':
            right_dept = 'CUT_Opr';
            break;
        default:
            right_dept = dept;
    }
    return right_dept;
}

app.post('/CCS/Load_created_PO_Assistan', function (req, res) {
    if (req.isAuthenticated()) {
        month = req.body.month;
        year = req.body.year;
        get_dept(req.user, function (result) {
            dept = get_right_dept(result[0].Department).substring(0, 3);
            con3.getConnection(function (err, connection) {
                if (err) {
                    throw err;
                }
                if (req.user == 'phphan1' || req.user == 'tathi')
                    sql = ("select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l "
                        + " left join erphtml.ccs_order_item i on l.ID=i.OrderID where (l.ID like 'MEC%' or l.ID like 'PAD%') and Status='PO' group by l.ID;");
                else
                    sql = ("select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l "
                        + " left join erphtml.ccs_order_item i on l.ID=i.OrderID where l.ID like '" + dept + "%' and Status='PO' group by l.ID;");
                // if (month=='ALL')
                // sql="select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l "
                // +" left join erphtml.ccs_order_item i on l.ID=i.OrderID where Year_Estimated='"+year+"' and l.ID like '"+dept+"%' and Status='PO' group by l.ID;"
                connection.query(sql, function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    res.send(result);
                    res.end();
                });
            });
        });
    }
    else {
        res.render("login");
    }
});

app.post('/CCS/Load_created_PO_Dept', function (req, res) {
    if (req.isAuthenticated()) {
        month = req.body.month;
        year = req.body.year;
        get_dept(req.user, function (result) {
            dept = get_right_dept(result[0].Department).substring(0, 3);
            con3.getConnection(function (err, connection) {
                if (err) {
                    throw err;
                }
                if (req.user == 'trtam')
                    sql = "select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l "
                        + " left join erphtml.ccs_order_item i on l.ID=i.OrderID where (l.ID like 'LP%' or l.ID like 'LOG%') and (Status='PO' or Status='Assistan') and (i.AssistanResult is NULL or i.AssistanResult!='N') and (l.Assistan_Result is NULL or l.Assistan_Result!='N') and (l.HeadDept_Result is NULL or l.HeadDept_Result!='N') and (i.DeptResult is NULL or i.DeptResult!='N') group by l.ID;"
                else if (req.user == 'hoang.binh')
                    sql = "select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l "
                        + " left join erphtml.ccs_order_item i on l.ID=i.OrderID where (l.ID like 'MEC%' or l.ID like 'PAD%') and (Status='PO' or Status='Assistan') and (i.AssistanResult is NULL or i.AssistanResult!='N') and (l.Assistan_Result is NULL or l.Assistan_Result!='N') and (l.HeadDept_Result is NULL or l.HeadDept_Result!='N') and (i.DeptResult is NULL or i.DeptResult!='N') group by l.ID;"
                // else if (req.user=='phphan1') 
                // sql="select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l "
                // +" left join erphtml.ccs_order_item i on l.ID=i.OrderID where (l.ID like 'MEC%' or l.ID like 'PAD%') and (Status='PO' or Status='Assistan') and (i.AssistanResult is NULL or i.AssistanResult!='N') and (l.Assistan_Result is NULL or l.Assistan_Result!='N') and (l.HeadDept_Result is NULL or l.HeadDept_Result!='N') and (i.DeptResult is NULL or i.DeptResult!='N') group by l.ID;"
                else if (req.user == 'ltdang')
                    sql = "select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l "
                        + " left join erphtml.ccs_order_item i on l.ID=i.OrderID where (l.ID like 'CUT_IE%') and (Status='PO' or Status='Assistan') and (i.AssistanResult is NULL or i.AssistanResult!='N') and (l.Assistan_Result is NULL or l.Assistan_Result!='N') and (l.HeadDept_Result is NULL or l.HeadDept_Result!='N') and (i.DeptResult is NULL or i.DeptResult!='N') group by l.ID;"
                else if (req.user == 'qule')
                    sql = "select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l "
                            + " left join erphtml.ccs_order_item i on l.ID=i.OrderID where (l.ID like 'IE%' or  l.ID like 'PL%') and (l.Assistan_Result is NULL or l.Assistan_Result!='N') and (l.HeadDept_Result is NULL or l.HeadDept_Result!='N') and (Status='PO' or Status='Assistan') and (i.AssistanResult is NULL or i.AssistanResult!='N') and (i.DeptResult is NULL or i.DeptResult!='N') group by l.ID;"
                else
                    sql = "select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l "
                        + " left join erphtml.ccs_order_item i on l.ID=i.OrderID where l.ID like '" + dept + "%' and (l.Assistan_Result is NULL or l.Assistan_Result!='N') and (l.HeadDept_Result is NULL or l.HeadDept_Result!='N') and (Status='PO' or Status='Assistan') and (i.AssistanResult is NULL or i.AssistanResult!='N') and (i.DeptResult is NULL or i.DeptResult!='N') group by l.ID;"
                connection.query(sql, function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    res.send(result);
                    res.end();
                });
            });
        });
    }
    else {
        res.render("login");
    }
});

app.post('/CCS/Load_created_PO_SubFinance', function (req, res) {
    if (req.isAuthenticated()) {
        month = req.body.month;
        year = req.body.year;
        dept = req.body.dept;
        dept = get_right_dept(dept);
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l "
                + " left join erphtml.ccs_order_item i on l.ID=i.OrderID where (i.DeptResult is null or i.DeptResult='Y') and (i.AssistanResult='Y' or i.AssistanResult is NULL) and l.SubFinance_User is NULL and (Status='Dept' and HeadDept_Result='Y' AND l.Year_Estimated>=YEAR(CURDATE())) group by l.ID;"// or (Status='PlantMng' and PlantMng_Result='Y') or (Status='OperationMng' and OperationMng_Result='Y')

            // if (month==0) sql="select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l "
            // +" left join erphtml.ccs_order_item i on l.ID=i.OrderID where Year_Estimated='"+year+"' and (i.DeptResult is null or i.DeptResult='Y') and (i.AssistanResult='Y' or i.AssistanResult is NULL) and (i.FinanceResult='Y' or i.FinanceResult is NULL) and (Status='Dept' and HeadDept_Result='Y') group by l.ID;"// or (Status='PlantMng' and PlantMng_Result='Y') or (Status='OperationMng' and OperationMng_Result='Y')
            sql="SELECT k.* FROM"
            +" (SELECT l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency"
            +" FROM erphtml.ccs_order_list l"
            +" LEFT JOIN erphtml.ccs_order_item i ON l.ID=i.OrderID"
            +" WHERE (i.DeptResult IS NULL OR i.DeptResult='Y')"
            +" AND (i.AssistanResult='Y' OR i.AssistanResult IS NULL) AND (i.FinanceResult='Y' OR i.FinanceResult IS NULL) AND (STATUS='Dept' AND HeadDept_Result='Y')"
            +" GROUP BY l.ID) k WHERE k.TOTAL>'0' AND k.Urgent!='Y'"
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send(result);
                res.end();
            });
        });
    }
    else {
        res.render("login");
    }
});
app.post('/CCS/Load_created_PO_Finance', function (req, res) {
    if (req.isAuthenticated()) {
        month = req.body.month;
        year = req.body.year;
        dept = req.body.dept;
        dept = get_right_dept(dept);
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            // sql = "select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l "
            //     + " left join erphtml.ccs_order_item i on l.ID=i.OrderID where (i.DeptResult is null or i.DeptResult='Y') and (i.AssistanResult='Y' or i.AssistanResult is NULL) and (i.FinanceResult='Y' or i.FinanceResult is NULL)  and (Status='Dept' and HeadDept_Result='Y') group by l.ID;"//and l.SubFinance_User is not null

            // if (month==0) sql="select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l "
            // +" left join erphtml.ccs_order_item i on l.ID=i.OrderID where Year_Estimated='"+year+"' and (i.DeptResult is null or i.DeptResult='Y') and (i.AssistanResult='Y' or i.AssistanResult is NULL) and (i.FinanceResult='Y' or i.FinanceResult is NULL) and (Status='Dept' and HeadDept_Result='Y') group by l.ID;"// or (Status='PlantMng' and PlantMng_Result='Y') or (Status='OperationMng' and OperationMng_Result='Y')
            sql="SELECT k.* FROM"
            +" (SELECT l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency"
            +" FROM erphtml.ccs_order_list l"
            +" LEFT JOIN erphtml.ccs_order_item i ON l.ID=i.OrderID"
            +" WHERE (i.DeptResult IS NULL OR i.DeptResult='Y')"
            +" AND (i.AssistanResult='Y' OR i.AssistanResult IS NULL) AND (i.FinanceResult='Y' OR i.FinanceResult IS NULL) AND (STATUS='Dept' AND HeadDept_Result='Y')"
            +" GROUP BY l.ID) k WHERE k.TOTAL>'0' AND k.Urgent!='Y'"
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send(result);
                res.end();
            });
        });
    }
    else {
        res.render("login");
    }
});

app.post('/CCS/Load_created_PO_Operation', function (req, res) {
    if (req.isAuthenticated()) {
        month = req.body.month;
        year = req.body.year;
        dept = req.body.dept;
        dept = get_right_dept(dept);
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            if (req.user == 'ltdang') {
                sql = "select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency, b.PLANT "
                    + " from erphtml.ccs_order_list l "
                    + " left join erphtml.ccs_order_item i on l.ID=i.OrderID "
                    + " inner join (select * from erphtml.ccs_budget group by CODE) b on l.AccountName=b.CODE "
                    + " where b.PLANT='IEC' and Status='Finance' and Finance_Result='Y' and (i.DeptResult is null or i.DeptResult!='N')  and (i.FinanceResult is null or i.FinanceResult!='N') group by l.ID;"
            } else if (req.user == 'tale') {
                // sql="select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l "
                // +" left join erphtml.ccs_order_item i on l.ID=i.OrderID where l.ID not like 'CUT%' and Status='Finance' and Finance_Result='Y' and (i.DeptResult is null or i.DeptResult!='N')  and (i.FinanceResult is null or i.FinanceResult!='N') group by l.ID;"
                sql = "select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency, b.PLANT "
                    + " from erphtml.ccs_order_list l "
                    + " left join erphtml.ccs_order_item i on l.ID=i.OrderID "
                    + " inner join (select * from erphtml.ccs_budget group by CODE) b on l.AccountName=b.CODE "
                    + " where b.PLANT='PBC' and Status='Finance' and Finance_Result='Y' and (i.DeptResult is null or i.DeptResult!='N')  and (i.FinanceResult is null or i.FinanceResult!='N') group by l.ID;"
            }
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send(result);
                res.end();
            });
        });
    }
    else {
        res.render("login");
    }
});

app.post('/CCS/Load_created_PO_SubPlant', function (req, res) {
    if (req.isAuthenticated()) {
        month = req.body.month;
        year = req.body.year;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "select * from (select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l "
                + " left join erphtml.ccs_order_item i on l.ID=i.OrderID where (Status='OperationMng' or Status='Finance') and HeadDept_Result='Y' and OperationMng_Result='Y' and Finance_Result='Y' and (i.DeptResult is null or i.DeptResult!='N') and (i.FinanceResult is null or i.FinanceResult!='N')  group by l.ID) t1"
                + " where (TOTAL_USD>=1000) OR ((OverBudget='Y' OR Urgent='Y') AND TOTAL_USD <3000 AND TOTAL_USD>=1000) OR ((OverBudget='Y' OR Urgent='Y') AND TOTAL_USD >3000);"

            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send(result);
                res.end();
            });
        });
    }
    else {
        res.render("login");
    }
});

app.post('/CCS/Load_created_PO_Plant', function (req, res) {
    if (req.isAuthenticated()) {
        month = req.body.month;
        year = req.body.year;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            // sql = "select * from (select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l "
            //     + " left join erphtml.ccs_order_item i on l.ID=i.OrderID where (Status='SubPlant' or Status='Finance') and HeadDept_Result='Y' and OperationMng_Result='Y' and Finance_Result='Y' and SubPlant_Result='Y' and (i.DeptResult is null or i.DeptResult!='N') and (i.FinanceResult is null or i.FinanceResult!='N')  group by l.ID) t1"
            //     + " where TOTAL_USD>=3000 or ((OverBudget='Y' OR Urgent='Y') AND TOTAL_USD >=3000);"
            sql = "select * from (select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l "
                + " left join erphtml.ccs_order_item i on l.ID=i.OrderID where (Status='SubPlant' or Status='Finance') and HeadDept_Result='Y'and Finance_Result='Y' and SubPlant_Result='Y' and (i.DeptResult is null or i.DeptResult!='N') and (i.FinanceResult is null or i.FinanceResult!='N')  group by l.ID) t1"
                + " where TOTAL_USD>=3000 or ((OverBudget='Y' OR Urgent='Y') AND TOTAL_USD >=3000);"

            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send(result);
                res.end();
            });
        });
    }
    else {
        res.render("login");
    }
});

app.post('/CCS/Load_created_PO_Purchasing', function (req, res) {
    if (req.isAuthenticated()) {
        month = req.body.month;
        year = req.body.year;
        purchaser = req.body.purchaser;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            // sql="select s.Name, s.Email, t1.* from ( "
            // +"select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l "
            // +" left join erphtml.ccs_order_item i on l.ID=i.OrderID where Month_Estimated='"+month+"' and Year_Estimated='"+year+"' and (Status='OperationMng' or Status='PlantMng' or Status='SubPlant') and (i.DeptResult is null or i.DeptResult!='N') and (i.SubPlantResult is null or i.SubPlantResult!='N') and (i.PlantMngResult is null or i.PlantMngResult!='N') and (i.FinanceResult is null or i.FinanceResult!='N') and HeadDept_Result='Y' and Finance_Result='Y' and OperationMng_Result='Y' group by l.ID "
            // +") t1 left join erpsystem.setup_user s on t1.User=s.User"
            // if (month==0) 
            //     sql="select s.Name, s.Email, t1.* from ( "
            //     +" select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l "
            //     +" left join erphtml.ccs_order_item i on l.ID=i.OrderID where Year_Estimated='"+year+"' and (Status='OperationMng' or Status='SubPlant' or Status='PlantMng') and (i.DeptResult is null or i.DeptResult!='N') and (i.PlantMngResult is null or i.PlantMngResult!='N') and (i.SubPlantResult is null or i.SubPlantResult!='N') and (i.FinanceResult is null or i.FinanceResult!='N') and HeadDept_Result='Y' and Finance_Result='Y' and OperationMng_Result='Y' group by l.ID"
            //     +") t1 left join erpsystem.setup_user s on t1.User=s.User;"


            // sql="select s.Name, s.Email, t1.* "
            //     +"from ( "
            //     +"    select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency "
            //     +"    from erphtml.ccs_order_list l "
            //     +"    left join erphtml.ccs_order_item i on l.ID=i.OrderID "
            //     +"    where Month_Estimated='"+month+"' and Year_Estimated='"+year+"' and (Status='OperationMng' or Status='SubPlant' or Status='PlantMng') "
            //     +"    and (i.DeptResult is null or i.DeptResult!='N') and (i.PlantMngResult is null or i.PlantMngResult!='N') "
            //     +"    and (i.SubPlantResult is null or i.SubPlantResult!='N') and (i.FinanceResult is null or i.FinanceResult!='N') "
            //     +"    and HeadDept_Result='Y' and Finance_Result='Y' and OperationMng_Result='Y' group by l.ID"
            //     +") t1 left join erpsystem.setup_user s on t1.User=s.User WHERE (PlantMng_Result='Y' AND TOTAL_USD>=3000) OR (TOTAL_USD>=1000 AND TOTAL_USD<3000 AND SubPlant_Result='Y'AND (PlantMng_Result is null or PlantMng_Result!='N')) OR (TOTAL_USD<1000 AND (SubPlant_Result!='N' OR SubPlant_Result IS NULL) AND (PlantMng_Result is null or PlantMng_Result!='N'))"
            // sql = ("select s.Name, s.Email, t1.*"
            //     + " from (select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency"
            //     + " from erphtml.ccs_order_list l"
            //     + " left join erphtml.ccs_order_item i on l.ID=i.OrderID"
            //     + " where Month_Estimated='" + month + "' and Year_Estimated='" + year + "' and (Status='OperationMng' or Status='SubPlant' or Status='PlantMng')"
            //     + " and (i.DeptResult is null or i.DeptResult!='N') and (i.PlantMngResult is null or i.PlantMngResult!='N')"
            //     + " and (i.SubPlantResult is null or i.SubPlantResult!='N') and (i.FinanceResult is null or i.FinanceResult!='N')"
            //     + " and HeadDept_Result='Y' and Finance_Result='Y' and OperationMng_Result='Y' group by l.ID) t1"
            //     + " left join erpsystem.setup_user s on t1.User=s.User"
            //     + " WHERE (TOTAL_USD<1000 AND OperationMng_Result='Y' AND (OverBudget!='Y' OR Urgent!='Y') AND (SubPlant_Result!='N' OR SubPlant_Result IS NULL) AND (PlantMng_Result is null or PlantMng_Result!='N'))"
            //     + " OR"
            //     + " (TOTAL_USD<1000 AND SubPlant_Result='Y' AND (OverBudget='Y' OR Urgent='Y'))"
            //     + " OR"
            //     + " (TOTAL_USD>=1000 AND TOTAL_USD<3000 AND SubPlant_Result='Y'AND (PlantMng_Result is null or PlantMng_Result!='N'))"
            //     + " OR"
            //     + " (TOTAL_USD>=1000 AND TOTAL_USD<3000 AND SubPlant_Result='Y'AND (PlantMng_Result is null or PlantMng_Result!='N') AND ((OverBudget='Y' OR Urgent='Y')))"
            //     + " OR"
            //     + " (TOTAL_USD>=3000 AND PlantMng_Result='Y')"
            //     + " OR"
            //     + " (TOTAL_USD>=3000 AND PlantMng_Result='Y' AND (OverBudget='Y' OR Urgent='Y'))")
            sql=("select s.Name, s.Email, t1.* from (select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL,"
                +" SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency"
                +" from erphtml.ccs_order_list l"
                +" left join erphtml.ccs_order_item i on l.ID=i.OrderID"
                +" where Month_Estimated='"+month+"' and Year_Estimated='"+year+"'"
                +" and (Status='SubPlant' or Status='PlantMng' or Status='Finance'or Status='OperationMng')"
                +" and (i.DeptResult is null or i.DeptResult!='N')"
                +" and (i.PlantMngResult is null or i.PlantMngResult!='N')"
                +" and (i.SubPlantResult is null or i.SubPlantResult!='N')"
                +" and (i.FinanceResult is null or i.FinanceResult!='N')"
                +" and HeadDept_Result='Y' group by l.ID) t1"
                +" left join erpsystem.setup_user s on t1.User=s.User"
                +" WHERE ((OverBudget!='Y' OR Urgent!='Y') AND (Finance_Result!='N' OR Finance_Result IS NULL) AND (SubFinance_Result!='N' OR SubFinance_Result IS NULL) AND (SubPlant_Result!='N' OR SubPlant_Result IS NULL) AND (PlantMng_Result is null or PlantMng_Result!='N'))"
                +" OR (Urgent='Y' AND (SubPlant_Result!='N' OR SubPlant_Result IS NULL) AND (PlantMng_Result is null or PlantMng_Result!='N'))"
                +" OR (OverBudget='Y' AND (Finance_Result!='N' OR Finance_Result IS NULL) AND (SubFinance_Result!='N' OR SubFinance_Result IS NULL) AND (SubPlant_Result!='N' OR SubPlant_Result IS NULL) AND (PlantMng_Result is null or PlantMng_Result!='N'))")
            if (month == 0)
                // sql="select s.Name, s.Email, t1.* "
                //     +"from ( "
                //     +"    select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency "
                //     +"    from erphtml.ccs_order_list l "
                //     +"    left join erphtml.ccs_order_item i on l.ID=i.OrderID "
                //     +"    where Year_Estimated='"+year+"' and (Status='OperationMng' or Status='SubPlant' or Status='PlantMng') "
                //     +"    and (i.DeptResult is null or i.DeptResult!='N') and (i.PlantMngResult is null or i.PlantMngResult!='N') "
                //     +"    and (i.SubPlantResult is null or i.SubPlantResult!='N') and (i.FinanceResult is null or i.FinanceResult!='N') "
                //     +"    and HeadDept_Result='Y' and Finance_Result='Y' and OperationMng_Result='Y' group by l.ID"
                //     +") t1 left join erpsystem.setup_user s on t1.User=s.User WHERE (PlantMng_Result='Y' AND TOTAL_USD>=3000) OR (TOTAL_USD>=1000 AND TOTAL_USD<3000 AND SubPlant_Result='Y'AND (PlantMng_Result is null or PlantMng_Result!='N')) OR (TOTAL_USD<1000 AND (SubPlant_Result!='N' OR SubPlant_Result IS NULL) AND (PlantMng_Result is null or PlantMng_Result!='N'))"

                // sql = ("select s.Name, s.Email, t1.*"
                //     + " from (select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency"
                //     + " from erphtml.ccs_order_list l"
                //     + " left join erphtml.ccs_order_item i on l.ID=i.OrderID"
                //     + " where Year_Estimated='" + year + "' and (Status='OperationMng' or Status='SubPlant' or Status='PlantMng')"
                //     + " and (i.DeptResult is null or i.DeptResult!='N') and (i.PlantMngResult is null or i.PlantMngResult!='N')"
                //     + " and (i.SubPlantResult is null or i.SubPlantResult!='N') and (i.FinanceResult is null or i.FinanceResult!='N')"
                //     + " and HeadDept_Result='Y' and Finance_Result='Y' and OperationMng_Result='Y' group by l.ID) t1"
                //     + " left join erpsystem.setup_user s on t1.User=s.User"
                //     + " WHERE (TOTAL_USD<1000 AND OperationMng_Result='Y' AND (OverBudget!='Y' OR Urgent!='Y') AND (SubPlant_Result!='N' OR SubPlant_Result IS NULL) AND (PlantMng_Result is null or PlantMng_Result!='N'))"
                //     + " OR"
                //     + " (TOTAL_USD<1000 AND SubPlant_Result='Y' AND (OverBudget='Y' OR Urgent='Y'))"
                //     + " OR"
                //     + " (TOTAL_USD>=1000 AND TOTAL_USD<3000 AND SubPlant_Result='Y'AND (PlantMng_Result is null or PlantMng_Result!='N'))"
                //     + " OR"
                //     + " (TOTAL_USD>=1000 AND TOTAL_USD<3000 AND SubPlant_Result='Y'AND (PlantMng_Result is null or PlantMng_Result!='N') AND ((OverBudget='Y' OR Urgent='Y')))"
                //     + " OR"
                //     + " (TOTAL_USD>=3000 AND PlantMng_Result='Y')"
                //     + " OR"
                //     + " (TOTAL_USD>=3000 AND PlantMng_Result='Y' AND (OverBudget='Y' OR Urgent='Y'))")

                sql=("select s.Name, s.Email, t1.* from (select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL,"
                +" SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency"
                +" from erphtml.ccs_order_list l"
                +" left join erphtml.ccs_order_item i on l.ID=i.OrderID"
                +" where Year_Estimated='" + year + "'"
                +" and (Status='SubPlant' or Status='PlantMng' or Status='Finance' or Status='OperationMng')"
                +" and (i.DeptResult is null or i.DeptResult!='N')"
                +" and (i.PlantMngResult is null or i.PlantMngResult!='N')"
                +" and (i.SubPlantResult is null or i.SubPlantResult!='N')"
                +" and (i.FinanceResult is null or i.FinanceResult!='N')"
                +" and HeadDept_Result='Y' group by l.ID) t1"
                +" left join erpsystem.setup_user s on t1.User=s.User"
                +" WHERE ((OverBudget!='Y' OR Urgent!='Y') AND (Finance_Result!='N' OR Finance_Result IS NULL) AND (SubFinance_Result!='N' OR SubFinance_Result IS NULL) AND (SubPlant_Result!='N' OR SubPlant_Result IS NULL) AND (PlantMng_Result is null or PlantMng_Result!='N'))"
                +" OR (Urgent='Y' AND (SubPlant_Result!='N' OR SubPlant_Result IS NULL) AND (PlantMng_Result is null or PlantMng_Result!='N'))"
                +" OR (OverBudget='Y' AND (Finance_Result!='N' OR Finance_Result IS NULL) AND (SubFinance_Result!='N' OR SubFinance_Result IS NULL) AND (SubPlant_Result!='N' OR SubPlant_Result IS NULL) AND (PlantMng_Result is null or PlantMng_Result!='N'))")
            console.log(sql);
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send(result);
                res.end();
            });
        });
    }
    else {
        res.render("login");
    }

});
// app.post('/CCS/Load_created_PO_Purchasing', function (req, res) {
//     if (req.isAuthenticated()) {
//         month = req.body.month;
//         year = req.body.year;
//         purchaser = req.body.purchaser;
//         con3.getConnection(function (err, connection) {
//             if (err) {
//                 throw err;
//             }
//             // sql="select s.Name, s.Email, t1.* from ( "
//             // +"select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l "
//             // +" left join erphtml.ccs_order_item i on l.ID=i.OrderID where Month_Estimated='"+month+"' and Year_Estimated='"+year+"' and (Status='OperationMng' or Status='PlantMng' or Status='SubPlant') and (i.DeptResult is null or i.DeptResult!='N') and (i.SubPlantResult is null or i.SubPlantResult!='N') and (i.PlantMngResult is null or i.PlantMngResult!='N') and (i.FinanceResult is null or i.FinanceResult!='N') and HeadDept_Result='Y' and Finance_Result='Y' and OperationMng_Result='Y' group by l.ID "
//             // +") t1 left join erpsystem.setup_user s on t1.User=s.User"
//             // if (month==0) 
//             //     sql="select s.Name, s.Email, t1.* from ( "
//             //     +" select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l "
//             //     +" left join erphtml.ccs_order_item i on l.ID=i.OrderID where Year_Estimated='"+year+"' and (Status='OperationMng' or Status='SubPlant' or Status='PlantMng') and (i.DeptResult is null or i.DeptResult!='N') and (i.PlantMngResult is null or i.PlantMngResult!='N') and (i.SubPlantResult is null or i.SubPlantResult!='N') and (i.FinanceResult is null or i.FinanceResult!='N') and HeadDept_Result='Y' and Finance_Result='Y' and OperationMng_Result='Y' group by l.ID"
//             //     +") t1 left join erpsystem.setup_user s on t1.User=s.User;"


//             // sql="select s.Name, s.Email, t1.* "
//             //     +"from ( "
//             //     +"    select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency "
//             //     +"    from erphtml.ccs_order_list l "
//             //     +"    left join erphtml.ccs_order_item i on l.ID=i.OrderID "
//             //     +"    where Month_Estimated='"+month+"' and Year_Estimated='"+year+"' and (Status='OperationMng' or Status='SubPlant' or Status='PlantMng') "
//             //     +"    and (i.DeptResult is null or i.DeptResult!='N') and (i.PlantMngResult is null or i.PlantMngResult!='N') "
//             //     +"    and (i.SubPlantResult is null or i.SubPlantResult!='N') and (i.FinanceResult is null or i.FinanceResult!='N') "
//             //     +"    and HeadDept_Result='Y' and Finance_Result='Y' and OperationMng_Result='Y' group by l.ID"
//             //     +") t1 left join erpsystem.setup_user s on t1.User=s.User WHERE (PlantMng_Result='Y' AND TOTAL_USD>=3000) OR (TOTAL_USD>=1000 AND TOTAL_USD<3000 AND SubPlant_Result='Y'AND (PlantMng_Result is null or PlantMng_Result!='N')) OR (TOTAL_USD<1000 AND (SubPlant_Result!='N' OR SubPlant_Result IS NULL) AND (PlantMng_Result is null or PlantMng_Result!='N'))"
//             sql = ("select s.Name, s.Email, t1.*"
//                 + " from (select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency"
//                 + " from erphtml.ccs_order_list l"
//                 + " left join erphtml.ccs_order_item i on l.ID=i.OrderID"
//                 + " where Month_Estimated='" + month + "' and Year_Estimated='" + year + "' and (Status='OperationMng' or Status='SubPlant' or Status='PlantMng')"
//                 + " and (i.DeptResult is null or i.DeptResult!='N') and (i.PlantMngResult is null or i.PlantMngResult!='N')"
//                 + " and (i.SubPlantResult is null or i.SubPlantResult!='N') and (i.FinanceResult is null or i.FinanceResult!='N')"
//                 + " and HeadDept_Result='Y' and Finance_Result='Y' and OperationMng_Result='Y' group by l.ID) t1"
//                 + " left join erpsystem.setup_user s on t1.User=s.User"
//                 + " WHERE (TOTAL_USD<1000 AND OperationMng_Result='Y' AND (OverBudget!='Y' OR Urgent!='Y') AND (SubPlant_Result!='N' OR SubPlant_Result IS NULL) AND (PlantMng_Result is null or PlantMng_Result!='N'))"
//                 + " OR"
//                 + " (TOTAL_USD<1000 AND SubPlant_Result='Y' AND (OverBudget='Y' OR Urgent='Y'))"
//                 + " OR"
//                 + " (TOTAL_USD>=1000 AND TOTAL_USD<3000 AND SubPlant_Result='Y'AND (PlantMng_Result is null or PlantMng_Result!='N'))"
//                 + " OR"
//                 + " (TOTAL_USD>=1000 AND TOTAL_USD<3000 AND SubPlant_Result='Y'AND (PlantMng_Result is null or PlantMng_Result!='N') AND ((OverBudget='Y' OR Urgent='Y')))"
//                 + " OR"
//                 + " (TOTAL_USD>=3000 AND PlantMng_Result='Y')"
//                 + " OR"
//                 + " (TOTAL_USD>=3000 AND PlantMng_Result='Y' AND (OverBudget='Y' OR Urgent='Y'))")
//             if (month == 0)
//                 // sql="select s.Name, s.Email, t1.* "
//                 //     +"from ( "
//                 //     +"    select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency "
//                 //     +"    from erphtml.ccs_order_list l "
//                 //     +"    left join erphtml.ccs_order_item i on l.ID=i.OrderID "
//                 //     +"    where Year_Estimated='"+year+"' and (Status='OperationMng' or Status='SubPlant' or Status='PlantMng') "
//                 //     +"    and (i.DeptResult is null or i.DeptResult!='N') and (i.PlantMngResult is null or i.PlantMngResult!='N') "
//                 //     +"    and (i.SubPlantResult is null or i.SubPlantResult!='N') and (i.FinanceResult is null or i.FinanceResult!='N') "
//                 //     +"    and HeadDept_Result='Y' and Finance_Result='Y' and OperationMng_Result='Y' group by l.ID"
//                 //     +") t1 left join erpsystem.setup_user s on t1.User=s.User WHERE (PlantMng_Result='Y' AND TOTAL_USD>=3000) OR (TOTAL_USD>=1000 AND TOTAL_USD<3000 AND SubPlant_Result='Y'AND (PlantMng_Result is null or PlantMng_Result!='N')) OR (TOTAL_USD<1000 AND (SubPlant_Result!='N' OR SubPlant_Result IS NULL) AND (PlantMng_Result is null or PlantMng_Result!='N'))"

//                 sql = ("select s.Name, s.Email, t1.*"
//                     + " from (select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency"
//                     + " from erphtml.ccs_order_list l"
//                     + " left join erphtml.ccs_order_item i on l.ID=i.OrderID"
//                     + " where Year_Estimated='" + year + "' and (Status='OperationMng' or Status='SubPlant' or Status='PlantMng')"
//                     + " and (i.DeptResult is null or i.DeptResult!='N') and (i.PlantMngResult is null or i.PlantMngResult!='N')"
//                     + " and (i.SubPlantResult is null or i.SubPlantResult!='N') and (i.FinanceResult is null or i.FinanceResult!='N')"
//                     + " and HeadDept_Result='Y' and Finance_Result='Y' and OperationMng_Result='Y' group by l.ID) t1"
//                     + " left join erpsystem.setup_user s on t1.User=s.User"
//                     + " WHERE (TOTAL_USD<1000 AND OperationMng_Result='Y' AND (OverBudget!='Y' OR Urgent!='Y') AND (SubPlant_Result!='N' OR SubPlant_Result IS NULL) AND (PlantMng_Result is null or PlantMng_Result!='N'))"
//                     + " OR"
//                     + " (TOTAL_USD<1000 AND SubPlant_Result='Y' AND (OverBudget='Y' OR Urgent='Y'))"
//                     + " OR"
//                     + " (TOTAL_USD>=1000 AND TOTAL_USD<3000 AND SubPlant_Result='Y'AND (PlantMng_Result is null or PlantMng_Result!='N'))"
//                     + " OR"
//                     + " (TOTAL_USD>=1000 AND TOTAL_USD<3000 AND SubPlant_Result='Y'AND (PlantMng_Result is null or PlantMng_Result!='N') AND ((OverBudget='Y' OR Urgent='Y')))"
//                     + " OR"
//                     + " (TOTAL_USD>=3000 AND PlantMng_Result='Y')"
//                     + " OR"
//                     + " (TOTAL_USD>=3000 AND PlantMng_Result='Y' AND (OverBudget='Y' OR Urgent='Y'))")

//             connection.query(sql, function (err, result, fields) {
//                 connection.release();
//                 if (err) throw err;
//                 res.send(result);
//                 res.end();
//             });
//         });
//     }
//     else {
//         res.render("login");
//     }

// });

app.post('/CCS/User_approve_PO', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_order_list set PO_Approve=NOW(), Status='PO' where ID='" + PO_ID + "';";
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

app.post('/CCS/User_delete_PO', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "delete from erphtml.ccs_order_list where ID='" + PO_ID + "';";
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                sql = "delete from erphtml.ccs_order_item where OrderID='" + PO_ID + "';";
                connection.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    sql = "delete from erphtml.ccs_leadtime_item where OrderID='" + PO_ID + "';"; // leadtime
                    connection.query(sql, function (err, result, fields) {
                        connection.release();
                        if (err) throw err;
                        res.send('done');
                        res.end();
                    });
                });
            });
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/User_approve_PO_Urgent', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        result = req.body.result;
        reason = req.body.reason;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_order_list set Urgent='" + result + "', Urgent_Note='" + reason + "' where ID='" + PO_ID + "';";
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

app.post('/CCS/User_approve_PO_OverBudget', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        result = req.body.result;
        reason = req.body.reason;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_order_list set OverBudget='" + result + "', OverBudget_Note='" + reason + "' where ID='" + PO_ID + "';";
            console.log(sql)
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

app.post('/CCS/User_approve_PO_Over3000', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        result = req.body.result;
        reason = req.body.reason;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_order_list set Over3000='" + result + "', Over3000_Note='" + reason + "' where ID='" + PO_ID + "';";
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

app.post('/CCS/Assistan_approve_PO', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        result = req.body.result;
        reason = req.body.reason;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_order_list set Assistan_Approve=NOW(), Status='Assistan', Assistan_Result='" + result + "', Assistan_User='" + req.user + "', Assistan_Reason='" + reason + "' where ID='" + PO_ID + "';";
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

app.post('/CCS/Assistan_approve_PO_detail', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        item = req.body.item;
        result = req.body.result;
        reason = req.body.reason;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_order_item set AssistanApprove=NOW(), AssistanResult='" + result + "', AssistanUser='" + req.user + "', AssistanReason='" + reason + "' where OrderID='" + PO_ID + "' and RequestID like '%" + item + "';";
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

app.post('/CCS/HeadDept_approve_PO_2', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        result = req.body.result;
        reason = req.body.reason;
        urgent = req.body.urgent;
        overbudget = req.body.overbudget;
        over3000 = req.body.over3000;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_order_list set HeadDept_Approve=NOW(), Status='Dept', HeadDept_Result='" + result + "', HeadDept_User='" + req.user + "', HeadDept_Reason='" + reason + "' where ID='" + PO_ID + "';";
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                if (urgent == 'Y' || overbudget == 'Y' || over3000 == 'Y') {
                    send_plant_manager(PO_ID)
                }
                res.send('done');
                res.end();
            });
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/HeadDept_approve_PO', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        result = req.body.result;
        reason = req.body.reason;
        urgent = req.body.urgent;
        overbudget = req.body.overbudget;
        over3000 = req.body.over3000;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            var dept="IND";
            if (PO_ID.includes(dept)){
                sql = ("update erphtml.ccs_order_list"
                +" set HeadDept_Approve=NOW(), HeadDept_Result='" + result + "', HeadDept_User='" + req.user + "', HeadDept_Reason='" + reason + "',"
                +" Finance_Approve=NOW(), Finance_Result='" + result + "', Finance_User='" + req.user + "',"
                +" OperationMng_Approve=NOW(),  OperationMng_Result='" + result + "', OperationMng_User='" + req.user + "',"
                +" SubPlant_Approve=NOW(),SubPlant_Result='" + result + "', SubPlant_User='" + req.user + "',"
                +" PlantMng_Approve=NOW(),Status='PlantMng', PlantMng_Result='" + result + "', PlantMng_User='" + req.user + "'"
                +" where ID='" + PO_ID + "';");
            }
            else{
            sql = "update erphtml.ccs_order_list set HeadDept_Approve=NOW(), Status='Dept', HeadDept_Result='" + result + "', HeadDept_User='" + req.user + "', HeadDept_Reason='" + reason + "' where ID='" + PO_ID + "';";
            }
            console.log(sql);
           
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                if (urgent == 'Y' || overbudget == 'Y' || over3000 == 'Y') {
                    send_plant_manager(PO_ID)
                }
                res.send('done');
                res.end();
            });
        });
    } else {
        res.render("login");
    }
});


function send_plant_manager(PO_ID) {
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        auth: {
            user: "PBAssistant@hanes.com",
            pass: "xLkUmsMZkbPaLAwcWSgMGhwWMTYk67"
        }
    });
    var mailOptions = {
        from: "PBAssistant@hanes.com",
        to: 'Loan.Dang@hanes.com',//"Phan.Tuan@hanes.com",
        subject: "Duyệt đơn hàng trên CCS",
        text: "",
        html: "Dear chị Loan"
            + "<div>Đơn hàng " + PO_ID + " đã được Giám đốc bộ phận duyệt và đang ở trạng thái chờ Giám đốc nhà máy duyệt. "
            + "<div>Vùi lòng truy cập vào <a href='http://pbvweb01v/CCS/PlantManager'>ĐÂY</a> để duyệt đơn hàng trên."
            + "<div>Thanks,<div>"
            + "<div>PB Assistant<div>"
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

app.post('/CCS/HeadDept_approve_PO_detail_2', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        item = req.body.item;
        result = req.body.result;
        reason = req.body.reason;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_order_item set DeptApprove=NOW(), DeptResult='" + result + "', DeptUser='" + req.user + "', DeptReason='" + reason + "' where OrderID='" + PO_ID + "' and RequestID like '%" + item + "';";
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

app.post('/CCS/HeadDept_approve_PO_detail', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        item = req.body.item;
        result = req.body.result;
        reason = req.body.reason;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            var dept="IND";
            if (PO_ID.includes(dept)){
                sql = ("update erphtml.ccs_order_item"
                +" set DeptApprove=NOW(), DeptResult='" + result + "', DeptUser='" + req.user + "', DeptReason='" + reason + "',"
                +" FinanceApprove=NOW(), FinanceResult='" + result + "', FinanceUser='" + req.user + "', FinanceReason='" + reason + "',"
                +" OperationMngApprove=NOW(), OperationMngResult='" + result + "', OperationMngUser='" + req.user + "', OperationMngReason='" + reason + "',"
                +" SubPlantApprove=NOW(), SubPlantResult='" + result + "', SubPlantUser='" + req.user + "', SubPlantReason='" + reason + "',"
                +" PlantMngApprove=NOW(), PlantMngResult='" + result + "', PlantMngUser='" + req.user + "', PlantMngReason='" + reason + "'"
                +" where OrderID='" + PO_ID + "' and RequestID like '%" + item + "';");
            }
            else{
                sql = "update erphtml.ccs_order_item set DeptApprove=NOW(), DeptResult='" + result + "', DeptUser='" + req.user + "', DeptReason='" + reason + "' where OrderID='" + PO_ID + "' and RequestID like '%" + item + "';";
            }
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

app.post('/CCS/Finance_approve_PO_detail', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        item = req.body.item;
        result = req.body.result;
        reason = req.body.reason;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_order_item set FinanceApprove=NOW(), FinanceResult='" + result + "', FinanceUser='" + req.user + "', FinanceReason='" + reason + "' where OrderID='" + PO_ID + "' and RequestID like '%" + item + "';";
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

app.post('/CCS/OperationMng_approve_PO_detail', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        item = req.body.item;
        result = req.body.result;
        reason = req.body.reason;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_order_item set OperationMngApprove=NOW(), OperationMngResult='" + result + "', OperationMngUser='" + req.user + "', OperationMngReason='" + reason + "' where OrderID='" + PO_ID + "' and RequestID like '%" + item + "';";
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

app.post('/CCS/SubPlantMng_approve_PO_detail', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        item = req.body.item;
        result = req.body.result;
        reason = req.body.reason;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_order_item set SubPlantApprove=NOW(), SubPlantResult='" + result + "', SubPlantUser='" + req.user + "', SubPlantReason='" + reason + "' where OrderID='" + PO_ID + "' and RequestID like '%" + item + "';";
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

app.post('/CCS/PlantMng_approve_PO_detail', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        item = req.body.item;
        result = req.body.result;
        reason = req.body.reason;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_order_item set PlantMngApprove=NOW(), PlantMngResult='" + result + "', PlantMngUser='" + req.user + "', PlantMngReason='" + reason + "' where OrderID='" + PO_ID + "' and RequestID like '%" + item + "';";
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

app.post('/CCS/Finance_approve_PO', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        result = req.body.result;
        reason = req.body.reason;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_order_list set Finance_Approve=NOW(), Status='Finance', Finance_Result='" + result + "', Finance_User='" + req.user + "', Finance_Reason='" + reason + "' where ID='" + PO_ID + "';";
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

app.post('/CCS/SubFinance_approve_PO', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        result = req.body.result;
        reason = req.body.reason;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            if (result == 'N') sql = "update erphtml.ccs_order_list set Finance_Approve=NOW(), Finance_Result='" + result + "', Finance_User='" + req.user + "', Finance_Reason='" + reason + "' where ID='" + PO_ID + "';";
            else sql = "update erphtml.ccs_order_list set SubFinance_Approve=NOW(), SubFinance_User='" + req.user + "' where ID='" + PO_ID + "';";
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

app.post('/CCS/OperationMng_approve_PO', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        result = req.body.result;
        reason = req.body.reason;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_order_list set OperationMng_Approve=NOW(), Status='OperationMng', OperationMng_Result='" + result + "', OperationMng_User='" + req.user + "', OperationMng_Reason='" + reason + "' where ID='" + PO_ID + "';";
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

// app.post('/CCS/OperationMng_approve_PO', function(req, res){

//     if (req.isAuthenticated()){
//         PO_ID=req.body.PO_ID;
//         result=req.body.result;
//         reason=req.body.reason;
//         con3.getConnection(function(err, connection){
//             if (err) {
//                 throw err;
//             }
//             sql_check=("SELECT * FROM erphtml.ccs_order_list l WHERE l.User='liphan' AND l.ID='"+PO_ID+"';")
//             console.log(sql_check)
//             connection.query(sql_check, function (err, result, fields) {
//                 if (err) throw err;
//                 if (result.length>0){
//                     //Cutting liphan & ltdang
//                     sql="update erphtml.ccs_order_list set HeadDept_Approve=NOW(),HeadDept_Result='"+result+"', HeadDept_User='"+req.user+"', HeadDept_Reason='"+reason+"',OperationMng_Approve=NOW(), Status='OperationMng', OperationMng_Result='"+result+"', OperationMng_User='"+req.user+"', OperationMng_Reason='"+reason+"' where ID='"+PO_ID+"';";
//                     connection.query(sql, function (err, result, fields) {
//                         if (err) throw err;
//                         connection.release();
//                         res.send('done');
//                         res.end();
//                     });
//                 }
//                 else{
//                     //Normal
//                     sql="update erphtml.ccs_order_list set OperationMng_Approve=NOW(), Status='OperationMng', OperationMng_Result='"+result+"', OperationMng_User='"+req.user+"', OperationMng_Reason='"+reason+"' where ID='"+PO_ID+"';";
//                     console.log(sql)
//                     connection.query(sql, function (err, result, fields) {
//                         if (err) throw err;
//                         connection.release();
//                         res.send('done');
//                         res.end();
//                     });
//                 }
//             });
//         });
//     } else {
//         res.render("login");
//     }
// });

app.post('/CCS/SubPlantMng_approve_PO', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        result = req.body.result;
        reason = req.body.reason;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_order_list set SubPlant_Approve=NOW(), Status='SubPlant', SubPlant_Result='" + result + "', SubPlant_User='" + req.user + "', SubPlant_Reason='" + reason + "' where ID='" + PO_ID + "';";
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

app.post('/CCS/PlantMng_approve_PO', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        result = req.body.result;
        reason = req.body.reason;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_order_list set PlantMng_Approve=NOW(), Status='PlantMng', PlantMng_Result='" + result + "', PlantMng_User='" + req.user + "', PlantMng_Reason='" + reason + "' where ID='" + PO_ID + "';";
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

app.post('/CCS/OverBudget_approve_PO', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        result = req.body.result;
        reason = req.body.reason;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_order_list set OverBudget_Approve=NOW(), OverBudget='" + result + "', OverBudget_Result='" + result + "', OverBudget_User='" + req.user + "', OverBudget_Reason='" + reason + "' where ID='" + PO_ID + "';";
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

app.post('/CCS/Urgent_approve_PO', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        result = req.body.result;
        reason = req.body.reason;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_order_list set Urgent_Approve=NOW(), Urgent='" + result + "', Urgent_Result='" + result + "', Urgent_User='" + req.user + "', Urgent_Reason='" + reason + "' where ID='" + PO_ID + "';";
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

app.post('/CCS/Purchasing_approve_PO', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        result = req.body.result;
        reason = req.body.reason;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_order_list set Purchasing_Approve=NOW(), Status='Purchasing', Purchasing_Result='" + result + "', Purchasing_User='" + req.user + "', Purchasing_Reason='" + reason + "' where ID='" + PO_ID + "';";
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

app.post('/CCS/Receiving_PO', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        result = req.body.result;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_order_list set Receiving=NOW(), Status='Received', Receiving_User='" + req.user + "' where ID='" + PO_ID + "';";
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

app.post('/CCS/Update_Request_PR', function (req, res) {
    if (req.isAuthenticated()) {
        requestID = req.body.requestID;
        item = req.body.item;
        vietnamese = req.body.vietnamese;
        english = req.body.english;
        PR_ID = req.body.PR_ID;
        currency = req.body.currency;
        expireddate = req.body.expireddate;
        lawson = req.body.lawson;
        leadtime = req.body.leadtime;
        price = req.body.price;
        vendor = req.body.vendor;
        usd = req.body.usd;
        unit = req.body.unit;
        ID_key = requestID + ';' + item;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update ccs_request_item_temp set Req_status='Quotation', PR_TimeUpdate='"
                + timeUpdate + "', Unit='" + unit + "', PR_User='" + req.user + "', PR_ID='" + PR_ID + "', Vietnamese='" + vietnamese + "', English='" + english + "', Price='" + price + "', Currency='"
                + currency + "', USD='" + usd + "', Vendor='" + vendor + "', Leadtime='" + leadtime + "', ExpiredDate='" + expireddate
                + "' where ID='" + ID_key + "';"
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

app.post('/CCS/Get_Item_Quotation', function (req, res) {
    if (req.isAuthenticated()) {
        requestID = req.body.requestID;
        item = req.body.item;
        dept = req.body.dept;
        dept = get_right_dept(dept);
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "SELECT * FROM ccs_request_item_temp WHERE (Item LIKE '%" + item + "%' or Vietnamese like '%" + item + "%' or English like '%" + item + "%' OR RequestID LIKE '%" + item + "%') AND Price IS NOT NULL AND ExpiredDate>NOW() GROUP BY ID limit 0, 100;";
            console.log(sql)
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

app.post('/CCS/Get_Vendors', function (req, res) {
    if (req.isAuthenticated()) {
        vendor = req.body.vendor;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "SELECT * FROM erphtml.setup_vendor where ID like '%" + vendor + "%' or Name like '%" + vendor + "%' or Email like '%" + vendor + "%' group by ID;";
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

app.post('/CCS/Get_Next_Level_Submit', function (req, res) {
    if (req.isAuthenticated()) {
        get_dept(req.user, function (user_infor) {
            con3.getConnection(function (err, connection) {
                if (err) {
                    throw err;
                }
                sql = "SELECT * FROM "
                    + " (SELECT t1.ID, t1.Dept, t1.Position, t1.Supervisor, e.Name, e.User, e.Email, t1.STT from "
                    + " (SELECT c.ID, c.Dept, c.Position, c.Supervisor, '1' as STT  "
                    + " FROM erphtml.employee_organize_chart c   "
                    + " WHERE c.ID='" + user_infor[0].IDName + "' "
                    + " UNION  "
                    + " SELECT c1.ID, c1.Dept, c1.Position, c1.Supervisor, '2' as STT   "
                    + " FROM erphtml.employee_organize_chart c LEFT JOIN erphtml.employee_organize_chart c1  "
                    + " ON c.Supervisor=c1.ID  "
                    + " WHERE c.ID='" + user_infor[0].IDName + "' "
                    + " UNION  "
                    + " SELECT c3.ID, c3.Dept, c3.Position, c3.Supervisor, '3' as STT  FROM  "
                    + " (SELECT c1.Supervisor  "
                    + " FROM erphtml.employee_organize_chart c LEFT JOIN erphtml.employee_organize_chart c1  "
                    + " ON c.Supervisor=c1.ID  "
                    + " WHERE c.ID='" + user_infor[0].IDName + "') c2 LEFT JOIN erphtml.employee_organize_chart c3  "
                    + " ON c2.Supervisor=c3.ID "
                    + " UNION  "
                    + " SELECT c5.ID, c5.Dept, c5.Position, c5.Supervisor, '4' as STT  FROM  "
                    + " (SELECT c3.Supervisor FROM  "
                    + " (SELECT c1.Supervisor  "
                    + " FROM erphtml.employee_organize_chart c LEFT JOIN erphtml.employee_organize_chart c1  "
                    + " ON c.Supervisor=c1.ID  "
                    + " WHERE c.ID='" + user_infor[0].IDName + "') c2 LEFT JOIN erphtml.employee_organize_chart c3  "
                    + " ON c2.Supervisor=c3.ID) c4 LEFT JOIN erphtml.employee_organize_chart c5  "
                    + " ON c4.Supervisor=c5.ID "
                    + " UNION  "
                    + " SELECT c7.ID, c7.Dept, c7.Position, c7.Supervisor, '5' as STT  FROM  "
                    + " (SELECT c5.Supervisor FROM  "
                    + " (SELECT c3.Supervisor FROM  "
                    + " (SELECT c1.Supervisor  "
                    + " FROM erphtml.employee_organize_chart c LEFT JOIN erphtml.employee_organize_chart c1  "
                    + " ON c.Supervisor=c1.ID  "
                    + " WHERE c.ID='" + user_infor[0].IDName + "') c2 LEFT JOIN erphtml.employee_organize_chart c3  "
                    + " ON c2.Supervisor=c3.ID) c4 LEFT JOIN erphtml.employee_organize_chart c5  "
                    + " ON c4.Supervisor=c5.ID) c6 "
                    + " LEFT JOIN erphtml.employee_organize_chart c7 on c6.Supervisor=c7.ID) t1 LEFT JOIN erpsystem.setup_user e ON t1.ID=e.IDName "
                    + " ) t2 GROUP BY ID order by STT";
                if (req.user == "andoan1" || req.user == "gidoan" || req.user == "medo"|| req.user == "qunguy13")
                    sql = "SELECT * FROM "
                        + " (SELECT t1.ID, t1.Dept, t1.Position, t1.Supervisor, e.Name, e.User, e.Email, t1.STT from "
                        + " (SELECT c.ID, c.Dept, c.Position, c.Supervisor, '1' as STT  "
                        + " FROM erphtml.employee_organize_chart c   "
                        + " WHERE c.ID='" + user_infor[0].IDName + "' "
                        + " UNION  "
                        + " SELECT c1.ID, c1.Dept, c1.Position, c1.Supervisor, '2' as STT   "
                        + " FROM erphtml.employee_organize_chart c LEFT JOIN erphtml.employee_organize_chart c1  "
                        + " ON c.Supervisor=c1.ID  "
                        + " WHERE c.ID='" + user_infor[0].IDName + "' "
                        + " UNION  "
                        + " SELECT c3.ID, c3.Dept, c3.Position, c3.Supervisor, '3' as STT  FROM  "
                        + " (SELECT c1.Supervisor  "
                        + " FROM erphtml.employee_organize_chart c LEFT JOIN erphtml.employee_organize_chart c1  "
                        + " ON c.Supervisor=c1.ID  "
                        + " WHERE c.ID='" + user_infor[0].IDName + "') c2 LEFT JOIN erphtml.employee_organize_chart c3  "
                        + " ON c2.Supervisor=c3.ID "
                        + " UNION  "
                        + " SELECT c5.ID, c5.Dept, c5.Position, c5.Supervisor, '4' as STT  FROM  "
                        + " (SELECT c3.Supervisor FROM  "
                        + " (SELECT c1.Supervisor  "
                        + " FROM erphtml.employee_organize_chart c LEFT JOIN erphtml.employee_organize_chart c1  "
                        + " ON c.Supervisor=c1.ID  "
                        + " WHERE c.ID='" + user_infor[0].IDName + "') c2 LEFT JOIN erphtml.employee_organize_chart c3  "
                        + " ON c2.Supervisor=c3.ID) c4 LEFT JOIN erphtml.employee_organize_chart c5  "
                        + " ON c4.Supervisor=c5.ID "
                        + " UNION  "
                        + " SELECT c7.ID, c7.Dept, c7.Position, c7.Supervisor, '5' as STT  FROM  "
                        + " (SELECT c5.Supervisor FROM  "
                        + " (SELECT c3.Supervisor FROM  "
                        + " (SELECT c1.Supervisor  "
                        + " FROM erphtml.employee_organize_chart c LEFT JOIN erphtml.employee_organize_chart c1  "
                        + " ON c.Supervisor=c1.ID  "
                        + " WHERE c.ID='" + user_infor[0].IDName + "') c2 LEFT JOIN erphtml.employee_organize_chart c3  "
                        + " ON c2.Supervisor=c3.ID) c4 LEFT JOIN erphtml.employee_organize_chart c5  "
                        + " ON c4.Supervisor=c5.ID) c6 "
                        + " LEFT JOIN erphtml.employee_organize_chart c7 on c6.Supervisor=c7.ID) t1 LEFT JOIN erpsystem.setup_user e ON t1.Supervisor=e.IDName "
                        + " ) t2 GROUP BY ID order by STT";
                if (req.user == "anguyen" || req.user == "doton" || req.user == "mabach")
                    sql = "SELECT * FROM "
                        + " (SELECT t1.ID, t1.Dept, t1.Position, t1.Supervisor, e.Name, e.User, e.Email, t1.STT from "
                        + " (SELECT c.ID, c.Dept, c.Position, c.Supervisor, '1' as STT  "
                        + " FROM erphtml.employee_organize_chart c   "
                        + " WHERE c.ID='" + user_infor[0].IDName + "' "
                        + " UNION  "
                        + " SELECT c1.ID, c1.Dept, c1.Position, c1.Supervisor, '2' as STT   "
                        + " FROM erphtml.employee_organize_chart c LEFT JOIN erphtml.employee_organize_chart c1  "
                        + " ON c.Supervisor=c1.ID  "
                        + " WHERE c.ID='" + user_infor[0].IDName + "' "
                        + " UNION  "
                        + " SELECT c3.ID, c3.Dept, c3.Position, c3.Supervisor, '3' as STT  FROM  "
                        + " (SELECT c1.Supervisor  "
                        + " FROM erphtml.employee_organize_chart c LEFT JOIN erphtml.employee_organize_chart c1  "
                        + " ON c.Supervisor=c1.ID  "
                        + " WHERE c.ID='" + user_infor[0].IDName + "') c2 LEFT JOIN erphtml.employee_organize_chart c3  "
                        + " ON c2.Supervisor=c3.ID "
                        + " UNION  "
                        + " SELECT c5.ID, c5.Dept, c5.Position, c5.Supervisor, '4' as STT  FROM  "
                        + " (SELECT c3.Supervisor FROM  "
                        + " (SELECT c1.Supervisor  "
                        + " FROM erphtml.employee_organize_chart c LEFT JOIN erphtml.employee_organize_chart c1  "
                        + " ON c.Supervisor=c1.ID  "
                        + " WHERE c.ID='" + user_infor[0].IDName + "') c2 LEFT JOIN erphtml.employee_organize_chart c3  "
                        + " ON c2.Supervisor=c3.ID) c4 LEFT JOIN erphtml.employee_organize_chart c5  "
                        + " ON c4.Supervisor=c5.ID "
                        + " UNION  "
                        + " SELECT c7.ID, c7.Dept, c7.Position, c7.Supervisor, '5' as STT  FROM  "
                        + " (SELECT c5.Supervisor FROM  "
                        + " (SELECT c3.Supervisor FROM  "
                        + " (SELECT c1.Supervisor  "
                        + " FROM erphtml.employee_organize_chart c LEFT JOIN erphtml.employee_organize_chart c1  "
                        + " ON c.Supervisor=c1.ID  "
                        + " WHERE c.ID='" + user_infor[0].IDName + "') c2 LEFT JOIN erphtml.employee_organize_chart c3  "
                        + " ON c2.Supervisor=c3.ID) c4 LEFT JOIN erphtml.employee_organize_chart c5  "
                        + " ON c4.Supervisor=c5.ID) c6 "
                        + " LEFT JOIN erphtml.employee_organize_chart c7 on c6.Supervisor=c7.ID "
                        + " UNION  "
                        + " SELECT IDName ID, Department Dept, POSITION, '' Supervisor, '6' AS STT FROM erpsystem.setup_user WHERE user='phphan1') t1 LEFT JOIN erpsystem.setup_user e ON t1.ID=e.IDName "
                        + " ) t2 GROUP BY ID order by STT";
                if (req.user == "uynguyen")
                    sql = "SELECT * FROM "
                        + " (SELECT t1.ID, t1.Dept, t1.Position, t1.Supervisor, e.Name, e.User, e.Email, t1.STT from "
                        + " (SELECT c.ID, c.Dept, c.Position, c.Supervisor, '1' as STT  "
                        + " FROM erphtml.employee_organize_chart c   "
                        + " WHERE c.ID='" + user_infor[0].IDName + "' "
                        + " UNION  "
                        + " SELECT c1.ID, c1.Dept, c1.Position, c1.Supervisor, '2' as STT   "
                        + " FROM erphtml.employee_organize_chart c LEFT JOIN erphtml.employee_organize_chart c1  "
                        + " ON c.Supervisor=c1.ID  "
                        + " WHERE c.ID='" + user_infor[0].IDName + "' "
                        + " UNION  "
                        + " SELECT c3.ID, c3.Dept, c3.Position, c3.Supervisor, '3' as STT  FROM  "
                        + " (SELECT c1.Supervisor  "
                        + " FROM erphtml.employee_organize_chart c LEFT JOIN erphtml.employee_organize_chart c1  "
                        + " ON c.Supervisor=c1.ID  "
                        + " WHERE c.ID='" + user_infor[0].IDName + "') c2 LEFT JOIN erphtml.employee_organize_chart c3  "
                        + " ON c2.Supervisor=c3.ID "
                        + " UNION  "
                        + " SELECT c5.ID, c5.Dept, c5.Position, c5.Supervisor, '4' as STT  FROM  "
                        + " (SELECT c3.Supervisor FROM  "
                        + " (SELECT c1.Supervisor  "
                        + " FROM erphtml.employee_organize_chart c LEFT JOIN erphtml.employee_organize_chart c1  "
                        + " ON c.Supervisor=c1.ID  "
                        + " WHERE c.ID='" + user_infor[0].IDName + "') c2 LEFT JOIN erphtml.employee_organize_chart c3  "
                        + " ON c2.Supervisor=c3.ID) c4 LEFT JOIN erphtml.employee_organize_chart c5  "
                        + " ON c4.Supervisor=c5.ID "
                        + " UNION  "
                        + " SELECT c7.ID, c7.Dept, c7.Position, c7.Supervisor, '5' as STT  FROM  "
                        + " (SELECT c5.Supervisor FROM  "
                        + " (SELECT c3.Supervisor FROM  "
                        + " (SELECT c1.Supervisor  "
                        + " FROM erphtml.employee_organize_chart c LEFT JOIN erphtml.employee_organize_chart c1  "
                        + " ON c.Supervisor=c1.ID  "
                        + " WHERE c.ID='" + user_infor[0].IDName + "') c2 LEFT JOIN erphtml.employee_organize_chart c3  "
                        + " ON c2.Supervisor=c3.ID) c4 LEFT JOIN erphtml.employee_organize_chart c5  "
                        + " ON c4.Supervisor=c5.ID) c6 "
                        + " LEFT JOIN erphtml.employee_organize_chart c7 on c6.Supervisor=c7.ID "
                        + " UNION  "
                        + " SELECT IDName ID, Department Dept, POSITION, '' Supervisor, '6' AS STT FROM erpsystem.setup_user WHERE user='vule') t1 LEFT JOIN erpsystem.setup_user e ON t1.ID=e.IDName "
                        + " ) t2 GROUP BY ID order by STT";
                connection.query(sql, function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    res.send(result);
                    res.end();
                });
            });
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/Get_Request_PR', function (req, res) {
    if (req.isAuthenticated()) {
        month = req.body.month;
        year = req.body.year;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "SELECT t.*, b.Sup_Approve FROM (select RequestID, Project, Purchaser, Estimated, Req_status, COUNT(item) Items, Sup_User, Attached_File from ccs_request_item_temp where MONTH(Estimated)='" + month + "' and YEAR(Estimated)='" + year + "' and (User='" + req.user + "' or Sup_User='" + req.user + "') and Req_Status not in ('Cancel') group by RequestID) t LEFT JOIN (SELECT PR_ID, Sup_User Sup_Approve from ccs_bidding GROUP BY PR_ID) b ON t.RequestID=b.PR_ID;";
            if (month == 0) sql = "SELECT t.*, b.Sup_Approve FROM (select RequestID, Project, Purchaser, Estimated, Req_status, COUNT(item) Items, Sup_User, Attached_File from ccs_request_item_temp where YEAR(Estimated)='" + year + "' and (User='" + req.user + "' or Sup_User='" + req.user + "') and Req_Status not in ('Cancel') group by RequestID) t LEFT JOIN (SELECT PR_ID, Sup_User Sup_Approve from ccs_bidding GROUP BY PR_ID) b ON t.RequestID=b.PR_ID;";
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

app.post('/CCS/Get_Attached_Vendor', function (req, res) {
    if (req.isAuthenticated()) {
        pr_id = req.body.pr_id;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "select distinct Attached_Image from erphtml.ccs_request_item_temp where RequestID='" + pr_id + "'";
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

app.post('/CCS/Get_Request_PR_Assistant', function (req, res) {
    if (req.isAuthenticated()) {
        month = req.body.month;
        year = req.body.year;

        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "";
            if (month == 0) {
                sql = "select RequestID, Project, Purchaser, Estimated, Req_status, COUNT(item) Items from ccs_request_item_temp where Sup_User='" + req.user + "' and Req_Status='Bidding' group by RequestID;";
            }
            else {
                sql = "select RequestID, Project, Purchaser, Estimated, Req_status, COUNT(item) Items from ccs_request_item_temp where Sup_User='" + req.user + "' and Req_Status='Bidding' group by RequestID;";
            }
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

app.post('/CCS/Get_Request_PR_Operation', function (req, res) {
    if (req.isAuthenticated()) {
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "";
            if (req.user == 'ltdang') {
                sql = "SELECT RequestID, Project, Purchaser, Estimated, Req_status, COUNT(Item) Items, SUM(Total_Price) Total_Price, Currency, ROUND(SUM(Total_USD),2) Total_USD, Sup_User FROM "
                    + " (SELECT i.RequestID, i.Project, i.Purchaser, i.Estimated, i.Req_status, i.Item, i.Quantity*b.Price Total_Price, b.Currency, i.Quantity*b.USD Total_USD, b.Sup_User   "
                    + " FROM "
                    + "     (SELECT * from ccs_request_item_temp "
                    + "     WHERE Req_Status='Bidding' AND (Sup_User='ltdang' or Sup_User='Dept_Pass' or Sup_User='Purchase_Pass')) i "
                    + "  inner JOIN "
                    + "     (SELECT * from ccs_bidding "
                    + " WHERE ((Sup_Result='Y' and 1000_Result='Y') or (Sup_User='ltdang')) and CHECKED='Y' AND Operation_Result IS NULL) b ON i.RequestID=b.PR_ID AND i.Item=b.ITEM) t1 where RequestID like 'CT%' or RequestID like 'CUT%' or RequestID like 'IECT%' GROUP BY RequestID";
            } else {
                sql = "SELECT RequestID, Project, Purchaser, Estimated, Req_status, COUNT(Item) Items, SUM(Total_Price) Total_Price, Currency, ROUND(SUM(Total_USD),2) Total_USD FROM "
                    + " (SELECT i.RequestID, i.Project, i.Purchaser, i.Estimated, i.Req_status, i.Item, i.Quantity*b.Price Total_Price, b.Currency, i.Quantity*b.USD Total_USD   "
                    + " FROM "
                    + "     (SELECT * from ccs_request_item_temp "
                    + "     WHERE Req_Status='Bidding' AND (Sup_User='Dept_Pass' or Sup_User='Purchase_Pass')) i "
                    + "  inner JOIN "
                    + "     (SELECT * from ccs_bidding "
                    + " WHERE Sup_Result='Y' and CHECKED='Y' and 1000_Result='Y' AND Operation_Result IS NULL) b ON i.RequestID=b.PR_ID AND i.Item=b.ITEM) t1 where RequestID not like 'CT%' and RequestID not like 'CUT%'  and RequestID not like 'IECT%' GROUP BY RequestID";
            }
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

app.post('/CCS/Get_Request_PR_SubPlant', function (req, res) {
    if (req.isAuthenticated()) {
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            // sql="SELECT RequestID, Project, Purchaser, Estimated, Req_status, COUNT(Item) Items, SUM(Total_Price) Total_Price, Currency, ROUND(SUM(Total_USD),2) Total_USD FROM "
            //     +" (SELECT i.RequestID, i.Project, i.Purchaser, i.Estimated, i.Req_status, i.Item, i.Quantity*b.Price Total_Price, b.Currency, i.Quantity*b.USD Total_USD   "
            //     +" FROM "
            //     +"     (SELECT * from ccs_request_item_temp "
            //     +"     WHERE Req_Status='Bidding' AND (Sup_User='Dept_Pass' or Sup_User='Purchase_Pass' OR Sup_User='Operation_Pass')) i "
            //     +"  LEFT JOIN "
            //     +"     (SELECT * from ccs_bidding "
            //     +" WHERE Sup_Result='Y' and CHECKED='Y' and 1000_Result='Y' AND SubPlant_Result IS NULL) b ON i.RequestID=b.PR_ID AND i.Item=b.ITEM) t1 GROUP BY RequestID";
            sql = "SELECT * FROM (SELECT RequestID, Project, Purchaser, Estimated, Req_status, COUNT(Item) Items, SUM(Total_Price) Total_Price, Currency, ROUND(SUM(Total_USD),2) Total_USD FROM"
                + " (SELECT i.RequestID, i.Project, i.Purchaser, i.Estimated, i.Req_status, i.Item, i.Quantity*b.Price Total_Price, b.Currency, i.Quantity*b.USD Total_USD"
                + " FROM"
                + " (SELECT * from ccs_request_item_temp"
                + " WHERE Req_Status='Bidding' AND (Sup_User='Dept_Pass' or Sup_User='Purchase_Pass' or Sup_User='Plant_Pass' or Sup_User='Operation_Pass') AND Year(Estimated)>=YEAR(CURDATE())-1) i"
                + " LEFT JOIN"
                + " (SELECT * from ccs_bidding"
                + " WHERE Sup_Result='Y'  and 1000_Result='Y' and CHECKED='Y' AND SubPlant_Result IS NULL) b ON i.RequestID=b.PR_ID AND i.Item=b.ITEM) t1 GROUP BY RequestID) a WHERE a.Total_Price>=1000";
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

app.post('/CCS/Get_Request_PR_Plant', function (req, res) {
    if (req.isAuthenticated()) {
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "SELECT * FROM (SELECT RequestID, Project, Purchaser, Estimated, Req_status, COUNT(Item) Items, SUM(Total_Price) Total_Price, Currency, ROUND(SUM(Total_USD),2) Total_USD FROM "
                + " (SELECT i.RequestID, i.Project, i.Purchaser, i.Estimated, i.Req_status, i.Item, i.Quantity*b.Price Total_Price, b.Currency, i.Quantity*b.USD Total_USD   "
                + " FROM "
                + "     (SELECT * from ccs_request_item_temp "
                + "     WHERE Req_Status='Bidding' AND (Sup_User='Dept_Pass' or Sup_User='Purchase_Pass')) i "
                + "  LEFT JOIN "
                + "     (SELECT * from ccs_bidding "
                + " WHERE Sup_Result='Y' and 3000_Result='Y' and CHECKED='Y' AND Plant_Result IS NULL) b ON i.RequestID=b.PR_ID AND i.Item=b.ITEM) t1 GROUP BY RequestID) a WHERE a.Total_Price>=3000";
            connection.query(sql, function (err, result, fields) {
                // console.log(result)
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

app.post('/CCS/Get_Request_PR_Purchasing', function (req, res) {
    if (req.isAuthenticated()) {
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "SELECT RequestID, Project, Purchaser, Estimated, Req_status, COUNT(Item) Items, SUM(Total_Price) Total_Price, Currency, ROUND(SUM(Total_USD),2) Total_USD, Attached_File FROM "
                + " (SELECT i.RequestID, i.Project, i.Purchaser, i.Estimated, i.Req_status, i.Item, i.Quantity*b.Price Total_Price, b.Currency, i.Quantity*b.USD Total_USD, max(Attached_File) Attached_File   "
                + " FROM "
                + "     (SELECT * from ccs_request_item_temp "
                + "     WHERE Req_Status='Bidding' AND Sup_User='Operation_Pass') i "
                + "  LEFT JOIN "
                + "     (SELECT * from ccs_bidding "
                + " WHERE Sup_Result='Y' and Operation_Result='Y' and CHECKED='Y' AND Plant_Result IS NULL) b ON i.RequestID=b.PR_ID AND i.Item=b.ITEM) t1 GROUP BY RequestID";
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

app.post('/CCS/Get_PR_Received', function (req, res) {
    if (req.isAuthenticated()) {
        PR_ID = req.body.PR_ID;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "select i.OrderID, t.Project, l.Purchaser, t.Item, t.Vietnamese, u.Name, u.Department, i.PR_LINE, "
                + " i.LW_PO_NUMBER, i.LW_PO_LINE, i.LW_QTY, i.LW_REC_QTY, i.LW_CXL_QTY, "
                + " concat(l.Year_Estimated,'/',l.Month_Estimated) EXP_PR, concat(r.Expect_Year,'/',r.Expect_Month) EXP_MONTH, r.Expect_Qty, "
                + " r.TimeUpdate, i.Quantity from erphtml.ccs_order_item i "
                + " inner join erphtml.ccs_order_list l on i.OrderID=l.ID "
                + " inner join erphtml.ccs_request_item_temp t on i.RequestID=t.ID "
                + " inner join erpsystem.setup_user u on i.User=u.User "
                + " left join erphtml.ccs_receive_log r ON i.OrderID=r.PR_ID  AND t.Item=r.Item"
                + " where i.OrderID='" + PR_ID + "';";
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

app.post('/CCS/Delete_Request_PR', function (req, res) {
    if (req.isAuthenticated()) {
        requestID = req.body.requestID;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update ccs_request_item_temp set Req_Status='Cancel' where RequestID='" + requestID + "';"
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

app.post('/CCS/Remove_item', function (req, res) {
    if (req.isAuthenticated()) {
        item = req.body.item;
        pr = req.body.pr;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "delete from ccs_request_item_temp where ID='" + pr + ';' + item + "';"
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

app.post('/CCS/Delete_Request_Item_Temp', function (req, res) {
    if (req.isAuthenticated()) {
        requestID = req.body.requestID;
        item = req.body.item;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "delete from ccs_request_item_temp where ID='" + requestID + ';' + item + "';"
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

app.post('/CCS/Process_Request', function (req, res) {
    if (req.isAuthenticated()) {
        req_id = req.body.req_id;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = 'update erphtml.ccs_request_item_temp set Req_Status="Process", Req_TimeUpdate=NOW() where RequestID="' + req_id + '"'
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

app.post('/CCS/Get_Request_Summary', function (req, res) {
    if (req.isAuthenticated()) {
        month = req.body.month;
        year = req.body.year;
        purchaser = req.body.purchaser;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "select t1.*, u.Department, u.Name, u.Email, Sup_Result, 1000_Result Result_1000, Operation_Result, 3000_Result Result_3000, Plant_Result, 1000_Bidding Bidding_1000, 3000_Bidding Bidding_3000, Attached_File, u.Name Staff from "
                + " (select RequestID, Project, count(Item) Items, Req_Status, Estimated, User, Purchaser, max(Attached_File) Attached_File from ccs_request_item_temp where Req_Status!='None' and RequestID!='FI_CCS_20210101-000000' "
                + " and Req_Status!='Done' and MONTH(Estimated)='" + month + "' and YEAR(Estimated)='" + year + "' and Purchaser like '%" + purchaser + "%'  group by RequestID ) t1 left join erpsystem.setup_user u on t1.User=u.User "
                + " left join (select PR_ID, Sup_Result, 1000_Result, Operation_Result, 3000_Result, Plant_Result, 1000_Bidding, 3000_Bidding from erphtml.ccs_bidding group by PR_ID) t2 on t1.RequestID=t2.PR_ID order by u.Department, t1.RequestID, t1.Req_Status;";
            if (month == 0)
                sql = "select t1.*, u.Department, u.Name, u.Email, Sup_Result, 1000_Result Result_1000, Operation_Result, 3000_Result Result_3000, Plant_Result, 1000_Bidding Bidding_1000, 3000_Bidding Bidding_3000, Attached_File, u.Name Staff from "
                    + " (select RequestID, Project, count(Item) Items, Req_Status, Estimated, User, Purchaser, max(Attached_File) Attached_File from ccs_request_item_temp where Req_Status!='None' and RequestID!='FI_CCS_20210101-000000' "
                    + " and Req_Status!='Done' and YEAR(Estimated)='" + year + "' and Purchaser like '%" + purchaser + "%'  group by RequestID ) t1 left join erpsystem.setup_user u on t1.User=u.User "
                    + " left join (select PR_ID, Sup_Result, 1000_Result, Operation_Result, 3000_Result, Plant_Result, 1000_Bidding, 3000_Bidding from erphtml.ccs_bidding group by PR_ID) t2 on t1.RequestID=t2.PR_ID order by u.Department, t1.RequestID, t1.Req_Status;";
            if (req.user == 'trthuha') {
                sql = "select t1.*, u.Department, u.Name, u.Email, Sup_Result, 1000_Result Result_1000, Operation_Result, 3000_Result Result_3000, Plant_Result, 1000_Bidding Bidding_1000, 3000_Bidding Bidding_3000, Attached_File, u.Name Staff from "
                    + " (select RequestID, Project, count(Item) Items, Req_Status, Estimated, User, Purchaser, max(Attached_File) Attached_File from ccs_request_item_temp where Req_Status!='None' and RequestID!='FI_CCS_20210101-000000' "
                    + " and Req_Status='Bidding' group by RequestID ) t1 "
                    + " left join erpsystem.setup_user u on t1.User=u.User "
                    + " inner join (select PR_ID, Sup_Result, 1000_Result, Operation_Result, 3000_Result, Plant_Result, 1000_Bidding, 3000_Bidding from erphtml.ccs_bidding WHERE (3000_Bidding='Y' and 3000_Result is NULL) OR (1000_Bidding='Y' AND 1000_Result is null) group by PR_ID) t2 on t1.RequestID=t2.PR_ID;";
            } else if (req.user == 'quhoang') {
                sql = "select t1.*, u.Department, u.Name, u.Email, Sup_Result, 1000_Result Result_1000, Operation_Result, 3000_Result Result_3000, Plant_Result, 1000_Bidding Bidding_1000, 3000_Bidding Bidding_3000, Attached_File, u.Name Staff from "
                    + " (select RequestID, Project, count(Item) Items, Req_Status, Estimated, User, Purchaser, max(Attached_File) Attached_File from ccs_request_item_temp where Req_Status!='None' and RequestID!='FI_CCS_20210101-000000' "
                    + " and Req_Status='Bidding' group by RequestID ) t1 "
                    + " left join erpsystem.setup_user u on t1.User=u.User "
                    + " inner join (select PR_ID, Sup_Result, 1000_Result, Operation_Result, 3000_Result, Plant_Result, 1000_Bidding, 3000_Bidding from erphtml.ccs_bidding where 1000_Bidding='Y' and 1000_Result is null group by PR_ID) t2 on t1.RequestID=t2.PR_ID;";
            }
            // console.log(sql)
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

app.post('/CCS/Get_Vendor_Email', function (req, res) {
    if (req.isAuthenticated()) {
        vendor_email = req.body.vendor_email;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "select distinct Email, ID from erphtml.setup_vendor where Name like '%" + vendor_email + "%' or ID like '%" + vendor_email + "%' or Email like '%" + vendor_email + "%' limit 0, 10;";
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

app.post('/CCS/Add_Order_Item_Temp', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        PR_ID = req.body.PR_ID;
        IDkey = PO_ID + ';' + PR_ID;
        price = req.body.price;
        purchaser = req.body.purchaser;
        USD = req.body.USD;
        quantity = req.body.quantity;
        currency = req.body.currency
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "replace into ccs_order_item (ID, OrderID, RequestID, TimeUpdate, User, ActualPrice, Purchaser, USD, Currency, Quantity) "
                + "values ('" + IDkey + "', '" + PO_ID + "', '" + PR_ID + "', NOW(), '" + req.user + "', '" + price + "', '" + purchaser + "', '" + USD + "', '" + currency + "', '" + quantity + "');";

            connection.query(sql, function (err, result, fields) {
                // connection.release();
                if (err) throw err;
                sql_query = ("SELECT l.Month_Estimated,l.Year_Estimated, t.OrderID,t.RequestID,t.Quantity,it.Item,it.English"
                    + " FROM (SELECT * FROM ccs_order_item i WHERE i.ID='" + IDkey + "') t"
                    + " left JOIN ccs_order_list l ON l.ID=t.OrderID"
                    + " LEFT JOIN ccs_request_item_temp it ON it.ID=t.RequestID");

                connection.query(sql_query, function (err, result, fields) {
                    if (err) throw err;
                    if (result.length > 0) {
                        sql = "replace into ccs_leadtime_item (RequestID_LT, OrderID, ItemID,ItemName,Quanity_M1,Month_M1,Year_M1,UserUpdate,TimeUpdate) "
                            + "values ('" + IDkey + "', '" + result[0].OrderID + "', '" + result[0].Item + "', '" + result[0].English + "','" + result[0].Quantity + "', '" + result[0].Month_Estimated + "', '" + result[0].Year_Estimated + "', '" + req.user + "', NOW());";
                        //    console.log(sql)
                        connection.query(sql, function (err, result, fields) {
                            if (err) throw err;
                        });
                    }
                    connection.release();
                    res.send('done');
                    res.end();
                });
            });
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/Delete_Order_Item_Temp', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        PR_ID = req.body.PR_ID;
        item = req.body.item;
        IDkey = PO_ID + ';' + PR_ID + item;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "delete from ccs_order_item where ID='" + IDkey + "';";
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                sql = "delete from erphtml.ccs_leadtime_item where RequestID_LT='" + IDkey + "';"; //leadtime
                connection.query(sql, function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    res.send('done');
                    res.end();
                });
            });
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/Update_Order_Item_Quantity', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        PR_ID = req.body.PR_ID;
        item = req.body.item;
        quantity = req.body.quantity;
        IDKey = PO_ID + PR_ID;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update ccs_order_item set Quantity='" + quantity + "', OriginQuantity='" + quantity + "' where ID='" + IDKey + "';";
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                sql = "update ccs_leadtime_item set Quanity_M1='" + quantity + "' where RequestID_LT='" + IDKey + "';";
                connection.query(sql, function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    res.send('done');
                    res.end();
                });
            });
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/Update_Type_Item', function (req, res) {
    if (req.isAuthenticated()) {
        requestID = req.body.requestID;
        typeItem = req.body.typeItem
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_request_item_temp set Type='" + typeItem + "' where ID='" + requestID + "';";
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

app.post('/CCS/Deselect_Type_Item', function (req, res) {
    if (req.isAuthenticated()) {
        requestID = req.body.requestID;
        typeItem = req.body.typeItem
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_request_item_temp set Type=NULL where ID='" + requestID + "';";
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

app.post('/CCS/Finance_Update_Account', function (req, res) {
    if (req.isAuthenticated()) {
        account = req.body.account;
        orderID = req.body.orderID;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_order_list set AccountName='" + account + "' where ID='" + orderID + "';";
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

app.post('/CCS/Finance_Update_Urgent', function (req, res) {
    if (req.isAuthenticated()) {
        isUrgent = req.body.isUrgent;
        reason = req.body.reason;
        orderID = req.body.orderID;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_order_list set Urgent='" + isUrgent + "', Urgent_User='" + req.user + "', Urgent_Approve=NOW(), Urgent_Reason='" + reason + "' where ID='" + orderID + "';";
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

app.post('/CCS/Get_Order_Item_Temp', function (req, res) {
    if (req.isAuthenticated()) {
        orderID = req.body.orderID;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = ("select r.RequestID, r.Item, r.Vietnamese, r.English,"
                + " r.Price, r.Unit, r.Type, r.Currency Currency_PR, r.Leadtime, r.ExpiredDate,"
                + " r.USD USD_PR, r.Vendor, r.Allowance, o.* from ccs_order_item o"
                + " inner join ccs_request_item_temp r on o.RequestID=r.ID"
                + " where o.OrderID='" + orderID + "' and (AssistanResult='Y' or AssistanResult is null);");
            // console.log(sql);
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

app.post('/CCS/Get_Bidding_Price', function (req, res) {
    if (req.isAuthenticated()) {
        req_id = req.body.req_id;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "SELECT COUNT(ITEM) items, SUM(CHECKED) item_checked, SUM(totalUSD_discount) totalUSD_discount, SUM(totalUSD) totalUSD FROM "
                + " (SELECT t.RequestID, t.Item, t.Quantity, b.USD, ROUND(b.USD*(1-b.DISCOUNT)*t.Quantity,2) totalUSD_discount, ROUND(b.USD*t.Quantity,2) totalUSD, IF(b.USD IS NOT NULL, 1, 0) CHECKED "
                + " FROM erphtml.ccs_request_item_temp t "
                + " LEFT JOIN ( "
                + " SELECT ITEM, ITEM_CD, USD, PR_ID, DISCOUNT  "
                + " from erphtml.ccs_bidding "
                + " WHERE PR_ID='" + req_id + "' AND CHECKED='Y') b "
                + " ON b.PR_ID=t.RequestID AND (t.Item=b.Item OR t.Item=b.ITEM_CD) "
                + " WHERE t.RequestID='" + req_id + "') t1"
            // console.log(sql);
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                // console.log(result);
                res.send(result);
                res.end();
            });
        });
    } else {
        res.render("login");
    }
});

// app.post('/CCS/Get_Account_List', function (req, res) {
//     if (req.isAuthenticated()) {
//         dept = req.body.dept;
//         dept = get_right_dept(dept);
//         month = req.body.month;
//         year = req.body.year;
//         con3.getConnection(function (err, connection) {
//             if (err) {
//                 throw err;
//             }
//             // sql="select b.DEPT, b.PLANT, CONCAT(b.CODE,'-',b.COST_NATURE) Account, BUDGET, TOTAL, TOTAL_USD, BUDGET-TOTAL_USD BUDGET_LEFT from "
//             //     +" (select l.Month_Estimated, l.AccountName, SUM(i.Quantity* i.ActualPrice) TOTAL, SUM(i.Quantity* i.USD) TOTAL_USD from erphtml.ccs_order_list l "
//             //     +" inner join erphtml.ccs_order_item i on l.ID=i.orderID "
//             //     +" where (l.Assistan_Result='Y' or l.Assistan_Result is null) AND (l.HeadDept_Result='Y' or l.HeadDept_Result is null) AND "
//             //     +" (l.PlantMng_Result='Y' or l.PlantMng_Result is null) AND (l.Finance_Result='Y' or l.Finance_Result is null) AND "
//             //     +" (l.OperationMng_Result='Y' or l.OperationMng_Result is null) and Status!='TEMP' and i.AssistanResult is null and i.DeptResult is null and i.FinanceResult is null and l.Month_Estimated='"+month+"' and l.Year_Estimated='"+year+"' "
//             //     +" group by AccountName) t1 "
//             //     +" right join (select * from erphtml.ccs_budget where Month='"+month+"' and Year='"+year+"') b on t1.AccountName=b.CODE where Dept like '"+dept+"%'";

//             sql = ("SELECT YEAR,MONTH,PLANT,DEPT,CONCAT(b.CODE,'-',b.COST_NATURE) Account, BUDGET, TOTAL, TOTAL_USD, BUDGET-TOTAL_USD BUDGET_LEFT"
//                 + " FROM (SELECT Month_Estimated,Year_Estimated, temp.AccountName, SUM(temp.TOTAL) TOTAL, SUM(temp.TOTAL_USD) TOTAL_USD"
//                 + " FROM (SELECT lt.Month_M1 Month_Estimated,lt.Year_M1 Year_Estimated, l.AccountName, SUM(lt.Quanity_M1* i.ActualPrice) TOTAL, SUM(lt.Quanity_M1* i.USD) TOTAL_USD"
//                 + " FROM erphtml.ccs_order_list l"
//                 + " INNER JOIN erphtml.ccs_order_item i ON l.ID=i.orderID"
//                 + " INNER JOIN erphtml.ccs_leadtime_item lt ON lt.RequestID_LT=i.ID"
//                 + " WHERE (l.Assistan_Result='Y' OR l.Assistan_Result IS NULL) AND (l.HeadDept_Result='Y' OR l.HeadDept_Result IS NULL) AND (l.PlantMng_Result='Y' OR l.PlantMng_Result IS NULL) AND (l.Finance_Result='Y' OR l.Finance_Result IS NULL) AND"
//                 + " (l.OperationMng_Result='Y' OR l.OperationMng_Result IS NULL) AND l.Status!='Cancel' AND l.Status!='Denied' AND i.StatusRequest!='Cancel' AND i.AssistanResult IS NULL AND i.DeptResult IS NULL AND i.FinanceResult IS NULL AND Month_M1='" + month + "' AND lt.Year_M1='" + year + "'"
//                 + " GROUP BY AccountName,Month_M1,Year_M1 UNION ALL"
//                 + " SELECT lt.Month_M2 Month_Estimated,lt.Year_M2 Year_Estimated, l.AccountName, SUM(lt.Quanity_M2* i.ActualPrice) TOTAL, SUM(lt.Quanity_M2* i.USD) TOTAL_USD"
//                 + " FROM erphtml.ccs_order_list l"
//                 + " INNER JOIN erphtml.ccs_order_item i ON l.ID=i.orderID"
//                 + " INNER JOIN erphtml.ccs_leadtime_item lt ON lt.RequestID_LT=i.ID"
//                 + " WHERE (l.Assistan_Result='Y' OR l.Assistan_Result IS NULL) AND (l.HeadDept_Result='Y' OR l.HeadDept_Result IS NULL) AND (l.PlantMng_Result='Y' OR l.PlantMng_Result IS NULL) AND (l.Finance_Result='Y' OR l.Finance_Result IS NULL) AND"
//                 + " (l.OperationMng_Result='Y' OR l.OperationMng_Result IS NULL) AND l.Status!='Cancel' AND l.Status!='Denied' AND i.StatusRequest!='Cancel' AND i.AssistanResult IS NULL AND i.DeptResult IS NULL AND i.FinanceResult IS NULL AND Month_M2='" + month + "' AND lt.Year_M2='" + year + "'"
//                 + " GROUP BY AccountName,Month_M2,Year_M2 UNION ALL"
//                 + " SELECT lt.Month_M3 Month_Estimated,lt.Year_M3 Year_Estimated, l.AccountName, SUM(lt.Quanity_M3* i.ActualPrice) TOTAL, SUM(lt.Quanity_M3* i.USD) TOTAL_USD"
//                 + " FROM erphtml.ccs_order_list l"
//                 + " INNER JOIN erphtml.ccs_order_item i ON l.ID=i.orderID"
//                 + " INNER JOIN erphtml.ccs_leadtime_item lt ON lt.RequestID_LT=i.ID"
//                 + " WHERE (l.Assistan_Result='Y' OR l.Assistan_Result IS NULL) AND (l.HeadDept_Result='Y' OR l.HeadDept_Result IS NULL) AND (l.PlantMng_Result='Y' OR l.PlantMng_Result IS NULL) AND (l.Finance_Result='Y' OR l.Finance_Result IS NULL) AND"
//                 + " (l.OperationMng_Result='Y' OR l.OperationMng_Result IS NULL) AND l.Status!='Cancel' AND l.Status!='Denied' AND i.StatusRequest!='Cancel' AND i.AssistanResult IS NULL AND i.DeptResult IS NULL AND i.FinanceResult IS NULL AND Month_M3='" + month + "' AND lt.Year_M3='" + year + "'"
//                 + " GROUP BY AccountName,Month_M3,Year_M3) temp"
//                 + " GROUP BY temp.AccountName,temp.Month_Estimated,temp.Year_Estimated) t1"
//                 + " RIGHT  JOIN (SELECT *FROM erphtml.ccs_budget"
//                 + " WHERE MONTH='" + month + "' AND YEAR='" + year + "') b ON t1.AccountName=b.CODE AND t1.Month_Estimated=b.MONTH AND t1.Year_Estimated=b.Year WHERE DEPT LIKE '" + dept + "%'")

//             connection.query(sql, function (err, result, fields) {
//                 // console.log(result)
//                 connection.release();
//                 if (err) throw err;
//                 res.send(result);
//                 res.end();
//             });
//         });
//     } else {
//         res.render("login");
//     }
// });

app.post('/CCS/Get_Account_List', function (req, res) {
    if (req.isAuthenticated()) {
        dept = req.body.dept;
        dept = get_right_dept(dept);
        month = req.body.month;
        year = req.body.year;
        console.log(dept)
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            // sql="select b.DEPT, b.PLANT, CONCAT(b.CODE,'-',b.COST_NATURE) Account, BUDGET, TOTAL, TOTAL_USD, BUDGET-TOTAL_USD BUDGET_LEFT from "
            //     +" (select l.Month_Estimated, l.AccountName, SUM(i.Quantity* i.ActualPrice) TOTAL, SUM(i.Quantity* i.USD) TOTAL_USD from erphtml.ccs_order_list l "
            //     +" inner join erphtml.ccs_order_item i on l.ID=i.orderID "
            //     +" where (l.Assistan_Result='Y' or l.Assistan_Result is null) AND (l.HeadDept_Result='Y' or l.HeadDept_Result is null) AND "
            //     +" (l.PlantMng_Result='Y' or l.PlantMng_Result is null) AND (l.Finance_Result='Y' or l.Finance_Result is null) AND "
            //     +" (l.OperationMng_Result='Y' or l.OperationMng_Result is null) and Status!='TEMP' and i.AssistanResult is null and i.DeptResult is null and i.FinanceResult is null and l.Month_Estimated='"+month+"' and l.Year_Estimated='"+year+"' "
            //     +" group by AccountName) t1 "
            //     +" right join (select * from erphtml.ccs_budget where Month='"+month+"' and Year='"+year+"') b on t1.AccountName=b.CODE where Dept like '"+dept+"%'";

            sql = ("SELECT YEAR,MONTH,PLANT,DEPT,CONCAT(b.CODE,'-',b.COST_NATURE) Account, BUDGET,Coalesce(TOTAL_USD,0) TOTAL_USD, BUDGET-Coalesce(TOTAL_USD,0) BUDGET_LEFT"
                + " FROM (SELECT Month_Estimated,Year_Estimated, temp.AccountName, SUM(temp.TOTAL) TOTAL, SUM(temp.TOTAL_USD) TOTAL_USD"
                + " FROM (SELECT lt.Month_M1 Month_Estimated,lt.Year_M1 Year_Estimated, l.AccountName, SUM(lt.Quanity_M1* i.ActualPrice) TOTAL, SUM(lt.Quanity_M1* i.USD) TOTAL_USD"
                + " FROM erphtml.ccs_order_list l"
                + " INNER JOIN erphtml.ccs_order_item i ON l.ID=i.orderID"
                + " INNER JOIN erphtml.ccs_leadtime_item lt ON lt.RequestID_LT=i.ID"
                + " WHERE (l.Assistan_Result='Y' OR l.Assistan_Result IS NULL) AND (l.HeadDept_Result='Y' OR l.HeadDept_Result IS NULL) AND (l.PlantMng_Result='Y' OR l.PlantMng_Result IS NULL) AND (l.Finance_Result='Y' OR l.Finance_Result IS NULL) AND"
                + " (l.OperationMng_Result='Y' OR l.OperationMng_Result IS NULL) AND l.Status!='Cancel' AND l.Status!='TEMP' AND l.Status!='Denied' AND i.StatusRequest!='Cancel' AND i.AssistanResult IS NULL AND i.DeptResult IS NULL AND i.FinanceResult IS NULL AND Month_M1='" + month + "' AND lt.Year_M1='" + year + "'"
                + " GROUP BY AccountName,Month_M1,Year_M1 UNION ALL"
                + " SELECT lt.Month_M2 Month_Estimated,lt.Year_M2 Year_Estimated, l.AccountName, SUM(lt.Quanity_M2* i.ActualPrice) TOTAL, SUM(lt.Quanity_M2* i.USD) TOTAL_USD"
                + " FROM erphtml.ccs_order_list l"
                + " INNER JOIN erphtml.ccs_order_item i ON l.ID=i.orderID"
                + " INNER JOIN erphtml.ccs_leadtime_item lt ON lt.RequestID_LT=i.ID"
                + " WHERE (l.Assistan_Result='Y' OR l.Assistan_Result IS NULL) AND (l.HeadDept_Result='Y' OR l.HeadDept_Result IS NULL) AND (l.PlantMng_Result='Y' OR l.PlantMng_Result IS NULL) AND (l.Finance_Result='Y' OR l.Finance_Result IS NULL) AND"
                + " (l.OperationMng_Result='Y' OR l.OperationMng_Result IS NULL) AND l.Status!='Cancel'  AND l.Status!='TEMP' AND l.Status!='Denied' AND i.StatusRequest!='Cancel' AND i.AssistanResult IS NULL AND i.DeptResult IS NULL AND i.FinanceResult IS NULL AND Month_M2='" + month + "' AND lt.Year_M2='" + year + "'"
                + " GROUP BY AccountName,Month_M2,Year_M2 UNION ALL"
                + " SELECT lt.Month_M3 Month_Estimated,lt.Year_M3 Year_Estimated, l.AccountName, SUM(lt.Quanity_M3* i.ActualPrice) TOTAL, SUM(lt.Quanity_M3* i.USD) TOTAL_USD"
                + " FROM erphtml.ccs_order_list l"
                + " INNER JOIN erphtml.ccs_order_item i ON l.ID=i.orderID"
                + " INNER JOIN erphtml.ccs_leadtime_item lt ON lt.RequestID_LT=i.ID"
                + " WHERE (l.Assistan_Result='Y' OR l.Assistan_Result IS NULL) AND (l.HeadDept_Result='Y' OR l.HeadDept_Result IS NULL) AND (l.PlantMng_Result='Y' OR l.PlantMng_Result IS NULL) AND (l.Finance_Result='Y' OR l.Finance_Result IS NULL) AND"
                + " (l.OperationMng_Result='Y' OR l.OperationMng_Result IS NULL) AND l.Status!='Cancel'  AND l.Status!='TEMP' AND l.Status!='Denied' AND i.StatusRequest!='Cancel' AND i.AssistanResult IS NULL AND i.DeptResult IS NULL AND i.FinanceResult IS NULL AND Month_M3='" + month + "' AND lt.Year_M3='" + year + "'"
                + " GROUP BY AccountName,Month_M3,Year_M3) temp"
                + " GROUP BY temp.AccountName,temp.Month_Estimated,temp.Year_Estimated) t1"
                + " RIGHT  JOIN (SELECT *FROM erphtml.ccs_budget")
            if (dept=='MEC'){
                sql += " WHERE MONTH='" + month + "' AND YEAR='" + year + "') b ON t1.AccountName=b.CODE AND t1.Month_Estimated=b.MONTH AND t1.Year_Estimated=b.Year WHERE (DEPT LIKE 'MEC%' OR DEPT LIKE 'PAD%')"
            } else{
                sql += " WHERE MONTH='" + month + "' AND YEAR='" + year + "') b ON t1.AccountName=b.CODE AND t1.Month_Estimated=b.MONTH AND t1.Year_Estimated=b.Year WHERE DEPT LIKE '" + dept + "%'"
            }
                
            console.log(sql)
            connection.query(sql, function (err, result, fields) {
                // console.log(result)
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

app.post('/CCS/Upload_PR_File', function (req, res) {
    if (req.isAuthenticated()) {
        var form = new formidable.IncomingForm();
        excelFile = '';
        form.parse(req);
        form.on('fileBegin', function (name, file) {
            excelFile = req.user + '_' + file.name;
            file.path = './public/Python/Finance/CCS/Upload/' + excelFile;
        });

        form.on('file', function (name, file) {
            var options = {
                mode: 'text',
                pythonPath: 'python',
                scriptPath: './public/Python/Finance/CCS',
                pythonOptions: ['-u'],
                args: [excelFile, process.cwd(), req.user]
            }
            let shell = new PythonShell('upload_pr.py', options);
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

app.post('/CCS/Upload_PR_File', function (req, res) {
    if (req.isAuthenticated()) {
        var form = new formidable.IncomingForm();
        excelFile = '';
        form.parse(req);
        form.on('fileBegin', function (name, file) {
            excelFile = req.user + '_' + file.name;
            file.path = './public/Python/Finance/CCS/Upload/' + excelFile;
        });

        form.on('file', function (name, file) {
            var options = {
                mode: 'text',
                pythonPath: 'python',
                scriptPath: './public/Python/Finance/CCS',
                pythonOptions: ['-u'],
                args: [excelFile, process.cwd(), req.user]
            }
            let shell = new PythonShell('upload_pr.py', options);
            shell.on('message', function (message) {
                res.send(message);
                res.end();
            })
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/Upload_Vendor_Attachment', function (req, res) {
    if (req.isAuthenticated()) {
        var form = new formidable.IncomingForm();
        excelFile = '';
        form.parse(req);
        form.on('fileBegin', function (name, file) {
            excelFile = file.name;
            file.path = './public/Python/Finance/CCS/Upload/Attachment/' + excelFile;
        });
        form.on('file', function (name, file) {
            con3.getConnection(function (err, connection) {
                if (err) {
                    throw err;
                }
                sql = "update erphtml.ccs_request_item_temp set Attached_Image='" + excelFile + "' where RequestID='" + excelFile.split('.')[0] + "'";
                connection.query(sql, function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    res.send('done');
                    res.end();
                });
            });
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/Update_PR_File_Attach', function (req, res) {
    if (req.isAuthenticated()) {
        var form = new formidable.IncomingForm();
        excelFile = '';
        form.parse(req);
        form.on('fileBegin', function (name, file) {
            excelFile = file.name;
            file.path = './public/Python/Finance/CCS/Upload/Attachment/' + excelFile;
        });
        form.on('file', function (name, file) {
            con3.getConnection(function (err, connection) {
                if (err) {
                    throw err;
                }
                sql = "update erphtml.ccs_request_item_temp set Attached_File='" + excelFile + "' where RequestID='" + excelFile.split('.')[0] + "'";
                connection.query(sql, function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    res.send('done');
                    res.end();
                });
            });
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/Update_PO_File_Attach', function (req, res) {
    if (req.isAuthenticated()) {
        var form = new formidable.IncomingForm();
        excelFile = '';
        form.parse(req);
        form.on('fileBegin', function (name, file) {
            excelFile = file.name;
            file.path = './public/Python/Finance/CCS/Upload/Attachment/' + excelFile;
        });
        form.on('file', function (name, file) {
            con3.getConnection(function (err, connection) {
                if (err) {
                    throw err;
                }
                // sql="select CONCAT(CODE,'-',COST_NATURE) Account from ccs_budget where Dept like '"+dept+"%' group by Account;";
                sql = "update erphtml.ccs_order_list set Attached_File='" + excelFile + "' where ID='" + excelFile.split('.')[0] + "'";
                connection.query(sql, function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    res.send('done');
                    res.end();
                });
            });
        });
    } else {
        res.render("login");
    }
});

function send_mail_vendor(requestID, projectName, user_pur, pass_pur, vendor, message, message2_name, message2, contend, vendor_id, callback) {
    // console.log(message2);
    result = false;
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        auth: {
            user: user_pur,
            pass: pass_pur
        }
    });
    var mailOptions;
    if (message2_name != '')
        mailOptions = {
            from: user_pur,
            to: vendor,
            subject: "Báo giá " + projectName + " - " + requestID,
            text: contend,
            html: "",
            attachments: [{
                filename: 'B_' + requestID + '_' + vendor_id.substring(0, 30) + '.xlsx',
                path: message,
                cid: 'hello_1' //same cid value as in the html img src
            }, {
                filename: 'A_' + message2_name,
                path: message2,
                cid: 'hello' //same cid value as in the html img src
            }]
        }
    else
        mailOptions = {
            from: user_pur,
            to: vendor,
            subject: "Báo giá " + projectName + " - " + requestID,
            text: contend,
            html: "",
            attachments: [{
                filename: 'B_' + requestID + '_' + vendor_id.substring(0, 30) + '.xlsx',
                path: message,
                cid: 'hello' //same cid value as in the html img src
            }]
        }
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            return callback(false);
        }
        else {
            return callback(true);
        }
    });
}

app.post('/CCS/Update_PR_File', function (req, res) {
    if (req.isAuthenticated()) {
        var form = new formidable.IncomingForm();
        excelFile = '';
        form.parse(req);
        form.on('fileBegin', function (name, file) {
            excelFile = req.user + '_' + file.name;
            file.path = './public/Python/Finance/CCS/Upload/' + excelFile;
        });

        form.on('file', function (name, file) {
            var options = {
                mode: 'text',
                pythonPath: 'python',
                scriptPath: './public/Python/Finance/CCS',
                pythonOptions: ['-u'],
                args: [excelFile, process.cwd(), req.user]
            }
            let shell = new PythonShell('update_pr.py', options);
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

app.post('/CCS/Upload_PO_File', function (req, res) {
    if (req.isAuthenticated()) {
        var form = new formidable.IncomingForm();
        excelFile = '';
        form.parse(req);
        form.on('fileBegin', function (name, file) {
            excelFile = req.user + '_' + file.name;
            file.path = './public/Python/Finance/CCS/Upload/' + excelFile;
        });

        form.on('file', function (name, file) {
            var options = {
                mode: 'text',
                pythonPath: 'python',
                scriptPath: './public/Python/Finance/CCS',
                pythonOptions: ['-u'],
                args: [excelFile, process.cwd(), req.user]
            }
            let shell = new PythonShell('upload_po.py', options);
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

app.post('/CCS/Export_PO_File', function (req, res) {
    if (req.isAuthenticated()) {
        poID = req.body.poID;
        var options = {
            mode: 'text',
            pythonPath: 'python',
            scriptPath: './public/Python/Finance/CCS',
            pythonOptions: ['-u'],
            args: [process.cwd(), poID]
        }
        let shell = new PythonShell('export_po.py', options);
        shell.on('message', function (message) {
            // res.setHeader("Content-Type", "application/json");
            res.send(message);
            res.end();
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/Export_ToolAsset_File', function (req, res) {
    if (req.isAuthenticated()) {
        year = req.body.year;
        month = req.body.month;
        var options = {
            mode: 'text',
            pythonPath: 'python',
            scriptPath: './public/Python/Finance/CCS',
            pythonOptions: ['-u'],
            args: [process.cwd(), month, year]
        }
        let shell = new PythonShell('export_tool.py', options);
        shell.on('message', function (message) {
            // res.setHeader("Content-Type", "application/json");
            res.send(message);
            res.end();
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/Update_ToolAsset_File', function (req, res) {
    if (req.isAuthenticated()) {
        var form = new formidable.IncomingForm();
        excelFile = '';
        form.parse(req);
        form.on('fileBegin', function (name, file) {
            excelFile = req.user + '_' + file.name;
            file.path = './public/Python/Finance/CCS/Upload/' + excelFile;
        });
        form.on('file', function (name, file) {
            var options = {
                mode: 'text',
                pythonPath: 'python',
                scriptPath: './public/Python/Finance/CCS',
                pythonOptions: ['-u'],
                args: [excelFile, process.cwd(), req.user]
            }
            let shell = new PythonShell('update_tool.py', options);
            shell.on('message', function (message) {
                // res.setHeader("Content-Type", "application/json");
                res.send(message);
                res.end();
            })
        })
    } else {
        res.render("login");
    }
});

app.post('/CCS/Update_PO_File', function (req, res) {
    if (req.isAuthenticated()) {
        var form = new formidable.IncomingForm();
        excelFile = '';
        form.parse(req);
        form.on('fileBegin', function (name, file) {
            excelFile = req.user + '_' + file.name;
            file.path = './public/Python/Finance/CCS/Upload/' + excelFile;
        });
        form.on('file', function (name, file) {
            var options = {
                mode: 'text',
                pythonPath: 'python',
                scriptPath: './public/Python/Finance/CCS',
                pythonOptions: ['-u'],
                args: [excelFile, process.cwd(), req.user]
            }
            let shell = new PythonShell('update_po.py', options);
            shell.on('message', function (message) {
                // res.setHeader("Content-Type", "application/json");
                res.send(message);
                res.end();
            })
        })
    } else {
        res.render("login");
    }
});

app.post('/CCS/Send_PR_to_vendor', function (req, res) {
    if (req.isAuthenticated()) {
        requestID = req.body.requestID;
        vendor = req.body.vendor;
        vendor_id = req.body.vendor_id;
        user_pur = req.body.user_purchaser;
        pass_pur = req.body.pass_purchaser;
        contend = req.body.contend;

        var options = {
            mode: 'text',
            pythonPath: 'python',
            scriptPath: './public/Python/Finance/CCS',
            pythonOptions: ['-u'],
            args: [process.cwd(), requestID, vendor_id, vendor, user_pur, pass_pur]
        }
        let shell = new PythonShell('export_pr_vendor.pyw', options);
        shell.on('message', function (message) {
            // res.setHeader("Content-Type", "application/json");
            if (message != 'fail') {
                requestID = message.split(';')[0]
                projectName = message.split(';')[1]
                user_pur = message.split(';')[2]
                pass_pur = message.split(';')[3]
                vendor = message.split(';')[4]
                message1 = message.split(';')[5]
                vendor_name = message.split(';')[6]
                message2_name = message.split(';')[7]
                message2 = message.split(';')[8]
                if (message == 'fail') {
                    res.send('done');
                    res.end();
                }
                send_mail_vendor(requestID, projectName, user_pur, pass_pur, vendor, message1, message2_name, message2, contend, vendor_name, function (result) {
                    // requestID, projectName, user_pur, pass_pur, vendor, message, message2_name, message2, contend, vendor_id, callback
                    if (result == true) {
                        res.send('done');
                        res.end();
                    } else {
                        res.send('Sai mật khẩu');
                        res.end();
                    }
                });
            }

        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/Download_PR_to_vendor', function (req, res) {
    if (req.isAuthenticated()) {
        requestID = req.body.requestID;
        vendor = req.body.vendor;
        vendor_id = req.body.vendor_id;
        user_pur = '';
        pass_pur = '';
        contend = '';
        var options = {
            mode: 'text',
            pythonPath: 'python',
            scriptPath: './public/Python/Finance/CCS',
            pythonOptions: ['-u'],
            args: [process.cwd(), requestID, vendor_id, vendor, user_pur, pass_pur]
        }
        let shell = new PythonShell('export_pr_vendor.pyw', options);
        shell.on('message', function (message) {
            // res.setHeader("Content-Type", "application/json");
            if (message != 'fail') {
                requestID = message.split(';')[0]
                projectName = message.split(';')[1]
                user_pur = message.split(';')[2]
                pass_pur = message.split(';')[3]
                vendor = message.split(';')[4]
                message1 = message.split(';')[5]
                vendor_name = message.split(';')[6]
                res.send('B_' + requestID + '_' + vendor_name.substring(0, 30) + '.xlsx');
                res.end();
            }
            else {
                res.send('fail');
                res.end();
            }
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/Change_Purchaser', function (req, res) {
    if (req.isAuthenticated()) {
        PR_ID = req.body.requestID;
        purchaser = req.body.purchaser;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_request_item_temp set Purchaser='" + purchaser + "' where RequestID='" + PR_ID + "'";
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

app.post('/CCS/Change_Purchaser_PR', function (req, res) {
    if (req.isAuthenticated()) {
        PR_ID = req.body.prID;
        purchaser = req.body.purchaser;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_order_list set Purchaser='" + purchaser + "' where ID='" + PR_ID + "'";
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

app.post('/CCS/Change_Purchaser_Category', function (req, res) {
    if (req.isAuthenticated()) {
        category = req.body.category;
        purchaser = req.body.purchaser;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_pic set PIC='" + purchaser + "', TimeUpdate=NOW(), User='" + req.user + "' where CATEGORY='" + category + "'";
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

app.post('/CCS/Change_Request_Status', function (req, res) {
    if (req.isAuthenticated()) {
        PR_ID = req.body.requestID;
        status_new = req.body.status;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_request_item_temp set Req_Status='" + status_new + "' , Req_TimeUpdate=NOW() , PR_User='" + req.user + "' where RequestID='" + PR_ID + "'";
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

//============================ CCS BIDDING==============================
app.get('/CCS/Bidding', function (req, res) {
    if (req.isAuthenticated()) {
        if (req.query.req_id != null) {
            req_id = req.query.req_id;
            res.render("Finance/CCS/Bidding", { req_id: req_id });
        } else {
            res.render("Finance/CCS/Bidding", { req_id: '' });
        }

    }
    else {
        res.render("login");
    }
});

app.post('/CCS/Get_Bidding_Infor', function (req, res) {
    if (req.isAuthenticated()) {
        PR_ID = req.body.PR_ID;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "SELECT b.PR_ID, b.VENDOR, b.MOQ, b.FILE, v.NAME, b.ITEM, p.QUANTITY, p.UNIT, b.PRICE, b.USD, b.CURRENCY, b.DISCOUNT, b.LEADTIME, b.EXPIRED, b.ORIGIN, b.WARRANTY, b.CHECKED, b.VENDOR_NOTE, b.SUP_RESULT, b.SUP_NOTE, b.SUP_TIMEUPDATE, b.1000_RESULT K1_RESULT, b.1000_NOTE K1_NOTE, b.1000_TIMEUPDATE K1_TIMEUPDATE, b.OPERATION_RESULT, b.OPERATION_NOTE, b.OPERATION_TIMEUPDATE, b.3000_RESULT K3_RESULT, b.3000_NOTE K3_NOTE, b.3000_TIMEUPDATE K3_TIMEUPDATE, b.PLANT_RESULT, b.PLANT_NOTE, b.PLANT_TIMEUPDATE, b.SUBPLANT_RESULT, b.SUBPLANT_NOTE, b.SUBPLANT_TIMEUPDATE "
                + " FROM erphtml.ccs_bidding b "
                + " LEFT JOIN erphtml.setup_vendor v ON b.VENDOR=v.ID "
                + " LEFT JOIN ccs_request_item_temp p ON (b.ITEM=p.Item OR b.ITEM_CD=p.Item) AND b.PR_ID=p.RequestID"
                + " WHERE b.PR_ID = '" + PR_ID + "' AND b.IS_DONE='N';";
            // console.log(sql);
            connection.query(sql, function (err, result, fields) {


                if (err) throw err;
                try {
                    if (result[0].QUANTITY == null) {
                        // console.log("Eeeee"+result.length);
                        // console.log(result);
                        sql = "SELECT b.PR_ID, b.VENDOR, b.MOQ, b.FILE, v.NAME, b.ITEM, p.QUANTITY, p.UNIT, b.PRICE, b.USD, b.CURRENCY, b.DISCOUNT, b.LEADTIME, b.EXPIRED, b.ORIGIN, b.WARRANTY, b.CHECKED, b.VENDOR_NOTE, b.SUP_RESULT, b.SUP_NOTE, b.SUP_TIMEUPDATE, b.1000_RESULT K1_RESULT, b.1000_NOTE K1_NOTE, b.1000_TIMEUPDATE K1_TIMEUPDATE, b.OPERATION_RESULT, b.OPERATION_NOTE, b.OPERATION_TIMEUPDATE, b.3000_RESULT K3_RESULT, b.3000_NOTE K3_NOTE, b.3000_TIMEUPDATE K3_TIMEUPDATE, b.PLANT_RESULT, b.PLANT_NOTE, b.PLANT_TIMEUPDATE, b.SUBPLANT_RESULT, b.SUBPLANT_NOTE, b.SUBPLANT_TIMEUPDATE "
                            + " FROM erphtml.ccs_bidding b "
                            + " LEFT JOIN erphtml.setup_vendor v ON b.VENDOR=v.ID "
                            + " LEFT JOIN ccs_request_item_temp p ON b.PR_ID=p.RequestID"
                            + " WHERE b.PR_ID = '" + PR_ID + "' AND b.IS_DONE='N';";
                        connection.query(sql, function (err, result, fields) {
                            if (err) throw err;
                            connection.release();
                            res.send(result);
                            res.end();
                        });
                    }
                    else {
                        connection.release();
                        res.send(result);
                        res.end();
                    }

                } catch (error) {
                    connection.release();
                    res.send(result);
                    res.end();

                }

            });
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/Select_Item_Bidding', function (req, res) {
    if (req.isAuthenticated()) {
        item = req.body.item;
        pr_id = req.body.pr_id;
        vendor = req.body.vendor;
        id_pr = pr_id + vendor + item;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_bidding set CHECKED='N' where PR_ID ='" + pr_id + "' and item='"+item+"';";
            // console.log(sql);
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                sql1 = "update erphtml.ccs_bidding set CHECKED='Y', TimeUpdate=NOW(), User='" + req.user + "' where ID ='" + id_pr + "';";
                // console.log(sql1);
                connection.query(sql1, function (err, result, fields) {
                    // console.log(sql1);
                    connection.release();
                    if (err) throw err;
                    res.send('done');
                    res.end();
                });
            });
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/Export_PO_File', function (req, res) {
    if (req.isAuthenticated()) {
        poID = req.body.poID;
        var options = {
            mode: 'text',
            pythonPath: 'python',
            scriptPath: './public/Python/Finance/CCS',
            pythonOptions: ['-u'],
            args: [process.cwd(), poID]
        }
        let shell = new PythonShell('export_po.py', options);
        shell.on('message', function (message) {
            // res.setHeader("Content-Type", "application/json");
            res.send(message);
            res.end();
        });
    } else {
        res.render("login");
    }
});

// app.post('/CCS/Download_Received_PR', function(req, res){
//     if (req.isAuthenticated()){
//         poID=req.body.poID;
//         var options={
//             mode:'text',
//             pythonPath:'python',
//             scriptPath:'./public/Python/Finance/CCS',
//             pythonOptions:['-u'],
//             args:[process.cwd(), poID]
//         }
//         let shell=new PythonShell('export_pr_receive.py', options);
//         shell.on('message', function(message){
//             // res.setHeader("Content-Type", "application/json");
//             res.send(message);
//             res.end();
//         });
//     } else {
//         res.render("login");
//     } 
// });


app.post('/CCS/Deselect_Item_Bidding', function (req, res) {
    if (req.isAuthenticated()) {
        item = req.body.item;
        pr_id = req.body.pr_id;
        vendor = req.body.vendor;
        id_pr = pr_id + vendor + item;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_bidding set CHECKED='N' where PR_ID='" + pr_id + "' and ITEM='" + item + "';";
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                res.send('done');
                res.end();
            });
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/get_note_bidding', function (req, res) {
    if (req.isAuthenticated()) {
        pr_id = req.body.pr_id;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "select * from erphtml.ccs_bidding_note where PR_ID='" + pr_id + "'";
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                res.send(result);
                res.end();
            });
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/user_note_bidding', function (req, res) {
    if (req.isAuthenticated()) {
        pr_id = req.body.pr_id;
        note_bidding = req.body.note_bidding;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "select * from erphtml.ccs_bidding_note where PR_ID='" + pr_id + "'";
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                if (result.length == 0) {
                    sql = "replace into erphtml.ccs_bidding_note (PR_ID, staffUser, staffNote, staffTimeUpdate) values ('" + pr_id + "', '" + req.user + "', '" + note_bidding + "', NOW())";
                    connection.query(sql, function (err, result, fields) {
                        if (err) throw err;
                        res.send('done');
                        res.end();
                    });
                } else {
                    sql = "update erphtml.ccs_bidding_note set staffUser='" + req.user + "', staffNote='" + note_bidding + "', staffTimeUpdate=NOW() where PR_ID='" + pr_id + "'";
                    connection.query(sql, function (err, result, fields) {
                        if (err) throw err;
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

app.post('/CCS/dept_note_bidding', function (req, res) {
    if (req.isAuthenticated()) {
        pr_id = req.body.pr_id;
        note_bidding = req.body.note_bidding;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_bidding_note set deptUser='" + req.user + "', deptNote='" + note_bidding + "', deptTimeUpdate=NOW() where PR_ID='" + pr_id + "'";
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                res.send('done');
                res.end();
            });
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/pur_note_bidding', function (req, res) {
    if (req.isAuthenticated()) {
        pr_id = req.body.pr_id;
        note_bidding = req.body.note_bidding;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "select * from erphtml.ccs_bidding_note where PR_ID='" + pr_id + "'";
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                if (result.length > 0) {
                    if (req.user == "quhoang") sql = "update erphtml.ccs_bidding_note set oneUser='" + req.user + "', oneNote='" + note_bidding + "', oneTimeUpdate=NOW() where PR_ID='" + pr_id + "'";

                    if (req.user == "trthuha") sql = "update erphtml.ccs_bidding_note set threeUser='" + req.user + "', threeNote='" + note_bidding + "', threeTimeUpdate=NOW() where PR_ID='" + pr_id + "'";
                    else sql = "update erphtml.ccs_bidding_note set purUser='" + req.user + "', purNote='" + note_bidding + "', purTimeUpdate=NOW() where PR_ID='" + pr_id + "'";
                    connection.query(sql, function (err, result, fields) {
                        if (err) throw err;
                        res.send('done');
                        res.end();
                    });
                } else {
                    sql = "replace into erphtml.ccs_bidding_note (PR_ID, purUser, purNote, purTimeUpdate) values ('" + pr_id + "', '" + req.user + "', '" + note_bidding + "', NOW())";
                    connection.query(sql, function (err, result, fields) {
                        if (err) throw err;
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

// app.post('/CCS/three_note_bidding', function(req, res){
//     if (req.isAuthenticated()){
//         pr_id=req.body.pr_id;
//         note_bidding=req.body.note_bidding;
//         con3.getConnection(function(err, connection){
//             if (err) {
//                 throw err;
//             }
//             sql="update erphtml.ccs_bidding_note set threeUser='"+req.user+"', threeNote='"+note_bidding+"', threeTimeUpdate=NOW() where PR_ID='"+pr_id+"'";
//             connection.query(sql, function (err, result, fields) {
//                 if (err) throw err;
//                 res.send('done');
//                 res.end();
//             });
//         });
//     } else {
//         res.render("login");
//     }
// });

app.post('/CCS/Set_Sup_Pass', function (req, res) {
    if (req.isAuthenticated()) {
        user_pass = req.body.sup_user;
        pr_id = req.body.pr_id;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_bidding set Sup_User='" + user_pass + "', Sup_TimeUpdate=NOW() where PR_ID='" + pr_id + "';";
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                sql1 = "update erphtml.ccs_request_item_temp set Sup_User='" + user_pass + "' where RequestID='" + pr_id + "';";
                connection.query(sql1, function (err, result1, fields) {
                    if (err) throw err;
                    connection.release();
                    res.send('done');
                    res.end();
                });
            });
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/Get_PR_ID_by_DEPT', function (req, res) {
    if (req.isAuthenticated()) {
        dept = req.body.dept;
        dept = get_right_dept(dept);
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "SELECT distinct b.PR_ID FROM ccs_bidding b WHERE b.IS_DONE='N' AND b.PR_ID LIKE '" + dept + "%';";
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

app.post('/CCS/Get_PR_ID_by_PURCHASING', function (req, res) {
    if (req.isAuthenticated()) {
        purchasing = req.body.purchasing;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = '';
            if (purchasing != 'Tất cả')
                sql = "SELECT * FROM "
                    + " (SELECT t1.PR_ID, t.Purchaser FROM "
                    + " (SELECT b.PR_ID FROM erphtml.ccs_bidding b WHERE b.IS_DONE='N' GROUP BY b.PR_ID) t1 "
                    + " INNER JOIN erphtml.ccs_request_item_temp t WHERE t1.PR_ID=t.RequestID GROUP BY t1.PR_ID) t2 "
                    + " WHERE t2.Purchaser='" + purchasing + "';";
            else
                sql = "SELECT * FROM "
                    + " (SELECT t1.PR_ID, t.Purchaser FROM "
                    + " (SELECT b.PR_ID FROM erphtml.ccs_bidding b WHERE b.IS_DONE='N' GROUP BY b.PR_ID) t1 "
                    + " INNER JOIN erphtml.ccs_request_item_temp t WHERE t1.PR_ID=t.RequestID GROUP BY t1.PR_ID) t2 ";
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

app.post('/CCS/Set_PR_ID_Done', function (req, res) {
    if (req.isAuthenticated()) {
        PR_ID = req.body.PR_ID;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_bidding b set b.IS_DONE='Y' where b.PR_ID = '" + PR_ID + "';";
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

app.post('/CCS/Get_Purchasers_Category', function (req, res) {
    if (req.isAuthenticated()) {
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "select * from erphtml.ccs_pic order by PIC, CATEGORY;";
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

app.post('/CCS/Export_Bidding_File', function (req, res) {
    if (req.isAuthenticated()) {
        PR_ID = req.body.PR_ID;
        var options = {
            mode: 'text',
            pythonPath: 'python',
            scriptPath: './public/Python/Finance/CCS',
            pythonOptions: ['-u'],
            args: [process.cwd(), PR_ID]

        }
        let shell = new PythonShell('export_bidding.py', options);
        shell.on('message', function (message) {
            // res.setHeader("Content-Type", "application/json");
            res.send(message);
            res.end();
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/Update_PR_File_Bidding_Done', function (req, res) {
    if (req.isAuthenticated()) {
        var form = new formidable.IncomingForm();
        excelFile = '';
        form.parse(req);
        form.on('fileBegin', function (name, file) {
            excelFile = req.user + '_' + file.name;
            file.path = './public/Python/Finance/CCS/Upload/' + excelFile;
        });

        form.on('file', function (name, file) {
            var options = {
                mode: 'text',
                pythonPath: 'python',
                scriptPath: './public/Python/Finance/CCS',
                pythonOptions: ['-u'],
                args: [excelFile, process.cwd(), req.user]
            }

            let shell = new PythonShell('update_pr_final.py', options);
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

app.post('/CCS/Bidding_Approve2', function (req, res) {
    if (req.isAuthenticated()) {
        pr_id = req.body.pr_id;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_bidding set Sup_TimeUpdate=NOW(), Sup_Result='Y' where PR_ID='" + pr_id + "';";
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                sql1 = "update erphtml.ccs_request_item_temp set Sup_User='Dept_Pass' where RequestID='" + pr_id + "'";
                connection.query(sql1, function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    res.send('done');
                    res.end();
                });
            });
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/Bidding_Approve', function (req, res) {
    if (req.isAuthenticated()) {
        pr_id = req.body.pr_id;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            if (req.user.toLowerCase() == 'nhtran2'){
                sql = "update erphtml.ccs_bidding set Sup_TimeUpdate=NOW(), Sup_Result='Y', Operation_TimeUpdate=NOW(), Operation_Result='Y', Operation_User='" + req.user + "' where PR_ID='" + pr_id + "';";
                sql1 = "update erphtml.ccs_request_item_temp set Sup_User='Dept_Pass' where RequestID='" + pr_id + "'";
            }
            else{
                sql = "update erphtml.ccs_bidding set Sup_TimeUpdate=NOW(), Sup_Result='Y' where PR_ID='" + pr_id + "';";
                sql1 = "update erphtml.ccs_request_item_temp set Sup_User='Dept_Pass' where RequestID='" + pr_id + "'";
            }     
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                connection.query(sql1, function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    res.send('done');
                    res.end();
                });
            });
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/Bidding_Approve_Purchasing', function (req, res) {
    if (req.isAuthenticated()) {
        pr_id = req.body.pr_id;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_bidding set PR_TimeUpdate=NOW(), PR_Result='Y', PR_User='" + req.user + "' where PR_ID='" + pr_id + "';";
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                sql1 = "update erphtml.ccs_request_item_temp set Sup_User='Purchase_Pass' where RequestID='" + pr_id + "'";
                connection.query(sql1, function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    res.send('done');
                    res.end();
                });
            });
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/Bidding_Approve_Operation', function (req, res) {
    if (req.isAuthenticated()) {
        pr_id = req.body.pr_id;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_bidding set Operation_TimeUpdate=NOW(), Operation_Result='Y', Operation_User='" + req.user + "' where PR_ID='" + pr_id + "';";
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                sql1 = "update erphtml.ccs_request_item_temp set Sup_User='Operation_Pass' where RequestID='" + pr_id + "'";
                connection.query(sql1, function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    res.send('done');
                    res.end();
                });
            });
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/Bidding_Approve_SubPlant', function (req, res) {
    if (req.isAuthenticated()) {
        pr_id = req.body.pr_id;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_bidding set SubPlant_TimeUpdate=NOW(), SubPlant_Result='Y', SubPlant_User='" + req.user + "' where PR_ID='" + pr_id + "';";
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                sql1 = "update erphtml.ccs_request_item_temp set Sup_User='SubPlant_Pass' where RequestID='" + pr_id + "'";
                connection.query(sql1, function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    res.send('done');
                    res.end();
                });
            });
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/Bidding_Approve_Plant', function (req, res) {
    if (req.isAuthenticated()) {
        pr_id = req.body.pr_id;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_bidding set Plant_TimeUpdate=NOW(), Plant_Result='Y', Plant_User='" + req.user + "' where PR_ID='" + pr_id + "';";
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                sql1 = "update erphtml.ccs_request_item_temp set Sup_User='Plant_Pass' where RequestID='" + pr_id + "'";
                connection.query(sql1, function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    res.send('done');
                    res.end();
                });
            });
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/Bidding_Reject', function (req, res) {
    if (req.isAuthenticated()) {
        pr_id = req.body.pr_id;
        reason = req.body.reason;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            if (req.user.toLowerCase() == 'nhtran2'){
            
                sql = "update erphtml.ccs_bidding set Sup_TimeUpdate=NOW(), Sup_Result='N', Sup_Note='" + reason + "',Operation_TimeUpdate=NOW(), Operation_Result='N', Operation_User='" + req.user + "' where PR_ID='" + pr_id + "';";
                sql1 = "update erphtml.ccs_request_item_temp set Sup_User='Dept_Reject' where RequestID='" + pr_id + "'";
            }
            else{
                sql = "update erphtml.ccs_bidding set Sup_TimeUpdate=NOW(), Sup_Result='N', Sup_Note='" + reason + "' where PR_ID='" + pr_id + "';";
                sql1 = "update erphtml.ccs_request_item_temp set Sup_User='Dept_Reject' where RequestID='" + pr_id + "'";
            }   
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                
                connection.query(sql1, function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    res.send('done');
                    res.end();
                });
            });
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/Bidding_Reject2', function (req, res) {
    if (req.isAuthenticated()) {
        pr_id = req.body.pr_id;
        reason = req.body.reason;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_bidding set Sup_TimeUpdate=NOW(), Sup_Result='N', Sup_Note='" + reason + "' where PR_ID='" + pr_id + "';";
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                sql1 = "update erphtml.ccs_request_item_temp set Sup_User='Dept_Reject' where RequestID='" + pr_id + "'";
                connection.query(sql1, function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    res.send('done');
                    res.end();
                });
            });
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/Bidding_Reject_Purchasing', function (req, res) {
    if (req.isAuthenticated()) {
        pr_id = req.body.pr_id;
        reason = req.body.reason;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_bidding set PR_TimeUpdate=NOW(), PR_Result='N', PR_Note='" + reason + "' where PR_ID='" + pr_id + "';";
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                sql1 = "update erphtml.ccs_request_item_temp set Req_Status='Reject', Sup_User='Purchase_Reject' where RequestID='" + pr_id + "'";
                connection.query(sql1, function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    res.send('done');
                    res.end();
                });
            });
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/Bidding_Reject_Operation', function (req, res) {
    if (req.isAuthenticated()) {
        pr_id = req.body.pr_id;
        reason = req.body.reason;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_bidding set Operation_TimeUpdate=NOW(), Operation_Result='N', Operation_Note='" + reason + "', Operation_User='" + req.user + "' where PR_ID='" + pr_id + "';";
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                sql1 = "update erphtml.ccs_request_item_temp set Sup_User='Operation_Reject' where RequestID='" + pr_id + "'";
                connection.query(sql1, function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    res.send('done');
                    res.end();
                });
            });
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/Bidding_Reject_SubPlant', function (req, res) {
    if (req.isAuthenticated()) {
        pr_id = req.body.pr_id;
        reason = req.body.reason;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_bidding set SubPlant_TimeUpdate=NOW(), SubPlant_Result='N', SubPlant_Note='" + reason + "', SubPlant_User='" + req.user + "' where PR_ID='" + pr_id + "';";
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                sql1 = "update erphtml.ccs_request_item_temp set Sup_User='SubPlant_Reject' where RequestID='" + pr_id + "'";
                connection.query(sql1, function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    res.send('done');
                    res.end();
                });
            });
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/Bidding_Reject_Plant', function (req, res) {
    if (req.isAuthenticated()) {
        pr_id = req.body.pr_id;
        reason = req.body.reason;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_bidding set Plant_TimeUpdate=NOW(), Plant_Result='N', Plant_Note='" + reason + "', Plant_User='" + req.user + "' where PR_ID='" + pr_id + "';";
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                sql1 = "update erphtml.ccs_request_item_temp set Sup_User='Plant_Reject' where RequestID='" + pr_id + "'";
                connection.query(sql1, function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    res.send('done');
                    res.end();
                });
            });
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/Set_1k_Bidding', function (req, res) {
    if (req.isAuthenticated()) {
        pr_id = req.body.pr_id;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_bidding set 1000_Bidding='Y' where PR_ID='" + pr_id + "';";
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

app.post('/CCS/Set_3k_Bidding', function (req, res) {
    if (req.isAuthenticated()) {
        pr_id = req.body.pr_id;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_bidding set 3000_Bidding='Y' where PR_ID='" + pr_id + "';";
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

app.post('/CCS/Bidding_Approve_1k', function (req, res) {
    if (req.isAuthenticated()) {
        pr_id = req.body.pr_id;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_bidding set 1000_Result='Y', 1000_TimeUpdate=NOW(), 1000_User='" + req.user + "' where PR_ID='" + pr_id + "';";
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

app.post('/CCS/Bidding_Approve_3k', function (req, res) {
    // if (req.isAuthenticated()){
    //     pr_id=req.body.pr_id;
    //     con3.getConnection(function(err, connection){
    //         if (err) {
    //             throw err;
    //         }
    //         sql="update erphtml.ccs_bidding set 3000_Result='Y', 3000_TimeUpdate=NOW(), 3000_User='"+req.user+"' where PR_ID='"+pr_id+"';";
    //         connection.query(sql, function (err, result, fields) {
    //             if (err) throw err;
    //             connection.release();
    //             res.send('done');
    //             res.end();
    //         });
    //     });
    // } else {
    //     res.render("login");
    // }
    if (req.isAuthenticated()) {
        pr_id = req.body.pr_id;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql_check = ("SELECT * FROM erphtml.ccs_bidding b WHERE b.PR_ID='" + pr_id + "' AND b.1000_Bidding='Y'")
            connection.query(sql_check, function (err, result, fields) {
                if (err) throw err;
                if (result.length > 0) {
                    // 1k
                    sql = "update erphtml.ccs_bidding set 1000_Result='Y', 1000_TimeUpdate=NOW(), 1000_User='" + req.user + "' where PR_ID='" + pr_id + "';";
                    connection.query(sql, function (err, result, fields) {
                        if (err) throw err;
                        connection.release();
                        res.send('done');
                        res.end();
                    });
                }
                else {
                    // 3k
                    sql = "update erphtml.ccs_bidding set 3000_Result='Y', 3000_TimeUpdate=NOW(), 3000_User='" + req.user + "' where PR_ID='" + pr_id + "';";
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

app.post('/CCS/Upload_PriceList_File', function (req, res) {
    if (req.isAuthenticated()) {
        var form = new formidable.IncomingForm();
        excelFile = '';
        form.parse(req);
        form.on('fileBegin', function (name, file) {
            excelFile = req.user + '_' + file.name;
            file.path = './public/Python/Finance/CCS/Upload/' + excelFile;
        });

        form.on('file', function (name, file) {
            var options = {
                mode: 'text',
                pythonPath: 'python',
                scriptPath: './public/Python/Finance/CCS',
                pythonOptions: ['-u'],
                args: [excelFile, process.cwd(), req.user]
            }
            let shell = new PythonShell('upload_pricelist.py', options);
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

app.post('/CCS/Upload_Receive_File', function (req, res) {
    if (req.isAuthenticated()) {
        var form = new formidable.IncomingForm();
        excelFile = '';
        form.parse(req);
        form.on('fileBegin', function (name, file) {
            excelFile = req.user + '_' + file.name;
            file.path = './public/Python/Finance/CCS/Upload/' + excelFile;
        });
        form.on('file', function (name, file) {
            var options = {
                mode: 'text',
                pythonPath: 'python',
                scriptPath: './public/Python/Finance/CCS',
                pythonOptions: ['-u'],
                args: [excelFile, process.cwd(), req.user]
            }
            let shell = new PythonShell('upload_pr_receive.py', options);
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

app.post('/CCS/Upload_Budget_File', function (req, res) {
    if (req.isAuthenticated()) {
        var form = new formidable.IncomingForm();
        excelFile = '';
        form.parse(req);
        form.on('fileBegin', function (name, file) {
            excelFile = req.user + '_' + file.name;
            file.path = './public/Python/Finance/CCS/Upload/' + excelFile;
        });

        form.on('file', function (name, file) {
            var options = {
                mode: 'text',
                pythonPath: 'python',
                scriptPath: './public/Python/Finance/CCS',
                pythonOptions: ['-u'],
                args: [excelFile, process.cwd(), req.user]
            }
            let shell = new PythonShell('upload_budget.py', options);
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

app.post('/CCS/Upload_Vendor_File', function (req, res) {
    if (req.isAuthenticated()) {
        var form = new formidable.IncomingForm();
        excelFile = '';
        form.parse(req);
        form.on('fileBegin', function (name, file) {
            excelFile = req.user + '_' + file.name;
            file.path = './public/Python/Finance/CCS/Upload/' + excelFile;
        });

        form.on('file', function (name, file) {
            var options = {
                mode: 'text',
                pythonPath: 'python',
                scriptPath: './public/Python/Finance/CCS',
                pythonOptions: ['-u'],
                args: [excelFile, process.cwd(), req.user]
            }
            let shell = new PythonShell('upload_vendor.py', options);
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

app.post('/CCS/Get_PR_Template', function (req, res) {
    if (req.isAuthenticated()) {
        pr_id = req.body.pr_id;
        var options = {
            mode: 'text',
            pythonPath: 'python',
            scriptPath: './public/Python/Finance/CCS',
            pythonOptions: ['-u'],
            args: [pr_id, process.cwd()]
        }
        let shell = new PythonShell('export_po_template.py', options);
        shell.on('message', function (message) {
            res.send(message);
            res.end();
        })
    } else {
        res.render("login");
    }
});

app.post('/CCS/Update_Estimate_Date', function (req, res) {
    if (req.isAuthenticated()) {
        PR_ID = req.body.PR_ID;
        new_date = req.body.new_date;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_request_item_temp set Estimated='" + new_date + "' where RequestID='" + PR_ID + "';";
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

app.post('/CCS/Update_Month_Estimate', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        new_month = req.body.new_month;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_order_list set Month_Estimated='" + new_month + "' where ID='" + PO_ID + "';";
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
// New develop for Budget Control
app.post('/CCS/User_cancel_PO', function (req, res) {
    if (req.isAuthenticated()) {
        var PO_ID = req.body.PO_ID;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_order_list set PO_Approve=NOW(), Status='Cancel' where ID='" + PO_ID + "';";
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                sql = "update erphtml.ccs_order_item set TimeUpdate=NOW(), StatusRequest='Cancel' where OrderID='" + PO_ID + "';";
                connection.query(sql, function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    res.send('done');
                    res.end();
                });
            });
        });
    } else {
        res.render("login");
    }

});

app.post('/CCS/Cancel_Order_Item_Temp', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        PR_ID = req.body.PR_ID;
        item = req.body.item;
        IDkey = PO_ID + ';' + PR_ID + item;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_order_item set TimeUpdate=NOW(), StatusRequest='Cancel' where ID='" + IDkey + "'";
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

app.post('/CCS/Update_Order_Item_Quantity_Reduce', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        PR_ID = req.body.PR_ID;
        item = req.body.item;
        quantity = req.body.quantity;
        IDKey = PO_ID + ";" + PR_ID;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update ccs_order_item set Quantity='" + quantity + "', OriginQuantity='" + quantity + "',LW_QTY='" + quantity + "' where ID='" + IDKey + "';";
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

app.post('/CCS/Get_PR_Received_Change_LeadTime', function (req, res) {
    if (req.isAuthenticated()) {
        PR_ID = req.body.PR_ID;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "select i.ID, i.OrderID, t.Project, l.Purchaser, t.Item, t.Vietnamese, u.Name, u.Department, i.PR_LINE, "
                + " i.LW_PO_NUMBER, i.LW_PO_LINE, i.LW_QTY, i.LW_REC_QTY, i.LW_CXL_QTY, "
                + " concat(l.Month_Estimated,'/',l.Year_Estimated) EXP_PR, concat(r.Expect_Year,'/',r.Expect_Month) EXP_MONTH, r.Expect_Qty, "
                + " r.TimeUpdate, i.Quantity,i.StatusRequest from erphtml.ccs_order_item i "
                + " inner join erphtml.ccs_order_list l on i.OrderID=l.ID "
                + " inner join erphtml.ccs_request_item_temp t on i.RequestID=t.ID "
                + " inner join erpsystem.setup_user u on i.User=u.User "
                + " left join erphtml.ccs_receive_log r ON i.OrderID=r.PR_ID  AND t.Item=r.Item"
                + " where i.OrderID='" + PR_ID + "' ORDER BY PR_LINE ASC;";
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

app.post('/CCS/Cancel_Order_Item_Temp_changeleadtime', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        PR_ID = req.body.PR_ID;
        item = req.body.item;
        IDkey = PO_ID + ';' + PR_ID + item;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_order_item set TimeUpdate=NOW(), StatusRequest='Cancel' where ID='" + IDkey + "'";
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

app.post('/CCS/Update_Order_Item_Quantity_LT', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        PR_ID = req.body.PR_ID;
        item = req.body.item;
        quantity = req.body.quantity;
        IDKey = PO_ID + ";" + PR_ID;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update ccs_order_item set Quantity='" + quantity + "', OriginQuantity='" + quantity + "',LW_QTY='" + quantity + "' where ID='" + IDKey + "';";
            // console.log(sql);
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

app.post('/CCS/Download_Received_PR', function (req, res) {
    if (req.isAuthenticated()) {
        poID = req.body.poID;
        var options = {
            mode: 'text',
            pythonPath: 'python',
            scriptPath: './public/Python/Finance/CCS',
            pythonOptions: ['-u'],
            args: [process.cwd(), poID]
        }
        let shell = new PythonShell('export_pr_receive.py', options);
        shell.on('message', function (message) {
            // res.setHeader("Content-Type", "application/json");
            res.send(message);
            res.end();
        });
    } else {
        res.render("login");
    }
});

app.post("/CCS/Order/DownloadTemPlate", function (req, res) {
    month_from = req.body.month_from;
    year_from = req.body.year_from;
    sort_dept = req.body.sort_dept;
    month_to = req.body.month_to;
    year_to = req.body.year_to;
    userName = req.user.toLowerCase();
    // console.log(userName,sort_dept,month_from,year_from,month_to,year_to)
    if (req.isAuthenticated()) {
        var options = {
            mode: 'text',
            pythonPath: 'python',
            scriptPath: './public/Python/Finance/CCS/',
            pythonOptions: ['-u'],
            args: [userName, sort_dept, month_from, year_from, month_to, year_to, process.cwd()]
        }
        let shell = new PythonShell('export_template_update_leadtime.py', options);
        shell.on('message', function (message) {
            res.send(message);
            res.end();
        });

    }
    else {
        res.end('Not Permission');

    }

});

app.post('/CCS/Upload_Receive_File/LeadTime', function (req, res) {
    if (req.isAuthenticated()) {
        var form = new formidable.IncomingForm();
        excelFile = '';
        form.parse(req);
        form.on('fileBegin', function (name, file) {
            excelFile = req.user + '_' + file.name;
            file.path = './public/Python/Finance/CCS/Upload/' + excelFile;
        });
        form.on('file', function (name, file) {
            var options = {
                mode: 'text',
                pythonPath: 'python',
                scriptPath: './public/Python/Finance/CCS',
                pythonOptions: ['-u'],
                args: [excelFile, process.cwd(), req.user]
            }
            let shell = new PythonShell('upload_change_leadtime.py', options);
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


// ===================== NO PLANT MANAGER ===============================
// Will be comine
app.post('/CCS/Bidding_Reject_SubPlant_Operation', function (req, res) {
    if (req.isAuthenticated()) {
        pr_id = req.body.pr_id;
        reason = req.body.reason;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = ("update erphtml.ccs_bidding set SubPlant_TimeUpdate=NOW(), SubPlant_Result='N', SubPlant_Note='" + reason + "', SubPlant_User='" + req.user + "',"
                + " Plant_TimeUpdate=NOW(), Plant_Result='N', Plant_Note='" + reason + "', Plant_User='" + req.user + "' where PR_ID='" + pr_id + "';");
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                sql1 = "update erphtml.ccs_request_item_temp set Sup_User='Plant_Reject' where RequestID='" + pr_id + "'";
                connection.query(sql1, function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    res.send('done');
                    res.end();
                });
            });
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/Bidding_Approve_SubPlant_Operation', function (req, res) {
    if (req.isAuthenticated()) {
        pr_id = req.body.pr_id;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = ("update erphtml.ccs_bidding set SubPlant_TimeUpdate=NOW(), SubPlant_Result='Y', SubPlant_User='" + req.user + "',"
                + "  Plant_TimeUpdate=NOW(), Plant_Result='Y', Plant_User='" + req.user + "' where PR_ID='" + pr_id + "';");
            connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                sql1 = "update erphtml.ccs_request_item_temp set Sup_User='Plant_Pass' where RequestID='" + pr_id + "'";
                connection.query(sql1, function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    res.send('done');
                    res.end();
                });
            });
        });
    } else {
        res.render("login");
    }
});

app.post('/CCS/Get_Request_PR_SubPlant_Operation_old', function (req, res) {
    if (req.isAuthenticated()) {
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "SELECT * FROM (SELECT RequestID, Project, Purchaser, Estimated, Req_status, COUNT(Item) Items, SUM(Total_Price) Total_Price, Currency, ROUND(SUM(Total_USD),2) Total_USD FROM"
                + " (SELECT i.RequestID, i.Project, i.Purchaser, i.Estimated, i.Req_status, i.Item, i.Quantity*b.Price Total_Price, b.Currency, i.Quantity*b.USD Total_USD"
                + " FROM"
                + " (SELECT * from ccs_request_item_temp"
                + " WHERE Req_Status='Bidding' AND (Sup_User='Dept_Pass' or Sup_User='Purchase_Pass' or Sup_User='Plant_Pass' or Sup_User='Operation_Pass') AND Year(Estimated)>=YEAR(CURDATE())-1) i"
                + " LEFT JOIN"
                + " (SELECT * from ccs_bidding"
                + " WHERE Sup_Result='Y'  and 1000_Result='Y' and CHECKED='Y' AND SubPlant_Result IS NULL) b ON i.RequestID=b.PR_ID AND i.Item=b.ITEM) t1 GROUP BY RequestID) a WHERE a.Total_Price>=1000"
                + " UNION ALL"
                + " SELECT * FROM (SELECT RequestID, Project, Purchaser, Estimated, Req_status, COUNT(Item) Items, SUM(Total_Price) Total_Price, Currency, ROUND(SUM(Total_USD),2) Total_USD FROM"
                + " (SELECT i.RequestID, i.Project, i.Purchaser, i.Estimated, i.Req_status, i.Item, i.Quantity*b.Price Total_Price, b.Currency, i.Quantity*b.USD Total_USD"
                + " FROM"
                + " (SELECT * from ccs_request_item_temp"
                + " WHERE Req_Status='Bidding' AND (Sup_User='Dept_Pass' or Sup_User='Purchase_Pass')) i"
                + " LEFT JOIN"
                + " (SELECT * from ccs_bidding"
                + " WHERE Sup_Result='Y' and 3000_Result='Y' and CHECKED='Y' AND Plant_Result IS NULL) b ON i.RequestID=b.PR_ID AND i.Item=b.ITEM) t1 GROUP BY RequestID) a WHERE a.Total_Price>=3000";
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

app.post('/CCS/Get_Request_PR_SubPlant_Operation', function (req, res) {
    if (req.isAuthenticated()) {
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            if (req.user.toLowerCase()=='giphan'|| req.user.toLowerCase() == 'nhtran2')
            {
                sql = "SELECT k.* FROM (SELECT * FROM (SELECT RequestID, Project, Purchaser, Estimated, Req_status, COUNT(Item) Items, SUM(Total_Price) Total_Price, Currency, ROUND(SUM(Total_USD),2) Total_USD FROM"
                + " (SELECT i.RequestID, i.Project, i.Purchaser, i.Estimated, i.Req_status, i.Item, i.Quantity*b.Price Total_Price, b.Currency, i.Quantity*b.USD Total_USD"
                + " FROM"
                + " (SELECT * from ccs_request_item_temp"
                + " WHERE Req_Status='Bidding' AND (Sup_User='Dept_Pass' or Sup_User='Purchase_Pass' or Sup_User='Plant_Pass' or Sup_User='Operation_Pass') AND Year(Estimated)>=YEAR(CURDATE())-1) i"
                + " LEFT JOIN"
                + " (SELECT * from ccs_bidding"
                + " WHERE Sup_Result='Y'  and 1000_Result='Y' and CHECKED='Y' AND SubPlant_Result IS NULL) b ON i.RequestID=b.PR_ID AND i.Item=b.ITEM) t1 GROUP BY RequestID) a WHERE a.Total_Price>=1000"
                + " UNION ALL"
                + " SELECT * FROM (SELECT RequestID, Project, Purchaser, Estimated, Req_status, COUNT(Item) Items, SUM(Total_Price) Total_Price, Currency, ROUND(SUM(Total_USD),2) Total_USD FROM"
                + " (SELECT i.RequestID, i.Project, i.Purchaser, i.Estimated, i.Req_status, i.Item, i.Quantity*b.Price Total_Price, b.Currency, i.Quantity*b.USD Total_USD"
                + " FROM"
                + " (SELECT * from ccs_request_item_temp"
                + " WHERE Req_Status='Bidding' AND (Sup_User='Dept_Pass' or Sup_User='Purchase_Pass')) i"
                + " LEFT JOIN"
                + " (SELECT * from ccs_bidding"
                + " WHERE Sup_Result='Y' and 3000_Result='Y' and CHECKED='Y' AND Plant_Result IS NULL) b ON i.RequestID=b.PR_ID AND i.Item=b.ITEM) t1 GROUP BY RequestID) a WHERE a.Total_Price>=3000) k WHERE k.RequestID LIKE 'IND%'";
            }
            else{
                sql = "SELECT k.* FROM (SELECT * FROM (SELECT RequestID, Project, Purchaser, Estimated, Req_status, COUNT(Item) Items, SUM(Total_Price) Total_Price, Currency, ROUND(SUM(Total_USD),2) Total_USD FROM"
                + " (SELECT i.RequestID, i.Project, i.Purchaser, i.Estimated, i.Req_status, i.Item, i.Quantity*b.Price Total_Price, b.Currency, i.Quantity*b.USD Total_USD"
                + " FROM"
                + " (SELECT * from ccs_request_item_temp"
                + " WHERE Req_Status='Bidding' AND (Sup_User='Dept_Pass' or Sup_User='Purchase_Pass' or Sup_User='Plant_Pass' or Sup_User='Operation_Pass') AND Year(Estimated)>=YEAR(CURDATE())) i"
                + " LEFT JOIN"
                + " (SELECT * from ccs_bidding"
                + " WHERE Sup_Result='Y'  and 3000_Result='Y' and CHECKED='Y' AND (SubPlant_Result IS NULL or Plant_Result IS NULL)) b ON i.RequestID=b.PR_ID AND i.Item=b.ITEM) t1 GROUP BY RequestID) a"
                +" ) k where k.Total_USD>=3000";
                console.log(sql);
            }
            
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

app.post('/CCS/SubPlantMng_approve_PO_Operation', function (req, res) {
    if (req.isAuthenticated()) {
        PO_ID = req.body.PO_ID;
        result = req.body.result;
        reason = req.body.reason;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "update erphtml.ccs_order_list set SubPlant_Approve=NOW(), Status='SubPlant', SubPlant_Result='" + result + "', SubPlant_User='" + req.user + "', SubPlant_Reason='" + reason + "',"
                + " PlantMng_Approve=NOW(), Status='PlantMng', PlantMng_Result='" + result + "', PlantMng_User='" + req.user + "', PlantMng_Reason='" + reason + "' where ID='" + PO_ID + "';";
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

app.post('/CCS/Load_created_PO_SubPlant_Operation_old', function (req, res) {
    if (req.isAuthenticated()) {
        month = req.body.month;
        year = req.body.year;
        console.log('month',month,'year',year)
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "select * from (select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l"
                + " left join erphtml.ccs_order_item i on l.ID=i.OrderID where (Status='SubPlant' or Status='Finance') and HeadDept_Result='Y' and OperationMng_Result='Y'"
                + " and Finance_Result='Y' and SubPlant_Result='Y' and (i.DeptResult is null or i.DeptResult!='N') and (i.FinanceResult is null or i.FinanceResult!='N')  group by l.ID) t1"
                + " where TOTAL_USD>=3000 or ((OverBudget='Y' OR Urgent='Y') AND TOTAL_USD >=3000)"
                + " UNION ALL"
                + " select * from (select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l"
                + " left join erphtml.ccs_order_item i on l.ID=i.OrderID where (Status='OperationMng' or Status='Finance') and HeadDept_Result='Y' and OperationMng_Result='Y'"
                + " and Finance_Result='Y' and (i.DeptResult is null or i.DeptResult!='N') and (i.FinanceResult is null or i.FinanceResult!='N')  group by l.ID) t1"
                + " where (TOTAL_USD>=1000) OR ((OverBudget='Y' OR Urgent='Y') AND TOTAL_USD <3000 AND TOTAL_USD>=1000) OR ((OverBudget='Y' OR Urgent='Y') AND TOTAL_USD >3000)"
            
            console.log(sql)
            
                connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send(result);
                res.end();
            });
        });
    }
    else {
        res.render("login");
    }
});

// app.post('/CCS/Load_created_PO_SubPlant_Operation', function (req, res) {
//     if (req.isAuthenticated()) {
//         month = req.body.month;
//         year = req.body.year;
//         con3.getConnection(function (err, connection) {
//             if (err) {
//                 throw err;
//             }
//             if (req.user.toLowerCase()=='giphan'|| req.user.toLowerCase() == 'nhtran2')
//             {
//                 sql = "select k.* from (select * from (select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l"
//                     + " left join erphtml.ccs_order_item i on l.ID=i.OrderID where (Status='SubPlant' or Status='Finance') and HeadDept_Result='Y' and OperationMng_Result='Y'"
//                     + " and Finance_Result='Y' and SubPlant_Result='Y' and (i.DeptResult is null or i.DeptResult!='N') and (i.FinanceResult is null or i.FinanceResult!='N')  group by l.ID) t1"
//                     + " where TOTAL_USD>=3000 or ((OverBudget='Y' OR Urgent='Y') AND TOTAL_USD >=3000)"
//                     + " UNION ALL"
//                     + " select * from (select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l"
//                     + " left join erphtml.ccs_order_item i on l.ID=i.OrderID where (Status='OperationMng' or Status='Finance') and HeadDept_Result='Y' and OperationMng_Result='Y'"
//                     + " and Finance_Result='Y' and (i.DeptResult is null or i.DeptResult!='N') and (i.FinanceResult is null or i.FinanceResult!='N')  group by l.ID) t1"
//                     + " where (TOTAL_USD>=1000) OR ((OverBudget='Y' OR Urgent='Y') AND TOTAL_USD <3000 AND TOTAL_USD>=1000) OR ((OverBudget='Y' OR Urgent='Y') AND TOTAL_USD >3000)) k WHERE k.ID LIKE 'IND%'"
//             }
//             else{
//                 sql = "select k.* from (select * from (select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l"
//                     + " left join erphtml.ccs_order_item i on l.ID=i.OrderID where (Status='SubPlant' or Status='Finance') and HeadDept_Result='Y' and OperationMng_Result='Y'"
//                     + " and Finance_Result='Y' and SubPlant_Result='Y' and (i.DeptResult is null or i.DeptResult!='N') and (i.FinanceResult is null or i.FinanceResult!='N')  group by l.ID) t1"
//                     + " where TOTAL_USD>=3000 or ((OverBudget='Y' OR Urgent='Y') AND TOTAL_USD >=3000)"
//                     + " UNION ALL"
//                     + " select * from (select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l"
//                     + " left join erphtml.ccs_order_item i on l.ID=i.OrderID where (Status='OperationMng' or Status='Finance') and HeadDept_Result='Y' and OperationMng_Result='Y'"
//                     + " and Finance_Result='Y' and (i.DeptResult is null or i.DeptResult!='N') and (i.FinanceResult is null or i.FinanceResult!='N')  group by l.ID) t1"
//                     + " where (TOTAL_USD>=1000) OR ((OverBudget='Y' OR Urgent='Y') AND TOTAL_USD <3000 AND TOTAL_USD>=1000) OR ((OverBudget='Y' OR Urgent='Y') AND TOTAL_USD >3000)) k WHERE k.ID NOT LIKE 'IND%'"
//             }
//             connection.query(sql, function (err, result, fields) {
//                 connection.release();
//                 if (err) throw err;
//                 res.send(result);
//                 res.end();
//             });
//         });
//     }
//     else {
//         res.render("login");
//     }
// });


app.post('/CCS/Load_created_PO_SubPlant_Operation', function (req, res) {
    if (req.isAuthenticated()) {
        month = req.body.month;
        year = req.body.year;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            // if (req.user.toLowerCase()=='giphan'|| req.user.toLowerCase() == 'nhtran2')
            // {
            //     sql = "select k.* from (select * from (select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l"
            //         + " left join erphtml.ccs_order_item i on l.ID=i.OrderID where (Status='SubPlant' or Status='Finance') and HeadDept_Result='Y' and OperationMng_Result='Y'"
            //         + " and Finance_Result='Y' and SubPlant_Result='Y' and (i.DeptResult is null or i.DeptResult!='N') and (i.FinanceResult is null or i.FinanceResult!='N')  group by l.ID) t1"
            //         + " where TOTAL_USD>=3000 or ((OverBudget='Y' OR Urgent='Y') AND TOTAL_USD >=3000)"
            //         + " UNION ALL"
            //         + " select * from (select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l"
            //         + " left join erphtml.ccs_order_item i on l.ID=i.OrderID where (Status='OperationMng' or Status='Finance') and HeadDept_Result='Y' and OperationMng_Result='Y'"
            //         + " and Finance_Result='Y' and (i.DeptResult is null or i.DeptResult!='N') and (i.FinanceResult is null or i.FinanceResult!='N')  group by l.ID) t1"
            //         + " where (TOTAL_USD>=1000) OR ((OverBudget='Y' OR Urgent='Y') AND TOTAL_USD <3000 AND TOTAL_USD>=1000) OR ((OverBudget='Y' OR Urgent='Y') AND TOTAL_USD >3000)) k WHERE k.ID LIKE 'IND%'"
            // }
            // else{
            //     sql = "select k.* from (select * from (select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l"
            //         + " left join erphtml.ccs_order_item i on l.ID=i.OrderID where (Status='SubPlant' or Status='Finance') and HeadDept_Result='Y' and OperationMng_Result='Y'"
            //         + " and Finance_Result='Y' and SubPlant_Result='Y' and (i.DeptResult is null or i.DeptResult!='N') and (i.FinanceResult is null or i.FinanceResult!='N')  group by l.ID) t1"
            //         + " where TOTAL_USD>=3000 or ((OverBudget='Y' OR Urgent='Y') AND TOTAL_USD >=3000)"
            //         + " UNION ALL"
            //         + " select * from (select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l"
            //         + " left join erphtml.ccs_order_item i on l.ID=i.OrderID where (Status='OperationMng' or Status='Finance') and HeadDept_Result='Y' and OperationMng_Result='Y'"
            //         + " and Finance_Result='Y' and (i.DeptResult is null or i.DeptResult!='N') and (i.FinanceResult is null or i.FinanceResult!='N')  group by l.ID) t1"
            //         + " where (TOTAL_USD>=1000) OR ((OverBudget='Y' OR Urgent='Y') AND TOTAL_USD <3000 AND TOTAL_USD>=1000) OR ((OverBudget='Y' OR Urgent='Y') AND TOTAL_USD >3000)) k WHERE k.ID NOT LIKE 'IND%'"
            
            // }
            sql=("SELECT k.* FROM"
                +" (select l.*, COUNT(i.ID) ITEMS, SUM(i.Quantity*i.ActualPrice) TOTAL, SUM(i.Quantity*i.USD) TOTAL_USD, i.Currency from erphtml.ccs_order_list l"
                +" left join erphtml.ccs_order_item i on l.ID=i.OrderID WHERE ((Status='SubPlant' or Status='Finance') and HeadDept_Result='Y' AND Urgent='N'"
                +" and Finance_Result='Y' AND OverBudget='Y' )"
                +" OR (Status='Dept' AND HeadDept_Result='Y' AND Urgent='Y' AND OverBudget='Y') group by l.ID) k WHERE k.TOTAL_USD>0");

            console.log(sql);
            connection.query(sql, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.send(result);
                res.end();
            });
        });
    }
    else {
        res.render("login");
    }
});

module.exports = app;
