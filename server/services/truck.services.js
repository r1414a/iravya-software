import sql from "../db/database.js"
import ApiError from "../utils/ApiError.js"

const addTruckservice = async(data)=>{
    const {registration_no, model, type, capacity, registration_cert, insurance_doc, PUC_cert} = data
    
}

export{
    addTruckservice
}