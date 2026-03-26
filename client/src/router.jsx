import { createBrowserRouter } from "react-router-dom";
import Auth from "./pages/auth/Auth";
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";
import SuperAdminHome from "./pages/super-admin/SuperAdminHome";
import SuperAdminManageUser from "./pages/super-admin/manage-user/SuperAdminManageUser";

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
                path: "manage-user",
                element: <SuperAdminManageUser/>
            },
            //more pages
        ]
    },
    //  {
    //     path: '/brand',
    //     element: <AdminLayout/>,
    //     children: [
    //         {
    //             index: true,
    //             element: <BrandManagerHome/>
    //         },
    //         //more pages
    //     ]
    // }
])

export default router;