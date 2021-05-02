import { applyMiddleware, combineReducers, createStore } from "redux"
import postReducer from "./reducers/postReducer"
import userReducer from "./reducers/userReducer"
import thunk from "redux-thunk"
import { composeWithDevTools } from "redux-devtools-extension"

const rootReducer = combineReducers({
  user: userReducer,
  post: postReducer,
})

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
)

export default store
