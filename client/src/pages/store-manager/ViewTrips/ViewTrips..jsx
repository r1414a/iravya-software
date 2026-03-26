
import React from "react"

import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import TripTable from './TripTable'


export default function ViewTrips(){

    return (
        <>
            <section>
                <div className="h-18 px-10 flex gap-4 items-center shadow-md ">
                    <Link to={'/stores'} className="bg-gray-100 p-2 rounded-full">
                        <ArrowLeft size={18} />
                    </Link>
                    <div className="flex items-center justify-between w-full">
                        <div className="-space-y-1">
                            <h1 className="text-lg">View Trips</h1>
                            <p className="text-sm text-gray-500">Look for delivery trips and their schedules, Report problems</p>
                        </div>
                       
                    </div>
                </div>

                <TripTable/>


            </section>
        </>
    )
}