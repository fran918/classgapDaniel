var express = require('express'),
router = express.Router(),
_http = require('http'),
MongoClient=require('mongodb').MongoClient,
ObjectID=require('mongodb').ObjectID;

const connection=(closure)=>{
    return MongoClient.connect('mongodb://localhost:27017/daniel',(err,db)=>{
        if(err) return console.log(err);
        closure(db); 
    })
}

const sendError = (err,res)=>{
    response.status=501;
    response.message=typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
}
let response = {
    status:200,
    data:[],
    message:null
}
router.get('/perfil', (req, res) =>{
    connection((db) => {
        db.collection('perfiles')
        .find()
        .toArray()
        .then((perfiles) =>{
            response.data = perfiles;
            console.log(response);
            response.json(response);
        })
        .catch((err)=>{
            sendError(err, res);
        })

    })
});
//SAVE PLACA
router.post('/addplacas', function(req,res,next){
    var item = req.body;
            var aux = db.collection('vehiculos');
    aux.save(item,function(err, item){
                if(err){
                    res.send(err);
                }
                res.json(item);
            });
    
});
router.post('/addperfil2', function(req,res,next){
    var item = req.body;
    console.log(item,'item');
            var aux = db.collection('perfiles');
    aux.save(item,function(err, item){
                if(err){
                    console.log(err,'ERROR');
                    res.send(err);
                }
                console.log(item);
                res.json(item);
            });
    
});

router.post('/register', function(req, res){
    var user = req.body;
    console.log(user,'ww');

    var newUser = new({
        email: 'user',
        password: 'user'
    })
    newUser.save(function(err){
        res.status(200).json(newUser);
    })
})
router.post('/perfil', function(req, res) {

});

module.exports = router;
