
import React from "react"

import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import AddGPSDeviceModel from "./AddGPSDeviceModel"
import GpsDeviceFilter from "./GpsDeviceFilter"
import DeviceTable from "./DeviceTable"


const ManageGpsDevice = () =>{

    return(
        <>
            <section>
            <div className="h-18 px-10 flex gap-4 items-center shadow-md ">
                <Link to={'/admin'} className="bg-gray-100 p-2 rounded-full">
                    <ArrowLeft size={18} />
                </Link>
                <div className="flex items-center justify-between w-full">
                    <div className="-space-y-1">
                        <h1 className="text-lg">Manage GPS Devices</h1>
                        <p className="text-sm text-gray-500">Manage GPS Devices across all brands — Register, assign and its history, healthcheck and retired check</p>
                    </div>
                    <AddGPSDeviceModel />
                </div>
            </div>

            <GpsDeviceFilter/>
            <DeviceTable/>


        </section>
        </>
    )
}

export default ManageGpsDevice