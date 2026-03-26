import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const users = [
    { id:1,initials: 'RS', color: 'ua-teal', name: 'Rahul Sharma', email: 'rahul.sharma@westside.com', role: 'Brand manager', roleClass: 'rb-brand', brand: 'Tata Westside', scope: 'All DCs & Stores', lastLogin: '2h ago', loginDate: 'Today, 09:14 AM', since: 'Jan 2024', status: 'active' },
    { id:2,initials: 'PK', color: 'ua-purple', name: 'Priya Kulkarni', email: 'priya.k@zudio.com', role: 'DC operator', roleClass: 'rb-dc', brand: 'Zudio', scope: 'Pune Warehouse DC', lastLogin: '5h ago', loginDate: 'Today, 06:22 AM', since: 'Mar 2024', status: 'active' },
    { id:3,initials: 'AJ', color: 'ua-coral', name: 'Arjun Joshi', email: 'arjun.j@tatacliq.com', role: 'Store manager', roleClass: 'rb-store', brand: 'Tata Cliq', scope: 'Koregaon Park Store', lastLogin: 'Yesterday', loginDate: 'Mar 24, 03:10 PM', since: 'Nov 2023', status: 'active' },
    { id:4,initials: 'SM', color: 'ua-green', name: 'Sunita Mehta', email: 'sunita.m@westside.com', role: 'Brand manager', roleClass: 'rb-brand', brand: 'Tata Westside', scope: 'All DCs & Stores', lastLogin: '2 days ago', loginDate: 'Mar 23, 11:45 AM', since: 'Feb 2024', status: 'active' },
    { id:5,initials: 'VR', color: 'ua-amber', name: 'Vikram Rao', email: 'vikram.r@zudio.com', role: 'DC operator', roleClass: 'rb-dc', brand: 'Zudio', scope: 'Mumbai Warehouse DC', lastLogin: '3 days ago', loginDate: 'Mar 22, 09:30 AM', since: 'Dec 2023', status: 'active' },
    { id:6,initials: 'NP', color: 'ua-purple', name: 'Neha Patil', email: 'neha.p@tanishq.com', role: 'Store manager', roleClass: 'rb-store', brand: 'Tanishq', scope: 'Hinjawadi Store', lastLogin: '5 days ago', loginDate: 'Mar 20, 02:15 PM', since: 'Apr 2024', status: 'inactive' },
    { id:7,initials: 'KS', color: 'ua-teal', name: 'Kiran Sawant', email: 'kiran.s@tatacliq.com', role: 'DC operator', roleClass: 'rb-dc', brand: 'Tata Cliq', scope: 'Nashik DC', lastLogin: '1 week ago', loginDate: 'Mar 18, 10:00 AM', since: 'Feb 2023', status: 'active' },
    { id:8,initials: 'MA', color: 'ua-coral', name: 'Meera Agarwal', email: 'meera.a@westside.com', role: 'Store manager', roleClass: 'rb-store', brand: 'Tata Westside', scope: 'FC Road Store', lastLogin: 'Never', loginDate: '—', since: 'Mar 2026', status: 'pending' },
];

export default function UsersTable() {
    return (
        <section className="mt-6 max-w-400 mx-auto">
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-25">USERS</TableHead>
                            <TableHead>ROLE</TableHead>
                            <TableHead>BRAND</TableHead>
                            <TableHead>SCOPE</TableHead>
                            <TableHead>LAST LOGIN</TableHead>
                            <TableHead>STATUS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">
                                    <div className="flex gap-2 items-center">
                                        <div className="rounded-full p-1 bg-green-400 font-bold text-white">{user.initials}</div>
                                        <div>
                                            <p>{user.name}</p>
                                            <p>{user.email}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{user.brand}</TableCell>
                                <TableCell>{user.scope}</TableCell>
                                <TableCell>{user.lastLogin}</TableCell>
                                <TableCell>{user.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </section>
    )
}