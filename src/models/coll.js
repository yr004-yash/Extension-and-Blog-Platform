import validator from "validator";
import mongoose from "mongoose";

//Schema
const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
        minLength:3,
        unique:true
    },
    email:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email id")
            }
        },
        unique:true
    },
    phone:{
        type:Number,
        required:true,
        minLength:10,
        maxLength:10
    },
    password:{
        type:String,
        required:true,
        minLength:8,
    },
    date:{
        type:Date,
        default:Date.now
    }
})

const blgschema=mongoose.Schema({
    usernameb:{
        type:String
    },
    email:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email id")
            }
        },
        unique:true
    },
    blgs:[{
        b:{type:String},
        cmnts:[{
            usernamec:{type:String},
            c:{type:String}
        }]
    }]
    
})


//Collection
const User = mongoose.model("User",userSchema);
const blg=mongoose.model("blg",blgschema);


//Export collection file
//module.exports = User;
export default User;
export {blg};