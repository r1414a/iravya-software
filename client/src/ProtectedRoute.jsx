import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import LoadingSpinner from "./components/LoadingSpinner"
import { selectUser } from "./lib/features/auth/authSlice"

export default function ProtectedRoute({ allowedRoles }) {
  const { user, isAuthChecked } = useSelector(selectUser)

  if(!isAuthChecked){
    return <LoadingSpinner/>
  }


  if (!user) {
    return <Navigate to="/" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}