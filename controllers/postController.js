const fs = require("fs")
const path = require("path")
const asyncHandler = require("express-async-handler")
const multer = require("multer")
const jimp = require("jimp")
const Comment = require("../models/Comment")
const Post = require("../models/Post")

exports.imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 3,
  },
  fileFilter: (req, file, next) => {
    if (file.mimetype.startsWith("image/")) {
      next(null, true)
    } else {
      next(null, false)
    }
  },
}).single("postImage")

exports.resizePostImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next()
  }

  const extension = req.file.mimetype.split("/")[1]
  req.body.image = `/uploads/postImages/${
    req.user.name
  }-${Date.now()}.${extension}`
  const image = await jimp.read(req.file.buffer)
  await image.resize(750, jimp.AUTO)
  await image.write(`./static${req.body.image}`)
  next()
})
exports.createPost = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    throw new Error("You need to add some text to the post")
  }
  const post = new Post(req.body)
  console.log(post)
  post.postedBy = req.user._id
  const savedPost = await post.save()
  res.status(201).json({ post: savedPost })
})

exports.updatePost = asyncHandler(async (req, res) => {
  const postId = req.params.postId
  let oldImgSrc
  const post = await Post.findById(postId)
  if (post.postedBy._id.toString() !== req.user._id.toString()) {
    res.status(400)
    throw new Error("You can not delete other person's post")
  }
  if (req.body.image) {
    oldImgSrc = post.image
  }
  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { $set: req.body },
    { new: true }
  )
  if (oldImgSrc) {
    fs.unlink(path.join(__dirname, "..", oldImgSrc), (err) => console.log(err))
  }

  res.status(200).json({ post: updatedPost })
})

exports.deletePost = asyncHandler(async (req, res) => {
  const postId = req.params.postId
  const post = await Post.findById(postId)
  if (!post) {
    res.status(404)
    throw new Error(`No post with the id ${postId} found`)
  }
  if (post.postedBy._id.toString() !== req.user._id.toString()) {
    res.status(400)
    throw new Error("You can only delete your own post")
  }
  await Comment.deleteMany({ post: postId })
  await post.remove()
  fs.unlink(path.join(__dirname, "../static", post.image), (err) =>
    console.log(err)
  )

  res.status(200).json({})
})

exports.getSinglePost = asyncHandler(async (req, res) => {
  const postId = req.params.postId
  const post = await Post.findById(postId)
  if (!post) {
    res.status(404)
    throw new Error("Post does not exists")
  }

  res.status(200).json({ post })
})

exports.likePost = asyncHandler(async (req, res) => {
  const postId = req.params.postId
  const userId = req.user._id.toString()
  const post = await Post.findById(postId)

  if (!post) {
    res.status(404)
    throw new Error(`Sorry post with the id ${postId} does not exists`)
  }
  if (post.postedBy._id.toString() === userId) {
    res.status(400)
    throw new Error("You cannot like your own post")
  }

  const unlikeIds = post.unlikes.map((unlikeId) => unlikeId.toString())
  if (unlikeIds.includes(userId)) {
    await post.unlikes.pull(userId)
  }

  const likeIds = post.likes.map((likeId) => likeId.toString())
  if (likeIds.includes(userId)) {
    await post.likes.pull(userId)
  } else {
    await post.likes.push(userId)
  }

  await post.save()
  res.status(200).json({ post })
})

exports.unlikePost = asyncHandler(async (req, res) => {
  const postId = req.params.postId
  const userId = req.user._id.toString()
  const post = await Post.findById(postId)

  if (!post) {
    res.status(404)
    throw new Error(`Sorry post with the id ${postId} does not exists`)
  }
  if (post.postedBy._id.toString() === userId) {
    res.status(400)
    throw new Error("You cannot unlike your own post")
  }

  const likeIds = post.likes.map((likeId) => likeId.toString())
  if (likeIds.includes(userId)) {
    await post.likes.pull(userId)
  }

  const unlikeIds = post.unlikes.map((unlikeId) => unlikeId.toString())
  if (unlikeIds.includes(userId)) {
    await post.unlikes.pull(userId)
  } else {
    await post.unlikes.push(userId)
  }

  await post.save()
  res.status(200).json({ post })
})

exports.addComment = asyncHandler(async (req, res) => {
  const postId = req.params.postId
  const comment = await Comment.create({
    comment: req.body.comment,
    postedBy: req.user._id,
    post: postId,
  })
  const post = await Post.findByIdAndUpdate(
    postId,
    { $push: { comments: comment._id } },
    { new: true }
  ).populate("comments", "_id comment postedBy")

  res.status(201).json({ post })
})

exports.replyToComment = asyncHandler(async (req, res) => {
  const commentId = req.params.commentId
  const comment = await Comment.findById(commentId)

  if (comment.postedBy._id.toString() === req.user._id.toString()) {
    res.status(400)
    throw new Error("You cannot reply to your own comment")
  }

  const reply = await Comment.create({
    comment: req.body.comment,
    postedBy: req.user._id,
    post: comment.post,
  })
  await comment.replies.push(reply._id)
  await comment.save()
  const post = await Post.findById(comment.post)
  res.status(201).json({ post })
})

exports.postFeed = asyncHandler(async (req, res) => {
  const { following, _id } = req.user
  following.push(_id)

  const posts = await Post.find({ postedBy: { $in: following } }).sort({
    createdAt: -1,
  })

  if (posts.length === 0) {
    res.status(404)
    throw new Error("No post to show")
  }

  res.status(200).json({ posts })
})

exports.getSelfPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({
    postedBy: { _id: req.user._id },
  }).sort({
    createdAt: -1,
  })
  if (posts.length === 0) {
    res.status(404)
    throw new Error("You haven't added any post yet")
  }
  res.status(200).json({ posts })
})

exports.getUserPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({
    postedBy: { _id: req.params.userId },
  }).sort({
    createdAt: -1,
  })
  if (posts.length === 0) {
    res.status(404)
    throw new Error("User haven't added any post yet")
  }
  res.status(200).json({ posts })
})
