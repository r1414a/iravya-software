import AdminSubHeader from "@/components/AdminSubHeader"
import AddStoreForm from "@/components/super-admin/manage-stores/AddStoreForm"
import StoresFilter from "@/components/super-admin/manage-stores/StoresFilter"
import StoresTable from "@/components/super-admin/manage-stores/StoresTable"

export default function SuperAdminManageStores() {
    return (
        <section>
            <AdminSubHeader
                to={'/admin'}
                heading="Manage Stores"
                subh="All retail stores across all brands — add, edit, manage geofence and public tracking"
                CreateButton={<AddStoreForm/>}
            />
            

            <StoresFilter />
            <StoresTable />
        </section>
    )
}