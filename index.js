const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const monk = require('monk');
const jsonParser = express.json();
require('dotenv').config();

const db = monk(process.env.MONGODB_URI || 'mongodb+srv://admin:Hora1234@cluster0.ouwqb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
const subjects = db.get('subjects');

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

app.get("/getProgramsWithoutSubjects", async (req, res) => {
  try {
    if(!req.body) return res.status(404).sendFile(notFoundPath);
    const data = await subjects.find({}, { fields: {name: 1} });
    if (data) {
      return res.send(data);
    }
    return res.status(404).sendFile(notFoundPath);
  } catch (error) {
    return res.status(404).sendFile(notFoundPath);
  }
});

app.get("/getProgramNames", async (req, res) => {
  try {
    if(!req.body) return res.status(404).sendFile(notFoundPath);
    const programNames = await subjects.distinct("name", {})
    if (programNames) {
      return res.send(programNames);
    }
    return res.status(404).sendFile(notFoundPath);
  } catch (error) {
    return res.status(404).sendFile(notFoundPath);
  }
});

app.post("/getProgramByName", jsonParser, async (req, res) => {
  try {
    if(!req.body) return res.status(404).sendFile(notFoundPath);
    const program = await subjects.find({ "name": req.body.name })
    if (program) {
      return res.send(program);
    }
    return res.status(404).sendFile(notFoundPath);
  } catch (error) {
    return res.status(404).sendFile(notFoundPath);
  }
});

app.post("/saveSubjects", jsonParser, async (req, res) => {
  try { 
    if(!req.body) return res.status(404).sendFile(notFoundPath);
    let edit = null;
    if (req.body.save) {
      edit = { $set: {subjects: req.body.subjects} }
    } else if (req.body.edit) {
      edit = { $set: {name: req.body.name} }
    }
    if (edit) {
      const targetData = await subjects.update(
        { '_id' :  req.body.id}, 
        edit
      );
      res.send(targetData);
    } else {
      return res.status(404).sendFile(notFoundPath);
    }
  } catch(error) {
    return res.status(404).sendFile(notFoundPath);
  }
});

app.post("/saveNewSubjects", jsonParser, async (req, res) => {
  try { 
    if(!req.body) return res.status(404).sendFile(notFoundPath);
    const created = await subjects.insert({ subjects: req.body.subjects, name: req.body.name });
    res.send(created)
  } catch(error) {
    return res.send(error);
  }
});

app.post("/deleteProgram", jsonParser, async (req, res) => {
  try { 
    if(!req.body) return res.status(404).sendFile(notFoundPath);
    await subjects.findOneAndDelete({ _id: req.body.id });
    res.send(true)
  } catch(error) {
    return res.send(error);
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
