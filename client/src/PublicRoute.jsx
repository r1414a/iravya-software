import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectUser } from "./lib/features/auth/authSlice"
import LoadingSpinner from "./components/LoadingSpinner"

export default function PublicRoute() {
  const { user, isAuthChecked } = useSelector(selectUser)

if(!isAuthChecked){
    return <LoadingSpinner/>
}

  if (user) {
    if (user.role === "super_admin") {
      return <Navigate to="/admin" replace />
    }

    if (user.role === "dc_manager") {
      return <Navigate to="/dc" replace />
    }
  }

  return <Outlet />
}