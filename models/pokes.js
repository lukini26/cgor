var mongoose = require('mongoose');
var PokeSchema = new mongoose.Schema({
    usernamepo:{
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    
    p: [Boolean],
    t:[Boolean],
    s:[Boolean],
    ts:[Boolean],
} ) ; 

    var Poke = mongoose.model('Poke', PokeSchema);
    module.exports = Poke;
    


  
  