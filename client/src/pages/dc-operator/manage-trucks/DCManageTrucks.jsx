import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import AddTruckForm from "./AddTruckForm"
import TrucksFilter from "./TrucksFilter"
import TrucksTable from "./TrucksTable"
 
export default function DCManageTrucks() {
    return (
        <section>
            <div className="h-18 px-10 flex gap-4 items-center shadow-md">
                <Link to={'/dc'} className="bg-gold hover:bg-gold-dark p-2 rounded-full">
                    <ArrowLeft size={18} className="text-maroon" />
                </Link>
                <div className="flex items-center justify-between w-full">
                    <div className="-space-y-1">
                        <h1 className="text-lg">Trucks at this DC</h1>
                        <p className="text-sm text-gray-500">
                            All trucks assigned to Pune Warehouse — view status, assign drivers, dispatch idle trucks
                        </p>
                    </div>
                    <AddTruckForm />
                </div>
            </div>
 
            <TrucksFilter />
            <TrucksTable />
        </section>
    )
}