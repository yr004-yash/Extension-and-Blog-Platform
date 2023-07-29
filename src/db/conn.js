import mongoose from "mongoose";

//connection
mongoose.connect("mongodb://127.0.0.1/data",{
    //useCreateIndex:true, -------->deprecated
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log(err);
})