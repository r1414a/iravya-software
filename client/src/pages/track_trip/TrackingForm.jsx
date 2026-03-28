import {React, useState} from "react"
import { Truck } from 'lucide-react';


function SectionLabel({ children }) {
  return <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">{children}</div>;
}


function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between items-start py-2 border-t border-slate-100 text-sm first:border-t-0">
      <span className="text-slate-500 flex-shrink-0 mr-2">{label}</span>
      <span className="text-slate-800 font-medium text-right">{value}</span>
    </div>
  );
}
export default function TrackingForm({MOCK_TRIPS,STATUS_CONFIG, ISSUE_TYPES}){
    const [tripIdInput, setTripIdInput] = useState("");
    
    const [activeTrip, setActiveTrip] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [issueNote, setIssueNote] = useState("");
    const [reportDone, setReportDone] = useState(false);
    const [refId] = useState(() => `RPT-${Math.floor(Math.random() * 90000 + 10000)}`);


    const handleTrack = () => {
        if (!tripIdInput.trim()) { setError("Please enter a Trip ID to continue."); return; }
        setLoading(true); setError(""); setActiveTrip(null);
        setTimeout(() => {
        const data = MOCK_TRIPS[tripIdInput.trim().toUpperCase()];
        if (data) {
            setActiveTrip(data);
            setActiveTab("overview");
            setSelectedIssue(null);
            setIssueNote("");
            setReportDone(false);
        } else {
            setError(`No trip found for "${tripIdInput}". Try TRP-001, TRP-002 or TRP-003`);
        }
        setLoading(false);
        }, 900);
    };

    const { driver, trip, checkpoints } = activeTrip || {};
    const statusCfg = trip ? STATUS_CONFIG[trip.status] : null;

    const tabs = [
        { id: "overview", label: "Overview", emoji: "📊" },
        { id: "driver", label: "Driver", emoji: "👤" },
        { id: "route", label: "Route Map", emoji: "🗺️" },
        { id: "report", label: "Report Issue", emoji: "🚨" },
    ];

    return (<>
        <div className="px-10 my-5 ">
            <div className="flex flex-row gap-8">
                <div className="w-160">
                    <Card className="p-5 mb-3">
                        <label className="block text-sm font-semibold text-slate-700 mb-3">Enter Trip ID to track your delivery</label>
                        <div className="flex gap-3 flex-wrap">
                        <input
                            value={tripIdInput}
                            onChange={e => { setTripIdInput(e.target.value); setError(""); }}
                            onKeyDown={e => e.key === "Enter" && handleTrack()}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            placeholder="e.g. TRP-001"
                            className={`flex-1 min-w-[200px] px-4 py-2.5 rounded-xl text-[15px] border-2 outline-none bg-slate-50 text-slate-800 transition-colors ${focused ? "border-sky-400" : "border-slate-200"}`}
                        />
                        <button
                            onClick={handleTrack}
                            disabled={loading}
                            className={`px-6 py-2.5 rounded-xl font-semibold text-white text-sm transition-all ${loading ? "bg-slate-400 cursor-wait" : "bg-maroon hover:bg-maroon-dark active:scale-95"}`}
                        >
                            {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/>
                                <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                                </svg>
                                Searching…
                            </span>
                            ) : "Track Shipment"}
                        </button>
                        </div>
                        {error && <p className="mt-3 text-sm text-red-600 flex items-center gap-1.5"><span>⚠️</span>{error}</p>}
                        <p className="mt-2.5 text-xs text-slate-400">Demo IDs: <span className="font-mono text-slate-500">TRP-001</span> · <span className="font-mono text-slate-500">TRP-002</span> · <span className="font-mono text-slate-500">TRP-003</span></p>
                    </Card>
                    {activeTrip && (
                        <>
                            <div>
                                <Card className="px-5 py-4 flex items-center justify-between flex-wrap gap-3 mb-3">
                                    <div className="flex items-center gap-3">
                                        <Truck size={18} color="#64748b"/>
                                        <span className="font-bold text-base text-slate-900">{activeTrip.trip.truck}</span>
                                        <span className="text-sm text-slate-400">· {tripIdInput.toUpperCase()}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <span className={`w-2.5 h-2.5 rounded-full ${statusCfg.dot}`}/>
                                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusCfg.badge}`}>{statusCfg.label}</span>
                                    </div>
                                </Card>
                                    <Card className="p-5">
                                    <SectionLabel>Report an Issue</SectionLabel>
                                    {reportDone ? (
                                        <div className="text-center py-10">
                                        <div className="text-5xl mb-4">✅</div>
                                        <p className="font-bold text-base text-slate-900 mb-1">Issue Reported Successfully</p>
                                        <p className="text-sm text-slate-500 mb-5">Our team will review and respond within 30 minutes.</p>
                                        <div className="inline-block bg-slate-50 border border-slate-200 rounded-xl px-5 py-2.5 text-sm font-mono text-slate-600 mb-5">
                                            Ref: {refId}
                                        </div>
                                        <button onClick={() => { setReportDone(false); setSelectedIssue(null); setIssueNote(""); }}
                                            className="block w-full py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                                            Report Another Issue
                                        </button>
                                        </div>
                                    ) : (
                                        <>
                                        <p className="text-sm text-slate-500 mb-4">Select the issue you're experiencing:</p>
                                        <div className="flex flex-col gap-2 mb-4">
                                            {ISSUE_TYPES.map(issue => (
                                            <button key={issue.id} onClick={() => setSelectedIssue(issue.id)}
                                                className={`flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all
                                                ${selectedIssue === issue.id ? "border-pink-800 bg-pink-50" : "border-slate-200 bg-white hover:border-slate-300"}`}>
                                                <span className="text-xl flex-shrink-0 mt-0.5">{issue.emoji}</span>
                                                <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-slate-800">{issue.label}</p>
                                                <p className="text-xs text-slate-500">{issue.desc}</p>
                                                </div>
                                                {selectedIssue === issue.id && (
                                                <div className="w-5 h-5 rounded-full bg-pink-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-white text-[10px] font-bold">✓</span>
                                                </div>
                                                )}
                                            </button>
                                            ))}
                                        </div>
                                        {selectedIssue && (
                                            <div className="mb-4">
                                            <label className="block text-xs text-slate-500 font-medium mb-1.5">Additional details (optional)</label>
                                            <textarea
                                                value={issueNote}
                                                onChange={e => setIssueNote(e.target.value)}
                                                placeholder="Describe the issue in more detail…"
                                                rows={3}
                                                className="w-full text-sm px-3 py-2.5 rounded-xl border border-pink-800 bg-slate-50 text-slate-800 resize-none outline-none focus:border-pink-800 transition-colors"
                                            />
                                            </div>
                                        )}
                                        <button
                                            onClick={() => selectedIssue && setReportDone(true)}
                                            disabled={!selectedIssue}
                                            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all
                                            ${selectedIssue ? "bg-maroon hover:bg-maroon text-white active:scale-98" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
                                            Submit Report
                                        </button>
                                        </>
                                    )}
                                    </Card>
                                
                            </div>
                        </>
                    )

                    }
                </div>
                <div >
                    {activeTrip && (<>
                        <div className="border border-gray-200 w-200 rounded-2xl p-2">
                            {activeTrip.alerts.length > 0 && (
                                <div className="bg-amber-50 border border-amber-200 p-2 mb-3" >
                                {activeTrip.alerts.map((a, i) => (
                                    <div key={i} className={`flex items-center gap-2.5 text-sm text-amber-800 ${i > 0 ? "mt-2" : ""}`}>
                                    <span>⚠️</span><span>{a}</span>
                                    </div>
                                ))}
                                </div>
                            )}

                            <div>
                                

                                <div className="p-5 border border-transparent border border-b-gray-400">
                                    <SectionLabel>Driver Details</SectionLabel>
                                    <div className="flex items-center gap-4 mb-5">
                                        <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                                        style={{background:"linear-gradient(135deg,rgb(214 154 58),rgb(214 154 58))"}}>
                                        {activeTrip.driver.avatar}
                                        </div>
                                        <div>
                                        <div className="font-bold text-base text-slate-900">{activeTrip.driver.name}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">{activeTrip.driver.id}</div>
                                        <div className="flex items-center gap-1 mt-1">
                                            {[1,2,3,4,5].map(i => (
                                            <span key={i} className={`text-sm ${i <= Math.floor(activeTrip.driver.rating) ? "text-amber-400" : "text-slate-300"}`}>★</span>
                                            ))}
                                            <span className="text-xs text-slate-500 ml-1">{activeTrip.driver.rating}</span>
                                        </div>
                                        </div>
                                    </div>
                                    <div className="divide-y divide-slate-100">
                                        <DetailRow label="📞 Phone" value={activeTrip.driver.phone}/>
                                        <DetailRow label="🪪 License" value={activeTrip.driver.license}/>
                                        <DetailRow label="🚚 Vehicle Type" value={activeTrip.driver.vehicle}/>
                                        <DetailRow label="📅 Experience" value={activeTrip.driver.experience}/>
                                        <DetailRow label="✅ Total Trips" value={`${activeTrip.driver.trips.toLocaleString()} completed`}/>
                                    </div>
                                    <a href={`tel:${activeTrip.driver.phone}`}
                                        className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 text-sm font-semibold hover:bg-sky-100 transition-colors">
                                        📞 Call Driver
                                    </a>
                                </div>

                                <div className="p-5  border border-transparent ">
                                    <SectionLabel>Trip Details</SectionLabel>
                                    <DetailRow label="📦 Vehicle Type" value={`${trip.type} · ${trip.capacity}`}/>
                                    <DetailRow label="🟢 Start Point" value={trip.start}/>
                                    <DetailRow label="🔴 End Point" value={trip.end}/>
                                    <DetailRow label="🔴 Current location" value={trip.currentLocation}/>
                                    <DetailRow label="🕐 Duration" value={trip.startTime +" - "+trip.eta}/>
                                    {/* <DetailRow label="⏱ ETA" value={trip.eta}/> */}
                                    <DetailRow label="📏 Distance" value={trip.distance}/>
                                    <DetailRow label="📦 Cargo" value={trip.cargo}/>
                                </div>
                            </div>
                        </div>
                    </>)}
                </div>
                <div className="flex items-center justify-center">                          

                    {!activeTrip && !loading && (
                        <div className="text-center py-16 text-slate-400">
                            <div className="text-5xl mb-4">🗺️</div>
                            <p className="font-medium text-slate-600 text-base mb-1">Track Your Delivery</p>
                            <p className="text-sm">Enter your Trip ID above to get started</p>
                        </div>
                    )}
                </div>  
            
            </div>
        </div>
    </>)
}