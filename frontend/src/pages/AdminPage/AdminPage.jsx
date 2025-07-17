import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Admin/AdminSidebar";
import Navbar from "../../components/Admin/AdminNavbar";
export default function AdminPage() {
  return (
    <>
      <div>
        <Navbar/>
        <Sidebar />
        {<Outlet />}
      </div>
    </>
  );
}
