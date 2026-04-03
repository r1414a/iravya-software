export default function TripTracking() {

  return (
    <div className="h-screen w-full relative">

      {/* MAP */}
      <div className="h-full w-full">
        <MapViewTrip />
      </div>

      {/* BOTTOM CARD */}
      <div className="absolute bottom-0 left-0 right-0 bg-white shadow-xl rounded-t-2xl p-4">

        <div className="flex justify-between">
          <div>
            <p className="text-sm text-gray-500">Driver</p>
            <p className="font-semibold">Ravi Sharma</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Truck</p>
            <p className="font-semibold">MH12AB1234</p>
          </div>
        </div>

        <div className="mt-3 flex justify-between">
          <div>
            <p className="text-sm text-gray-500">ETA</p>
            <p className="font-semibold">18 mins</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Distance</p>
            <p className="font-semibold">12.4 km</p>
          </div>
        </div>

        {/* progress bar */}

        <div className="mt-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-2 bg-green-500 w-2/3"></div>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            Trip progress
          </p>
        </div>

      </div>

    </div>
  )
}