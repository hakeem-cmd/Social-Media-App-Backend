const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const helmet = require("helmet")
const morgan = require("morgan")
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")

//dotenv configuration
dotenv.config()



//mongoose connection after creating cluster in mongoose atlas
mongoose.connect(process.env.MONGO_URL, ()=>{
    console.log("Database Connected")
});

//middleware
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))


app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)


//get request 
app.get("/", (req, res)=>{
    res.send("Welcome to the homepage")
})


// shows the port running using the .listen command
app.listen(5000, function(res, req){ // ()=>{}
    console.log("Backend server os running on port 5000")
})