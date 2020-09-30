const express = require("express");
const router = express.Router();
const userLogin = require("../user/userLogin");

const upload = require("../../upload/imageUpload"); 


const singleUpload = upload.single("image5");

router.post("/imageUpload5", userLogin.authMiddleWare, function(req, res){
    singleUpload(req, res, function(err){
        if(err){
            
            res.status(422).send({errors: [{title:"Erro ao fazer Upload da imagem", detail: err.message}]});
        }
        return res.json({"imageUrl": req.file.location });
    });
});



module.exports = router;