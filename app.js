const express = require("express");
var path = require("path");
var fs = require("fs");
const app = express();

let db; 
var MongoClient = require('mongodb').MongoClient;  
var url = "mongodb+srv://nanya:nanya@cluster0.1oef9f0.mongodb.net/";  
MongoClient.connect(url, function(err, client) {  
if (err) throw err;  
db = client.db('products')
console.log("Database created!");  
 
});  

// logging middleware
app.use(function(req, res, next){
    console.log("Request IP: " + req.url);
    console.log("Logging middleware")
   next();
}); 

// static file  middleware
app. use(function(req, res, next){
    // uses path.join to find the path where the file should be
    var filePath = path.join(__dirname, "static", req.url);
    // Built-in fs.stat gets info about a file
    fs.stat(filePath, function(err, fileInfo){
        if(err){
        next();
        return;
        }

        if(fileInfo.isFile()) res.sendFile(filePath);
        else next();
    });
})
app.param('collectionName', (req, res, next, collectionName) => { 
     req.collection = db.collection(collectionName)
      return next()})
// post request 

app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (e, results) => {
            if(e) return next(e);

            res.send(result.ops)

    })
})
app.use(function(req, res){
        res.status(404);

        // Sends the error "File not found!"
        res.send("File not found!");
});
app.listen(3000, () => {
        console.log("listening on port 3000")
});