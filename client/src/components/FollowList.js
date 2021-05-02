import {
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@material-ui/core"
import { blue } from "@material-ui/core/colors"
import React, { Fragment } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { followUser, unfollowUser } from "../redux/actions/userActions"

const FollowList = ({ users }) => {
  const selfFollowing = useSelector((state) => state.user.user.following)
  const authUserId = useSelector((state) => state.user.user._id)
  const dispatch = useDispatch()
  return (
    <List>
      {users.map((user, idx) => (
        <Fragment key={user._id}>
          <ListItem alignItems="center">
            <ListItemAvatar>
              <Avatar src={user.avatar} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="subtitle2">
                  <Link
                    to={
                      user._id !== authUserId
                        ? `/users/profile/${user._id}`
                        : "/profile"
                    }
                    style={{ textDecoration: "none", color: blue[600] }}
                  >
                    {user.name}
                  </Link>
                </Typography>
              }
            />
            {authUserId !== user._id &&
              (selfFollowing.some(
                (userFollowing) => userFollowing._id === user._id
              ) ? (
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={() => dispatch(unfollowUser(user._id))}
                >
                  Unfollow
                </Button>
              ) : (
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => dispatch(followUser(user._id))}
                >
                  Follow
                </Button>
              ))}
          </ListItem>
          {users.length === idx + 1 ? (
            ""
          ) : (
            <Divider variant="inset" component="li" />
          )}
        </Fragment>
      ))}
    </List>
  )
}

export default FollowList
