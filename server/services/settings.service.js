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
        alert_speeding,
        alert_long_stop,
        alert_route_deviation,
        alert_geofence,
        device_offline,
        device_at_store,
        device_low_batt,
        new_user,
        platform_errors,
        via_email,
        via_sms,
        via_push,
    } = data;

    
    const result = await sql`
      SELECT * FROM "Notification_preferences" WHERE "user_id" = ${id}
    `;

    if (result.length > 0) {
      // If preferences exist, update them
      await sql`
        UPDATE "Notification_preferences"
        SET 
          "trip_dispatched" = ${trip_dispatched}, 
          "trip_completed" = ${trip_completed}, 
          "trip_cancelled" = ${trip_cancelled},
          "alert_speeding" = ${alert_speeding},
          "alert_long_stop" = ${alert_long_stop},
          "alert_route_deviation" = ${alert_route_deviation},
          "alert_geofence" = ${alert_geofence},
          "device_offline" = ${device_offline},
          "device_at_store" = ${device_at_store},
          "device_low_batt" = ${device_low_batt},
          "new_user" = ${new_user},
          "platform_errors" = ${platform_errors},
          "via_email" = ${via_email},
          "via_sms" = ${via_sms},
          "via_push" = ${via_push}
        WHERE "user_id" = ${id}
      `;
      return { message: 'Notification preferences updated successfully' };
    } else {
      // If no preferences exist, create new preferences for the user
      await sql`
        INSERT INTO "Notification_preferences" 
        ("user_id", "trip_dispatched", "trip_completed", "trip_cancelled", 
         "alert_speeding", "alert_long_stop", "alert_route_deviation", "alert_geofence",
         "device_offline", "device_at_store", "device_low_batt", "new_user", "platform_errors", 
         "via_email", "via_sms", "via_push")
        VALUES
        (${id}, ${trip_dispatched}, ${trip_completed}, ${trip_cancelled}, 
         ${alert_speeding}, ${alert_long_stop}, ${alert_route_deviation}, ${alert_geofence},
         ${device_offline}, ${device_at_store}, ${device_low_batt}, ${new_user}, ${platform_errors}, 
         ${via_email}, ${via_sms}, ${via_push})
      `;
      return { message: 'Notification preferences created successfully' };
    }
}

export{
    setNotificationPreferencesService
}