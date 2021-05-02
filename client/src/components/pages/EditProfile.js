import {
  Box,
  Button,
  Card,
  CardHeader,
  Container,
  FormControl,
  Input,
  InputLabel,
  makeStyles,
  Snackbar,
  TextField,
} from "@material-ui/core"
import React, { useEffect, useState } from "react"
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto"
import { useDispatch, useSelector } from "react-redux"
import { updateUser } from "../../redux/actions/userActions"
import IconButton from "@material-ui/core/IconButton"
import CloseIcon from "@material-ui/icons/Close"
import Slide from "@material-ui/core/Slide"

const useStyles = makeStyles({
  card: {
    padding: "2rem",
  },
  input: {
    display: "none",
  },
  label: {
    display: "flex",
    justifyContent: "center",
    marginTop: "1rem",
  },
  btn: {
    marginTop: "2rem",
  },
  img: {
    overflow: "hidden",
  },
})

const EditProfile = ({ history }) => {
  const [open, setOpen] = useState(false)
  const error = useSelector((state) => state.user.error)
  const dispatch = useDispatch()
  const loading = useSelector((state) => state.user.loading)
  const user = useSelector((state) => state.user.user)
  const [avatar, setAvatar] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [about, setAbout] = useState("")
  const classes = useStyles()
  useEffect(() => {
    setName(user.name)
    setEmail(user.email)
    setAbout(user.about)
  }, [user.name, user.email, user.about])

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    if (
      user.name === name &&
      user.email === email &&
      user.about === about &&
      avatar === ""
    ) {
      return history.push("/profile")
    }
    if (name && user.name !== name) {
      formData.append("name", name)
    }
    if (email && user.email !== email) {
      formData.append("email", email)
    }
    if (about && user.about !== about) {
      formData.append("about", about)
    }
    if (avatar) {
      formData.append("avatar", avatar)
    }
    dispatch(updateUser(formData, history, setOpen))
  }
  return loading ? (
    <h1>Loading...</h1>
  ) : (
    <Container maxWidth="sm">
      <Card className={classes.card}>
        <CardHeader
          title="Edit your profile"
          titleTypographyProps={{ align: "center" }}
        />

        <form
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          onSubmit={handleSubmit}
        >
          <Box width={150} height={150} m="auto" className={classes.img}>
            <img
              src={avatar ? URL.createObjectURL(avatar) : user.avatar}
              alt="profile-img"
              style={{
                objectFit: "cover",
                borderRadius: "50%",
                width: "100%",
                height: "100%",
              }}
            />
          </Box>
          <InputLabel htmlFor="image" className={classes.label}>
            <Button
              variant="contained"
              color="default"
              component="span"
              aria-label="upload picture"
              startIcon={<AddAPhotoIcon color="primary" />}
            >
              Upload
            </Button>
          </InputLabel>
          <Input
            accept="image/*"
            type="file"
            disableUnderline
            name="image"
            id="image"
            className={classes.input}
            onChange={(e) => setAvatar(e.target.files[0])}
          />

          <FormControl fullWidth>
            <InputLabel htmlFor="name">Name</InputLabel>
            <Input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel htmlFor="email">Email</InputLabel>
            <Input
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <TextField
            id="about"
            name="about"
            label="Write about yourself"
            fullWidth
            multiline={true}
            rows={5}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
          <Button
            size="large"
            variant="contained"
            color="primary"
            className={classes.btn}
            type="submit"
          >
            Edit
          </Button>
        </form>
      </Card>
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
    </Container>
  )
}

export default EditProfile
