import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { clearUser, selectUser, setNotificationPreferences, setUser, updatePlatformSettings } from "./lib/features/auth/authSlice"
import { useGetMeQuery } from "./lib/features/auth/authApi"
// import { useNavigate } from "react-router-dom"
import LoadingSpinner from "./components/LoadingSpinner"

export default function AuthLoader({ children }) {

    const dispatch = useDispatch()
    // const navigate = useNavigate()
    const { user } = useSelector(selectUser)


    const { data, isLoading } = useGetMeQuery(undefined, {
        skip: !!user,
        refetchOnMountOrArgChange: false,
        refetchOnFocus: false,
        refetchOnReconnect: false
    })

    useEffect(() => {
        if (data?.data) {

            dispatch(setUser(data.data))
            // dispatch(setNotificationPreferences(data.data.notifications))
            // dispatch(updatePlatformSettings(data.data.platformSettings))

            // if (data.data.role === "super_admin") {
            //     navigate("/admin", { replace: true })
            // }

            // if (data.data.role === "dc_manager") {
            //     navigate("/dc", { replace: true })
            // }

        }else if (!isLoading) {
    dispatch(clearUser()) 
  }
    }, [data, dispatch, isLoading])

    if (isLoading && !user) {
        return <LoadingSpinner/>
    }

    return children
}