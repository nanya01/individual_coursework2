const express = require("express");
var cors = require('cors')
var path = require("path");
var fs = require("fs");
const app = express();
 var mongodb = require('mongodb')
let db; 
var MongoClient = mongodb.MongoClient;  
const ObjectID = mongodb.ObjectID;
var url = "mongodb+srv://nanya:nanya@cluster0.1oef9f0.mongodb.net/";  
const MONGODB_USERNAME = "nanya";
const MONGODB_PASSWORD = "nanya";
const PROJECT_ID = "644a5e471f79d15a6cecb11f";
const MONGODB_PUBLICKEY = "xiprooaw";
const MONGODB_PRIVATEKEY = "533eb750-9290-4a18-8471-5d8e3f69b7ca";
const MONGODB_CLUSTER = "Cluster0";
MongoClient.connect(url, function(err, client) {  
if (err) throw err;  
db = client.db('product')
console.log("Database created!");  
 
});  
app.use(express.json())


app.use(cors())
// logging middleware
app.use(function(req, res, next){
    console.log("Request IP: " + req.url);
    console.log("Logging middleware")
   next();
}); 


// static file  middleware
app.use(function(req, res, next){
    // uses path.join to find the path where the file should be
    var filePath = path.join(__dirname, "static", req.url);
    // Built-in fs.stat gets info about a file
    fs.stat(filePath, function(err, fileInfo){
        if(err){
        next();
        return;
        }

        if(fileInfo.isFile()){
            console.log("Found file");
            res.sendFile(filePath);
        }
        else{
            console.log("wrong file");
            next();
        }
    });
})
app.param('collectionName', (req, res, next, collectionName) => { 
     req.collection = db.collection(collectionName)
      return next()});

      // GET all Request
  app.get('/collection/:collectionName', (req, res, next) =>{
   // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
     req.collection.find({}).toArray((e, result) =>{
        if(e) return next(e)

        res.send(result);
     })
  });
  app.get('/collection/:collectionName/:search', (req, res, next) =>{
      req.collection.findOne({
        "topic": req.params.search
      },(e, result) =>{
         if(e) return next(e)
 
         res.send(JSON.stringify(result));
      })
  
   });

   app.get('/collection/:collectionName/search', async (req, res) =>{
        const searchTerm = req.query.q;
        const searchResults = await collection.find({ $text: { $search: searchTerm } }).toArray();

        res.json(searchResults);
   });

      //  POST request 
app.post('/collection/:collectionName', (req, res, next) => {
    //res.setHeader('Access-Control-Allow-Origin', '*');
    req.collection.insert(req.body, (e, result) => {
            if(e) return next(e);

            res.send(result.ops)

    })
});

app.put('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.update(
        {_id: new ObjectID(req.params.id)},
        {$set: req.body},
        {safe:true, multi:false},
        (e, result) =>{
            if(e) return next(e)

            res.send((result.result.n ===1) ? {msg: 'success'} : {msg: 'error'})
        }
    )
});
app.use(function(req, res){
        res.status(404);

        // Sends the error "File not found!"
        res.send("File not found!");
});
app.listen(3000, () => {
        console.log("listening on port 3000")
});