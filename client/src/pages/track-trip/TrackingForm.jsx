// TrackingForm.jsx
// Public tracking page — store manager enters trip ID, sees truck live on real road route
// Uses your existing Mapbox setup (VITE_MAPBOX_TOKEN)
// Styling: white sidebar matches your manage pages — maroon buttons, bg-gray-50 info grids,
//          slate cards, same SectionLabel / DetailRow / checkpoint timeline as your other drawers

import { lazy, useEffect, useRef, useState } from "react";
// import { MOCK_TRIPS } from "@/constants/mock_trip_tracking"
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Navigation,
  Phone,
  Star,
  Truck,
} from "lucide-react";
import { getSocket } from "@/lib/utils/socket";
import { format, formatISO } from "date-fns";
const LiveMap = lazy(() => import("@/pages/track-trip/LiveMap"));
const socket = getSocket();



function formatTime(dateStr) {
  if (!dateStr) return "—";
  return format(new Date(dateStr), "dd MMM, hh:mm a");
}

// ── Shared config (same as your TrackTrip.jsx) ────────────────────────────────
const STATUS_CONFIG = {
  in_transit: {
    label: "In Transit",
    dot: "bg-sky-500",
    badge: "bg-sky-100 text-sky-700",
    bar: "#0ea5e9",
  },
  delayed: {
    label: "Delayed",
    dot: "bg-amber-500",
    badge: "bg-amber-100 text-amber-700",
    bar: "#f59e0b",
  },
  delivered: {
    label: "Delivered",
    dot: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-700",
    bar: "#10b981",
  },
  pending: {
    label: "Pending",
    dot: "bg-violet-500",
    badge: "bg-violet-100 text-violet-700",
    bar: "#8b5cf6",
  },
};

const ISSUE_TYPES = [
  {
    id: "no_contact",
    emoji: "📞",
    label: "Can't reach driver",
    desc: "Not answering calls",
  },
  {
    id: "not_arrived",
    emoji: "⏰",
    label: "Delivery not arrived",
    desc: "Past estimated time",
  },
  {
    id: "wrong_location",
    emoji: "📍",
    label: "Wrong delivery location",
    desc: "Driver at wrong address",
  },
  {
    id: "damaged",
    emoji: "📦",
    label: "Damaged goods concern",
    desc: "Concern about cargo",
  },
  {
    id: "breakdown",
    emoji: "🔧",
    label: "Vehicle breakdown",
    desc: "Driver reported issue",
  },
  { id: "other", emoji: "💬", label: "Other issue", desc: "Describe below" },
];

// ── Fetch real road route via Mapbox Directions API ───────────────────────────
// async function fetchRoadRoute(waypoints) {
//   const token = import.meta.env.VITE_MAPBOX_TOKEN;
//   const coords = waypoints.map(([lat, lng]) => `${lng},${lat}`).join(";");
//   // console.log("Coords:", coords);

//   const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=geojson&overview=full&access_token=${token}`;
//   const res = await fetch(url);
//   const data = await res.json();
//   if (!data.routes?.length) throw new Error("No route found");
//   // Mapbox returns [lng,lat] — convert to [lat,lng]
//   return data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
// }

// ── Interpolate truck position along polyline at fraction 0–1 ─────────────────
// function interpolatePosition(points, fraction) {
//   if (!points?.length) return null
//   if (fraction <= 0) return points[0]
//   if (fraction >= 1) return points[points.length - 1]
//   let total = 0
//   const segs = []
//   for (let i = 1; i < points.length; i++) {
//     const d = Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1])
//     segs.push(d); total += d
//   }
//   let target = total * fraction
//   for (let i = 0; i < segs.length; i++) {
//     if (target <= segs[i]) {
//       const t = target / segs[i]
//       return [
//         points[i][0] + t * (points[i + 1][0] - points[i][0]),
//         points[i][1] + t * (points[i + 1][1] - points[i][1]),
//       ]
//     }
//     target -= segs[i]
//   }
//   return points[points.length - 1]
// }

// ── Small reusable components matching your manage pages exactly ──────────────
function SectionLabel({ children }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
      {children}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between items-start py-2 border-t border-slate-100 text-sm first:border-t-0">
      <span className="text-slate-500 shrink-0 mr-3">{label}</span>
      <span className="text-slate-800 font-medium text-right">{value}</span>
    </div>
  );
}



function calculateProgressFromStops(stops) {
  if (!stops?.length) return 0;

  const completed = stops.filter((s) => s.done).length;
  return completed / stops.length;
}

// ── Mapbox map — drawn once, updated on fraction changes ──────────────────────


// ── Main component ────────────────────────────────────────────────────────────
export default function TrackingForm({ MOCK_TRIPS }) {
  const [tripIdInput, setTripIdInput] = useState("");
  const [activeTripKey, setActiveTripKey] = useState(null);
  const [routePoints, setRoutePoints] = useState([]);
  const [truckPosition, setTruckPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issueNote, setIssueNote] = useState("");
  const [reportDone, setReportDone] = useState(false);
  const [refId] = useState(
    () => `RPT-${Math.floor(Math.random() * 90000 + 10000)}`,
  );
  const intervalRef = useRef(null);
  const [tripData, setTripData] = useState(null);


  console.log("truckPosisiton", truckPosition);

  // const tripData = activeTripKey ? MOCK_TRIPS[activeTripKey] : null
  const statusCfg = tripData ? STATUS_CONFIG["in_transit"] : null;
  // const statusCfg = tripData ? STATUS_CONFIG[tripData.status] : null

  const progress = calculateProgressFromStops(tripData?.checkpoints);
  const pct = Math.round(progress * 100);

  useEffect(() => {
    console.log("socket, effect");

    const onJoined = (data) => {
      console.log("[Socket] Joined:", data.message);
    };
    
    socket.on("joined-successfully", onJoined);
    
    socket.on("location-update", (data) => {
      console.log("LOCATION EVENT RECEIVED:", data);
      if (data?.lat && data?.lng) {
        setTruckPosition([data.lat, data.lng]);
      }
    });

    socket.on("Alert", (data) => {
      console.log("ALERT:", data);
    });

    return () => {
      socket.off("location-update");
      socket.off("Alert");
    };
  }, []);

  const handleTrack = async () => {
    const key = tripIdInput.trim().toUpperCase();
    // console.log(key, MOCK_TRIPS[key]);

    if (!key) {
      setError("Please enter a Trip ID.");
      return;
    }
    // if (!MOCK_TRIPS[key]) {
    //   setError(`No trip found for "${tripIdInput}". Try TRP-001, TRP-002 or TRP-003`); return
    // }

    setLoading(true);
    setRouteLoading(true);
    setError("");
    setRoutePoints([]);
    setActiveTripKey(key);
    setSelectedIssue(null);
    setIssueNote("");
    setReportDone(false);
    if (intervalRef.current) clearInterval(intervalRef.current);

    try {
      socket.emit("join-delivery", { deliveryId: key });

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/driverapp/trip/43f8fa9a-9985-48bc-84df-1a4428b747fc`,
      );
      const result = await res.json();

      if (!result?.data?.length) {
        setError("No active trip found for this ID");
        return;
      }

      const trip = result.data[0];

      // ❗ check status
      if (trip.status !== "in_transit") {
        setError("Trip has not started yet!");
        return;
      }

      // ✅ parse geopath string → array
      let parsedPath = [];
      try {
        parsedPath = JSON.parse(trip.geopath);
      } catch (e) {
        console.error("Invalid geopath", e);
      }

      // ✅ convert [lng,lat] → [lat,lng]
      const route = parsedPath.map(([lng, lat]) => [lat, lng]);

      const mappedTrip = {
        trip: {
          truck: trip.truck.registration_no,
          start: trip.dc.name,
          end: trip.stops[trip.stops.length - 1]?.store?.name,
          type: trip.truck.type,
          capacity: trip.truck.capacity,
          distance: "—", // not provided
          eta: formatTime(trip.stops[0]?.eta),
          speed: "—", // not provided
          currentLocation: "Live tracking",
          startTime: formatTime(trip.departed_at),
          cargo: "General goods",
        },

        driver: {
          name: trip.driver_name,
          phone: trip.driver_phone,
          id: trip.driver_id,
          avatar: trip.driver_name?.[0] || "D",
          rating: 4.5,
          experience: "3 yrs",
          trips: trip.truck.total_trips,
          vehicle: trip.truck.model,
          license: "MH-XX-XXXX",
        },

        checkpoints: [
          {
            name: trip.dc.name,
            time: formatTime(trip.departed_at),
            done: true,
            lat: trip.dc.latitude,
            lng: trip.dc.longitude,
          },
          ...trip.stops.map((s) => ({
            name: s.store.name,
            time: formatTime(s.eta),
            done: !!s.arrived_at,
            lat: s.store.latitude,
            lng: s.store.longitude,
          })),
        ],

        alerts: [],
      };

      // ✅ set states properly
      setTripData(mappedTrip);
      setRoutePoints(route);
      setActiveTripKey(trip.tracking_code);

      // const route = await fetchRoadRoute(MOCK_TRIPS[key].waypoints)
      // setRoutePoints(route)
      // const init = MOCK_TRIPS[key].progressFraction ?? 0.3
      // setFraction(init)

      // if (MOCK_TRIPS[key].status !== "delivered") {
      //   intervalRef.current = setInterval(() => {
      //     setFraction(prev => {
      //       if (prev >= 1) { clearInterval(intervalRef.current); return 1 }
      //       return Math.min(prev + 0.0015, 1)
      //     })
      //   }, 800)
      // }
    } catch {
      setError("Failed to load trip.");
    } finally {
      setLoading(false);
      setRouteLoading(false);
    }
  };

  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    },
    [],
  );

  return (
    <div
      className="flex bg-slate-50 overflow-hidden"
      style={{ height: "calc(100vh - 140px)" }}
    >
      {/* ── LEFT SIDEBAR — white, matches your manage pages ── */}
      <div className="w-125 shrink-0 flex flex-col bg-white border-t border-slate-200 overflow-y-auto">
        {/* Sticky search strip */}
        <div className="px-5 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
            Track shipment
          </p>
          <div className="flex gap-2">
            <input
              value={tripIdInput}
              onChange={(e) => {
                setTripIdInput(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleTrack()}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="e.g. TRP-001"
              className={`flex-1 text-sm px-3 py-2 rounded-lg border-2 outline-none bg-slate-50 text-slate-800 font-mono transition-colors ${focused ? "border-sky-400" : "border-slate-200"
                }`}
            />
            <button
              onClick={handleTrack}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all shrink-0 ${loading
                  ? "bg-slate-400 cursor-wait"
                  : "bg-maroon hover:bg-maroon-dark active:scale-95"
                }`}
            >
              {loading ? (
                <svg
                  className="animate-spin w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    strokeWidth="3"
                    strokeOpacity=".3"
                  />
                  <path
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                "Track"
              )}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
              <AlertTriangle size={11} /> {error}
            </p>
          )}
          <p className="mt-2 text-xs text-slate-400">
            Try: <span className="font-mono text-slate-500">TRP-001</span>
            {" · "}
            <span className="font-mono text-slate-500">TRP-002</span>
            {" · "}
            <span className="font-mono text-slate-500">TRP-003</span>
          </p>
        </div>

        {/* Empty state */}
        {!tripData && !routeLoading && (
          <div className="flex flex-col items-center justify-center flex-1 text-slate-400 px-10 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Navigation size={24} className="text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-600 mb-1">
              Track your delivery
            </p>
            <p className="text-xs leading-relaxed">
              Enter a Trip ID to see the truck moving on the road in real time
            </p>
          </div>
        )}

        {/* Route loading state */}
        {routeLoading && (
          <div className="flex flex-col items-center justify-center flex-1 gap-3">
            <svg
              className="animate-spin w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle cx="12" cy="12" r="10" stroke="#e2e8f0" strokeWidth="3" />
              <path
                d="M12 2a10 10 0 0 1 10 10"
                stroke="#701a40"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <p className="text-sm text-slate-500 font-medium">
              Loading road route…
            </p>
          </div>
        )}

        {tripData && !routeLoading && (
          <div className="divide-y divide-slate-100">
            {/* Trip badge + status */}
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-maroon/10 flex items-center justify-center shrink-0">
                  <Truck size={16} className="text-maroon" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900">
                    {tripData?.trip?.truck || "-"}
                  </p>
                  <p className="text-xs text-slate-400 font-mono">
                    {activeTripKey}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusCfg.badge}`}
                >
                  {statusCfg.label}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="px-5 py-4">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                <span>🏭 {tripData?.trip?.start?.split(",")[0]}</span>
                <span className="font-semibold text-slate-700">{pct}%</span>
                <span>{tripData.trip.end?.split(",")[0]} 🏪</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: statusCfg.bar }}
                />
              </div>
              <div className="flex gap-3 mt-3">
                {[
                  {
                    label: "Speed",
                    value: pct >= 100 ? "0 km/h" : tripData?.trip?.speed,
                  },
                  { label: "ETA", value: tripData?.trip?.eta },
                  { label: "Distance", value: tripData?.trip?.distance },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex-1 bg-gray-50 border border-gray-100 rounded-lg p-2 text-center"
                  >
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                      {label}
                    </p>
                    <p className="text-xs font-semibold text-gray-800 mt-0.5">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts */}
            {tripData.alerts?.length > 0 && (
              <div className="px-5 py-3 bg-amber-50">
                {tripData.alerts.map((a, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 text-xs text-amber-800 ${i > 0 ? "mt-1.5" : ""}`}
                  >
                    <AlertTriangle size={11} className="shrink-0" /> {a}
                  </div>
                ))}
              </div>
            )}

            {/* Driver — avatar + info grid + call button */}
            <div className="px-5 py-4">
              <SectionLabel>Driver</SectionLabel>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg,rgb(214 154 58),rgb(180 120 30))",
                  }}
                >
                  {tripData.driver.avatar}
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900">
                    {tripData.driver.name}
                  </p>
                  <p className="text-xs text-slate-400 font-mono">
                    {tripData.driver.id}
                  </p>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={10}
                        className={
                          i <= Math.floor(tripData.driver.rating)
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-200 fill-slate-200"
                        }
                      />
                    ))}
                    <span className="text-xs text-slate-400 ml-1">
                      {tripData.driver.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Same bg-gray-50 border-gray-100 rounded-lg grid as your manage pages */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  { label: "Experience", value: tripData.driver.experience },
                  {
                    label: "Total trips",
                    value: tripData.driver.trips.toLocaleString(),
                  },
                  { label: "Vehicle", value: tripData.driver.vehicle },
                  {
                    label: "License",
                    value: tripData.driver.license?.slice(0, 14),
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="bg-gray-50 border border-gray-100 rounded-lg p-2.5"
                  >
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">
                      {label}
                    </p>
                    <p className="text-xs font-medium text-gray-800">{value}</p>
                  </div>
                ))}
              </div>

              <a
                href={`tel:${tripData.driver.phone}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 text-sm font-semibold hover:bg-sky-100 transition-colors"
              >
                <Phone size={13} /> {tripData.driver.phone}
              </a>
            </div>

            {/* Trip details */}
            <div className="px-5 py-4">
              <SectionLabel>Trip details</SectionLabel>
              <DetailRow
                label="📦 Vehicle"
                value={`${tripData.trip.type} · ${tripData.trip.capacity}`}
              />
              <DetailRow label="🟢 From" value={tripData.trip.start} />
              <DetailRow label="🔴 To" value={tripData.trip.end} />
              <DetailRow label="📍 Now" value={tripData.trip.currentLocation} />
              <DetailRow label="🕐 Departed" value={tripData.trip.startTime} />
              <DetailRow label="⏱ ETA" value={tripData.trip.eta} />
              <DetailRow label="📏 Distance" value={tripData.trip.distance} />
              <DetailRow label="📦 Cargo" value={tripData.trip.cargo} />
            </div>

            {/* Checkpoints — same timeline dot pattern as your TripDetailSheet */}
            <div className="px-5 py-4">
              <SectionLabel>Checkpoints</SectionLabel>
              <div className="flex flex-col">
                {tripData.checkpoints?.map((cp, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full border-2 mt-1 shrink-0 ${cp.done
                            ? "border-green-500 bg-green-500"
                            : "border-gray-300 bg-white"
                          }`}
                      />
                      {i < tripData.checkpoints.length - 1 && (
                        <div
                          className={`w-px flex-1 my-0.5 ${cp.done ? "bg-green-300" : "bg-gray-200"}`}
                        />
                      )}
                    </div>
                    <div className="pb-3 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${cp.done ? "text-slate-800" : "text-slate-400"}`}
                      >
                        {cp.name}
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock size={9} /> {cp.time}
                        {cp.done && (
                          <CheckCircle2
                            size={10}
                            className="text-green-500 ml-1"
                          />
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Report issue — same border-pink-800 style as your original */}
            <div className="px-5 py-4">
              <SectionLabel>Report an issue</SectionLabel>
              {reportDone ? (
                <div className="text-center py-6">
                  <div className="text-4xl mb-3">✅</div>
                  <p className="font-bold text-sm text-slate-900 mb-1">
                    Issue Reported
                  </p>
                  <p className="text-xs text-slate-500 mb-4">
                    Our team will respond within 30 minutes.
                  </p>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-mono text-slate-600 mb-4 inline-block">
                    Ref: {refId}
                  </div>
                  <button
                    onClick={() => {
                      setReportDone(false);
                      setSelectedIssue(null);
                      setIssueNote("");
                    }}
                    className="block w-full py-2.5 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Report Another Issue
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-xs text-slate-500 mb-3">
                    Select the issue you're experiencing:
                  </p>
                  <div className="flex flex-col gap-1.5 mb-3">
                    {ISSUE_TYPES.map((issue) => (
                      <button
                        key={issue.id}
                        onClick={() => setSelectedIssue(issue.id)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 text-left transition-all ${selectedIssue === issue.id
                            ? "border-pink-800 bg-pink-50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                      >
                        <span className="text-lg shrink-0">{issue.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800">
                            {issue.label}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {issue.desc}
                          </p>
                        </div>
                        {selectedIssue === issue.id && (
                          <div className="w-4 h-4 rounded-full bg-pink-800 flex items-center justify-center shrink-0">
                            <span className="text-white text-[9px] font-bold">
                              ✓
                            </span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  {selectedIssue && (
                    <textarea
                      value={issueNote}
                      onChange={(e) => setIssueNote(e.target.value)}
                      placeholder="Additional details (optional)…"
                      rows={2}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-pink-300 bg-slate-50 text-slate-800 resize-none outline-none mb-3"
                    />
                  )}
                  <button
                    onClick={() => selectedIssue && setReportDone(true)}
                    disabled={!selectedIssue}
                    className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all ${selectedIssue
                        ? "bg-maroon hover:bg-maroon-dark text-white active:scale-98"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                  >
                    Submit Report
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT — full height Mapbox map ── */}
      <div className="flex-1 relative">
        {/* Map legend — bottom right */}
        {tripData && !routeLoading && (
          <div className="absolute bottom-5 right-5 z-10 bg-white rounded-xl border border-slate-200 shadow-md px-4 py-3 text-xs space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-1.5 rounded-full bg-green-600 inline-block" />
              <span className="text-slate-600">Route covered</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="24" height="6">
                <line
                  x1="0"
                  y1="3"
                  x2="24"
                  y2="3"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                />
              </svg>
              <span className="text-slate-600">Remaining</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base">🏭</span>
              <span className="text-slate-600">Data center</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base">🏪</span>
              <span className="text-slate-600">Store</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base">🚛</span>
              <span className="text-slate-600">Truck (live)</span>
            </div>
          </div>
        )}

        {/* Route loading overlay on map */}
        {routeLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 gap-3">
            <svg
              className="animate-spin w-10 h-10"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle cx="12" cy="12" r="10" stroke="#e2e8f0" strokeWidth="3" />
              <path
                d="M12 2a10 10 0 0 1 10 10"
                stroke="#701a40"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <p className="text-sm font-medium text-slate-500">
              Fetching road route from Mapbox…
            </p>
          </div>
        )}

        {/* Map — key forces remount on new trip so layers don't bleed */}
        <LiveMap
          key={activeTripKey ?? "idle"}
          routePoints={routePoints}
          truckPosition={truckPosition}
          tripData={tripData}
        />
      </div>
    </div>
  );
}
