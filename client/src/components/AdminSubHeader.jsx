import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"


export default function AdminSubHeader({to, heading,subh, CreateButton}){
    return(
         <div className="h-18 px-10 flex gap-4 items-center shadow-md">
                <Link to={to} className="bg-gold hover:bg-gold-dark p-2 rounded-full">
                    <ArrowLeft size={18} className="text-maroon" />
                </Link>
                <div className="flex items-center justify-between w-full">
                    <div className="-space-y-1">
                        <h1 className="text-lg">{heading}</h1>
                        <p className="text-sm text-gray-500">
                            {subh}
                        </p>
                    </div>
                    {CreateButton}
                </div>
            </div>
    )
}