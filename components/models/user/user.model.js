const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;


const userSchema = new Schema({

    nomeUsuario:{
        type: String,
        min:[4,"minimo 4 caracters"],
        max:[32, "máximo 32 caracters"]        
        },

    email:{
         type: String,
         required: true,
         unique:true,
         lowercase:true,
         required: "É necessario o e-mail",
         match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]},
    
    senha:{
        type: String,
        min:[4, "mínimo 4 characters"],
        max:[32, "máximo 32 characters"],
        required:"A senha é necessaria",
        },
    
    
        produtos:[{type: Schema.Types.ObjectId, ref:"Produto"}]
})

//senha encriptografada
userSchema.pre("save", async function(next){
    const hash = await bcrypt.hash(this.senha, 10);
    this.senha = hash;

    next();
});

//token//
userSchema.methods.hasSamePassword = function(senhaRequerida){
    return bcrypt.compareSync(senhaRequerida, this.senha);
} 


module.exports = mongoose.model("User", userSchema);
