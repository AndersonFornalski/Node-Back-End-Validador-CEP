const express = require("express")
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 3010;
const dataBase = require("./dataBase/url");

//Controllers
const userControl = require("./components/routes/user/userController"),
      produtoControl = require("./components/routes/produtos/produtoController"),
      imageUpload = require("./components/routes/imagens/image1Controller"),
      imageUpload2 = require("./components/routes/imagens/image2Controller"),
      imageUpload3 = require("./components/routes/imagens/image3Controller"),
      imageUpload4 = require("./components/routes/imagens/image4Controller"),
      imageUpload5 = require("./components/routes/imagens/image5Controller")


const app = express();

mongoose.connect(dataBase.Url_mongoDb, { useNewUrlParser: true, useUnifiedTopology: true  },
    console.log("Conexion Mongoose Ok"))  
    
    
app.use((req, res, next) =>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'GET,PUT,PATCH,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "*");
    //res.header('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
    app.use(cors());
    next();
});
app.use(bodyParser.json())


//Routes
app.use("/user", userControl);
app.use("/produto", produtoControl);
app.use("/imagem", imageUpload );
app.use("/imagem", imageUpload2 );
app.use("/imagem", imageUpload3 );
app.use("/imagem", imageUpload4 );
app.use("/imagem", imageUpload5 );






app.listen(PORT, function(){
    console.log("running in port 3010")
})
