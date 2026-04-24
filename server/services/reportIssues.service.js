

const getAllReportIssuesService = async () => {
    const issues = await sql`
        SELECT 

        FROM "Report issue" r

        LEFT JOIN "Trips" t
            ON t.id = r.trip_id
        LEFT JOIN "Stores" s
            ON s.id = r.store_id

        LEFT JOIN "Distribution_center" dc
            ON dc.id = tr.source_dc_id
        LEFT JOIN "User" scm,
            ON scm.id = s.store_manager
        LEFT JOIN "User" dcm
            ON dcm.id = dc.dc_manager
    `
}

export{
    getAllReportIssuesService
}