import {
  Box,
  Button,
  IconButton,
  makeStyles,
  Slide,
  Snackbar,
  TextField,
} from "@material-ui/core"
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto"
import CloseIcon from "@material-ui/icons/Close"
import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addPost } from "../redux/actions/postActions"

const useStyles = makeStyles({
  input: {
    display: "none",
  },
  btn: {
    marginRight: "0",
  },
})

const AddPost = () => {
  const [open, setOpen] = useState(false)
  const error = useSelector((state) => state.post.error)
  const dispatch = useDispatch()
  const [postImage, setPostImage] = useState("")
  const [fileName, setFileName] = useState("Choose File (*Max. File size 3mb)")
  const [text, setText] = useState("")
  const classes = useStyles()
  const resetForm = () => {
    setPostImage("")
    setFileName("Choose File (*Max. File size 3mb)")
    setText("")
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.set("text", text)
    formData.set("postImage", postImage)

    dispatch(addPost(formData, resetForm, setOpen))
  }
  return (
    <form
      noValidate
      autoComplete="off"
      style={{ marginBottom: "2rem" }}
      onSubmit={handleSubmit}
    >
      <TextField
        name="text"
        id="standard-basic"
        fullWidth
        label="What is on your mind?"
        margin="normal"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <input
        accept="image/*"
        type="file"
        name="postImage"
        id="image"
        className={classes.input}
        onChange={(e) => {
          setPostImage(e.target.files[0])
          setFileName(e.target.files[0].name)
        }}
      />
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <label htmlFor="image">
            <IconButton
              color="secondary"
              aria-label="upload picture"
              component="span"
            >
              <AddAPhotoIcon />
            </IconButton>
          </label>
          <span>{fileName}</span>
        </Box>

        <Button
          variant="contained"
          color="primary"
          className={classes.btn}
          type="submit"
        >
          Post
        </Button>
      </Box>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={open}
        message={error}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        TransitionComponent={Slide}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setOpen(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </form>
  )
}

export default AddPost
