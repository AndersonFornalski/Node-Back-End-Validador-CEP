const express = require("express");
const router = express.Router();
const userLogin = require("../user/userLogin");
const produtoModel = require("../../models/product/product.model");
const User = require("../../models/user/user.model")

router.get("/rotaprotegida", userLogin.authMiddleWare ,function(req, res){
    res.json({titlle:"Rota protegida liberada...!"})
})

router.get("/", function(req, res){
     produtoModel.find()
        .populate("user")
        .exec( function(err, foundProdutos){
         if(err){
             return res.status(400).send({message:"verificar GET da rota produtoController"});
         }
            return res.send(foundProdutos);
     }) 
})


router.get("/manage", userLogin.authMiddleWare, function(req, res){
    
})


router.get("/:id", function(req, res){
    const prodId = req.params.id;

    produtoModel
        .findById(prodId)
        .populate("user")
        .exec (function(err, foundProdutos){
        if(err){
            res.status(400).send({message:"nao conseguiu listar pelo Id, verifique a API "})
        }
            res.send(foundProdutos);
    })
})


router.delete("/v2/:id", userLogin.authMiddleWare, function(req, res){
    const user = res.locals.user;
    
    
    produtoModel.findById(req.params.id)
                .populate("user","_id")
                .exec(function(error, encontreProduto){
                    if(error){
                        return res.status(422).send({error:"erro ao executar a exclusão"})
                    }
                    if( user.id !== encontreProduto.user.id ){
                        return res.status(400).send({error:"Usuario Invalido!  nao pode excluir, verificar Id"})
                    }
                    encontreProduto.remove(function(erro){
                        if(erro){
                             return res.status(400).send({error:"erro ao tentar remover"})
                        }
                        return res.json({detail:"deletado com sucesso pelo id"})
                    })
                })
})


router.post("/", function(req, res){
    const { name, laboratorio, categoria } = req.body;
    const userSave = new produtoModel({ name, laboratorio, categoria });

    userSave.save(function(err, userCreated){
        if(err){
           return res.status(400).send({title:"Não pode salvar no banco de dados", detail:"verificar o POST no useController!"})
        }
           return res.send(userCreated);
    })
})

//post versão 2 com authorization
router.post("/v2",userLogin.authMiddleWare , function(req, res){
    const user = res.locals.user

    const { name, laboratorio, categoria } = req.body;
    const userSave = new produtoModel({ name, laboratorio, categoria});

    userSave.user = user

    produtoModel.create( userSave,function(err, novoProduto){
        if(err){
           return res.status(400).send({title:"Não pode salvar no banco de dados", detail:"verificar o POST no useController!"})
        }
         
      User.update({_id: user.id}, {$push: {produto: novoProduto}}, function(){});
      
      return res.send(novoProduto);
    })
})




router.patch("/:id", function(req, res){
    const produtoId = req.params.id;
    const { name, laboratorio, categoria } = req.body

    produtoModel.findById(produtoId, function(err, foundProdutos){
            if(err){
                res.status(400).send({errors:[{title:"Update incorreto", detail:"náo pode editar corretamente"}]});
            } else {
                foundProdutos.set({name, laboratorio, categoria})
                foundProdutos.save()
                .then((ok)=> res.status(200).send(ok))
                .catch((error)=>res.status(500).send(error));                              
            }
        });
    });



router.delete("/:id", function(req, res){
    const produtoId = req.params.id;

    produtoModel.findByIdAndDelete(produtoId, function(err, foundProdutos){
        if(err){
            res.status(400).send({message:"nao conseguiu deletar pelo Id, verificar"})
        }
            res.send({message:"deletado com sucesso!"});
    })
})





module.exports = router;

