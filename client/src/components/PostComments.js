import { Avatar, Box, Button, Grid, List, TextField } from "@material-ui/core"
import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addComment } from "../redux/actions/postActions"
import Comment from "./Comment"

const PostComments = ({ comments, postId }) => {
  const userAvatar = useSelector((state) => state.user.user.avatar)
  const dispatch = useDispatch()
  const [showButtons, toggleButtons] = useState(false)
  const [comment, setComment] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(addComment(postId, comment, setComment))
  }
  return (
    <Box>
      <form style={{ margin: "16px auto" }} onSubmit={handleSubmit}>
        <div>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={2} sm={1}>
              <Avatar src={userAvatar} />
            </Grid>
            <Grid item xs={10} sm={11}>
              <TextField
                id="input-with-icon-grid"
                label="Add a comment"
                fullWidth
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onFocus={() => toggleButtons(true)}
                // onBlur={() => toggleButtons(false)}
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
      <List style={{ background: "rgba(0,0,0,0.02)", marginTop: "16 px" }}>
        {comments.map((comment) => (
          <Comment comment={comment} key={comment._id} level={1} />
        ))}
      </List>
    </Box>
  )
}

export default PostComments
