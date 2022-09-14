const mongoose = require("mongoose")

mongoose.connect('mongodb://localhost/studentDetails');

const Schema = mongoose.Schema;

const idSchema= new Schema({
   id:Number
})

const IdData= mongoose.model("IdData",idSchema);

module.exports=IdData;