import AdminSubHeader from "@/components/AdminSubHeader"
import AddDCForm from "@/components/super-admin/manage-dcs/AddDcForm"
import DCsFilter from "@/components/super-admin/manage-dcs/DcsFilter"
import DCsTable from "@/components/super-admin/manage-dcs/DcsTable"

export default function SuperAdminManageDCs() {
    return (
        <section className="mb-10">

            <AdminSubHeader
                to={'/admin'}
                heading="Manage Dc's"
                subh="All data centers across all brands — add, edit, assign operators and manage trucks"
                
            />
            <DCsFilter CreateButton={<AddDCForm />}/>
            <DCsTable />
        </section>
    )
}