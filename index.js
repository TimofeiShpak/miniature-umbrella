const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const monk = require('monk');
const jsonParser = express.json();
require('dotenv').config();

const db = monk(process.env.MONGODB_URI || 'mongodb+srv://admin:Hora1234@cluster0.ouwqb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
const users = db.get('users');

const app = express();
app.enable('trust proxy');

app.use(helmet());
app.use(morgan('common'));
app.use(express.json());
app.use(express.static('./public'));

const notFoundPath = path.join(__dirname, 'public/404.html');

app.get("/api/users", async (req, res) => {
  try {
    if(!req.body) return res.status(404).sendFile(notFoundPath);
    const dataUsers = await users.find({});
    if (dataUsers) {
      return res.send(dataUsers);
    }
    return res.status(404).sendFile(notFoundPath);
  } catch (error) {
    return res.status(404).sendFile(notFoundPath);
  }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    if(!req.body) return res.status(404).sendFile(notFoundPath);
    const id = req.params.id;
    const dataUser = await users.findOne({_id: id});
    if (dataUser) {
      return res.send(dataUser);
    }
    return res.status(404).sendFile(notFoundPath);
  } catch (error) {
    return res.status(404).sendFile(notFoundPath);
  }
});

app.post("/api/users", jsonParser, async (req, res) => {
  try { 
    if(!req.body) return res.status(404).sendFile(notFoundPath);
    const userName = req.body.name;
    const userAge = req.body.age;
    const user = {name: userName, age: userAge};
    const created = await users.insert(user);
    res.send(created);
  } catch(error) {
    return res.status(404).sendFile(notFoundPath);
  }
}); 

app.post("/api/users-update-all", jsonParser, async (req, res) => {
  try { 
    if(!req.body) return res.status(404).sendFile(notFoundPath);
    await users.remove();
    const created = await users.insert(req.body.users);
    res.send(created);
  } catch(error) {
    return res.status(404).sendFile(notFoundPath);
  }
}); 

app.delete("/api/users/:id", async (req, res) => {
  try {
    if(!req.body) return res.status(404).sendFile(notFoundPath);
    const id = req.params.id;
    const deleted = await users.findOneAndDelete({_id: id})
    res.send(deleted);            
  } catch {
    return res.status(404).sendFile(notFoundPath);
  }
});

app.put("/api/users", jsonParser, async (req, res) => {
  try {       
    if(!req.body) return res.status(404).sendFile(notFoundPath);
    const id = req.body.id;
    const userName = req.body.name;
    const userAge = req.body.age;
      
    const updated = await users.findOneAndUpdate({_id: id}, { $set: {age: userAge, name: userName}}, {returnDocument: "after" })
    res.send(updated);   
  } catch {
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
