const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const cidadeSchema = new Schema({ 
    nome:{ type: String },
    CEP:{ type: String },

    user:{ type: Schema.Types.ObjectId, ref:"User"}
    
})

module.exports = mongoose.model("Cidade", cidadeSchema);
