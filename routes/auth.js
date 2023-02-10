const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")


//Register
router.post("/register", async (req, res)=>{
    try{
        //generate new password
        const salt =await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        //Create new user
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword,
        })

        //Save user and return response in postman, check mongodb to see if user s saved
        const user = await newUser.save()
        res.status(200).json(user)
    }
    catch(err){
        console.log(err)
    }
})

//Login -- try to find existing user based on username and password
router.post("/login", async (req, res)=>{ //always check the res and req
    try{
    const user = await User.findOne({ email: req.body.email }) //finds the email
    if(!user){
        res.status(404).json("user not found")
    } 
    }
    catch(err){
        console.log(err)
    }   
})



module.exports = router