import sql from "../db/database.js"
import * as turf from '@turf/turf';
import axios from "axios";
// import mbxClient from "@mapbox/mapbox-sdk";
// import mbxMatching from "@mapbox/mapbox-sdk/services/match";
// import mbxClient from '@mapbox/mapbox-sdk';
// import mbxMatching from '@mapbox/mapbox-sdk/services/match'; // Corrected import path

// const baseClient = mbxClient({ accessToken: process.env.VITE_MAPBOX_TOKEN });
// const matchingService = mbxMatching(baseClient);
const checkIsDelay = async(deliveryId, trip, now)=>{
    const [delayAlert] = await sql`
            SELECT * FROM "Alerts" 
            WHERE trip_id = ${deliveryId} 
            AND type = 'delay'
            LIMIT 1
        `;

    const lastAlertTime = delayAlert?.created_at
        ? new Date(delayAlert.created_at).getTime()
        : null;

    const sixHoursPassed = !lastAlertTime || (lastAlertTime + 6 * 60 * 60 * 1000 < now);

    const shouldSendAlert =
        sixHoursPassed &&
        trip.status !== "completed";

    return shouldSendAlert

}

async function getCleanedPath(coordinates) {
    
    // const response = await matchingService.getMatching({
    //     points: coordinates.map(c => ({ coordinates: c })),
    //     profile: 'driving',
    //     geometries: 'geojson'
    // }).send();

    // return response.body.matchings[0].geometry; // Returns a cleaned LineString
    let coordsArray;
    // if (typeof coordinates === 'string') {
    //     const raw = coordinates.split(',');
    //     coordsArray = [];
    //     for (let i = 0; i < raw.length; i += 2) {
    //         coordsArray.push([parseFloat(raw[i]), parseFloat(raw[i+1])]);
    //     }
    // } else {
    //     coordsArray = coordinates;
    // }
    coordsArray = JSON.parse(coordinates);
    const coordsString = coordsArray
        .map(c => `${c[0]},${c[1]}`)
        .join(";");
    const response = await fetch(
        `https://api.mapbox.com/matching/v5/mapbox/driving/${coordsString}?geometries=geojson&access_token=${process.env.VITE_MAPBOX_TOKEN}`
       // `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsString}?geometries=polyline&overview=full&access_token=${process.env.VITE_MAPBOX_TOKEN}`
    );
    const data = await response.json();
    console.log("line 39", data);
    
    return data.matchings[0].geometry;
}

function checkDeviation(truckPos, route, threshold = 50) {
    // Find the point on the route closest to the truck
    // console.log(truckPos)
    const snapped = turf.nearestPointOnLine(route, truckPos);
    // Calculate distance between truck and the snapped point
    const distance = turf.distance(truckPos, snapped, { units: 'meters' });
    if (distance > threshold) {
        return { 
        deviated: true, 
        distance: Math.round(distance), 
        message: `Truck is ${Math.round(distance)}m off-route!` 
        };
    }
    return { deviated: false, distance: Math.round(distance) };
}

const getLocation = async (lng, lat) => {
    const res = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.VITE_MAPBOX_TOKEN}`
    );
    const data = await res.json();
    const address = data.features[0].place_name;
    // console.log("Address:", address);
    return address
};

const checkDistance = (store_location, truckLocation)=>{
    const distance = turf.distance(store_location, truckLocation, { units: "meters" });
    return distance
}
let prelat, prelng, same_location_from, threshold_time;
same_location_from = undefined;
threshold_time = undefined;

const tripTracker = (socket, io) =>{
    socket.on("join-delivery", async({ deliveryId }) => {
        console.log(`join ${deliveryId}`);
        const [trip] = isUUID(deliveryId)
            ? await sql`
                SELECT id
                FROM "Trips"
                WHERE id = ${deliveryId}
                `
            : await sql`
                SELECT id
                FROM "Trips"
                WHERE tracking_code = ${deliveryId}
                `;
        console.log(trip);
        
        if(trip !== undefined){
            socket.join(trip.id);
            
            socket.emit("joined-successfully", {
                message: `You have joined delivery room: ${deliveryId}`,
                deliveryId: deliveryId
            });
        }
        else{
            socket.emit("Error", {
                message: `Trip not found: ${deliveryId}`,
                deliveryId: deliveryId
            });
        }
    });

    

    socket.on("get-updated-location", async(data)=>{
        const {lng, lat, deliveryId, speed} = data
        prelat = lat;
        prelng = lng;
        console.log(lng, lat, deliveryId);

        const [trip] = await sql`
            SELECT * FROM "Trips"
            WHERE id = ${deliveryId}
        `
        const trip_stops = await sql `
            SELECT 
                tst.*,
                s.id as store_id,
                s.name,
                s.latitude,
                s.longitude,
                s.geofence_radius
            FROM "Trip_stops" tst
            LEFT JOIN "Stores" s
            ON s.id = tst.store_id
            WHERE tst.trip_id = ${deliveryId};
        `
        const truckLocation = turf.point([lng, lat]);
        console.log(trip, trip.geopath);
        
        const geopath = await getCleanedPath(trip.geopath)
        const {deviated, distance} = checkDeviation(truckLocation, geopath)
        const location_name = await getLocation(lng, lat)
        
        await sql`
            UPDATE "Trips"
            SET
                current_location = ${location_name},
                current_lat = ${lat},
                current_lng = ${lng}
            WHERE id = ${deliveryId}
        `

        for (let st of trip_stops) {

            const store_location = turf.point([
                Number(st.longitude),
                Number(st.latitude)
            ]);

            const distance_dif = checkDistance(store_location, truckLocation);
            const displacement = distance_dif - Number(st.geofence_radius);
            // 🚧 Inside geofence
            if (displacement <= 0) {

                await sql`
                    UPDATE "Trip_stops"
                    SET "status" = 'arrived'
                    WHERE "trip_id" = ${deliveryId}
                    AND "store_id" = ${st.store_id}
                `
                const alert = await sql `
                        INSERT INTO "Alerts" (
                            dc_id,
                            trip_id,
                            truck_id,
                            device_id,
                            type,
                            severity,
                            description,
                            lat,
                            lng,
                            triggered_at,
                            created_at
                        )
                        VALUES (
                            ${trip.source_dc_id},
                            ${trip.id},
                            ${trip.truck_id},
                            ${trip.device_id? trip.device_id: null},
                            ${'geofence_enter'},
                            ${'medium'},
                            ${`Reached store location ${st.name}`},
                            ${lat},
                            ${lng},
                            NOW(),
                            NOW()
                        )
                        `;

                io.to(deliveryId).emit("Alert", {
                    message: `Under geofence radius of store ${st.name}`,
                    deliveryId,
                    store_name: st.name,
                    tracking_code: trip.tracking_code
                });

                
                if (!st.arrived_at && distance_dif <= 100) {
                    const alert = await sql `
                        INSERT INTO "Alerts" (
                            dc_id,
                            trip_id,
                            truck_id,
                            device_id,
                            type,
                            severity,
                            description,
                            lat,
                            lng,
                            is_read,
                            is_dismissed,
                            triggered_at,
                            created_at
                        )
                        VALUES (
                            ${trip.source_dc_id},
                            ${trip.id},
                            ${trip.truck_id},
                            ${trip.device_id? trip.device_id: null},
                            ${'geofence_enter'},
                            ${'high'},
                            ${`Reached store location ${st.name}`},
                            ${lat},
                            ${lng},
                            false,
                            false,
                            NOW(),
                            NOW()
                        )
                        `;
                    io.to(deliveryId).emit("Alert", {
                        message: `Reached store location ${st.name}`,
                        deliveryId,
                        store_name: st.name,
                        tracking_code: trip.tracking_code
                    });

                    await sql`
                        UPDATE "Trip_stops"
                        SET "arrived_at" = NOW()
                        WHERE "trip_id" = ${deliveryId}
                        AND "store_id" = ${st.store_id}
                    `;
                }
            }
        }


        if(deviated){
            console.log(trip.id, trip.source_dc_id)
            const alert = await sql `
            INSERT INTO "Alerts" (
                dc_id,
                trip_id,
                truck_id,
                device_id,
                type,
                severity,
                description,
                lat,
                lng,
                triggered_at,
                created_at
            )
            VALUES (
                ${trip.source_dc_id},
                ${trip.id},
                ${trip.truck_id},
                ${trip.device_id? trip.device_id: null},
                ${'route_deviation'},
                ${'high'},
                ${`Route deviation by ${distance}m at ${location_name}`},
                ${lat},
                ${lng},
                NOW(),
                NOW()
            )
            `;
            socket.emit("Alert", {
                message: `Route deviation by ${distance}m at ${location_name}`,
                deliveryId: deliveryId,
                tracking_code: trip.tracking_code
            });

            io.to(deliveryId).emit("Alert", {
                lat,
                lng,
                message: `Route deviation by ${distance}m at ${location_name}`,
                deliveryId: deliveryId,
                tracking_code: trip.tracking_code
            });

            // io.to(deliveryId).emit("location-update", {
            //     lat,
            //     lng,
            //     message: `Route deviation by ${distance}m at ${location_name}`,
            //     deliveryId: deliveryId,
            //     tracking_code: trip.tracking_code
            // });
            
        }

        if(speed > trip.speed_threshold){
            const speed_exceded_by = Math.abs(Number(speed) - Number(trip.speed_threshold))
            const alert = await sql `
            INSERT INTO "Alerts" (
                dc_id,
                trip_id,
                truck_id,
                device_id,
                type,
                severity,
                description,
                lat,
                lng,
                is_read,
                is_dismissed,
                triggered_at,
                created_at
            )
            VALUES (
                ${trip.source_dc_id},
                ${trip.id},
                ${trip.truck_id},
                ${trip.device_id?trip.device_id:null},
                ${"speeding"},
                ${"high"},
                ${`speeding by ${Math.abs(speed - trip.speed_threshold)} at ${location_name}`},
                ${lat},
                ${lng},
                false,
                false,
                NOW(),
                NOW()
            )
            `;
            socket.emit("Alert", {
                message: `speeding by ${speed_exceded_by} at ${location_name}`,
                deliveryId: deliveryId,
                tracking_code: trip.tracking_code
            });

            io.to(deliveryId).emit("Alert", {
                lat,
                lng,
                message: `speeding by ${speed_exceded_by} at ${location_name}`,
                deliveryId: deliveryId,
                tracking_code: trip.tracking_code
            });

            // io.to(deliveryId).emit("location-update", {
            //     lat,
            //     lng,
            //     message: `speeding by ${speed_exceded_by} at ${location_name}`,
            //     deliveryId: deliveryId,
            //     tracking_code: trip.tracking_code
            // });
        }
        console.log(trip.current_lng === lng && trip.current_lat === lat);
        
        if(trip.current_lng === lng && trip.current_lat === lat) {
            
            if(same_location_from === undefined) {
                same_location_from = Date.now(); // Set the time when the location is first seen
                threshold_time = same_location_from + 1 * 1000 //(10 * 60 * 1000); // 10 minutes in milliseconds
            }
            console.log(Date.now() > threshold_time);
            
            if(Date.now() > threshold_time) {
                const alert = await sql `
                    INSERT INTO "Alerts" (
                        dc_id,
                        trip_id,
                        truck_id,
                        device_id,
                        type,
                        severity,
                        description,
                        lat,
                        lng,
                        triggered_at,
                        created_at
                    )
                    VALUES (
                        ${trip.source_dc_id},
                        ${trip.id},
                        ${trip.truck_id},
                        ${trip.device_id?trip.device_id:null},
                        ${"long_stop"},
                        ${"high"},
                        ${`More than 10 minutes at the same location ${location_name}`},
                        ${lat},
                        ${lng},
                        NOW(),
                        NOW()
                    )
                    `;
                io.to(deliveryId).emit("Alert", {
                    message: `More than 10 minutes at the same location ${location_name}`
                });

                socket.emit("Alert", {
                    message: `More than 10 minutes at the same location ${location_name}`
                })

            }

        }

        const now = Date.now();
        const endTime = new Date(trip.end_time).getTime();
        if (now > endTime) {
            if (checkIsDelay(deliveryId, trip, now)) {
                io.to(deliveryId).emit("Alert", {
                    message: `Delivery delayed of trip :${trip.tracking_code}` 
                });

                socket.emit("Alert", {
                    message: `Delivery delayed of trip : ${trip.tracking_code}`
                });

                // Optional but recommended: insert/update alert record
                const alert = await sql `
                    INSERT INTO "Alerts" (
                        dc_id,
                        trip_id,
                        truck_id,
                        device_id,
                        type,
                        severity,
                        description,
                        lat,
                        lng,
                        triggered_at,
                        created_at
                    )
                    VALUES (
                        ${trip.source_dc_id},
                        ${trip.id},
                        ${trip.truck_id},
                        ${trip.device_id?trip.device_id:null},
                        ${"delay"},
                        ${"high"},
                        ${`Delivery delayed  of trip : ${trip.tracking_code}`},
                        ${lat},
                        ${lng},
                        NOW(),
                        NOW()
                    )
                    `;
            }else{
                io.to(deliveryId).emit("Alert", {
                    message: `Delivery delayed  of trip : ${trip.tracking_code}`
                });

                socket.emit("Alert", {
                    message: `Delivery delayed of trip : ${trip.tracking_code}`
                });
            }
            io.to(deliveryId).emit("location-update", {
                lat,
                lng
            });
            socket.emit("location-update",{
                lat,
                lng,
                location_name
            })
        }
    })

    socket.on("on-complete-trip", async (data) => {
        const {deliveryId} = data
        const trip = await sql`
            UPDATE "Trips"
            SET
                status = 'completed'
            WHERE id = ${deliveryId}
            RETURNING *
        `
        await sql`
            UPDATE "Trucks" t
            SET status = 'idle',
            total_trips = total_trips +1
            FROM "Trips" tr
            WHERE tr.truck_id = t.id
            AND tr.id = ${deliveryId};
        `;

        await sql`
            UPDATE "Drivers" d
            SET status = 'available',
                total_trips = total_trips +1
            FROM "Trips" tr
            WHERE tr.driver_id = d.id
            AND tr.id = ${deliveryId};
        `;
        io.to(deliveryId).emit("completion-trip", {
            message :"Trip completed sucessfully"
        });
        socket.emit("completion-trip",{
            message :"Trip completed sucessfully"
        })
    })

    

}

const checkIsDelayStatus = async (io) => {
    const trips = await sql`
        SELECT * FROM "Trips" 
        WHERE completed_at = null 
        OR (status = 'in_transit' OR status = 'scheduled')
    `;

    const now = Date.now();

    for (let t of trips) {
        const deliveryId = t.id;
        const endTime = new Date(t.end_time).getTime();

        // Skip if no end_time
        if (!t.end_time) continue;

        if (now > endTime) {
            const isDelay = await checkIsDelay(deliveryId, t, now);

            if (isDelay) {
                const message = `Delivery delayed of trip: ${t.tracking_code}`;

                // Emit alerts
                io.to(deliveryId).emit("Alert", { message });
                io.emit("Alert", { message });

                // Save alert
                await sql`
                    INSERT INTO "Alerts" (
                        dc_id,
                        trip_id,
                        truck_id,
                        device_id,
                        type,
                        severity,
                        description,
                        triggered_at,
                        created_at
                    )
                    VALUES (
                        ${t.source_dc_id},
                        ${t.id},
                        ${t.truck_id},
                        ${t.device_id ? t.device_id : null},
                        ${"delay"},
                        ${"high"},
                        ${message},
                        NOW(),
                        NOW()
                    )
                `;
            }
        }
    }
};

export{
    tripTracker,
    checkIsDelay,
    checkIsDelayStatus
}
