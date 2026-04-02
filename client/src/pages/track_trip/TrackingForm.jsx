import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ── Real lat/lng for Maharashtra routes ──────────────────────────────────────
const MOCK_TRIPS = {
  "TRP-001": {
    driver: { name: "Rajesh Kumar", id: "DRV-4821", phone: "+91 98765 43210", avatar: "RK", rating: 4.8, trips: 1240, experience: "8 years" },
    trip: {
      truck: "MH-12-AB-4567", type: "Heavy Freight", capacity: "20 Tons",
      start: "Pune Logistics Hub, Pimpri-Chinchwad",
      end: "Tata Westside, Phoenix Palladium, Mumbai",
      startTime: "06:30 AM", eta: "11:00 AM", distance: "147 km",
      status: "in_transit", cargo: "Apparel & Accessories",
      speed: "72 km/h", fuel: 68,
    },
    // DC = start, Store = end
    dcLatLng: [18.6298, 73.8008],   // Pimpri-Chinchwad
    storeLatLng: [19.0760, 72.8777], // Mumbai Palladium
    // Current truck position index into routePoints (fetched from OSRM)
    progressFraction: 0.42,          // 42% along the route
    status: "in_transit",
    alerts: [],
    // Waypoints for OSRM to compute real road route
    waypoints: [
      [18.6298, 73.8008], // Pimpri-Chinchwad DC
      [18.5204, 73.8567], // Pune city
      [18.4655, 73.8677], // Katraj
      [18.3635, 73.8664], // Khopoli area
      [18.9667, 72.8333], // Navi Mumbai/Panvel
      [19.0760, 72.8777], // Mumbai
    ],
  },
  "TRP-002": {
    driver: { name: "Suresh Patil", id: "DRV-3309", phone: "+91 97654 32109", avatar: "SP", rating: 4.5, trips: 876, experience: "6 years" },
    trip: {
      truck: "MH-14-CD-8823", type: "Medium Carrier", capacity: "10 Tons",
      start: "Nashik DC, MIDC Satpur",
      end: "Zudio Store, Aurangabad Mall",
      startTime: "07:00 AM", eta: "12:30 PM", distance: "188 km",
      status: "delayed", cargo: "Textiles",
      speed: "45 km/h", fuel: 42,
    },
    dcLatLng: [19.9975, 73.7898],   // Nashik MIDC
    storeLatLng: [19.8762, 75.3433], // Aurangabad
    progressFraction: 0.28,
    status: "delayed",
    alerts: ["Route deviation detected near Sinnar", "Speed below expected threshold"],
    waypoints: [
      [19.9975, 73.7898], // Nashik DC
      [19.8486, 74.0133], // Sinnar
      [19.7654, 74.4762], // Shirdi
      [19.7263, 74.7378], // Kopargaon
      [19.8762, 75.3433], // Aurangabad
    ],
  },
  "TRP-003": {
    driver: { name: "Anil Deshmukh", id: "DRV-5512", phone: "+91 96543 21098", avatar: "AD", rating: 4.9, trips: 2105, experience: "12 years" },
    trip: {
      truck: "MH-20-EF-1122", type: "Light Commercial", capacity: "5 Tons",
      start: "Nagpur Distribution Center",
      end: "Tata Cliq Store, Amravati",
      startTime: "08:00 AM", eta: "10:30 AM", distance: "150 km",
      status: "delivered", cargo: "FMCG Goods",
      speed: "0 km/h", fuel: 55,
    },
    dcLatLng: [21.1458, 79.0882],   // Nagpur DC
    storeLatLng: [20.9374, 77.7796], // Amravati
    progressFraction: 1.0,
    status: "delivered",
    alerts: [],
    waypoints: [
      [21.1458, 79.0882], // Nagpur DC
      [21.0564, 78.5625], // Wardha
      [20.9912, 78.1178], // Dhamangaon
      [20.9374, 77.7796], // Amravati
    ],
  },
};

const STATUS_CONFIG = {
  in_transit: { label: "In Transit", dot: "bg-sky-500", badge: "bg-sky-100 text-sky-700", color: "#0ea5e9" },
  delayed:    { label: "Delayed",    dot: "bg-amber-500", badge: "bg-amber-100 text-amber-700", color: "#f59e0b" },
  delivered:  { label: "Delivered",  dot: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700", color: "#10b981" },
};

// ── Custom Leaflet Icons ─────────────────────────────────────────────────────
function makeSvgIcon(svg, size = [40, 40], anchor = [20, 20]) {
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: size,
    iconAnchor: anchor,
    popupAnchor: [0, -20],
  });
}

const DC_ICON = makeSvgIcon(`
  <div style="
    width:38px;height:38px;background:#1e293b;border-radius:10px;border:2.5px solid #94a3b8;
    display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.4);
    font-size:18px;
  ">🏭</div>
`, [38, 38], [19, 19]);

const STORE_ICON = makeSvgIcon(`
  <div style="
    width:38px;height:38px;background:#7c3aed;border-radius:10px;border:2.5px solid #c4b5fd;
    display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(124,58,237,0.5);
    font-size:18px;
  ">🛍️</div>
`, [38, 38], [19, 19]);

function truckIcon(status) {
  const colors = { in_transit: "#0ea5e9", delayed: "#f59e0b", delivered: "#10b981" };
  const c = colors[status] || "#0ea5e9";
  return makeSvgIcon(`
    <div style="
      width:44px;height:44px;background:${c};border-radius:50%;border:3px solid white;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 0 0 3px ${c}55, 0 4px 16px rgba(0,0,0,0.4);
      font-size:20px;animation:truckPulse 2s infinite;
    ">🚛</div>
    <style>
      @keyframes truckPulse {
        0%,100%{box-shadow:0 0 0 3px ${c}55,0 4px 16px rgba(0,0,0,0.4)}
        50%{box-shadow:0 0 0 8px ${c}22,0 4px 16px rgba(0,0,0,0.4)}
      }
    </style>
  `, [44, 44], [22, 22]);
}

// ── Map controller: fits bounds & follows truck ──────────────────────────────
function MapController({ routePoints, truckPos }) {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (routePoints.length > 1 && !fitted.current) {
      map.fitBounds(L.latLngBounds(routePoints), { padding: [60, 60] });
      fitted.current = true;
    }
  }, [routePoints]);

  useEffect(() => {
    if (truckPos) map.panTo(truckPos, { animate: true, duration: 1.2 });
  }, [truckPos]);

  return null;
}

// ── Fetch real road route from OSRM ─────────────────────────────────────────
async function fetchRoadRoute(waypoints) {
  const coords = waypoints.map(([lat, lng]) => `${lng},${lat}`).join(";");
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.code !== "Ok") throw new Error("OSRM error");
  return data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
}

// ── Interpolate position along route ────────────────────────────────────────
function interpolatePosition(points, fraction) {
  if (!points.length) return null;
  if (fraction >= 1) return points[points.length - 1];
  if (fraction <= 0) return points[0];

  // Calculate total length
  let totalLen = 0;
  const segs = [];
  for (let i = 1; i < points.length; i++) {
    const d = Math.hypot(points[i][0] - points[i-1][0], points[i][1] - points[i-1][1]);
    segs.push(d);
    totalLen += d;
  }

  let target = fraction * totalLen;
  for (let i = 0; i < segs.length; i++) {
    if (target <= segs[i]) {
      const t = target / segs[i];
      return [
        points[i][0] + t * (points[i+1][0] - points[i][0]),
        points[i][1] + t * (points[i+1][1] - points[i][1]),
      ];
    }
    target -= segs[i];
  }
  return points[points.length - 1];
}

// ── Helper components ────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8", marginBottom: 10 }}>{children}</div>;
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderTop: "1px solid #1e293b", fontSize: 13 }}>
      <span style={{ color: "#94a3b8" }}>{label}</span>
      <span style={{ color: "#e2e8f0", fontWeight: 600, textAlign: "right", maxWidth: "60%" }}>{value}</span>
    </div>
  );
}

function StatPill({ emoji, label, value, color }) {
  return (
    <div style={{
      background: "#0f172a", border: `1px solid ${color}44`, borderRadius: 12, padding: "10px 14px",
      display: "flex", flexDirection: "column", gap: 2, flex: 1,
    }}>
      <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{emoji} {label}</span>
      <span style={{ fontSize: 16, fontWeight: 700, color }}>{value}</span>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function TrackingForm() {
  const [tripIdInput, setTripIdInput] = useState("");
  const [activeKey, setActiveKey] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [routePoints, setRoutePoints] = useState([]);
  const [routeLoading, setRouteLoading] = useState(false);
  const [fraction, setFraction] = useState(0);
  const animRef = useRef(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [reportDone, setReportDone] = useState(false);
  const [focused, setFocused] = useState(false);

  const ISSUE_TYPES = [
    { id: "no_contact", emoji: "📞", label: "Can't reach driver" },
    { id: "not_arrived", emoji: "⏰", label: "Delivery not arrived" },
    { id: "wrong_location", emoji: "📍", label: "Wrong location" },
    { id: "damaged", emoji: "📦", label: "Damaged goods concern" },
    { id: "breakdown", emoji: "🔧", label: "Vehicle breakdown" },
  ];

  const tripData = activeKey ? MOCK_TRIPS[activeKey] : null;
  const statusCfg = tripData ? STATUS_CONFIG[tripData.status] : null;

  // Truck position
  const truckPos = routePoints.length > 0 ? interpolatePosition(routePoints, fraction) : null;
  const traveledPoints = truckPos && routePoints.length > 0
    ? (() => {
        const cutoff = Math.round(fraction * (routePoints.length - 1));
        return [...routePoints.slice(0, cutoff + 1), truckPos];
      })()
    : [];

  const handleTrack = async () => {
    const key = tripIdInput.trim().toUpperCase();
    if (!key) { setError("Please enter a Trip ID."); return; }
    if (!MOCK_TRIPS[key]) { setError(`No trip found. Try TRP-001, TRP-002, or TRP-003`); return; }

    setLoading(true); setError(""); setRoutePoints([]); setFraction(0);
    if (animRef.current) clearInterval(animRef.current);

    setTimeout(async () => {
      setActiveKey(key);
      setLoading(false);
      setRouteLoading(true);
      setSelectedIssue(null);
      setReportDone(false);

      try {
        const pts = await fetchRoadRoute(MOCK_TRIPS[key].waypoints);
        setRoutePoints(pts);
        const startFrac = MOCK_TRIPS[key].progressFraction;
        setFraction(startFrac);

        // Animate truck along route (skip for delivered)
        if (MOCK_TRIPS[key].status !== "delivered") {
          animRef.current = setInterval(() => {
            setFraction(f => {
              if (f >= 1) { clearInterval(animRef.current); return 1; }
              return Math.min(f + 0.0008, 1);
            });
          }, 2000);
        }
      } catch (e) {
        setError("Could not load road route. Check internet connection.");
      } finally {
        setRouteLoading(false);
      }
    }, 700);
  };

  useEffect(() => () => { if (animRef.current) clearInterval(animRef.current); }, []);

  // Map center fallback
  const mapCenter = tripData ? tripData.dcLatLng : [18.9667, 75.7139];

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#020817", minHeight: "100vh", color: "#e2e8f0" }}>
      {/* Header */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", gap: 14, background: "#0a0f1e" }}>
        <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#7c3aed,#2563eb)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🗺️</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.02em" }}>Live Fleet Tracker</div>
          <div style={{ fontSize: 11, color: "#64748b" }}>Real-time truck monitoring · Tata Brands Pune</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          {["TRP-001", "TRP-002", "TRP-003"].map(id => (
            <button key={id} onClick={() => { setTripIdInput(id); }}
              style={{
                padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                border: "1px solid #1e293b", background: activeKey === id ? "#1e293b" : "transparent",
                color: activeKey === id ? "#e2e8f0" : "#64748b", transition: "all 0.2s",
              }}>
              {id}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 65px)" }}>
        {/* ── Left Sidebar ── */}
        <div style={{ width: 320, background: "#0a0f1e", borderRight: "1px solid #1e293b", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Search */}
          <div style={{ padding: 16, borderBottom: "1px solid #1e293b" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Track Shipment</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={tripIdInput}
                onChange={e => { setTripIdInput(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleTrack()}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="e.g. TRP-001"
                style={{
                  flex: 1, padding: "9px 12px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                  background: "#0f172a", border: `1.5px solid ${focused ? "#7c3aed" : "#1e293b"}`,
                  color: "#e2e8f0", outline: "none", transition: "border-color 0.2s",
                }}
              />
              <button onClick={handleTrack} disabled={loading}
                style={{
                  padding: "9px 16px", borderRadius: 10, fontWeight: 700, fontSize: 13,
                  background: loading ? "#1e293b" : "linear-gradient(135deg,#7c3aed,#2563eb)",
                  color: loading ? "#64748b" : "white", border: "none", cursor: loading ? "wait" : "pointer",
                  transition: "all 0.2s",
                }}>
                {loading ? "..." : "Track"}
              </button>
            </div>
            {error && <div style={{ marginTop: 8, fontSize: 12, color: "#f87171", display: "flex", gap: 6 }}>⚠️ {error}</div>}
          </div>

          {/* Trip info */}
          <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
            {routeLoading && (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#64748b" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🛣️</div>
                <div style={{ fontSize: 13 }}>Loading road route…</div>
              </div>
            )}

            {tripData && !routeLoading && (
              <>
                {/* Status bar */}
                <div style={{
                  background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12,
                  padding: "12px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 10,
                }}>
                  <span style={{ fontSize: 20 }}>🚛</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{tripData.trip.truck}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{activeKey}</div>
                  </div>
                  <div style={{
                    padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                    background: `${statusCfg.color}22`, color: statusCfg.color, border: `1px solid ${statusCfg.color}44`,
                  }}>
                    {statusCfg.label}
                  </div>
                </div>

                {/* Alerts */}
                {tripData.alerts.length > 0 && (
                  <div style={{ background: "#451a0322", border: "1px solid #92400e44", borderRadius: 10, padding: "10px 12px", marginBottom: 12 }}>
                    {tripData.alerts.map((a, i) => (
                      <div key={i} style={{ fontSize: 12, color: "#fbbf24", display: "flex", gap: 6, marginTop: i > 0 ? 6 : 0 }}>⚠️ {a}</div>
                    ))}
                  </div>
                )}

                {/* Progress */}
                <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 14, marginBottom: 12 }}>
                  <SectionLabel>Trip Progress</SectionLabel>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b", marginBottom: 6 }}>
                    <span>🏭 {tripData.trip.start.split(",")[0]}</span>
                    <span>{Math.round(fraction * 100)}%</span>
                    <span>🛍️ {tripData.trip.end.split(",")[0]}</span>
                  </div>
                  <div style={{ height: 6, background: "#1e293b", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 99,
                      background: `linear-gradient(90deg, ${statusCfg.color}, ${statusCfg.color}99)`,
                      width: `${Math.round(fraction * 100)}%`,
                      transition: "width 0.3s ease",
                    }} />
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <StatPill emoji="⚡" label="Speed" value={fraction >= 1 ? "0 km/h" : tripData.trip.speed} color={statusCfg.color} />
                    <StatPill emoji="⛽" label="Fuel" value={`${tripData.trip.fuel}%`} color={tripData.trip.fuel < 30 ? "#ef4444" : "#10b981"} />
                  </div>
                </div>

                {/* Driver */}
                <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 14, marginBottom: 12 }}>
                  <SectionLabel>Driver</SectionLabel>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%", fontSize: 15, fontWeight: 800, color: "white",
                      background: "linear-gradient(135deg,#7c3aed,#2563eb)",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>{tripData.driver.avatar}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{tripData.driver.name}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{tripData.driver.experience} · {tripData.driver.trips.toLocaleString()} trips</div>
                      <div style={{ fontSize: 12, color: "#fbbf24" }}>{"★".repeat(Math.floor(tripData.driver.rating))} {tripData.driver.rating}</div>
                    </div>
                  </div>
                  <DetailRow label="📞 Phone" value={tripData.driver.phone} />
                  <DetailRow label="🆔 Driver ID" value={tripData.driver.id} />
                  <a href={`tel:${tripData.driver.phone}`} style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 10,
                    padding: "9px", borderRadius: 10, background: "#0ea5e922", border: "1px solid #0ea5e944",
                    color: "#38bdf8", fontSize: 13, fontWeight: 600, textDecoration: "none",
                  }}>📞 Call Driver</a>
                </div>

                {/* Trip Details */}
                <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 14, marginBottom: 12 }}>
                  <SectionLabel>Trip Details</SectionLabel>
                  <DetailRow label="🏭 From" value={tripData.trip.start} />
                  <DetailRow label="🛍️ To" value={tripData.trip.end} />
                  <DetailRow label="📦 Cargo" value={tripData.trip.cargo} />
                  <DetailRow label="📏 Distance" value={tripData.trip.distance} />
                  <DetailRow label="🕐 Departure" value={tripData.trip.startTime} />
                  <DetailRow label="⏱️ ETA" value={tripData.trip.eta} />
                </div>

                {/* Report Issue */}
                <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 14, marginBottom: 16 }}>
                  <SectionLabel>Report Issue</SectionLabel>
                  {reportDone ? (
                    <div style={{ textAlign: "center", padding: "12px 0" }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>Reported Successfully</div>
                      <div style={{ fontSize: 11, color: "#64748b", marginBottom: 12 }}>Team will respond within 30 min</div>
                      <button onClick={() => { setReportDone(false); setSelectedIssue(null); }}
                        style={{ padding: "7px 14px", borderRadius: 8, background: "#1e293b", border: "none", color: "#e2e8f0", fontSize: 12, cursor: "pointer" }}>
                        Report Another
                      </button>
                    </div>
                  ) : (
                    <>
                      {ISSUE_TYPES.map(issue => (
                        <button key={issue.id} onClick={() => setSelectedIssue(issue.id)}
                          style={{
                            width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
                            borderRadius: 10, marginBottom: 6, cursor: "pointer", textAlign: "left",
                            border: `1.5px solid ${selectedIssue === issue.id ? "#7c3aed" : "#1e293b"}`,
                            background: selectedIssue === issue.id ? "#7c3aed22" : "#0a0f1e",
                            color: "#e2e8f0", fontSize: 13, transition: "all 0.2s",
                          }}>
                          <span>{issue.emoji}</span>
                          <span style={{ fontWeight: 600 }}>{issue.label}</span>
                          {selectedIssue === issue.id && <span style={{ marginLeft: "auto", color: "#7c3aed" }}>✓</span>}
                        </button>
                      ))}
                      <button onClick={() => selectedIssue && setReportDone(true)} disabled={!selectedIssue}
                        style={{
                          width: "100%", padding: "10px", borderRadius: 10, fontWeight: 700, fontSize: 13,
                          border: "none", cursor: selectedIssue ? "pointer" : "not-allowed", marginTop: 4,
                          background: selectedIssue ? "linear-gradient(135deg,#7c3aed,#2563eb)" : "#1e293b",
                          color: selectedIssue ? "white" : "#475569",
                        }}>Submit Report</button>
                    </>
                  )}
                </div>
              </>
            )}

            {!tripData && !loading && !routeLoading && (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🚛</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#94a3b8", marginBottom: 6 }}>No trip selected</div>
                <div style={{ fontSize: 12 }}>Enter a Trip ID or click a quick-select above</div>
              </div>
            )}
          </div>
        </div>

        {/* ── Map ── */}
        <div style={{ flex: 1, position: "relative" }}>
          <MapContainer center={mapCenter} zoom={8} style={{ height: "90%", width: "100%", background: "#020817" }}
            zoomControl={false}>
            <TileLayer
             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {routePoints.length > 1 && (
              <>
                {/* Full planned route — dim */}
                <Polyline positions={routePoints} pathOptions={{ color: "#334155", weight: 5, opacity: 0.8 }} />
                {/* Traveled portion */}
                {traveledPoints.length > 1 && (
                  <Polyline positions={traveledPoints}
                    pathOptions={{ color: statusCfg?.color || "#0ea5e9", weight: 5, opacity: 1, lineCap: "round", lineJoin: "round" }} />
                )}
              </>
            )}

            {/* DC Marker */}
            {tripData && (
              <Marker position={tripData.dcLatLng} icon={DC_ICON}>
                <Popup>
                  <div style={{ fontFamily: "sans-serif", minWidth: 160 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>🏭 Distribution Center</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{tripData.trip.start}</div>
                    <div style={{ fontSize: 11, marginTop: 6, color: "#94a3b8" }}>Departed: {tripData.trip.startTime}</div>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Store Marker */}
            {tripData && (
              <Marker position={tripData.storeLatLng} icon={STORE_ICON}>
                <Popup>
                  <div style={{ fontFamily: "sans-serif", minWidth: 160 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>🛍️ Destination Store</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{tripData.trip.end}</div>
                    <div style={{ fontSize: 11, marginTop: 6, color: "#94a3b8" }}>ETA: {tripData.trip.eta}</div>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Truck Marker */}
            {truckPos && tripData && (
              <Marker position={truckPos} icon={truckIcon(tripData.status)}>
                <Popup>
                  <div style={{ fontFamily: "sans-serif", minWidth: 180 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>🚛 {tripData.trip.truck}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{tripData.driver.name}</div>
                    <div style={{ fontSize: 12, marginTop: 6 }}>Speed: <b>{fraction >= 1 ? "0" : tripData.trip.speed}</b></div>
                    <div style={{ fontSize: 12 }}>Cargo: <b>{tripData.trip.cargo}</b></div>
                    <div style={{ fontSize: 12 }}>Progress: <b>{Math.round(fraction * 100)}%</b></div>
                  </div>
                </Popup>
              </Marker>
            )}

            <MapController routePoints={routePoints} truckPos={truckPos} />
          </MapContainer>

          {/* Map overlay legend */}
          <div style={{
            position: "absolute", bottom: 24, right: 16, zIndex: 1000,
            background: "#0a0f1eee", border: "1px solid #1e293b", borderRadius: 12, padding: "12px 16px",
            backdropFilter: "blur(8px)", minWidth: 160,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Legend</div>
            {[
              { color: "#334155", label: "Planned route", dash: true },
              { color: statusCfg?.color || "#0ea5e9", label: "Traveled path" },
            ].map(({ color, label, dash }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                <div style={{ width: 24, height: 3, background: color, borderRadius: 2, opacity: dash ? 0.5 : 1 }} />
                <span style={{ fontSize: 11, color: "#94a3b8" }}>{label}</span>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
              <span style={{ fontSize: 14 }}>🏭</span>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>Distribution center</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
              <span style={{ fontSize: 14 }}>🛍️</span>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>Destination store</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14 }}>🚛</span>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>Truck (live)</span>
            </div>
          </div>

          {/* Loading overlay on map */}
          {routeLoading && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 900, display: "flex", alignItems: "center", justifyContent: "center",
              background: "#020817aa", backdropFilter: "blur(4px)",
            }}>
              <div style={{ textAlign: "center", color: "#e2e8f0" }}>
                <div style={{ fontSize: 40, marginBottom: 12, animation: "spin 1s linear infinite", display: "inline-block" }}>🛰️</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Fetching road route…</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Connecting to OSRM routing engine</div>
              </div>
            </div>
          )}

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    </div>
  );
}