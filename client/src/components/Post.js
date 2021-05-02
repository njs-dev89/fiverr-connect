import { Avatar, Box, makeStyles, Paper, Typography } from "@material-ui/core"
import { grey, blue, red } from "@material-ui/core/colors"
import ThumbUpIcon from "@material-ui/icons/ThumbUp"
import ThumbDownIcon from "@material-ui/icons/ThumbDown"
import CommentIcon from "@material-ui/icons/Comment"
import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { deletePost, likePost, unlikePost } from "../redux/actions/postActions"
import PostComments from "./PostComments"
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline"
import moment from "moment"
import { Link } from "react-router-dom"

const useStyles = makeStyles({
  root: {
    display: "flex",
    background: grey[100],
    marginBottom: "2rem",
    padding: "0.5rem 1rem",
    alignItems: "center",
  },
  avatar: {
    marginRight: "1rem",
  },
  iconBox: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "2rem",
  },
  postImage: {
    width: "100%",
    objectFit: "contain",
    marginTop: "24px",
  },
  trashIcon: {
    marginLeft: "auto",
    color: grey[500],
    cursor: "pointer",
    "&:hover": {
      color: "red",
    },
  },
})

const Post = ({ post }) => {
  const [showComment, toggleShowComment] = useState(false)
  const userId = useSelector((state) => state.user.user._id)
  const dispatch = useDispatch()
  const classes = useStyles()
  return (
    <Box m={0} mb={0} p={0} pb={2}>
      <Paper square elevation={0} className={classes.root}>
        <Avatar className={classes.avatar} src={post.postedBy.avatar}></Avatar>
        <Link
          style={{ textDecoration: "none", color: blue[600] }}
          to={
            userId === post.postedBy._id
              ? "/profile"
              : `/users/profile/${post.postedBy._id}`
          }
        >
          <Typography variant="subtitle2">{post.postedBy.name}</Typography>
        </Link>

        {post.postedBy._id === userId && (
          <DeleteOutlineIcon
            className={classes.trashIcon}
            onClick={() => dispatch(deletePost(post._id))}
          />
        )}
      </Paper>
      <Typography variant="body1">{post.text}</Typography>
      <Typography variant="body2" color="textSecondary">
        {moment(post.createdAt).fromNow()}
      </Typography>
      {post.image && (
        <img src={post.image} className={classes.postImage} alt={post.text} />
      )}

      <Box className={classes.iconBox}>
        <Box component="span">
          <Box component="span" m={0} mr={2}>
            <ThumbUpIcon
              onClick={() => dispatch(likePost(post._id))}
              style={{
                color: post.likes.includes(userId) ? blue[500] : grey[400],
                cursor: "pointer",
                marginRight: "0.25rem",
              }}
            />
            {post.likes.length}
          </Box>
          <Box component="span">
            <ThumbDownIcon
              style={{
                color: post.unlikes.includes(userId) ? red[500] : grey[400],
                cursor: "pointer",
                marginRight: "0.25rem",
              }}
              onClick={() => dispatch(unlikePost(post._id))}
            />
            {post.unlikes.length}
          </Box>
        </Box>
        <Box component="span">
          <CommentIcon
            style={{
              cursor: "pointer",
              color: showComment ? blue[700] : grey[400],
            }}
            onClick={() => toggleShowComment(!showComment)}
          />
          {post.comments.length}
        </Box>
      </Box>
      {showComment && (
        <PostComments comments={post.comments} postId={post._id} />
      )}
    </Box>
  )
}

export default Post
