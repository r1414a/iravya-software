import AdminSubHeader from "@/components/AdminSubHeader"
import AlertsFilter from "@/components/alerts/AlertsFilter"
import AlertsTable from "@/components/alerts/AlertsTable"

export default function SuperAdminAlerts() {
    return (
        <section className="mb-10">
            <AdminSubHeader
                to={'/admin'}
                heading="Alerts"
                subh="All system alerts across every brand — speeding, long stops, route deviations and device issues"
                
            />
           
 
            <AlertsFilter />
            <AlertsTable />
        </section>
    )
}