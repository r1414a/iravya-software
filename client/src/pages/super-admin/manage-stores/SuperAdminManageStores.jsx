import AdminSubHeader from "@/components/AdminSubHeader"
import AddStoreForm from "@/components/manage-store/AddStoreForm"
import StoresFilter from "@/components/manage-store/StoresFilter"
import StoresTable from "@/components/manage-store/StoresTable"

export default function SuperAdminManageStores() {
    return (
        <section>
            <AdminSubHeader
                to={'/admin'}
                heading="Manage Stores"
                subh="All retail stores across all brands — add, edit, manage geofence and public tracking"
                // CreateButton={<AddStoreForm/>}
            />
            

            <StoresFilter CreateButton={<AddStoreForm />}/>
            <StoresTable />
        </section>
    )
}