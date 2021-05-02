const mongoose = require("mongoose")
const autopopulate = require("mongoose-autopopulate")
const { ObjectId } = mongoose.Schema

const { Schema } = mongoose

const postSchema = new Schema(
  {
    text: {
      type: String,
      requires: true,
    },
    image: {
      type: String,
    },
    likes: [{ type: ObjectId, ref: "User" }],
    unlikes: [{ type: ObjectId, ref: "User" }],
    comments: [{ type: ObjectId, ref: "Comment", autopopulate: true }],
    postedBy: {
      type: ObjectId,
      ref: "User",
      autopopulate: { select: "_id name avatar" },
    },
  },
  { timestamps: true }
)

postSchema.plugin(autopopulate)

// const autoPopulatePostedBy = function (next) {
//   this.populate("postedBy", "_id name avatar")
//   this.populate({
//     path: "comments",
//     model: "Comment",
//     populate: {
//       path: "replies",
//       model: "Comment",
//     },
//   })
//   next()
// }

// postSchema
//   .pre("findOne", autoPopulatePostedBy)
//   .pre("find", autoPopulatePostedBy)

module.exports = mongoose.model("Post", postSchema)
