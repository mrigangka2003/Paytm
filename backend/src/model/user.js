import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type : String ,
        required : true 
    },
    firstname :{
        type:String ,
        required: true,
        lowercase : true,
        trim : true
    },
    lastname :{
        type :String ,
        required :true,
        lowercase : true,
        trim : true
    },
    username :{
        type:String,
        unique : true ,
        lowercase : true ,
        required : true,
        trim : true,
        minLength : 3 ,
        maxLength:10
    },
    password:{
        type:String ,
        required: true,
        minLenght : 6
    }

});


const User = mongoose.model('User', userSchema) ;
export default User ;