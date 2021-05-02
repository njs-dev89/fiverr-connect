import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import { Button, Container } from "@material-ui/core"
import { Link, NavLink } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../redux/actions/userActions"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },

  title: {
    flexGrow: 1,
  },
  button: {
    "&.active": {
      color: "red",
    },
  },
}))

const Navbar = () => {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.user.token)
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <AppBar color="primary">
        <Container maxWidth="md">
          <Toolbar disableGutters={true}>
            <Typography variant="h4" className={classes.title}>
              <Link to="/" style={{ textDecoration: "none", color: "white" }}>
                Fiverr Connect
              </Link>
            </Typography>
            {!token ? (
              <>
                <Button
                  component={NavLink}
                  to="/login"
                  color="inherit"
                  className={classes.button}
                >
                  Login
                </Button>
                <Button
                  component={NavLink}
                  to="/signup"
                  color="inherit"
                  className={classes.button}
                >
                  Sign up
                </Button>
              </>
            ) : (
              <>
                {" "}
                <Button
                  component={NavLink}
                  to="/profile"
                  color="inherit"
                  className={classes.button}
                >
                  View Profile
                </Button>
                <Button
                  color="inherit"
                  className={classes.button}
                  onClick={() => dispatch(logout())}
                >
                  Logout
                </Button>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  )
}

export default Navbar
