export const MOCK_TRIPS = {
  "TRP-001": {
    driver: {
      name: "Rajesh Kumar",
      id: "DRV-4821",
      phone: "+91 98765 43210",
      license: "MH12-2019-0045321",
      avatar: "RK",
      rating: 4.8,
      trips: 1240,
      experience: "8 years",
      vehicle: "Heavy Freight"
    },
    trip: {
      truck: "MH-12-AB-4567",
      type: "Heavy Freight",
      capacity: "20 Tons",
      start: "Pune Logistics Hub, Pimpri-Chinchwad",
      end: "Phoenix Marketcity, Pune",
      startTime: "06:30 AM",
      eta: "11:00 AM",
      distance: "24 km",
      status: "in_transit",
      progress: 62,
      currentLocation: "Yerawada, Pune",
      speed: "42 km/h",
      fuel: 68,
      temp: "22°C",
      cargo: "Apparel"
    },

    route: [
      { lat: 18.6298, lng: 73.7997, label: "Pune DC" },
      { lat: 18.6205, lng: 73.8152, label: "Nigdi" },
      { lat: 18.6102, lng: 73.8325, label: "Akurdi" },
      { lat: 18.5988, lng: 73.8503, label: "Shivajinagar" },
      { lat: 18.5860, lng: 73.8720, label: "Bund Garden" },
      { lat: 18.5775, lng: 73.8921, label: "Yerawada", current: true },
      { lat: 18.5679, lng: 73.9143, label: "Phoenix Store" }
    ],

    actualRoute: [
      { lat: 18.6298, lng: 73.7997 },
      { lat: 18.6205, lng: 73.8152 },
      { lat: 18.6102, lng: 73.8325 },
      { lat: 18.5988, lng: 73.8503 },
      { lat: 18.5860, lng: 73.8720 },
      { lat: 18.5775, lng: 73.8921 }
    ],

    alerts: ["Truck delayed near Shivajinagar"]
  }
};