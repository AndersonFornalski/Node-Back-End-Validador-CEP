const express = require("express")
const router = express.Router();
const userLogin = require("../user/userLogin")
const userModel = require("../../models/user/user.model")

///AUTENTICAÇÃO///

router.post("/auth", userLogin.auth);


router.post("/register", userLogin.register)

/// FIM DA AUTENTICAÇÃO///


router.get("/", function(req, res){
     userModel.find(function(err, foundUsers){
         if(err){
             return res.status(400).send({message:"verificar GET da rota userController"});
         }
            return res.send(foundUsers);
     }) 
})

router.get("/:id", function(req, res){
    const userId = req.params.id;

    userModel.findById(userId, function(err, foundUsers){
        if(err){
            res.status(400).send({message:"nao conseguiu listar pelo Id"})
        }
            res.send(foundUsers);
    })
})

//Este POST nao está sendo usado no momento, somente pelo controle de Login
router.post("/", function(req, res){
    const { nomeUsuario, email, senha, produtos} = req.body;
    const userSave = new userModel({ nomeUsuario, email, senha, produtos });

    userSave.save(function(err, userCreated){
        if(err){
           return res.status(400).send({title:"Não pode salvar no banco de dados", detail:"verificar o POST no useController!"})
        }
           return res.send(userCreated);
    })
})

router.patch("/:id", function(req, res){
    const userId = req.params.id;
    const { nomeUsuario, email, senha } = req.body

    userModel.findById(userId, function(err, foundUsers){
            if(err){
                res.status(400).send({errors:[{title:"Update incorreto", detail:"náo pode editar corretamente"}]});
            } else {
                foundUsers.set({nomeUsuario, email, senha})
                foundUsers.save()
                .then((ok)=> res.status(200).send(ok))
                .catch((error)=>res.status(500).send(error));                              
            }
        });
    });

router.delete("/:id", function(req, res){
    const userId = req.params.id;

    userModel.findByIdAndDelete(userId, function(err, foundUsers){
        if(err){
            res.status(400).send({message:"nao conseguiu deletar pelo Id, verificar"})
        }
            res.send({message:"deletado com sucesso!"});
    })
})




module.exports = router;

