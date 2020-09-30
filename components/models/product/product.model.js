const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const produtoSchema = new Schema({ 
    titulo:{type: String},
    descricao:{type: String},
    categoria:{type: String},
    valor:{type: String},
    cep:{type: String},
    cidade:{type: String},
    estado:{type: String},
    celular:{type: String},
    fixo:{type: String},
    startAt:{type: Date, default: Date.now},        
    image:{type: String},
    image2:{type: String},
    image3:{type: String},
    image4:{type: String},
    image5:{type: String},
    
    user:{type: Schema.Types.ObjectId, ref:"User"}
    
})



module.exports = mongoose.model("Produto", produtoSchema);
