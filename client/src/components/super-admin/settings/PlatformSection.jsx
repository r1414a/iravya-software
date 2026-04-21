import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import {
    Select, SelectContent, SelectGroup,
    SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Radio, Cpu, ShieldCheck, Siren } from "lucide-react"
import { useSelector } from "react-redux"
import { selectUser } from "@/lib/features/auth/authSlice"
import { z } from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

function SectionBlock({ icon: Icon, title, children }) {
    return (
        <div className="mb-8 pb-8 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
            <div className="flex items-center gap-2 mb-4">
                <Icon size={14} className="text-maroon" />
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
            </div>
            {children}
        </div>
    )
}



export const platformSchema = z.object({
  store_radius: z
    .number({ invalid_type_error: "Must be a number" })
    .min(50, "Min 50m")
    .max(1000, "Max 1000m"),

  near_arrival: z
    .number()
    .min(1, "Min 1 km")
    .max(20, "Max 20 km"),

  speed_limit: z
    .number()
    .min(20, "Too low")
    .max(150, "Too high"),

  long_stop: z
    .number()
    .min(5, "Min 5 min")
    .max(120, "Max 120 min"),
});

export function PlatformSection() {
    const {platformSettings} = useSelector(selectUser)
    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        watch,
        formState: { errors, isSubmitSuccessful },
    } = useForm({
        resolver: zodResolver(platformSchema),
        defaultValues: {
            store_radius: platformSettings?.store_radius ?? 200,
            near_arrival: platformSettings?.near_arrival ?? 5,
            speed_limit: platformSettings?.speed_limit ?? 80,
            long_stop: platformSettings?.long_stop ?? 15,
        }
    })

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
                <h2 className="text-base font-semibold">Platform settings</h2>
                <p className="text-sm text-gray-500 mt-0.5">System-wide configuration — MQTT, GPS tracking, geofence and alert thresholds</p>
            </div>

            {/* MQTT */}
            {/* <SectionBlock icon={Radio} title="MQTT broker">
                <FieldGroup><FieldSet><FieldGroup>
                    <div className="flex gap-3">
                        <Field>
                            <FieldLabel>Broker host</FieldLabel>
                            <Input defaultValue="mqtt.fleettrack.in" className="font-mono placeholder:text-sm text-sm sm:text-md" placeholder="mqtt.yourdomain.com" />
                        </Field>
                        <Field>
                            <FieldLabel>Port</FieldLabel>
                            <Input defaultValue="8883" className="font-mono placeholder:text-sm text-sm sm:text-md" placeholder="8883" />
                        </Field>
                    </div>
                    <Field>
                        <FieldLabel>Topic prefix</FieldLabel>
                        <Input defaultValue="trucks" className="font-mono placeholder:text-sm text-sm sm:text-md" placeholder="trucks" />
                        <FieldDescription className="text-xs">
                            Devices publish to <span className="font-mono bg-gray-100 px-1 rounded text-xs">{"prefix/{deviceId}/location"}</span>
                        </FieldDescription>
                    </Field>
                </FieldGroup></FieldSet></FieldGroup>
            </SectionBlock> */}

            {/* GPS */}
            {/* <SectionBlock icon={Cpu} title="GPS tracking">
                <FieldGroup><FieldSet><FieldGroup>
                    <div className="flex gap-3">
                        <Field>
                            <FieldLabel>Ping interval (seconds)</FieldLabel>
                            <Input type="number" defaultValue="10" min="5" max="60" className="mt-4 sm:mt-0 placeholder:text-sm text-sm sm:text-md" />
                            <FieldDescription className="text-xs">Lower = more accurate, higher data cost</FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel>Offline threshold (minutes)</FieldLabel>
                            <Input type="number" defaultValue="2" min="1" max="10" className="placeholder:text-sm text-sm sm:text-md" />
                            <FieldDescription className="text-xs">Marked offline if no ping in this window</FieldDescription>
                        </Field>
                    </div>
                    <Field>
                        <FieldLabel>GPS data retention</FieldLabel>
                        <Select defaultValue="12">
                            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-white border shadow-md">
                                <SelectGroup>
                                    <SelectLabel>Retention period</SelectLabel>
                                    <SelectItem value="3">3 months</SelectItem>
                                    <SelectItem value="6">6 months</SelectItem>
                                    <SelectItem value="12">1 year</SelectItem>
                                    <SelectItem value="24">2 years</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <FieldDescription className="text-xs">Raw GPS points older than this are compressed and archived automatically</FieldDescription>
                    </Field>
                </FieldGroup></FieldSet></FieldGroup>
            </SectionBlock> */}

            <form onSubmit={handleSubmit(onSubmit, onError)}>

            {/* Geofence defaults */}
            <SectionBlock icon={ShieldCheck} title="Geofence defaults">
                <FieldGroup><FieldSet><FieldGroup>
                    <div className="flex gap-3">
                        <Field>
                            <FieldLabel>Default store radius (m)</FieldLabel>
                            <Input 
                                type="number" 
                                {...register("store_radius")} 
                                className="mt-4 sm:mt-0 placeholder:text-sm text-sm sm:text-md" 
                            />

                            {errors.store_radius && (
        <p className="text-xs text-red-500">{errors.store_radius.message}</p>
      )}
                        </Field>
                        <Field>
                            <FieldLabel>Near-arrival notification (km before store)</FieldLabel>
                            <Input 
                                type="number" 
                               {...register("near_arrival")} 
                                min="1" max="20" 
                            />
                            {errors.near_arrival && (
        <p className="text-xs text-red-500">{errors.near_arrival.message}</p>
      )}
                            <FieldDescription className="text-xs">Store manager gets a push notification when truck is within this distance</FieldDescription>
                        </Field>
                        {/* <Field>
                            <FieldLabel>Default DC radius (m)</FieldLabel>
                            <Input type="number" defaultValue="300" />
                        </Field> */}
                    </div>

                </FieldGroup></FieldSet></FieldGroup>
            </SectionBlock>

            {/* Alert thresholds */}
            <SectionBlock icon={Siren} title="Alert thresholds">
                <FieldGroup><FieldSet><FieldGroup>
                    <div className="flex gap-3">
                        <Field>
                            <FieldLabel>Speeding threshold (km/h)</FieldLabel>
                            <Input type="number" {...register("speed_limit")}  className="placeholder:text-sm text-sm sm:text-md" />
                            {errors.speed_limit && (
        <p className="text-xs text-red-500">{errors.speed_limit.message}</p>
      )}
                            <FieldDescription className="text-xs">Alert fires when truck exceeds this speed</FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel>Long stop threshold (minutes)</FieldLabel>
                            <Input type="number" {...register("long_stop")}  className="placeholder:text-sm text-sm sm:text-md" />
                            {errors.long_stop && (
        <p className="text-xs text-red-500">{errors.long_stop.message}</p>
      )}
                            <FieldDescription className="text-xs">Alert fires when truck is idle this long on a trip</FieldDescription>
                        </Field>
                    </div>
                    {/* <Field>
                        <FieldLabel>Device at store — pickup reminder (hours)</FieldLabel>
                        <Input type="number" defaultValue="24" className="placeholder:text-sm text-sm sm:text-md" />
                        <FieldDescription className="text-xs">Notify DC operator if a device sits at a store uncollected beyond this duration</FieldDescription>
                    </Field> */}
                </FieldGroup></FieldSet></FieldGroup>
            </SectionBlock>

            <div className="mt-6">
                <Button type="submit" className="bg-maroon hover:bg-maroon-dark text-white">Save platform settings</Button>
            </div>

            </form>
        </div>
    )
}