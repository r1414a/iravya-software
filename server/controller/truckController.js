import asyncHandler from "../utils/asyncHandler.js"
import  ApiError  from "../utils/ApiError.js";
import sendResponse from "../utils/sendResponse.js";
import { addTruckservice , 
    uploadFile,
    truckExistByRegNoService,
    getTruckDataService,
    updateTruckDataService,
    truckExistByIDService,
    deleteTruckService,
    getRecentTripDetailsService,
    getTripHistoryService,
    getAllTruckDataService
} from "../services/truck.services.js";



const addTruck = asyncHandler(async (req, res) => {

    const isTruckExist = await truckExistByRegNoService(
        req.body.registration_no
    )

    if (isTruckExist) {
        return sendResponse(
            res,
            200,
            { is_exist: isTruckExist },
            "Truck already exists"
        )
    }

    const registration_cert = req.files?.registration_cert
        ? await uploadFile(req.files.registration_cert[0], "Truck")
        : null

    const insurance_doc = req.files?.insurance_doc
        ? await uploadFile(req.files.insurance_doc[0], "Truck")
        : null

    const PUC_cert = req.files?.PUC_cert
        ? await uploadFile(req.files.PUC_cert[0], "Truck")
        : null

    const truck = await addTruckservice({
        ...req.body,
        registration_cert,
        insurance_doc,
        PUC_cert
    })


    return sendResponse(
        res,
        200,
        truck,
        "Truck added successfully"
    )

})


const getTrukData = asyncHandler(async (req, res) => {
    const {id} = req.params
    const truck = await getTruckDataService(id)
    // console.log(truck)
    if(truck){
        sendResponse(res, 201, truck, "Truck data found")
    }
    else{
        throw new ApiError( 400, "Could not find truck data" )
    }
})

const updateTruckData = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const isTruckExist = await truckExistByIDService(id);

    if (!isTruckExist) {
        return sendResponse(
            res,
            400,
            { is_exist: isTruckExist },
            "Truck data is not added"
        );
    }

    const registration_cert = req.files?.registration_cert
        ? await uploadFile(req.files.registration_cert[0], "Truck")
        : undefined;

    const insurance_doc = req.files?.insurance_doc
        ? await uploadFile(req.files.insurance_doc[0], "Truck")
        : undefined;

    const PUC_cert = req.files?.PUC_cert
        ? await uploadFile(req.files.PUC_cert[0], "Truck")
        : undefined;

    const truck = await updateTruckDataService(id, {
        ...req.body,
        registration_cert,
        insurance_doc,
        PUC_cert,
    });

    return sendResponse(
        res,
        200,
        truck,
        "Truck updated successfully"
    );
});

const deleteTruck = asyncHandler(async (req, res) => {
    const {id} = req.params
    const truck = await deleteTruckService(id)
    if(truck){
        sendResponse(res, 200, truck, "Truck data is deleted successfully")
    }
    else{
        throw new ApiError( 400, "Could not find truck data" )
    }
})

const getRecentTripDetails = async(req, res)=>{
    const{trip_id} = req.params
 
    const data = await getRecentTripDetailsService(trip_id)
    if(data){
        sendResponse(res, 201, data, "Found Data")
    }
    else{
        throw new ApiError(400, "Data not found")
    }
}

const getTripHistory = asyncHandler(async(req, res)=>{
    const {id} = req.params
    const trips = await getTripHistoryService(id)

    if (trips.length > 0) {
    sendResponse(res, 200, trips, "Found Data")
} else {
    throw new ApiError(404, "No trip history found")
}
})

const getAllTruckData = asyncHandler(async (req, res) => {
    const { type, status, search, page = 1, 
        limit = 10  } = req.query

    const user_id = req.user.id
    console.log(user_id)

    const trucks = await getAllTruckDataService({
        type: type || null,
        truck_status : status || null,
        search : search || null,
        page: Number(page),
        limit: Number(limit),
        user_id: user_id
    })

    return sendResponse(
        res,
        200,
        trucks,
        "Truck list fetched successfully"
    )
})
 


export{
    addTruck,
    getTrukData,
    updateTruckData,
    deleteTruck,
    getRecentTripDetails,
    getTripHistory,
    getAllTruckData
}