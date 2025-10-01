var mysql = require('mysql');
require('log-timestamp');
// Python
const { PythonShell } = require("python-shell");
var con1 = mysql.createPool({
    connectionLimit: 500,
    host: 'pbvweb01v',
    user: 'tranmung',
    password: 'Tr6nM6ng',
    database: 'linebalancing',
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
    user: 'tranmung',
    password: 'Tr6nM6ng',
    database: 'cutting_system',
    authPlugins: {
        mysql_clear_password: () => () => Buffer.from('your_password') // Provide the password as a Buffer
    }
});

var express = require("express");
var app = express.Router();
var formidable = require('formidable');
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
                // dept=result[0].Department;
                return callback(result);
            }
        });
    });
    return dept;
}
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

app.get("/CCS/Purchasing", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("CCS/Purchasing");
    }
    else {
        res.render("login");
    }
});

app.get("/CCS/Currency", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("CCS/CurrencyRate");
    }
    else {
        res.render("login");
    }
});
app.post("/CCS/Currency", function (req, res) {
    if (req.isAuthenticated()) {
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "SELECT * FROM erphtml.ccs_currency_rate ORDER BY TimeUpdate DESC limit 1";
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

function getCurrentDate() {
    const currentDate = new Date(); // creates a new Date object with the current date and time
    const year = currentDate.getFullYear(); // gets the current year (e.g. 2023)
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // gets the current month (0-11) and pads it with a leading zero if necessary (e.g. "04" for April)
    const day = String(currentDate.getDate()).padStart(2, '0'); // gets the current day of the month (1-31) and pads it with a leading zero if necessary (e.g. "22")
    const hours = String(currentDate.getHours()).padStart(2, '0'); // gets the current hour (0-23) and pads it with a leading zero if necessary (e.g. "13" for 1 PM)
    const minutes = String(currentDate.getMinutes()).padStart(2, '0'); // gets the current minute (0-59) and pads it with a leading zero if necessary (e.g. "23")
    const seconds = String(currentDate.getSeconds()).padStart(2, '0'); // gets the current second (0-59) and pads it with a leading zero if necessary (e.g. "45")
    const formattedDateTime = `${year}${month}${day}_${hours}${minutes}`; // concatenates the components together in the desired format
    return formattedDateTime

}

app.post('/CCS/UpdateCurrency', function (req, res) {
    if (req.isAuthenticated()) {
        rate_eur = req.body.rate_eur;
        rate_vnd = req.body.rate_vnd;
        if (req.user.toLowerCase() == 'tathi') {
            con3.getConnection(function (err, connection) {
                if (err) {
                    throw err;
                }

                var username = req.user.toLowerCase();
                var curDate = getCurrentDate();
                Keycurency = username + '_' + curDate
                sql = "insert into erphtml.ccs_currency_rate (CurrentVND,EUR,USD,UserUpdate,TimeUpdate,KeyCurency) VALUES ('" + rate_vnd + "','" + rate_eur + "','1','" + username + "',now(),'" + Keycurency + "')";
                connection.query(sql, function (err, result, fields) {
                    connection.release();
                    if (err) {
                        res.send({ 'result': 'fail' });
                        res.end();

                    }
                    else {
                        res.send({ 'result': 'done' });
                        res.end();
                    }
                });
            });
        }
        else {
            res.send({ 'result': 'permit' });
            res.end();
        }
    } else {
        res.render("login");
    }

});

app.get("/CCS/PurchaseOrder", function (req, res) {

    if (req.isAuthenticated()) {
        res.render("CCS/PurchaseOrder");
    }
    else {
        res.render("login");
    }
});

app.get("/CCS/Budget", function (req, res) {

    if (req.isAuthenticated()) {
        res.render("CCS/Budget");
    }
    else {
        res.render("login");
    }

});
app.post("/CSS/Budget/byDepart", function (req, res) {

    if (req.isAuthenticated()) {
        month = req.body.month;
        year = req.body.year;
        sort_dept = req.body.sort_dept;
        account = req.body.AccountName;
        get_dept(req.user, function (result) {
            dept = get_right_dept(result[0].Department).substring(0, 3);

            con3.getConnection(function (err, connection) {
                if (err) {
                    throw err;
                }
                if (sort_dept == 0) {
                    if (account == 0) {
                        if (month == 0) {
                            sql = ("SELECT s.*,temp.English FROM (SELECT i.RequestID,i.OrderID,i.PR_LINE,i.ID,i.Quantity,i.USD,i.ActualPrice,i.Currency,i.LW_COMPANY,i.LW_LOCATION,i.LW_PO_NUMBER,"
                                + " i.LW_PO_LINE,i.LW_RQ_NUMBER,i.LW_RQ_LINE,i.LW_QTY,i.LW_REC_QTY,i.LW_CXL_QTY,i.LW_PO_DATE,i.LW_EARLY_DL_DATE,i.LW_CLOSE_DATE,i.TimeUpdate,i.User,i.Note,l.Month_Estimated,"
                                + " l.Year_Estimated,l.Category,l.ProjectName,l.AccountName,l.Purchaser,l.`Status`,l.Urgent,l.Urgent_Note,l.OverBudget,l.OverBudget_Note,l.Over3000,l.Over3000_Note,ROUND(i.USD*i.Quantity,2) AS AmountUSD,"
                                + " ROUND(IFNULL(i.LW_REC_QTY, 0)*IFNULL(i.USD, 0),2)AS ReceptUSD,ROUND(IFNULL(i.LW_CXL_QTY, 0)*IFNULL(i.USD, 0),2)AS CancelUSD,ROUND((i.USD*i.Quantity-IFNULL(i.LW_REC_QTY, 0)*IFNULL(i.USD, 0)-IFNULL(i.LW_CXL_QTY, 0)*IFNULL(i.USD, 0)),2) AS ON_GOING"
                                + " FROM  erphtml.ccs_order_item i"
                                + " LEFT JOIN  erphtml.ccs_order_list l ON l.ID=i.OrderID) s"
                                + " LEFT JOIN erphtml.ccs_request_item_temp temp ON temp.ID=s.RequestID  WHERE s.Month_Estimated='" + month + "' AND s.Year_Estimated='" + year + "';");

                        }
                        else {
                            sql = ("SELECT s.*,temp.English FROM (SELECT i.RequestID,i.OrderID,i.PR_LINE,i.ID,i.Quantity,i.USD,i.ActualPrice,i.Currency,i.LW_COMPANY,i.LW_LOCATION,i.LW_PO_NUMBER,"
                                + " i.LW_PO_LINE,i.LW_RQ_NUMBER,i.LW_RQ_LINE,i.LW_QTY,i.LW_REC_QTY,i.LW_CXL_QTY,i.LW_PO_DATE,i.LW_EARLY_DL_DATE,i.LW_CLOSE_DATE,i.TimeUpdate,i.User,i.Note,l.Month_Estimated,"
                                + " l.Year_Estimated,l.Category,l.ProjectName,l.AccountName,l.Purchaser,l.`Status`,l.Urgent,l.Urgent_Note,l.OverBudget,l.OverBudget_Note,l.Over3000,l.Over3000_Note,ROUND(i.USD*i.Quantity,2) AS AmountUSD,"
                                + " ROUND(IFNULL(i.LW_REC_QTY, 0)*IFNULL(i.USD, 0),2)AS ReceptUSD,ROUND(IFNULL(i.LW_CXL_QTY, 0)*IFNULL(i.USD, 0),2)AS CancelUSD,ROUND((i.USD*i.Quantity-IFNULL(i.LW_REC_QTY, 0)*IFNULL(i.USD, 0)-IFNULL(i.LW_CXL_QTY, 0)*IFNULL(i.USD, 0)),2) AS ON_GOING"
                                + " FROM  erphtml.ccs_order_item i"
                                + " LEFT JOIN  erphtml.ccs_order_list l ON l.ID=i.OrderID) s"
                                + " LEFT JOIN erphtml.ccs_request_item_temp temp ON temp.ID=s.RequestID  WHERE s.Month_Estimated='" + month + "' AND s.Year_Estimated='" + year + "';");

                        }

                    }
                    else {
                        if (month == 0) {
                            sql = ("SELECT s.*,temp.English FROM (SELECT i.RequestID,i.OrderID,i.PR_LINE,i.ID,i.Quantity,i.USD,i.ActualPrice,i.Currency,i.LW_COMPANY,i.LW_LOCATION,i.LW_PO_NUMBER,"
                                + " i.LW_PO_LINE,i.LW_RQ_NUMBER,i.LW_RQ_LINE,i.LW_QTY,i.LW_REC_QTY,i.LW_CXL_QTY,i.LW_PO_DATE,i.LW_EARLY_DL_DATE,i.LW_CLOSE_DATE,i.TimeUpdate,i.User,i.Note,l.Month_Estimated,"
                                + " l.Year_Estimated,l.Category,l.ProjectName,l.AccountName,l.Purchaser,l.`Status`,l.Urgent,l.Urgent_Note,l.OverBudget,l.OverBudget_Note,l.Over3000,l.Over3000_Note,ROUND(i.USD*i.Quantity,2) AS AmountUSD,"
                                + " ROUND(IFNULL(i.LW_REC_QTY, 0)*IFNULL(i.USD, 0),2)AS ReceptUSD,ROUND(IFNULL(i.LW_CXL_QTY, 0)*IFNULL(i.USD, 0),2)AS CancelUSD,ROUND((i.USD*i.Quantity-IFNULL(i.LW_REC_QTY, 0)*IFNULL(i.USD, 0)-IFNULL(i.LW_CXL_QTY, 0)*IFNULL(i.USD, 0)),2) AS ON_GOING"
                                + " FROM  erphtml.ccs_order_item i"
                                + " LEFT JOIN  erphtml.ccs_order_list l ON l.ID=i.OrderID) s"
                                + " LEFT JOIN erphtml.ccs_request_item_temp temp ON temp.ID=s.RequestID  WHERE s.Year_Estimated='" + year + "' AND s.AccountName ='" + account + "';");

                        }
                        else {
                            sql = ("SELECT s.*,temp.English FROM (SELECT i.RequestID,i.OrderID,i.PR_LINE,i.ID,i.Quantity,i.USD,i.ActualPrice,i.Currency,i.LW_COMPANY,i.LW_LOCATION,i.LW_PO_NUMBER,"
                                + " i.LW_PO_LINE,i.LW_RQ_NUMBER,i.LW_RQ_LINE,i.LW_QTY,i.LW_REC_QTY,i.LW_CXL_QTY,i.LW_PO_DATE,i.LW_EARLY_DL_DATE,i.LW_CLOSE_DATE,i.TimeUpdate,i.User,i.Note,l.Month_Estimated,"
                                + " l.Year_Estimated,l.Category,l.ProjectName,l.AccountName,l.Purchaser,l.`Status`,l.Urgent,l.Urgent_Note,l.OverBudget,l.OverBudget_Note,l.Over3000,l.Over3000_Note,ROUND(i.USD*i.Quantity,2) AS AmountUSD,"
                                + " ROUND(IFNULL(i.LW_REC_QTY, 0)*IFNULL(i.USD, 0),2)AS ReceptUSD,ROUND(IFNULL(i.LW_CXL_QTY, 0)*IFNULL(i.USD, 0),2)AS CancelUSD,ROUND((i.USD*i.Quantity-IFNULL(i.LW_REC_QTY, 0)*IFNULL(i.USD, 0)-IFNULL(i.LW_CXL_QTY, 0)*IFNULL(i.USD, 0)),2) AS ON_GOING"
                                + " FROM  erphtml.ccs_order_item i"
                                + " LEFT JOIN  erphtml.ccs_order_list l ON l.ID=i.OrderID) s"
                                + " LEFT JOIN erphtml.ccs_request_item_temp temp ON temp.ID=s.RequestID  WHERE s.Month_Estimated='" + month + "' AND s.Year_Estimated='" + year + "' AND s.AccountName ='" + account + "';");
                        }

                    }

                }
                else {
                    if (account == 0) {
                        if (month == 0) {
                            sql = ("SELECT s.*,temp.English FROM (SELECT i.RequestID,i.OrderID,i.PR_LINE,i.ID,i.Quantity,i.USD,i.ActualPrice,i.Currency,i.LW_COMPANY,i.LW_LOCATION,i.LW_PO_NUMBER,"
                                + " i.LW_PO_LINE,i.LW_RQ_NUMBER,i.LW_RQ_LINE,i.LW_QTY,i.LW_REC_QTY,i.LW_CXL_QTY,i.LW_PO_DATE,i.LW_EARLY_DL_DATE,i.LW_CLOSE_DATE,i.TimeUpdate,i.User,i.Note,l.Month_Estimated,"
                                + " l.Year_Estimated,l.Category,l.ProjectName,l.AccountName,l.Purchaser,l.`Status`,l.Urgent,l.Urgent_Note,l.OverBudget,l.OverBudget_Note,l.Over3000,l.Over3000_Note,ROUND(i.USD*i.Quantity,2) AS AmountUSD,"
                                + " ROUND(IFNULL(i.LW_REC_QTY, 0)*IFNULL(i.USD, 0),2)AS ReceptUSD,ROUND(IFNULL(i.LW_CXL_QTY, 0)*IFNULL(i.USD, 0),2)AS CancelUSD,ROUND((i.USD*i.Quantity-IFNULL(i.LW_REC_QTY, 0)*IFNULL(i.USD, 0)-IFNULL(i.LW_CXL_QTY, 0)*IFNULL(i.USD, 0)),2) AS ON_GOING"
                                + " FROM  erphtml.ccs_order_item i"
                                + " LEFT JOIN  erphtml.ccs_order_list l ON l.ID=i.OrderID) s"
                                + " LEFT JOIN erphtml.ccs_request_item_temp temp ON temp.ID=s.RequestID  WHERE s.Year_Estimated='" + year + "' AND s.OrderID LIKE '" + sort_dept + "%';");

                        }
                        else {
                            sql = ("SELECT s.*,temp.English FROM (SELECT i.RequestID,i.OrderID,i.PR_LINE,i.ID,i.Quantity,i.USD,i.ActualPrice,i.Currency,i.LW_COMPANY,i.LW_LOCATION,i.LW_PO_NUMBER,"
                                + " i.LW_PO_LINE,i.LW_RQ_NUMBER,i.LW_RQ_LINE,i.LW_QTY,i.LW_REC_QTY,i.LW_CXL_QTY,i.LW_PO_DATE,i.LW_EARLY_DL_DATE,i.LW_CLOSE_DATE,i.TimeUpdate,i.User,i.Note,l.Month_Estimated,"
                                + " l.Year_Estimated,l.Category,l.ProjectName,l.AccountName,l.Purchaser,l.`Status`,l.Urgent,l.Urgent_Note,l.OverBudget,l.OverBudget_Note,l.Over3000,l.Over3000_Note,ROUND(i.USD*i.Quantity,2) AS AmountUSD,"
                                + " ROUND(IFNULL(i.LW_REC_QTY, 0)*IFNULL(i.USD, 0),2)AS ReceptUSD,ROUND(IFNULL(i.LW_CXL_QTY, 0)*IFNULL(i.USD, 0),2)AS CancelUSD,ROUND((i.USD*i.Quantity-IFNULL(i.LW_REC_QTY, 0)*IFNULL(i.USD, 0)-IFNULL(i.LW_CXL_QTY, 0)*IFNULL(i.USD, 0)),2) AS ON_GOING"
                                + " FROM  erphtml.ccs_order_item i"
                                + " LEFT JOIN  erphtml.ccs_order_list l ON l.ID=i.OrderID) s"
                                + " LEFT JOIN erphtml.ccs_request_item_temp temp ON temp.ID=s.RequestID  WHERE s.Month_Estimated='" + month + "' AND s.Year_Estimated='" + year + "' AND s.OrderID LIKE '" + sort_dept + "%';");
                        }


                    }
                    else {
                        if (month == 0) {
                            sql = ("SELECT s.*,temp.English FROM (SELECT i.RequestID,i.OrderID,i.PR_LINE,i.ID,i.Quantity,i.USD,i.ActualPrice,i.Currency,i.LW_COMPANY,i.LW_LOCATION,i.LW_PO_NUMBER,"
                                + " i.LW_PO_LINE,i.LW_RQ_NUMBER,i.LW_RQ_LINE,i.LW_QTY,i.LW_REC_QTY,i.LW_CXL_QTY,i.LW_PO_DATE,i.LW_EARLY_DL_DATE,i.LW_CLOSE_DATE,i.TimeUpdate,i.User,i.Note,l.Month_Estimated,"
                                + " l.Year_Estimated,l.Category,l.ProjectName,l.AccountName,l.Purchaser,l.`Status`,l.Urgent,l.Urgent_Note,l.OverBudget,l.OverBudget_Note,l.Over3000,l.Over3000_Note,ROUND(i.USD*i.Quantity,2) AS AmountUSD,"
                                + " ROUND(IFNULL(i.LW_REC_QTY, 0)*IFNULL(i.USD, 0),2)AS ReceptUSD,ROUND(IFNULL(i.LW_CXL_QTY, 0)*IFNULL(i.USD, 0),2)AS CancelUSD,ROUND((i.USD*i.Quantity-IFNULL(i.LW_REC_QTY, 0)*IFNULL(i.USD, 0)-IFNULL(i.LW_CXL_QTY, 0)*IFNULL(i.USD, 0)),2) AS ON_GOING"
                                + " FROM  erphtml.ccs_order_item i"
                                + " LEFT JOIN  erphtml.ccs_order_list l ON l.ID=i.OrderID) s"
                                + " LEFT JOIN erphtml.ccs_request_item_temp temp ON temp.ID=s.RequestID  WHERE s.Year_Estimated='" + year + "' AND s.AccountName ='" + account + "' AND s.OrderID LIKE '" + sort_dept + "%';");

                        }
                        else {
                            sql = ("SELECT s.*,temp.English FROM (SELECT i.RequestID,i.OrderID,i.PR_LINE,i.ID,i.Quantity,i.USD,i.ActualPrice,i.Currency,i.LW_COMPANY,i.LW_LOCATION,i.LW_PO_NUMBER,"
                                + " i.LW_PO_LINE,i.LW_RQ_NUMBER,i.LW_RQ_LINE,i.LW_QTY,i.LW_REC_QTY,i.LW_CXL_QTY,i.LW_PO_DATE,i.LW_EARLY_DL_DATE,i.LW_CLOSE_DATE,i.TimeUpdate,i.User,i.Note,l.Month_Estimated,"
                                + " l.Year_Estimated,l.Category,l.ProjectName,l.AccountName,l.Purchaser,l.`Status`,l.Urgent,l.Urgent_Note,l.OverBudget,l.OverBudget_Note,l.Over3000,l.Over3000_Note,ROUND(i.USD*i.Quantity,2) AS AmountUSD,"
                                + " ROUND(IFNULL(i.LW_REC_QTY, 0)*IFNULL(i.USD, 0),2)AS ReceptUSD,ROUND(IFNULL(i.LW_CXL_QTY, 0)*IFNULL(i.USD, 0),2)AS CancelUSD,ROUND((i.USD*i.Quantity-IFNULL(i.LW_REC_QTY, 0)*IFNULL(i.USD, 0)-IFNULL(i.LW_CXL_QTY, 0)*IFNULL(i.USD, 0)),2) AS ON_GOING"
                                + " FROM  erphtml.ccs_order_item i"
                                + " LEFT JOIN  erphtml.ccs_order_list l ON l.ID=i.OrderID) s"
                                + " LEFT JOIN erphtml.ccs_request_item_temp temp ON temp.ID=s.RequestID  WHERE s.Month_Estimated='" + month + "' AND s.Year_Estimated='" + year + "' AND s.AccountName ='" + account + "' AND s.OrderID LIKE '" + sort_dept + "%';");

                        }

                    }

                }
                connection.query(sql, function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    if (result.length > 0) {
                        res.send(result);
                        res.end();
                    }
                    else {
                        res.send({ result: 'empty' });
                        res.end();
                    }

                });
            });
        });
    }
    else {
        res.render("login");
    }
});
app.post("/CCS/Budget/Download", function (req, res) {

    if (req.isAuthenticated()) {
        month_from = req.body.month_from;
        year_from = req.body.year_from;
        sort_dept = req.body.sort_dept;
        month_to = req.body.month_to;
        year_to = req.body.year_to;
        userName = req.user.toLowerCase();
        var options = {
            mode: 'text',
            pythonPath: 'python',
            scriptPath: './public/downloadCCS/runPython/',
            pythonOptions: ['-u'],
            args: [userName, sort_dept, month_from, year_from, month_to, year_to]
        }
        let shell = new PythonShell('report_Budget.py', options);
        shell.on('message', function (message) {
            res.send(message);
            res.end();
        });

    }
    else {
        res.end('Not Permission');

    }

});
app.post("/CCS/Bidding/Download", function (req, res) {

    if (req.isAuthenticated()) {
        var PR_ID = req.body.PR_ID;
        var PRBidding = req.body.PRBidding
        var userName = req.user.toLowerCase();
        var options = {
            mode: 'text',
            pythonPath: 'python',
            scriptPath: './public/downloadCCS/runPython/',
            pythonOptions: ['-u'],
            args: [userName, PR_ID, PRBidding]
        }
        let shell = new PythonShell('Bidding_Download.py', options);
        shell.on('message', function (message) {
            res.send(message);
            res.end();
        });

    }
    else {
        res.end('Not Permission');

    }

});

app.post("/CCS/PurchaseOrder/Download", function (req, res) {


    if (req.isAuthenticated()) {
        userName = req.user.toLowerCase();
        month_from = req.body.month_from;
        year_from = req.body.year_from;
        sort_dept = req.body.sort_dept;
        month_to = req.body.month_to;
        year_to = req.body.year_to;
        var options = {
            mode: 'text',
            pythonPath: 'python',
            scriptPath: './public/downloadCCS/runPython/',
            pythonOptions: ['-u'],
            args: [userName, sort_dept, month_from, year_from, month_to, year_to]
        }
        let shell = new PythonShell('report_PurchaseOrder.py', options);
        shell.on('message', function (message) {
            res.send(message);
            res.end();
        });

    }
    else {
        res.end('Not Permission');

    }

});

app.post("/CSS/Budget", function (req, res) {


    if (req.isAuthenticated()) {
        month = req.body.month;
        year = req.body.year;
        sort_dept = req.body.sort_dept;
        account = req.body.AccountName;
        get_dept(req.user, function (result) {
            dept = get_right_dept(result[0].Department).substring(0, 3);
            con3.getConnection(function (err, connection) {
                if (err) {
                    throw err;
                }
                if (sort_dept == 0) {
                    if (account == 0) {
                        if (month == 0) {
                            sql = "SELECT n.*,ROUND(IFNULL(n.Spend_USD, 0)-IFNULL(Receve_USD, 0)-IFNULL(Cancel_USD, 0),2) AS ON_GOING,ROUND(n.BUDGET-IFNULL(Receve_USD, 0)-IFNULL(Cancel_USD, 0),2) AS BALANCE from"
                                + " (SELECT h.*,b.* FROM (SELECT k.AccountName,k.Month_Estimated,k.Year_Estimated,ROUND (SUM(k.AmountUSD),2) AS Spend_USD,ROUND(SUM(k.Receve),2) as Receve_USD,ROUND(SUM(k.Cancel),2) as Cancel_USD"
                                + " FROM (SELECT s.*,temp.English FROM (SELECT i.RequestID,i.OrderID,i.PR_LINE,i.ID,i.Quantity,i.ActualPrice,i.Currency,i.USD*i.Quantity AS AmountUSD,"
                                + " i.LW_REC_QTY*i.USD AS Receve,i.LW_CXL_QTY*i.USD AS Cancel,i.LW_COMPANY,i.LW_LOCATION,i.LW_PO_NUMBER,"
                                + " i.LW_PO_LINE,i.LW_RQ_NUMBER,i.LW_RQ_LINE,i.LW_QTY,i.LW_REC_QTY,i.LW_CXL_QTY,i.LW_PO_DATE,i.LW_EARLY_DL_DATE,i.LW_CLOSE_DATE,i.TimeUpdate,"
                                + " i.User,i.Note,l.Month_Estimated,l.Year_Estimated,l.Category,l.ProjectName,l.AccountName,l.Purchaser,l.`Status`,l.Urgent,l.Urgent_Note,l.OverBudget,l.OverBudget_Note,l.Over3000,l.Over3000_Note"
                                + " FROM  erphtml.ccs_order_item i"
                                + " LEFT JOIN  erphtml.ccs_order_list l ON l.ID=i.OrderID) s"
                                + " LEFT JOIN erphtml.ccs_request_item_temp temp ON temp.ID=s.RequestID) k WHERE k.Year_Estimated='" + year + "' GROUP BY k.AccountName,"
                                + "  K.Month_Estimated,k.Year_Estimated) h"
                                + " INNER JOIN (SELECT * from erphtml.ccs_budget) b ON b.code=h.AccountName AND b.month=h.Month_Estimated AND b.year=h.Year_Estimated) n;"

                        }
                        else {
                            sql = "SELECT n.*,ROUND(IFNULL(n.Spend_USD, 0)-IFNULL(Receve_USD, 0)-IFNULL(Cancel_USD, 0),2) AS ON_GOING,ROUND(n.BUDGET-IFNULL(Receve_USD, 0)-IFNULL(Cancel_USD, 0),2) AS BALANCE from"
                                + " (SELECT h.*,b.* FROM (SELECT k.AccountName,k.Month_Estimated,k.Year_Estimated,ROUND (SUM(k.AmountUSD),2) AS Spend_USD,ROUND(SUM(k.Receve),2) as Receve_USD,ROUND(SUM(k.Cancel),2) as Cancel_USD"
                                + " FROM (SELECT s.*,temp.English FROM (SELECT i.RequestID,i.OrderID,i.PR_LINE,i.ID,i.Quantity,i.ActualPrice,i.Currency,i.USD*i.Quantity AS AmountUSD,"
                                + " i.LW_REC_QTY*i.USD AS Receve,i.LW_CXL_QTY*i.USD AS Cancel,i.LW_COMPANY,i.LW_LOCATION,i.LW_PO_NUMBER,"
                                + " i.LW_PO_LINE,i.LW_RQ_NUMBER,i.LW_RQ_LINE,i.LW_QTY,i.LW_REC_QTY,i.LW_CXL_QTY,i.LW_PO_DATE,i.LW_EARLY_DL_DATE,i.LW_CLOSE_DATE,i.TimeUpdate,"
                                + " i.User,i.Note,l.Month_Estimated,l.Year_Estimated,l.Category,l.ProjectName,l.AccountName,l.Purchaser,l.`Status`,l.Urgent,l.Urgent_Note,l.OverBudget,l.OverBudget_Note,l.Over3000,l.Over3000_Note"
                                + " FROM  erphtml.ccs_order_item i"
                                + " LEFT JOIN  erphtml.ccs_order_list l ON l.ID=i.OrderID) s"
                                + " LEFT JOIN erphtml.ccs_request_item_temp temp ON temp.ID=s.RequestID) k WHERE  k.Month_Estimated='" + month + "' AND k.Year_Estimated='" + year + "' GROUP BY k.AccountName,"
                                + "  K.Month_Estimated,k.Year_Estimated) h"
                                + " INNER JOIN (SELECT * from erphtml.ccs_budget) b ON b.code=h.AccountName AND b.month=h.Month_Estimated AND b.year=h.Year_Estimated ) n;"

                        }

                    }
                    else {
                        if (month == 0) {
                            sql = "SELECT n.*,ROUND(IFNULL(n.Spend_USD, 0)-IFNULL(Receve_USD, 0)-IFNULL(Cancel_USD, 0),2) AS ON_GOING,ROUND(n.BUDGET-IFNULL(Receve_USD, 0)-IFNULL(Cancel_USD, 0),2) AS BALANCE from"
                                + " (SELECT h.*,b.* FROM (SELECT k.AccountName,k.Month_Estimated,k.Year_Estimated,ROUND (SUM(k.AmountUSD),2) AS Spend_USD,ROUND(SUM(k.Receve),2) as Receve_USD,ROUND(SUM(k.Cancel),2) as Cancel_USD"
                                + " FROM (SELECT s.*,temp.English FROM (SELECT i.RequestID,i.OrderID,i.PR_LINE,i.ID,i.Quantity,i.ActualPrice,i.Currency,i.USD*i.Quantity AS AmountUSD,"
                                + " i.LW_REC_QTY*i.USD AS Receve,i.LW_CXL_QTY*i.USD AS Cancel,i.LW_COMPANY,i.LW_LOCATION,i.LW_PO_NUMBER,"
                                + " i.LW_PO_LINE,i.LW_RQ_NUMBER,i.LW_RQ_LINE,i.LW_QTY,i.LW_REC_QTY,i.LW_CXL_QTY,i.LW_PO_DATE,i.LW_EARLY_DL_DATE,i.LW_CLOSE_DATE,i.TimeUpdate,"
                                + " i.User,i.Note,l.Month_Estimated,l.Year_Estimated,l.Category,l.ProjectName,l.AccountName,l.Purchaser,l.`Status`,l.Urgent,l.Urgent_Note,l.OverBudget,l.OverBudget_Note,l.Over3000,l.Over3000_Note"
                                + " FROM  erphtml.ccs_order_item i"
                                + " LEFT JOIN  erphtml.ccs_order_list l ON l.ID=i.OrderID) s"
                                + " LEFT JOIN erphtml.ccs_request_item_temp temp ON temp.ID=s.RequestID) k WHERE k.Year_Estimated='" + year + "' GROUP BY k.AccountName,"
                                + "  K.Month_Estimated,k.Year_Estimated) h"
                                + " INNER JOIN (SELECT * from erphtml.ccs_budget) b ON b.code=h.AccountName AND b.month=h.Month_Estimated AND b.year=h.Year_Estimated ) n where n.AccountName='" + account + "';"

                        }
                        else {
                            sql = "SELECT n.*,ROUND(IFNULL(n.Spend_USD, 0)-IFNULL(Receve_USD, 0)-IFNULL(Cancel_USD, 0),2) AS ON_GOING,ROUND(n.BUDGET-IFNULL(Receve_USD, 0)-IFNULL(Cancel_USD, 0),2) AS BALANCE from"
                                + " (SELECT h.*,b.* FROM (SELECT k.AccountName,k.Month_Estimated,k.Year_Estimated,ROUND (SUM(k.AmountUSD),2) AS Spend_USD,ROUND(SUM(k.Receve),2) as Receve_USD,ROUND(SUM(k.Cancel),2) as Cancel_USD"
                                + " FROM (SELECT s.*,temp.English FROM (SELECT i.RequestID,i.OrderID,i.PR_LINE,i.ID,i.Quantity,i.ActualPrice,i.Currency,i.USD*i.Quantity AS AmountUSD,"
                                + " i.LW_REC_QTY*i.USD AS Receve,i.LW_CXL_QTY*i.USD AS Cancel,i.LW_COMPANY,i.LW_LOCATION,i.LW_PO_NUMBER,"
                                + " i.LW_PO_LINE,i.LW_RQ_NUMBER,i.LW_RQ_LINE,i.LW_QTY,i.LW_REC_QTY,i.LW_CXL_QTY,i.LW_PO_DATE,i.LW_EARLY_DL_DATE,i.LW_CLOSE_DATE,i.TimeUpdate,"
                                + " i.User,i.Note,l.Month_Estimated,l.Year_Estimated,l.Category,l.ProjectName,l.AccountName,l.Purchaser,l.`Status`,l.Urgent,l.Urgent_Note,l.OverBudget,l.OverBudget_Note,l.Over3000,l.Over3000_Note"
                                + " FROM  erphtml.ccs_order_item i"
                                + " LEFT JOIN  erphtml.ccs_order_list l ON l.ID=i.OrderID) s"
                                + " LEFT JOIN erphtml.ccs_request_item_temp temp ON temp.ID=s.RequestID) k WHERE  k.Month_Estimated='" + month + "' AND k.Year_Estimated='" + year + "' GROUP BY k.AccountName,"
                                + "  K.Month_Estimated,k.Year_Estimated) h"
                                + " INNER JOIN (SELECT * from erphtml.ccs_budget) b ON b.code=h.AccountName AND b.month=h.Month_Estimated AND b.year=h.Year_Estimated ) n where n.AccountName='" + account + "';"

                        }


                    }

                }
                else {
                    if (account == 0) {
                        if (month == 0) {
                            sql = "SELECT n.*,ROUND(IFNULL(n.Spend_USD, 0)-IFNULL(Receve_USD, 0)-IFNULL(Cancel_USD, 0),2) AS ON_GOING,ROUND(n.BUDGET-IFNULL(Receve_USD, 0)-IFNULL(Cancel_USD, 0),2) AS BALANCE from"
                                + " (SELECT h.*,b.* FROM (SELECT k.AccountName,k.Month_Estimated,k.Year_Estimated,ROUND (SUM(k.AmountUSD),2) AS Spend_USD,ROUND(SUM(k.Receve),2) as Receve_USD,ROUND(SUM(k.Cancel),2) as Cancel_USD"
                                + " FROM (SELECT s.*,temp.English FROM (SELECT i.RequestID,i.OrderID,i.PR_LINE,i.ID,i.Quantity,i.ActualPrice,i.Currency,i.USD*i.Quantity AS AmountUSD,"
                                + " i.LW_REC_QTY*i.USD AS Receve,i.LW_CXL_QTY*i.USD AS Cancel,i.LW_COMPANY,i.LW_LOCATION,i.LW_PO_NUMBER,"
                                + " i.LW_PO_LINE,i.LW_RQ_NUMBER,i.LW_RQ_LINE,i.LW_QTY,i.LW_REC_QTY,i.LW_CXL_QTY,i.LW_PO_DATE,i.LW_EARLY_DL_DATE,i.LW_CLOSE_DATE,i.TimeUpdate,"
                                + " i.User,i.Note,l.Month_Estimated,l.Year_Estimated,l.Category,l.ProjectName,l.AccountName,l.Purchaser,l.`Status`,l.Urgent,l.Urgent_Note,l.OverBudget,l.OverBudget_Note,l.Over3000,l.Over3000_Note"
                                + " FROM  erphtml.ccs_order_item i"
                                + " LEFT JOIN  erphtml.ccs_order_list l ON l.ID=i.OrderID) s"
                                + " LEFT JOIN erphtml.ccs_request_item_temp temp ON temp.ID=s.RequestID) k WHERE k.Year_Estimated='" + year + "' GROUP BY k.AccountName,"
                                + "  K.Month_Estimated,k.Year_Estimated) h"
                                + " INNER JOIN (SELECT * from erphtml.ccs_budget) b ON b.code=h.AccountName AND b.month=h.Month_Estimated AND b.year=h.Year_Estimated ) n WHERE n.DEPT='" + sort_dept + "';"

                        }
                        else {
                            sql = "SELECT n.*,ROUND(IFNULL(n.Spend_USD, 0)-IFNULL(Receve_USD, 0)-IFNULL(Cancel_USD, 0),2) AS ON_GOING,ROUND(n.BUDGET-IFNULL(Receve_USD, 0)-IFNULL(Cancel_USD, 0),2) AS BALANCE from"
                                + " (SELECT h.*,b.* FROM (SELECT k.AccountName,k.Month_Estimated,k.Year_Estimated,ROUND (SUM(k.AmountUSD),2) AS Spend_USD,ROUND(SUM(k.Receve),2) as Receve_USD,ROUND(SUM(k.Cancel),2) as Cancel_USD"
                                + " FROM (SELECT s.*,temp.English FROM (SELECT i.RequestID,i.OrderID,i.PR_LINE,i.ID,i.Quantity,i.ActualPrice,i.Currency,i.USD*i.Quantity AS AmountUSD,"
                                + " i.LW_REC_QTY*i.USD AS Receve,i.LW_CXL_QTY*i.USD AS Cancel,i.LW_COMPANY,i.LW_LOCATION,i.LW_PO_NUMBER,"
                                + " i.LW_PO_LINE,i.LW_RQ_NUMBER,i.LW_RQ_LINE,i.LW_QTY,i.LW_REC_QTY,i.LW_CXL_QTY,i.LW_PO_DATE,i.LW_EARLY_DL_DATE,i.LW_CLOSE_DATE,i.TimeUpdate,"
                                + " i.User,i.Note,l.Month_Estimated,l.Year_Estimated,l.Category,l.ProjectName,l.AccountName,l.Purchaser,l.`Status`,l.Urgent,l.Urgent_Note,l.OverBudget,l.OverBudget_Note,l.Over3000,l.Over3000_Note"
                                + " FROM  erphtml.ccs_order_item i"
                                + " LEFT JOIN  erphtml.ccs_order_list l ON l.ID=i.OrderID) s"
                                + " LEFT JOIN erphtml.ccs_request_item_temp temp ON temp.ID=s.RequestID) k WHERE  k.Month_Estimated='" + month + "' AND k.Year_Estimated='" + year + "' GROUP BY k.AccountName,"
                                + "  K.Month_Estimated,k.Year_Estimated) h"
                                + " INNER JOIN (SELECT * from erphtml.ccs_budget) b ON b.code=h.AccountName AND b.month=h.Month_Estimated AND b.year=h.Year_Estimated ) n WHERE n.DEPT='" + sort_dept + "';"

                        }

                    }
                    else {
                        if (month == 0) {
                            sql = "SELECT n.*,ROUND(IFNULL(n.Spend_USD, 0)-IFNULL(Receve_USD, 0)-IFNULL(Cancel_USD, 0),2) AS ON_GOING,ROUND(n.BUDGET-IFNULL(Receve_USD, 0)-IFNULL(Cancel_USD, 0),2) AS BALANCE from"
                                + " (SELECT h.*,b.* FROM (SELECT k.AccountName,k.Month_Estimated,k.Year_Estimated,ROUND (SUM(k.AmountUSD),2) AS Spend_USD,ROUND(SUM(k.Receve),2) as Receve_USD,ROUND(SUM(k.Cancel),2) as Cancel_USD"
                                + " FROM (SELECT s.*,temp.English FROM (SELECT i.RequestID,i.OrderID,i.PR_LINE,i.ID,i.Quantity,i.ActualPrice,i.Currency,i.USD*i.Quantity AS AmountUSD,"
                                + " i.LW_REC_QTY*i.USD AS Receve,i.LW_CXL_QTY*i.USD AS Cancel,i.LW_COMPANY,i.LW_LOCATION,i.LW_PO_NUMBER,"
                                + " i.LW_PO_LINE,i.LW_RQ_NUMBER,i.LW_RQ_LINE,i.LW_QTY,i.LW_REC_QTY,i.LW_CXL_QTY,i.LW_PO_DATE,i.LW_EARLY_DL_DATE,i.LW_CLOSE_DATE,i.TimeUpdate,"
                                + " i.User,i.Note,l.Month_Estimated,l.Year_Estimated,l.Category,l.ProjectName,l.AccountName,l.Purchaser,l.`Status`,l.Urgent,l.Urgent_Note,l.OverBudget,l.OverBudget_Note,l.Over3000,l.Over3000_Note"
                                + " FROM  erphtml.ccs_order_item i"
                                + " LEFT JOIN  erphtml.ccs_order_list l ON l.ID=i.OrderID) s"
                                + " LEFT JOIN erphtml.ccs_request_item_temp temp ON temp.ID=s.RequestID) k WHERE k.Year_Estimated='" + year + "' GROUP BY k.AccountName,"
                                + "  K.Month_Estimated,k.Year_Estimated) h"
                                + " INNER JOIN (SELECT * from erphtml.ccs_budget) b ON b.code=h.AccountName AND b.month=h.Month_Estimated AND b.year=h.Year_Estimated ) n WHERE n.DEPT='" + sort_dept + "' AND n.AccountName='" + account + "';"

                        }
                        else {
                            sql = "SELECT n.*,ROUND(IFNULL(n.Spend_USD, 0)-IFNULL(Receve_USD, 0)-IFNULL(Cancel_USD, 0),2) AS ON_GOING,ROUND(n.BUDGET-IFNULL(Receve_USD, 0)-IFNULL(Cancel_USD, 0),2) AS BALANCE from"
                                + " (SELECT h.*,b.* FROM (SELECT k.AccountName,k.Month_Estimated,k.Year_Estimated,ROUND (SUM(k.AmountUSD),2) AS Spend_USD,ROUND(SUM(k.Receve),2) as Receve_USD,ROUND(SUM(k.Cancel),2) as Cancel_USD"
                                + " FROM (SELECT s.*,temp.English FROM (SELECT i.RequestID,i.OrderID,i.PR_LINE,i.ID,i.Quantity,i.ActualPrice,i.Currency,i.USD*i.Quantity AS AmountUSD,"
                                + " i.LW_REC_QTY*i.USD AS Receve,i.LW_CXL_QTY*i.USD AS Cancel,i.LW_COMPANY,i.LW_LOCATION,i.LW_PO_NUMBER,"
                                + " i.LW_PO_LINE,i.LW_RQ_NUMBER,i.LW_RQ_LINE,i.LW_QTY,i.LW_REC_QTY,i.LW_CXL_QTY,i.LW_PO_DATE,i.LW_EARLY_DL_DATE,i.LW_CLOSE_DATE,i.TimeUpdate,"
                                + " i.User,i.Note,l.Month_Estimated,l.Year_Estimated,l.Category,l.ProjectName,l.AccountName,l.Purchaser,l.`Status`,l.Urgent,l.Urgent_Note,l.OverBudget,l.OverBudget_Note,l.Over3000,l.Over3000_Note"
                                + " FROM  erphtml.ccs_order_item i"
                                + " LEFT JOIN  erphtml.ccs_order_list l ON l.ID=i.OrderID) s"
                                + " LEFT JOIN erphtml.ccs_request_item_temp temp ON temp.ID=s.RequestID) k WHERE  k.Month_Estimated='" + month + "' AND k.Year_Estimated='" + year + "' GROUP BY k.AccountName,"
                                + "  K.Month_Estimated,k.Year_Estimated) h"
                                + " INNER JOIN (SELECT * from erphtml.ccs_budget) b ON b.code=h.AccountName AND b.month=h.Month_Estimated AND b.year=h.Year_Estimated ) n WHERE n.DEPT='" + sort_dept + "' AND n.AccountName='" + account + "';"
                        }

                    }
                }

                connection.query(sql, function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    if (result.length > 0) {
                        res.send(result);
                        res.end();
                    }
                    else {
                        res.send({ result: 'empty' });
                        res.end();
                    }

                });
            });
        });
    }
    else {
        res.render("login");
    }
});
app.post("/CSS/get_User", function (req, res) {
    if (req.isAuthenticated()) {

        con2.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            sql = "SELECT User, Department FROM setup_user where User='" + req.user + "';"
            connection.query(sql, function (err, result) {
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
app.post("/CSS/get_Account", function (req, res) {
    if (req.isAuthenticated()) {
        dept = req.body.dept;
        year = req.body.year;
        con3.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }
            if (dept != 0) {
                sql = "SELECT DISTINCT CODE FROM ccs_budget WHERE DEPT='" + dept + "' AND YEAR='" + year + "';"
            }
            else {
                sql = "SELECT DISTINCT CODE FROM ccs_budget WHERE YEAR='" + year + "';"
            }
            connection.query(sql, function (err, result) {
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

app.post('/CCS/PurchaseOrder', function (req, res) {


    if (req.isAuthenticated()) {
        month = req.body.month;
        year = req.body.year;
        sort_dept = req.body.sort_dept;
        get_dept(req.user, function (result) {
            dept = get_right_dept(result[0].Department).substring(0, 3);

            con3.getConnection(function (err, connection) {
                if (err) {
                    throw err;
                }
                if (req.user.toLowerCase() == 'hinguy10' || req.user.toLowerCase() == 'tathi' || req.user.toLowerCase() == 'qupham2' || req.user.toLowerCase() == 'phphan2' || req.user.toLowerCase() == 'mutran'|| req.user.toLowerCase() == 'vinguy10') {
                    if (sort_dept == 0) {

                        if (month == 0) {
                            sql = "SELECT s.*,temp.English"
                                + " FROM"
                                + " (SELECT  i.RequestID,i.OrderID,i.PR_LINE,i.LW_PO_LINE,i.LW_PO_NUMBER,i.LW_PO_DATE,l.ProjectName,"
                                + " i.ID,i.Quantity,i.ActualPrice,i.Currency,i.LW_EXTENDED_AMT,i.LW_REC_QTY,i.LW_REC_ACT_DATE,i.LW_CLOSE_DATE,l.Month_Estimated,l.Year_Estimated,l.User,l.Purchaser,l.Assistan_Approve,l.Assistan_Result,l.HeadDept_Approve,l.HeadDept_Result,"
                                + " l.OperationMng_Approve,l.OperationMng_Result,l.PlantMng_Approve,l.PlantMng_Result"
                                + " FROM  erphtml.ccs_order_item i"
                                + " LEFT JOIN  erphtml.ccs_order_list l ON l.ID=i.OrderID WHERE l.Year_Estimated='" + year + "') s"
                                + " LEFT JOIN erphtml.ccs_request_item_temp temp ON temp.ID=s.RequestID ORDER BY s.OrderID DESC;";

                        }
                        else {
                            sql = "SELECT s.*,temp.English"
                                + " FROM"
                                + " (SELECT  i.RequestID,i.OrderID,i.PR_LINE,i.LW_PO_LINE,i.LW_PO_NUMBER,i.LW_PO_DATE,l.ProjectName,"
                                + " i.ID,i.Quantity,i.ActualPrice,i.Currency,i.LW_EXTENDED_AMT,i.LW_REC_QTY,i.LW_REC_ACT_DATE,i.LW_CLOSE_DATE,l.Month_Estimated,l.Year_Estimated,l.User,l.Purchaser,l.Assistan_Approve,l.Assistan_Result,l.HeadDept_Approve,l.HeadDept_Result,"
                                + " l.OperationMng_Approve,l.OperationMng_Result,l.PlantMng_Approve,l.PlantMng_Result"
                                + " FROM  erphtml.ccs_order_item i"
                                + " LEFT JOIN  erphtml.ccs_order_list l ON l.ID=i.OrderID WHERE l.Month_Estimated='" + month + "' AND l.Year_Estimated='" + year + "') s"
                                + " LEFT JOIN erphtml.ccs_request_item_temp temp ON temp.ID=s.RequestID ORDER BY s.OrderID DESC;";
                        }

                    }
                    else {
                        if (month == 0) {
                            sql = "SELECT s.*,temp.English"
                                + " FROM"
                                + " (SELECT  i.RequestID,i.OrderID,i.PR_LINE,i.LW_PO_LINE,i.LW_PO_NUMBER,i.LW_PO_DATE,l.ProjectName,"
                                + " i.ID,i.Quantity,i.ActualPrice,i.Currency,i.LW_EXTENDED_AMT,i.LW_REC_QTY,i.LW_REC_ACT_DATE,i.LW_CLOSE_DATE,l.Month_Estimated,l.Year_Estimated,l.User,l.Purchaser,l.Assistan_Approve,l.Assistan_Result,l.HeadDept_Approve,l.HeadDept_Result,"
                                + " l.OperationMng_Approve,l.OperationMng_Result,l.PlantMng_Approve,l.PlantMng_Result"
                                + " FROM  erphtml.ccs_order_item i"
                                + " LEFT JOIN  erphtml.ccs_order_list l ON l.ID=i.OrderID WHERE i.OrderID LIKE '" + sort_dept + "%' AND l.Year_Estimated='" + year + "') s"
                                + " LEFT JOIN erphtml.ccs_request_item_temp temp ON temp.ID=s.RequestID ORDER BY s.OrderID DESC;";

                        }
                        else {
                            sql = "SELECT s.*,temp.English"
                                + " FROM"
                                + " (SELECT  i.RequestID,i.OrderID,i.PR_LINE,i.LW_PO_LINE,i.LW_PO_NUMBER,i.LW_PO_DATE,l.ProjectName,"
                                + " i.ID,i.Quantity,i.ActualPrice,i.Currency,i.LW_EXTENDED_AMT,i.LW_REC_QTY,i.LW_REC_ACT_DATE,i.LW_CLOSE_DATE,l.Month_Estimated,l.Year_Estimated,l.User,l.Purchaser,l.Assistan_Approve,l.Assistan_Result,l.HeadDept_Approve,l.HeadDept_Result,"
                                + " l.OperationMng_Approve,l.OperationMng_Result,l.PlantMng_Approve,l.PlantMng_Result"
                                + " FROM  erphtml.ccs_order_item i"
                                + " LEFT JOIN  erphtml.ccs_order_list l ON l.ID=i.OrderID WHERE i.OrderID LIKE '" + sort_dept + "%' AND l.Month_Estimated='" + month + "' AND l.Year_Estimated='" + year + "') s"
                                + " LEFT JOIN erphtml.ccs_request_item_temp temp ON temp.ID=s.RequestID ORDER BY s.OrderID DESC;";
                        }
                    }


                }
                else {
                    if (month == 0) {
                        sql = "SELECT s.*,temp.English"
                            + " FROM"
                            + " (SELECT  i.RequestID,i.OrderID,i.PR_LINE,i.LW_PO_LINE,i.LW_PO_NUMBER,i.LW_PO_DATE,l.ProjectName,"
                            + " i.ID,i.Quantity,i.ActualPrice,i.Currency,i.LW_EXTENDED_AMT,i.LW_REC_QTY,i.LW_REC_ACT_DATE,i.LW_CLOSE_DATE,l.Month_Estimated,l.Year_Estimated,l.User,l.Purchaser,l.Assistan_Approve,l.Assistan_Result,l.HeadDept_Approve,l.HeadDept_Result,"
                            + " l.OperationMng_Approve,l.OperationMng_Result,l.PlantMng_Approve,l.PlantMng_Result"
                            + " FROM  erphtml.ccs_order_item i"
                            + " LEFT JOIN  erphtml.ccs_order_list l ON l.ID=i.OrderID WHERE i.OrderID LIKE '" + dept + "%' AND l.Year_Estimated='" + year + "') s"
                            + " LEFT JOIN erphtml.ccs_request_item_temp temp ON temp.ID=s.RequestID ORDER BY s.OrderID DESC;";
                    }
                    else {
                        sql = "SELECT s.*,temp.English"
                            + " FROM"
                            + " (SELECT  i.RequestID,i.OrderID,i.PR_LINE,i.LW_PO_LINE,i.LW_PO_NUMBER,i.LW_PO_DATE,l.ProjectName,"
                            + " i.ID,i.Quantity,i.ActualPrice,i.Currency,i.LW_EXTENDED_AMT,i.LW_REC_QTY,i.LW_REC_ACT_DATE,i.LW_CLOSE_DATE,l.Month_Estimated,l.Year_Estimated,l.User,l.Purchaser,l.Assistan_Approve,l.Assistan_Result,l.HeadDept_Approve,l.HeadDept_Result,"
                            + " l.OperationMng_Approve,l.OperationMng_Result,l.PlantMng_Approve,l.PlantMng_Result"
                            + " FROM  erphtml.ccs_order_item i"
                            + " LEFT JOIN  erphtml.ccs_order_list l ON l.ID=i.OrderID WHERE i.OrderID LIKE '" + dept + "%' AND l.Month_Estimated='" + month + "' AND l.Year_Estimated='" + year + "') s"
                            + " LEFT JOIN erphtml.ccs_request_item_temp temp ON temp.ID=s.RequestID ORDER BY s.OrderID DESC;";
                    }
                }
                connection.query(sql, function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    if (result.length > 0) {
                        res.send(result);
                        res.end();
                    }
                    else {
                        res.send({ result: 'empty' });
                        res.end();
                    }

                });
            });
        });
    }
    else {
        res.render("login");
    }


});
app.post('/CCS/PurchaseOrder/Requisions', function (req, res) {
    pr = req.body.pr;

    if (req.isAuthenticated()) {
        get_dept(req.user, function (result) {
            dept = get_right_dept(result[0].Department).substring(0, 3);
            con3.getConnection(function (err, connection) {
                if (err) {
                    throw err;
                }
                sql = "SELECT d.*,u.Name AS Finance_Name FROM (SELECT c.*,u.Name AS PlantMng_Name FROM (SELECT b.* ,u.Name AS OperationMng_Name FROM"
                    + " (SELECT a.*,u.Name AS HeadDept_Name FROM (SELECT o.*,u.Name AS Assistan_Name FROM (SELECT n.*,u.Name FROM (SELECT m.*,v.Name AS VendorName,v.Address,v.Email FROM (SELECT s.*,temp.English,temp.Vendor,temp.Leadtime"
                    + " FROM (SELECT  i.RequestID,i.OrderID,i.PR_LINE,i.LW_PO_LINE,i.LW_PO_NUMBER,i.LW_PO_DATE,l.ProjectName,l.AccountName,"
                    + " i.ID,i.Quantity,i.ActualPrice,i.Currency,i.LW_EXTENDED_AMT,i.LW_EARLY_DL_DATE,i.LW_REC_QTY,i.LW_REC_ACT_DATE,i.LW_CLOSE_DATE,l.Month_Estimated,l.Year_Estimated,l.User,l.Purchaser,l.Assistan_User,l.Assistan_Approve,l.Assistan_Result,l.Assistan_Reason,l.HeadDept_User,l.HeadDept_Approve,l.HeadDept_Result,l.HeadDept_Reason,l.OperationMng_User,l.OperationMng_Approve,"
                    + " l.OperationMng_Result,l.OperationMng_Reason,l.Finance_User,l.Finance_Approve,l.Finance_Result,l.Finance_Reason,l.PlantMng_User,"
                    + " l.PlantMng_Approve,l.PlantMng_Result,l.PlantMng_Reason,l.Purchasing_User,l.Purchasing_Approve,l.Purchasing_Result,l.Urgent,l.Urgent_Note,l.OverBudget,l.OverBudget_Note,l.Over3000,l.Over3000_Note"
                    + " FROM  erphtml.ccs_order_item i"
                    + " LEFT JOIN  erphtml.ccs_order_list l ON l.ID=i.OrderID WHERE i.OrderID='" + pr + "') s"
                    + " LEFT JOIN erphtml.ccs_request_item_temp temp ON temp.ID=s.RequestID) m"
                    + " LEFT JOIN erphtml.setup_vendor v ON v.ID=m.Vendor) n"
                    + " LEFT JOIN erpsystem.setup_user u ON u.User=n.User) o"
                    + " LEFT JOIN erpsystem.setup_user u ON u.User=o.Assistan_User) a"
                    + " LEFT JOIN erpsystem.setup_user u ON u.User=a.HeadDept_User) b"
                    + " LEFT JOIN erpsystem.setup_user u ON u.User=b.OperationMng_User) c"
                    + " LEFT JOIN erpsystem.setup_user u ON u.User=c.PlantMng_User) d"
                    + " LEFT JOIN erpsystem.setup_user u ON u.User=d.Finance_User"
                connection.query(sql, function (err, result, fields) {
                    connection.release();
                    if (err) throw err;
                    if (result.length > 0) {
                        res.send(result);
                        res.end();
                    }
                    else {
                        res.send({ result: 'empty' });
                        res.end();
                    }

                });
            });
        });
    }
    else {
        res.render("login");
    }


});

module.exports = app;
