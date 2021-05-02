import axios from "axios"
import setAuthToken from "../../utils/setAuthToken"
import {
  DELETE_USER_FAILED,
  DELETE_USER_SUCCESS,
  FOLLOW_USER_FAILED,
  FOLLOW_USER_SUCCESS,
  LOAD_OTHER_USER,
  LOAD_OTHER_USER_FAILED,
  LOAD_OTHER_USER_SUCCESS,
  LOAD_USER_FAILED,
  LOAD_USER_FEED,
  LOAD_USER_FEED_FAILED,
  LOAD_USER_FEED_SUCCESS,
  LOAD_USER_SUCCESS,
  LOGIN_USER,
  LOGIN_USER_FAILED,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER,
  SIGNUP_USER,
  SIGNUP_USER_FAILED,
  SIGNUP_USER_SUCCESS,
  UNFOLLOW_USER_FAILED,
  UNFOLLOW_USER_SUCCESS,
  UPDATE_USER_FAILED,
  UPDATE_USER_SUCCESS,
} from "../actionTypes/userActionTypes"

export const loadUser = () => async (dispatch) => {
  const token = localStorage.getItem("token")
  if (token) {
    setAuthToken(token)
  }
  try {
    const res = await axios.get("/api/profile")
    dispatch({ type: LOAD_USER_SUCCESS, payload: res.data })
  } catch (err) {
    dispatch({ type: LOAD_USER_FAILED, payload: err.response.data.message })
  }
}

export const signup = ({ name, email, password, remember }, setOpen) => async (
  dispatch
) => {
  dispatch({ type: SIGNUP_USER })
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  }

  try {
    const res = await axios.post(
      "/api/signup",
      { name, email, password },
      config
    )
    dispatch({
      type: SIGNUP_USER_SUCCESS,
      payload: res.data,
    })
    if (remember) {
      localStorage.setItem("token", res.data.token)
    }
  } catch (err) {
    dispatch({ type: SIGNUP_USER_FAILED, payload: err.response.data.message })
    setOpen(true)
  }
}

export const login = ({ email, password, remember }, setOpen) => async (
  dispatch
) => {
  dispatch({ type: LOGIN_USER })
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  }

  try {
    const res = await axios.post("/api/signin", { email, password }, config)
    dispatch({
      type: LOGIN_USER_SUCCESS,
      payload: res.data,
    })
    if (remember) {
      localStorage.setItem("token", res.data.token)
    }
  } catch (err) {
    dispatch({ type: LOGIN_USER_FAILED, payload: err.response.data.message })
    setOpen(true)
  }
}

export const logout = () => (dispatch) => {
  localStorage.removeItem("token")
  dispatch({ type: LOGOUT_USER })
}

export const updateUser = (data, history, setOpen) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }

  try {
    const res = await axios.put("/api/profile/update", data, config)
    dispatch({ type: UPDATE_USER_SUCCESS, payload: res.data.user })
    history.push("/profile")
  } catch (err) {
    dispatch({ type: UPDATE_USER_FAILED, payload: err.response.data.message })
    setOpen(true)
  }
}

export const deleteUser = () => async (dispatch) => {
  try {
    await axios.delete("/api/profile/delete")
    dispatch({ type: DELETE_USER_SUCCESS })
  } catch (err) {
    dispatch({ type: DELETE_USER_FAILED, payload: err.message })
  }
}

export const followUser = (userId) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/users/follow/${userId}`)
    dispatch({
      type: FOLLOW_USER_SUCCESS,
      payload: { user: res.data.user, id: userId },
    })
  } catch (err) {
    dispatch({ type: FOLLOW_USER_FAILED, payload: err.message })
  }
}

export const unfollowUser = (userId) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/users/unfollow/${userId}`)
    dispatch({
      type: UNFOLLOW_USER_SUCCESS,
      payload: res.data.user,
    })
  } catch (err) {
    dispatch({ type: UNFOLLOW_USER_FAILED, payload: err.message })
  }
}

export const userFeed = () => async (dispatch) => {
  dispatch({ type: LOAD_USER_FEED })
  try {
    const res = await axios.get("/api/users/feed")
    dispatch({ type: LOAD_USER_FEED_SUCCESS, payload: res.data.users })
  } catch (err) {
    dispatch({ type: LOAD_USER_FEED_FAILED, payload: err.message })
  }
}

export const loadOtherUser = (userId) => async (dispatch) => {
  dispatch({ type: LOAD_OTHER_USER })
  try {
    const res = await axios.get(`/api/users/profile/${userId}`)
    dispatch({ type: LOAD_OTHER_USER_SUCCESS, payload: res.data.userLoaded })
  } catch (err) {
    dispatch({ type: LOAD_OTHER_USER_FAILED, payload: err.response.data })
  }
}
