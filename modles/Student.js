const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/studentDetails');

const Schema = mongoose.Schema;

const studentSchema= new Schema({
    id:{type:Number, required:true, unique:true},
    name:{type:String , required:true},
    currentClass : {type:Number , required:true},
    division : {type:String , required:true},
    refid:{type: mongoose.Schema.Types.ObjectId, ref :'idData'}
})

const StudentData = mongoose.model("StudentData",studentSchema);

module.exports = StudentData;
