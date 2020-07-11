const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require('../models/categoria')
const categoria = require("../models/categoria")
require('../models/postagem')
const postagem = require("../models/postagem")
const {eAdmin} = require("../helpers/eadmin")

router.get('/', eAdmin, function(req,res){
    res.render("admin/index")
})

router.get('/posts', eAdmin, function(req,res){
    res.send("Pagina de posts ")
})

router.get('/categorias', eAdmin, function(req,res){
    categoria.find().sort({date:"desc"}).lean().then(function(categorias){
        res.render("admin/categorias", {categorias: categorias})
    }).catch(function(Error){
        req.flash("error_msg", "Houve um erro ao listar as categorias"+Error)
        res.redirect("/admin")
    })
})

router.get('/categorias/add', eAdmin, function(req, res){
    res.render("admin/addcategorias")
})

router.post("/categorias/nova", eAdmin, function(req, res){

    var erros = []
    
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }
    
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"})
    }

    if(erros.length > 0){
        res.render("admin/addcategorias", {erros: erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
            }

        new categoria(novaCategoria).save().then(function(){
            req.flash("success_msg", "Categoria criada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch(function(Error){
            req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente!")
            res.redirect("/admin")
        })  
    }
})

router.get("/categorias/edit/:id", eAdmin, function(req, res){
    categoria.findOne({_id:req.params.id}).lean().then(function(categoria){
        res.render("admin/editcategorias", {categoria: categoria})
    }).catch(function(Error){
        req.flash("error_msg", "Esta categoria não existe")
        re.redirect("/admin/categorias")
    })
})
    
router.post("/categorias/edit", eAdmin, function(req, res){

    var erros = []
    
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null || req.body.nome.length < 2) {
        erros.push({
            texto: "Nome inválido"})
    }
    
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({
            texto: "Slug inválido"})

    }

    if(erros.length > 0) {
        req.flash('errorMsg', erros[0].texto)
        res.redirect(`edit/${req.body.id}`)
    
    }else
    
categoria.findOne({_id: req.body.id}).then(function(categoria){
        
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(function(){
            req.flash("success_msg", "Categoria editada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch(function(err){
            req.flash("error_msg", "Houve um erro interno ao salvar a edição da categoria")
            res.redirect("/admin/categorias")
        })

    }).catch(function(err){
        req.flash("error_msg", "Houve um erro ao editar a categoria")
        res.redirect("/admin/categorias")
    })

  })

    router.post("/categorias/deletar", eAdmin, function(req, res){
      categoria.deleteOne({_id: req.body.id}).then(function(){
          req.flash("success_msg", "Categoria deletada com sucesso")
          res.redirect("/admin/categorias")
      }).catch(function(err){
          req.flash("error_msg", "Erro ao deletar a categoria")
          res.redirect("/admin/categorias")
      })
  })

    router.get("/postagens", eAdmin, function(req, res){

        postagem.find().lean().populate("categoria").sort({data: "desc"}).then(function(postagens){
            res.render("admin/postagens", {postagens: postagens})
        }).catch(function(err){
            req.flash("error_msg", "Houve um erro ao listar as postagens")
            res.redirect("/admin/postagens")
        })
  })

    router.get("/postagens/add", eAdmin, function(req, res){
        categoria.find().lean().then(function(categoria){
            res.render("admin/addpostagem", {categoria: categoria})
        }).catch(function(err){
            req.flash("error_msg", "Houve um erro ao carregar o formulário")
            res.redirect("/admin")
        })
        
    })
    router.post("/postagens/nova", eAdmin, function(req, res){

        var erros = []

        if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
            erros.push({texto: "Insira o titulo"})
        }

        if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.titulo == null){
            erros.push({texto: "Insira a descrição"})
        }

        if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
            erros.push({texto: "Insira slug"})
        }

        if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null ){
            erros.push({texto: "Insira o conteúdo"})
        }

        if(req.body.categoria == "0"){
           erros.push({texto: "Categoria inválida, registre uma categoria"})
        }

        if(erros.length > 0){
            res.render("admin/addpostagem", {erros: erros})
        }else{
            const novaPostagem = {
                titulo: req.body.titulo,
                slug: req.body.slug,
                descricao: req.body.descricao,
                conteudo: req.body.conteudo,
                categoria: req.body.categoria
            }

            new postagem(novaPostagem).save().then(function(){
                req.flash("success_msg", "Postagem criada com sucesso!")
                res.redirect("/admin/postagens")
            }).catch(function(err){
                req.flash("error_msg", "Houve um erro na criação da postagem")
                res.redirect("/admin/postagens")
            })
        }
    })

    router.get("/postagens/edit/:id", eAdmin, function(req, res){

        postagem.findOne({_id: req.params.id}).lean().then(function(postagem){
            categoria.find().lean().then(function(categoria){
                res.render("admin/editpostagens", {categoria: categoria, postagem: postagem})
            }).catch(function(err){
                req.flash("error_msg", "Houve um erro ao listar as categorias")
                res.redirect("/admin/postagens")
            }) 
        }).catch(function(err){
            req.flash("error_msg", "Houve um erro ao carregar o formulário de edição")
            res.redirect("/admin/postagens")
        })
    })

    router.post("/postagens/edit", eAdmin, function(req, res){

            postagem.findOne({_id: req.body.id}).then(function(postagem){

                postagem.titulo = req.body.titulo
                postagem.slug = req.body.slug
                postagem.descricao = req.body.descricao
                postagem.conteudo = req.body.conteudo
                postagem.categoria = req.body.categoria

                postagem.save().then(function(){
                    req.flash("success_msg", "Postagem editada com sucesso!")
                    res.redirect("/admin/postagens")
                }).catch(function(err){
                    req.flash("error_msg", "Erro interno")
                    res.redirect("/admin/postagens")
                })

            }).catch(function(err){
                console.log(err)
                req.flash("error_msg", "Houve um erro ao salvar a edição")
                res.redirect("/admin/postagens")
            })
    })

    router.get("/postagens/deletar/:id", eAdmin, function(req, res){
        postagem.deleteOne({_id: req.params.id}).then(function(){
            req.flash("success_msg", "Postagem deletada com sucesso")
            res.redirect("/admin/postagens")
        }).catch(function(err){
            req.flash("error_msg", "Erro ao deletar a postagem")
            res.redirect("/admin/postagens")
    })
})

module.exports = router