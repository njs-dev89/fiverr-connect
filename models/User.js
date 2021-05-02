const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema
const bcrypt = require("bcryptjs")

const { Schema } = mongoose

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      minlength: 4,
      maxlength: 20,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
    about: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: "/images/profile-image.jpg",
    },
    following: [{ type: ObjectId, ref: "User" }],
    followers: [{ type: ObjectId, ref: "User" }],
  },
  { timestamps: true }
)

const autoPopulateFollowingAndFollowers = function (next) {
  this.populate("following", "_id name avatar")
  this.populate("followers", "_id name avatar")
  next()
}

userSchema.pre("findOne", autoPopulateFollowingAndFollowers)

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model("User", userSchema)
