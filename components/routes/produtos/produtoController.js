const express = require("express");
const router = express.Router();
const userLogin = require("../user/userLogin");
const produtoModel = require("../../models/product/product.model");

router.get("/rotaprotegida", userLogin.authMiddleWare ,function(req, res){
    res.json({titlle:"Rota protegida liberada...!"})
})

router.get("/", userLogin.authMiddleWare, function(req, res){
     produtoModel.find({})
        .populate("user")
        .exec(function(err, foundProdutos){
         if(err){
             return res.status(400).send({message:"verificar GET da rota produtoController"});
         }
            return res.send(foundProdutos);
     }) 
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

