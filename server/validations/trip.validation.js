import { body } from "express-validator"
const addTripValidator = [

    body("truck")
        .trim()
        .notEmpty().withMessage("Truck is required")
        .isUUID().withMessage("Truck must be valid UUID"),

    // body("gps_device")
    //     .trim()
    //     .notEmpty().withMessage("GPS device is required")
    //     .isUUID().withMessage("GPS device must be valid UUID"),

    body("driver")
        .trim()
        .notEmpty().withMessage("Driver is required")
        .isUUID().withMessage("Driver must be valid UUID"),

    body("departure")
        .optional()
        .trim()
        .isISO8601()
        .withMessage("Departure must be valid datetime"),

    body("delivery_stops")
        .isArray({ min: 1 })
        .withMessage("Delivery stops must be a non empty array"),

    body("delivery_stops.*.store_id")
        .trim()
        .notEmpty()
        .withMessage("Store id is required")
        .isUUID()
        .withMessage("Store id must be valid UUID"),

    body("delivery_stops.*.longitude")
        .notEmpty()
        .withMessage("Longitude required")
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude must be valid")
        .toFloat(),

    body("delivery_stops.*.latitude")
        .notEmpty()
        .withMessage("Latitude required")
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude must be valid")
        .toFloat(),

    
]

const UpdateTripValidator = [

    body("truck")
        .trim()
        .isUUID().withMessage("Truck must be valid UUID"),

    // body("gps_device")
    //     .trim()
    //     .notEmpty().withMessage("GPS device is required")
    //     .isUUID().withMessage("GPS device must be valid UUID"),

    body("driver")
        .trim()
        .isUUID().withMessage("Driver must be valid UUID"),

    body("departure")
        .optional()
        .trim()
        .isISO8601()
        .withMessage("Departure must be valid datetime"),

    body("delivery_stops")
        .isArray()
        .withMessage("Delivery stops must be a non empty array"),

    body("delivery_stops.*.store_id")
        .trim()
        .isUUID()
        .withMessage("Store id must be valid UUID"),

    body("delivery_stops.*.longitude")
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude must be valid")
        .toFloat(),

    body("delivery_stops.*.latitude")
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude must be valid")
        .toFloat(),


]

export{
    addTripValidator,
    UpdateTripValidator
}