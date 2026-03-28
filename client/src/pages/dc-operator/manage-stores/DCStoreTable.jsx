import { useState, useMemo } from "react"
import { DataTable } from "./store-table/data-table"
import { columns } from "./store-table/columns"
import StoreDetailDrawer from "./StoreDetailDrawer"
import StoreFormModal from "./StoreFormModal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

// ── Seed data ──────────────────────────────────────────────────────────────
const INITIAL_STORES = [
    { id:"STR-001", name:"Koregaon Park Branch",  address:"Lane 5, North Main Rd",    city:"Pune",       state:"Maharashtra", pin:"411001", status:"active",   manager:"Anjali Mehta",   phone:"+91 98201 11001", email:"anjali@stores.in" },
    { id:"STR-002", name:"Baner Outlet",           address:"Baner-Pashan Link Rd",     city:"Pune",       state:"Maharashtra", pin:"411045", status:"active",   manager:"Rahul Deshmukh", phone:"+91 99703 22345", email:"rahul@stores.in"  },
    { id:"STR-003", name:"Viman Nagar Store",      address:"Phoenix Mall Complex",     city:"Pune",       state:"Maharashtra", pin:"411014", status:"inactive", manager:"Pooja Shinde",   phone:"+91 87654 00111", email:"pooja@stores.in"  },
    { id:"STR-004", name:"Dadar Central",          address:"Plot 12, Gokhale Rd",      city:"Mumbai",     state:"Maharashtra", pin:"400028", status:"active",   manager:"Nitin Pawar",    phone:"+91 93422 66789", email:"nitin@stores.in"  },
    { id:"STR-005", name:"Andheri West Hub",       address:"Lokhandwala Complex",      city:"Mumbai",     state:"Maharashtra", pin:"400058", status:"pending",  manager:"Sneha Kulkarni", phone:"+91 91670 33890", email:"sneha@stores.in"  },
    { id:"STR-006", name:"Connaught Place",        address:"Block A, Inner Circle",    city:"Delhi",      state:"Delhi",       pin:"110001", status:"active",   manager:"Arun Sharma",    phone:"+91 98117 44231", email:"arun@stores.in"   },
    { id:"STR-007", name:"Lajpat Nagar Outlet",   address:"Central Market, Block IV", city:"Delhi",      state:"Delhi",       pin:"110024", status:"active",   manager:"Meena Gupta",    phone:"+91 97114 55678", email:"meena@stores.in"  },
    { id:"STR-008", name:"Electronic City Store",  address:"Phase 1, Hosur Rd",        city:"Bengaluru",  state:"Karnataka",   pin:"560100", status:"active",   manager:"Kiran Reddy",    phone:"+91 80415 77001", email:"kiran@stores.in"  },
    { id:"STR-009", name:"Indiranagar Branch",     address:"100 Feet Road, HAL 2nd",   city:"Bengaluru",  state:"Karnataka",   pin:"560038", status:"inactive", manager:"Divya Rao",      phone:"+91 94482 66543", email:"divya@stores.in"  },
    { id:"STR-010", name:"T-Nagar Store",          address:"Usman Rd, Shop No 42",     city:"Chennai",    state:"Tamil Nadu",  pin:"600017", status:"pending",  manager:"Selvam Kumar",   phone:"+91 90032 88910", email:"selvam@stores.in" },
]

const STATUS_CYCLE = { active: "inactive", inactive: "pending", pending: "active" }

export default function StoresPage() {
    const [stores, setStores]             = useState(INITIAL_STORES)
    const [selectedStore, setSelectedStore] = useState(null)   // drawer
    const [editStore, setEditStore]         = useState(null)   // modal (null = closed, {} = add, store = edit)
    const [modalOpen, setModalOpen]         = useState(false)

    // ── Action handlers ────────────────────────────────────────────────────
    function handleToggleStatus(store) {
        setStores((prev) =>
            prev.map((s) =>
                s.id === store.id ? { ...s, status: STATUS_CYCLE[s.status] } : s
            )
        )
    }

    function handleDelete(store) {
        setStores((prev) => prev.filter((s) => s.id !== store.id))
    }

    function handleOpenEdit(store) {
        setEditStore(store)
        setModalOpen(true)
    }

    function handleOpenAdd() {
        setEditStore(null)
        setModalOpen(true)
    }

    function handleSave(form) {
        if (form.id) {
            // Edit existing
            setStores((prev) => prev.map((s) => (s.id === form.id ? { ...s, ...form } : s)))
        } else {
            // Add new — generate next ID
            const nextNum = stores.length + 1
            const newId = `STR-${String(nextNum).padStart(3, "0")}`
            setStores((prev) => [...prev, { ...form, id: newId }])
        }
    }

    // Inject action callbacks into each row via a virtual field
    // (same pattern used by many TanStack Table setups to avoid prop drilling)
    const tableData = useMemo(
        () =>
            stores.map((s) => ({
                ...s,
                _onView:         setSelectedStore,
                _onEdit:         handleOpenEdit,
                _onToggleStatus: handleToggleStatus,
                _onDelete:       handleDelete,
            })),
        [stores]
    )

    // ── Stats ──────────────────────────────────────────────────────────────
    const stats = useMemo(() => ({
        total:    stores.length,
        active:   stores.filter((s) => s.status === "active").length,
        inactive: stores.filter((s) => s.status === "inactive").length,
        pending:  stores.filter((s) => s.status === "pending").length,
    }), [stores])

    return (
        <div className="min-h-screen ">

            {/* ── Table ── */}
            <section className="mt-6 px-10 pb-10">
                <DataTable
                    columns={columns}
                    data={tableData}
                    onRowClick={(row) => setSelectedStore(row)}
                />
            </section>

            {/* ── Detail drawer ── */}
            <StoreDetailDrawer
                store={selectedStore}
                open={!!selectedStore}
                onClose={() => setSelectedStore(null)}
                onEdit={handleOpenEdit}
            />

            {/* ── Add / Edit modal ── */}
            <StoreFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                store={editStore}
                onSave={handleSave}
            />
        </div>
    )
}


// import { useState } from "react";

// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table"

// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetFooter,
// } from "@/components/ui/sheet"

// import {
//     Field,
//     FieldDescription,
//     FieldGroup,
//     FieldLabel,
//     FieldSet,
// } from "@/components/ui/field"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { BadgeAlert, Store } from 'lucide-react';


// const STORE_SEED = [
//   {
//     id: "s1",
//     name: "Pune FC Road Store",
//     city: "Pune",
//     address: "123 FC Road, Shivajinagar, Pune, Maharashtra 411005",
//     email: "fcroad@store.com",
//     contactNumber: "+91 9876543210"
//   },
//   {
//     id: "s2",
//     name: "Pune Koregaon Park Store",
//     city: "Pune",
//     address: "Lane 5, Koregaon Park, Pune, Maharashtra 411001",
//     email: "koregaon@store.com",
//     contactNumber: "+91 9876543211"
//   },
//   {
//     id: "s3",
//     name: "Mumbai Andheri Store",
//     city: "Mumbai",
//     address: "Andheri East, Mumbai, Maharashtra 400069",
//     email: "andheri@store.com",
//     contactNumber: "+91 9876543212"
//   },
//   {
//     id: "s4",
//     name: "Mumbai Lower Parel Store",
//     city: "Mumbai",
//     address: "Lower Parel, Mumbai, Maharashtra 400013",
//     email: "lowerparel@store.com",
//     contactNumber: "+91 9876543213"
//   },
//   {
//     id: "s5",
//     name: "Nashik Indira Nagar Store",
//     city: "Nashik",
//     address: "Indira Nagar, Nashik, Maharashtra 422009",
//     email: "nashik@store.com",
//     contactNumber: "+91 9876543214"
//   },
//   {
//     id: "s6",
//     name: "Nagpur Ashok Nagar Store",
//     city: "Nagpur",
//     address: "Ashok Nagar, Nagpur, Maharashtra 440022",
//     email: "nagpur@store.com",
//     contactNumber: "+91 9876543215"
//   }
// ]


// export default function DCStoreTable (){
//     const [open, setOpen] = useState(false)
//     const [selectedDevice, setSelectedDevice] = useState(null)

//     const handleAssign = (device) => {
//         setSelectedDevice(device)
//         setOpen(true)
//     }
//     return (
//         <>
//         <section className="mt-6 max-w-400 mx-auto px-10">
//             <div className="border rounded-lg">
//                 <Table>
//                     <TableHeader>
//                         <TableRow >
//                             <TableHead className="font-bold">Store Name</TableHead>
//                             <TableHead className="font-bold">Addres</TableHead>
//                             <TableHead className="font-bold">City</TableHead>
//                             <TableHead className="font-bold">Contact Details</TableHead>
//                             <TableHead className="font-bold">Edit</TableHead>
                            
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {STORE_SEED.map((store,i) => (
//                             <TableRow key={i}>
//                                 <TableCell>{store['name']}</TableCell>
//                                 <TableCell>{store['address']}</TableCell>
                                
//                                 <TableCell className="text-blue-600 mr-4">{store['city']}</TableCell>
                                
//                                 <TableCell>
//                                     <div className="flex flex-col">
                                        
//                                         <p className="text-green-600">+91 {store['contactNumber']}</p>
//                                         <p className="text-blue-600">{store['email']}</p>

//                                     </div>
                                    
//                                 </TableCell>
//                                 <TableCell
//                                     className="cursor-pointer "
                                    
//                                     >
//                                         <div>
//                                             <p onClick={() => handleAssign(store)}
//                                              className="text-maroon hover:underline">Edit Store</p>
                                            
//                                         </div>
//                                         </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </div>


//             {/* RIGHT SIDE FORM */}
//                 <Sheet open={open} onOpenChange={setOpen} className="">
//                     <SheetContent className="w-[420px] flex flex-col h-full">

//                     <SheetHeader className="border border-transparent border-b-gray-300">
//                         <SheetTitle>
//                             Edite Store
//                             <p className="text-sm text-gray-500">Edit store details</p>
//                         </SheetTitle>
//                     </SheetHeader>

//                     <div className="px-4 py-6 space-y-6 flex-1 overflow-y-auto">
//                         <FieldGroup>
//                             <FieldSet>
//                                 <FieldGroup>
//                                     <div className="flex gap-2">
//                                         <Field>
//                                             <FieldLabel htmlFor="f_name">Store Name</FieldLabel>
//                                             <Input id="f_name" type="text" placeholder="Name" />
//                                         </Field>
                                        
//                                     </div>
//                                     <Field>
//                                             <FieldLabel htmlFor="l_name">Address</FieldLabel>
//                                             <Textarea id="l_name" type="text" placeholder="Add address" />
//                                     </Field>

//                                     {/* <Field>
//                                             <FieldLabel htmlFor="l_name">Address</FieldLabel>
//                                             <Textarea id="l_name" type="text" placeholder="Add address" />
//                                     </Field> */}
//                                     <div className="flex gap-2">
//                                         <Field>
//                                                 <FieldLabel htmlFor="l_name">City</FieldLabel>
//                                                 <Input id="l_name" type="text" placeholder="Add city" />
//                                         </Field>
//                                         <Field>
//                                                 <FieldLabel htmlFor="l_name">State</FieldLabel>
//                                                 <Input id="l_name" type="text" placeholder="Add state" />
//                                         </Field>

//                                         <Field>
//                                                 <FieldLabel htmlFor="l_name">Country</FieldLabel>
//                                                 <Input id="l_name" type="text" placeholder="Add country" />
//                                         </Field>
//                                     </div>
//                                     <Field>
//                                             <FieldLabel htmlFor="f_name">Email</FieldLabel>
//                                             <Input id="f_name" type="text" placeholder="Email" />
//                                     </Field>

//                                     <Field>
//                                             <FieldLabel htmlFor="f_name">Contact Number</FieldLabel>
//                                             <Input id="f_name" type="text" placeholder="+91 XXXXX XXXXX" />
//                                         </Field>
                                                             

//                                 </FieldGroup>
//                             </FieldSet>
//                         </FieldGroup>
//                     </div>

//                 <div className=" border border-transparent border border-t-gray-300 bottom-2 mb-2">
//                     <SheetFooter className=" flex flex-row bottom-0">

//                         <Button className="w-[50%] bg-maroon hover:bg-maroon-dark cursor-pointer">
//                             Edit Store <Store />
//                         </Button>
//                         <Button className="w-[50%] cursor-pointer"
//                             variant="outline"
//                             onClick={() => setOpen(false)}
//                             >
//                             Cancel
//                         </Button>

                        
//                     </SheetFooter>
//                 </div>                
//                 </SheetContent>
//                 </Sheet>
//             </section>
//         </>
//     )
    
// }