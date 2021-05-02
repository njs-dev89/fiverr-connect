import React from "react"
import { useSelector } from "react-redux"
import { Redirect, Route } from "react-router"

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const loading = useSelector((state) => state.user.loading)
  const token = useSelector((state) => state.user.token)
  return loading ? (
    <h1>Loading...</h1>
  ) : (
    <Route
      {...rest}
      render={(props) =>
        !token && !loading ? <Redirect to="/login" /> : <Component {...props} />
      }
    />
  )
}

export default ProtectedRoute
