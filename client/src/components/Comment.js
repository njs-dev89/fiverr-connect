import {
  Avatar,
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core"
import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { replyToComment } from "../redux/actions/postActions"
import moment from "moment"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
  comment: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}))

const Comment = ({ comment, level }) => {
  const dispatch = useDispatch()
  const authId = useSelector((state) => state.user.user._id)
  const userAvatar = useSelector((state) => state.user.user.avatar)
  const [showButtons, toggleButtons] = useState(false)
  const [reply, setReply] = useState("")
  const classes = useStyles()
  const [showReply, toggleReply] = useState(false)
  const [showReplyForm, toggleReplyForm] = useState(false)
  const hasChildren = comment.replies && !!comment.replies.length

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(replyToComment(comment._id, reply, setReply))
  }
  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src={comment.postedBy.avatar} />
        </ListItemAvatar>
        <ListItemText
          primary={comment.postedBy.name}
          secondary={
            <span className={classes.comment}>
              <span>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  color="textPrimary"
                >
                  {comment.comment}
                </Typography>
                <br />
                <Typography
                  component="span"
                  variant="body2"
                  style={{ fontSize: "12px" }}
                >
                  {moment(comment.createdAt).fromNow()}
                </Typography>
              </span>
              <span className={classes.comment}>
                {hasChildren && (
                  <Button onClick={() => toggleReply(!showReply)} size="small">
                    {showReply ? "Hide replies" : "View replies"}
                  </Button>
                )}
                <Button
                  size="small"
                  disabled={authId === comment.postedBy._id}
                  onClick={() => toggleReplyForm(!showReplyForm)}
                >
                  Reply
                </Button>
              </span>
            </span>
          }
        />
      </ListItem>
      {showReplyForm && (
        <form
          style={{ margin: "16px auto", padding: "16px" }}
          onSubmit={handleSubmit}
        >
          <div>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={2} md={1}>
                <Avatar src={userAvatar} />
              </Grid>
              <Grid item xs={10} md={11}>
                <TextField
                  id="input-with-icon-grid"
                  label="Reply to this comment"
                  fullWidth
                  value={reply}
                  onFocus={() => toggleButtons(true)}
                  onChange={(e) => setReply(e.target.value)}
                />
              </Grid>
            </Grid>
          </div>
          {showButtons && (
            <Box
              style={{
                display: "flex",
                justifyContent: "flex-end",
                margin: "16px auto",
              }}
            >
              <Button onClick={() => toggleButtons(false)}>Cancel</Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginRight: "0" }}
              >
                Submit
              </Button>
            </Box>
          )}
        </form>
      )}
      {hasChildren && showReply
        ? comment.replies.map((reply) => (
            <List
              key={reply._id}
              style={{
                marginLeft: level * 16,
                background: "rgba(0,0,0,0.05)",
              }}
            >
              <Comment comment={reply} level={level + 1} />
            </List>
          ))
        : ""}
    </>
  )
}

export default Comment
