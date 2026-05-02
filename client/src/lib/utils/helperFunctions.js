import { CheckCircle2, Clock, MapPin, Route, Truck, Users } from "lucide-react";

export function generateStrongPassword(length = 12) {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const special = "!@#$%^&*()_+";

    const all = upper + lower + numbers + special;

    let password = [
        upper[Math.floor(Math.random() * upper.length)],
        lower[Math.floor(Math.random() * lower.length)],
        numbers[Math.floor(Math.random() * numbers.length)],
        special[Math.floor(Math.random() * special.length)],
    ];

    for (let i = password.length; i < length; i++) {
        password.push(all[Math.floor(Math.random() * all.length)]);
    }

    // Shuffle password (important!)
    return password
        .sort(() => Math.random() - 0.5)
        .join("");
}

export function getNameInitials(fname, lname) {
    return `${fname.charAt(0)}${lname.charAt(0)}`
}

export function getPasswordStrength(password) {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return "Weak";
    if (strength === 3 || strength === 4) return "Medium";
    return "Strong";
}

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

// export const getStatsDataInFormat = (data) => {
//     if (!data) return [];
//     const totalTrip = data.totalTrip?.[0] || {};
//     const avgTripTime = data.avgTripTime?.[0] || {};
//     const trucks = data.trucks?.[0] || {};
//     const drivers = data.drivers?.[0] || {};
//     const deliveryRate = data.deliveryRate?.[0] || {};
//     const stores = data.stores?.[0] || {};

//     return [
//         {
//             label: "Total trips",
//             value: Number(totalTrip.current || 0),
//             sub: `${Number(totalTrip.percentchange || 0)}% vs last month`,
//             trend: totalTrip.trend,
//             icon: Route,
//             color: "border-t-slate-800",
//             iconBg: "bg-slate-700",
//         },
//         {
//             label: "Active right now",
//             value: Number(trucks.intransit || 0),
//             sub: `${Number(trucks.intransit || 0)} trucks in transit`,
//             trend: null,
//             icon: Truck,
//             color: "border-t-sky-700",
//             iconBg: "bg-sky-600",
//         },
//         {
//             label: "Delivery rate",
//             value: `${Number(deliveryRate.current || 0)}%`,
//             sub: `${Number(deliveryRate.percentchange || 0)}% vs last month`,
//             trend: deliveryRate.trend,
//             icon: CheckCircle2,
//             color: "border-t-green-700",
//             iconBg: "bg-green-600",
//         },
//         {
//             label: "Avg trip time",
//             value: `${Math.round(Number(avgTripTime.current || 0) / 60)} min`,
//             sub: `${Math.round(Number(avgTripTime.percentchange || 0))}% vs last month`,
//             trend: avgTripTime.trend,
//             icon: Clock,
//             color: "border-t-violet-700",
//             iconBg: "bg-violet-600",
//         },
//         {
//             label: "Active drivers",
//             value: Number(drivers.active || 0),
//             sub: `${Number(drivers.ontrip || 0)} on trip today`,
//             trend: null,
//             icon: Users,
//             color: "border-t-amber-700",
//             iconBg: "bg-amber-600",
//         },
//         {
//             label: "Total deliveries",
//             value: Number(stores.deliveries || 0),
//             sub: `across ${Number(stores.served || 0)} stores`,
//             trend: null,
//             icon: MapPin,
//             color: "border-t-cyan-700",
//             iconBg: "bg-cyan-600",
//         },
//     ];
// }

// export const getLast5Years = () => {
//   const currentYear = new Date().getFullYear();
//   return Array.from({ length: 5 }, (_, i) => currentYear - i);
// };

// export const getDatesInMonth = (year, month) => {
//   if (!year || !month) return [];

//   const days = new Date(year, month, 0).getDate();

//   return Array.from({ length: days }, (_, i) => {
//     const day = i + 1;
//     const value = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
//     return {
//       label: day,
//       value: day,
//     };
//   });
// };


// utils/analyticsHelpers.js (Updated)

export const getStatsDataInFormat = (data) => {
    if (!data) return [];
    const totalTrip = data.totalTrip?.[0] || {};
    const avgTripTime = data.avgTripTime?.[0] || {};
    const trucks = data.trucks?.[0] || {};
    const drivers = data.drivers?.[0] || {};
    const deliveryRate = data.deliveryRate?.[0] || {};
    const stores = data.stores?.[0] || {};

    return [
        {
            label: "Total trips",
            value: Number(totalTrip.current || 0),
            sub: `${Number(totalTrip.percentchange || 0)}% vs last month`,
            trend: totalTrip.trend,
            icon: Route,
            color: "border-t-slate-800",
            iconBg: "bg-slate-700",
        },
        {
            label: "Active right now",
            value: Number(trucks.intransit || 0),
            sub: `${Number(trucks.intransit || 0)} trucks in transit`,
            trend: null,
            icon: Truck,
            color: "border-t-sky-700",
            iconBg: "bg-sky-600",
        },
        {
            label: "Delivery rate",
            value: `${Number(deliveryRate.current || 0)}%`,
            sub: `${Number(deliveryRate.percentchange || 0)}% vs last month`,
            trend: deliveryRate.trend,
            icon: CheckCircle2,
            color: "border-t-green-700",
            iconBg: "bg-green-600",
        },
        {
            label: "Avg trip time",
            value: `${Math.round(Number(avgTripTime.current || 0) / 60)} min`,
            sub: `${Math.round(Number(avgTripTime.percentchange || 0))}% vs last month`,
            trend: avgTripTime.trend,
            icon: Clock,
            color: "border-t-violet-700",
            iconBg: "bg-violet-600",
        },
        {
            label: "Active drivers",
            value: Number(drivers.active || 0),
            sub: `${Number(drivers.ontrip || 0)} on trip today`,
            trend: null,
            icon: Users,
            color: "border-t-amber-700",
            iconBg: "bg-amber-600",
        },
        {
            label: "Total deliveries",
            value: Number(stores.deliveries || 0),
            sub: `across ${Number(stores.served || 0)} stores`,
            trend: null,
            icon: MapPin,
            color: "border-t-cyan-700",
            iconBg: "bg-cyan-600",
        },
    ];
}

export const getLast5Years = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - i);
};

export const getDatesInMonth = (year, month) => {
    if (!year || !month) return [];

    const days = new Date(year, month, 0).getDate();

    return Array.from({ length: days }, (_, i) => {
        const day = i + 1;
        return {
            label: `${day}`,
            value: `${day}`,
        };
    });
};

// Helper to get X-axis key based on filter granularity
export const getXAxisKey = (filters) => {
    if (filters.date) return "hour";     // specific date → hourly data
    if (filters.month) return "day";     // month selected → daily data
    return "month";                      // only year → monthly data
};

// Helper to format X-axis labels based on granularity
export const formatXAxisLabel = (value, filters) => {
    if (filters.date) {
        // Hour format: "12 AM", "1 PM", etc.
        const hour = parseInt(value);
        if (hour === 0) return "12 AM";
        if (hour < 12) return `${hour} AM`;
        if (hour === 12) return "12 PM";
        return `${hour - 12} PM`;
    }
    if (filters.month) {
        // Day format: "1", "2", "3", etc.
        return value;
    }
    // Month format: "Jan", "Feb", etc.
    return value;
};

// Helper to check if graph data exists
export const hasGraphData = (data) => {
    if (!data || !Array.isArray(data)) return false;

    return data.some(item => {
        const scheduled = Number(item.scheduled || 0);
        const completed = Number(item.completed || 0);
        const cancelled = Number(item.cancelled || 0);
        const inTransit = Number(item.in_transit || 0);

        return scheduled > 0 || completed > 0 || cancelled > 0 || inTransit > 0;
    });
};

export const hasDCData = (data) => {
    if (!Array.isArray(data) || data.length === 0) return false;

    return data.some(item =>
        Number(item.completed) > 0 ||
        Number(item.in_transit) > 0
    );
};