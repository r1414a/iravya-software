import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

export default function EditUserDrawer({ open, setOpen, selectedUser }) {
    console.log(selectedUser);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {/* <SheetTrigger>Open</SheetTrigger> */}
            <SheetContent>
                <SheetHeader className="border-b border-gray-200">
                    <SheetTitle>Edit user</SheetTitle>
                    <SheetDescription>{selectedUser?.email}</SheetDescription>
                </SheetHeader>
                <div className="p-4">
                    <div className="flex gap-4 p-4 bg-gray-100 rounded-md items-center">
                        <div className="p-4 rounded-full bg-gold text-maroon">
                            <span className="text-lg">{selectedUser?.initials}</span></div>
                        <div>
                            <h2 className="text-xl">{selectedUser?.name}</h2>
                            <p className="text-muted-foreground">{selectedUser?.email}</p>
                            <div>
                                <span>{selectedUser?.role}</span>
                                <span>{selectedUser?.status}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </SheetContent>
        </Sheet>
    )
}