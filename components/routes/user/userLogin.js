const userModel = require("../../models/user/user.model");
const jwt = require("jsonwebtoken");
const config = require("../../../dataBase/tokenConfig")


exports.auth = function (req, res) {
    const { email, senha } = req.body;

    if(!senha || !email){
        return res.status(422).send({errors:[{title:"", detail:"e-mail ou senha nao encontrado"}]});
     }
     userModel.findOne({ email }, function(err, user){
         if(err){
            return res.status(422).send({"mongoose": "erro no mongoDb"});
         }
         if(!user){
             return res.status(422).send({errors:[{title:"Usuario Inválido!", detail:"Usuário não existe!"}]});
         }

        //token - login 
         if(user.hasSamePassword(senha)){
            const token =  jwt.sign({
                userId: user.id,
                nomeUsuario: user.nomeUsuario                       
                   }, config.TOKEN_SECRET, { expiresIn: "1h"});

            return res.json(token);
         }
         else{
            return res.status(422).send({errors:[{title:"Dados errados!", detail:"email ou senha inválidos"}]});
         }
         
     });

}


//REGISTRO DE USUARIO//
exports.register = function (req, res) {
    const { nomeUsuario, email, senha, confirmacaoSenha } = req.body;
    
    if(!senha || !email){
       return res.status(422).send({errors:[{title:"Dados faltando!", detail:"necessario e-mail e senha"}]});
    }
    if(senha !== confirmacaoSenha){
        return res.status(422).send({errors:[{title:"senha invalida!", detail:"senha não é a mesma, tente novamente!"}]});
    }

    userModel.findOne({email}, function(err, existirUsuario){
        if(err){
            return res.status(422).send({Title: "Erro ao confirmar email no banco!"});
        }
        if(existirUsuario){
            return res.status(422).send({errors:[{title:"email inválido!", detail:"ja existe esse usuário!"}]});
        }

        const User = new userModel({
            nomeUsuario,
            email,
            senha
        });
        User.save(function(err, user){
            if(err){
                return res.status(422).send({title:"Erro ao tentar a salvar usuario no banco"});
            }
            return res.status(200).send(user);
        })
    })
    //res.json({username, email});

}



exports.authMiddleWare = function (req, res, next){
    const token = req.headers.authorization;

    if(token){
        const user = parseToken(token);

        userModel.findById(user.userId, function(err, user){
            if(err){
                return res.status(422).send({errors:[{title:"Erro!", detail:"Sem Acesso!"}]});
            }
            if(user){
               res.locals.user = user;
               next();
            }else{
                return res.status(422).send({errors:[{title:"Não autorizado!", detail:"Voce precisa estar logado para acessar o conteudo!"}]});
            }
        })       
}

function parseToken(token){
    return jwt.verify(token.split(' ')[1], config.TOKEN_SECRET);
    }
  
//function notAuthorization(){
  //  return res.status(422).send({errors:[{title:"nao autorizado!", detail:"You need to login to get access!"}]})
//}    

}



