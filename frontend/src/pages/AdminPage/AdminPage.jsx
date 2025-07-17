import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Admin/AdminSidebar";
import Navbar from "../../components/Admin/AdminNavbar";
export default function AdminPage() {
  return (
    <>
<div className="flex">
      <Sidebar />
      <div className="flex-1 ml-20"> {/* ml-20 to account for sidebar width */}
        <Navbar /> {/* If you have a navbar */}
        <main className="p-6">
          <Outlet /> {/* This renders the nested route components */}
        </main>
      </div>
    </div>
    </>
  );
}
