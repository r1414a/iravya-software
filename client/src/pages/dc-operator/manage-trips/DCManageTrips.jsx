import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import CreateNewTrip from "./CreateNewTrip"

export default function DCManageTrips(){
    return(
        <section>
            <div className="h-18 px-10 flex gap-4 items-center shadow-md ">
                <Link to={'/admin'} className="bg-gold hover:bg-gold-dark p-2 rounded-full">
                    <ArrowLeft size={18} className="text-maroon"/>
                </Link>
                <div className="flex items-center justify-between w-full">
                    <div className="-space-y-1">
                        <h1 className="text-lg">Manage Trips</h1>
                        <p className="text-sm text-gray-500">Plan, track, and dispatch deliveries across all stores — select trucks, and schedule departures.</p>
                    </div>
                    <CreateNewTrip />
                </div>
            </div>

        </section>
    )
}