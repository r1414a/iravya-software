// Analytics.jsx (Fixed with proper filtering)
import { useState } from "react"
import {
    BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Route, Truck, CheckCircle2, Clock, Users, MapPin,
    TrendingUp, TrendingDown, Minus
} from "lucide-react"
import AdminSubHeader from "@/components/AdminSubHeader"
import LoadingSpinner from "@/components/LoadingSpinner"
import { useGetCountDataQuery, useGetGraphDataQuery } from "@/lib/features/analytics/analyticApi"

import {
    getStatsDataInFormat,
    getLast5Years,
    getDatesInMonth,
    getXAxisKey,
    formatXAxisLabel,
    hasGraphData,
    hasDCData
} from "@/lib/utils/helperFunctions"

// Color palette
const C = {
    green: "#16a34a",
    sky: "#0ea5e9",
    red: "#dc2626",
    teal: "#14b8a6",
    amber: "#f59e0b",
    violet: "#8b5cf6",
}

const alertColors = {
    speeding: C.red,
    delay: C.amber,
    route_deviation: C.violet,
    long_stop: C.sky,
};

// ── Reusable components ───────────────────────────────────────────────────────
function StatCard({ label, value, sub, trend, icon: Icon, color, iconBg }) {
    const TrendIcon = trend === "increase" ? TrendingUp : trend === "decrease" ? TrendingDown : Minus
    const trendColor = trend === "increase"
        ? "text-green-800"
        : trend === "decrease"
            ? "text-red-800"
            : "text-slate-800"

    return (
        <div className={`border-3 ${color} rounded-2xl p-4 flex items-start gap-3 shadow-sm`}>
            <div className={`${iconBg} w-11 h-11 rounded-xl flex items-center justify-center shrink-0`}>
                <Icon size={20} color="white" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-black/60 text-xs font-medium uppercase tracking-wider">{label}</p>
                <p className="text-black text-2xl font-bold mt-0.5 leading-tight">{value}</p>
                <div className={`flex items-center gap-1 mt-1 ${trendColor}`}>
                    <TrendIcon size={11} />
                    <p className="text-sm leading-none">{sub}</p>
                </div>
            </div>
        </div>
    )
}

function SectionTitle({ children, action }) {
    return (
        <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-700">{children}</h2>
            {action}
        </div>
    )
}

function ChartCard({ title, subtitle, children, className = "" }) {
    return (
        <div className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-sm ${className}`}>
            <div className="mb-4">
                <p className="text-sm font-bold text-slate-800">{title}</p>
                {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
            {children}
        </div>
    )
}

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-xs">
            <p className="font-semibold text-slate-700 mb-1.5">{label}</p>
            {payload.map((entry, i) => (
                <div key={i} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
                    <span className="text-slate-500">{entry.name}:</span>
                    <span className="font-semibold text-slate-800">{entry.value}</span>
                </div>
            ))}
        </div>
    )
}

function FilterControls({ filters, setFilters }) {
    const years = getLast5Years();
    const months = [
        { label: "January", value: "1" },
        { label: "February", value: "2" },
        { label: "March", value: "3" },
        { label: "April", value: "4" },
        { label: "May", value: "5" },
        { label: "June", value: "6" },
        { label: "July", value: "7" },
        { label: "August", value: "8" },
        { label: "September", value: "9" },
        { label: "October", value: "10" },
        { label: "November", value: "11" },
        { label: "December", value: "12" },
    ];

    const dates = getDatesInMonth(filters.year, filters.month)



    return (
        <div className="flex gap-2">
            {/* Year */}
            <Select
                value={String(filters.year)}
                onValueChange={(val) =>
                    setFilters((prev) => ({
                        ...prev,
                        year: Number(val),
                        month: "",
                        date: "",
                    }))
                }
            >
                <SelectTrigger className="w-[90px] h-8 text-xs">
                    <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                    {years.map((y) => (
                        <SelectItem key={y} value={String(y)}>
                            {y}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Month */}
            <Select
                value={filters.month ? String(filters.month) : "all"}
                onValueChange={(val) =>
                    setFilters((prev) => ({
                        ...prev,
                        month: val === "all" ? "" : Number(val),
                        date: "",
                    }))
                }
            >
                <SelectTrigger className="w-[110px] h-8 text-xs">
                    <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All months</SelectItem>
                    {months.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                            {m.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Date */}
            <Select
                value={filters.date ? String(filters.date) : "none"}
                onValueChange={(val) =>
                    setFilters((prev) => ({
                        ...prev,
                        date: val === "none" ? "" : Number(val),
                    }))
                }
                disabled={!filters.month}
            >
                <SelectTrigger className="w-[100px] h-8 text-xs">
                    <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="none">All dates</SelectItem>
                    {dates.map((d) => (
                        <SelectItem key={d.value} value={d.value}>
                            {d.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Analytics() {
    const [filters, setFilters] = useState({
        year: new Date().getFullYear(),
        month: "",
        date: "",
    });

    const { data: statsData, isLoading: loadingStats } = useGetCountDataQuery();
    const { data: graphsData, isLoading: loadingGraphData, isFetching } = useGetGraphDataQuery(filters, {
        refetchOnMountOrArgChange: true,
    });

    if (loadingStats || loadingGraphData) {
        return <LoadingSpinner />
    }

    const formattedStatsData = getStatsDataInFormat(statsData?.data)
    const xKey = getXAxisKey(filters)
    const tripDataExists = hasGraphData(graphsData?.trip_by_status)

    // Get subtitle based on filter selection
    // const getChartSubtitle = () => {
    //     if (filters.date) {
    //         const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    //         return `${monthNames[filters.month - 1]} ${filters.date}, ${filters.year} - Hourly breakdown`
    //     }
    //     if (filters.month) {
    //         const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    //         return `${monthNames[filters.month - 1]} ${filters.year} - Daily breakdown`
    //     }
    //     return `${filters.year} - Monthly breakdown`
    // }

    const getFilterLabel = () => {
        const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthNamesFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        if (filters.date) {
            return `${monthNamesShort[filters.month - 1]} ${filters.date}, ${filters.year}`;
        }

        if (filters.month) {
            return `${monthNamesFull[filters.month - 1]} ${filters.year}`;
        }

        return `${filters.year}`;
    };

    const getAlertSubtitle = () => {
        if (filters.date) {
            return `${getFilterLabel()} - Alert breakdown (hourly)`
        }
        if (filters.month) {
            return `${getFilterLabel()} - Alert breakdown (daily)`
        }
        return `${getFilterLabel()} - Alert breakdown (monthly)`
    }

    const dcData = graphsData?.dc_data || [];
    const dcDataExists = hasDCData(dcData);

    console.log("trip_by_status:", graphsData);
    console.log("tripDataExists:", tripDataExists);

    return (
        <section className="min-h-screen bg-slate-50">
            <AdminSubHeader
                to="/admin"
                heading="Analytics"
                subh="Fleet performance, delivery metrics and operational insights"
                CreateButton={<></>}
            />

            <div className="px-4 lg:px-10 py-6 flex flex-col gap-8">
                {/* ── KPI stat cards ──────────────────────────────────────── */}
                <section>
                    <SectionTitle>Platform overview</SectionTitle>
                    <div className="flex flex-wrap gap-6 justify-center items-center">
                        {formattedStatsData.map((stat) => (
                            <div key={stat.label} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-12px)] max-w-90">
                                <StatCard {...stat} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Trip volume + delivery rate ──────────────────────────── */}
                <section>
                    <SectionTitle
                        action={<FilterControls filters={filters} setFilters={setFilters} />}
                    >
                        Trip volume & stores
                    </SectionTitle>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Trips by status */}
                        <ChartCard
                            title="Trips by status"
                            // subtitle={getChartSubtitle()}
                            subtitle={`${getFilterLabel()} - ${filters.date ? "Hourly" : filters.month ? "Daily" : "Monthly"} breakdown`}
                        >
                            {loadingGraphData ? (
                                <div className="h-60 flex items-center justify-center">
                                    <LoadingSpinner />
                                </div>
                            ) : !tripDataExists ? (
                                <div className="h-60 flex items-center justify-center text-slate-500 text-sm">
                                    No trip data available for this period
                                </div>
                            ) : (
                                <div className="relative">
                                    {/* Overlay loader while refetching */}
                                    {isFetching && (
                                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 rounded-lg">
                                            <LoadingSpinner small />
                                        </div>
                                    )}
                                    <ResponsiveContainer width="100%" height={240}>
                                        <BarChart
                                            data={graphsData?.trip_by_status || []}
                                            barSize={filters.date ? 16 : filters.month ? 20 : 28}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                            <XAxis
                                                dataKey={xKey}
                                                tick={{ fontSize: 11, fill: "#94a3b8" }}
                                                interval={filters.date ? 2 : 0}
                                                angle={filters.date ? -45 : -30}
                                                textAnchor="end"
                                                height={60}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 11, fill: "#94a3b8" }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
                                            <Bar dataKey="completed" name="Completed" stackId="a" fill={C.green} radius={[0, 0, 0, 0]} />
                                            <Bar dataKey="scheduled" name="Scheduled" stackId="a" fill={C.sky} radius={[0, 0, 0, 0]} />
                                            <Bar dataKey="cancelled" name="Cancelled" stackId="a" fill={C.red} radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </ChartCard>

                        {/* Top stores */}
                        <ChartCard title="Top stores by deliveries"
                            // subtitle="Most deliveries received — all time"
                            subtitle={`Most deliveries - ${getFilterLabel()}`}
                        >
                            {graphsData?.top_stores?.length > 0 ? (
                                <div className="relative">
                                    {isFetching && (
                                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 rounded-lg">
                                            <LoadingSpinner small />
                                        </div>
                                    )}

                                    <ResponsiveContainer width="100%" height={240}>
                                        <BarChart
                                            data={graphsData.top_stores}
                                            layout="vertical"
                                            barSize={14}
                                            margin={{ left: 0 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                                            <XAxis
                                                type="number"
                                                tick={{ fontSize: 11, fill: "#94a3b8" }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                dataKey="store"
                                                type="category"
                                                tick={{ fontSize: 10, fill: "#64748b" }}
                                                axisLine={false}
                                                tickLine={false}
                                                width={110}
                                                tickFormatter={(v) => (v.length > 25 ? v.slice(0, 22) + "…" : v)}
                                            />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Bar dataKey="deliveries" name="Deliveries" fill={C.teal} radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : loadingGraphData ? (
                                <div className="h-60 flex items-center justify-center">
                                    <LoadingSpinner />
                                </div>
                            ) : (
                                <div className="h-60 flex items-center justify-center text-slate-500 text-sm">
                                    No delivery data available
                                </div>
                            )}
                        </ChartCard>
                    </div>
                </section>

                {/* ── Distribution centers & alerts ────────────────────────── */}
                <section>
                    <SectionTitle>Distribution centers & alerts</SectionTitle>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* DC performance */}
                        <ChartCard
                            title="DC dispatch performance"
                            // subtitle={`Trips dispatched vs completed per DC - ${getChartSubtitle()}`}
                            subtitle={`Trips dispatched vs completed per DC - ${getFilterLabel()}`}
                        >
                            {loadingGraphData ? (
                                <div className="h-60 flex items-center justify-center">
                                    <LoadingSpinner />
                                </div>
                            ) : !dcDataExists ? (
                                <div className="h-60 flex items-center justify-center text-slate-500 text-sm">
                                    No DC data available
                                </div>
                            ) :
                                (
                                    <div className="relative">
                                        {isFetching && (
                                            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 rounded-lg">
                                                <LoadingSpinner small />
                                            </div>
                                        )}
                                        <ResponsiveContainer width="100%" height={220}>
                                            <BarChart data={graphsData.dc_data} barGap={2} barSize={14}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                                <XAxis
                                                    dataKey="dc"
                                                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                    angle={-30}
                                                    textAnchor="end"
                                                    height={70}
                                                />
                                                <YAxis
                                                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
                                                <Bar dataKey="in_transit" name="In Transit" fill={C.amber} radius={[3, 3, 0, 0]} />
                                                <Bar dataKey="completed" name="Completed" fill={C.green} radius={[3, 3, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>

                                        {/* Performance pills */}
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {graphsData.dc_data.map(dc => {
                                                const rate = Number(dc.performance) || 0
                                                const color = rate >= 90 ? "bg-green-100 text-green-700"
                                                    : rate >= 70 ? "bg-amber-100 text-amber-700"
                                                        : "bg-red-100 text-red-700"
                                                return (
                                                    <div key={dc.dc} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
                                                        <span>{dc.dc}</span>
                                                        <span className="font-bold">{rate}%</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                )}
                        </ChartCard>

                        {/* Alert breakdown */}
                        <ChartCard title="Alert breakdown"
                            // subtitle="By type — last 30 days"
                            subtitle={getAlertSubtitle()}
                        >
                            {graphsData?.alert?.length > 0 ? (
                                <div className="relative">
                                    {isFetching && (
                                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 rounded-lg">
                                            <LoadingSpinner small />
                                        </div>
                                    )}

                                    <ResponsiveContainer width="100%" height={260}>
                                        <PieChart>
                                            <Pie
                                                data={graphsData?.alert || []}
                                                dataKey="value"
                                                nameKey="type"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={90}
                                                innerRadius={50} // makes it donut style (optional 🔥)
                                                paddingAngle={3}
                                            >
                                                {graphsData?.alert.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={alertColors[entry.type] || C.sky}
                                                    />
                                                ))}
                                            </Pie>

                                            <Tooltip
                                                formatter={(value, name) => [value, name.replace(/_/g, " ")]}
                                            />

                                            <Legend
                                                formatter={(value) => value.replace(/_/g, " ")}
                                                wrapperStyle={{ fontSize: 12 }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>

                                    {/* Total */}
                                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                                        <p className="text-xs text-slate-500">Total alerts</p>
                                        <p className="text-lg font-bold text-slate-800">
                                            {graphsData?.alert.reduce((s, a) => s + a.value, 0)}
                                        </p>
                                    </div>
                                </div>
                                // <div className="relative">
                                //     {isFetching && (
                                //         <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 rounded-lg">
                                //             <LoadingSpinner small />
                                //         </div>
                                //     )}
                                //     <div className="flex flex-col gap-2.5">
                                //         {graphsData.alert.map(a => {
                                //             const alertColors = {
                                //                 speeding: C.red,
                                //                 delay: C.amber,
                                //                 route_deviation: C.violet,
                                //                 long_stop: C.sky,
                                //             }
                                //             const max = Math.max(...graphsData.alert.map(x => x.value))
                                //             const pct = Math.round((a.value / max) * 100)
                                //             return (
                                //                 <div key={a.type}>
                                //                     <div className="flex items-center justify-between mb-1">
                                //                         <span className="text-xs text-slate-600 capitalize">
                                //                             {a.type.replace(/_/g, ' ')}
                                //                         </span>
                                //                         <span className="text-xs font-bold text-slate-800">{a.value}</span>
                                //                     </div>
                                //                     <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                //                         <div
                                //                             className="h-full rounded-full transition-all duration-700"
                                //                             style={{
                                //                                 width: `${pct}%`,
                                //                                 background: alertColors[a.type] || C.sky
                                //                             }}
                                //                         />
                                //                     </div>
                                //                 </div>
                                //             )
                                //         })}
                                //     </div>
                                //     <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                                //         <p className="text-xs text-slate-500">Total alerts</p>
                                //         <p className="text-lg font-bold text-slate-800">
                                //             {graphsData.alert.reduce((s, a) => s + a.value, 0)}
                                //         </p>
                                //     </div>
                                // </div>
                            ) : loadingGraphData ? (
                                <div className="h-60 flex items-center justify-center">
                                    <LoadingSpinner />
                                </div>
                            ) : (
                                <div className="h-60 flex items-center justify-center text-slate-500 text-sm">
                                    No alert data available
                                </div>
                            )}
                        </ChartCard>
                    </div>
                </section>
            </div>
        </section>
    )
}