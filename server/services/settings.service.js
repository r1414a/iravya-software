import bcrypt from "bcryptjs"
import sql from "../db/database.js"
import ApiError from "../utils/ApiError.js"
import { sendEmail } from "../utils/mailer.js"
import asyncHandler from "../utils/asyncHandler.js"

const setNotificationPreferencesService = async (id, data) => {
      const {
        trip_dispatched,
        trip_completed,
        trip_cancelled,
        speeding,
        long_stop,
        route_deviation,
        geofence,
        new_user,
        platform_errors,
    } = data;
    let updated;
    
    const result = await sql`
      SELECT * FROM "Notification_preferences" WHERE "user_id" = ${id}
    `;

    if (result.length > 0) {
      // If preferences exist, update them
      updated = await sql`
        UPDATE "Notification_preferences"
        SET 
          "trip_dispatched" = ${trip_dispatched}, 
          "trip_completed" = ${trip_completed}, 
          "trip_cancelled" = ${trip_cancelled},
          "alert_speeding" = ${speeding},
          "alert_long_stop" = ${long_stop},
          "alert_route_deviation" = ${route_deviation},
          "alert_geofence" = ${geofence},
          "new_user" = ${new_user},
          "platform_errors" = ${platform_errors}
        WHERE "user_id" = ${id}
        RETURNING *
      `;
    } else {
      // If no preferences exist, create new preferences for the user
      updated = await sql`
        INSERT INTO "Notification_preferences" 
        ("user_id", "trip_dispatched", "trip_completed", "trip_cancelled", 
         "alert_speeding", 
         "alert_long_stop", 
         "alert_route_deviation", 
         "alert_geofence","new_user", "platform_errors"
         )
        VALUES
        (${id}, ${trip_dispatched}, ${trip_completed}, ${trip_cancelled}, 
         ${speeding}, ${long_stop}, ${route_deviation}, ${geofence}, ${new_user}, ${platform_errors})
         RETURNING *
      `;
    }
    return updated[0]
}

export{
    setNotificationPreferencesService
}