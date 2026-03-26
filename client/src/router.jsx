import { createBrowserRouter } from "react-router-dom";
import Auth from "./pages/auth/Auth";
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";
import SuperAdminHome from "./pages/super-admin/SuperAdminHome";
import SuperAdminManageUser from "./pages/super-admin/manage-user/SuperAdminManageUser";
import DCHome from "./pages/dc-operator/DCHome";
import DCManageTrips from "./pages/dc-operator/manage-trips/DCManageTrips";


const router = createBrowserRouter([
    //Auth Routes
    {
        path: "/",
        element: <AuthLayout/>,
        children: [
            {
                index: true,
                element: <Auth/>
            }
        ]
    },

    //Admin Routes
    {
        path: '/admin',
        element: <AdminLayout/>,
        children: [
            {
                index: true,
                element: <SuperAdminHome/>
            },
            {
                path: "manage-users",
                element: <SuperAdminManageUser/>
            },
            //more pages
        ]
    },
     {
        path: '/dc',
        element: <AdminLayout/>,
        children: [
            {
                index: true,
                element: <DCHome/>
            },
            {
                path: 'manage-trips',
                element: <DCManageTrips/>
            }
            //more pages
        ]
    }
])

export default router;