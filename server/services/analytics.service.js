import bcrypt from "bcryptjs"
import sql from "../db/database.js"
import ApiError from "../utils/ApiError.js"

const getCountDataService = async (id, role) => {
    const user_id = role === 'dc_manager' ? id : null;

    const condition = user_id
        ? sql`dc.dc_manager = ${user_id}`
        : sql`TRUE`;

    // 📊 Trip Count
    const trip_count = await sql`
        WITH monthly_counts AS (
        SELECT
            DATE_TRUNC('month', t.departed_at) AS month,
            COUNT(*) AS trip_count
        FROM "Trips" t
        JOIN "Distribution_center" dc
            ON dc.id = t.source_dc_id
        WHERE t.departed_at IS NOT NULL
            AND ${condition}
        GROUP BY 1
        ),
        current_month AS (
        SELECT trip_count
        FROM monthly_counts
        WHERE month = DATE_TRUNC('month', CURRENT_DATE)
        ),
        last_month AS (
        SELECT trip_count
        FROM monthly_counts
        WHERE month = DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
        )
        SELECT
        COALESCE(c.trip_count, 0) AS current,
        COALESCE(l.trip_count, 0) AS last,
        (COALESCE(c.trip_count, 0) - COALESCE(l.trip_count, 0)) AS difference,
        CASE
            WHEN COALESCE(c.trip_count, 0) > COALESCE(l.trip_count, 0) THEN 'increase'
            WHEN COALESCE(c.trip_count, 0) < COALESCE(l.trip_count, 0) THEN 'decrease'
            ELSE 'no_change'
        END AS trend,
        CASE 
            WHEN COALESCE(l.trip_count, 0) = 0 THEN NULL
            ELSE ROUND(
            (COALESCE(c.trip_count, 0) - COALESCE(l.trip_count, 0)) * 100.0 
            / COALESCE(l.trip_count, 0),
            2
            )
        END AS percentChange
        FROM (SELECT 1) dummy
        LEFT JOIN current_month c ON true
        LEFT JOIN last_month l ON true;
    `;

    // ⏱️ Avg Trip Time
    const avg_trip_time = await sql`
        WITH trip_durations AS (
        SELECT
            DATE_TRUNC('month', t.departed_at) AS month,
            EXTRACT(EPOCH FROM (t.end_time - t.departed_at)) AS duration_seconds
        FROM "Trips" t
        JOIN "Distribution_center" dc
            ON dc.id = t.source_dc_id
        WHERE t.departed_at IS NOT NULL
            AND t.end_time IS NOT NULL
            AND t.end_time > t.departed_at
            AND ${condition}
        ),
        monthly_avg AS (
        SELECT
            month,
            AVG(duration_seconds) AS avg_duration
        FROM trip_durations
        GROUP BY 1
        ),
        current_month AS (
        SELECT avg_duration
        FROM monthly_avg
        WHERE month = DATE_TRUNC('month', CURRENT_DATE)
        ),
        last_month AS (
        SELECT avg_duration
        FROM monthly_avg
        WHERE month = DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
        )
        SELECT
        ROUND(COALESCE(c.avg_duration, 0) / 60, 2) AS current,
        ROUND(COALESCE(l.avg_duration, 0) / 60, 2) AS last,
        ROUND((COALESCE(c.avg_duration, 0) - COALESCE(l.avg_duration, 0)) / 60, 2) AS difference,
        CASE
            WHEN COALESCE(c.avg_duration, 0) > COALESCE(l.avg_duration, 0) THEN 'increase'
            WHEN COALESCE(c.avg_duration, 0) < COALESCE(l.avg_duration, 0) THEN 'decrease'
            ELSE 'no_change'
        END AS trend,
        CASE 
            WHEN COALESCE(l.avg_duration, 0) = 0 THEN NULL
            ELSE ROUND(
            (COALESCE(c.avg_duration, 0) - COALESCE(l.avg_duration, 0)) * 100.0 
            / COALESCE(l.avg_duration, 0),
            2
            )
        END AS percentChange
        FROM (SELECT 1) dummy
        LEFT JOIN current_month c ON true
        LEFT JOIN last_month l ON true;
    `;

    // 🚚 Truck Data (no duplicates)
    const truck_data = await sql`
        SELECT
        COUNT(DISTINCT t.truck_id) FILTER (WHERE LOWER(t.status::text) = 'idle') AS idle,
        COUNT(DISTINCT t.truck_id) FILTER (WHERE LOWER(t.status::text) = 'in_transit') AS inTransit
        FROM "Trips" t
        JOIN "Distribution_center" dc
        ON dc.id = t.source_dc_id
        WHERE ${condition};
    `;

    // 👨‍✈️ Driver Data (no duplicates)
    const driver_data = await sql`
        SELECT
        COUNT(DISTINCT t.driver_id) FILTER (WHERE LOWER(d.status::text) = 'available') AS active,
        COUNT(DISTINCT t.driver_id) FILTER (WHERE LOWER(d.status::text) = 'on_trip') AS onTrip
        FROM "Trips" t
        JOIN "Drivers" d ON d.id = t.driver_id
        JOIN "Distribution_center" dc ON dc.id = t.source_dc_id
        WHERE ${condition};
    `;

    // 📦 Delivery Rate
    const delivery_rate = await sql`
        WITH monthly_data AS (
        SELECT
            DATE_TRUNC('month', t.departed_at) AS month,
            COUNT(*) FILTER (WHERE t.status = 'completed') AS delivered_trips,
            COUNT(*) AS total_trips,
            COUNT(*) FILTER (WHERE t.status = 'completed') * 100.0 / NULLIF(COUNT(*),0) AS delivery_rate
        FROM "Trips" t
        JOIN "Distribution_center" dc
            ON dc.id = t.source_dc_id
        WHERE t.departed_at IS NOT NULL
            AND ${condition}
        GROUP BY 1
        ),
        current_month AS (
        SELECT delivery_rate
        FROM monthly_data
        WHERE month = DATE_TRUNC('month', CURRENT_DATE)
        ),
        last_month AS (
        SELECT delivery_rate
        FROM monthly_data
        WHERE month = DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
        )
        SELECT
        ROUND(COALESCE(c.delivery_rate, 0), 2) AS current,
        ROUND(COALESCE(l.delivery_rate, 0), 2) AS last,
        ROUND(COALESCE(c.delivery_rate, 0) - COALESCE(l.delivery_rate, 0), 2) AS difference,
        CASE
            WHEN COALESCE(c.delivery_rate, 0) > COALESCE(l.delivery_rate, 0) THEN 'increase'
            WHEN COALESCE(c.delivery_rate, 0) < COALESCE(l.delivery_rate, 0) THEN 'decrease'
            ELSE 'no_change'
        END AS trend,
        CASE 
            WHEN COALESCE(l.delivery_rate, 0) = 0 THEN NULL
            ELSE ROUND(
            (COALESCE(c.delivery_rate, 0) - COALESCE(l.delivery_rate, 0)) * 100.0 
            / COALESCE(l.delivery_rate, 0),
            2
            )
        END AS percentChange
        FROM (SELECT 1) dummy
        LEFT JOIN current_month c ON true
        LEFT JOIN last_month l ON true;
    `;

    // 🏪 Store Data
    const store_data = await sql`
        SELECT 
        COUNT(DISTINCT ts.store_id) AS served,
        COUNT(*) AS deliveries
        FROM "Trip_stops" ts
        JOIN "Trips" t ON t.id = ts.trip_id
        JOIN "Distribution_center" dc ON dc.id = t.source_dc_id
        WHERE ${condition};
    `;

    return {
        totalTrip:trip_count,
        avgTripTime:avg_trip_time,
        trucks: truck_data,
        drivers: driver_data,
        deliveryRate: delivery_rate,
        stores: store_data
    };
};

const graphDataService = async (id, role, date, year, month) => {
    const user_id = role === 'dc_manager' ? id : null;
    const dc_filter = role === 'dc_manager'
        ? sql`dc.dc_manager = ${user_id}`
        : sql`TRUE`;

    let series;
    let trunc_unit;
    let label_format;
    let key_name;
    let date_filter = sql`TRUE`;

    const pad = (val) => String(val).padStart(2, '0');

    if (year && !month && !date) {
        const start = `${year}-01-01`;

        series = sql`
        generate_series(
            DATE_TRUNC('year', ${start}::date),
            DATE_TRUNC('year', ${start}::date) + INTERVAL '11 months',
            INTERVAL '1 month'
        )
        `;

        trunc_unit = 'month';
        label_format = 'Month';
        key_name = 'month';

        date_filter = sql`
        t.departed_at >= ${start}::date
        AND t.departed_at < (${start}::date + INTERVAL '1 year')
        `;
    }

    else if (year && month && !date) {
        const start = `${year}-${pad(month)}-01`;

        series = sql`
        generate_series(
            DATE_TRUNC('month', ${start}::date),
            DATE_TRUNC('month', ${start}::date) + INTERVAL '1 month - 1 day',
            INTERVAL '1 day'
        )
        `;

        trunc_unit = 'day';
        label_format = 'DD';
        key_name = 'day';

        date_filter = sql`
        t.departed_at >= ${start}::date
        AND t.departed_at < (${start}::date + INTERVAL '1 month')
        `;
    }

    else if (year && month && date) {
        const start = `${year}-${pad(month)}-${pad(date)}`;

        series = sql`
        generate_series(
            DATE_TRUNC('day', ${start}::date),
            DATE_TRUNC('day', ${start}::date) + INTERVAL '23 hours',
            INTERVAL '1 hour'
        )
        `;

        trunc_unit = 'hour';
        label_format = 'HH24:00';
        key_name = 'hour';

        date_filter = sql`
        t.departed_at >= ${start}::date
        AND t.departed_at < (${start}::date + INTERVAL '1 day')
        `;
    }

    else {
        series = sql`
            generate_series(
            COALESCE(
                (SELECT DATE_TRUNC('year', MIN(departed_at)) FROM "Trips"),
                DATE_TRUNC('year', CURRENT_DATE)
            ),
            COALESCE(
                (SELECT DATE_TRUNC('year', MAX(departed_at)) FROM "Trips"),
                DATE_TRUNC('year', CURRENT_DATE)
            ),
            INTERVAL '1 year'
            )
        `;

        trunc_unit = 'year';
        label_format = 'YYYY';
        key_name = 'year';
    }

    const raw = await sql`
        WITH time_series AS (
        SELECT ${series} AS period
        ),
        trip_data AS (
        SELECT
            DATE_TRUNC('${sql.unsafe(trunc_unit)}', t.departed_at) AS period,
            t.status
        FROM "Trips" t
        JOIN "Distribution_center" dc
            ON dc.id = t.source_dc_id
        WHERE t.departed_at IS NOT NULL
            AND ${dc_filter}
            AND ${date_filter}
        )
        SELECT
        ts.period,
        TO_CHAR(ts.period, ${sql.unsafe(`'${label_format}'`)}) AS label,

        COUNT(td.status) FILTER (WHERE td.status = 'completed') AS completed,
        COUNT(td.status) FILTER (WHERE td.status = 'scheduled') AS scheduled,
        COUNT(td.status) FILTER (WHERE td.status ='cancelled') AS cancelled

        FROM time_series ts
        LEFT JOIN trip_data td
        ON ts.period = td.period

        GROUP BY ts.period
        ORDER BY ts.period;
    `;

    const trip_by_status = raw.map(row => ({
        [key_name]: key_name === 'day' ? Number(row.label) : row.label.trim(),
        scheduled: Number(row.scheduled || 0),
        completed: Number(row.completed || 0),
        cancelled: Number(row.cancelled || 0)
    }));

    let dc_date_filter = sql`TRUE`;

    // 🎯 YEAR
    if (year && !month && !date) {
        const start = `${year}-01-01`;

        dc_date_filter = sql`
        t.departed_at >= ${start}::date
        AND t.departed_at < (${start}::date + INTERVAL '1 year')
        `;
    }

    // 🎯 YEAR + MONTH
    else if (year && month && !date) {
        const start = `${year}-${pad(month)}-01`;

        dc_date_filter = sql`
        t.departed_at >= ${start}::date
        AND t.departed_at < (${start}::date + INTERVAL '1 month')
        `;
    }

    // 🎯 FULL DATE
    else if (year && month && date) {
        const start = `${year}-${pad(month)}-${pad(date)}`;

        dc_date_filter = sql`
        t.departed_at >= ${start}::date
        AND t.departed_at < (${start}::date + INTERVAL '1 day')
        `;
    }

    // 🎯 DEFAULT → last 5 years
    else {
        dc_date_filter = sql`
        t.departed_at >= (
            SELECT DATE_TRUNC('year', MIN(departed_at)) FROM "Trips"
        )
        `;
    }

    const result = await sql`
        SELECT
            dc.name AS dc,

            COUNT(t.id) AS dispatched,

            COUNT(t.id) FILTER (WHERE t.status = 'completed') AS completed,
            COUNT(t.id) FILTER (WHERE t.status = 'in_transit') AS in_transit,

            -- 🎯 Performance %
            COALESCE(
            ROUND(
                COUNT(t.id) FILTER (WHERE t.status = 'completed') * 100.0 
                / NULLIF(COUNT(t.id), 0),
                0
            ),
            0
            ) AS performance

        FROM "Distribution_center" dc

        LEFT JOIN "Trips" t
            ON dc.id = t.source_dc_id
            AND t.departed_at IS NOT NULL
            AND ${dc_date_filter}

        WHERE 
            ${dc_filter}
            AND dc.status = 'active'

        GROUP BY dc.name
        ORDER BY dc.name;
        `;

    // ✅ Final format
    const dc_data = result.map(row => ({
        dc: row.dc,
        completed: Number(row.completed || 0),
        in_transit: Number(row.in_transit || 0),
        performance: Number(row.performance || 0)
    }));
    
    let alert_date_filter = sql`TRUE`;

    // YEAR FILTER
    if (year && !month && !date) {
        const start = `${year}-01-01`;

        alert_date_filter = sql`
        a.created_at >= ${start}::date
        AND a.created_at < (${start}::date + INTERVAL '1 year')
        `;
    }

    // YEAR + MONTH
    else if (year && month && !date) {
        const start = `${year}-${pad(month)}-01`;

        alert_date_filter = sql`
        a.created_at >= ${start}::date
        AND a.created_at < (${start}::date + INTERVAL '1 month')
        `;
    }

    // FULL DATE
    else if (year && month && date) {
        const start = `${year}-${pad(month)}-${pad(date)}`;

        alert_date_filter = sql`
        a.created_at >= ${start}::date
        AND a.created_at < (${start}::date + INTERVAL '1 day')
        `;
    }

    // DEFAULT → all data
    else {
        alert_date_filter = sql`
        a.created_at >= (
            SELECT COALESCE(MIN(created_at), CURRENT_DATE)
            FROM "Alerts"
        )
        `;
    }

    const alert_result = await sql`
        SELECT
        a.type,
        COUNT(*) AS value
        FROM "Alerts" a
        WHERE ${alert_date_filter}
        GROUP BY a.type
        ORDER BY value DESC;
    `;

    const alert = alert_result.map(row => ({
        type: row.type,
        value: Number(row.value || 0)
    }));

    let top_store_date_filter = sql`TRUE`;

    // 🎯 YEAR
    if (year && !month && !date) {
        const start = `${year}-01-01`;

        top_store_date_filter = sql`
        t.departed_at >= ${start}::date
        AND t.departed_at < (${start}::date + INTERVAL '1 year')
        `;
    }

    // 🎯 YEAR + MONTH
    else if (year && month && !date) {
        const start = `${year}-${pad(month)}-01`;

        top_store_date_filter = sql`
        t.departed_at >= ${start}::date
        AND t.departed_at < (${start}::date + INTERVAL '1 month')
        `;
    }

    // 🎯 FULL DATE
    else if (year && month && date) {
        const start = `${year}-${pad(month)}-${pad(date)}`;

        top_store_date_filter = sql`
        t.departed_at >= ${start}::date
        AND t.departed_at < (${start}::date + INTERVAL '1 day')
        `;
    }

    // 🎯 DEFAULT → all data
    else {
        top_store_date_filter = sql`
        t.departed_at >= (
            SELECT COALESCE(MIN(departed_at), CURRENT_DATE)
            FROM "Trips"
        )
        `;
    }

    const store_result = await sql`
        SELECT
        s.name AS store,
        COUNT(*) AS deliveries

        FROM "Trip_stops" ts

        JOIN "Trips" t
        ON t.id = ts.trip_id
        AND t.status = 'completed'         -- ✅ only delivered
        AND t.departed_at IS NOT NULL
        AND ${top_store_date_filter}

        JOIN "Stores" s
        ON s.id = ts.store_id

        JOIN "Distribution_center" dc
        ON dc.id = t.source_dc_id

        WHERE ${dc_filter}

        GROUP BY s.name
        ORDER BY deliveries DESC
        LIMIT 5;
    `;

    const top_stores = store_result.map(row => ({
        store: row.store,
        deliveries: Number(row.deliveries || 0)
    }));

    return { trip_by_status, dc_data, alert ,top_stores};
}

export{
    getCountDataService,
    graphDataService
}