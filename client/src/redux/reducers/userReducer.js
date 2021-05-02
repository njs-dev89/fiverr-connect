import setAuthToken from "../../utils/setAuthToken"
import {
  DELETE_USER_FAILED,
  DELETE_USER_SUCCESS,
  FOLLOW_USER_FAILED,
  FOLLOW_USER_SUCCESS,
  LOAD_USER_FEED,
  LOAD_USER_FEED_SUCCESS,
  LOAD_USER_FEED_FAILED,
  LOGIN_USER,
  LOGIN_USER_FAILED,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER,
  SIGNUP_USER,
  SIGNUP_USER_FAILED,
  SIGNUP_USER_SUCCESS,
  UNFOLLOW_USER_FAILED,
  UNFOLLOW_USER_SUCCESS,
  LOAD_OTHER_USER,
  LOAD_OTHER_USER_SUCCESS,
  LOAD_OTHER_USER_FAILED,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILED,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAILED,
} from "../actionTypes/userActionTypes"

const initialState = {
  loading: true,
  user: {},
  token: localStorage.getItem("token"),
  otherUser: { loading: false, user: {}, error: "" },
  userFeed: { loading: false, users: [], error: "" },
}
const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOGIN_USER:
    case SIGNUP_USER:
      return { ...state, loading: true }
    case SIGNUP_USER_SUCCESS:
    case LOGIN_USER_SUCCESS:
      setAuthToken(payload.token)
      return {
        ...state,
        loading: false,
        user: payload.user,
        token: payload.token,
        error: null,
      }
    case LOAD_USER_SUCCESS:
      return { ...state, loading: false, user: payload }
    case LOAD_USER_FAILED:
      return { ...state, loading: false, error: payload }
    case SIGNUP_USER_FAILED:
    case LOGIN_USER_FAILED:
      return { ...state, loading: false, user: {}, error: payload }
    case LOGOUT_USER:
    case DELETE_USER_SUCCESS:
      return { ...state, loading: false, user: {}, token: null, error: null }
    case UPDATE_USER_SUCCESS:
      return { ...state, user: payload }
    case UPDATE_USER_FAILED:
    case DELETE_USER_FAILED:
      return { ...state, error: payload }
    case FOLLOW_USER_SUCCESS:
      return {
        ...state,
        user: payload.user,
        userFeed: {
          ...state.userFeed,
          users: state.userFeed.users.filter((user) => user._id !== payload.id),
        },
      }
    case UNFOLLOW_USER_SUCCESS:
      return { ...state, user: payload }
    case FOLLOW_USER_FAILED:
    case UNFOLLOW_USER_FAILED:
      return { ...state, error: payload }
    case LOAD_USER_FEED:
      return { ...state, userFeed: { loading: true, users: [], error: null } }
    case LOAD_USER_FEED_SUCCESS:
      return {
        ...state,
        userFeed: { loading: false, users: payload, error: null },
      }
    case LOAD_USER_FEED_FAILED:
      return {
        ...state,
        userFeed: { loading: false, users: [], error: payload },
      }
    case LOAD_OTHER_USER:
      return { ...state, otherUser: { loading: true, user: null } }
    case LOAD_OTHER_USER_SUCCESS:
      return {
        ...state,
        otherUser: { loading: false, user: payload, error: null },
      }
    case LOAD_OTHER_USER_FAILED:
      return {
        ...state,
        otherUser: { loading: false, user: null, error: payload },
      }
    default:
      return state
  }
}

export default userReducer
