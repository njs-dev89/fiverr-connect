const express = require("express")
const authenticate = require("../middlewares/authMiddleware")
const {
  imageUpload,
  resizePostImage,
  createPost,
  getSinglePost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  replyToComment,
  postFeed,
  getSelfPosts,
  getUserPosts,
} = require("../controllers/postController")

const router = express.Router()

//@routeDescription Add a new post
//@route POST /api/posts/add

router.post("/add", authenticate, imageUpload, resizePostImage, createPost)

//@routeDescription Update a post
//@route PUT /api/posts/update/:postId

router.put(
  "/update/:postId",
  authenticate,
  imageUpload,
  resizePostImage,
  updatePost
)

//@routeDescription DELETE a post
//@route DELETE /api/posts/delete/:postId

router.delete("/delete/:postId", authenticate, deletePost)

//@routeDescription GET post feed
//@route GET /api/posts/feed

router.get("/feed", authenticate, postFeed)

//@routeDescription GET all self posts
//@route GET /api/posts/all

router.get("/all", authenticate, getSelfPosts)

//@routeDescription GET a single post
//@route PUT /api/posts/:postId

router.get("/:postId", getSinglePost)

//@routeDescription Like a post
//@route PUT /api/posts/like/:postId

router.put("/like/:postId", authenticate, likePost)

//@routeDescription Unlike a post
//@route PUT /api/posts/unlike/:postId

router.put("/unlike/:postId", authenticate, unlikePost)

//@routeDescription Comment a post
//@route POST /api/posts/comments/add/:postId

router.post("/comments/add/:postId", authenticate, addComment)

//@routeDescription reply to a comment
//@route POST /api/posts/comments/reply/:commentId

router.post("/comments/reply/:commentId", authenticate, replyToComment)

//@routeDescription GET a user's posts
//@route DELETE /api/posts/user/:userId

router.get("/user/:userId", authenticate, getUserPosts)

module.exports = router
