import AddDeviceForm from "./AddDeviceForm"
import DeviceFilter from "./DeviceFilter"
import DeviceTable from "./DeviceTable"
import AdminSubHeader from "@/components/AdminSubHeader"

export default function DCManageDevices() {
    return (
        <section>
            <AdminSubHeader
                to="/dc"
                heading="GPS Devices"
                subh="All tracking devices registered to this DC — add, assign to trucks, monitor connectivity"
                CreateButton={<AddDeviceForm />}
            />
            <DeviceFilter />
            <DeviceTable />
        </section>
    )
}