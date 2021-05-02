import {
  ADD_POST_FAILED,
  ADD_POST_SUCCESS,
  LOAD_POST_FEED_FAILED,
  LOAD_POST_FEED_SUCCESS,
  LIKE_POST_SUCCESS,
  LIKE_POST_FAILED,
  UNLIKE_POST_SUCCESS,
  UNLIKE_POST_FAILED,
  LOAD_PROFILE_POSTS_SUCCESS,
  LOAD_PROFILE_POSTS,
  LOAD_PROFILE_POSTS_FAILED,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_FAILED,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAILED,
} from "../actionTypes/postActionTypes"

const axios = require("axios")

export const addPost = (data, resetForm, setOpen) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }

  try {
    const res = await axios.post("/api/posts/add", data, config)
    dispatch({ type: ADD_POST_SUCCESS, payload: res.data.post })
    resetForm()
  } catch (err) {
    dispatch({ type: ADD_POST_FAILED, payload: err.response.data.message })
    setOpen(true)
  }
}

export const postFeed = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/posts/feed")
    dispatch({ type: LOAD_POST_FEED_SUCCESS, payload: res.data.posts })
  } catch (err) {
    dispatch({ type: LOAD_POST_FEED_FAILED, payload: err.response.data })
  }
}

export const likePost = (postId) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/posts/like/${postId}`)
    dispatch({ type: LIKE_POST_SUCCESS, payload: res.data.post })
  } catch (err) {
    dispatch({ type: LIKE_POST_FAILED, payload: err.response.data })
  }
}

export const unlikePost = (postId) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/posts/unlike/${postId}`)
    dispatch({ type: UNLIKE_POST_SUCCESS, payload: res.data.post })
  } catch (err) {
    dispatch({ type: UNLIKE_POST_FAILED, payload: err.response.data })
  }
}

export const loadSelfPosts = () => async (dispatch) => {
  dispatch({ type: LOAD_PROFILE_POSTS })
  try {
    const res = await axios.get("/api/posts/all")
    dispatch({ type: LOAD_PROFILE_POSTS_SUCCESS, payload: res.data.posts })
  } catch (err) {
    dispatch({ type: LOAD_PROFILE_POSTS_FAILED, payload: err.response.data })
  }
}

export const loadUserPosts = (userId) => async (dispatch) => {
  dispatch({ type: LOAD_PROFILE_POSTS })
  try {
    const res = await axios.get(`/api/posts/user/${userId}`)
    dispatch({ type: LOAD_PROFILE_POSTS_SUCCESS, payload: res.data.posts })
  } catch (err) {
    dispatch({ type: LOAD_PROFILE_POSTS_FAILED, payload: err.response.data })
  }
}

export const addComment = (postId, comment, setComment) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  }

  try {
    const res = await axios.post(
      `/api/posts/comments/add/${postId}`,
      { comment },
      config
    )
    dispatch({ type: ADD_COMMENT_SUCCESS, payload: res.data.post })
    setComment("")
  } catch (err) {
    dispatch({ type: ADD_COMMENT_FAILED, payload: err.response.data })
  }
}

export const replyToComment = (commentId, comment, setComment) => async (
  dispatch
) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  }

  try {
    const res = await axios.post(
      `/api/posts/comments/reply/${commentId}`,
      { comment },
      config
    )
    dispatch({ type: ADD_COMMENT_SUCCESS, payload: res.data.post })
    setComment("")
  } catch (err) {
    console.log(err.response.data)
    dispatch({ type: ADD_COMMENT_FAILED, payload: err.response.data })
  }
}

export const deletePost = (postId) => async (dispatch) => {
  try {
    await axios.delete(`/api/posts/delete/${postId}`)
    dispatch({ type: DELETE_POST_SUCCESS, payload: postId })
  } catch (err) {
    dispatch({ type: DELETE_POST_FAILED, payload: err.response.data })
  }
}
