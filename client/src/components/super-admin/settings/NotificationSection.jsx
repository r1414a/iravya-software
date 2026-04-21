import { Button } from "@/components/ui/button"
import { selectUser } from "@/lib/features/auth/authSlice"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import z from "zod"

const NOTIFICATION_GROUPS = [
    {
        group: "Trips",
        items: [
            { key: "trip_dispatched", label: "Trip dispatched", desc: "When a DC operator dispatches a new trip" },
            { key: "trip_completed", label: "Trip completed", desc: "When all stops on a trip are confirmed" },
            { key: "trip_cancelled", label: "Trip cancelled", desc: "When a trip is cancelled by an operator" },
        ],
    },
    {
        group: "Alerts",
        items: [
            { key: "speeding", label: "Speeding alert", desc: "When a truck exceeds the speed limit" },
            { key: "long_stop", label: "Long stop alert", desc: "Truck stopped for more than 15 minutes on a trip" },
            { key: "route_deviation", label: "Route deviation", desc: "When a truck deviates from its planned route" },
            { key: "geofence", label: "Geofence events", desc: "Truck enters or exits a store or DC geofence" },
        ],
    },
    // {
    //     group: "Devices",
    //     items: [
    //         { key: "device_offline",  label: "Device offline",   desc: "When a GPS device stops sending pings"             },
    //         { key: "device_at_store", label: "Device at store",  desc: "Device at store uncollected for more than 24h"     },
    //         { key: "device_low_batt", label: "Low battery",      desc: "Device battery drops below 20%"                   },
    //     ],
    // },
    {
        group: "System",
        items: [
            { key: "new_user", label: "New user", desc: "When a new user account is created" },
            { key: "platform_errors", label: "Platform errors", desc: "Critical system errors and MQTT broker issues" },
        ],
    },
]

function ToggleRow({ label, field, desc, register }) {
    return (
        <div className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
            <div className="flex-1 pr-6">
                <p className="text-sm font-medium text-gray-800">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </div>
            <input
                type="checkbox"
                {...register(`${field}`)}
                // checked={checked}
                // onChange={e => onChange(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-maroon cursor-pointer shrink-0"
            />
        </div>
    )
}

const notificationSchema = z.object({
    geofence: z.boolean().default(true),
    long_stop: z.boolean().default(true),
    new_user: z.boolean().default(true),
    platform_errors: z.boolean().default(true),
    route_deviation: z.boolean().default(true),
    speeding: z.boolean().default(true),
    trip_cancelled: z.boolean().default(true),
    trip_completed: z.boolean().default(true),
    trip_dispatched: z.boolean().default(true),
})

export function NotificationsSection() {
    const init = NOTIFICATION_GROUPS.flatMap(g => g.items).reduce((a, i) => ({ ...a, [i.key]: true }), {})
    console.log("settings", init);


    const { notifications } = useSelector(selectUser)
    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        watch,
        formState: { errors, isSubmitSuccessful },
    } = useForm({
        resolver: zodResolver(notificationSchema),
        defaultValues: {
            geofence: notifications.geofence || true,
            long_stop: notifications.long_stop || true,
            new_user: notifications.new_user || true,
            platform_errors: notifications.platform_errors || true,
            route_deviation: notifications.route_deviation || true,
            speeding: notifications.speeding || true,
            trip_cancelled: notifications.trip_cancelled || true,
            trip_completed: notifications.trip_completed || true,
            trip_dispatched: notifications.trip_dispatched || true,
        }
    })


    const [prefs, setPrefs] = useState(init)
    const toggle = (key, val) => setPrefs(p => ({ ...p, [key]: val }))

    const onSubmit = async (data) => {
        try {
            console.log(data);

        } catch (err) {
            console.error(err)
        }
    }

    const onError = (errors) => {
        console.log("FORM ERRORS:", errors);
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-base font-semibold">Notifications</h2>
                <p className="text-sm text-gray-500 mt-0.5">Choose which events send you an email or in-app alert</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit, onError)}>
                <div className="flex flex-col gap-6">
                    {NOTIFICATION_GROUPS.map(({ group, items }) => (
                        <div key={group}>
                            {/* Same xs uppercase tracking-wider section heading as drawers */}
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{group}</p>
                            <div className="bg-gray-50 border border-gray-100 rounded-lg px-4">
                                {items.map(item => (
                                    <ToggleRow
                                        key={item.key}
                                        label={item.label}
                                        desc={item.desc}
                                        field={item.key}
                                        register={register}
                                    />
                                ))}

                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6">
                    <Button type="submit" className="bg-maroon hover:bg-maroon-dark text-white">Save preferences</Button>
                </div>
            </form>
        </div>
    )
}