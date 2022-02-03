const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const monk = require('monk');
const jsonParser = express.json();
require('dotenv').config();

const db = monk(process.env.MONGODB_URI || 'mongodb+srv://admin:Hora1234@cluster0.ouwqb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
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

let programIds = [];

app.get("/getSubjects", async (req, res) => {
  try {
    if(!req.body) return res.status(404).sendFile(notFoundPath);
    const dataSubjects = await subjects.find({});
    programIds = await subjects.distinct("_id", {})
    if (dataSubjects) {
      return res.send(dataSubjects);
    }
    return res.status(404).sendFile(notFoundPath);
  } catch (error) {
    return res.status(404).sendFile(notFoundPath);
  }
});

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

app.get("/getTeachers", async (req, res) => {
  try {
    if(!req.body) return res.status(404).sendFile(notFoundPath);
    const data = await teachers.find({});
    if (data) {
      return res.send(data);
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
       Object.keys(req.body.teachersData).map(async (x) => {
        console.log(x);
        await subjects.update(
          { '_id' :  req.body.id}, 
          { $set: { [x]:  req.body.teachersData[x] } }
        );
       })
      const targetData = await subjects.update(
        { '_id' :  req.body.id}, 
        { $set: { subject: req.body.subject } }
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

app.post("/saveProgram", jsonParser, async (req, res) => {
  try { 
    if(!req.body) return res.status(404).sendFile(notFoundPath);
    await programs.findOneAndDelete({ _id: req.body.id });
    res.send(true)
  } catch(error) {
    return res.send(error);
  }
});

app.post("/saveTeacher", jsonParser, async (req, res) => {
  try { 
    if(!req.body) return res.status(404).sendFile(notFoundPath);
    if (req.body.save) {
      const { name, maxHours, currentHours } = req.body
      await teachers.insert({ name, maxHours, currentHours });
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
