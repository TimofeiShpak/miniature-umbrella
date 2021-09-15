const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const yup = require('yup');
const monk = require('monk');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const { nanoid } = require('nanoid');

require('dotenv').config();

const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectId;
   
const app = express();
const jsonParser = express.json();
 
const mongoClient = new MongoClient("mongodb+srv://admin:Hora1234@cluster0.ouwqb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
 
let dbClient;
 
app.use(express.static(__dirname + "/public"));
 
mongoClient.connect(function(err, client){
    if(err) return console.log(err);
    dbClient = client;
    app.locals.collection = client.db("usersdb").collection("users");
    // app.listen(3000, function(){
    //     console.log("Сервер ожидает подключения...");
    // });
});
// const db = monk(process.env.MONGODB_URI || 'mongodb+srv://admin:Hora1234@cluster0.ouwqb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
// const urls = db.get('urls');
// urls.createIndex({ slug: 1 }, { unique: true });

// const app = express();
app.enable('trust proxy');

app.use(helmet());
app.use(morgan('common'));
app.use(express.json());
app.use(express.static('./public'));

const notFoundPath = path.join(__dirname, 'public/404.html');

// app.get('/:id', async (req, res, next) => {
//   const { id: slug } = req.params;
//   try {
//     const url = await urls.findOne({ slug });
//     if (url) {
//       return res.redirect(url.url);
//     }
//     return res.status(404).sendFile(notFoundPath);
//   } catch (error) {
//     return res.status(404).sendFile(notFoundPath);
//   }
// });

// const schema = yup.object().shape({
//   slug: yup.string().trim().matches(/^[\w\-]+$/i),
//   url: yup.string().trim().url().required(),
// });

// app.post('/url', slowDown({
//   windowMs: 30 * 1000,
//   delayAfter: 1,
//   delayMs: 500,
// }), rateLimit({
//   windowMs: 30 * 1000,
//   max: 1,
// }), async (req, res, next) => {
//   let { slug, url } = req.body;
//   try {
//     await schema.validate({
//       slug,
//       url,
//     });
//     if (url.includes('cdg.sh')) {
//       throw new Error('Stop it. 🛑');
//     }
//     if (!slug) {
//       slug = nanoid(5);
//     } else {
//       const existing = await urls.findOne({ slug });
//       if (existing) {
//         throw new Error('Slug in use. 🍔');
//       }
//     }
//     slug = slug.toLowerCase();
//     const newUrl = {
//       url,
//       slug,
//     };
//     const created = await urls.insert(newUrl);
//     res.json(created);
//   } catch (error) {
//     next(error);
//   }
// });
 
app.get('/api/users', async (req, res, next) => {
  try {
    const collection = req.app.locals.collection;
    collection.find({}).toArray(function(err, users){
         
        if(err) return console.log(err);
        return res.send(users)
    });
  } catch (error) {
    return res.status(404).sendFile(notFoundPath);
  }
});
app.get("/api/users", function(req, res){
        
    const collection = req.app.locals.collection;
    collection.find({}).toArray(function(err, users){
         
        if(err) return console.log(err);
        res.send(users)
    });
     
});
app.get("/api/users/:id", function(req, res){
        
    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    collection.findOne({_id: id}, function(err, user){
               
        if(err) return console.log(err);
        res.send(user);
    });
});
   
app.post("/api/users", jsonParser, function (req, res) {
       
    if(!req.body) return res.sendStatus(400);
       
    const userName = req.body.name;
    const userAge = req.body.age;
    const user = {name: userName, age: userAge};
       
    const collection = req.app.locals.collection;
    collection.insertOne(user, function(err, result){
               
        if(err) return console.log(err);
        res.send(user);
    });
});
    
app.delete("/api/users/:id", function(req, res){
        
    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    collection.findOneAndDelete({_id: id}, function(err, result){
               
        if(err) return console.log(err);    
        let user = result.value;
        res.send(user);
    });
});
   
app.put("/api/users", jsonParser, function(req, res){
        
    if(!req.body) return res.sendStatus(400);
    const id = new objectId(req.body.id);
    const userName = req.body.name;
    const userAge = req.body.age;
       
    const collection = req.app.locals.collection;
    collection.findOneAndUpdate({_id: id}, { $set: {age: userAge, name: userName}},
         {returnDocument: "after" },function(err, result){
               
        if(err) return console.log(err);     
        const user = result.value;
        res.send(user);
    });
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

const port = process.env.PORT || 1337;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});