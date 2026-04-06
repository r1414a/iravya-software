// DriverDashboard.jsx
// ──────────────────────────────────────────────────────────────────────────────
// DEMO-READY driver PWA page
// • Real phone GPS via navigator.geolocation (asks permission on "Start trip")
// • Real road route from Mapbox Directions API
// • Animated truck on map following the route
// • OTP screen (enter any 6-digit code for demo)
// • Language switcher — English / मराठी / हिंदी
// • Emergency button with confirmation + DC call
// • Stop confirmation per store
// • All mock data inline — no backend needed
//
// Route: /driver  (add to your React Router)
// Requires: mapbox-gl (already installed), "mapbox-gl/dist/mapbox-gl.css" imported
// ──────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, useCallback } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

// ── i18n strings ──────────────────────────────────────────────────────────────
const STRINGS = {
    en: {
        title:          "Fleet Driver",
        subtitle:       "Driver Dashboard",
        phone_label:    "Enter your registered phone number",
        phone_ph:       "+91 98XXX XXXXX",
        send_otp:       "Send OTP",
        otp_label:      "Enter OTP sent to your phone",
        otp_hint:       "Demo: enter any 6 digits",
        verify:         "Verify & Start Trip",
        verifying:      "Verifying…",
        wrong_otp:      "Invalid OTP. Try any 6-digit number for demo.",
        trip_id:        "Trip ID",
        truck:          "Truck",
        from:           "From",
        stops:          "Delivery stops",
        status:         "Status",
        in_transit:     "In transit",
        completed:      "Completed",
        pending:        "Pending",
        confirm_stop:   "Confirm delivery",
        confirmed:      "Confirmed",
        navigate:       "Navigate",
        emergency:      "EMERGENCY",
        emergency_q:    "Confirm emergency alert?",
        emergency_hint: "This will alert your DC operator immediately.",
        emergency_yes:  "Yes, send alert",
        emergency_cancel:"Cancel",
        emergency_sent: "Alert sent! DC operator has been notified.",
        call_dc:        "Call DC operator",
        your_location:  "Your location",
        gps_loading:    "Getting GPS…",
        gps_error:      "Location unavailable",
        route_loading:  "Loading road route…",
        start_trip:     "Start trip",
        trip_progress:  "Trip progress",
        language:       "Language",
        logout:         "End trip",
        logout_q:       "End this trip? Your session will close.",
        logout_yes:     "End trip",
        logout_cancel:  "Continue",
    },
    mr: {
        title:          "फ्लीट ड्रायव्हर",
        subtitle:       "ड्रायव्हर डॅशबोर्ड",
        phone_label:    "नोंदणीकृत फोन नंबर टाका",
        phone_ph:       "+91 98XXX XXXXX",
        send_otp:       "OTP पाठवा",
        otp_label:      "फोनवर आलेला OTP टाका",
        otp_hint:       "डेमो: कोणतेही 6 अंक टाका",
        verify:         "पडताळा व ट्रिप सुरू करा",
        verifying:      "पडताळत आहे…",
        wrong_otp:      "चुकीचा OTP. डेमोसाठी कोणतेही 6 अंक टाका.",
        trip_id:        "ट्रिप आयडी",
        truck:          "ट्रक",
        from:           "कुठून",
        stops:          "डिलिव्हरी थांबे",
        status:         "स्थिती",
        in_transit:     "मार्गात",
        completed:      "पूर्ण",
        pending:        "प्रलंबित",
        confirm_stop:   "डिलिव्हरी पुष्टी करा",
        confirmed:      "पुष्टी झाली",
        navigate:       "नेव्हिगेट करा",
        emergency:      "आपत्कालीन",
        emergency_q:    "आपत्कालीन अलर्ट पाठवायचा?",
        emergency_hint: "तुमच्या DC ऑपरेटरला ताबडतोब सूचना मिळेल.",
        emergency_yes:  "होय, अलर्ट पाठवा",
        emergency_cancel:"रद्द करा",
        emergency_sent: "अलर्ट पाठवला! DC ऑपरेटरला सूचित केले.",
        call_dc:        "DC ऑपरेटरला कॉल करा",
        your_location:  "तुमचे स्थान",
        gps_loading:    "GPS मिळवत आहे…",
        gps_error:      "स्थान उपलब्ध नाही",
        route_loading:  "रस्त्याचा मार्ग लोड होत आहे…",
        start_trip:     "ट्रिप सुरू करा",
        trip_progress:  "ट्रिप प्रगती",
        language:       "भाषा",
        logout:         "ट्रिप संपवा",
        logout_q:       "ही ट्रिप संपवायची? तुमचे सत्र बंद होईल.",
        logout_yes:     "ट्रिप संपवा",
        logout_cancel:  "सुरू ठेवा",
    },
    hi: {
        title:          "फ्लीट ड्राइवर",
        subtitle:       "ड्राइवर डैशबोर्ड",
        phone_label:    "अपना पंजीकृत फ़ोन नंबर दर्ज करें",
        phone_ph:       "+91 98XXX XXXXX",
        send_otp:       "OTP भेजें",
        otp_label:      "फ़ोन पर आया OTP दर्ज करें",
        otp_hint:       "डेमो: कोई भी 6 अंक दर्ज करें",
        verify:         "सत्यापित करें और यात्रा शुरू करें",
        verifying:      "सत्यापित हो रहा है…",
        wrong_otp:      "गलत OTP। डेमो के लिए कोई भी 6 अंक दर्ज करें।",
        trip_id:        "ट्रिप आईडी",
        truck:          "ट्रक",
        from:           "कहाँ से",
        stops:          "डिलीवरी स्टॉप",
        status:         "स्थिति",
        in_transit:     "रास्ते में",
        completed:      "पूर्ण",
        pending:        "प्रतीक्षारत",
        confirm_stop:   "डिलीवरी पुष्टि करें",
        confirmed:      "पुष्टि हो गई",
        navigate:       "नेविगेट करें",
        emergency:      "आपातकाल",
        emergency_q:    "आपातकालीन अलर्ट भेजें?",
        emergency_hint: "आपके DC ऑपरेटर को तुरंत सूचित किया जाएगा।",
        emergency_yes:  "हाँ, अलर्ट भेजें",
        emergency_cancel:"रद्द करें",
        emergency_sent: "अलर्ट भेजा गया! DC ऑपरेटर को सूचित किया गया।",
        call_dc:        "DC ऑपरेटर को कॉल करें",
        your_location:  "आपका स्थान",
        gps_loading:    "GPS प्राप्त हो रहा है…",
        gps_error:      "स्थान अनुपलब्ध",
        route_loading:  "सड़क मार्ग लोड हो रहा है…",
        start_trip:     "यात्रा शुरू करें",
        trip_progress:  "यात्रा प्रगति",
        language:       "भाषा",
        logout:         "यात्रा समाप्त करें",
        logout_q:       "यह यात्रा समाप्त करें? आपका सत्र बंद हो जाएगा।",
        logout_yes:     "यात्रा समाप्त करें",
        logout_cancel:  "जारी रखें",
    },
}

// ── Mock trip data (demo — no backend needed) ─────────────────────────────────
const DEMO_TRIP = {
    id:       "TRP-2841",
    truck:    "MH12AB1234",
    driver:   "Ramesh Kumar",
    phone:    "+91 98765 43210",
    sourceDC: "Pune Warehouse DC",
    dcPhone:  "+912027421234",   // DC operator phone for Call DC button
    // Real Pune coordinates: DC → store stops
    waypoints: [
        [18.6298, 73.7997],  // Pune Warehouse DC, Pimpri-Chinchwad
        [18.5362, 73.8995],  // Koregaon Park
        [18.5590, 73.7873],  // Baner
    ],
    stops: [
        { id: 1, name: "Koregaon Park Store",  address: "Phoenix Market City, Nagar Rd", lat: 18.5362, lng: 73.8995, status: "pending"   },
        { id: 2, name: "Baner Store",          address: "Balewadi High St, Baner",       lat: 18.5590, lng: 73.7873, status: "pending"   },
    ],
}

// ── Fetch real road route from Mapbox Directions API ─────────────────────────
async function fetchRoute(waypoints) {
    const token  = import.meta.env.VITE_MAPBOX_TOKEN
    const coords = waypoints.map(([lat, lng]) => `${lng},${lat}`).join(";")
    const url    = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=geojson&overview=full&access_token=${token}`
    const res    = await fetch(url)
    const data   = await res.json()
    if (!data.routes?.length) throw new Error("No route")
    return data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng])
}

// ── Interpolate truck position along route ────────────────────────────────────
function interpolate(pts, t) {
    if (!pts?.length) return null
    if (t <= 0) return pts[0]
    if (t >= 1) return pts[pts.length - 1]
    let total = 0
    const segs = []
    for (let i = 1; i < pts.length; i++) {
        const d = Math.hypot(pts[i][0] - pts[i-1][0], pts[i][1] - pts[i-1][1])
        segs.push(d); total += d
    }
    let target = total * t
    for (let i = 0; i < segs.length; i++) {
        if (target <= segs[i]) {
            const f = target / segs[i]
            return [pts[i][0] + f * (pts[i+1][0] - pts[i][0]), pts[i][1] + f * (pts[i+1][1] - pts[i][1])]
        }
        target -= segs[i]
    }
    return pts[pts.length - 1]
}

// ── Mapbox map component ──────────────────────────────────────────────────────
function DriverMap({ routePoints, fraction, userLocation }) {
    const ref       = useRef(null)
    const mapRef    = useRef(null)
    const truckRef  = useRef(null)
    const userRef   = useRef(null)
    const fittedRef = useRef(false)

    useEffect(() => {
        if (mapRef.current || !ref.current) return
        mapRef.current = new mapboxgl.Map({
            container: ref.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [73.85, 18.56],
            zoom: 11,
        })
        mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right")
    }, [])

    // Draw route when loaded
    useEffect(() => {
        const map = mapRef.current
        if (!map || !routePoints?.length) return

        const fullCoords = routePoints.map(([lat, lng]) => [lng, lat])
        const splitIdx   = Math.floor(fraction * (routePoints.length - 1))
        const doneCoords = routePoints.slice(0, splitIdx + 1).map(([lat, lng]) => [lng, lat])
        const restCoords = routePoints.slice(splitIdx).map(([lat, lng]) => [lng, lat])

        function upsertLayer(srcId, layerId, coords, color, width, dash) {
            const gj = { type: "Feature", geometry: { type: "LineString", coordinates: coords } }
            if (map.getSource(srcId)) { map.getSource(srcId).setData(gj); return }
            map.addSource(srcId, { type: "geojson", data: gj })
            const paint = { "line-color": color, "line-width": width, "line-opacity": 0.9, ...(dash ? { "line-dasharray": [4,3] } : {}) }
            map.addLayer({ id: layerId, type: "line", source: srcId, layout: { "line-join": "round", "line-cap": "round" }, paint })
        }

        const render = () => {
            upsertLayer("src-base", "lyr-base", fullCoords,  "#e2e8f0", 5, false)
            upsertLayer("src-done", "lyr-done", doneCoords,  "#16a34a", 5, false)
            upsertLayer("src-rest", "lyr-rest", restCoords,  "#2563eb", 4, true)

            // DC marker
            const sp = routePoints[0]
            new mapboxgl.Marker({ color: "#1e40af" })
                .setLngLat([sp[1], sp[0]])
                .setPopup(new mapboxgl.Popup().setHTML(`<strong>📦 ${DEMO_TRIP.sourceDC}</strong>`))
                .addTo(map)

            // Store markers
            DEMO_TRIP.stops.forEach(stop => {
                new mapboxgl.Marker({ color: "#15803d" })
                    .setLngLat([stop.lng, stop.lat])
                    .setPopup(new mapboxgl.Popup().setHTML(`<strong>🏪 ${stop.name}</strong><br><span style="color:#64748b;font-size:12px">${stop.address}</span>`))
                    .addTo(map)
            })

            if (!fittedRef.current) {
                const bounds = new mapboxgl.LngLatBounds()
                routePoints.forEach(([lat, lng]) => bounds.extend([lng, lat]))
                map.fitBounds(bounds, { padding: 50, duration: 1200 })
                fittedRef.current = true
            }
        }
        map.isStyleLoaded() ? render() : map.once("style.load", render)
    }, [routePoints])

    // Update route split lines
    useEffect(() => {
        const map = mapRef.current
        if (!map || !routePoints?.length) return
        const splitIdx   = Math.floor(fraction * (routePoints.length - 1))
        const doneCoords = routePoints.slice(0, splitIdx + 1).map(([lat, lng]) => [lng, lat])
        const restCoords = routePoints.slice(splitIdx).map(([lat, lng]) => [lng, lat])
        const gj = c => ({ type: "Feature", geometry: { type: "LineString", coordinates: c } })
        if (map.getSource("src-done")) map.getSource("src-done").setData(gj(doneCoords))
        if (map.getSource("src-rest")) map.getSource("src-rest").setData(gj(restCoords))
    }, [fraction, routePoints])

    // Update truck marker (animated truck on the route)
    useEffect(() => {
        const map = mapRef.current
        if (!map || !routePoints?.length) return
        const pos = interpolate(routePoints, fraction)
        if (!pos) return
        if (!truckRef.current) {
            const el = document.createElement("div")
            el.innerHTML = `<div style="background:#701a40;width:44px;height:44px;border-radius:50%;border:3px solid white;box-shadow:0 3px 14px rgba(112,26,64,.5);display:flex;align-items:center;justify-content:center;font-size:20px">🚛</div>`
            truckRef.current = new mapboxgl.Marker({ element: el, anchor: "center" })
                .setLngLat([pos[1], pos[0]])
                .addTo(map)
        } else {
            truckRef.current.setLngLat([pos[1], pos[0]])
        }
    }, [fraction, routePoints])

    // Update user (driver's real phone GPS) marker
    useEffect(() => {
        const map = mapRef.current
        if (!map || !userLocation) return
        const { lat, lng } = userLocation
        if (!userRef.current) {
            const el = document.createElement("div")
            el.innerHTML = `<div style="background:#0ea5e9;width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(14,165,233,.5)"></div>`
            userRef.current = new mapboxgl.Marker({ element: el, anchor: "center" })
                .setLngLat([lng, lat])
                .setPopup(new mapboxgl.Popup().setHTML("<b>Your location</b>"))
                .addTo(map)
        } else {
            userRef.current.setLngLat([lng, lat])
        }
    }, [userLocation])

    return <div ref={ref} style={{ width: "100%", height: "100%" }} />
}

// ── Main component ────────────────────────────────────────────────────────────
export default function DriverDashboard() {
    const [lang, setLang]               = useState("en")
    const [screen, setScreen]           = useState("otp")   // "otp" | "dashboard"
    const [phone, setPhone]             = useState("")
    const [otpSent, setOtpSent]         = useState(false)
    const [otp, setOtp]                 = useState("")
    const [otpError, setOtpError]       = useState(false)
    const [verifying, setVerifying]     = useState(false)
    const [stops, setStops]             = useState(DEMO_TRIP.stops)
    const [fraction, setFraction]       = useState(0.15)
    const [routePoints, setRoutePoints] = useState([])
    const [routeLoading, setRouteLoading] = useState(false)
    const [userLocation, setUserLocation] = useState(null)
    const [gpsStatus, setGpsStatus]     = useState("idle")   // "idle"|"loading"|"ok"|"error"
    const [showEmergency, setShowEmergency] = useState(false)
    const [emergencySent, setEmergencySent] = useState(false)
    const [showLogout, setShowLogout]   = useState(false)
    const intervalRef                   = useRef(null)
    const gpsWatchRef                   = useRef(null)

    const s = STRINGS[lang]  // current language strings

    // Fetch route on mount of dashboard
    useEffect(() => {
        if (screen !== "dashboard") return
        setRouteLoading(true)
        fetchRoute(DEMO_TRIP.waypoints)
            .then(pts => {
                setRoutePoints(pts)
                setFraction(0.15)
                // Start slow animation
                intervalRef.current = setInterval(() => {
                    setFraction(f => f >= 0.9 ? 0.9 : f + 0.0008)
                }, 1000)
            })
            .catch(() => {})
            .finally(() => setRouteLoading(false))
        return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
    }, [screen])

    // Request real GPS on dashboard
    useEffect(() => {
        if (screen !== "dashboard") return
        setGpsStatus("loading")
        gpsWatchRef.current = navigator.geolocation.watchPosition(
            pos => {
                setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
                setGpsStatus("ok")
            },
            () => setGpsStatus("error"),
            { enableHighAccuracy: true, maximumAge: 10000 }
        )
        return () => { if (gpsWatchRef.current) navigator.geolocation.clearWatch(gpsWatchRef.current) }
    }, [screen])

    const handleSendOtp = () => {
        if (!phone.trim()) return
        setOtpSent(true)
        setOtpError(false)
    }

    const handleVerify = () => {
        setVerifying(true)
        setOtpError(false)
        setTimeout(() => {
            // Demo: any 6-digit code works
            if (/^\d{6}$/.test(otp.trim())) {
                setScreen("dashboard")
            } else {
                setOtpError(true)
            }
            setVerifying(false)
        }, 1200)
    }

    const confirmStop = (stopId) => {
        setStops(prev => prev.map(s => s.id === stopId ? { ...s, status: "completed" } : s))
    }

    const openNavigation = (lat, lng) => {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
        const url = isIOS
            ? `maps://?daddr=${lat},${lng}&dirflg=d`
            : `https://maps.google.com/maps?daddr=${lat},${lng}`
        window.open(url, "_blank")
    }

    const handleEmergency = () => {
        setEmergencySent(true)
        setShowEmergency(false)
        // In production: POST /api/driver/emergency with GPS coords
        // For demo: just show sent state + call button
    }

    const completedCount = stops.filter(s => s.status === "completed").length
    const progress = Math.round((completedCount / stops.length) * 100)

    // ── OTP SCREEN ─────────────────────────────────────────────────────────────
    if (screen === "otp") {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">

                {/* Language selector */}
                <div className="flex gap-2 mb-8">
                    {[["en","EN"],["mr","मराठी"],["hi","हिंदी"]].map(([code, label]) => (
                        <button
                            key={code}
                            onClick={() => setLang(code)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                                lang === code
                                    ? "bg-maroon text-white"
                                    : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="bg-maroon px-6 py-8 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4 text-3xl">
                            🚛
                        </div>
                        <h1 className="text-2xl font-bold text-white">{s.title}</h1>
                        <p className="text-white/70 text-sm mt-1">{s.subtitle}</p>
                    </div>

                    <div className="p-6">
                        {!otpSent ? (
                            /* Phone number input */
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        {s.phone_label}
                                    </label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && handleSendOtp()}
                                        placeholder={s.phone_ph}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-400 outline-none text-sm bg-slate-50"
                                    />
                                </div>
                                <button
                                    onClick={handleSendOtp}
                                    disabled={!phone.trim()}
                                    className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all bg-maroon hover:bg-maroon-dark disabled:bg-slate-300 disabled:cursor-not-allowed"
                                >
                                    {s.send_otp}
                                </button>
                            </div>
                        ) : (
                            /* OTP input */
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        {s.otp_label}
                                    </label>
                                    <input
                                        type="number"
                                        value={otp}
                                        onChange={e => { setOtp(e.target.value); setOtpError(false) }}
                                        onKeyDown={e => e.key === "Enter" && handleVerify()}
                                        placeholder="000000"
                                        maxLength={6}
                                        className={`w-full px-4 py-3 rounded-xl border-2 outline-none text-sm bg-slate-50 text-center text-2xl tracking-widest font-mono ${
                                            otpError ? "border-red-400" : "border-slate-200 focus:border-sky-400"
                                        }`}
                                    />
                                    <p className="text-xs text-slate-400 mt-1.5 text-center">{s.otp_hint}</p>
                                    {otpError && (
                                        <p className="text-xs text-red-600 mt-1.5 text-center">{s.wrong_otp}</p>
                                    )}
                                </div>
                                <button
                                    onClick={handleVerify}
                                    disabled={otp.length < 6 || verifying}
                                    className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all bg-maroon hover:bg-maroon-dark disabled:bg-slate-300 disabled:cursor-not-allowed"
                                >
                                    {verifying ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity=".3"/>
                                                <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                                            </svg>
                                            {s.verifying}
                                        </span>
                                    ) : s.verify}
                                </button>
                                <button
                                    onClick={() => { setOtpSent(false); setOtp(""); setOtpError(false) }}
                                    className="text-sm text-slate-500 hover:text-slate-700"
                                >
                                    ← {s.phone_label}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    // ── DASHBOARD SCREEN ──────────────────────────────────────────────────────
    return (
        <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">

            {/* Top bar */}
            <div className="bg-maroon text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg shrink-0">
                        🚛
                    </div>
                    <div>
                        <p className="font-bold text-sm leading-tight">{DEMO_TRIP.driver}</p>
                        <p className="text-white/70 text-xs font-mono">{DEMO_TRIP.id} · {DEMO_TRIP.truck}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Language selector */}
                    <div className="flex gap-1">
                        {[["en","EN"],["mr","म"],["hi","हि"]].map(([code, label]) => (
                            <button
                                key={code}
                                onClick={() => setLang(code)}
                                className={`w-7 h-7 rounded-full text-xs font-semibold transition-all ${
                                    lang === code ? "bg-white text-maroon" : "bg-white/20 text-white hover:bg-white/30"
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Logout */}
                    <button
                        onClick={() => setShowLogout(true)}
                        className="text-white/70 hover:text-white text-xs px-2 py-1 rounded-lg hover:bg-white/10"
                    >
                        {s.logout}
                    </button>
                </div>
            </div>

            {/* Emergency sent banner */}
            {emergencySent && (
                <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-between shrink-0">
                    <p className="text-sm font-semibold">🚨 {s.emergency_sent}</p>
                    <a href={`tel:${DEMO_TRIP.dcPhone}`} className="text-xs bg-white text-red-700 font-bold px-3 py-1.5 rounded-full shrink-0">
                        {s.call_dc}
                    </a>
                </div>
            )}

            {/* Map — takes remaining height */}
            <div className="relative flex-1 min-h-0">
                {routeLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 gap-3">
                        <svg className="animate-spin w-10 h-10" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="#cbd5e1" strokeWidth="3"/>
                            <path d="M12 2a10 10 0 0 1 10 10" stroke="#701a40" strokeWidth="3" strokeLinecap="round"/>
                        </svg>
                        <p className="text-sm text-slate-500">{s.route_loading}</p>
                    </div>
                ) : (
                    <DriverMap
                        routePoints={routePoints}
                        fraction={fraction}
                        userLocation={userLocation}
                    />
                )}

                {/* GPS status pill */}
                <div className={`absolute top-3 left-3 z-10 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm flex items-center gap-1.5 ${
                    gpsStatus === "ok"      ? "bg-green-100 text-green-700" :
                    gpsStatus === "loading" ? "bg-blue-100 text-blue-600"  :
                    gpsStatus === "error"   ? "bg-red-100 text-red-600"    :
                    "bg-slate-100 text-slate-500"
                }`}>
                    <span className={`w-2 h-2 rounded-full ${
                        gpsStatus === "ok"      ? "bg-green-500" :
                        gpsStatus === "loading" ? "bg-blue-400"  :
                        gpsStatus === "error"   ? "bg-red-400"   :
                        "bg-slate-300"
                    }`} />
                    {gpsStatus === "ok"      ? s.your_location   :
                     gpsStatus === "loading" ? s.gps_loading     :
                     gpsStatus === "error"   ? s.gps_error       : "GPS"}
                </div>

                {/* Map legend */}
                <div className="absolute top-3 right-3 z-10 bg-white rounded-xl border border-slate-200 shadow-sm px-3 py-2 text-xs space-y-1">
                    <div className="flex items-center gap-1.5"><span className="w-5 h-1.5 bg-green-600 rounded-full inline-block"/> Covered</div>
                    <div className="flex items-center gap-1.5"><svg width="20" height="6"><line x1="0" y1="3" x2="20" y2="3" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="5 3"/></svg> Remaining</div>
                    <div className="flex items-center gap-1.5"><span className="text-sm">🏭</span> Warehouse</div>
                    <div className="flex items-center gap-1.5"><span className="text-sm">🏪</span> Store</div>
                    <div className="flex items-center gap-1.5"><span className="text-sm">🔵</span> You</div>
                </div>

                {/* EMERGENCY button — large, always visible, bottom-left of map */}
                <button
                    onClick={() => setShowEmergency(true)}
                    className="absolute bottom-4 left-4 z-10 bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 active:scale-95 transition-all"
                    style={{ boxShadow: "0 0 0 4px rgba(220,38,38,0.25)" }}
                >
                    <span>🚨</span> {s.emergency}
                </button>
            </div>

            {/* Stops panel — scrollable bottom sheet */}
            <div className="bg-white border-t border-slate-200 shrink-0 max-h-72 overflow-y-auto">

                {/* Progress header */}
                <div className="px-4 pt-3 pb-2 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{s.trip_progress}</p>
                        <p className="text-xs font-bold text-slate-700">{completedCount}/{stops.length} stops · {progress}%</p>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500 rounded-full transition-all duration-700"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Stop cards */}
                <div className="px-4 py-3 flex flex-col gap-3">
                    {stops.map((stop, i) => (
                        <div
                            key={stop.id}
                            className={`rounded-xl border p-3 transition-all ${
                                stop.status === "completed"
                                    ? "bg-green-50 border-green-200"
                                    : "bg-white border-slate-200"
                            }`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                                    {/* Stop number */}
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                                        stop.status === "completed"
                                            ? "bg-green-500 text-white"
                                            : "bg-slate-200 text-slate-600"
                                    }`}>
                                        {stop.status === "completed" ? "✓" : i + 1}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-sm text-slate-900 truncate">{stop.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{stop.address}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 shrink-0">
                                    {stop.status !== "completed" && (
                                        <button
                                            onClick={() => openNavigation(stop.lat, stop.lng)}
                                            className="text-xs px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-medium hover:bg-blue-100"
                                        >
                                            {s.navigate}
                                        </button>
                                    )}
                                    {stop.status === "completed" ? (
                                        <span className="text-xs px-2.5 py-1.5 rounded-lg bg-green-100 text-green-700 font-medium">
                                            {s.confirmed}
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => confirmStop(stop.id)}
                                            className="text-xs px-2.5 py-1.5 rounded-lg bg-maroon text-white font-medium hover:bg-maroon-dark active:scale-95"
                                        >
                                            {s.confirm_stop}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Emergency confirmation modal */}
            {showEmergency && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center"
                    style={{ background: "rgba(0,0,0,0.6)" }}
                    onClick={() => setShowEmergency(false)}
                >
                    <div
                        className="w-full max-w-sm bg-white rounded-t-3xl p-6 pb-8"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 text-3xl">
                            🚨
                        </div>
                        <h2 className="text-xl font-bold text-center text-slate-900 mb-2">{s.emergency_q}</h2>
                        <p className="text-sm text-slate-500 text-center mb-6">{s.emergency_hint}</p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleEmergency}
                                className="w-full py-3.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 active:scale-95"
                            >
                                {s.emergency_yes}
                            </button>
                            <button
                                onClick={() => setShowEmergency(false)}
                                className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50"
                            >
                                {s.emergency_cancel}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* End trip confirmation modal */}
            {showLogout && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center"
                    style={{ background: "rgba(0,0,0,0.6)" }}
                    onClick={() => setShowLogout(false)}
                >
                    <div
                        className="w-full max-w-sm bg-white rounded-t-3xl p-6 pb-8"
                        onClick={e => e.stopPropagation()}
                    >
                        <h2 className="text-lg font-bold text-slate-900 mb-2 text-center">{s.logout}</h2>
                        <p className="text-sm text-slate-500 text-center mb-6">{s.logout_q}</p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => { setScreen("otp"); setOtpSent(false); setOtp(""); setPhone(""); setShowLogout(false) }}
                                className="w-full py-3 rounded-xl bg-maroon text-white font-bold text-sm"
                            >
                                {s.logout_yes}
                            </button>
                            <button
                                onClick={() => setShowLogout(false)}
                                className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 text-sm"
                            >
                                {s.logout_cancel}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}