export const getCoordinatesFromAddress = async (address) => {
    try {
        const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?country=in&access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
        );

        const data = await res.json();

        if (!data.features || data.features.length === 0) {
            throw new Error("Address not found");
        }

        const [lng, lat] = data.features[0].center;

        return { lat, lng };
    } catch (err) {
        console.error("Geocoding error:", err);
        throw err;
    }
};