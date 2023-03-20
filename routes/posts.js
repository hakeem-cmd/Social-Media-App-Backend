const router = require("express").Router()
const { findById } = require("../models/Posts");
const Post = require("../models/Posts");

//Create a post

router.post("/", async(req, res) => {
    const newPost = new Post(req.body)

    try {
        const savedPost = await newPost.save()
        res.status(200).json("Post uploaded Successfully")
    } catch (error) {
        res.status(500).json(error)
    }
})

//Update a post
router.put("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.userId === req.body.userId) {
        await post.updateOne({ $set: req.body });
        res.status(200).json("the post has been updated");
      } else {
        res.status(403).json("you can update only your post");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

//delete a post
router.delete("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
          await post.deleteOne()
          res.status(200).json("the post has been successfully deleted");
        } else {
          res.status(403).json("you can update only delete your post");
        }
      } catch (err) {
        res.status(500).json(err)
      }
})

//like a post

router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({$push: {likes: req.body.userId}})
            res.status(200).json("Post has been liked")
        } else {
            await post.updateOne({$pull: {likes: req.body.userId}})
            res.status(200).json("Post has been disliked")
        }
    } catch (err) {
      res.status(500).json(err);
    }
  });

//get a post

router.get("/:id", async(req, res) =>{
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json(error)
    }
    
    
})
//get timeline posts

module.exports = router