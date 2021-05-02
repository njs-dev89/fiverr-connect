import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { loadUserPosts } from "../../redux/actions/postActions"
import { loadOtherUser } from "../../redux/actions/userActions"
import ProfileDetails from "../ProfileDetails"

const OtherUsersProfile = () => {
  const dispatch = useDispatch()
  const { id } = useParams()
  const postLoading = useSelector((state) => state.post.profilePosts.loading)
  const posts = useSelector((state) => state.post.profilePosts.posts)
  const userLoading = useSelector((state) => state.user.otherUser.loading)
  const user = useSelector((state) => state.user.otherUser.user)

  useEffect(() => {
    dispatch(loadOtherUser(id))
    dispatch(loadUserPosts(id))
  }, [dispatch, id])
  return userLoading ? (
    <h1>Loading...</h1>
  ) : (
    <ProfileDetails
      user={user}
      loading={postLoading}
      followers={user.followers}
      following={user.following}
      posts={posts}
    />
  )
}

export default OtherUsersProfile
