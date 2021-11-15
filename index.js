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

app.get("/getSubjects", async (req, res) => {
  try {
    if(!req.body) return res.status(404).sendFile(notFoundPath);
    const dataSubjects = await subjects.find({});
    if (dataSubjects) {
      return res.send(dataSubjects);
    }
    return res.status(404).sendFile(notFoundPath);
  } catch (error) {
    return res.status(404).sendFile(notFoundPath);
  }
});

app.post("/save-subjects", jsonParser, async (req, res) => {
  try { 
    if(!req.body) return res.status(404).sendFile(notFoundPath);
    await subjects.remove();
    const created = await subjects.insert({subjects: req.body.subjects});
    res.send(created);
  } catch(error) {
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
