
import AddNewStore from "./AddNewStores"
import DCStoreTable from './DCStoreTable'
import DCStoreFilter from "./DCStoreFilter"
import AdminSubHeader from "@/components/AdminSubHeader"


export default function DCManageStores() {
    return (
        <section>
            <AdminSubHeader
                to="/dc"
                heading="Manage Stores"
                subh="View and add stores"
                CreateButton={<AddNewStore />}
            />
            <DCStoreFilter />
            <DCStoreTable />
        </section>
    )
}