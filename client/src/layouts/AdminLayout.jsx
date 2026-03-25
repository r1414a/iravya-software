// layouts/AdminLayout.jsx
import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
    return (
        <div className="app-container">
            {/* <div className="flex">
                Sidebar
                <aside className="w-64 bg-primary text-white">
                    Sidebar
                </aside>

                Content
                <main className="flex-1">
                    <Outlet />
                </main>
            </div> */}

            {/* Navbar */}
            <nav className="p-4 bg-white shadow flex gap-4">
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/trucks">Trucks</Link>
        <Link to="/admin/devices">Devices</Link>
      </nav>

            {/* Page Content */}
            <main className="">
        <Outlet />
      </main>
        </div>
    );
}


{/* 
    <div className="flex">
  Sidebar
  <aside className="w-64 bg-primary text-white">
    Sidebar
  </aside>

  Content
  <main className="flex-1 p-6">
    <Outlet />
  </main>
</div> 
*/}