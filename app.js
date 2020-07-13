//Carregando Modulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require("./routes/admin") 
const path = require("path")
const mongoose = require('mongoose')
const session = require("express-session")
const flash = require("connect-flash")
require('./models/postagem')
const Postagem = mongoose.model("postagem")
const usuarios = require("./routes/usuario")
const passport = require("passport")
require("./config/auth")(passport)
const db = require("./config/db")

//Configurações
    //Sessão
        app.use(session({
            secret: "cursonode",
            resave: true,
            saveUninitialized: true
        }))
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())
    //Middleware
        app.use(function(req, res, next){
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null
            next()
        })
    //BodyParser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars');
    //Mongoose
    mongoose.Promise = global.Promise;
        mongoose.connect(db.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true}).then(function(){
            console.log("Conectado ao mongo")
        }).catch(function(Error){
            console.log("Erro ao se conectar: "+ Error)
        })
    // Public
        app.use(express.static(path.join(__dirname, "public")))
//Rotas
    app.get('/', function(req, res){
        Postagem.find().populate("categoria").sort({data: "desc"}).lean().then(function(postagens){
            res.render("index", {postagens: postagens})
        }).catch(function(err){
            req.flash("erros_msg", "Houve um erro interno")
            res.render("/404")
        })
        
    })
    app.get("/404", function(req, res){
        res.send('Erro 404!')
    })

    app.get("/postagem/:slug", function(req, res){
        Postagem.findOne({slug: req.params.slug}).lean().then(function(postagens){
            if(postagens){
                res.render("postagem/index", {postagens: postagens})
            }else{
                req.flash("error_msg", "Esta postagem não existe")
                res.redirect("/")
            }
        }).catch(function(err){
            req.flash("error_msg","Houve um erro interno")
            res.redirect("/")
        })
    })
    
    app.use('/admin', admin)
    app.use("/usuarios", usuarios)
    
//Outros
const PORT = process.env.PORT ||8081
app.listen(PORT, function(){
    console.log("Servidor rodando! ")
})
