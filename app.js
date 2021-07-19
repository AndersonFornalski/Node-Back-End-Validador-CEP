const express = require("express")
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 3010;
const dataBase = require("./dataBase/url");

//Controllers
const userControl = require("./components/routes/user/userController"),
      cidadeControl = require("./components/routes/cidade/cidadeController")


const app = express();

mongoose.connect(dataBase.Url_mongoDb, { useNewUrlParser: true, useUnifiedTopology: true  },
    console.log("Mongoose Ok"))  
    
    
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
app.use("/cidade", cidadeControl);


app.listen(PORT, function(){
    console.log("rodando na porta 3010")
})

