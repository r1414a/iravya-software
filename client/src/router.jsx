import { createBrowserRouter } from "react-router-dom";
import Auth from "./pages/auth/Auth";
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";
import SuperAdminHome from "./pages/super-admin/SuperAdminHome";
import SuperAdminManageUser from "./pages/super-admin/manage-users/SuperAdminManageUser";
import DCHome from "./pages/dc-operator/DCHome";
import DCManageTrips from "./pages/dc-operator/manage-trips/DCManageTrips";
import StoreManagerHome from "./pages/store-manager/StoreManagerHome"
import ViewTrips from "./pages/store-manager/ViewTrips/ViewTrips."
import DCManageDrivers from "./pages/dc-operator/manage-drivers/DCManageDrivers";
import DCManageTrucks from "./pages/dc-operator/manage-trucks/DCManageTrucks";
import DCManageStores  from "./pages/dc-operator/manage-stores/DCManageStores"
import DCManageDevices from "./pages/dc-operator/manage-gps-device/DCManageDevices";
import SuperAdminManageTrips from "./pages/super-admin/manage-trips/SuperAdminManageTrips";
import SuperAdminManageDrivers from "./pages/super-admin/manage-drivers/SuperAdminManageDrivers";
import SuperAdminManageTrucks from "./pages/super-admin/manage-trucks/SuperAdminManageTrucks";
import SuperAdminManageDCs from "./pages/super-admin/manage-dcs/SuperAdminManageDCS";
import TrackTrip from "./pages/track_trip/trackTrrip";

import SuperAdminManageStores from "./pages/super-admin/manage-stores/SuperAdminManageStores";
import SuperAdminSettings from "./pages/super-admin/settings/SuperAdminSettings";
import SuperAdminAlerts from "./pages/super-admin/alerts/SuperAdminAlerts";
import SuperAdminManageDevices from "./pages/super-admin/manage-devices/SuperAdminManageDevices";

import SuperAdminManageBrands from "./pages/super-admin/manage-brands/SuperAdminManageBrands"



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
                path: "manage-dcs",
                element: <SuperAdminManageDCs/>
            },
            {
                path: "manage-gps-devices",
                element: <SuperAdminManageDevices/>
            },
            {
                path: "manage-users",
                element: <SuperAdminManageUser/>
            },
            {
                path: "manage-trips",
                element: <SuperAdminManageTrips/>
            },
{
                path: "manage-drivers",
                element: <SuperAdminManageDrivers/>
            },
            {
                path: "manage-trucks",
                element: <SuperAdminManageTrucks/>
            },
            {
                path: "manage-stores",
                element: <SuperAdminManageStores/>
            },
            {
                path: "settings",
                element: <SuperAdminSettings/>
            },
            {
                path: "alerts",
                element: <SuperAdminAlerts/>
            }
            //more pages

            {
                path: "manage-brands",
                element: <SuperAdminManageBrands/>
            }

            
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
            },
            {
                path: 'manage-drivers',
                element: <DCManageDrivers/>
            },
            {
                path: "manage-trucks",
                element: <DCManageTrucks/>
            },
            {
                path: "manage-gps-devices",
                element: <DCManageDevices/>
            },
            //more pages
            {
                path: 'manage-stores',
                element: <DCManageStores/>
            }
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
            {
                path: 'view-trips',
                element: <ViewTrips/>
            }
            //more pages
        ]
    },
    {
        path: '/track',
        element: <AdminLayout/>,
        children: [
            {
                index: true,
                element: <TrackTrip/>
            },
            //more pages
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