var express = require('express');
var app = express();
var puerto = 3000;
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

app.get('*',function(req, res){
    res.sendFile(__dirname + '/daniel/dist/');
});
app.use('/api', api);
app.use(function(err, req, res, next) {
    res.status(500).send('Algo esta mal con el servidor!');
});

mongoose.connect('mongodb://localhost:27017/shop', (err,res)=>{
    if(err){console.log('No se pudo conectar con MongoDB: '+err)}
    console.log('Conexión con MongoDB lista!');
    app.listen(puerto, function(){
        console.log('Servidor activo en el puerto: '+puerto);
    });
})
