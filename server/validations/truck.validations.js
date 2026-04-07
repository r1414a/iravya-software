import { body } from "express-validator"

const allowedTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg"
]

const validateFile = (file, name) => {
  if (!file)
    throw new Error(`${name} is required`)

  if (!allowedTypes.includes(file[0].mimetype))
    throw new Error(`Invalid ${name} format`)
}

const validateUpdate = (file, name) => {

  if (!allowedTypes.includes(file[0].mimetype))
    throw new Error(`Invalid ${name} format`)
}
const addTruckValidation = [

    body("registration_no")
        .notEmpty()
        .withMessage("Registration number required")
        .matches(/^[A-Z0-9-]+$/i)
        .withMessage("Invalid registration number"),

    body("model")
        .notEmpty()
        .withMessage("Model required")
        .isLength({ min: 2 }),

    body("type")
        .notEmpty()
        .withMessage("Type required"),

    body("capacity")
        .notEmpty()
        .withMessage("Capacity required")
        .isInt({ min: 100 })
        .withMessage("Invalid capacity"),
    
    body().custom((value, { req }) => {

        validateFile(req.files?.registration_cert, "Registration certificate")
        validateFile(req.files?.insurance_doc, "Insurance document")
        validateFile(req.files?.PUC_cert, "PUC certificate")

        return true
    })


]


const updateTruckValidation = [

    body("registration_no")
        .notEmpty()
        .withMessage("Registration number required")
        .matches(/^[A-Z0-9-]+$/i)
        .withMessage("Invalid registration number"),

    body("model")
        .notEmpty()
        .withMessage("Model required")
        .isLength({ min: 2 }),

    body("type")
        .notEmpty()
        .withMessage("Type required"),

    body("capacity")
        .notEmpty()
        .withMessage("Capacity required")
        .isInt({ min: 100 })
        .withMessage("Invalid capacity"),
    
    body().custom((value, { req }) => {

        validateUpdate(req.files?.registration_cert, "Registration certificate")
        validateUpdate(req.files?.insurance_doc, "Insurance document")
        validateUpdate(req.files?.PUC_cert, "PUC certificate")

        return true
    })


]

export{
    addTruckValidation,
    updateTruckValidation
}
