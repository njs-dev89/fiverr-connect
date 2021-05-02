const mongoose = require("mongoose")
const autopopulate = require("mongoose-autopopulate")
const { ObjectId } = mongoose.Schema

const { Schema } = mongoose

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    replies: [
      {
        type: ObjectId,
        ref: "Comment",
        autopopulate: true,
      },
    ],
    postedBy: {
      type: ObjectId,
      ref: "User",
      autopopulate: { select: "_id name avatar" },
    },
    post: {
      type: ObjectId,
      ref: "Post",
    },
  },
  { timestamps: true }
)

commentSchema.plugin(autopopulate)

module.exports = mongoose.model("Comment", commentSchema)
