import bcrypt from "bcryptjs"
import sql from "../db/database.js"
import ApiError from "../utils/ApiError.js"

const getCountDataService = async (id, role) => {
    const user_id = role === 'dc_manager' ? id : null;

    const condition = user_id
        ? sql`source_dc_id = ${user_id}`
        : sql`TRUE`;

    const trip_count = await sql`
        WITH monthly_counts AS (
        SELECT
            DATE_TRUNC('month', departed_at) AS month,
            COUNT(*) AS trip_count
        FROM "Trips"
        WHERE departed_at IS NOT NULL
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

        -- 🔢 Difference
        (COALESCE(c.trip_count, 0) - COALESCE(l.trip_count, 0)) AS trip_difference,

        -- 📈 Direction
        CASE
            WHEN COALESCE(c.trip_count, 0) > COALESCE(l.trip_count, 0) THEN 'increase'
            WHEN COALESCE(c.trip_count, 0) < COALESCE(l.trip_count, 0) THEN 'decrease'
            ELSE 'no_change'
        END AS trend,

        -- 📊 Percent change
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
    const avg_trip_time = await sql`
        WITH trip_durations AS (
        SELECT
            DATE_TRUNC('month', departed_at) AS month,
            EXTRACT(EPOCH FROM (end_time - departed_at)) AS duration_seconds
        FROM "Trips"
        WHERE departed_at IS NOT NULL
            AND end_time IS NOT NULL
            AND end_time > departed_at
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

        ROUND(
            (COALESCE(c.avg_duration, 0) - COALESCE(l.avg_duration, 0)) / 60,
            2
        ) AS difference_minutes,

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
    `

    const truck_data = await sql`
        SELECT
            COUNT(*) FILTER (WHERE LOWER(status::text) = 'idle') AS active_trucks,
            COUNT(*) FILTER (WHERE LOWER(status::text) = 'in_transit') AS in_transit_trucks
        FROM "Trucks"
        WHERE ${condition};
    `
    const driver_data = await sql`
        SELECT
            COUNT(*) FILTER (WHERE LOWER(status::text) = 'available') AS active_driver,
            COUNT(*) FILTER (WHERE LOWER(status::text) = 'on_trip') AS on_trip_driver
        FROM "Drivers"
        WHERE ${condition};
    `
    const delivery_rate = await sql`
        WITH monthly_data AS (
        SELECT
            DATE_TRUNC('month', departed_at) AS month,
            COUNT(*) FILTER (WHERE status = 'completed') AS delivered_trips,
            COUNT(*) AS total_trips,
            COUNT(*) FILTER (WHERE status = 'completed') * 100.0 / COUNT(*) AS delivery_rate
        FROM "Trips"
        WHERE departed_at IS NOT NULL
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

        ROUND(
            COALESCE(c.delivery_rate, 0) - COALESCE(l.delivery_rate, 0),
            2
        ) AS rate_difference,

        
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
    `

    return {
        "trip_count":trip_count,
        "avg_trip_time":avg_trip_time,
        truck_data,
        driver_data,
        delivery_rate
    };
};

export{
    getCountDataService
}