const express = require("express");
const router = express.Router();
const userLogin = require("../user/userLogin");
const produtoModel = require("../../models/product/product.model");
const User = require("../../models/user/user.model")

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

//função onde cada usuario altera seus dados separadamente
router.get("/manage", userLogin.authMiddleWare, function(req, res){
    const user = res.locals.user

    produtoModel.where({user})
        .populate("user")
        .exec(function(error,foundProduto){
            if(error){
                return res.status(400).send({title:"Erro", detail:"erro ao tentar localizar usuario Manage"})
            }

            return res.send(foundProduto);
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

//funcao de pesquisa de produtos por descricao
router.get("/pesquisa", function(req, res){
    const descricao = req.query.descricao
    const query = descricao ? {descricao: descricao} : {}; 
    
    produtoModel.find(query)
                .exec(function(error, foundProduto){
                    if(error){
                       return res.status(400).send({title:"erro ao efetuar pesquisa"})
                    }
                    if(descricao && foundProduto.length === 0){
                       return res.status(400).send({title:"nome não encontrado", detail:`nada encontrado com o nome de ---${descricao}--- `})
                    }
                        return res.send(foundProduto);
                    
    })  
   
})

//post versão 2 com authorization
router.post("/v2",userLogin.authMiddleWare , function(req, res){
    const user = res.locals.user

    const { titulo, descricao, categoria, valor, cep, cidade, estado, celular, fixo, 
            image, image2, image3, image4, image5 } = req.body;

    const userSave=
      new produtoModel({ titulo, descricao, categoria, valor, 
                         cep, cidade, estado, celular, fixo, 
                         image, image2, image3, image4, image5});

    userSave.user = user

    produtoModel.create( userSave,function(err, novoProduto){
        if(err){
           return res.status(400).send({title:"Não pode salvar no banco de dados", detail:"verificar o POST no useController!"})
        }
         
      User.update({_id: user.id}, {$push: {produto: novoProduto}}, function(){});
      
      return res.send(novoProduto);
    })
})

//ESTÁ SENDO USADO NO FRONT-END ESSE NO MOMENTO COM AUTENTICAÇÃO
router.patch("/v2/:id", userLogin.authMiddleWare, function(req, res){
    const user = res.locals.user
    
    const produtoData = req.body
    const produtoId = req.params.id;    

    produtoModel.findById(produtoId)
            .populate("user")
            .exec( function(err, foundProdutos){
            if(err){
                res.status(400).send({errors:[{title:"Update incorreto", detail:"náo pode editar corretamente"}]});
            }
             if(foundProdutos.user.id !== user.id) {
                return res.status(400).send({error:"Usuario inválido, você não pode editar "})
            }
                foundProdutos.set(produtoData)
                foundProdutos.save(function(error){
                    if(error){
                      return res.status(400).send({errors:[{title:"Update incorreto", detail:"náo pode editar corretamente"}]});
                    }
                   return res.send(foundProdutos)
                })
             
        });
    });



router.delete("/v2/:id", userLogin.authMiddleWare, function(req, res){
    const user = res.locals.user;

    produtoModel.findById(req.params.id)
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

