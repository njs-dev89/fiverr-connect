import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import Grid from "@material-ui/core/Grid"
import UserPosts from "./UserPosts"
import { blueGrey } from "@material-ui/core/colors"
import FollowList from "./FollowList"
import { useSelector } from "react-redux"

const useStyles = makeStyles({
  root: {
    width: "80%",
    minWidth: "35rem",
    maxWidth: "60rem",
  },
  heading: {
    marginTop: "4rem",
    marginBottom: "1.5rem",
  },
  tab: {
    background: blueGrey[50],
    // marginTop: "3rem",
    marginBottom: "3rem",
  },
  divider: {
    marginTop: "1rem",
  },
})

const ProfileDetails = ({ user, loading, followers, following, posts }) => {
  const authUserId = useSelector((state) => state.user.user._id)
  const [value, setValue] = useState(0)
  const onChange = (e, value) => {
    setValue(value)
  }
  const classes = useStyles()
  return (
    <Card>
      <Typography variant="h3" align="center" className={classes.heading}>
        Profile
      </Typography>
      <Box ml={12} mr={12} mb={4} p={0} pb={3}>
        <Grid container justify="center" alignItems="center">
          <Grid item md={4} sm={12} xs={12}>
            <Box width={150} height={150}>
              <img
                src={user.avatar}
                alt="profile-img"
                style={{
                  objectFit: "cover",
                  borderRadius: "50%",
                  width: "100%",
                  height: "100%",
                }}
              />
            </Box>
          </Grid>

          <Grid item md={8} sm={12} xs={12}>
            <Box mb={2}>
              <Typography variant="h5" color="primary" gutterBottom>
                {user.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {user.email}
              </Typography>
              <Typography variant="body2" color="textPrimary">
                {user.about || "Add something about yourself"}
              </Typography>
            </Box>
            {user._id === authUserId ? (
              <Button
                color="primary"
                variant="contained"
                component={Link}
                to="/profile/edit"
              >
                Edit profile
              </Button>
            ) : (
              ""
            )}
          </Grid>
        </Grid>
        <Divider className={classes.divider} />
      </Box>

      <Container maxWidth="sm">
        <Paper square className={classes.tab}>
          <Tabs
            value={value}
            onChange={onChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Posts" />
            <Tab label="Followers" />
            <Tab label="Following" />
          </Tabs>
        </Paper>

        {value === 0 && <UserPosts posts={posts} loading={loading} />}
        {value === 1 && <FollowList users={followers} />}
        {value === 2 && <FollowList following={true} users={following} />}
      </Container>
    </Card>
  )
}

export default ProfileDetails
