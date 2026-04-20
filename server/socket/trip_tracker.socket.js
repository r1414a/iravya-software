import sql from "../db/database.js"
import * as turf from '@turf/turf';
import axios from "axios";
// import mbxClient from "@mapbox/mapbox-sdk";
// import mbxMatching from "@mapbox/mapbox-sdk/services/match";
// import mbxClient from '@mapbox/mapbox-sdk';
// import mbxMatching from '@mapbox/mapbox-sdk/services/match'; // Corrected import path

// const baseClient = mbxClient({ accessToken: process.env.VITE_MAPBOX_TOKEN });
// const matchingService = mbxMatching(baseClient);

async function getCleanedPath(coordinates) {
    // const response = await matchingService.getMatching({
    //     points: coordinates.map(c => ({ coordinates: c })),
    //     profile: 'driving',
    //     geometries: 'geojson'
    // }).send();

    // return response.body.matchings[0].geometry; // Returns a cleaned LineString
    const coordsString = coordinates
        .map(c => `${c[0]},${c[1]}`)
        .join(";");
    const response = await fetch(
        `https://api.mapbox.com/matching/v5/mapbox/driving/${coordsString}?geometries=geojson&access_token=${process.env.VITE_MAPBOX_TOKEN}`
    );
    const data = await response.json();
    return data.matchings[0].geometry;
}

function checkDeviation(truckPos, route, threshold = 50) {
    // Find the point on the route closest to the truck
    const snapped = turf.pointOnLine(route, truckPos);
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
    console.log("Address:", address);

};

const tripTracker = (socket, io) =>{
    socket.on("join-delivery", ({ deliveryId }) => {
        console.log(`join ${deliveryId}`);
        socket.join(deliveryId);
        
        socket.emit("joined-successfully", {
            message: `You have joined delivery room: ${deliveryId}`,
            deliveryId: deliveryId
        });
    });

    socket.on("get-location", async(data)=>{
        const {lng, lat, deliveryId} = data

        console.log(lng, lat, deliveryId);
        const trip = await sql`
            UPDATE "Trips"
            SET status = 'in_transit',
                end_time = NOW()
            WHERE id = ${deliveryId};
            RETURNING *
        `;

        await sql`
            UPDATE "Trucks" t
            SET status = 'on_trip'
            FROM "Trips" tr
            WHERE tr.truck_id = t.id
            AND tr.id = ${deliveryId};
        `;

        await sql`
            UPDATE "Drivers" d
            SET status = 'available'
            FROM "Trips" tr
            WHERE tr.driver_id = d.id
            AND tr.id = ${deliveryId};
        `;

        io.to(deliveryId).emit("location-update", {
            lat,
            lng
        });
    })

    socket.on("get-updated-location", async(data)=>{
        const {lng, lat, deliveryId, speed} = data
        
        console.log(lng, lat, deliveryId);

        const trip = await sql`
            SELECT * FROM "Trips"
            WHERE id = ${deliveryId}
        `

        const truckLocation = turf.point([lng, lat]);
        const geopath = await getCleanedPath(trip.geopath)
        const {deviated, distance} = checkDeviation(truckLocation, geopath)
        const location_name = getLocation(lng, lat)
        if(deviated){
            const alert = await sql `
            INSERT INTO "Alerts" (
                brand_id,
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
                ${trip.brand_id},
                ${trip.trip_id},
                ${trip.truck_id},
                ${trip.device_id},
                ${"route_deviation"},
                ${"high"},
                ${`Route deviation by ${distance}m at ${location_name}`},
                ${lat},
                ${lng},
                false,
                false,
                NOW(),
                NOW()
            )
            `;
            socket.emit("Alert", {
                message: `Route deviation by ${distance}m at ${location_name}`,
                deliveryId: deliveryId,
                tracking_code: trip.tracking_code
            });

            io.to(deliveryId).emit("location-update", {
                lat,
                lng,
                message: `Route deviation by ${distance}m at ${location_name}`,
                deliveryId: deliveryId,
                tracking_code: trip.tracking_code
            });
            
        }

        if(speed > trip.speed){
            const alert = await sql `
            INSERT INTO "Alerts" (
                brand_id,
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
                ${trip.brand_id},
                ${trip.trip_id},
                ${trip.truck_id},
                ${trip.device_id},
                ${"speeding"},
                ${"high"},
                ${`speeding by ${Math.abs(speed-trip.speed)} at ${location_name}`},
                ${lat},
                ${lng},
                false,
                false,
                NOW(),
                NOW()
            )
            `;
            socket.emit("Alert", {
                message: `speeding by ${Math.abs(speed-trip.speed)} at ${location_name}`,
                deliveryId: deliveryId,
                tracking_code: trip.tracking_code
            });

            io.to(deliveryId).emit("location-update", {
                lat,
                lng,
                message: `speeding by ${Math.abs(speed-trip.speed)} at ${location_name}`,
                deliveryId: deliveryId,
                tracking_code: trip.tracking_code
            });
        }
        io.to(deliveryId).emit("location-update", {
            lat,
            lng
        });
    })

}

export{
    tripTracker
}