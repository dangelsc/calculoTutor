var express = require('express');
var router = express.Router();
var tema=require("../modelo/temas");
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}
/* GET home page. */
router.get('/',isLoggedIn ,function(req, res, next) {
    tema.find((err,lis)=>{
        if(err)
            lis=[];
        res.render('temas/index',{titulo:"Temas",lista:lis});
    });
    
});
router.get('/contenido/:id',isLoggedIn ,function(req, res, next) {
    tema.findById(req.params.id,(err,lis)=>{
        if(err)
            lis=[];
        res.render('temas/contenido',{titulo:"Temas",dato:lis});
    });
    
});
router.get('/delete/:id',isLoggedIn ,function(req, res, next) {
    //req.session.tid=req.params.id;
    tema.deleteOne({_id:req.params.id},function(err,dato){
        res.redirect('/temas/');
    })
    
});
router.get('/edit/:id',isLoggedIn ,function(req, res, next) {
    req.session.tid=req.params.id;
    tema.findById(req.params.id,function(err,dato){
        if(err)
            res.redirect('/temas/');
        else
            res.render('temas/add',{titulo:"Tema Editando",dato:dato,edit:true});
    })
    
});
router.post('/edit',isLoggedIn ,function(req, res, next) {
    req.session.tid
    tema.findByIdAndUpdate(req.session.tid,{titulo:req.body.titulo,dificultad:req.body.dificultad,contenido:req.body.contenido},function(err,dato){
        res.redirect('/temas/');
    })
   // res.render('temas/add',{titulo:"Tema nuevo"});
});
router.get('/create',isLoggedIn ,function(req, res, next) {
    
    res.render('temas/add',{titulo:"Tema nuevo",dato:{titulo:'',contenido:'',dificultad:'m'},edit:false});
});
router.post('/create',isLoggedIn ,function(req, res, next) {
    n=new tema();
    n.titulo=req.body.titulo;
    n.contenido=req.body.contenido;
    n.dificultad=req.body.dificultad;
    n.save((err,nu)=>{
        if(err)
            res.redirect('/temas/create');
        else
            res.redirect('/temas/');
    });
    //res.render('temas/add',{titulo:"Temas nuevo",lista:});
});
module.exports = router;