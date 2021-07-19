const express = require("express");
const router = express.Router();
const userLogin = require("../user/userLogin");
const cidadeModel = require("../../models/cidade/cidade.model");
const User = require("../../models/user/user.model")

router.get("/", function(req, res){
     cidadeModel.find()
        .populate("user")
        .exec( function(err, foundCidades){
         if(err){
             return res.status(400).send({message:"verificar GET da rota cidadeController"});
         }
            return res.send(foundCidades);
     }) 
})

router.get("/:id", function(req, res){
    const prodId = req.params.id;

    cidadeModel
        .findById(prodId)
        .populate("user")
        .exec (function(err, foundCidades){
        if(err){
            res.status(400).send({message:"nao conseguiu listar pelo Id, verifique a API "})
        }
            res.send(foundCidades);
    })
})

//post versão 2 com authorization
router.post("/", userLogin.authMiddleWare, function(req, res){
    const user = res.locals.user

    const { nome, CEP } = req.body;

    const userSave =
      new cidadeModel({ nome, CEP });

    userSave.user = user

    cidadeModel.create( userSave, function(err, novoCep){
        if(err){
           return res.status(400).send({title:"Não pode salvar no banco de dados", detail:"verificar o POST no useController!"})
        }
         
      User.update({_id: user.id}, {$push: {cidade: novoCep}}, function(){});
      
      return res.send(novoCep);
    })
})

router.post("/", function(req, res){
    const { nome, CEP } = req.body;

        const error = [];
        if(!nome) error.push("nome");
        if(!CEP) error.push("CEP");
        if(error.length > 0) return res.status(422).json({ error: "required", payload: error});

    const userSave = new userModel({ nome, CEP  });

    userSave.save(function(err, userCreated){
        if(err){
           return res.status(400).send({title:"Não pode salvar no banco de dados", detail:"verificar o POST no cidadeController!"})
        }
           return res.send(userCreated);
    })
})

router.delete("/v2/:id", userLogin.authMiddleWare, function(req, res){
    const user = res.locals.user;

    cidadeModel.findById(req.params.id)
                .populate("user","_id")
                .exec(function(error, encontreProduto){
                    if(error){
                        return res.status(422).send({error:"erro ao executar a exclusão"})
                    }
                    if( user.id !== encontreProduto.user.id ){
                        return res.status(400).send({error:"Seu usuario não é o mesmo, você não pode excluir "})
                    }
                    encontreProduto.remove(function(erro){
                        if(erro){
                             return res.status(400).send({error:"erro ao tentar remover"})
                        }
                        return res.json({detail:"deletado com sucesso pelo id"})
                    })
                })
})


module.exports = router;

