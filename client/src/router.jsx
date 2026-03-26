import { createBrowserRouter } from "react-router-dom";
import Auth from "./pages/auth/Auth";
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";
import SuperAdminHome from "./pages/super-admin/SuperAdminHome";
import SuperAdminManageUser from "./pages/super-admin/manage-user/SuperAdminManageUser";
import ManageGpsDevice from "./pages/super-admin/manage-gps-device/ManageGpsDevices"
import StoreManagerTasks from "./pages/store-manager/storeManagerTask"
import StoreManagerHome from "./pages/store-manager/StoreManagerHome"
import ViewTrips from "./pages/store-manager/ViewTrips/ViewTrips."

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

            {
                path: "manage-devices",
                element: <ManageGpsDevice/>
            },
        ]
    },
     {
        path: '/stores',
        element: <AdminLayout/>,
        children: [
            {
                index: true,
                element: <StoreManagerHome/>
            },
            //more pages

            {
                path: "view-trips",
                element: <ViewTrips/>
            },
        ]
    }

    // {
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