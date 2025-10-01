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

// ================================POST GET=================================================


app.get("/HR/Talent_Development", function (req, res) {
  if (req.isAuthenticated()) {
    // res.render("HR/Talent_Development/Talent_Development");
    res.render("HR/Talent_Development/Talent_Development");
  } else {
    res.render("login");
  }
});
app.get("/Talent_Development/Candidate", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("HR/Talent_Development/Talent_Development_Candidate");
  } else {
    res.render("login");
  }
});
app.get("/Talent_Development/List", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("HR/Talent_Development/Talent_Development_List");
  } else {
    res.render("login");
  }
});
app.get("/Talent_Development/Detail", function (req, res) {
  if (req.isAuthenticated()) {
    get_round1(req.user, function (result) {
      if (req.user == "mutran" || result == "Pass")
        res.render("HR/Talent_Development/Talent_Development_Detail");
      else res.send("You are not a greenlist member!");
    });
  } else {
    res.render("login");
  }
});
function get_round1(user, callback) {
  con3.getConnection(function (err, connection) {
    if (err) {
      throw err;
    }
    connection.query(
      "SELECT Round1 FROM employee_talent_development where User='" +
      user +
      "';",
      function (err, result, fields) {
        connection.release();
        if (err) throw err;
        if (result.length > 0) {
          // dept=result[0].Department;
          return callback(result[0].Round1);
        } else {
          return callback("Fail");
        }
      }
    );
  });
}
app.get("/Talent_Development/Event", function (req, res) {
  if (req.isAuthenticated()) {
    // res.render("HR/Talent_Development/Talent_Development_Event");
    res.render("HR/Talent_Development/Talent_Development");
  } else {
    res.render("login");
  }
});
app.get("/Talent_Development/Program", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("HR/Talent_Development/Talent_Development_Program");
  } else {
    res.render("login");
  }
});
//===POST===
app.post("/HR/Load_Employee_Talent", function (req, res) {
  if (req.isAuthenticated()) {
    year = req.body.year;
    con3.getConnection(function (err, connection) {
      if (err) throw err;
      sql =
        "select e.*, s.Name, s.Dept, s.Position, s.Plant from erphtml.employee_talent_development e " +
        " inner join erpsystem.setup_emplist s on e.EmpID=s.ID and Year='" +
        year +
        "';";
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
app.post("/HR/Load_Employee_Talent_Spec", function (req, res) {
  if (req.isAuthenticated()) {
    year = req.body.year;
    con3.getConnection(function (err, connection) {
      if (err) throw err;
      sql =
        "select e.*, s.Name, s.Dept, s.Position, s.Plant from erphtml.employee_talent_development e " +
        " inner join erpsystem.setup_emplist s on e.EmpID=s.ID and Year='" +
        year +
        "' and e.User='" +
        req.user +
        "';";
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
app.post("/Employee/Upload_Talent_Attach_Profile", function (req, res) {
  if (req.isAuthenticated()) {
    // ID=req.body.ID;
    var form = new formidable.IncomingForm();
    attachFile = "";
    empID = "";
    year = "";
    var tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = new Date(Date.now() - tzoffset)
      .toISOString()
      .slice(0, -1);
    var timeUpdate = localISOTime.replace(/T/, " ").replace(/\..+/, "");
    form.parse(req);

    form.on("fileBegin", function (name, file) {
      attachFile = file.name;
      empID = attachFile.split("_")[0];
      year = attachFile.split("_")[1].split(".")[0];
      file.path = "./public/Assets/Employee/TalentDevelopment/" + attachFile;
    });
    form.on("file", function (name, file) {
      con3.getConnection(function (err, connection) {
        if (err) throw err;
        sql =
          "replace into employee_talent_development (ID, EmpID, Year, TimeUpdate, User) values ('" +
          attachFile +
          "', '" +
          empID +
          "', '" +
          year +
          "', '" +
          timeUpdate +
          "', '" +
          req.user +
          "');";
        connection.query(sql, function (err, result, fields) {
          if (err) throw err;
          connection.release();
          res.send("done");
          res.end();
        });
      });
    });
  } else {
    res.render("login");
  }
});
app.post("/TalentDevelopment/Update_Personal_Infor", function (req, res) {
  if (req.isAuthenticated()) {
    IDkey = req.body.ID;
    dob = req.body.dob;
    mar = req.body.mar;
    mob = req.body.mob;
    add = req.body.add;
    ema = req.body.ema;
    pos = req.body.pos;
    dep = req.body.dep;
    pla = req.body.pla;
    hea = req.body.hea;
    hir = req.body.hir;
    con3.getConnection(function (err, connection) {
      if (err) throw err;
      sql =
        "update erphtml.employee_talent_development set DateOfBirth='" +
        dob +
        "', MarriageStatus='" +
        mar +
        "', MobilePhone='" +
        mob +
        "', Address='" +
        add +
        "', Email='" +
        ema +
        "', Position='" +
        pos +
        "', Department='" +
        dep +
        "', Plant='" +
        pla +
        "', HeadDepartment='" +
        hea +
        "', HireDate='" +
        hir +
        "' where EmpID='" +
        IDkey +
        "' and  year=YEAR(CURDATE());";
      // console.log(sql);
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
app.post("/TalentDevelopment/Get_Personal_Infor", function (req, res) {
  if (req.isAuthenticated()) {
    con3.getConnection(function (err, connection) {
      if (err) throw err;
      sql =
        "select * from erphtml.employee_talent_development_carrer_profile where User='" +
        req.user +
        "' and Year=YEAR(CURDATE());";
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
app.post("/TalentDevelopment/Add_Carrer_Profile", function (req, res) {
  if (req.isAuthenticated()) {
    IDkey = req.body.ID;
    startTime = req.body.startTime;
    finishTime = req.body.finishTime;
    company = req.body.company;
    position = req.body.position;
    level = req.body.level;
    jobContribute = req.body.jobContribute;
    con3.getConnection(function (err, connection) {
      if (err) throw err;
      sql =
        "replace into employee_talent_development_carrer_profile (ID, Employee, StartTime, FinishTime, Company, Position, Level, JobContribute, Year, TimeUpdate, User)" +
        " values (CONCAT('" +
        IDkey +
        "', '" +
        startTime +
        "', Year(CURDATE())), '" +
        IDkey +
        "', '" +
        startTime +
        "', '" +
        finishTime +
        "', '" +
        company +
        "', '" +
        position +
        "', '" +
        level +
        "', '" +
        jobContribute +
        "', YEAR(CURDATE()), NOW(), '" +
        req.user +
        "');";
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
app.post("/TalentDevelopment/Get_Carrer_Profile", function (req, res) {
  if (req.isAuthenticated()) {
    con3.getConnection(function (err, connection) {
      if (err) throw err;
      sql =
        "select * from erphtml.employee_talent_development_carrer_profile where User='" +
        req.user +
        "' and Year=YEAR(CURDATE());";
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
app.post("/TalentDevelopment/Add_Training_History", function (req, res) {
  if (req.isAuthenticated()) {
    IDkey = req.body.ID;
    startTime = req.body.startTime;
    finishTime = req.body.finishTime;
    course = req.body.course;
    provider = req.body.provider;
    result = req.body.result;
    con3.getConnection(function (err, connection) {
      if (err) throw err;
      sql =
        "replace into erphtml.employee_talent_development_training_history (ID, Employee, Course, Provider, StartTime, FinishTime, Result, Year, TimeUpdate, User)" +
        " values (CONCAT('" +
        IDkey +
        "', '" +
        course +
        "', Year(CURDATE())), '" +
        IDkey +
        "', '" +
        course +
        "', '" +
        provider +
        "', '" +
        startTime +
        "', '" +
        finishTime +
        "', '" +
        result +
        "', YEAR(CURDATE()), NOW(), '" +
        req.user +
        "');";
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
app.post("/TalentDevelopment/Get_Training_History", function (req, res) {
  if (req.isAuthenticated()) {
    con3.getConnection(function (err, connection) {
      if (err) throw err;
      sql =
        "select * from erphtml.employee_talent_development_training_history where User='" +
        req.user +
        "' and Year=YEAR(CURDATE()) order by TimeUpdate;";
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
app.post("/TalentDevelopment/Add_Key_Achievement_History", function (req, res) {
  if (req.isAuthenticated()) {
    IDkey = req.body.ID;
    project = req.body.projectEvent;
    target = req.body.target;
    description = req.body.description;
    startTime = req.body.startTime;
    finishTime = req.body.finishTime;
    result = req.body.result;
    con3.getConnection(function (err, connection) {
      if (err) throw err;
      sql =
        "replace into erphtml.employee_talent_development_key_achievements (ID, Employee, ProjectEvent, Target, Description, StartTime, FinishTime, Result, Year, TimeUpdate, User)" +
        " values (CONCAT('" +
        IDkey +
        "', '" +
        project +
        "', Year(CURDATE())), '" +
        IDkey +
        "', '" +
        project +
        "', '" +
        target +
        "', '" +
        description +
        "', '" +
        startTime +
        "', '" +
        finishTime +
        "', '" +
        result +
        "', YEAR(CURDATE()), NOW(), '" +
        req.user +
        "');";
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
app.post("/TalentDevelopment/Get_Key_Achievement_History", function (req, res) {
  if (req.isAuthenticated()) {
    con3.getConnection(function (err, connection) {
      if (err) throw err;
      sql =
        "select * from erphtml.employee_talent_development_key_achievements where User='" +
        req.user +
        "' and Year=Year(CURDATE());";
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
app.post("/TalentDevelopment/Add_Learning_Development", function (req, res) {
  if (req.isAuthenticated()) {
    IDkey = req.body.ID;
    course = req.body.course;
    qualification = req.body.qualification;
    startTime = req.body.startTime;
    finishTime = req.body.finishTime;
    update = req.body.update;
    con3.getConnection(function (err, connection) {
      if (err) throw err;
      sql =
        "replace into erphtml.employee_talent_development_development_need (ID, Employee, Course, Qualification, StartTime, FinishTime, UpdateStatus, Year, TimeUpdate, User)" +
        " values (CONCAT('" +
        IDkey +
        "', '" +
        course +
        "', Year(CURDATE())), '" +
        IDkey +
        "', '" +
        course +
        "', '" +
        qualification +
        "', '" +
        startTime +
        "', '" +
        finishTime +
        "', '" +
        update +
        "', YEAR(CURDATE()), NOW(), '" +
        req.user +
        "');";
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
app.post("/TalentDevelopment/Get_Learning_Development", function (req, res) {
  if (req.isAuthenticated()) {
    con3.getConnection(function (err, connection) {
      if (err) throw err;
      sql =
        "select * from erphtml.employee_talent_development_development_need where User='" +
        req.user +
        "' and Year=Year(CURDATE());";
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

module.exports = app;
