/*var express = require('express');
var app = express();
var puerto = 3001;
var _path = require('path');
var bodyParser = require('body-parser');
//MONGODB
var mongoose = require('mongoose');
var api = require('./api/api')

app.set('views', __dirname + '/daniel/dist');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.json());

app.use(express.static(_path.join(__dirname, 'daniel')));
app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.get('/',function(req, res){
    res.sendFile(__dirname + '/daniel/dist/');
});
app.use('/api', api);
app.use(function(err, req, res, next) {
    res.status(500).send('Algo esta mal con el servidor!');
}); 

app.listen(puerto, function(){
    console.log('Servidor activo en el puerto: '+puerto);
});*/


var express= require("express"),
http= require("http"),
bodyparser= require("body-parser"),
mongo= require("mongodb");
var _path = require('path');
var mongoose = require('mongoose'); 

var app= express();
mongoose.connect( 'mongodb://localhost:27017/daniel', { useMongoClient: true } );
mongoose.Promise = global.Promise;
//db= new mongo.Db("daniel", new mongo.Server("localhost", "27017"), {safe:true}, {auto_reconnect: true});
var Schema = mongoose.Schema;
var autores= mongoose.model('autores', {
        nombre: String,
        title: String,
        fecha: String,
        nacionalidad: String
    });
    var libros= mongoose.model('libros', {
        isbn: String,
        title: String,
        publisher: String,
        autor: { type: Schema.ObjectId, ref: 'autores' } ,
        price:Number
        });


var api = require('./api/api');
app.use('/api', api);
app.use(bodyparser.urlencoded({extended: true}));

app.set('views', __dirname + '/daniel/dist');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(bodyparser.json()); 

app.use(express.static(_path.join(__dirname, 'daniel')));
app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})
app.get('/',function(req, res){
    res.sendFile(__dirname + '/daniel/dist/');
});
//db.open(function(err, db){
    //if(err)
    //    console.log(err);
          
          app.get('/api/getAllBooks', function(req, res, next) { 
              var arr=[];
              var a=true;
            autores.find({}, function(err, result) {
                for(var i=0;i<result.length;i++){
            libros.find({autor:result[i]._id})
                   .populate('autor') // <--
                   .exec(function (err, libro) {
                     if (err) {console.log(err);}else{
                        if (libro.length >0) {
                            for(var j=0;j<libro.length;j++){
                        arr.push(libro[j]);
                            }
                        }
                     } 
                     if((i==result.length)&&(a==true)){
                        a=false;
                        setTimeout(function() {  
                            res.json(arr);
                        }, 100);}
                   }); 
               }
           
             }); 
           });
  
          
          
          /* GET SINGLE BOOK BY ID */
            app.get('/api/getBook/:id', function(req, res, next) { 
                var id=req.params.id.toString();
                libros.findOne({_id:mongo.ObjectId(id)}, function(err, result) {
                  if (err) throw err;
                  console.log(result); 
                  res.json(result);
                });
    
              });
          
          /* UPDATE BOOK */
          app.put('/api/updateBook/:id', function(req, res, next) {
            var id=req.params.id.toString();
            var data=req.body;
            var info={'isbn':data.isbn,'title':data.title,'author':data.author,'publisher':data.publisher,'price':data.price};
            libros.updateOne({_id:mongo.ObjectId(id)}, info, function (err, post) {
              if (err) return next(err);
              res.json(post);
            });
          });
          
          /* DELETE BOOK */
          app.delete('/api/deleteBook/:id', function(req, res, next) {
            var id=req.params.id.toString();
            libros.deleteOne({_id:mongo.ObjectId(id)}, function (err, post) {
              if (err) return next(err);
              res.json(post);
            });
          });

        app.post("/api/saveBook", function(req, res){
            var item = req.body;
            var Libro=new libros({
                isbn: item.isbn,
                title: item.title,
                publisher: item.publisher,
                autor: mongo.ObjectId(item.autor) ,
                price:item.price
              });
              Libro.save( 
                function(err, doc){
                        if(err)
                            throw err;
                            res.json(doc);
                        //res.redirect("/");
                });
        });

//----------------------------------------

        app.get('/api/getAllAutores', function(req, res, next) { 
            autores.find({},function(err, result) {
                if (err) throw err;
                console.log(result);
                res.json(result);
            }); 

          });
          
            app.get('/api/showAutor/:id', function(req, res, next) { 
                var id=req.params.id.toString();
                autores.findOne({_id:mongo.ObjectId(id)}, function(err, result) {
                  if (err) throw err;
                  console.log(result); 
                  res.json(result);
                });
              });
          
          app.put('/api/updateAutor/:id', function(req, res, next) {
            var id=req.params.id.toString();
            var data=req.body;
            var info={'isbn':data.isbn,'title':data.title,'author':data.author,'publisher':data.publisher,'price':data.price};
            console.log(req.body)
            autores.updateOne({_id:mongo.ObjectId(id)}, info, function (err, post) {
              if (err) return next(err);
              res.json(post);
            });
          });
          
          /* DELETE BOOK */
          app.delete('/api/deleteAutor/:id', function(req, res, next) {
            var id=req.params.id.toString();
            autores.deleteOne({_id:mongo.ObjectId(id)}, function (err, post) {
              if (err) return next(err);
              res.json(post);
            });
          });

        app.post("/api/saveAutor", function(req, res){
            var item = req.body; 
            var Autor=new autores({
                nombre: item.nombre,
                title: item.title,
                fecha: item.fecha,
                nacionalidad: item.nacionalidad
              })
              Autor.save( 
                function(err, doc){
                        if(err)
                            throw err;
                            res.json(doc); 
                });
        });
    
//});

app.listen(3000, function(){
    console.log("Now Listening on port: 3000");
});