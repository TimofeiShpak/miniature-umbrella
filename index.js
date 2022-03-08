const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const monk = require('monk');
const jsonParser = express.json();
require('dotenv').config();

const db = monk(process.env.MONGODB_URI || 'mongodb+srv://admin:Hora1234@cluster0.ouwqb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
// const db = monk(process.env.MONGODB_URI || 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false');
const subjects = db.get('subjects');
const programs = db.get('programs');
const teachers = db.get('teachers');

const app = express();
app.enable('trust proxy');

app.use(helmet());
app.use(morgan('common'));
app.use(express.json());
app.use(express.static('./public'));

const notFoundPath = path.join(__dirname, 'public/404.html');

const lectureTeacher = 26;
const lectureHours = 10;
const laboratoryTeacher = 27;
const laboratoryHours  = 11;
const practiseTeacher = 28;
const practiseHours = 12;

app.get("/getPrograms", async (req, res) => {
  try {
    if(!req.body) return res.status(404).sendFile(notFoundPath);
    const data = await programs.find({});
    if (data) {
      return res.send(data);
    }
    return res.status(404).sendFile(notFoundPath);
  } catch (error) {
    return res.status(404).sendFile(notFoundPath);
  }
});

app.post("/getTeachers", async (req, res) => {
  try {
    if(!req.body) return res.status(404).sendFile(notFoundPath);
    let fields = {maxHours: 1, name: 1, _id: 1};
    if (req.body.isAdmin) {
      fields = {maxHours: 1, name: 1, _id: 1, login: 1, password: 1, isAdmin: 1};
    }
    const teachersData = await teachers.find({}, { fields });
    let data = [];
    if (teachersData.length) {
      let sumElements = {};
      for (let i = 0; i < teachersData.length; i++) {
        sumElements[teachersData[i]._id] = { $sum: `$${teachersData[i]._id}` }
      }
      data = await subjects.aggregate(
        [
          {
            $group: {
              _id: null,
              ...sumElements
            }
          }
        ]
      )
    }
    let teacherHours = data[0] || {};
    for (let i = 0; i < teachersData.length; i++) {
      teachersData[i].currentHours = teacherHours[teachersData[i]._id] || 0;
    }
    if (teachersData) {
      return res.send(teachersData);
    }
    return res.status(404).sendFile(notFoundPath);
  } catch (error) {
    return res.status(404).sendFile(notFoundPath);
  }
});

app.post("/getProgramById", async (req, res) => {
  try {
    if(!req.body) return res.status(404).sendFile(notFoundPath);
    const data = await programs.find({ programId: req.body.programId });
    if (data) {
      return res.send(data);
    }
    return res.status(404).sendFile(notFoundPath);
  } catch (error) {
    return res.status(404).sendFile(notFoundPath);
  }
});

app.post("/getSubjectsByProgram", jsonParser, async (req, res) => {
  try {
    if(!req.body) return res.status(404).sendFile(notFoundPath);
    const subjectsByProgram = await subjects.find({ programId: req.body.programId })
    if (subjectsByProgram) {
      return res.send(subjectsByProgram);
    }
    return res.status(404).sendFile(notFoundPath);
  } catch (error) {
    return res.status(404).sendFile(notFoundPath);
  }
});

app.post("/saveSubjects", jsonParser, async (req, res) => {
  try { 
    if(!req.body) return res.status(404).sendFile(notFoundPath);
    if (req.body.save) {
      const row = await subjects.find({ '_id': req.body.id});
      const oldSubject = row[0].subject;
      const newSubject = req.body.subject;
      let setObj = {};
      let unsetObj = {};

      if (!oldSubject[lectureTeacher] && newSubject[lectureTeacher]) {
        setObj[newSubject[lectureTeacher]] = (setObj[newSubject[lectureTeacher]] || 0) + +newSubject[lectureHours]
      }
      if (oldSubject[lectureTeacher] && !newSubject[lectureTeacher]) {
        unsetObj[oldSubject[lectureTeacher]] = 1;
      }

      if (!oldSubject[laboratoryTeacher] && newSubject[laboratoryTeacher]) {
        setObj[newSubject[laboratoryTeacher]] = (setObj[newSubject[lectureTeacher]] || 0) + +newSubject[laboratoryHours]
      }
      if (oldSubject[laboratoryTeacher] && !newSubject[laboratoryTeacher]) {
        unsetObj[oldSubject[laboratoryTeacher]] = 1;
      }

      if (!oldSubject[practiseTeacher] && newSubject[practiseTeacher]) {
        setObj[newSubject[practiseTeacher]] = (setObj[newSubject[lectureTeacher]] || 0) + +newSubject[practiseHours]
      }
      if (oldSubject[practiseTeacher] && !newSubject[practiseTeacher]) {
        unsetObj[oldSubject[practiseTeacher]] = 1;
      }
      res.send(row);
      const targetData = await subjects.update(
        { '_id' :  req.body.id}, 
        { 
          $unset: { ...unsetObj } ,
          $set: { subject: req.body.subject, ...setObj } ,
        }
      );
      res.send(targetData);
    } else if (req.body.edit) {
      const targetData = await programs.update(
        { '_id' :  req.body.id}, 
        { $set: {name: req.body.name} }
      );
      res.send(targetData);
    }
  } catch(error) {
    return res.status(404).sendFile(notFoundPath);
  }
});

app.post("/saveNewSubjects", jsonParser, async (req, res) => {
  try { 
    if(!req.body) return res.status(404).sendFile(notFoundPath);
    await subjects.insert(req.body.subjects);
    await programs.insert({programId: req.body.programId, name: req.body.name })
    res.send({success: "true"})
  } catch(error) {
    return res.send(error);
  }
});

app.post("/deleteProgram", jsonParser, async (req, res) => {
  try { 
    if(!req.body) return res.status(404).sendFile(notFoundPath);
    await programs.findOneAndDelete({ _id: req.body.id });
    await subjects.remove({ programId: req.body.programId })
    res.send(true)
  } catch(error) {
    return res.send(error);
  }
});

app.post("/saveTeacher", jsonParser, async (req, res) => {
  try { 
    if(!req.body) return res.status(404).sendFile(notFoundPath);
    let setObj = {};
    Object.keys(req.body).map(x => {
      if (x && x !== 'id') {
        setObj[x] = req.body[x]
      }
    })
    if (req.body.id) {
      await teachers.update(
        { '_id' :  req.body.id}, 
        { $set: setObj },
      );
    } else {
      await teachers.insert(setObj);
    }
    res.send(true)
  } catch(error) {
    return res.send(error);
  }
});

app.post("/getSubjectsByTeacher", jsonParser, async (req, res) => {
  try {
    if(!req.body) return res.status(404).sendFile(notFoundPath);
    const data = await subjects.find({ [req.body.teacherId]: { $exists: true } })
    if (data) {
      return res.send(data);
    }
    return res.status(404).sendFile(notFoundPath);
  } catch (error) {
    return res.status(404).sendFile(notFoundPath);
  }
});

app.post("/deleteTeacher", jsonParser, async (req, res) => {
  try { 
    if(!req.body) return res.status(404).sendFile(notFoundPath);
    await teachers.findOneAndDelete({ _id: req.body.id });
    await subjects.update(
      { subject: req.body.id }, 
      { $set: { "subject.$" : "" }, $unset: { [req.body.id]:1 } },
    );
    res.send(true)
  } catch(error) {
    return res.send(error);
  }
});

app.post("/checkTeacher", jsonParser, async (req, res) => {
  try {
    if(!req.body) return res.status(404).sendFile(notFoundPath);
    const data = await teachers.find({
      login: req.body.login,
      password: req.body.password
    });
    if (data) {
      return res.send(data);
    }
    return res.send(false);
  } catch (error) {
    return res.status(404).sendFile(notFoundPath);
  }
});

app.use((req, res, next) => {
  res.status(404).sendFile(notFoundPath);
});

app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else {
    res.status(500);
  }
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
