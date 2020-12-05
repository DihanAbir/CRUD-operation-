var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
const { get } = require("http");



// dot env section  
// const pass = "4kbxoIxF2oWUNA0u";
// const dbname = "crudDB";

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors()) 

const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID


const uri = "mongodb+srv://crudDB:4kbxoIxF2oWUNA0u@cluster0.p8ju7.mongodb.net/crudDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });






app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html")
  console.log("db connnection is successful");
});





client.connect((err) => {
  const collection = client.db("crudDB").collection("crudDB");

  app.post("/addProduct", (req, res) => {
      const product  = req.body;
      collection.insertOne(product)
      .then((result) =>{
          console.log('insert data success');
          res.redirect('/')
      })
  })


  app.get('/products', (req, res) =>{
    collection.find({})
    .toArray( (err, documents) => {
        res.send(documents)
    })
  })

  app.get('/product/:id', (req, res) =>{
    collection.find({ _id: ObjectID(req.params.id) })
    .toArray(  (err, documents) => {
        res.send(documents[0])
    })

  })

  app.patch('/update/:id', (req, res) => {
    
      collection.updateOne({ _id: ObjectID(req.params.id)},
      {
          $set: {
              price: req.body.price,
              quantity: req.body.quantity,
              name: req.body.name
          }
      })
      .then(result =>{
          res.send(result.modifiedCount > 0)
      })
  })


  app.delete( '/delete/:id', (req, res) =>{
      collection.deleteOne({ _id: ObjectID(req.params.id)})
      .then(result =>{
         res.send(result.deletedCount > 0)
      })

  })

  
  
  console.log('collection mongo server is  success')
  
});

app.listen(3000);
