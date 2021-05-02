import React, { useEffect } from "react"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import SelfProfile from "./components/pages/SelfProfile"
import OtherUsersProfile from "./components/pages/OtherUsersProfile"
import SignIn from "./components/pages/SignIn"
import SignUp from "./components/pages/SignUp"
import { Box, Container, makeStyles } from "@material-ui/core"
import PostFeed from "./components/pages/PostFeed"
import EditProfile from "./components/pages/EditProfile"
import { useDispatch } from "react-redux"
import { loadUser } from "./redux/actions/userActions"
import ProtectedRoute from "./components/ProtectedRoute"
import setAuthToken from "./utils/setAuthToken"

if (localStorage.token) {
  setAuthToken(localStorage.token)
}

const useStyles = makeStyles({
  container: {
    width: "80%",
    minWidth: "35rem",
    maxWidth: "60rem",
  },
})

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(loadUser())
  }, [dispatch])
  const classes = useStyles()
  return (
    <BrowserRouter>
      <Navbar />
      <Box m={0} mt={16} mb={8}>
        <Container className={classes.container}>
          <Switch>
            <ProtectedRoute exact path="/" component={PostFeed} />
            <Route path="/login" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <ProtectedRoute exact path="/profile" component={SelfProfile} />
            <ProtectedRoute path="/profile/edit" component={EditProfile} />
            <ProtectedRoute
              path="/users/profile/:id"
              component={OtherUsersProfile}
            />
          </Switch>
        </Container>
      </Box>
    </BrowserRouter>
  )
}

export default App
