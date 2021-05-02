import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import ProfileDetails from "../ProfileDetails"
import { loadSelfPosts } from "../../redux/actions/postActions"

const SelfProfile = () => {
  const loading = useSelector((state) => state.post.profilePosts.loading)
  const posts = useSelector((state) => state.post.profilePosts.posts)

  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.user)
  const userLoading = useSelector((state) => state.user.loading)
  useEffect(() => {
    dispatch(loadSelfPosts())
  }, [dispatch])

  return userLoading ? (
    <h1>Loading...</h1>
  ) : (
    <ProfileDetails
      user={user}
      loading={loading}
      followers={user.followers}
      following={user.following}
      posts={posts}
    />
  )
}

export default SelfProfile
