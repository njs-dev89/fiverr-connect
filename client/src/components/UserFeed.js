import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { userFeed } from "../redux/actions/userActions"
import FollowList from "./FollowList"

const UserFeed = () => {
  const dispatch = useDispatch()
  const loading = useSelector((state) => state.user.userFeed.loading)
  const users = useSelector((state) => state.user.userFeed.users)
  useEffect(() => {
    dispatch(userFeed())
  }, [dispatch])
  return loading ? <h1>Loading...</h1> : <FollowList users={users} />
}

export default UserFeed
