export const CREDENTIALS = [
    { role: "Super Admin", badge: "super_admin", badgeClass: "super_admin", email: "super_admin@gmail.com", pass: "Rupesh@123" },
    { role: "DC Operator", badge: "dc_operator", badgeClass: "dc_operator", email: "mgkcode@gmail.com", pass: "Pass@12345" },
];

export const ROLES = {
    store_manager: {role: "store_manager", text: "Store Manager", color: "bg-amber-100 border-amber-200 text-amber-800"},
    super_admin: {role:"super_admin", text: "Super Admin", color: "bg-rose-100 border-rose-200 text-rose-700"},
    dc_manager: {role: "dc_manager", text: "DC Manager", color: "bg-orange-100 border-orange-200 text-orange-700"},
    driver: {role: "driver", text: "Driver", color: "bg-blue-100 border-blue-200 text-blue-700"}, 
}


export const STATUS = {
    active: {text: "Active", color: "bg-green-100  border-green-200 text-green-700"},
    inactive: {text: "In Active", color: "bg-red-100  border-red-200 text-red-700"}
}

export const LICENCE_CLASSES = [
    {
        type: "LMV",
        full: "LMV - light motor vehicles/cars"
    },
    {
        type: "HMV",
        full: "HMV - heavy motor vehicles"
    },
    {
        type: "HGMV",
        full: "HGMV - heavy goods motor vehicles"
    },
    {
        type: "HTV",
        full: "HTV - heavy transport vehicles"
    },
]

 export const TRIP_STATUS_COLORS = {
        in_transit: { label: "In Transit", className: "bg-blue-100 text-blue-700 border-blue-200" },
        completed: { label: "Completed", className: "bg-green-100 text-green-700 border-green-200" },
        scheduled: { label: "Scheduled", className: "bg-gray-100 text-gray-600 border-gray-200" },
        cancelled: { label: "Cancelled", className: "bg-red-100 text-red-600 border-red-200" },
    }