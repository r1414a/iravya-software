import { useEffect, useRef, useState } from "react";
import LiveTruckMap from "@/pages/track_trip/LiveTruckMap";
import { MOCK_TRIPS, STATUS_CONFIG } from "@/constants/mock_trip_tracking";

// ------------------------
// Fetch route from Mapbox Directions API
// ------------------------
async function fetchRoadRoute(waypoints) {
  const accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

  const coordinates = waypoints
    .map(([lat, lng]) => `${lng},${lat}`)
    .join(";");

  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&overview=full&access_token=${accessToken}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.routes || !data.routes.length) {
    throw new Error("No route found");
  }
console.log(data);

  return data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
}

// ------------------------
// Interpolate truck position along route
// ------------------------
function interpolatePosition(points, fraction) {
  if (!points.length) return null;
  if (fraction <= 0) return points[0];
  if (fraction >= 1) return points[points.length - 1];

  let totalLength = 0;
  const segments = [];

  for (let i = 1; i < points.length; i++) {
    const dist = Math.hypot(
      points[i][0] - points[i - 1][0],
      points[i][1] - points[i - 1][1]
    );
    segments.push(dist);
    totalLength += dist;
  }

  let target = totalLength * fraction;

  for (let i = 0; i < segments.length; i++) {
    if (target <= segments[i]) {
      const t = target / segments[i];
      return [
        points[i][0] + t * (points[i + 1][0] - points[i][0]),
        points[i][1] + t * (points[i + 1][1] - points[i][1]),
      ];
    }
    target -= segments[i];
  }

  return points[points.length - 1];
}

function SectionTitle({ children }) {
  return (
    <div
      style={{
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "#94a3b8",
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "8px 0",
        borderTop: "1px solid #1e293b",
        fontSize: 13,
      }}
    >
      <span style={{ color: "#94a3b8" }}>{label}</span>
      <span style={{ color: "#e2e8f0", fontWeight: 600, textAlign: "right" }}>
        {value}
      </span>
    </div>
  );
}

export default function TrackingForm() {
  const [tripIdInput, setTripIdInput] = useState("");
  const [activeTripKey, setActiveTripKey] = useState(null);
  const [routePoints, setRoutePoints] = useState([]);
  const [fraction, setFraction] = useState(0);
  const [loading, setLoading] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const [error, setError] = useState("");

  const intervalRef = useRef(null);

  const tripData = activeTripKey ? MOCK_TRIPS[activeTripKey] : null;
  const statusCfg = tripData ? STATUS_CONFIG[tripData.status] : null;

  const truckPos = routePoints.length
    ? interpolatePosition(routePoints, fraction)
    : null;

  const startPoint = routePoints[0];
  const endPoint = routePoints[routePoints.length - 1];

  const handleTrack = async () => {
    const key = tripIdInput.trim().toUpperCase();

    if (!key) {
      setError("Please enter Trip ID");
      return;
    }

    if (!MOCK_TRIPS[key]) {
      setError("Trip not found. Try TRP-001 / TRP-002 / TRP-003");
      return;
    }

    setLoading(true);
    setRouteLoading(true);
    setError("");
    setRoutePoints([]);
    setFraction(0);
    setActiveTripKey(key);

    if (intervalRef.current) clearInterval(intervalRef.current);

    try {
      const route = await fetchRoadRoute(MOCK_TRIPS[key].waypoints);
      setRoutePoints(route);

      const initialProgress = MOCK_TRIPS[key].progressFraction;
      setFraction(initialProgress);

      if (MOCK_TRIPS[key].status !== "delivered") {
        intervalRef.current = setInterval(() => {
          setFraction((prev) => {
            if (prev >= 1) {
              clearInterval(intervalRef.current);
              return 1;
            }
            return Math.min(prev + 0.002, 1);
          });
        }, 1000);
      }
    } catch (err) {
      setError("Failed to fetch route from Mapbox");
    } finally {
      setLoading(false);
      setRouteLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div
    className="flex bg-[#020817] text-[#e2e8f0] h-[85vh]"
    >
      {/* Sidebar */}
      <div
        style={{
          width: 360,
          background: "#0f172a",
          borderRight: "1px solid #1e293b",
          padding: 20,
          overflowY: "auto",
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>
          🚛 Live Fleet Tracker
        </h2>

        {/* Search */}
        <div style={{ marginBottom: 20 }}>
          <SectionTitle>Track Shipment</SectionTitle>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              value={tripIdInput}
              onChange={(e) => {
                setTripIdInput(e.target.value);
                setError("");
              }}
              placeholder="e.g. TRP-001"
              style={{
                flex: 1,
                padding: "12px 14px",
                borderRadius: 10,
                border: "1px solid #334155",
                background: "#020617",
                color: "white",
                outline: "none",
              }}
            />
            <button
              onClick={handleTrack}
              disabled={loading}
              style={{
                padding: "12px 16px",
                borderRadius: 10,
                border: "none",
                background: "#2563eb",
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {loading ? "..." : "Track"}
            </button>
          </div>

          {error && (
            <p style={{ color: "#f87171", marginTop: 10, fontSize: 13 }}>
              {error}
            </p>
          )}

          <p style={{ color: "#94a3b8", marginTop: 10, fontSize: 12 }}>
            Demo IDs: TRP-001 · TRP-002 · TRP-003
          </p>
        </div>

        {!tripData && (
          <div style={{ color: "#94a3b8", marginTop: 30 }}>
            Enter a Trip ID to start tracking.
          </div>
        )}

        {tripData && (
          <>
            {/* Status */}
            <div
              style={{
                background: "#111827",
                padding: 14,
                borderRadius: 14,
                marginBottom: 16,
                border: "1px solid #1f2937",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 16 }}>
                {tripData.trip.truck}
              </div>
              <div style={{ color: "#94a3b8", fontSize: 13 }}>{activeTripKey}</div>

              <div
                style={{
                  display: "inline-block",
                  marginTop: 10,
                  padding: "6px 12px",
                  borderRadius: 999,
                  background: statusCfg.bg,
                  color: statusCfg.text,
                  fontWeight: 700,
                  fontSize: 12,
                }}
              >
                {statusCfg.label}
              </div>
            </div>

            {/* Progress */}
            <div
              style={{
                background: "#111827",
                padding: 14,
                borderRadius: 14,
                marginBottom: 16,
                border: "1px solid #1f2937",
              }}
            >
              <SectionTitle>Trip Progress</SectionTitle>
              <div style={{ marginBottom: 8, fontSize: 14 }}>
                {Math.round(fraction * 100)}% Completed
              </div>
              <div
                style={{
                  height: 8,
                  background: "#1e293b",
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.round(fraction * 100)}%`,
                    height: "100%",
                    background: statusCfg.color,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>

            {/* Alerts */}
            {tripData.alerts.length > 0 && (
              <div
                style={{
                  background: "#451a03",
                  border: "1px solid #92400e",
                  color: "#fbbf24",
                  padding: 14,
                  borderRadius: 14,
                  marginBottom: 16,
                }}
              >
                <SectionTitle>Alerts</SectionTitle>
                {tripData.alerts.map((alert, i) => (
                  <div key={i} style={{ fontSize: 13, marginBottom: 6 }}>
                    ⚠️ {alert}
                  </div>
                ))}
              </div>
            )}

            {/* Driver */}
            <div
              style={{
                background: "#111827",
                padding: 14,
                borderRadius: 14,
                marginBottom: 16,
                border: "1px solid #1f2937",
              }}
            >
              <SectionTitle>Driver</SectionTitle>
              <DetailRow label="Name" value={tripData.driver.name} />
              <DetailRow label="Phone" value={tripData.driver.phone} />
              <DetailRow label="Experience" value={tripData.driver.experience} />
              <DetailRow label="Trips" value={tripData.driver.trips} />
              <DetailRow label="Rating" value={tripData.driver.rating} />
            </div>

            {/* Trip Details */}
            <div
              style={{
                background: "#111827",
                padding: 14,
                borderRadius: 14,
                marginBottom: 16,
                border: "1px solid #1f2937",
              }}
            >
              <SectionTitle>Trip Details</SectionTitle>
              <DetailRow label="Start" value={tripData.trip.start} />
              <DetailRow label="End" value={tripData.trip.end} />
              <DetailRow label="Cargo" value={tripData.trip.cargo} />
              <DetailRow label="Distance" value={tripData.trip.distance} />
              <DetailRow label="ETA" value={tripData.trip.eta} />
              <DetailRow
                label="Speed"
                value={fraction >= 1 ? "0 km/h" : tripData.trip.speed}
              />
              <DetailRow label="Fuel" value={`${tripData.trip.fuel}%`} />
            </div>
          </>
        )}
      </div>

      {/* Map */}
      <div className="flex-1">
        {routeLoading ? (
          <div
            style={{
              height: "100%",
              display: "grid",
              placeItems: "center",
              background: "#020817",
              color: "#94a3b8",
              fontSize: 18,
            }}
          >
            Loading route from Mapbox...
          </div>
        ) : (
          <LiveTruckMap
            routePoints={routePoints}
            truckPos={truckPos}
            startPoint={startPoint}
            endPoint={endPoint}
            status={tripData?.status || "in_transit"}
          />
        )}
      </div>
    </div>
  );
}