import { Box, Grid, makeStyles, Paper, Typography } from "@material-ui/core"
import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { postFeed } from "../../redux/actions/postActions"
import AddPost from "../AddPost"
import UserFeed from "../UserFeed"
import UserPosts from "../UserPosts"

const useStyles = makeStyles({
  headline: {
    marginTop: "2rem",
    marginBottom: "4rem",
  },
  divider: {
    marginBottom: "2rem",
  },
})

const PostFeed = () => {
  const posts = useSelector((state) => state.post.feed)
  const loading = useSelector((state) => state.post.loading)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(postFeed())
  }, [dispatch])

  const classes = useStyles()
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          <Paper>
            <Box m={2} pt={2}>
              <Typography variant="h3" className={classes.headline}>
                Post feeds
              </Typography>
              <AddPost />

              <UserPosts posts={posts} loading={loading} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper>
            <Box m={2} p={0} pt={4} pl={0}>
              <Typography variant="h5">Users Recommended</Typography>
              <UserFeed />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}

export default PostFeed
