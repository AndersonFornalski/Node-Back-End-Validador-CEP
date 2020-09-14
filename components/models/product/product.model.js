const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const produtoSchema = new Schema({
    name:{type: String },
    laboratorio:{type: String},
    categoria:{type: String},
    imagem:{type: String},
    user:{type: Schema.Types.ObjectId, ref:"User"} 
})



module.exports = mongoose.model("Produto", produtoSchema);
