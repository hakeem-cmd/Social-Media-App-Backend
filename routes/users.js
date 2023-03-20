const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")

//update user
router.put("/:id", async(req, res)=>{
    if (req.body.userId === req.params.id || req.body.isAdmin){
        if (req.body.password){ //Update password
            try{
                const salt = await bcrypt.genSalt(10) //
                req.body.password = await bcrypt.hash(req.body.password, salt)
            }
            catch{
                return res.status.json(err)
            }
        }
            try {
                const user = await User.findByIdAndUpdate(req.params.id, {$set: req.body}) // set all inputs into the body
                res.status(200).json("Account has been updated") 
            } catch (err) {
                return res.status(500).json(err)
            }
    }
    else{
        return res.status(403).json("You can update only on your account")
    }
})

//delete user
router.delete("/:id", async(req, res) => {
    if (req.body.userId ===  req.params.id || req.body.isAdmin){ //req.body is the information received from the user and we compare it with params and IsUserAdmin which is either true or false
        try {
           await User.findByIdAndDelete(req.params.id)
           return res.status(200).json("Account has been deleted successfully")
        } catch (error) {
            return res.status(500).json(error)
        }
    }
    else{
        return res.status(403).json("You can only delete your account")
    }
})

//get a user

router.get("/:id", async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const {password, updatedAt, ...other} = user._doc
        res.status(200).json(other)
    } catch (error) {
        return res.status(500).json(error)
    }
})

//follow a user

router.put("/:id/follow", async(req, res) => {
    if (req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)

            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({ $push: {followers: req.body.userId}})
                await currentUser.updateOne({ $push: {following: req.params.id}})
                res.status(200).json("User has been followed")
            }
            else{
            res.status(403).json("You already follow this person")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
    else{
        res.status(403).json("You cant follow yourself")
    }
})

//unfollow a user
router.put("/:id/unfollow", async(req, res) => {
    if (req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)

            if(user.followers.includes(req.body.userId)){
                await user.updateOne({ $pull: {followers: req.body.userId}})
                await currentUser.updateOne({ $pull: {following: req.params.id}})
                res.status(200).json("User has been unfollow")
            }
            else{
            res.status(403).json("You do not follow this person")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
    else{
        res.status(403).json("You cant unfollow yourself")
    }
})


module.exports = router