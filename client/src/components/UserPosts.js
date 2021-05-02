import { Box, Divider, makeStyles } from "@material-ui/core"
import React from "react"
import Post from "./Post"

const useStyles = makeStyles({
  divider: {
    marginBottom: "2rem",
  },
})

const UserPosts = ({ posts, loading }) => {
  const classes = useStyles()
  return loading ? (
    <h1>Loading...</h1>
  ) : (
    <Box>
      {posts.map((post, idx) => (
        <React.Fragment key={post._id}>
          <Post post={post} />
          {posts.length === idx + 1 ? null : (
            <Divider className={classes.divider} />
          )}
        </React.Fragment>
      ))}
    </Box>
  )
}

export default UserPosts
