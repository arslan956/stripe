const mongoose = require('mongoose');
const userSchema  = mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
    },
    source:{
        type:String,
    },
    amount:{
        type:Number,
    },
    currency:String,
    description:String,
});
const User = mongoose.model('data',userSchema);
module.exports=User;