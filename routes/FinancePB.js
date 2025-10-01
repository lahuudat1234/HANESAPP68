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
  connectionLimit: 300,
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

//=====================================FINANCE=============================================
app.get("/Finance/Finance_page", function (request, res) {
  if (request.isAuthenticated()) {
    res.render("Finance/Finance_page");
  }
  else {
    res.render("login");
  }
});

app.get("/Finance/ScanTrashTicket", function (request, res) {
  res.render("Finance/partials/ScanTrash");
});

app.get("/Finance/Export_Reports", function (request, res) {
  if (request.isAuthenticated()) {
    get_dept(request.user, function (result) {
      user = result[0].User;
      dept = result[0].Department;
      position = result[0].Position;
      if (request.user == 'mutran' || dept == 'FI') res.render("Finance/ExportReports");
      else res.send('You dont have permission to access this page!');
    });
  }
  else {
    res.render("login");
  }
});

app.get("/Finance/Kaizen_Report", function (request, respond) {
  if (request.isAuthenticated()) {
    respond.render("Finance/KaizenReports");
  }
  else {
    respond.render("login");
  }
});

app.post('/Finance/Export_Reports/Incentive_Report_Production', function (req, res) {
  req.setTimeout(1000000);
  datefrom = req.body.datefrom;
  dateto = req.body.dateto;
  var options = {
    mode: 'text',
    pythonPath: 'python',
    scriptPath: './public/Python/Finance/ExportReports',
    pythonOptions: ['-u'], // get print results in real-time
    args: [datefrom, dateto]
  };
  let shell = new PythonShell('IncentiveProduction.py', options);
  shell.on('message', function (message) {
    res.send(message);
    res.end();
  });
});

app.post('/Finance/Export_Reports/Estimate_Cost_Report', function (req, res) {
  req.setTimeout(1000000);
  datefrom = req.body.datefrom;
  dateto = req.body.dateto;
  var options = {
    mode: 'text',
    pythonPath: 'python',
    scriptPath: './public/Python/Finance/ExportReports',
    pythonOptions: ['-u'], // get print results in real-time
    args: [datefrom, dateto]
  };
  let shell = new PythonShell('EstimateCost.py', options);
  shell.on('message', function (message) {
    res.send(message);
    res.end();
  });
});

app.post("/Finance/Kaizen_Report/Insert_New_Kaizen", function (req, res) {
  if (req.isAuthenticated()) {
    plant = req.body.plant;
    kaizen_name = req.body.kaizen_name;
    plant_bm = req.body.plant_bm;
    kaizen_name_bm = req.body.kaizen_name_bm;
    costsaving = req.body.costsaving;
    other = req.body.other;
    des = req.body.des;
    benchmark = req.body.benchmark;
    attachfile = req.body.attachfile;
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
    userUpdate = req.user;
    ID = plant + ';' + kaizen_name;
    con3.getConnection(function (err, connection) {
      if (err) {
        throw err;
      }
      sql = "replace into kaizen_reports(ID, PLANT, KAIZEN, COST_SAVING, OTHER_IMP, DESCRIPTION, TimeUpdate, TimeUpdate_BM, UserUpdate, BENCHMARK, PLANT_BM, KAIZEN_BM, ATTACH_FILE) "
        + " values('" + ID + "', '" + plant + "', '" + kaizen_name + "', '" + costsaving + "', '" + other + "', '" + des + "', '" + timeUpdate + "', '" + timeUpdate + "', '" + userUpdate + "', 'N', '" + plant_bm + "', '" + kaizen_name_bm + "', '" + attachfile + "');";
      connection.query(sql, function (err, result, fields) {
        // connection.release();
        if (err) throw err;
        if (benchmark == 'Y') {
          ID_bm = plant_bm + ';' + kaizen_name_bm;
          sql = "select TimeUpdate from kaizen_reports where ID='" + ID_bm + "';";
          connection.query(sql, function (err, result, fields) {
            if (err) throw err;
            timeUpdate = (new Date(result[0].TimeUpdate - tzoffset)).toISOString().slice(0, -1).replace(/T/, ' ').replace(/\..+/, '');
            sql = "update kaizen_reports set TimeUpdate_BM='" + timeUpdate + "' where ID='" + ID + "';";
            connection.query(sql, function (err, result, fields) {
              if (err) throw err;
              sql = "update kaizen_reports set BENCHMARK='Y' where ID='" + ID_bm + "';";
              connection.query(sql, function (err, result, fields) {
                if (err) throw err;
                connection.release();
                res.send('done2');
                res.end();
              });
            });
          });
        } else {
          res.send('done1');
          res.end();
        }
      });
    });
  } else {
    res.render("login");
  }
});

app.post("/Finance/Kaizen_Report/Update_Kaizen", function (req, res) {
  if (req.isAuthenticated()) {
    plant = req.body.plant;
    kaizen_name = req.body.kaizen_name;
    costsaving = req.body.costsaving;
    other = req.body.other;
    des = req.body.des;
    benchmark = req.body.benchmark;
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    var timeUpdate = localISOTime.replace(/T/, ' ').replace(/\..+/, '');
    userUpdate = req.user;
    ID = plant + ';' + kaizen_name;
    con3.getConnection(function (err, connection) {
      if (err) {
        throw err;
      }
      sql = "Update kaizen_reports set COST_SAVING='" + costsaving + "', OTHER_IMP='" + other + "', DESCRIPTION='" + des + "', TimeUpdate='" + timeUpdate + "' where ID='" + ID + "'";
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

app.post('/Finance/Upload_Kaizen_Excel', function (req, res) {
  // ID=req.body.ID;
  var form = new formidable.IncomingForm();
  excelFile = '';
  form.parse(req);
  form.on('fileBegin', function (name, file) {
    excelFile = file.name;
    file.path = './public/Python/Finance/KaizenReport/Upload_Files/Excel/' + excelFile;
  });

  form.on('file', function (name, file) {
    var options = {
      mode: 'text',
      pythonPath: 'python',
      scriptPath: './public/Python/Finance/KaizenReport/',
      pythonOptions: ['-u'],
      args: [excelFile, __dirname, req.user]
    }
    let shell = new PythonShell('Upload_Kaizen.py', options);
    shell.on('message', function (message) {
      if (message == 'done') {
        res.send(message)
        res.end();
      } else {
        res.send('fail');
        res.end();
      }
    });
  });
});

app.post('/Finance/Upload_Kaizen_Attach', function (req, res) {
  // ID=req.body.ID;
  var form = new formidable.IncomingForm();
  attachFile = '';
  form.parse(req);
  form.on('fileBegin', function (name, file) {
    attachFile = file.name;
    file.path = './public/Python/Finance/KaizenReport/Upload_Files/Attach/' + attachFile;
  });
  form.on('file', function (name, file) {
    res.send('done');
    res.end();
  });
});

app.post("/Finance/Kaizen_Report/Find_Kaizen", function (req, res) {
  plant = req.body.plant;
  kaizen_name = req.body.kaizen_name;
  ID = plant + ';' + kaizen_name;
  con3.getConnection(function (err, connection) {
    if (err) {
      throw err;
    }
    sql = "select ID from kaizen_reports where ID='" + ID + "';";
    connection.query(sql, function (err, result, fields) {
      connection.release();
      if (err) throw err;
      if (result.length > 0) {
        res.send(result);
        res.end();
      } else {
        res.send({ result: 'fail' });
        res.end();
      }
    });
  });
});

app.post("/Finance/Kaizen_Report/Remove_Kaizen", function (req, res) {
  if (req.isAuthenticated()) {
    ID = req.body.ID;
    con3.getConnection(function (err, connection) {
      if (err) {
        throw err;
      }
      sql = "delete from kaizen_reports where ID='" + ID + "';";
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

app.post("/Finance/Kaizen_Report/Load_Kaizen", function (req, res) {
  datefrom = req.body.datefrom;
  dateto = req.body.dateto;
  plant = req.body.plant;
  con3.getConnection(function (err, connection) {
    if (err) {
      throw err;
    }
    sql = '';
    if (plant == 'All' || plant == '')
      sql = "select * from kaizen_reports where TimeUpdate_BM>='" + datefrom + " 00:00:00' and TimeUpdate_BM<='" + dateto + " 23:59:59' order by PLANt_BM, KAIZEN_BM, BENCHMARK, TimeUpdate;";
    else
      sql = "select * from kaizen_reports where TimeUpdate_BM>='" + datefrom + " 00:00:00' and TimeUpdate_BM<='" + dateto + " 23:59:59' and Plant_BM='" + plant + "' order by PLANt_BM, KAIZEN_BM, BENCHMARK, TimeUpdate;";
    connection.query(sql, function (err, result, fields) {
      connection.release();
      if (err) throw err;
      if (result.length > 0) {
        res.send(result);
        res.end();
      } else {
        res.send({ result: 'fail' });
        res.end();
      }
    });
  });
});

app.post('/Finance/Kaizen_Report/Export_Kaizen', function (req, res) {
  datefrom = req.body.datefrom;
  dateto = req.body.dateto;
  plant = req.body.plant;
  var options = {
    mode: 'text',
    pythonPath: 'python',
    scriptPath: './public/Python/Finance/KaizenReport',
    pythonOptions: ['-u'], // get print results in real-time
    args: [datefrom, dateto, plant]
  };
  let shell = new PythonShell('Export_Kaizen.py', options);
  shell.on('message', function (message) {
    // res.setHeader("Content-type", "application/json")
    res.send(message);
    res.end();
  });
});

app.post("/Finance/Kaizen_Report/Load_Kaizen_By_ID", function (req, res) {
  ID = req.body.ID;
  con3.getConnection(function (err, connection) {
    if (err) {
      throw err;
    }
    sql = "select * from kaizen_reports where ID='" + ID + "';";
    connection.query(sql, function (err, result, fields) {
      connection.release();
      if (err) throw err;
      if (result.length > 0) {
        res.send(result);
        res.end();
      } else {
        res.send({ result: 'fail' });
        res.end();
      }
    });
  });
});

app.post("/Finance/scan_garbage_upload_file", async function (req, res) {
  var form = new formidable.IncomingForm();
  pdfName = "";
  form.parse(req);
  form.on('fileBegin', function (name, file) {
    pdfName = file.name;
    console.log(pdfName)
    file.path = './public/Python/Finance/ScanGarbageTicket/pdf/' + pdfName;
  });

  form.on('file', function (name, file) {
    //run script python
    var options = {
      mode: 'text',
      pythonPath: 'python',
      scriptPath: './public/Python/Finance/ScanGarbageTicket',
      pythonOptions: ['-u'], // get print results in real-time
      args: [pdfName]
    };
    let shell = new PythonShell('ScanGarbageTicket.py', options);
    shell.on('message', function (message) {
      if (message != "") {
        res.setHeader("Content-type", "application/json");
        data = { result: message };
        res.send(data);
        res.end();
      }
    });
  });
});


module.exports = app;
