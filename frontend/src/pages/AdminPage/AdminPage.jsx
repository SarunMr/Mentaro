import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Admin/AdminSidebar";
export default function AdminPage() {
  return (
    <>
      <div>
        <Sidebar />
        {<Outlet />}
      </div>
    </>
  );
}
