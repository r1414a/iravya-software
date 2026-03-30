 
import DeviceFilter from "@/components/manage-gps/DeviceFitler"
import AdminSubHeader    from "@/components/AdminSubHeader"
import AddGPSDeviceModal from "@/components/manage-gps/AddGPSDeviceModal"
import DeviceTable from "@/components/manage-gps/DeviceTable"
 
export default function SuperAdminManageDevices() {
    return (
        <section>
            <AdminSubHeader
                to={'/admin'}
                heading={'GPS Devices'}
                subh="All tracking devices across every brand and DC — register, assign to DCs, monitor health"
                CreateButton={<AddGPSDeviceModal/>}
            />
           
           <DeviceFilter />
                       <DeviceTable />
            {/* <GpsDeviceFilter showBrandFilter />
            <DeviceTable showBrandColumn /> */}
        </section>
    )
}