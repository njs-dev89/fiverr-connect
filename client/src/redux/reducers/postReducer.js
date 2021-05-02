import {
  ADD_COMMENT_SUCCESS,
  ADD_POST_FAILED,
  ADD_POST_SUCCESS,
  DELETE_POST_SUCCESS,
  LIKE_POST_FAILED,
  LIKE_POST_SUCCESS,
  LOAD_POST_FEED_FAILED,
  LOAD_POST_FEED_SUCCESS,
  LOAD_PROFILE_POSTS,
  LOAD_PROFILE_POSTS_FAILED,
  LOAD_PROFILE_POSTS_SUCCESS,
  UNLIKE_POST_FAILED,
  UNLIKE_POST_SUCCESS,
} from "../actionTypes/postActionTypes"

const initialState = {
  loading: true,
  feed: [],
  error: null,
  profilePosts: { loading: false, posts: [], error: null },
}

const postReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_POST_FEED_SUCCESS:
      return { ...state, loading: false, feed: payload, error: null }
    case LOAD_POST_FEED_FAILED:
      return { ...state, loading: false, feed: [], error: payload }
    case LOAD_PROFILE_POSTS:
      return {
        ...state,
        profilePosts: { loading: true, posts: [], error: null },
      }
    case LOAD_PROFILE_POSTS_SUCCESS:
      return {
        ...state,
        profilePosts: { loading: false, posts: payload, error: null },
      }
    case LOAD_PROFILE_POSTS_FAILED:
      return {
        ...state,
        profilePosts: { loading: false, posts: [], error: payload },
      }
    case ADD_POST_SUCCESS:
      return { ...state, feed: [payload, ...state.feed] }
    case ADD_POST_FAILED:
    case LIKE_POST_FAILED:
    case UNLIKE_POST_FAILED:
      return { ...state, error: payload }
    case LIKE_POST_SUCCESS:
    case UNLIKE_POST_SUCCESS:
      return {
        ...state,
        feed: state.feed.map((post) => {
          if (post._id === payload._id) {
            post.likes = payload.likes
            post.unlikes = payload.unlikes
          }
          return post
        }),
      }
    case ADD_COMMENT_SUCCESS:
      return {
        ...state,
        feed: state.feed.map((post) => {
          if (post._id === payload._id) {
            return payload
          }
          return post
        }),
        profilePosts: {
          ...state.profilePosts,
          posts: state.profilePosts.posts.map((post) => {
            if (post._id === payload._id) {
              return payload
            }
            return post
          }),
        },
      }
    case DELETE_POST_SUCCESS:
      return {
        ...state,
        feed: state.feed.filter((post) => post._id !== payload),
        profilePosts: {
          ...state.profilePosts,
          posts: state.profilePosts.posts.filter(
            (post) => post._id !== payload
          ),
        },
      }
    default:
      return state
  }
}

export default postReducer
