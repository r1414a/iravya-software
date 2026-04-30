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
        COALESCE(c.trip_count, 0) AS total_trips_this_month,
        COALESCE(l.trip_count, 0) AS total_trips_last_month,
        (COALESCE(c.trip_count, 0) - COALESCE(l.trip_count, 0)) AS trip_difference,
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
        END AS percent_change
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
        ROUND(COALESCE(c.avg_duration, 0) / 60, 2) AS avg_trip_minutes_this_month,
        ROUND(COALESCE(l.avg_duration, 0) / 60, 2) AS avg_trip_minutes_last_month,
        ROUND((COALESCE(c.avg_duration, 0) - COALESCE(l.avg_duration, 0)) / 60, 2) AS difference_minutes,
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
        END AS percent_change
        FROM (SELECT 1) dummy
        LEFT JOIN current_month c ON true
        LEFT JOIN last_month l ON true;
    `;

    // 🚚 Truck Data (no duplicates)
    const truck_data = await sql`
        SELECT
        COUNT(DISTINCT t.truck_id) FILTER (WHERE LOWER(t.status::text) = 'idle') AS idle_trucks,
        COUNT(DISTINCT t.truck_id) FILTER (WHERE LOWER(t.status::text) = 'in_transit') AS in_transit_trucks
        FROM "Trips" t
        JOIN "Distribution_center" dc
        ON dc.id = t.source_dc_id
        WHERE ${condition};
    `;

    // 👨‍✈️ Driver Data (no duplicates)
    const driver_data = await sql`
        SELECT
        COUNT(DISTINCT t.driver_id) FILTER (WHERE LOWER(d.status::text) = 'available') AS active_driver,
        COUNT(DISTINCT t.driver_id) FILTER (WHERE LOWER(d.status::text) = 'on_trip') AS on_trip_driver
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
        ROUND(COALESCE(c.delivery_rate, 0), 2) AS delivery_rate_this_month,
        ROUND(COALESCE(l.delivery_rate, 0), 2) AS delivery_rate_last_month,
        ROUND(COALESCE(c.delivery_rate, 0) - COALESCE(l.delivery_rate, 0), 2) AS rate_difference,
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
        END AS percent_change
        FROM (SELECT 1) dummy
        LEFT JOIN current_month c ON true
        LEFT JOIN last_month l ON true;
    `;

    // 🏪 Store Data
    const store_data = await sql`
        SELECT 
        COUNT(DISTINCT ts.store_id) AS total_served_store,
        COUNT(*) AS total_deliveries
        FROM "Trip_stops" ts
        JOIN "Trips" t ON t.id = ts.trip_id
        JOIN "Distribution_center" dc ON dc.id = t.source_dc_id
        WHERE ${condition};
    `;

    return {
        "trip_count":trip_count,
        "avg_trip_time":avg_trip_time,
        truck_data,
        driver_data,
        delivery_rate,
        store_data
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
        const start = new Date().getFullYear() - 4;

        series = sql`
        generate_series(
            DATE_TRUNC('year', ${start}-01-01::date),
            DATE_TRUNC('year', CURRENT_DATE),
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

    return { trip_by_status };
}

export{
    getCountDataService,
    graphDataService
}