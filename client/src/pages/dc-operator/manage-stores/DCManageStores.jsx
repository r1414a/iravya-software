import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import AddNewStore from "./AddNewStores"
import DCStoreTable from './DCStoreTable'
import DCStoreFilter from "./DCStoreFilter"

export default function DCManageStores(){
    return(
        <section>
            <div className="h-18 px-10 flex gap-4 items-center shadow-md ">
                <Link to={'/dc'} className="bg-gold hover:bg-gold-dark p-2 rounded-full">
                    <ArrowLeft size={18} className="text-maroon"/>
                </Link>
                <div className="flex items-center justify-between w-full">
                    <div className="-space-y-1">
                        <h1 className="text-lg">Manage Stores</h1>
                        <p className="text-sm text-gray-500">View and add stores</p>
                    </div>
                    <AddNewStore />
                </div>
            </div>
            <DCStoreFilter/>
            <DCStoreTable/>
        </section>
    )
}