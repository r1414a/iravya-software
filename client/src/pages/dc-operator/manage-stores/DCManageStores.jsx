
import AdminSubHeader from "@/components/AdminSubHeader"
import StoresFilter from "@/components/manage-store/StoresFilter"
import StoresTable from "@/components/manage-store/StoresTable"


export default function DCManageStores() {
    return (
        <section>
            <AdminSubHeader
                to="/dc"
                heading="Manage Stores"
                subh="Stores this DC delivers to — track incoming deliveries, devices held and manager contacts"
                // CreateButton={null}
            />
            <StoresFilter CreateButton={null}/>
            <StoresTable />
        </section>
    )
}