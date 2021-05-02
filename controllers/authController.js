const fs = require("fs")
const path = require("path")
const asyncHandler = require("express-async-handler")
const _ = require("lodash")
const multer = require("multer")
const jimp = require("jimp")
const User = require("../models/User")
const generateToken = require("../utils/generateToken")

exports.signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email) {
    throw new Error("You haven't Entered your email address")
  }
  const user = await User.findOne({ email })
  if (!user) {
    res.status(401)
    throw new Error(`User with email ${email} does not exist`)
  }

  const passwordMatched = await user.matchPassword(password)

  if (user && passwordMatched) {
    res.status(200).json({
      user: _.pick(user, [
        "_id",
        "name",
        "email",
        "avatar",
        "followers",
        "following",
        "createdAt",
        "updatedAt",
      ]),
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error("Invalid email or password")
  }
})

exports.signUp = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email) {
    throw new Error("Username/Email field is required")
  }

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error("User Already Exists")
  }

  const user = await User.create({ name, email, password })

  if (user) {
    res.status(201).json({
      user: _.pick(user, [
        "_id",
        "name",
        "email",
        "avatar",
        "followers",
        "following",
        "createdAt",
        "updatedAt",
      ]),
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error("Invalid user data")
  }
})

exports.getUser = (req, res) => {
  res.status(200).json(req.user)
}

exports.uploadAvatar = multer({
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
}).single("avatar")

exports.resizeAvatar = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next()
  }

  const extension = req.file.mimetype.split("/")[1]
  req.body.avatar = `/uploads/avatars/${
    req.user.name
  }-${Date.now()}.${extension}`
  const image = await jimp.read(req.file.buffer)
  await image.resize(250, jimp.AUTO)
  await image.write(`./static/${req.body.avatar}`)
  next()
})

exports.updateUser = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const user = await User.findById(userId)
  if (req.body.avatar && user.avatar !== "/static/images/profile-image.jpg") {
    fs.unlink(path.join(__dirname, "../static", user.avatar), (err) => {
      console.log(err)
    })
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: req.body },
    { new: true, runValidators: true }
  )
    .select("-password ")
    .populate("followers", "_id name avatar")
    .populate("following", "_id name avatar")
  res.status(200).json({ user: updatedUser })
})

exports.deleteUser = asyncHandler(async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.user._id)
  fs.unlink(path.join(__dirname, "..", deletedUser.avatar), (err) => {
    console.log(err)
  })
  res.status(200).json({ message: "User deleted successfully" })
})
