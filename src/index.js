const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const { default: mongoose } = require('mongoose');
const port = 8080
mongoose.connect('mongodb://localhost/studentDetails');
app.use(express.urlencoded());
let dataisthere = false;
const studentArray = require("./InitialData")
const StudentData = require("../modles/Student");
const IdData = require("../modles/ids")

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(async (req, res, next) => {
    if (!dataisthere) {
        const data = await StudentData.find();
        if (data.length == 0) {
            console.log("enterd empty section")
            await StudentData.insertMany(studentArray);
            await IdData.create({
                id: 8,
            })
        }
        console.log("printing1");
        dataisthere = !dataisthere;
    }
    next();
})
// your code goes here

app.get("/api/student", async (req, res) => {
    const data = await StudentData.find();
    const data2 = await IdData.find();
    res.json(data);
})

app.get("/api/student/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = await StudentData.findOne({ id })
        if (data == null) {
            return res.status(404).json({
                "message": "No student exists with such id"
            })
        }
        res.json(data);
    } catch (e) {
        res.status(404).json({
            "status": "Failed",
            "message": e.message
        })
    }

})

app.post("/api/student", async (req, res) => {
    try {
        const id = await IdData.findById("63103efcd0e785102fe1e210");
        req.body.id = id.id;
        await StudentData.create(req.body);
        const nextId = id.id + 1;
        await IdData.findByIdAndUpdate("63103efcd0e785102fe1e210", { id: nextId })
        res.json({
            "status": "Success",
            "id": id.id
        })
    } catch (e) {
        res.status(400).json({
            "staus": "Failure",
            "message": e.message
        })
    }
})


app.put("/api/student/:id",async (req,res)=>{
    const id= req.params.id;
    const updateData= req.body
    try{
        let data=await StudentData.findOneAndUpdate({id},updateData,{runValidators:true, new:true})
        if(data==null)
        {
            return res.status(400).json({
                "status":"failed to update record",
                "message":"no student with the id"
            })
        }
        res.json(data)

    }catch(e){
        res.status(400).json({
            "status":"Failed to update",
            "message":e.message
        })
    }

})


app.delete("/api/student/:id",async (req,res)=>{
    const id = req.params.id;
    try{
        let data= await StudentData.findOneAndDelete({id});
        if(data==null)
        {
           return res.status(404).json({
                "message":"Enter a valid id"
            })
        }
        res.json({
            "status":"deleted"
        })

    }catch(e){
        res.status(400).json({
            "status":"Failed to Delete",
            "message":e.message
        })
    }
})

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;   